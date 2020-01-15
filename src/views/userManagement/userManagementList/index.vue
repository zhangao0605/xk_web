<template>
  <div id="user-management-list" class="tcw_container tcw_height_auto">
    <el-row>
      <el-col :span="8">
        <label for="phone_number">手机号</label>
        <el-input id="phone_number" v-model="phone_number" clearable class="search-item"></el-input>
      </el-col>
      <el-col :span="8">
        <label for="address">用户地址</label>
        <el-input id="address" v-model="address" clearable class="search-item"></el-input>
      </el-col>
      <el-col :span="8">
        <label for="identity-list">用户身份</label>
        <el-select id="identity-list" v-model="identity_type_selected" placeholder="请选择" class="search-item">
          <el-option
            v-for="item in identity_list"
            :key="item.value"
            :label="item.name"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row style="margin-top: 20px;">
      <el-col :span="8">
        <label for="AI_status">半生AI开启状态</label>
        <el-select id="identity-list" v-model="AI_status_selected" placeholder="请选择" class="search-item">
          <el-option label="全部" value="-1"></el-option>
          <el-option label="已开启" value="1"></el-option>
          <el-option label="未开启" value="0"></el-option>
        </el-select>
      </el-col>
      <el-col :span="8">
        <label for="MTO_status">是否发行MTO</label>
        <el-select id="identity-list" v-model="MTO_status_selected" placeholder="请选择" class="search-item">
          <el-option label="全部" value="-1"></el-option>
          <el-option label="已发行" value="1"></el-option>
          <el-option label="未发行" value="0"></el-option>
        </el-select>
      </el-col>
      <el-col :span="8" style="text-align: center">
        <el-button type="primary" @click="delete_white_list_batch()" style="width: 120px">查询</el-button>
      </el-col>
    </el-row>

    <div class="table-area">
      <el-table
        :data="table_data"
        border
        @selection-change="handle_data_selection_change"
        style="width: 100%; margin-top: 30px">
        <el-table-column
          v-for="item in table_header_list"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          align="center">
        </el-table-column>
        <el-table-column
          width="200"
          align="center"
          label="操作">
          <template slot-scope="scope">
            <el-link type="primary" :underline="false" @click="check_data(scope.row)">查看</el-link>
            <el-link type="primary" :underline="false" @click="change_identity(scope.row)" style="margin-left: 20px">修改身份</el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      v-show="data_total / page_size > 1"
      background
      style="margin-top: 10px;text-align: right"
      @current-change="handle_page_index_change"
      :current-page.sync="page_index"
      :page-size="page_size"
      layout="total, prev, pager, next"
      :total="data_total">
    </el-pagination>

    <identity-modification ref="modifyIdentity"/>

  </div>
</template>

<script>
  import userManagementApi from "../../../apis/userManagementApi";
  import IdentityModification from "./components/IdentityModification";
  import { UserIdentifyEnum } from '../../../utils/data/enum';
  const identity_list = [
    {name: '普通会员', value: UserIdentifyEnum.ORDINARY_MEMBER},
    {name: '芯客', value: UserIdentifyEnum.XIN_CUSTOMER},
    {name: '导师', value: UserIdentifyEnum.GUIDANCE_TEACHER},
    {name: '校董', value: UserIdentifyEnum.PRINCIPAL}
  ];
  export default {
    components: { IdentityModification },
    data () {
      let table_data = [{},{},{}];
      let table_header_list = [
        new TableHeader('用户名', 'abc', 100),
        new TableHeader('用户手机号', 'abc', 100),
        new TableHeader('邀请码', 'abc', 100),
        new TableHeader('用户身份', 'abc', ''),
        new TableHeader('用户地址', 'abc', ''),
        new TableHeader('是否是芯客', 'abc', 100),
        new TableHeader('芯客时间', 'abc', 200),
        new TableHeader('团员数量', 'abc', 100),
        new TableHeader('是否开启伴生AI', 'abc', ''),
        new TableHeader('伴生AI时间', 'abc', 200),
        new TableHeader('芯城总积分', 'abc', 100),
        new TableHeader('芯品总积分', 'abc', 100),
        new TableHeader('合作的芯城', 'abc', 100),
        new TableHeader('合作的芯品', 'abc', 100),
        new TableHeader('用户BTO(数字钱包)', 'abc', ''),
        new TableHeader('用户MTO(数字钱包)', 'abc', ''),
        new TableHeader('用户TUE(数字钱包)', 'abc', ''),
        new TableHeader('用户BTO(通证钱包)', 'abc', ''),
        new TableHeader('用户MTO(通证钱包)', 'abc', ''),
        new TableHeader('用户TUE(通证钱包)', 'abc', ''),
        new TableHeader('预估总资(元)', 'abc', ''),
      ];
      return {
        phone_number: '',
        address: '',
        identity_list: identity_list,
        identity_type_selected: '',
        AI_status_selected: '',
        MTO_status_selected: '',
        table_data: table_data,
        table_header_list: table_header_list,
        data_selection_list: [],
        page_index: 1,
        page_size: 10,
        data_total: 0,

      }
    },
    created () {
      this.get_data_list();
    },
    methods: {
      get_data_list () {
        userManagementApi.get_user_management_list().then(() => {

        })
      },
      search_data () {
        this.page_index = 1;
        this.get_data_list();
      },
      handle_page_index_change () {
        this.get_data_list()
      },
      handle_data_selection_change () {

      },
      check_data (item) {
        this.$router.push({
          name: 'userDetail',
          params: {id: '12'}
        })
      },
      change_identity(item) {
        this.$refs.modifyIdentity.show_modification_dialog(item);
      },
    }
  }
  class TableHeader{
    constructor(label, prop, width){
      this.label = label;
      this.prop = prop;
      this.width = width;
    }
  }
</script>

<style scoped lang="scss">
  #user-management-list{
    label{
      display: inline-block;
      width: 120px;
      text-align: right;
    }
    .table-area{
      width: 100%;
      overflow: auto;
    }
    .search-item{
      width: 200px;
      margin-left: 20px;
    }
  }
</style>
