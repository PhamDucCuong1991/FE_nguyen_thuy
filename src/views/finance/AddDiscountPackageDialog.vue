<template>
  <el-dialog
    :title="'Thêm giảm giá các khoản tháng ' + monthText"
    :visible.sync="dialogVisible"
    width="800px"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    top="10vh"
  >
    <el-form
      label-width="150px"
      :model="dataInput"
      label-position="left"
      :rules="rules"
      ref="dataInput"
    >
      <el-row :gutter="20">
        <el-col :span="16">
          <el-form-item label="Chọn khoản" prop="id">
            <el-select
              v-model="dataInput.id"
              placeholder="Chọn khoản"
              filterable
              @change="selectPackageMethod()"
              style="width: 100%"
            >
              <el-option
                v-for="item in responseList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Loại" prop="category">
            <el-select
              disabled
              v-model="dataInput.category"
              @change="changeDiscountTypeMethod()"
              placeholder="Loại"
            >
              <el-option label="Thu" value="in"></el-option>
              <el-option label="Chi" value="out"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="Mô tả" prop="description">
        <el-input
          disabled
          :rows="1"
          type="textarea"
          v-model="dataInput.description"
        ></el-input>
      </el-form-item>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Giảm giá" prop="discount">
            <el-radio-group v-model="dataInput.discount">
              <el-radio :label="true">Có</el-radio>
              <el-radio :label="false">Không</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Khoản duyệt, khóa" prop="approvedLocked">
            <el-radio-group v-model="dataInput.approvedLocked">
              <el-radio :label="true">Có</el-radio>
              <el-radio :label="false">Không</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12" v-if="dataInput.discount">
          <el-form-item label="Loại giảm giá" prop="discountType">
            <el-select
              v-model="dataInput.discountType"
              @change="changeDiscountTypeMethod()"
              placeholder="Loại"
            >
              <el-option label="Phần trăm" value="percent"></el-option>
              <el-option label="Tiền" value="money"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="dataInput.discount">
          <el-form-item
            :label="
              dataInput.discountType == 'percent'
                ? 'Phần trăm giảm'
                : 'Tiền giảm'
            "
            prop="discountNumber"
          >
            <el-input-number
              style="width: 100%"
              v-if="dataInput.discountType == 'percent'"
              v-model="dataInput.discountNumber"
              :precision="0"
              :min="0"
              :max="100"
            >
            </el-input-number>
            <el-currency-input
              v-else-if="dataInput.discountType == 'money'"
              v-model="dataInput.discountNumber"
            />
          </el-form-item>
        </el-col>
      </el-row>
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
        <span>{{ $t("button.save") }}</span>
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import FnFeesService from "@/services/FnFeesService";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      dataInput: {
        id: "",
        name: "",
        category: "",
        description: "",
        discount: true,
        approvedLocked: "",
        discountType: "percent",
        discountNumber: "",
      },
      objectAdd: {
        discount: true,
        approvedLocked: "",
        discountType: "percent",
        discountNumber: "",
        date: "",
        idKidList: [],
      },
      monthText: "",
      responseList: [],
      loadingButton: false,
      rules: {
        id: [
          {
            required: true,
            message: "Thông tin không được để trống",
            trigger: "blur",
          },
        ],
        discount: [
          {
            required: true,
            message: "Thông tin không được để trống",
            trigger: "change",
          },
        ],
        approvedLocked: [
          {
            required: true,
            message: "Thông tin không được để trống",
            trigger: "change",
          },
        ],
        discountType: [
          {
            required: true,
            message: "Thông tin không được để trống",
            trigger: "change",
          },
        ],
        discountNumber: [
          {
            required: true,
            message: "Thông tin không được để trống",
            trigger: "change",
          },
        ],
      },
    };
  },
  methods: {
    closeDialog() {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.responseList = [];
        this.$refs["dataInput"].resetFields();
      }, 300);
    },
    selectPackageMethod() {
      let idPackageSelected = this.dataInput.id;
      let object = this.responseList.filter(
        (x) => x.id == idPackageSelected
      )[0];
      this.dataInput = Object.assign({}, object, this.objectAdd);
    },
    checkSubmitForm() {
      if (this.dataInput.discount) {
        if (this.dataInput.discountNumber == 0) {
          let alertText =
            this.dataInput.discountType == "percent"
              ? "Phần trăm giảm"
              : "Tiền giảm";
          this.$message({
            message: alertText + " phải lớn hơn 0",
            type: "error",
          });
          throw null;
        }
      }
    },
    submitForm() {
      this.$refs["dataInput"].validate((valid) => {
        if (valid) {
          this.checkSubmitForm();
          this.dataInput.date = this.$parent.dataSearch.date;
          this.dataInput.idKidList = this.$parent.multipleSelectionKids.map(
            (x) => x.id
          );
          this.loadingButton = true;
          FnFeesService.addKidsDiscountService(this.dataInput)
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
        }
      });
    },
    getAddDataInitial() {
      this.monthText = this.moment(this.$parent.dataSearch.date).format(
        "MM-YYYY"
      );
      FnFeesService.getPackageInSchool()
        .then((resp) => {
          this.responseList = resp.data.data;
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-input-number__decrease,
/deep/.el-input-number__increase {
  z-index: 1;
}
</style>
