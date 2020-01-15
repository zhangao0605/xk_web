<template>
  <div id="white-list-management" class="tcw_container tcw_height_auto">
    <el-row>
      <el-col :span="9">
        <label for="phone-number">手机号</label>
        <el-input id="version-id" v-model="phone_number" clearable placeholder="请输入手机号" style="width:40%;margin: 0 20px 0 10px"></el-input>
        <el-button type="primary" @click="search_white_list" style="width:100px; margin-left: 15px">搜索</el-button>
      </el-col>
      <el-col :span="10">
        <el-button type="primary" @click="delete_white_list_batch()">批量删除</el-button>
      </el-col>
      <el-col :span="5" style="text-align: right">
        <el-button type="primary" @click="show_white_list_addition_dialog = true">添加手机号</el-button>
      </el-col>
    </el-row>

    <el-table
      :data="table_data"
      border
      @selection-change="handle_selection_change"
      style="width: 100%; margin-top: 30px">
      <el-table-column
        type="selection"
        width="100px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="Phone"
        align="center"
        label="手机号">
      </el-table-column>
      <el-table-column
        prop="CrateTime"
        align="center"
        label="添加时间">
      </el-table-column>
      <el-table-column
        align="center"
        label="操作">
        <template slot-scope="scope">
          <el-link type="primary" :underline="false" @click="delete_white_list_single(scope.row)" style="margin-left: 20px">删除</el-link>
        </template>
      </el-table-column>
    </el-table>

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

    <el-dialog title="添加白名单" :visible.sync="show_white_list_addition_dialog" width="600px">
      <el-form :model="form" :rules="rules" label-width="100px" style="padding: 0 20px;">
        <el-form-item label="白名单手机号" prop="phone">
          <el-input v-model="form.phone" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="show_white_list_addition_dialog = false">取 消</el-button>
        <el-button type="primary" @click="create_white_list">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import settingsApi from "../../../apis/settingsApi";
  import { validPhoneNumber } from '../../../utils/validate'
  export default {
    data () {
      return {
        table_data: [],
        phone_number: '',
        phone_selection_list: [],
        page_index: 1,
        page_size: 10,
        data_total: 0,
        show_white_list_addition_dialog: false,
        form: {
          phone: ''
        },
        rules: {
          phone:[]
        }
      }
    },
    created () {
      this.get_white_list()
    },
    methods: {
      get_white_list () {
        let current_index = (this.page_index - 1) * this.page_size;
        settingsApi.get_white_list(this.phone_number.trim(), current_index, this.page_size ).then((res) => {
          let data = res['resultMap'] || {};
          this.table_data = data.List || [];
          this.data_total = data.recordNumber || 0;
        }).catch(() => {

        })
      },
      search_white_list () {
        this.phone_number = this.phone_number.trim();
        if (this.phone_number && !validPhoneNumber(this.phone_number)) {
          this.$message({
            message: '请输入正确的手机号',
            type: 'warning'
          });
          return;
        }
        this.page_index = 1;
        this.get_white_list()
      },
      handle_page_index_change () {
        this.get_white_list()
      },
      handle_selection_change (val) {
        this.phone_selection_list = val
      },
      delete_white_list_batch () {
        if(!this.phone_selection_list || !this.phone_selection_list.length){
          this.$message({
            message: '请在表格中选择需要操作的数据',
            type: 'warning'
          });
          return;
        }
        let operate_list = this.phone_selection_list.map((item) => {
          return item.Id
        }).join(',');
        this.delete_white_list (operate_list)
      },
      delete_white_list_single (item) {
        this.$confirm(`确认删除${item.Phone}?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let white_list = item.Id + '';
          this.delete_white_list(white_list);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '您已取消删除'
          });
        });
      },
      create_white_list () {
        this.form.phone = this.form.phone.trim();
        if (!this.form.phone) {
          this.$message({
            message: '请输入手机号',
            type: 'warning'
          });
          return;
        }
        if (!validPhoneNumber(this.form.phone)) {
          this.$message({
            message: '请输入正确的手机号',
            type: 'warning'
          });
          return;
        }
        settingsApi.create_white_list(this.form.phone).then(() => {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.show_white_list_addition_dialog = false;
          this.get_white_list();
        }).catch(() => {
          this.show_white_list_addition_dialog = false;
        })
      },
      delete_white_list (white_list) {
        settingsApi.delete_white_list(white_list).then(() => {
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          this.get_white_list();
        }).catch(() => {
          //TODO
        })
      }
    }
  }
</script>

<style scoped>

</style>
