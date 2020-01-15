<template>
  <el-dialog
    id="identity-modification"
    title="修改身份"
    :visible.sync="show_dialog"
    width="500px"
    style="padding: 0 20px"
    center>
    <div class="dialog-body">
      <div>
        <label for="identity-old">该用户的原始身份：</label>
        <span id="identity-old">{{format_identity(identity_old)}}</span>
      </div>
      <div style="margin-top: 20px">
        <label for="identity-list">修改用户的身份为：</label>
        <el-select id="identity-list" v-model="identity_selected" placeholder="请选择">
          <el-option

            v-for="item in identity_list"
            :key="item.value"
            :label="item.name"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="show_dialog = false">取 消</el-button>
      <el-button type="primary" @click="show_dialog = false">确认修改</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { UserIdentifyEnum } from '../../../../utils/data/enum';
  const identity_list = [
    {name: '普通会员', value: UserIdentifyEnum.ORDINARY_MEMBER},
    {name: '芯客', value: UserIdentifyEnum.XIN_CUSTOMER},
    {name: '导师', value: UserIdentifyEnum.GUIDANCE_TEACHER},
    {name: '校董', value: UserIdentifyEnum.PRINCIPAL}
  ];
  export default {
    name: "IdentityModification",
    data () {
      return {
        show_dialog: false,
        identity_old: 1,
        user_info: '',
        identity_list: identity_list,
        identity_selected: '',
      }
    },
    methods: {
      show_modification_dialog (data) {
        this.show_dialog = true;
      },
      format_identity (val) {
        for (let i = 0; i < identity_list.length; i++) {
          if(identity_list[i].value === val){
            return identity_list[i].name;
          }
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  #identity-modification{
    label{
      display: inline-block;
      width: 150px;
      text-align: right;
      margin-right: 10px;
    }
    .dialog-body{
      padding: 0 30px;
    }
  }
</style>
