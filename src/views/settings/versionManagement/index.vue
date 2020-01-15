<template>
  <div class="tcw_container tcw_height_auto" id="version-management">
    <div class="tcw_main_title">
      版本管理
    </div>
    <el-row class="block">
      <el-col :span="6">
        <label for="version-id">版本号</label>
        <el-input id="version-id" v-model="version_id" clearable placeholder="请输入版本号" style="width:70%;margin: 0 20px 0 10px"></el-input>
      </el-col>
      <el-col :span="5">
        <el-button type="primary" style="width:100px" @click="search_version_list">查询</el-button>
      </el-col>
      <el-col :span="13" style="text-align:right">
        <router-link to="/versionAddition"><el-button type="primary" style="width:100px">添加版本</el-button></router-link>
      </el-col>
    </el-row>
    <el-table
      :data="table_data"
      class="block"
      border>
      <el-table-column
        prop="versionNo"
        align="center"
        label="版本号">
      </el-table-column>
      <el-table-column
        prop="os"
        align="center"
        :formatter="format_app_type"
        label="APP类型">
      </el-table-column>
      <el-table-column
        prop="forceUpdate"
        align="center"
        :formatter="format_app_update_type"
        label="更新类型">
      </el-table-column>
      <el-table-column
        prop="createTime"
        align="center"
        label="创建时间">
      </el-table-column>
      <el-table-column
        align="center"
        label="操作">
        <template slot-scope="scope">
          <el-link type="primary" :underline="false" @click="check_version(scope.row)">查看</el-link>
          <el-link type="primary" :underline="false" @click="delete_version(scope.row)" style="margin-left: 20px">删除</el-link>
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
  </div>
</template>

<script>
  import settingsApi from '../../../apis/settingsApi';
  import { AppTypeEnum, AppUpdateTypeEnum } from '../../../utils/data/enum';
  export default {
    data () {
      return {
        version_id: '',
        table_data: [],
        data_total: 0,
        page_size: 10,
        page_index: 1,
      }
    },
    created () {
      this.get_version_list()
    },
    methods:{
      get_version_list () {
        let version_id = this.version_id && this.version_id.trim();
        settingsApi.get_version_list(version_id, this.page_index, this.page_size).then((res) => {
          let data = res['data'] || {};
          this.table_data = data.data || [];
          this.data_total = data.total || 0;
        }).catch(() => {
          // TODO;
        })
      },
      search_version_list () {
        this.page_index = 1;
        this.get_version_list()
      },
      handle_page_index_change () {
        this.get_version_list()
      },
      format_app_type (row, col) {
        let type = row[col.property];
        if (this.$isNullOrEmpty(type)) {
          return;
        }
        switch (type - 0) {
          case AppTypeEnum.ANDROID: return 'Android';
          case AppTypeEnum.IOS: return 'ios';
        }
      },
      format_app_update_type (row, col) {
        let type = row[col.property];
        if (this.$isNullOrEmpty(type)) {
          return;
        }
        switch (type - 0) {
          case AppUpdateTypeEnum.UNFORCED: return '非强制';
          case AppUpdateTypeEnum.FORCE: return '强制';
        }
      },
      check_version (item) {
        this.$storage.temp('session', 'versionDetail', item);
        let that = this;
        setTimeout(() => {
          that.$router.push('/versionDetail');
        })
      },
      delete_version (item) {
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          settingsApi.delete_version(item.id).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.get_version_list()
          }).catch(() => {
            //TODO;
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '您已取消删除'
          });
        });

      }
    }
  }
</script>

<style scoped lang="scss">
  #version-management{
    .block{
      margin-top: 30px;
    }
  }
</style>
