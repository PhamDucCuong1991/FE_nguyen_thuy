<template>
  <div>
    <el-dialog
      :title="'Cập nhật nhanh các khoản cho lớp:  ' + className"
      :visible.sync="dialogVisible"
      width="95%"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      top="3vh"
    >
      <!-- chi tiết khoản các học sinh -->
      <el-table
        default-expand-all
        ref="kidsPackageForKidsRef"
        :data="responseDataList"
        :empty-text="textTable"
        v-loading="loadingData"
        :element-loading-text="$tableLoadding"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255,255,255, 0)"
        :cell-style="tableRowStyle"
        :header-cell-style="tableHeaderColor"
        @selection-change="handleSelectionChange"
        :max-height="$tableMaxHeight"
        border
      >
        <el-table-column type="expand" width="1">
          <template slot-scope="scope">
            <el-table
              v-if="scope.row.fnKidsPackageList.length > 0"
              style="border-radius: 0"
              ref="kidsPackageForKidsRef1"
              :data="scope.row.fnKidsPackageList"
              :empty-text="textTable"
              v-loading="loadingDataChildren"
              :element-loading-text="$tableLoadding"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(255,255,255, 0)"
              highlight-current-row
              :cell-style="tableRowStyleChildren"
              :header-cell-style="tableHeaderChidrenColor"
              @selection-change="handleSelectionChange"
              border
            >
              <el-table-column
                fixed
                type="index"
                label="STT"
                width="50"
                align="center"
              ></el-table-column>
              <el-table-column
                fixed
                label="Tên khoản"
                prop="fnPackage.name"
                min-width="140"
              ></el-table-column>
              <el-table-column
                fixed
                label="Trạng thái"
                align="center"
                width="95"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.approved">
                  <span v-if="scope.row.usedNumber ==0||(scope.row.paid == 0 && scope.row.money>0)">Chưa đóng</span>
                  <span v-else-if="scope.row.paid < scope.row.money">Thiếu</span>
                  <span v-else>Đủ</span>
                </span>
                </template></el-table-column
              >
              <el-table-column
                label="Đính kèm"
                align="center"
                width="90"
              >
                <template
                  v-if="scope.row.fnPackageKidsExtend != null"
                  slot-scope="scope"
                >
                  <el-tooltip
                    effect="dark"
                    :content="
                      'Khoản đính kèm: ' + scope.row.fnPackageKidsExtend.name
                    "
                    placement="top"
                  >
                    <i
                      class="el-icon-circle-check"
                      :style="
                        scope.row.fnPackageKidsExtend.active
                          ? 'margin-left: 10px; color: #409eff'
                          : 'margin-left: 10px; color: red'
                      "
                    />
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column align="center" label="Loại" min-width="70">
                <template slot-scope="scope">
                  <span v-if="scope.row.fnPackage.category == 'in'">Thu</span>
                  <span v-else-if="scope.row.fnPackage.category == 'out'"
                    >Chi</span
                  >
                </template>
              </el-table-column>
              <el-table-column align="right" label="Đơn giá" width="100">
                <template slot-scope="scope">
                  <span>
                    <span>{{ scope.row.price | formatCurrencyNew }}</span>
                  </span>
                </template>
              </el-table-column>
              <el-table-column align="right" label="Giảm giá" width="100">
                <template slot-scope="scope">
                  <span>
                    <span>{{
                      (scope.row.price - scope.row.discountPrice)
                        | formatCurrencyNew
                    }}</span>
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                align="right"
                label="Đơn giá sau giảm"
                min-width="120"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.discount">
                    <span>
                      {{ scope.row.discountPrice | formatCurrencyNew }}</span
                    >
                  </span>
                  <span v-else>
                    <span>{{ scope.row.price | formatCurrencyNew }}</span>
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                prop="calculateNumber"
                align="center"
                label="Số dự toán"
                min-width="90"
              ></el-table-column>
              <el-table-column
                prop="usedNumber"
                align="center"
                label="Số sử dụng"
                min-width="90"
              >
                <template slot-scope="scope">
                  <span
                    v-if="
                      scope.row.approved ||
                        scope.row.locked ||
                        !checkPermission(['fees_approved_useNumber'])
                    "
                    >{{ scope.row.usedNumber }}</span
                  >
                  <span v-else>
                    <el-input
                      type="number"
                      size="small"
                      style="width: 60px"
                      v-model="scope.row.usedNumber"
                      :min="0"
                      :max="10000"
                    ></el-input>
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                label="Tiền phải trả"
                align="right"
                min-width="120"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.money | formatCurrencyNew }}</span>
                  <el-tooltip
                    v-if="
                      scope.row.fnPackageKidsExtend != null &&
                        scope.row.fnPackageKidsExtend.active
                    "
                    effect="dark"
                    :content="
                      scope.row.moneyExtend > 0
                        ? 'Số tiền tăng: ' + scope.row.moneyExtend + ' đ'
                        : 'Số tiền giảm: ' + scope.row.moneyExtend + ' đ'
                    "
                    placement="top"
                  >
                    <i
                      v-if="scope.row.moneyExtend > 0"
                      class="el-icon-top"
                      style="color: #409eff; font-size: 18px"
                    />
                    <i
                      v-else-if="scope.row.moneyExtend < 0"
                      class="el-icon-bottom"
                      style="color: #f56c6c; font-size: 18px"
                    />
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column
                label="Tiền đã trả"
                align="right"
                min-width="110"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.paid | formatCurrencyNew }}</span>
                </template></el-table-column
              >
              <el-table-column
                fixed="right"
                min-width="65"
                align="center"
                label="Duyệt"
              >
                <template slot-scope="scope">
                  <el-checkbox
                    :disabled="
                      scope.row.showNumber == 0 ||
                      scope.row.price == 0 ||
                      scope.row.usedNumber != scope.row.showNumber ||
                      scope.row.locked ||
                      scope.row.paid > 0 ||
                      !checkPermission(['fees_approved_approved'])
                        ? true
                        : false
                    "
                    v-model="scope.row.approved"
                    @change="approvedKidsPackageOneMethod(scope.row)"
                  ></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column
                fixed="right"
                min-width="65"
                align="center"
                label="Khóa"
              >
                <template slot-scope="scope">
                  <el-checkbox
                    :disabled="!checkPermission(['fees_approved_locked'])"
                    v-model="scope.row.locked"
                    @change="lockedKidsPackageMethod(scope.row)"
                  ></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column
                label="Tác vụ"
                fixed="right"
                width="170"
                align="center"
              >
                <template slot-scope="scope">
                  <span
                    v-if="
                      scope.row.approved ||
                        scope.row.locked ||
                        scope.row.paid > 0 ||
                        scope.row.price == 0 ||
                        !checkPermission(['fees_approved_useNumber'])
                    "
                  >
                    <span v-if="scope.row.paid > 0">Không thể sửa</span>
                    <span v-else-if="scope.row.locked"
                      >Đã khóa, có thể sửa</span
                    >
                    <span v-else-if="scope.row.approved"
                      >Đã duyệt, có thể sửa</span
                    >
                    <span v-else-if="scope.row.price == 0">Đơn giá bằng 0</span>
                  </span>
                  <span v-else>
                    <el-button
                      v-if="scope.row.showNumber == scope.row.calculateNumber"
                      disabled
                      type="primary"
                      size="mini"
                      icon="el-icon-d-arrow-right"
                    >
                    </el-button>
                    <el-tooltip
                      v-else
                      effect="dark"
                      content="Sử dụng số dự toán"
                      placement="top"
                    >
                      <el-button
                        type="primary"
                        size="mini"
                        icon="el-icon-d-arrow-right"
                        @click="transferNumberOneMethod(scope.row)"
                      >
                      </el-button>
                    </el-tooltip>
                    <el-button
                      v-if="
                        scope.row.usedNumber != 0 &&
                          scope.row.usedNumber == scope.row.showNumber
                      "
                      disabled
                      size="mini"
                      type="success"
                      >Đã lưu</el-button
                    >
                    <el-button
                      v-else
                      size="mini"
                      type="success"
                      @click="saveUsedNumberOneMethod(scope.row)"
                      >Lưu số</el-button
                    >
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column
          type="selection"
          align="center"
          width="55"
        ></el-table-column>
        <el-table-column
          type="index"
          label="STT"
          width="50"
          align="center"
        ></el-table-column>
        <el-table-column
          min-width="200"
          prop="fullName"
          label="Họ tên"
        ></el-table-column>

        <el-table-column label="Ngày sinh" min-width="120" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.birthDay | formatDate }}</span>
          </template></el-table-column
        >
        <el-table-column align="right" width="130" label="Còn lại thu">
          <template slot-scope="scope">
            <span class="high-light">{{
              scope.row.totalMoneyRemainIn | formatCurrencyNew
            }}</span>
          </template>
        </el-table-column>
        <el-table-column align="right" width="130" label="Còn lại chi">
          <template slot-scope="scope">
            <span class="high-light">{{
              scope.row.totalMoneyRemainOut | formatCurrencyNew
            }}</span>
          </template></el-table-column
        >
        <el-table-column align="right" width="130" label="Tổng thu">
          <template slot-scope="scope">
            <span>{{ scope.row.totalMoneyIn | formatCurrencyNew }}</span>
          </template>
        </el-table-column>
        <el-table-column align="right" width="130" label="Tổng chi">
          <template slot-scope="scope">
            <span>{{ scope.row.totalMoneyOut | formatCurrencyNew }}</span>
          </template></el-table-column
        >
        <el-table-column
          align="center"
          prop="approvedNumber"
          width="100"
          label="Đã duyệt"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="lockedNumber"
          width="100"
          label="Đã khóa"
        ></el-table-column>
        <el-table-column label="Tác vụ" width="110" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.fnKidsPackageList.length > 0">
              <el-button
                v-if="!scope.row.expandRow"
                size="mini"
                type="primary"
                @click="toogleExpandDetailDate(scope.row)"
                >Thu nhỏ</el-button
              >
              <el-button
                v-else
                type="primary"
                size="mini"
                @click="toogleExpandDetailDate(scope.row)"
                >Mở rộng</el-button
              >
            </span>
          </template>
        </el-table-column>
      </el-table>

      <span slot="footer">
        <el-button
          v-if="checkPermission(['fees_approved_useNumber'])"
          type="success"
          class="button-bottom"
          @click="transferNumberManyMethod()"
        >
          Sử dụng số dự toán
        </el-button>
        <el-button
          v-if="checkPermission(['fees_approved_useNumber'])"
          type="success"
          class="button-bottom"
          @click="saveUseNumberManyMethod()"
        >
          Lưu số
        </el-button>
        <el-dropdown
          v-if="
            checkPermission(['fees_approved_approved']) ||
              checkPermission(['fees_approved_locked'])
          "
          @command="handleCommandMethod"
        >
          <el-button type="success" class="button-bottom">
            Tác vụ
            <i class="el-icon-caret-bottom" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-if="checkPermission(['fees_approved_approved'])"
              command="approvedCommand"
              >Duyệt</el-dropdown-item
            >
            <el-dropdown-item
              v-if="checkPermission(['fees_approved_approved'])"
              command="unApprovedCommand"
              >Bỏ duyệt</el-dropdown-item
            >
            <el-dropdown-item
              v-if="checkPermission(['fees_approved_locked'])"
              command="lockedCommand"
              >Khóa</el-dropdown-item
            >
            <el-dropdown-item
              v-if="checkPermission(['fees_approved_locked'])"
              command="unLockedCommand"
              >Bỏ khóa</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
        <el-button type="danger" class="button-bottom" @click="closeDialog()">
          <i class="el-icon-circle-close" />
          <span>{{ $t("button.close") }}</span>
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import FnFeesService from "@/services/FnFeesService";
import checkPermission from "@/utils/permission.js";

import moment from "moment";
import GradeService from "@/services/GradeService";
import MaClassService from "@/services/MaClassService";
const valkidStatusList = [
  { key: "STUDYING", value: "Đang học" },
  { key: "STUDY_WAIT", value: "Chờ học" },
  { key: "RESERVE", value: "Bảo lưu" },
  { key: "LEAVE_SCHOOL", value: "Nghỉ học" },
];
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      textTable: "",
      loadingData: true,
      className: "",
      idKidList: [],
      multipleSelection: [],
      loaddingButtonTab1: false,
      loaddingButtonTab2: false,
      responseDataList: [],
      responseTab2DataList: "",
      headerTab2List: [],
      responseTab1DataList: "",
      headerTab1List: [],
      responseClassList: [],
      responsePackageKidList: [],
      loaddingButton: false,
      gradeOfSchoolList: [],
      classOfGradeList: [],
      kidStatusList: valkidStatusList,
      nowDate: "",
      dataSearch: {},
    };
  },
  methods: {
    checkPermission,
    closeDialog() {
      this.$confirm("Bạn có chắc chắn đóng không?", "Thông báo!", {
        distinguishCancelAndClose: true,
        confirmButtonText: "Có",
        closeOnClickModal: false,
        cancelButtonText: "Không",
      }).then(() => {
        this.$emit("dialog-close");
        setTimeout(() => {
          this.responseDataList = [];
          this.loadingButton = false;
        }, 300);
      });
    },
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },
    tableHeaderChidrenColor() {
      return "background-color: #c0c4cc;color: #606266;";
    },
    tableRowStyle({ row }) {
      if (!row.expandRow && row.fnKidsPackageList.length > 0) {
        return "font-weight: bold";
      }
    },
    tableRowStyleChildren({ row }) {
      if(!row.approved){
        return "color: #409EFF";
      }else if (row.usedNumber ==0||(row.paid == 0 && row.money>0)) {
        return "color: #F14950";
      } else if (row.paid < row.money) {
        return "color: #E6A23C";
      }
    },
    handleCommandMethod(command) {
      if (command == "approvedCommand") {
        this.approvedKidsPackageManyMethod("duyệt", true);
      } else if (command == "unApprovedCommand") {
        this.approvedKidsPackageManyMethod("bỏ duyệt", false);
      } else if (command == "lockedCommand") {
        this.lockedKidsPackageManyMethod("khóa", true);
      } else if (command == "unLockedCommand") {
        this.lockedKidsPackageManyMethod("bỏ khóa", false);
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    toogleExpandDetailDate(row) {
      row.expandRow = !row.expandRow;
      let $kidsPackageForKidsRef = this.$refs.kidsPackageForKidsRef;
      $kidsPackageForKidsRef.toggleRowExpansion(row);
    },
    approvedRapidMethod() {},
    /**
     * duyệt/bỏ duyệt 1 khoản
     */
    approvedKidsPackageOneMethod(row) {
      FnFeesService.approvedKidsPackage(row)
        .then((resp) => {
          this.$message({
            message: resp.data.message,
            type: "success",
          });
          this.searchKidsPackageByProperties();
        })
        .catch((err) => {
          let messageText =
            err.response.status == 403
              ? this.$permissionDenied
              : err.response.data.message;
          this.$message({
            message: messageText,
            type: "error",
          });
          setTimeout(() => {
            row.approved = !row.approved;
          }, 100);
        });
    },
    /**
     * duyệt/bỏ khóa 1 khoản
     */
    lockedKidsPackageMethod(row) {
      FnFeesService.lockedKidsPackage(row)
        .then((resp) => {
          this.$message({
            message: resp.data.message,
            type: "success",
          });
          this.searchKidsPackageByProperties();
        })
        .catch((err) => {
          let messageText =
            err.response.status == 403
              ? this.$permissionDenied
              : err.response.data.message;
          this.$message({
            message: messageText,
            type: "error",
          });
          setTimeout(() => {
            row.locked = !row.locked;
          }, 100);
        });
    },
    checkBeforeSelectData() {
      let selectRowList = this.multipleSelection;
      if (selectRowList.length == 0) {
        this.$message({
          message: "Không có học sinh nào được chọn",
          type: "error",
        });
        throw null;
      }
    },
    /**
     * duyệt/hủy duyệt các khoản của các học sinh
     */
    approvedKidsPackageManyMethod(text, status) {
      this.checkBeforeSelectData();
      let selectRowList = this.multipleSelection;
      this.$confirm(
        "Bạn có chắc chắn muốn " +
          text +
          " cho " +
          selectRowList.length +
          " học sinh không?",
        "Thông báo!",
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      ).then(() => {
        this.loadingData = true;
        let dataInput = {
          status: status,
          kidsList: selectRowList,
        };
        FnFeesService.approvedKidsPackageMany(dataInput)
          .then((resp) => {
            this.$message({
              message: resp.data.message,
              type: "success",
            });
            this.searchKidsPackageByProperties();
          })
          .catch((err) => {
            let messageText =
              err.response.status == 403
                ? this.$permissionDenied
                : err.response.data.message;
            this.$message({
              message: messageText,
              type: "error",
            });
          })
          .finally(() => {
            this.loadingData = false;
          });
      });
    },
    /**
     * khóa/bỏ khóa các khoản của các học sinh
     */
    lockedKidsPackageManyMethod(text, status) {
      this.checkBeforeSelectData();
      let selectRowList = this.multipleSelection;
      this.$confirm(
        "Bạn có chắc chắn muốn " +
          text +
          " cho " +
          selectRowList.length +
          " học sinh không?",
        "Thông báo!",
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      ).then(() => {
        this.loadingData = true;
        let dataInput = {
          status: status,
          kidsList: selectRowList,
        };
        FnFeesService.lockvedKidsPackageMany(dataInput)
          .then((resp) => {
            this.$message({
              message: resp.data.message,
              type: "success",
            });
            this.searchKidsPackageByProperties();
          })
          .catch((err) => {
            let messageText =
              err.response.status == 403
                ? this.$permissionDenied
                : err.response.data.message;
            this.$message({
              message: messageText,
              type: "error",
            });
          })
          .finally(() => {
            this.loadingData = false;
          });
      });
    },

    /**
     * chuyển đổi số lượng tính toán sang số lượng sử dụng cho 1 khoản thu
     */
    transferNumberOneMethod(row) {
      FnFeesService.transferNumberOne(row)
        .then((resp) => {
          this.$message({
            message: resp.data.message,
            type: "success",
          });
          row.showNumber = row.calculateNumber;
          row.usedNumber = row.calculateNumber;
          this.searchKidsPackageByProperties();
        })
        .catch((err) => {
          let messageText =
            err.response.status == 403
              ? this.$permissionDenied
              : err.response.data.message;
          this.$message({
            message: messageText,
            type: "error",
          });
        });
    },
    /**
     * chuyển đổi số lượng tính toán sang số lượng sử dụng cho nhiều học sinh
     */
    transferNumberManyMethod() {
      this.checkBeforeSelectData();
      let selectRowList = this.multipleSelection;
      this.$confirm(
        "Bạn có chắc chắn muốn sử dụng số dự toán cho " +
          selectRowList.length +
          " học sinh không?",
        "Thông báo!",
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      ).then(() => {
        FnFeesService.transferNumberMany(selectRowList)
          .then((resp) => {
            this.$message({
              message: resp.data.message,
              type: "success",
            });
            this.searchKidsPackageByProperties();
          })
          .catch((err) => {
            let messageText =
              err.response.status == 403
                ? this.$permissionDenied
                : err.response.data.message;
            this.$message({
              message: messageText,
              type: "error",
            });
          });
      });
    },
    /**
     * lưu số lượng sử dụng thực tế
     */
    saveUsedNumberOneMethod(row) {
      FnFeesService.usedNumberKidsPackage(row)
        .then((resp) => {
          this.$message({
            message: resp.data.message,
            type: "success",
          });
          row.showNumber = row.usedNumber;
          this.searchKidsPackageByProperties();
        })
        .catch((err) => {
          let messageText =
            err.response.status == 403
              ? this.$permissionDenied
              : err.response.data.message;
          this.$message({
            message: messageText,
            type: "error",
          });
        });
    },
    /**
     *
     */
    saveUseNumberManyMethod() {
      this.checkBeforeSelectData();
      let selectRowList = this.multipleSelection;
      this.$confirm(
        "Bạn có chắc chắn lưu các số sử dụng đã nhập cho " +
          selectRowList.length +
          " học sinh không?",
        "Thông báo!",
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      ).then(() => {
        FnFeesService.usedNumberKidsPackageMany(selectRowList)
          .then((resp) => {
            this.$message({
              message: resp.data.message,
              type: "success",
            });
            this.searchKidsPackageByProperties();
          })
          .catch((err) => {
            let messageText =
              err.response.status == 403
                ? this.$permissionDenied
                : err.response.data.message;
            this.$message({
              message: messageText,
              type: "error",
            });
          });
      });
    },

    getCurrentDate() {
      let date = moment(String(new Date())).format("YYYY-MM-DD");
      this.dataSearch.date = date;
      //trước đây để check được sửa 2 tháng về trước
      // this.nowDate = moment(date).add(-1, "M").set("date", 1).format("YYYY-MM-DD");
    },
    /**
     * đối khối
     */
    async changeGradeSearch() {
      await this.getClassInGrade();
      this.searchKidsPackageByProperties();
    },

    /**
     * tìm tất cả các khối trong một trường
     */
    async getAllGrade() {
      await GradeService.getGradeInPrinciple()
        .then((resp) => {
          this.gradeOfSchoolList = resp.data.data;
          if (this.gradeOfSchoolList.length > 0) {
            this.dataSearch.idGrade = this.gradeOfSchoolList[0].id;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    /**
     * tìm tất cả lớp trong một khối
     */
    async getClassInGrade() {
      await MaClassService.getClassInGrade(this.dataSearch.idGrade)
        .then((resp) => {
          this.classOfGradeList = resp.data.data;
          if (this.classOfGradeList.length > 0) {
            this.dataSearch.idClass = this.classOfGradeList[0].id;
          } else {
            this.dataSearch.idClass = "";
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    /**
     * tìm kiếm tất cả khoản của các học sinh
     */
    searchKidsPackageByProperties() {
      this.textTable = "";
      this.loadingData = true;
      FnFeesService.searchPackageKidsForApproved(
        this.dataSearch.date,
        this.dataSearch.status,
        this.dataSearch.idClass,
        "",
        this.idKidList
      )
        .then((resp) => {
          this.responseDataList = resp.data.data;
        })
        .catch((err) => {
          let messageText =
            err.response.status == 403
              ? this.$permissionDenied
              : err.response.data.message;
          this.$message({
            message: messageText,
            type: "error",
          });
          this.responseDataList = [];
        })
        .finally(() => {
          if (this.responseDataList.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },
    getApprovedRapidInitial(dataSearch, className, idKidList) {
      this.dataSearch = dataSearch;
      this.className = className;
      this.idKidList = idKidList;
      this.searchKidsPackageByProperties();
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-tabs__nav {
  background: #a0a19ce0;
}
/deep/.el-tabs__item {
  color: white;
}
/deep/.el-tabs__item.is-active {
  color: white;
  background: #78a5e7;
}
/deep/.el-form-item__label {
  font-family: Arial, Helvetica, sans-serif;
}
/deep/.el-tabs__nav-scroll {
  float: right;
}
/deep/.el-tabs__header {
  margin-bottom: 0;
}
/deep/.el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
  border-bottom-color: #78a5e7;
}
/deep/.el-tabs--card > .el-tabs__header {
  border-bottom: none;
}
// /deep/.el-table .cell {
//   line-height: 15px;
// }
// /deep/.el-table th > .cell {
//   font-size: 13px;
// }
/deep/.el-checkbox__inner {
  border: 1px solid gray;
}
// /deep/.el-table td {
//   padding: 8px 0;
// }
// /deep/.el-table th {
//   padding: 12px 0;
// }
/deep/.el-icon-arrow-right:before {
  content: "";
}
.input-common {
  margin-right: 5px;
}
.button-bottom {
  border-radius: 4px !important;
  margin-left: 5px;
}
.button-click {
  float: right;
  margin: 20px 0 40px 0;
}
.el-dropdown-menu {
  position: absolute;
  top: 0;
  left: 0;
  padding: 0 0;
  margin: 3px 0;
  background-color: #5fb44a;
  border: 1px solid #ebeef5;
  border-radius: 0;
  box-shadow: 0 2px 12px 0 #0000001a;
}
.el-dropdown-menu li {
  color: white;
  border-top: 1px solid white;
  font-family: Arial, Helvetica, sans-serif;
}
.over-table {
  width: 97%;
  margin: 0 auto;
}
.table-data {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ebeef5;

  // display: inline-block;
}
.wrapper-table {
  height: 600px;
  overflow-y: scroll;
  border-bottom: 1px solid #ebeef5;
}
/deep/input::-webkit-outer-spin-button,
/deep/input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
/deep/.el-input--small .el-input__inner {
  text-align: center;
}
thead {
  background: #78a5e7;
  color: white;
  font-weight: bold;
}
tbody {
  color: #606266;
  font-size: 14px;
  overflow: auto;
  font-family: Arial, Helvetica, sans-serif;
}
// td {
//   padding: 12px;
// }
.table-index {
  width: 10px;
  text-align: center;
}
.table-item-name {
  width: 200px;
  text-align: center;
}
.table-action {
  width: 200px;
  text-align: center;
}
.color-text-reply {
  color: #4177e2;
}
.input-data {
  width: 60%;
}
.disable-row {
  background: #e4e7ed;
}
.high-light {
  color: blue;
  font-weight: bold;
}
</style>
