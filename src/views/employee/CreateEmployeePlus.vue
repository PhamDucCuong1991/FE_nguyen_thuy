<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="90%"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      top="2vh"
      title="Thêm mới Plus"
    >
      <el-form
        label-width="140px"
        :model="formAllTabEmployee"
        label-position="left"
        :rules="rules"
        ref="formAllTabEmployee"
      >
        <el-tabs type="card" v-model="activeTabName" @tab-click="handleClick">
          <el-tab-pane label="Thông tin" name="infoTab">
            <el-row :gutter="40">
              <el-col :span="12">
                <div class="grid-content">
                  <el-form-item
                    label="Họ tên"
                    prop="createEmployeeMainInfoRequest.fullName"
                  >
                    <el-input
                      v-model="formAllTabEmployee.createEmployeeMainInfoRequest.fullName"
                    ></el-input>
                  </el-form-item>
                  <el-form-item
                    label="Ngày sinh"
                    prop="createEmployeeMainInfoRequest.birthday"
                  >
                    <el-date-picker
                      v-model="formAllTabEmployee.createEmployeeMainInfoRequest.birthday"
                      :picker-options="pickerOptions"
                      format="dd-MM-yyyy"
                      value-format="yyyy-MM-dd"
                      type="date"
                      placeholder="Chọn ngày sinh"
                      style="width: 100%"
                    ></el-date-picker>
                  </el-form-item>
                  <el-form-item
                    prop="createEmployeeMainInfoRequest.gender"
                    label="Giới tính"
                  >
                    <el-radio-group
                      v-model="formAllTabEmployee.createEmployeeMainInfoRequest.gender"
                    >
                      <el-radio label="Nam">Nam</el-radio>
                      <el-radio label="Nữ">Nữ</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item
                    label="Số điện thoại"
                    prop="createEmployeeMainInfoRequest.phone"
                  >
                    <el-input
                      type="number"
                      min="0"
                      max="0"
                      v-model="formAllTabEmployee.createEmployeeMainInfoRequest.phone"
                    ></el-input>
                  </el-form-item>
                  <el-form-item
                    label="Ngày vào"
                    prop="createEmployeeMainInfoRequest.startDate"
                  >
                    <el-date-picker
                      v-model="formAllTabEmployee.createEmployeeMainInfoRequest.startDate"
                      type="date"
                      format="dd-MM-yyyy"
                      value-format="yyyy-MM-dd"
                      placeholder="Chọn ngày vào"
                      style="width: 100%"
                    ></el-date-picker>
                  </el-form-item>
                  <el-form-item label="Email" prop="createEmployeeMainInfoRequest.email">
                    <el-input
                      v-model="formAllTabEmployee.createEmployeeMainInfoRequest.email"
                    ></el-input>
                  </el-form-item>
                  <el-form-item
                    label="Số định danh"
                    prop="createEmployeeMainInfoRequest.cmnd"
                  >
                    <el-input
                      v-model="formAllTabEmployee.createEmployeeMainInfoRequest.cmnd"
                    ></el-input>
                  </el-form-item>
                  <el-form-item
                    label="Ngày cấp"
                    prop="createEmployeeMainInfoRequest.cmndDate"
                  >
                    <el-date-picker
                      v-model="formAllTabEmployee.createEmployeeMainInfoRequest.cmndDate"
                      format="dd-MM-yyyy"
                      value-format="yyyy-MM-dd"
                      style="width: 100%"
                      placeholder="Chọn ngày cấp"
                      type="date"
                    ></el-date-picker>
                  </el-form-item>

                  <el-form-item
                    label="Địa chỉ thường trú"
                    prop="createEmployeeMainInfoRequest.permanentAddress"
                  >
                    <el-input
                      v-model="
                        formAllTabEmployee.createEmployeeMainInfoRequest.permanentAddress
                      "
                    ></el-input>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content">
                  <el-form-item
                    label="Chỗ ở hiện tại"
                    prop="createEmployeeMainInfoRequest.address"
                  >
                    <el-input
                      v-model="formAllTabEmployee.createEmployeeMainInfoRequest.address"
                    ></el-input>
                  </el-form-item>
                  <el-form-item
                    label="Dân tộc"
                    prop="createEmployeeMainInfoRequest.ethnic"
                  >
                    <el-input
                      clearable
                      v-model="formAllTabEmployee.createEmployeeMainInfoRequest.ethnic"
                    ></el-input>
                  </el-form-item>
                  <el-form-item
                    label="Hôn nhân"
                    prop="createEmployeeMainInfoRequest.marriedStatus"
                  >
                    <el-select
                      v-model="
                        formAllTabEmployee.createEmployeeMainInfoRequest.marriedStatus
                      "
                      filterable
                      clearable
                      placeholder="Chọn hôn nhân"
                    >
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    label="Số con"
                    prop="createEmployeeMainInfoRequest.numberChildren"
                  >
                    <el-input
                      v-model="
                        formAllTabEmployee.createEmployeeMainInfoRequest.numberChildren
                      "
                    ></el-input>
                  </el-form-item>
                  <el-form-item
                    label="Trình độ"
                    prop="createEmployeeMainInfoRequest.educationLevel"
                  >
                    <el-input
                      v-model="
                        formAllTabEmployee.createEmployeeMainInfoRequest.educationLevel
                      "
                    ></el-input>
                  </el-form-item>

                  <el-form-item
                    label="Đối tượng"
                    prop="createEmployeeMainInfoRequest.idAccountTypeList"
                  >
                    <el-select
                      v-model="
                        formAllTabEmployee.createEmployeeMainInfoRequest.idAccountTypeList
                      "
                      multiple
                      placeholder="Chọn đối tượng"
                      clearable
                      filterable
                    >
                      <el-option
                        v-for="item in accountTypeList"
                        :key="item.id"
                        :value="item.id"
                        :label="item.name"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    label="Ngày ký hợp đồng"
                    prop="createEmployeeMainInfoRequest.contractDate"
                  >
                    <el-date-picker
                      v-model="
                        formAllTabEmployee.createEmployeeMainInfoRequest.contractDate
                      "
                      type="date"
                      format="dd-MM-yyyy"
                      value-format="yyyy-MM-dd"
                      placeholder="Chọn ngày ký hợp đồng"
                      style="width: 100%"
                    ></el-date-picker>
                  </el-form-item>
                  <el-form-item
                    label="Ngày hết hạn"
                    prop="createEmployeeMainInfoRequest.endDate"
                  >
                    <el-date-picker
                      v-model="formAllTabEmployee.createEmployeeMainInfoRequest.endDate"
                      type="date"
                      format="dd-MM-yyyy"
                      value-format="yyyy-MM-dd"
                      style="width: 100%"
                      placeholder="Chọn ngày hết hạn"
                    ></el-date-picker>
                  </el-form-item>
                  <el-form-item label="Ghi chú" prop="createEmployeeMainInfoRequest.note">
                    <el-input
                      v-model="formAllTabEmployee.createEmployeeMainInfoRequest.note"
                      type="textarea"
                      :rows="1"
                      style="width: 100%"
                    ></el-input>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
          </el-tab-pane>
          <!-- app pluss -->
          <el-tab-pane name="Notify" label="App Plus">
            <!-- table 1 -->
            <el-table
              class="table-icon-1"
              border
              :data="plusIconAppCreate.plusIconCreate1"
              highlight-current-row
              :row-style="tableRowStyle"
              :header-cell-style="tableHeaderColor"
              :max-height="$tableMaxHeight"
            >
              <el-table-column width="50" type="index" label="STT" align="center"></el-table-column>
              <el-table-column prop="iconName" min-width="130" label="Chức năng"></el-table-column>
              <el-table-column label="Hiển thị" align="center">
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.statusShow"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column label="Mở khóa" align="center">
              <template slot-scope="scope">
                <el-checkbox
                  v-if="scope.row.rootLockStatus"
                  v-model="scope.row.status"
                ></el-checkbox>
                <el-checkbox v-else disabled></el-checkbox>
              </template>
              </el-table-column>
            </el-table>

            <!-- table 2 -->
            <el-table
              class="table-icon-2"
              border
              :data="plusIconAppCreate.plusIconCreate2"
              highlight-current-row
              :row-style="tableRowStyle"
              :header-cell-style="tableHeaderColor"
              :max-height="$tableMaxHeight"
            >
              <el-table-column width="50" type="index" label="STT" align="center"></el-table-column>
              <el-table-column prop="iconName" min-width="130" label="Chức năng"></el-table-column>
              <el-table-column label="Hiển thị" align="center">
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.statusShow"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column label="Mở khóa" align="center">
                <template slot-scope="scope">
                  <el-checkbox
                    v-if="scope.row.rootLockStatus"
                    v-model="scope.row.status"
                  ></el-checkbox>
                  <el-checkbox v-else disabled></el-checkbox>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <div class="tab-infor-button">
        <el-button
          type="danger"
          size="medium"
          @click="closeDialogByButton('formAllTabEmployee')"
        >
          <i class="el-icon-circle-close" />
          <span>Đóng</span>
        </el-button>
        <el-button
          type="success"
          size="medium"
          :loading="loadingButton"
          mini
          @click="submitForm('formAllTabEmployee')"
        >
          <i class="el-icon-circle-check" />
          <span>Lưu</span>
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import EmployeeDataService from "@/services/EmployeeDataService";
import SupperPlusService from "@/services/SupperPlusService";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      activeTabName: "infoTab",
      fileList: [],
      fileAvatar: "",
      showUpload: true,
      dialogImageUrl: "",
      dialogVisible1: false,
      disabled: false,

      accountTypeList: [],
      subjectClass: "",
      subjectInClass: [],
      disabledIsMaster: false,
      isMasterAccountType: true,
      employeeSavedSuccess: {},
      listSubject: [],
      listIdSubject: [],
      kkk: [],
      idClassCheck: "",

      teacherIconAppCreate: {
        teacherIconCreate1: [],
        teacherIconCreate2: [],
      },
      plusIconAppCreate: {
        plusIconCreate1: [],
        plusIconCreate2: [],
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      emloyeeCode: "ABCDE-123456",
      employeeStatusRadio: "Đang làm",
      value: "",
      checkIsClass: true,
      radiogender: "",
      options: [
        {
          value: "Độc thân",
          label: "Độc thân",
        },
        {
          value: "Đã kết hôn",
          label: "Đã kết hôn",
        },
      ],
      loadingButton: false,
      formAllTabEmployee: {
        createEmployeeMainInfoRequest: {
          idAccountTypeList: "",
          fullName: "",
          birthday: "",
          address: "",
          gender: "",
          email: "",
          phone: "",
          cmnd: "",
          cmndDate: "",
          employeeStatus: "Đang làm",
          code: "",
          permanentAddress: "",
          marriedStatus: "",
          numberChildren: "",
          educationLevel: "",
          startDate: "",
          contractDate: "",
          endDate: "",
          note: "",
          appType: "plus",
          avatar: "",
          ethnic: "",
        },
        tabDepartmentInEmployee: [],
        tabDepartmentRequestList: [],
        tabProfessionalInEmployee: [],
        tabProfessionalRequestList: [],
        appIconTeacherRequestList: [],
        appIconPlusRequestList: [],
        notifyAppIconPlusRequestList: [],
      },

      rules: {
        createEmployeeMainInfoRequest: {
          fullName: [
            {
              required: true,
              message: "Họ tên không được để trống",
              trigger: "blur",
            },
          ],
          phone: [
            {
              min: 10,
              max: 10,
              message: "Số điện thoại bao gồm 10 số",
              trigger: "change",
            },
            {
              required: true,
              message: "Số điện thoại không được để trống",
              trigger: "change",
            },
          ],
          gender: [
            {
              required: true,
              message: "Giới tính không được để trống",
              trigger: "blur",
            },
          ],
          startDate: [
            {
              required: true,
              message: "Ngày vào không được để trống",
              trigger: "blur",
            },
          ],
          birthday: [
            {
              required: true,
              message: "Ngày sinh không được để trống",
              trigger: "blur",
            },
          ],
          listAppType: [
            {
              required: true,
              message: "Bạn phải chọn ít nhất 1 ứng dụng",
              trigger: "blur",
            },
          ],
        },
      },
    };
  },
  methods: {
    selectionMultiDepartment(index, row) {
      let indexFind = this.formAllTabEmployee.tabDepartmentRequestList.indexOf(row);
      if (indexFind == -1) {
        this.formAllTabEmployee.tabDepartmentRequestList.push(row);
      } else {
        this.formAllTabEmployee.tabDepartmentRequestList.splice(indexFind, 1);
      }
      console.log(this.formAllTabEmployee.tabDepartmentRequestList);
    },

    selectMultiSubject(index, row) {
      let a = this.listSubject;
      let indexFind = this.listSubject.indexOf(row);
      if (indexFind == -1) {
        this.listSubject.push(row);
      } else {
        this.listSubject.splice(indexFind, 1);
      }
      console.log(a);
    },
    handleMultiSelectSubject() {
      if (
        this.formAllTabEmployee.subjectInClassRequestList === undefined ||
        this.formAllTabEmployee.subjectInClassRequestList.length == 0
      ) {
        let e = (this.formAllTabEmployee.subjectInClassRequestList = this.listSubject);
        console.log(e);
      } else {
        var a = this.formAllTabEmployee.subjectInClassRequestList;
        // var b = this.listSubject;
        // var c = this.listSubject.filter(item => {
        //   !this.formAllTabEmployee.subjectInClassRequestList.includes(item);
        // });
      }
      console.log(a);
      // console.log(b);
      // console.log(c);
    },
    selectionMultiProfessional(index, row) {
      let indexFind = this.formAllTabEmployee.tabProfessionalRequestList.indexOf(row);
      if (indexFind == -1) {
        this.formAllTabEmployee.tabProfessionalRequestList.push(row);
      } else {
        this.formAllTabEmployee.tabProfessionalRequestList.splice(indexFind, 1);
      }
    },
    selectionMultiIsMaster(index, row) {
      console.log(row);
    },
    selectionMultiIsMaster1(index, row) {
      this.disabledIsMaster = true;
      console.log(row);
    },
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;border:1px solid #fff";
    },
    closeDialog() {
      this.activeTabName = "infoTab";
      this.$refs["formAllTabEmployee"].resetFields();
      this.$emit("dialog-close");
      this.handleRemove();
      this.resetFormData();
    },
    //click when click button
    closeDialogByButton(fromData) {
      this.activeTabName = "infoTab";
      this.$refs[fromData].resetFields();
      this.$emit("dialog-close");
      this.handleRemove();
      this.resetFormData();
    },
    resetFormData() {
      location.reload();
    },
    handleRemove() {
      this.$refs.upload.clearFiles();
      this.showUpload = true;
      this.formAllTabEmployee.createEmployeeMainInfoRequest.avatar = null;
    },
    handleClose(done) {
      this.$confirm("Are you sure to close this dialog?")
        .then((_) => {
          console.log(_);
          done();
        })
        .catch((_) => {
          console.log(_);
        });
    },
    tabPlusIconMethod() {
      SupperPlusService.findIconPlusCreate()
        .then((resp) => {
          this.plusIconAppCreate.plusIconCreate1 =
            resp.data.data.appIconPlusResponseList1;
          this.plusIconAppCreate.plusIconCreate2 =
            resp.data.data.appIconPlusResponseList2;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    submitForm(fromData) {
      this.$refs[fromData].validate((valid) => {
        if (valid) {
          this.loadingButton = true;
          // let iconArrayTeacher1 = this.teacherIconAppCreate.teacherIconCreate1;
          // let iconArrayTeacher2 = this.teacherIconAppCreate.teacherIconCreate2;
          // let iconArrayTeacher = iconArrayTeacher1.concat(iconArrayTeacher2);
          // this.formAllTabEmployee.appIconTeacherRequestList = iconArrayTeacher;

          let iconArrayPlus1 = this.plusIconAppCreate.plusIconCreate1;
          let iconArrayPlus2 = this.plusIconAppCreate.plusIconCreate2;
          let iconArrayPlus = iconArrayPlus1.concat(iconArrayPlus2);
          this.formAllTabEmployee.appIconPlusRequestList = iconArrayPlus;

          // let iconNotifyArrayPlus1 = this.notifyPlusIconAppCreate.plusIconNotifyCreate1;
          // let iconNotifyArrayPlus2 = this.notifyPlusIconAppCreate.plusIconNotifyCreate2;
          // let iconNotifyArrayPlus = iconNotifyArrayPlus1.concat(iconNotifyArrayPlus2);
          // this.formAllTabEmployee.notifyAppIconPlusRequestList = iconNotifyArrayPlus;
          // this.formAllTabEmployee.tabDepartmentRequestList;
          // this.formAllTabEmployee.createEmployeeMainInfoRequest.appType = "plus";

          let formDatas = new FormData();
          formDatas.append("multipartFile", this.fileAvatar);

          SupperPlusService.createPlus(this.formAllTabEmployee)
            .then((response) => {
              this.employeeSavedSuccess = response.data.data;
              // if (this.formAllTabEmployee.createEmployeeMainInfoRequest.avatar != "") {
              //   this.uploadAvatarMethod(formDatas);
              // }
              this.$message({
                message: response.data.message,
                type: "success",
              });
              setTimeout(() => {
                this.closeDialogByButton(fromData);
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
        } else {
          console.log("error validate data!");
          return false;
        }
      });
    },
    // uploadAvatarMethod(formData) {
    //   EmployeeDataService.uploadAvatar(formData);
    // },
    getAllAccountType() {
      EmployeeDataService.getAccountType()
        .then((response) => {
          this.accountTypeList = response.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible1 = true;
    },
    handleDownload(file) {
      console.log(file);
    },
    toggleUpload(file, fileList) {
      this.showUpload = !this.showUpload;
      this.fileAvatar = file.raw;
      this.formAllTabEmployee.createEmployeeMainInfoRequest.avatar = this.fileAvatar.name;
      this.fileList = fileList;
    },
  },
};
</script>
<style>
.hideUpload > div {
  visibility: hidden;
}
</style>
<style lang="scss" scoped>
/deep/.el-dialog__title {
  font-size: 25px;
  color: #606266;
}
/deep/.el-form-item__label {
  font-family: Arial, Helvetica, sans-serif;
}
/deep/.el-button--primary {
  width: 100%;
  background: #409eff;
}
/deep/.upload-demo {
  text-align: center;
  .el-upload {
    width: 100%;
  }
}
/deep/.el-avatar {
  display: inline;
  img {
    border-radius: 5px;
    width: 100%;
  }
}
/deep/.el-input.is-disabled .el-input__inner {
  text-align: center;
  color: #d13b93;
  font-weight: bold;
}
.el-select {
  display: block;
}

.tab-infor-button {
  text-align: right;
  margin-top: 20px;
}
.bg-purple {
  background: #d3dce6;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.group-radio-status {
  margin: 0 50px;
  .kids-status {
    margin-bottom: 10px;
  }
}
/deep/.el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:after {
  content: "*";
  color: #f56c6c;
  margin-left: 3px;
}
/deep/.el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before {
  content: "";
  color: #f56c6c;
  margin-left: -4px;
}
/deep/input::-webkit-outer-spin-button,
/deep/input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.table-icon-1 {
  width: 32%;
  margin-left: 15%;
  display: inline-block;
}
.table-icon-2 {
  width: 32%;
  margin-right: 15%;
  float: right;
}
</style>
