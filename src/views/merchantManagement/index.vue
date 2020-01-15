<template>
  <div class="tcw_container tcw_height_auto">
    <div class="tcw_main_title">
      供商管理
    </div>

    <el-row class="block">
      <el-col :span="24" style="text-align:right">
        <el-button type="primary" @click="to_add_merchant">添加商户或供应商</el-button>
      </el-col>
    </el-row>

    <el-table
      :data="tableData"
      border
      class="block"
      style="width: 100%">
      <el-table-column
        align="center"
        prop="merchantNo"
        label="商户序号">
      </el-table-column>
      <el-table-column
        align="center"
        prop="name"
        label="单位名称">
      </el-table-column>
      <el-table-column
        align="center"
        prop="contactName"
        label="联系人">
      </el-table-column>
      <el-table-column
        align="center"
        prop="contactPhone"
        label="联系人电话">
      </el-table-column>
      <el-table-column
        align="center"
        prop="createTime"
        label="创建时间"
        :formatter="format_time"
        width="180">
      </el-table-column>
      <el-table-column
        align="center"
        prop="status"
        :formatter="format_status"
        label="上架状态">
      </el-table-column>
      <el-table-column
        align="center"
        label="操作">
        <template slot-scope="scope">
          <el-button @click="to_check_merchant(scope.row)" type="text" size="small">查看</el-button>
          <el-button @click="to_modify_merchant(scope.row)" type="text" size="small">修改</el-button>
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

    <MerchantOperation ref="MerchantOperation" @onSuccess="search_merchant_list"/>
  </div>
</template>

<script>
  import merchantManagementApi from "../../apis/merchantManagementApi";
  import MerchantOperation from "./components/MerchantOperation";
  export default {
    data () {
      return {
        company_no: '',
        tableData: [],
        data_total: 0,
        page_size: 10,
        page_index: 1
      }
    },
    components: { MerchantOperation },
    created () {
      this.get_merchant_list();
    },
    methods: {
      get_merchant_list () {
        merchantManagementApi.get_merchant_list(this.page_index, this.page_size ).then((res) => {
          let data = res['data'] || {};
          this.tableData = data.data ||[];
          this.data_total = data.total || 0;
        }).catch(() => {
          //TODO;
        })
      },
      search_merchant_list () {
        this.page_index = 1;
        this.get_merchant_list();
      },
      handle_page_index_change () {
        this.get_merchant_list()
      },
      to_add_merchant () {
        this.$refs.MerchantOperation.show_dialog('addition');
      },
      to_check_merchant (item) {
        this.$refs.MerchantOperation.show_dialog('checking', item);
      },
      to_modify_merchant(item) {
        this.$refs.MerchantOperation.show_dialog('modification', item);
      },
      format_time (row, col) {
        let content = row[col.property];
        if (this.$isNullOrEmpty(content)) {
          return;
        }
        return this.$formatTime(content)
      },
      format_status (row, col) {
        let status = row[col.property];
        if (this.$isNullOrEmpty(status)) {
          return;
        }
        return status ? '开启' : '关闭'
      }
    }
  }
</script>

<style scoped>
  .block{
    margin-top: 30px;
  }
</style>
