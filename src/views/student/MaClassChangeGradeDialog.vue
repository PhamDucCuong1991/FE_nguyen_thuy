<template>
  <el-dialog
    title="Đổi khối cho lớp"
    :visible.sync="dialogVisible"
    width="550px"
    :before-close="closeDialogByButton"
    :close-on-click-modal="false"
  >
    <el-form
      label-width="110px"
      :model="dataInput"
      label-position="left"
      :rules="rules"
      ref="dataInput"
    >
      <el-form-item label="Tên khối">
        <span> {{ dataInput.gradeName }}</span>
      </el-form-item>
      <el-form-item label="Tên lớp">
        <span> {{ dataInput.className }}</span>
      </el-form-item>
      <el-form-item label="Chọn khối" prop="idGrade">
        <el-select
          class="select-grade"
          v-model="dataInput.idGrade"
          placeholder="Chọn khối"
        >
          <el-option
            v-for="item in gradeList"
            :key="item.id"
            :value="item.id"
            :label="item.gradeName"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="danger" size="medium" @click="closeDialogByButton()">
        <i class="el-icon-circle-close" />
        <span>Đóng</span>
      </el-button>
      <el-button
        type="success"
        size="medium"
        :loading="loadingButton"
        mini
        @click="submitForm()"
      >
        <i class="el-icon-circle-check" />
        <span>Lưu</span>
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import GradeService from "@/services/GradeService";
import MaClassService from "@/services/MaClassService";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      dataInput: {
        id: "",
        idGrade: "",
        className: "",
      },
      gradeList: [],
      newClassCreated: null,
      loadingButton: false,
      rules: {
        idGrade: [
          {
            required: true,
            message: "Khối không được để trống",
            trigger: "change",
          },
        ],
      },
    };
  },
  methods: {
    closeDialogByButton() {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.$refs["dataInput"].resetFields();
      }, 300);
    },
    submitForm() {
      this.$refs["dataInput"].validate((valid) => {
        if (valid) {
          this.loadingButton = true;
          MaClassService.changeGradeService(this.dataInput)
            .then((resp) => {
              this.$message({
                message: resp.data.message,
                type: "success",
              });
              setTimeout(() => {
                this.closeDialogByButton();
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
        }
      });
    },
    getDataInitial(row) {
      this.dataInput.id = row.id;
      this.dataInput.className = row.className;
      this.dataInput.gradeName = row.grade.gradeName;
      GradeService.getGradeInPrinciple().then((resp) => {
        this.gradeList = resp.data.data;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-input__inner,
/deep/.el-textarea__inner {
  border: none;
  border-radius: 0;
  resize: none;
  padding-left: 0;
  padding-right: 0;
  border-bottom: 1px solid #d9d9d9;
}
/deep/.el-dialog__title {
  font-size: 25px;
  color: #606266;
}
/deep/.el-form-item__label {
  font-family: Arial, Helvetica, sans-serif;
}
/deep/.el-dialog__footer {
  padding-top: 0;
}
.select-grade {
  width: 100%;
}
</style>
