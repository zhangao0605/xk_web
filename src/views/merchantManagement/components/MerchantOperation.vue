<template>
  <el-dialog
    :title="title"
    :visible.sync="dialog_visible"
    width="800px"
    center>
    <el-form ref="data" :model="data"  :rules="rule" label-width="200px">
      <el-form-item label="商户名" prop="name">
        <el-input v-model="data.name" style="width: 300px" :disabled="is_locked"></el-input>
      </el-form-item>
      <el-form-item label="商户所在地" prop="province">
        <AddressSelection
          :_provinceName = 'data.province'
          :_cityName = 'data.city'
          :_areaName = 'data.district'
          v-if="show_type !== 'checking' && dialog_visible"
          @change="handle_address_selection_change"/>
        <div v-if="show_type === 'checking'">
          <el-input v-model="data.province" style="width: 120px" :disabled="is_locked"/>
          <el-input  v-model="data.city" style="width:120px; margin-left: 10px;" :disabled="is_locked"/>
          <el-input  v-model="data.district" style="width:120px; margin-left: 10px;" :disabled="is_locked"/>
        </div>
      </el-form-item>
      <el-form-item label="银行卡号" prop="bankAccount">
        <el-input v-model="data.bankAccount" style="width: 300px" :disabled="is_locked"></el-input>
      </el-form-item>
      <el-form-item label="银行名称" prop="bankName">
        <el-input v-model="data.bankName" style="width: 300px" :disabled="is_locked"></el-input>
      </el-form-item>
      <el-form-item label="收款人姓名" prop="bankReceiverName">
        <el-input v-model="data.bankReceiverName" style="width: 300px" :disabled="is_locked"></el-input>
      </el-form-item>
      <el-form-item label="收款人身份证" prop="bankIdCard">
        <el-input v-model="data.bankIdCard" style="width: 300px" :disabled="is_locked"></el-input>
      </el-form-item>
      <el-form-item label="联系人姓名" prop="contactName">
        <el-input v-model="data.contactName" style="width: 300px" :disabled="is_locked"></el-input>
      </el-form-item>
      <el-form-item label="联系人电话" prop="contactPhone">
        <el-input v-model="data.contactPhone" style="width: 300px" :disabled="is_locked"></el-input>
      </el-form-item>
      <el-form-item label="联系人微信" prop="contactWechat">
        <el-input v-model="data.contactWechat" style="width: 300px" :disabled="is_locked"></el-input>
      </el-form-item>
      <el-form-item label="开启状态" v-if="show_type === 'checking' || show_type === 'modification'" prop="status">
        <el-select v-model="data.status" placeholder="请选择" :disabled="is_locked">
          <el-option label="开启" :value="MerchantOpeningStatusEnum.OPEN"></el-option>
          <el-option label="关闭" :value="MerchantOpeningStatusEnum.CLOSED"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialog_visible = false">取 消</el-button>
      <el-button type="primary" @click="to_operate">确 定</el-button>
    </span>
  </el-dialog>

</template>

<script>
  import merchantManagementApi from "../../../apis/merchantManagementApi";
  import { validPhoneNumber, validID  } from '../../../utils/validate';
  import { MerchantOpeningStatusEnum } from '../../../utils/data/enum';
  import AddressSelection from '../../../components/AddressSelection';
  const TitleEnum = {
    checking: '查看商户详情',
    addition: '添加商户',
    modification: '修改商户',
  };

  const rule =  {
    name: [
      { required: true, message: '请输入商户名', trigger: 'blur' },
    ],
    province: [
      { required: true, message: '请输入商户所在地', trigger: 'blur' },
    ],
    bankAccount: [
      { required: true, message: '请输入银行卡号', trigger: 'blur' },
    ],
    bankName: [
      { required: true, message: '请输入银行名称', trigger: 'blur' },
    ],
    bankReceiverName: [
      { required: true, message: '请输入收款人姓名', trigger: 'blur' },
    ],
    bankIdCard: [
      { required: true, message: '请输入收款人身份证', trigger: 'blur' },
    ],
    contactName: [
      { required: true, message: '请输入联系人姓名', trigger: 'blur' },
    ],
    contactPhone: [
      { required: true, message: '请输入联系人电话', trigger: 'blur' },
    ],
    contactWechat: [
      { required: true, message: '请输入联系人微信', trigger: 'blur' },
    ],
    status: [
      { required: true, message: '请选择开启状态', trigger: 'blur' },
    ],
  };
  export default {
    name: "MerchantOperation",
    components: { AddressSelection },
    data () {
      return {
        dialog_visible: false,
        show_type: '',   // addition 、 modification 、checking
        title: '',
        data: {},
        rule: {},
        locations:{
          province_list: [],
          city_list: [],
          district_list: [],
        },
        is_locked: true, // 冻结修改
        MerchantOpeningStatusEnum: MerchantOpeningStatusEnum
      }
    },
    methods: {
      /**
       *
       * @param show_type 可以传'checking' 、 'addition'、'modification'
       * @param data
       */
      show_dialog(show_type, data){
        this.show_type = show_type;
        this.title = TitleEnum[show_type];
        this.data = JSON.parse(JSON.stringify(data || {}));
        this.is_locked = show_type === 'checking';
        if (show_type === 'checking') {
          this.is_locked = true;
        } else {
          this.is_locked = false;
          this.rule = rule
        }
        this.dialog_visible = true;
      },
      to_operate () {
        switch (this.show_type) {
          case 'addition': this.add_merchant(); break;
          case 'modification': this.update_merchant();break;
          case 'checking': this.check_merchant();break;
        }
      },
      add_merchant () {
        this.tips_before_calling_interface().then(() => {
          return merchantManagementApi.add_merchant(this.data)
        }).then(() => {
          this.$message({
            message: '创建成功',
            type: 'success'
          });
          this.dialog_visible = false;
          this.$emit('onSuccess')
        }).catch(() => {
          // TODO;
        });
      },
      update_merchant () {
        this.tips_before_calling_interface().then(() => {
          return merchantManagementApi.update_merchant(this.data)
        }).then(() => {
          this.$message({
            message: '修改成功',
            type: 'success'
          });
          this.dialog_visible = false;
          this.$emit('onSuccess')
        }).catch(() => {
          // TODO;
        })
      },
      tips_before_calling_interface () {
        console.log(this.data);
        return new Promise((resolve, reject) => {
          let fill_all = true;
          for (let key in this.data) {
            if (this.data.hasOwnProperty(key) && this.$isNullOrEmpty(this.data[key])){
              this.warning('请检查所有内容是否都已选择或填写');
              fill_all = false;
              break;
            }
          }
          if (fill_all) {
            if (!validID(this.data.bankIdCard)) {
              this.warning('请输入正确的收款人身份证号');
              reject();
            } else if (!validPhoneNumber(this.data.contactPhone)) {
              this.warning('请输入正确的联系人电话');
              reject();
            } else {
              resolve();
            }
          } else {
            reject();
          }
        })
      },
      handle_address_selection_change (address) {
        console.log(address);
        this.data.province = address.province &&  address.province.name;
        this.data.city = address.city &&  address.city.name;
        this.data.district = address.area &&  address.area.name;
      },
      warning (text) {
        this.$message({
          message: text,
          type: 'warning'
        });
      }
    }
  }
</script>

<style scoped lang="scss">
  /deep/.el-input.is-disabled .el-input__inner {
    color: #666;
  }
</style>
