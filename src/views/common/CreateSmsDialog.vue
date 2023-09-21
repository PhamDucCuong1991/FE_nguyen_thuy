<template>
  <div>
    <el-dialog
      :title="
        useType == 'student'
          ? 'Gửi thông báo Sms cho học sinh'
          : 'Gửi thông báo Sms cho nhân sự'
      "
      :visible.sync="dialogVisible"
      width="1200px"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      top="3vh"
    >
      <el-form
        label-width="110px"
        :model="dataInput"
        label-position="left"
        :rules="rules"
        ref="dataInput"
      >
        <el-form-item
          label="Hẹn giờ gửi"
          prop="timer"
          style="display: inline-block; width: 25%"
        >
          <el-radio-group
            v-model="dataInput.timer"
            @change="changeStatusSend()"
          >
            <el-radio :label="false">Gửi ngay</el-radio>
            <el-radio :label="true">Hẹn giờ</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="dateTime" style="display: inline-block; width: 40%">
          <el-date-picker
            v-if="dataInput.timer"
            v-model="dataInput.dateTime"
            format="HH:mm dd-MM-yyyy "
            value-format="yyyy-MM-dd HH:mm"
            type="datetime"
            placeholder="Chọn giờ gửi"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="Nhập nội dung"
          style="display: inline-block; width: 49%"
          prop="sendContent"
        >
          <el-input
            type="textarea"
            :rows="10"
            maxlength="500"
            show-word-limit
            v-model="dataInput.sendContent"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="Hiện thị"
          prop="sendContent"
          style="float: right; width: 49%"
        >
          <el-input
            disabled
            type="textarea"
            :rows="10"
            maxlength="500"
            show-word-limit
            v-model="textShow"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" size="medium" @click="closeDialog()">
          <i class="el-icon-circle-close" />
          <span>{{ $t("button.close") }}</span>
        </el-button>
        <el-button
          type="success"
          size="medium"
          :loading="loadingButton"
          mini
          @click="submitForm()"
        >
          <i class="el-icon-circle-check" />
          <span>Gửi</span>
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import StudentService from "@/services/StudentService";
import EmployeeDataService from "@/services/EmployeeDataService";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      textTable: this.$tableEmpty,
      responseList: [],
      loadingButton: false,
      showOrderKidsAllDialog: false,
      dataInput: {
        type: "",
        idList: [],
        sendContent: "",
        dateTime: null,
        timer: false,
      },
      textShow: "",
      useType: "",
      dataSearch: {
        fullName: "",
      },
      rules: {
        timer: [
          {
            required: true,
            message: "Thông tin không được để trống",
            trigger: "change",
          },
        ],
        sendContent: [
          {
            required: true,
            message: "Thông tin không được để trống",
            trigger: "change",
          },
        ],
      },
    };
  },
  watch: {
    changeContentComputed() {
      this.textShow = this.$funcCommon.removeAccent(this.dataInput.sendContent);
    },
  },
  computed: {
    changeContentComputed() {
      return this.dataInput.sendContent;
    },
  },
  methods: {
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },
    closeDialog() {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.textShow = "";
        this.$refs["dataInput"].resetFields();
      }, 300);
    },
    closeOrderKidsAllDialog() {
      this.showOrderKidsAllDialog = false;
    },
    orderKidsAllMethod(row) {
      this.showOrderKidsAllDialog = true;
      this.$refs.OrderKidsAllDialog.getOrderKidsAllInitial(row);
    },
    changeStatusSend() {
      if (!this.dataInput.timer) {
        this.dataInput.dateTime = null;
      }
    },
    sendSmsToKids() {
      StudentService.createStudentSms(this.dataInput)
        .then((resp) => {
          this.$message({
            message: resp.data.message,
            type: "success",
          });
          setTimeout(() => {
            this.closeDialog();
          }, 500);
        })
        .catch((err) => {
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
    },
    sendSmsToEmployee() {
      EmployeeDataService.createEmployeeSms(this.dataInput)
        .then((resp) => {
          this.$message({
            message: resp.data.message,
            type: "success",
          });
          setTimeout(() => {
            this.closeDialog();
          }, 500);
        })
        .catch((err) => {
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
    },
    submitForm() {
      this.$refs["dataInput"].validate((valid) => {
        if (valid) {
          if (this.dataInput.timer) {
            if (this.dataInput.dateTime == null) {
              this.$message({
                message: "Chọn giờ gửi",
                type: "error",
              });
              throw null;
            }
          }
          this.loadingButton = true;
          if (this.useType == "student") {
            this.sendSmsToKids();
          } else if (this.useType == "employee") {
            this.sendSmsToEmployee();
          }
        }
      });
    },

    getDataCreateSmsInitial(idList, type, useType) {
      this.useType = useType;
      this.dataInput.type = type;
      this.dataInput.idList = idList;
    },
  },
};
</script>

<style lang="scss" scoped>
.input-common {
  margin-right: 5px;
}
</style>
