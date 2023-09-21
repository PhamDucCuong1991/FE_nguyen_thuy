<template>
  <div>
    <el-table
      ref="multipleTable"
      :empty-text="textTableSetting"
      v-loading="loadingData"
      :element-loading-text="$tableLoadding"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255,255,255, 0)"
      highlight-current-row
      :data="cameraSettingList"
      :header-cell-style="$funcCommon.tableHeaderColorFunction"
      :max-height="$tableMaxHeight"
      border
    >
      <el-table-column
        type="index"
        label="STT"
        width="50"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="className"
        label="Tên lớp"
        width="200"
      ></el-table-column>
      <el-table-column label="Danh sách camera">
        <template slot-scope="scope">
          <el-tag
            style="margin-right: 8px"
            v-for="item in scope.row.cameraList"
            :key="item.id"
            type
            effect="plain"
            >{{ item.camName }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="Tác vụ" width="150" align="center" v-if="checkPermission(['schoolConfig_cameraSchool_update'])">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="success"
            @click="addCameraForClassMethod(scope.row)"
            >Thêm Camera</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <AddCameraForClassSchoolDialog
      :dialogVisible="showAddCameraDialog"
      @dialog-close="dialogCloseAddCameraMethod()"
      ref="AddCameraForClassSchoolDialog"
    />
  </div>
</template>

<script>
import checkPermission from "@/utils/permission.js";
import SchoolConfigService from "@/services/SchoolConfigService";
import AddCameraForClassSchoolDialog from "./AddCameraForClassSchoolDialog.vue";
export default {
  components: {
    AddCameraForClassSchoolDialog,
  },
  data() {
    return {
      dataSearch: {
        idGrade: "",
        idClass: "",
        className: "",
      },
      loadingData: true,
      showAddCameraDialog: false,
      cameraSettingList: [],
    };
  },
  methods: {
    checkPermission,
    addCameraForClassMethod(row) {
      setTimeout(() => {
        this.showAddCameraDialog = true;
      }, 100);
      this.$refs.AddCameraForClassSchoolDialog.getCameraForClassInitial(row.id);
    },
    dialogCloseAddCameraMethod() {
      this.showAddCameraDialog = false;
      this.searchByProperties();
    },
    searchByProperties() {
      this.loadingData = true;
      let data = this.dataSearch;
      SchoolConfigService.findAllCameraSettingSchool(
        data.idGrade,
        data.idClass,
        data.className
      )
        .then((resp) => {
          this.cameraSettingList = resp.data.data;
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        })
        .finally(() => {
          if (this.cameraSettingList == null) {
            this.textTableSetting = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },
  },
  beforeMount() {
    this.searchByProperties();
  },
};
</script>
