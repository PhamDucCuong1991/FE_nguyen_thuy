<template>
  <div>
    <el-dialog
      :title="this.titleText"
      :visible.sync="dialogVisible"
      width="750px"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      top="10vh"
    >
      <el-form
        label-width="100px"
        :model="dataInput"
        label-position="left"
        :rules="rules"
        ref="dataInput"
      >
        <el-form-item label="Chọn tháng">
          <el-select
            style="width: 120px"
            v-model="dataInput.startMonth"
            @change="changeStartMonth()"
          >
            <el-option
              v-for="item in startMonthList"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
          -
          <el-select
            style="width: 120px; margin-right: 5px"
            v-model="dataInput.endMonth"
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
            v-model="dataInput.year"
            type="year"
            value-format="yyyy-MM-dd"
            format="yyyy"
          ></el-date-picker
        ></el-form-item>

        <el-form-item label="Chọn kiểu" style="width: 100%">
          <el-radio-group v-model="dataInput.type">
            <el-radio :label="true">Toàn bộ trường</el-radio>
            <el-radio :label="false">Theo lớp</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="dataInput.type == false" label="Chọn lớp">
          <el-select
            v-model="dataInput.idClass"
            filterable
            clearable
            style="width: 100%"
            placeholder="Chọn lớp"
          >
            <el-option
              v-for="item in listClass"
              :key="item.id"
              :label="item.className"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Trạng thái">
          <!-- chọn trạng thái -->
          <el-select
            class="button-left-status"
            v-model="dataInput.status"
            placeholder="Trạng thái"
            style="width: 100%"
            clearable
          >
            <el-option
              v-for="item in this.$funcData.getKidStatusAllList()"
              :key="item.key"
              :value="item.key"
              :label="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="danger" size="medium" @click="closeDialog()">
          <i class="el-icon-circle-close" />
          <span>{{ $t("button.close") }}</span>
        </el-button>

        <el-button
          v-if="this.checkExcel == 'false'"
          type="success"
          size="medium"
          :disabled="this.dataInput.status == ''"
          :loading="loadingButton"
          mini
          @click="submitForm()"
        >
          <i class="el-icon-circle-check" />
          <span>Xuất file</span>
        </el-button>
        <el-button
          v-else-if="this.checkExcel == 'true'"
          type="success"
          size="medium"
          :disabled="this.dataInput.status == ''"
          :loading="loadingButton"
          mini
          @click="submitFormTrue()"
        >
          <i class="el-icon-circle-check" />
          <span>Xuất file</span>
        </el-button>
        <el-button
          v-else-if="this.checkExcel == 'total'"
          type="success"
          size="medium"
          :disabled="this.dataInput.status == ''"
          :loading="loadingButton"
          mini
          @click="submitFormTotal()"
        >
          <i class="el-icon-circle-check" />
          <span>Xuất file</span>
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import MaClassService from "../../services/MaClassService";
import FinanceStatisticalService from "../../services/FinanceStatisticalService";
import moment from "moment";
const valMonthList = [
  { key: "01", value: "Tháng 01" },
  { key: "02", value: "Tháng 02" },
  { key: "03", value: "Tháng 03" },
  { key: "04", value: "Tháng 04" },
  { key: "05", value: "Tháng 05" },
  { key: "06", value: "Tháng 06" },
  { key: "07", value: "Tháng 07" },
  { key: "08", value: "Tháng 08" },
  { key: "09", value: "Tháng 09" },
  { key: "10", value: "Tháng 10" },
  { key: "11", value: "Tháng 11" },
  { key: "12", value: "Tháng 12" },
];
export default {
  components: {},
  props: {
    dialogVisible: null,
  },

  data() {
    return {
      titleText: "",
      checkExcel: "",
      listClass: [],
      startMonthList: valMonthList,
      endMonthList: valMonthList,
      dataInput: {
        startMonth: "",
        endMonth: "",
        year: "",
        status: "",
        idClass: "",
        type: "",
      },
      showCreateDialog: false,
      loadingButton: false,
      rules: {
        money: [
          {
            required: true,
            message: "Số tiền chi không được để trống",
            trigger: "blur",
          },
        ],
      },
      styleCols1: [],
      styleCols2: [],
    };
  },

  methods: {
    //reset when click x
    closeDialog() {
      this.dataInput.startMonth = "01";
      this.dataInput.endMonth = "12";
      this.$emit("dialog-close");
      setTimeout(() => {
        this.$refs["dataInput"].resetFields();
      }, 300);
    },
    getDataMonthFirst(typeCheck) {
      this.getClassInSchoolMethod();
      this.checkExcel=typeCheck;
      if (typeCheck == "false") {
        this.titleText =
          "Xuất danh sách thu chi tổng hợp của các học sinh chưa hoàn thành";
      }else if(typeCheck == "true"){
        this.titleText =
          "Xuất danh sách thu chi tổng hợp của các học sinh đã hoàn thành";
      }else if(typeCheck == "total"){
        this.titleText =
          "Xuất danh sách thu chi tổng hợp của các học sinh";
      }
      this.dataInput.year = moment(String(new Date())).format("YYYY-MM-DD");
      this.dataInput.startMonth = "01";
      this.dataInput.endMonth = "12";
      this.dataInput.status = "STUDYING";
      this.dataInput.type = true;
    },
    submitForm() {
      if (this.dataInput.type == true) {
        this.dataInput.idClass = "";
      }
      // let a = 1;
      (this.loadingButton = true),
        this.$confirm("Bạn có chắc chắn muốn xuất file không?", "Thông báo!", {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        })
          .then(() => {
            this.getStyleExcel();
            let myDate = moment(new Date()).format("DD-MM-YYYY hh:mm:ss");
            FinanceStatisticalService.getExportExcelKidPackageOrderFalseKids(
              this.dataInput.startMonth,
              this.dataInput.endMonth,
              this.dataInput.year,
              this.dataInput.idClass,
              this.dataInput.status
            )
              .then((resp) => {
                import("@/services/ExportExcel")
                  .then((excel) => {
                    let dataList = resp.data.data;
                    let fileName = `TONG_HOP_THU_CHI_HOC_SINH_CHUA_HOAN_THANH_${myDate}`;
                    const tHeader = [
                      "STT",
                      "Tên học sinh",
                      "Ngày sinh",
                      "Danh sách mã hóa đơn",
                      "Tổng phải thu - tổng phải chi",
                      "Tổng đã thu - tổng đã chi",
                      "Thu thêm",
                      "Trả lại",
                    ];
                    const filterVal = [
                      "pro1",
                      "pro2",
                      "pro3",
                      "pro4",
                      "pro5",
                      "pro6",
                      "pro7",
                      "pro8",
                    ];
                    let columnList = [
                      { col: 5 },
                      { col: 30 },
                      { col: 15 },
                      { col: 40 },
                      { col: 30 },
                      { col: 30 },
                      { col: 20 },
                      { col: 20 },
                    ];
                    excel.export_json_to_excel({
                      header: tHeader,
                      data: dataList,
                      title: filterVal,
                      filename: fileName,
                      columnsWidth: columnList,
                      styleCols1: this.styleCols1,
                      styleCols2: this.styleCols2,
                    });
                  })
                  .finally(() => {
                    this.styleCols1 = [];
                    this.styleCols2 = [];
                  });
              })
              .catch((err) => {
                console.log(err);
                this.$message({
                  message: err.response.data.message,
                  type: "error",
                });
              })
              .finally(() => {
                setTimeout(() => {
                  this.loadingButton = false;
                }, 500);
              });
          })
          .catch(() => {
            this.loadingButton = false;
          });
    },
    submitFormTrue() {
      if (this.dataInput.type == true) {
        this.dataInput.idClass = "";
      }
      // let a = 1;
      (this.loadingButton = true),
        this.$confirm("Bạn có chắc chắn muốn xuất file không?", "Thông báo!", {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        })
          .then(() => {
            this.getStyleExcel();
            let myDate = moment(new Date()).format("DD-MM-YYYY hh:mm:ss");
            FinanceStatisticalService.getExportExcelKidPackageOrderTrueKids(
              this.dataInput.startMonth,
              this.dataInput.endMonth,
              this.dataInput.year,
              this.dataInput.idClass,
              this.dataInput.status
            )
              .then((resp) => {
                import("@/services/ExportExcel")
                  .then((excel) => {
                    let dataList = resp.data.data;
                    let fileName = `TONG_HOP_THU_CHI_HOC_SINH_DA_HOAN_THANH_${myDate}`;
                    const tHeader = [
                      "STT",
                      "Tên học sinh",
                      "Ngày sinh",
                      "Danh sách mã hóa đơn",
                      "Đã thu - Đã chi",
                    ];
                    const filterVal = ["pro1", "pro2", "pro3", "pro4", "pro5"];
                    let columnList = [
                      { col: 5 },
                      { col: 30 },
                      { col: 15 },
                      { col: 40 },
                      { col: 30 },
                    ];
                    excel.export_json_to_excel({
                      header: tHeader,
                      data: dataList,
                      title: filterVal,
                      filename: fileName,
                      columnsWidth: columnList,
                      styleCols1: this.styleCols1,
                      styleCols2: this.styleCols2,
                    });
                  })
                  .finally(() => {
                    this.styleCols1 = [];
                    this.styleCols2 = [];
                  });
              })
              .catch((err) => {
                console.log(err);
                this.$message({
                  message: err.response.data.message,
                  type: "error",
                });
              })
              .finally(() => {
                setTimeout(() => {
                  this.loadingButton = false;
                }, 500);
              });
          })
          .catch(() => {
            this.loadingButton = false;
          });
    },
    submitFormTotal() {
      if (this.dataInput.type == true) {
        this.dataInput.idClass = "";
      }
      // let a = 1;
      (this.loadingButton = true),
        this.$confirm("Bạn có chắc chắn muốn xuất file không?", "Thông báo!", {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        })
          .then(() => {
            this.getStyleExcel();
            let myDate = moment(new Date()).format("DD-MM-YYYY hh:mm:ss");
            FinanceStatisticalService.getExportExcelKidPackageOrderKids(
              this.dataInput.startMonth,
              this.dataInput.endMonth,
              this.dataInput.year,
              this.dataInput.idClass,
              this.dataInput.status
            )
              .then((resp) => {
                import("@/services/ExportExcel")
                  .then((excel) => {
                    let dataList = resp.data.data;
                    let fileName = `TONG_HOP_THU_CHI_HOC_SINH_${myDate}`;
                    const tHeader = [
                      "STT",
                      "Tên học sinh",
                      "Ngày sinh",
                      "Danh sách mã hóa đơn",
                      "Tổng phải thu - tổng phải chi",
                      "Tổng đã thu - tổng đã chi",
                      "Thu thêm",
                      "Trả lại",
                    ];
                    const filterVal = [
                      "pro1",
                      "pro2",
                      "pro3",
                      "pro4",
                      "pro5",
                      "pro6",
                      "pro7",
                      "pro8",
                    ];
                    let columnList = [
                      { col: 5 },
                      { col: 30 },
                      { col: 15 },
                      { col: 40 },
                      { col: 30 },
                      { col: 30 },
                      { col: 20 },
                      { col: 20 },
                    ];
                    excel.export_json_to_excel({
                      header: tHeader,
                      data: dataList,
                      title: filterVal,
                      filename: fileName,
                      columnsWidth: columnList,
                      styleCols1: this.styleCols1,
                      styleCols2: this.styleCols2,
                    });
                  })
                  .finally(() => {
                    this.styleCols1 = [];
                    this.styleCols2 = [];
                  });
              })
              .catch((err) => {
                console.log(err);
                this.$message({
                  message: err.response.data.message,
                  type: "error",
                });
              })
              .finally(() => {
                setTimeout(() => {
                  this.loadingButton = false;
                }, 500);
              });
          })
          .catch(() => {
            this.loadingButton = false;
          });
    },
    //Style css Excel
    getStyleExcel() {
      let font = this.$styleExcel.fontTitle();
      let alignment = this.$styleExcel.alignmentTitle();
      let border = this.$styleExcel.borderTitle();

      let style1 = {
        name: "A5:H5",
        style: {
          fill: { fgColor: { rgb: "0089cb" } },
          font,
          alignment,
          border,
        },
      };
      let style2 = {
        name: "A6:H50",
        style: {
          fill: { fgColor: { rgb: "cfcfcf" } },
          font: { sz: 11 },
          alignment,
          border,
        },
      };

      let styleCol01 = {
        name: ["A1"],
        style: {
          font: { color: { rgb: "ff0000" }, bold: true, sz: "18" },
        },
      };
      let styleCol02 = {
        name: ["A2", "A3", "A4"],
        style: {
          font: { bold: true, sz: "11" },
        },
      };
      this.styleCols2.push(style1);
      this.styleCols2.push(style2);

      this.styleCols1.push(styleCol01);
      this.styleCols1.push(styleCol02);
    },
    changeStartMonth() {
      if (this.dataInput.startMonth > this.dataInput.endMonth) {
        this.dataInput.endMonth = "";
      }
      this.endMonthList = this.startMonthList.filter(
        (x) => x.key >= this.dataInput.startMonth
      );
    },
    getClassInSchoolMethod() {
      MaClassService.getAllClassCommon()
        .then((res) => {
          this.listClass = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
