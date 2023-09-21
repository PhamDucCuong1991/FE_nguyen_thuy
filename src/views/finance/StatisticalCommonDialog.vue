<template>
  <div>
    <el-dialog
      title="Thống kê thu, chi học phí"
      :visible.sync="dialogVisible"
      width="900px"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      top="3vh"
    >
      <div style="margin-bottom: 15px; position: relative; z-index: 1">
        Chọn thời gian
        <el-select
          style="width: 120px; margin-left: 50px; margin-right: 5px"
          v-model="dataSearch.startMonth"
          @change="changeMonthMethod()"
        >
          <el-option
            v-for="item in startMonthList"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          ></el-option>
        </el-select>
        <el-select
          style="width: 120px; margin-right: 5px"
          v-model="dataSearch.endMonth"
          @change="changeMonthMethod()"
        >
          <el-option
            v-for="item in endMonthList"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          ></el-option>
        </el-select>
        <el-date-picker
          style="width: 100px"
          class="input-common"
          :clearable="false"
          @change="searchByProperties()"
          v-model="dataSearch.year"
          type="year"
          value-format="yyyy-MM-dd"
          format="yyyy"
        ></el-date-picker>
        <br />
        <br />
        <spinner-custom v-if="showSpinner" />
        <span v-else>
          <div style="margin: 0 auto">
            <div>
              <el-row :gutter="20">
                <el-col :span="4" style="padding: 10px 10px"
                  ><div>Khoản thu</div></el-col
                >
                <el-col :span="6" class="row-header row1-background"
                  ><div>Tổng phải thu</div></el-col
                >
                <el-col :span="6" class="row-header row1-background"
                  ><div>Tổng đã thu</div></el-col
                >
                <el-col :span="6" class="row-header row1-background"
                  ><div>Còn lại phải thu</div></el-col
                >
              </el-row>
              <el-row :gutter="20">
                <el-col :span="6" class="row11 align-row">
                  <div>{{ responseData.moneyTotalIn | formatCurrencyNew }}</div>
                </el-col>
                <el-col :span="6" class="row11">
                  <div>
                    {{ responseData.moneyTotalPaidIn | formatCurrencyNew }}
                  </div>
                </el-col>
                <el-col :span="6" class="row11">
                  <div>
                    {{ responseData.moneyTotalRemainIn | formatCurrencyNew }}
                  </div>
                </el-col>
              </el-row>
            </div>
            <br />
            <div>
              <el-row :gutter="20">
                <el-col :span="4" style="padding: 10px 10px"
                  ><div>Khoản chi</div></el-col
                >
                <el-col :span="6" class="row-header row2-background"
                  ><div>Tổng phải chi</div></el-col
                >
                <el-col :span="6" class="row-header row2-background"
                  ><div>Tổng đã chi</div></el-col
                >
                <el-col :span="6" class="row-header row2-background"
                  ><div>Còn lại phải chi</div></el-col
                >
              </el-row>
              <el-row :gutter="20">
                <el-col :span="6" class="row11 align-row">
                  <div>
                    {{ responseData.moneyTotalOut | formatCurrencyNew }}
                  </div>
                </el-col>
                <el-col :span="6" class="row11">
                  <div>
                    {{ responseData.moneyTotalPaidOut | formatCurrencyNew }}
                  </div>
                </el-col>
                <el-col :span="6" class="row11">
                  <div>
                    {{ responseData.moneyTotalRemainOut | formatCurrencyNew }}
                  </div>
                </el-col>
              </el-row>
            </div>
            <br />
            <div>
              <el-row :gutter="20">
                <el-col :span="4" style="padding: 10px 10px"
                  ><div>Tổng hợp</div></el-col
                >
                <el-col :span="6" class="row-header row3-background"
                  ><div>Tổng thu - Tổng chi</div></el-col
                >
                <el-col :span="6" class="row-header row3-background"
                  ><div>Đã thu - Đã chi</div></el-col
                >
                <el-col :span="6" class="row-header row3-background"
                  ><div>Còn lại phải thu</div></el-col
                >
              </el-row>
              <el-row :gutter="20">
                <el-col :span="6" class="row11 align-row">
                  <div>
                    {{ responseData.moneyTotalInOut | formatCurrencyNew }}
                  </div>
                </el-col>
                <el-col :span="6" class="row11">
                  <div>
                    {{ responseData.moneyTotalInOutPaid | formatCurrencyNew }}
                  </div>
                </el-col>
                <el-col :span="6" class="row11">
                  <div>
                    {{ responseData.moneyTotalInOutRemain | formatCurrencyNew }}
                  </div>
                </el-col>
              </el-row>
            </div>
            <br />
            <div>
              <el-row :gutter="20">
                <el-col :span="4" style="padding: 10px 10px"
                  ><div>Thống kê</div></el-col
                >
                <el-col :span="9"
                  ><el-button
                    type="primary"
                    style="width: 100%"
                    :disabled="responseData.kidsNumber == 0"
                    @click="centerDialogVisible = true"
                  >
                    Số học sinh chưa hoàn thành hóa đơn:
                    {{ responseData.kidsNumber }}
                  </el-button>
                </el-col>
                <el-col :span="9"
                  ><el-button
                    type="primary"
                    style="width: 100%"
                    :disabled="responseData.orderNumber == 0"
                    @click="showOrderListMethod()"
                  >
                    Số hóa đơn chưa hoàn thành: {{ responseData.orderNumber }}
                  </el-button>
                </el-col>
              </el-row>
            </div>
            <br />
            <div>
              <el-row :gutter="20">
                <el-col :span="4" style="padding: 10px 10px"
                  >Xuất dữ liệu</el-col
                >
                <div>
                  1. Xuất danh sách các học sinh có hóa đơn chưa hoàn thành:
                  <el-button
                    type="text"
                    style="text-decoration: underline"
                    @click="exportFileMethod('exOrder')"
                    >Xuất file</el-button
                  >
                </div>
                <div class="align-row">
                  2. Xuất danh sách các học sinh chưa hoàn thành các khoản thu:
                  <el-button
                    type="text"
                    style="text-decoration: underline"
                    @click="exportFileMethod('exIn')"
                    >Xuất file</el-button
                  >
                </div>
                <div class="align-row">
                  3. Xuất danh sách các học sinh chưa hoàn thành các khoản chi:
                  <el-button
                    type="text"
                    style="text-decoration: underline"
                    @click="exportFileMethod('exOut')"
                    >Xuất file</el-button
                  >
                </div>
                <div class="align-row">
                  4. Xuất danh sách thu chi tổng hợp của các học sinh chưa hoàn
                  thành:
                  <el-button
                    type="text"
                    style="text-decoration: underline"
                    @click="exportFileMethod('exInOut')"
                    >Xuất file</el-button
                  >
                </div>
                <div class="align-row">
                  5. Xuất danh sách thu chi tổng hợp của các học sinh đã hoàn
                  thành:
                  <el-button
                    type="text"
                    style="text-decoration: underline"
                    @click="exportFileMethod('exInOutTrue')"
                    >Xuất file</el-button
                  >
                </div>
                <div class="align-row">
                  6. Xuất danh sách thu chi tổng hợp của các học sinh:
                  <el-button
                    type="text"
                    style="text-decoration: underline"
                    @click="exportFileMethod('exInOutTotal')"
                    >Xuất file</el-button
                  >
                </div>
              </el-row>
            </div>
          </div>
        </span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" size="medium" @click="closeDialog()">
          <i class="el-icon-circle-close" />
          <span>{{ $t("button.close") }}</span>
        </el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="Danh sách học sinh chưa hoàn thành khoản thu"
      :visible.sync="centerDialogVisible"
      width="600px"
    >
      <el-table
        ref="multipleTable"
        :empty-text="textTable"
        highlight-current-row
        :data="responseData.kidsNumberList"
        :cell-style="tableRowStyle"
        :header-cell-style="$funcCommon.tableHeaderColorFunction"
        :max-height="$tableMaxHeightSmall"
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
        <el-table-column label="Học sinh" prop="fullName">
        </el-table-column>
        <el-table-column label="Lớp" prop="maClass.className">
        </el-table-column>
        <el-table-column label="Ngày sinh" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.birthDay | formatDate }}</span>
          </template></el-table-column
        >
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="centerDialogVisible = false"
          type="danger"
          size="medium"
          >Đóng</el-button
        >
      </span>
    </el-dialog>

    <ExportExcelKidPackage
      :dialogVisible="showExcelDialog"
      @dialog-close="dialogCloseExcelMethod()"
      ref="ExportExcelKidPackage"
    />

    <ExportExcelKidPackageOut
      :dialogVisible="showExcelOutDialog"
      @dialog-close="dialogCloseExceOutMethod()"
      ref="ExportExcelKidPackageOut"
    />

    <ExportExcelKidPackageInAndOut
      :dialogVisible="showExcelInOutDialog"
      @dialog-close="dialogCloseExceInOutMethod()"
      ref="ExportExcelKidPackageInAndOut"
    />

    <ExportExcelKidPackageOrderKids
      :dialogVisible="showExcelOrderDialog"
      @dialog-close="dialogCloseExceOderMethod()"
      ref="ExportExcelKidPackageOrderKids"
    />
    <OrderKidsListDialog
      :dialogVisible="showOrderKidsListDialog"
      @dialog-close="dialogOrderKidsListDialog()"
      ref="OrderKidsListDialog"
    />
  </div>
</template>

<script>
import FnFeesService from "@/services/FnFeesService";
import ExportExcelKidPackage from "./ExportExcelKidPackage.vue";
import ExportExcelKidPackageOut from "./ExportExcelKidPackageOut.vue";
import ExportExcelKidPackageInAndOut from "./ExportExcelKidPackageInAndOut.vue";
import ExportExcelKidPackageOrderKids from "./ExportExcelKidPackageOrderKids.vue";
import OrderKidsListDialog from "./OrderKidsListDialog.vue";
import moment from "moment";
export default {
  props: {
    dialogVisible: null,
  },
  components: {
    ExportExcelKidPackage,
    ExportExcelKidPackageOut,
    ExportExcelKidPackageInAndOut,
    ExportExcelKidPackageOrderKids,
    OrderKidsListDialog,
  },
  data() {
    return {
      textTable: "",
      idKid: "",
      fullName: "",
      showSpinner: true,
      startMonthList: [],
      endMonthList: [],
      monthList: [],
      dataSearch: {
        year: "",
        startMonth: "",
        endMonth: "",
      },
      responseData: {},
      loadingButton: false,
      showExcelDialog: false,
      showExcelOutDialog: false,
      showExcelInOutDialog: false,
      showExcelOrderDialog: false,
      showOrderKidsListDialog: false,
      centerDialogVisible: false,
    };
  },
  methods: {
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },
    closeDialog() {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.showSpinner = true;
        this.loadingButton = false;
      }, 300);
    },
    exportFileMethod(type) {
      if (type == "exIn") {
        this.showExcelDialog = true;
        this.$refs.ExportExcelKidPackage.getDataMonthFirst();
      } else if (type == "exOut") {
        this.showExcelOutDialog = true;
        this.$refs.ExportExcelKidPackageOut.getDataMonthFirst();
      } else if (type == "exOrder") {
        this.showExcelInOutDialog = true;
        this.$refs.ExportExcelKidPackageInAndOut.getDataMonthFirst();
      } else if (type == "exInOut") {
        this.showExcelOrderDialog = true;
        this.$refs.ExportExcelKidPackageOrderKids.getDataMonthFirst("false");
      } else if (type == "exInOutTrue") {
        this.showExcelOrderDialog = true;
        this.$refs.ExportExcelKidPackageOrderKids.getDataMonthFirst("true");
      } else if (type == "exInOutTotal") {
        this.showExcelOrderDialog = true;
        this.$refs.ExportExcelKidPackageOrderKids.getDataMonthFirst("total");
      }
    },
    changeMonthMethod() {
      this.startMonthList = this.monthList.filter(
        (x) => x.key <= this.dataSearch.endMonth
      );
      this.endMonthList = this.monthList.filter(
        (x) => x.key >= this.dataSearch.startMonth
      );
      this.searchByProperties();
    },
    dialogCloseExcelMethod() {
      this.showExcelDialog = false;
      this.searchByProperties();
    },
    dialogCloseExceOutMethod() {
      this.showExcelOutDialog = false;
      this.searchByProperties();
    },
    dialogCloseExceInOutMethod() {
      this.showExcelInOutDialog = false;
      this.searchByProperties();
    },
    dialogCloseExceOderMethod() {
      this.showExcelOrderDialog = false;
      this.searchByProperties();
    },
    dialogOrderKidsListDialog() {
      this.showOrderKidsListDialog = false;
      this.searchByProperties();
    },
    showOrderListMethod() {
      this.showOrderKidsListDialog = true;
      this.$refs.OrderKidsListDialog.searchByProperties();
    },

    searchByProperties() {
      this.showSpinner = true;
      FnFeesService.statisticalCommon(
        moment(this.dataSearch.year).year(),
        this.dataSearch.startMonth,
        this.dataSearch.endMonth
      )
        .then((resp) => {
          this.responseData = resp.data.data;
          this.showSpinner = false;
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
    getStatisticalCommonInitial() {
      this.dataSearch.year = moment(String(new Date())).format("YYYY-MM-DD");
      this.dataSearch.startMonth = "01";
      this.dataSearch.endMonth = "12";
      this.startMonthList = this.$funcData.getMonthAllList();
      this.endMonthList = this.$funcData.getMonthAllList();
      this.monthList = this.$funcData.getMonthAllList();
      this.searchByProperties();
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-dialog__title {
  font-size: 25px;
  color: #606266;
}
/deep/.el-form-item__label {
  font-family: Arial, Helvetica, sans-serif;
}
/deep/.el-form-item.is-required:not(.is-no-asterisk)
  > .el-form-item__label:before {
  content: "";
  color: #f56c6c;
  margin-left: -4px;
}
/deep/.el-form-item.is-required:not(.is-no-asterisk)
  > .el-form-item__label:after {
  content: "*";
  color: #f56c6c;
  margin-left: 3px;
}
/deep/.el-dialog__body {
  padding-bottom: 5px;
}
.input-common {
  margin-right: 5px;
}
.row-header {
  padding: 10px 0;
  margin-right: 1px;
  text-align: center;
  font-weight: bold;
  color: white;
  font-size: 16px;
}

.row11 {
  background: #cad8c4;
  padding: 10px 0;
  margin-right: 1px;
  text-align: center;
  font-weight: bold;
}
.row1-background {
  background: #67c23a;
}
.row2-background {
  background: #e6a23c;
}
.row3-background {
  background: #409eff;
}
.row4-background {
  background: #23b962;
}
.align-row {
  margin-left: 147px;
}
</style>
