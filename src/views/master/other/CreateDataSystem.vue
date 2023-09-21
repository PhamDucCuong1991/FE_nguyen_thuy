<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="6">1. Tạo dữ liệu chung cho hệ thống</el-col>
      <el-col :span="5">
        <el-button size="small" @click="createDataCommonMethod()" type="primary"
          >Tạo dữ liệu</el-button
        >
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="6">2. Tạo folder '0' cho hệ thống</el-col>
      <el-col :span="5">
        <el-button
          size="small"
          @click="createFolderSystemMethod()"
          type="primary"
          >Tạo folder</el-button
        >
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="6">3. Kiểm tra backend</el-col>
      <el-col :span="5">
        <el-button size="small" @click="checkBackendMethod()" type="primary"
          >Kiểm tra</el-button
        >
        &nbsp;
        {{ dataBackend }}
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="5">4. Tạo điểm danh/nhận xét</el-col>
      <el-col :span="6">
        <el-button
          size="small"
          :loading="buttonLoadding1"
          @click="createAttendanceEvaluateManual('attendanceType')"
          type="primary"
          >Tạo điểm danh</el-button
        >
        <el-button
          size="small"
          :loading="buttonLoadding2"
          @click="createAttendanceEvaluateManual('evaluateType')"
          type="primary"
          >Tạo nhận xét</el-button
        >
      </el-col>
      <el-col :span="4">
        <el-date-picker
          style="width: 150px"
          size="medium"
          v-model="dataInput.date"
          type="date"
          value-format="yyyy-MM-dd"
          format="dd-MM-yyyy"
          placeholder="Chọn ngày"
          :clearable="false"
        ></el-date-picker>
      </el-col>
      <el-col :span="6">
        <el-select
          size="medium"
          v-model="dataInput.idSchool"
          placeholder="Chọn trường"
          filterable
          clearable
          style="width: 250px"
        >
          <el-option
            v-for="item in schoolList"
            :key="item.id"
            :label="item.schoolName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="4">5, Xóa dữ liệu trùng</el-col>
      <el-col :span="4">
        <el-date-picker
          style="width: 150px"
          size="medium"
          v-model="dataInput1.date"
          type="date"
          value-format="yyyy-MM-dd"
          format="dd-MM-yyyy"
          placeholder="Chọn ngày"
          :clearable="false"
        ></el-date-picker>
      </el-col>
      <el-col :span="8">
        <el-button
          type="primary"
          size="mini"
          :loading="checkAttendanceDuplicateLoadding"
          @click="checkAttendanceDuplicate()"
          >KTra điểm danh</el-button
        >
        &nbsp;&nbsp; KQ:{{ countAttendanceDuplicate }} &nbsp;
        <el-button
          type="danger"
          size="mini"
          :disabled="countAttendanceDuplicate == 0"
          :loading="deleteAttendanceDuplicateLoadding"
          @click="deleteAttendanceDuplicate()"
          >Xóa điểm danh</el-button
        >
      </el-col>
      <el-col :span="8">
        <el-button
          type="primary"
          size="mini"
          :loading="checkEvaluateDuplicateLoadding"
          @click="checkEvaluateDuplicate()"
          >KTra nhận xét</el-button
        >
        &nbsp;&nbsp; KQ:{{ countEvaluateDuplicate }} &nbsp;
        <el-button
          type="danger"
          size="mini"
          :disabled="countEvaluateDuplicate == 0"
          :loading="deleteEvaluateDuplicateLoadding"
          @click="deleteEvaluateDuplicate()"
          >Xóa nhận xét</el-button
        >
      </el-col>
    </el-row>
  </div>
</template>

<script>
import OtherService from "@/services/OtherService";
export default {
  data() {
    return {
      dataBackend: "",
      dataInput: {
        date: "",
        idSchool: "",
      },
      dataInput1: {
        date: "",
      },
      buttonLoadding1: false,
      buttonLoadding2: false,
      countAttendanceDuplicate: "",
      countEvaluateDuplicate: "",
      checkAttendanceDuplicateLoadding: false,
      deleteAttendanceDuplicateLoadding: false,
      checkEvaluateDuplicateLoadding: false,
      deleteEvaluateDuplicateLoadding: false,
      schoolList: [],
    };
  },
  methods: {
    createDataCommonMethod() {
      OtherService.createDataSystem()
        .then((resp) => {
          this.$message({
            message: resp.data.message,
            type: "success",
          });
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        });
    },
    createFolderSystemMethod() {
      OtherService.createFolderSystem()
        .then((resp) => {
          this.$message({
            message: resp.data.message,
            type: "success",
          });
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        });
    },
    checkBackendMethod() {
      OtherService.checkBackend()
        .then((resp) => {
          this.dataBackend = resp.data;
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        });
    },
    createAttendanceEvaluateManual(type) {
      let typeText = type == "attendanceType" ? "ĐIỂM DANH" : "NHẬN XÉT";
      if (this.dataInput.date == "") {
        this.$message({
          message: "Chọn ngày tạo " + typeText,
          type: "error",
        });
        throw null;
      }
      let alertText =
        this.dataInput.idSchool == "" ? "cho TOÀN BỘ các trường" : "";
      this.$confirm(
        "Bạn có chắc chắn muốn tạo " + typeText + " " + alertText + " không?",
        "Thông báo!",
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      ).then(() => {
        type == "attendanceType"
          ? (this.buttonLoadding1 = true)
          : (this.buttonLoadding2 = true);
        OtherService.createAttendanceEvaluateRootFromDate(
          type,
          this.dataInput,
          this.dataInput.idSchool
        )
          .then((resp) => {
            this.$message({
              message: resp.data.message,
              type: "success",
            });
          })
          .catch((err) => {
            this.$message({
              message: err.response.data.message,
              type: "error",
            });
          })
          .finally(() => {
            setTimeout(() => {
              this.buttonLoadding1 = false;
              this.buttonLoadding2 = false;
            }, 1000);
          });
      });
    },
    checkDateDuplicate() {
      if (this.dataInput1.date == "") {
        this.$message({
          message: "Chọn ngày xóa dữ liệu trùng",
          type: "error",
        });
        throw null;
      }
    },
    checkAttendanceDuplicate() {
      this.checkDateDuplicate();
      this.checkAttendanceDuplicateLoadding = true;
      OtherService.getAttendanceDuplicateService(this.dataInput1.date)
        .then((resp) => {
          this.countAttendanceDuplicate = resp.data.data;
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        })
        .finally(() => {
          setTimeout(() => {
            this.checkAttendanceDuplicateLoadding = false;
          }, 500);
        });
    },
    deleteAttendanceDuplicate() {
      this.checkDateDuplicate();
      this.$confirm(
        "Bạn có chắc chắn muốn xóa điểm danh trùng không?",
        "Thông báo!",
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      ).then(() => {
        this.deleteAttendanceDuplicateLoadding = true;
        OtherService.deleteAttendanceDuplicateService(this.dataInput1.date)
          .then((resp) => {
            this.$message({
              message: resp.data.message,
              type: "success",
            });
            this.checkAttendanceDuplicate();
          })
          .catch((err) => {
            this.$message({
              message: err.response.data.message,
              type: "error",
            });
          })
          .finally(() => {
            setTimeout(() => {
              this.deleteAttendanceDuplicateLoadding = false;
            }, 500);
          });
      });
    },
    checkEvaluateDuplicate() {
      this.checkDateDuplicate();
      this.checkEvaluateDuplicateLoadding = true;
      OtherService.getEvaluateDuplicateService(this.dataInput1.date)
        .then((resp) => {
          this.countEvaluateDuplicate = resp.data.data;
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        })
        .finally(() => {
          setTimeout(() => {
            this.checkEvaluateDuplicateLoadding = false;
          }, 500);
        });
    },
    deleteEvaluateDuplicate() {
      this.checkDateDuplicate();
      this.$confirm(
        "Bạn có chắc chắn muốn xóa nhận xét trùng không?",
        "Thông báo!",
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      ).then(() => {
        this.deleteEvaluateDuplicateLoadding = true;
        OtherService.deleteEvaluateDuplicateService(this.dataInput1.date)
          .then((resp) => {
            this.$message({
              message: resp.data.message,
              type: "success",
            });
            this.checkEvaluateDuplicate();
          })
          .catch((err) => {
            this.$message({
              message: err.response.data.message,
              type: "error",
            });
          })
          .finally(() => {
            setTimeout(() => {
              this.deleteEvaluateDuplicateLoadding = false;
            }, 500);
          });
      });
    },
    getAllSchoolMethod() {
      OtherService.getSchoolAllService()
        .then((resp) => {
          this.schoolList = resp.data.data;
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        });
    },
  },
  beforeMount() {
    this.getAllSchoolMethod();
  },
};
</script>

<style lang="scss" scoped>
.el-row {
  margin-bottom: 20px;
}
</style>
