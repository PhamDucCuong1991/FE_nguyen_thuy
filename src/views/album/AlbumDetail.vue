<template>
  <div class="content">
    <el-form
      :model="updateAlbumRequest"
      :rules="rules"
      ref="updateAlbumRequest"
      label-width="120px"
      class="demo-ruleForm"
    >
      <!-- Vùng body  -->
      <div style="border: 1px solid rgb(96 99 102 / 19%)">
        <!--Vùng Tên Album-->
        <div style="margin-top: 20px">
          <el-form-item label="Loại album">
            <el-select
              v-model="updateAlbumRequest.idClass"
              style="height: 10px"
            >
              <el-option
                v-for="item in listClass"
                :key="item.id"
                :label="item.className"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            style="float: right; margin-top: -60px; margin-right: 100px"
            label="Tên Album"
            prop="albumName"
          >
            <el-input
              v-model="updateAlbumRequest.albumName"
              placeholder="Nhập tiêu đề..."
            ></el-input>
          </el-form-item>

          <el-form-item style="clear: both" label="Mô tả Album" prop="desc">
            <el-input
              v-model="updateAlbumRequest.albumDescription"
              placeholder="Nhập nội dung..."
              :rows="2"
              type="textarea"
            ></el-input>
          </el-form-item>
        </div>
        <!--Vùng ảnh-->
        <div style="max-height: 492px; overflow: scroll">
          <h3 style="margin-left: 35px; margin-bottom: 20px; margin-top: -39px">
            Ảnh được chọn
          </h3>
          <el-progress
            style="width: 25%; float: left; margin-top: 23px"
            v-if="showProgress"
            :percentage="percentage"
            :color="colors"
          ></el-progress>
          <el-upload
            style="clear: both"
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            ref="upload"
            :file-list="fileList"
            :on-change="handleChangePicture"
            :on-remove="handleRemove"
            multiple
          >
            <i slot="default" class="el-icon-plus" style="font-style: normal"
              >Thêm Ảnh</i
            >
            <div slot="file" slot-scope="{ file }">
              <img class="el-upload-list__item-thumbnail" :src="file.url" alt />
              <span class="el-upload-list__item-actions">
                <span
                  class="el-upload-list__item-preview"
                  @click="handlePictureCardPreview(file)"
                >
                  <i class="el-icon-zoom-in"></i>
                </span>
                <span
                  v-if="!disabled"
                  class="el-upload-list__item-delete"
                  @click="handleRemove(file)"
                >
                  <i class="el-icon-delete"></i>
                </span>
              </span>
            </div>
          </el-upload>
          <el-dialog width="30%" :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt />
          </el-dialog>

          <h3 style="margin-left: 20px">
            Danh sách ảnh album: {{ this.updateAlbumRequest.albumName }}
          </h3>
          <hr style="width: 98%; margin-top: -18px" />
          <el-row
            style="width: 100%; margin-top: 10px"
            class="demo-image__placeholder"
            v-if="
              Array.isArray(updateAlbumRequest.alistPictureList) &&
              updateAlbumRequest.alistPictureList.length
            "
          >
            <div
              v-for="(
                listPicture, index
              ) in updateAlbumRequest.alistPictureList"
              class="inline-block"
              :key="listPicture"
              style="
                float: left;
                margin: 14px;
                border: 1px solid #dcdfe6;
                width: 160px;
              "
            >
              <el-tooltip content="Xem ảnh" placement="top">
                <el-image
                  @click="handleShowDetailPicture(index)"
                  :src="
                    listPicture.urlPicture.replace(
                      '/Albumanh/',
                      '/Albumanh/thumbnail_'
                    )
                  "
                  style="width: 100%; height: 160px"
                  class="el-image-opacity"
                ></el-image>
              </el-tooltip>
              <span v-if="checkPermission(['studentQuality_ablum_update'])">
                <el-button
                  v-if="listPicture.isApproved"
                  type="success"
                  style="
                    width: 65%;
                    color: white;
                    font-size: 15px;
                    text-align: left;
                    float: left;
                  "
                  >Đã duyệt</el-button
                >
                <el-button
                  v-else
                  type="primary"
                  style="
                    width: 65%;
                    color: white;
                    font-size: 15px;
                    text-align: left;
                    float: left;
                  "
                  @click="updateApprovePicture(listPicture.id, true)"
                  >Chưa duyệt</el-button
                >
                <span class="el-upload-list__item-actions">
                  <el-button
                    v-if="listPicture.isApproved"
                    type="success"
                    class="el-upload-list__item-preview"
                    @click="deletePicture(listPicture.id)"
                    style="float: left; height: 40.5px"
                  >
                    <i style="color: white" class="el-icon-delete-solid"></i>
                  </el-button>
                  <el-button
                    v-else
                    type="primary"
                    class="el-upload-list__item-preview"
                    @click="deletePicture(listPicture.id)"
                    style="float: left; height: 40.5px"
                  >
                    <i style="color: white" class="el-icon-delete-solid"></i>
                  </el-button>
                </span>
              </span>
              <div></div>
            </div>
            <el-dialog width="40%" :visible.sync="dialogVisiblePic">
              <img
                width="100%"
                :src="updateAlbumRequest.alistPictureList[indexSrc].urlPicture"
                alt
              />
            </el-dialog>
          </el-row>
        </div>
      </div>
      <!-- Vùng nút trái -->
      <div style="margin-top: 20px; float: left">
        <span style="font-weight: bold">Người đăng :</span>
        <span
          >{{ updateAlbumRequest.createdBy }} |
          {{ updateAlbumRequest.pictureApprovedNumber }}/{{
            updateAlbumRequest.pictureNumber
          }}
          ảnh | {{ updateAlbumRequest.createdDate | formatDate }}</span
        >
      </div>
      <!-- Vùng nút phải -->
      <div style="margin-top: 20px; float: right">
        <el-button
          v-if="checkPermission(['studentQuality_ablum_update'])"
          class="button-over"
          type="success"
          @click="submitUpload('updateAlbumRequest')"
        >
          <i class="el-icon-circle-check" />
          Lưu thay đổi
        </el-button>
        <el-button
          v-if="checkPermission(['studentQuality_ablum_update'])"
          class="button-over"
          type="success"
          @click="updateAllApprovePicture(updateAlbumRequest.id)"
        >
          <i class="el-icon-plus" />
          Duyệt tất cả
        </el-button>
        <router-link
          style="text-decoration: none"
          to="/student-quality/album"
          class="router-link"
        >
          <el-button
            class="button-over"
            type="danger"
            @click="createEmployeeDialog()"
          >
            <i class="el-icon-back" />
            quay lại
          </el-button>
        </router-link>
      </div>
    </el-form>
  </div>
</template>

<script>
import checkPermission from "@/utils/permission.js";
import AlbumService from "../../services/AlbumService";
import MaClassService from "../../services/MaClassService";
export default {
  components: {},
  data() {
    return {
      colors: [
        { color: "#f56c6c", percentage: 20 },
        { color: "#e6a23c", percentage: 40 },
        { color: "#5cb87a", percentage: 60 },
        { color: "#1989fa", percentage: 80 },
        { color: "#6f7ad3", percentage: 100 },
      ],
      percentage: 0,
      interval: "",
      showProgress: false,
      listClass: [],
      updateAlbumRequest: {},
      rules: {
        albumName: [
          {
            required: true,
            message: "Tên Album không được được để trống",
            trigger: "blur",
          },
        ],
      },
      // files: [],
      selectedFiles: undefined,
      currentFile: undefined,
      fileInfos: [],
      layout: "sizes, prev, pager, next",
      // fileList: [],
      dialogImageUrl: "",
      dialogVisible: false,
      dialogVisiblePic: false,
      indexSrc: 0,
      disabled: false,
      showCreateDialog: false,
      showUpdateDialog: false,
      idList: [],
      srcs: [
        "http://upload.onekids.edu.vn/id1/2020/T08/album_anh/%202.jpg",
        "http://upload.onekids.edu.vn/id1/2020/T08/album_anh/%203.jpg",
        "http://upload.onekids.edu.vn/id1/2020/T08/album_anh/%2013.jpg",
        "http://upload.onekids.edu.vn/id1/2020/T08/album_anh/%2014.jpg",
        "http://upload.onekids.edu.vn/id1/2020/T08/album_anh/%207.jpg",
        "http://upload.onekids.edu.vn/id1/2020/T08/album_anh/%202.jpg",
        "http://upload.onekids.edu.vn/id1/2020/T08/album_anh/%202.jpg",
        "http://upload.onekids.edu.vn/id1/2020/T08/album_anh/%207.jpg",
        "http://upload.onekids.edu.vn/id1/2020/T08/album_anh/%2013.jpg",
        "http://upload.onekids.edu.vn/id1/2020/T08/album_anh/%207.jpg",
      ],
    };
  },
  methods: {
    checkPermission,
    increase() {
      this.interval = window.setInterval(() => {
        this.percentage += 5;
        if (this.percentage > 90) {
          this.percentage = 90;
        }
      }, 50);
    },
    stopIncrease() {
      clearInterval(this.interval);
      this.percentage = 100;
    },
    handleChangePicture(file, fileList) {
      this.updateAlbumRequest.fileList = fileList;
      const isJPG = file.raw.type === "image/jpeg";
      const isPNG = file.raw.type === "image/png";
      const isLt5M = file.size / 1024 / 1024 < 5;

      if (!isJPG && !isPNG) {
        this.$message.error("Ảnh phải có dạng JPG hoặc PNG!");
        this.handleRemove(file);
      }
      if (!isLt5M) {
        this.$message.error("Ảnh không thể vượt quá 5MB");
        this.handleRemove(file);
      }

      return isJPG && isLt5M;
    },
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold";
    },
    //highlight cho row theo điều kiện
    tableRowStyle({ row }) {
      row.id;
    },
    submitUpload(fromData) {
      this.$refs[fromData].validate((valid) => {
        if (valid) {
          this.showProgress = true;
          let formData = new FormData();
          if (
            this.updateAlbumRequest.fileList != "undefined" &&
            this.updateAlbumRequest.fileList != null &&
            this.updateAlbumRequest.fileList.length != null &&
            this.updateAlbumRequest.fileList.length > 0
          ) {
            this.updateAlbumRequest.fileList.forEach((element) => {
              formData.append("fileList", element.raw);
            });
          }
          formData.append("albumName", this.updateAlbumRequest.albumName);
          formData.append(
            "albumDescription",
            this.updateAlbumRequest.albumDescription
          );
          formData.append("albumType", this.updateAlbumRequest.albumType);
          formData.append(
            "albumApprovalDefault",
            this.updateAlbumRequest.albumApprovalDefault
          );
          formData.append(
            "idSchoolApproval",
            this.updateAlbumRequest.idSchoolApproval
          );
          formData.append(
            "schoolApprovalDate",
            this.updateAlbumRequest.schoolApprovalDate
          );
          formData.append(
            "urlPictureFirst",
            this.updateAlbumRequest.urlPictureFirst
          );
          formData.append(
            "pictureNumber",
            this.updateAlbumRequest.pictureNumber
          );
          formData.append(
            "pictureApprovedNumber",
            this.updateAlbumRequest.pictureApprovedNumber
          );
          formData.append("idClass", this.updateAlbumRequest.idClass);
          formData.append("idSchool", this.updateAlbumRequest.idSchool);
          formData.append("id", this.updateAlbumRequest.id);
          formData.append(
            "listPictureList",
            this.updateAlbumRequest.alistPictureList
          );

          this.increase();
          AlbumService.updateAlbumUpload(formData)
            .then((res) => {
                console.log(res);
                this.stopIncrease();
                this.$message({
                  message: "Cập nhật Album thành công",
                  type: "success",
                });
                this.showProgress = false;
                this.getAlumDetail();
            })
            .catch((err) => {
              this.$message({
                message: err.response.data.message,
                type: "error",
              });
              clearInterval(this.interval);
              this.getAlumDetail();
              this.showProgress = false;
              this.updateAlbumRequest.alistPictureList = [];
            })
            .finally(() => {
              this.$refs.upload.clearFiles();
              this.updateAlbumRequest.alistPictureList = [];
            });
        }
      });
    },
    handleCommand(command) {
      if (command == "activeAccount") {
        this.updateMultiActivated();
      } else if (command == "unactiveAccount") {
        this.updateMultiUnActivated();
      } else if (command == "deleteMultiEmployee") {
        this.handleMultiDelelte();
      } else if (command == "exportExcel") {
        this.exportExcelEmployee();
      }
    },
    handleRemove(file) {
      let a = this.updateAlbumRequest.fileList;
      console.log(a);
      let index = this.updateAlbumRequest.fileList.indexOf(file);
      if (index >= 0) {
        this.updateAlbumRequest.fileList.splice(index, 1);
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleShowDetailPicture(index) {
      this.indexSrc = index;
      let a = this.indexSrc;
      this.dialogVisiblePic = true;
      console.log(a);
    },
    handleDownload(file) {
      console.log(file);
    },
    //click edit at row
    handleEdit(index, row) {
      console.log(row);
    },
    createEmployeeDialog() {
      this.showCreateDialog = true;
    },
    dialogCloseCreateMethod() {
      this.showCreateDialog = false;
    },
    dialogCloseUpdateMethod() {
      this.showUpdateDialog = false;
    },
    handleFile(file) {
      console.log(file);
    },
    handleFilesUpload() {
      let uploadedFiles = this.$refs.files.files;
      /*
          Adds the uploaded file to the files array
        */
      for (var i = 0; i < uploadedFiles.length; i++) {
        this.files.push(uploadedFiles[i]);
      }
    },
    addFiles() {
      this.$refs.files.click();
    },
    getAlumDetail() {
      AlbumService.getAlbumById(this.$route.params.id)
        .then((res) => {
          this.updateAlbumRequest = res.data.data;
          let a = this.updateAlbumRequest;
          console.log(a);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getClass() {
      MaClassService.getAllClassCommon()
        .then((res) => {
          this.listClass = res.data.data;
          this.listClass.push({ id: 0, className: "Trường" });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    deletePicture(id) {
      this.$confirm("Bạn có chắc chắn muốn xóa ảnh đã chọn?", "Thông báo!", {
        distinguishCancelAndClose: true,
        confirmButtonText: "Có",
        closeOnClickModal: false,
        cancelButtonText: "Không",
      }).then(() => {
        AlbumService.deletePicture(id)
          .then((res) => {
            if (res.data.data) {
              if (this.updateAlbumRequest.pictureNumber == 0) {
                AlbumService.deleteAlbum(this.updateAlbumRequest.id).then(
                  (res) => {
                    if (res.data) {
                      this.$message({
                        message:
                          "Xóa Album " +
                          this.updateAlbumRequest.albumName +
                          " thành công",
                        type: "success",
                      });
                      this.$router.go("/student-quality/album");
                      this.getAlumDetail();
                    }
                  }
                );
              } else {
                this.$message({
                  message: "Xóa ảnh thành công",
                  type: "success",
                });
                this.getAlumDetail();
              }
            } else {
              this.$message({
                message: "Xóa ảnh thất bại",
                type: "error",
              });
            }
          })
          .catch((err) => {
            console.log(err);
            this.$message({
              message: "Lỗi xóa ảnh",
              type: "error",
            });
          });
      });
    },
    updateApprovePicture(id, check) {
      this.$confirm("Bạn có chắc chắn muốn duyệt ảnh đã chọn?", "Thông báo!", {
        distinguishCancelAndClose: true,
        confirmButtonText: "Có",
        closeOnClickModal: false,
        cancelButtonText: "Không",
      }).then(() => {
        AlbumService.updateApprovePicture(id, check)
          .then((res) => {
            console.log(res.data);
            this.$message({
              message: "Duyệt ảnh thành công",
              type: "success",
            });
            // this.$router.go("/student-quality/album-detail/" + id);
            this.getAlumDetail();
          })
          .catch((err) => {
            console.log(err);
            this.$message({
              message: "Duyệt ảnh thất bại",
              type: "error",
            });
          });
      });
    },
    updateAllApprovePicture(id) {
      this.$confirm(
        "Bạn có chắc chắn muốn duyệt tất cả ảnh đã chọn?",
        "Thông báo!",
        {
          distinguishCancelAndClose: true,
          confirmButtonText: "Có",
          closeOnClickModal: false,
          cancelButtonText: "Không",
        }
      ).then(() => {
        AlbumService.updateAllApprovePicture(id)
          .then((res) => {
            console.log(res.data);
            this.$message({
              message: "Duyệt tất cả các ảnh thành công",
              type: "success",
            });
            // this.$router.go("/student-quality/album-detail/" + id);
            this.getAlumDetail();
          })
          .catch((err) => {
            console.log(err);
            this.$message({
              message: "Duyệt tất cả các ảnh thất bại",
              type: "error",
            });
          });
      });
    },
  },

  beforeMount() {
    this.getClass();
    this.getAlumDetail();
  },
};
</script>

<style lang="scss" scoped>
.content {
  .row-data {
    margin-bottom: 20px;
  }

  .button-over {
    border-radius: 0;
    margin-left: 3px;
  }
  .button-left {
    margin-right: 5px;
    width: 145px;
  }
  .button-click-left {
    display: inline-block;
  }
  .button-click {
    float: right;
  }
  .table-content {
    .el-table {
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      border: 1px solid #78a5e7;
    }
  }
  .paging-click {
    .el-pagination {
      text-align: right;
      margin: 30px 0;
    }
  }
  /deep/.el-table th.gutter {
    background-color: #78a5e7;
  }
  /deep/.el-table--scrollable-y .el-table__body-wrapper {
    overflow-y: auto;
    margin-top: -1px;
  }
  /deep/.el-table .cell {
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: pre-line;
    word-break: break-all;
    line-height: 23px;
    padding-right: 10px;
    // max-height: 50px;
    text-overflow: ellipsis;
  }
  /deep/.el-range-editor.el-input__inner {
    display: inline-flex;
    align-items: center;
    padding: 3px 10px;
    width: 260px;
  }
  /deep/.el-input-group > .el-input__inner {
    vertical-align: middle;
    display: table-cell;
    margin-left: 5px;
  }
  /deep/.element.style {
    width: 257px !important;
  }
}
.el-dropdown-menu {
  position: absolute;
  top: 0;
  left: 0;
  padding: 0 0;
  margin: 3px 0;
  background-color: rgb(95, 180, 74);
  border: 1px solid #ebeef5;
  border-radius: 0;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.el-dropdown-menu li {
  color: white;
  border-top: 1px solid white;
  font-family: Arial, Helvetica, sans-serif;
}
li.el-select-dropdown__item.hover {
  background: rgb(111, 142, 189);
}
/deep/.el-table td,
/deep/.el-table th {
  padding: 6px 0;
}
.click-fullname {
  border: none;
  padding: 0;
  color: blue;
}
.click-fullname:hover {
  color: blue;
  background: none;
}

/deep/.el-checkbox__inner {
  border: 1px solid green;
}
/deep/.el-select .el-input__inner {
  -webkit-appearance: none;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border-bottom: 1px solid #dcdfe6;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  // height: 65px;
  line-height: 65px;
  outline: 0;
  padding: 0 15px;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 150px;
}
/deep/.el-input .el-input__inner {
  -webkit-appearance: none;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border-bottom: 1px solid #dcdfe6;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  // height: 65px;
  line-height: 65px;
  outline: 0;
  padding: 0 15px;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 300px;
}
/deep/.el-textarea__inner {
  display: block;
  resize: vertical;
  padding: 5px 15px;
  line-height: 1.5;
  box-sizing: border-box;
  width: 94%;
  font-size: inherit;
  color: #606266;
  background-color: #fff;
  background-image: none;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}

/deep/.el-upload--picture-card {
  background-color: #fbfdff;
  border: 1px dashed #c0ccda;
  border-radius: 6px;
  box-sizing: border-box;
  width: 148px;
  height: 148px;
  line-height: 146px;
  margin-left: 35px;
  vertical-align: top;
}
/deep/input.el-input__inner {
  height: 37px;
}
/deep/[data-v-1fb81136] input.el-input__inner {
  height: 37px;
  border: none;
  border-bottom: 1px solid #80808057;
}

.el-image-opacity:hover {
  opacity: 5 !important;
  border: 1px solid #409eff;
}
.el-image-opacity {
  cursor: pointer;
  opacity: 5 !important;
  border: 1px solid grey;
}
/deep/.el-button {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  border: 1px solid #dcdfe6;
  color: #ffffff;
  -webkit-appearance: none;
  text-align: center;
  box-sizing: border-box;
  outline: 0;
  margin: 0;
  transition: 0.1s;
  font-weight: 500;
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 4px !important;
}
</style>
