<template>
  <div class="exr_con">
    <div class="exr_search">
      <div class="tcw_main_title">筛选查询</div>
      <div class="exr_search_con">
        <div class="flex">
          <span class="exr_search_title">爆币批次号：</span>
          <el-input v-model="search_value" style="width: 70%;" placeholder="请输入爆币批次号"></el-input>
        </div>
        <div class="flex margin_left">
          <span class="exr_search_title">审核状态：</span>
          <el-select v-model="coin_type" style="width:70%" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="flex margin_left">
          <el-button type="primary" @click="search_data()">查询</el-button>
        </div>
      </div>
    </div>
    <div class="tab_all">
      <div class="tab_title">
        <span class="tcw_main_title">数据列表</span>
        <!-- <el-button type="primary" @click="add_rules()">添加规则</el-button> -->
      </div>
      <el-table
        :data="table_data"
        tooltip-effect="dark"
        style="width: 100%;margin-bottom: 30px;margin-top: 40px"
        :header-cell-style="this.tableHeaderColor"
      >
        <el-table-column label="爆币批次号" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.coinApplyId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="币类型" align="center">
          <template>
            <span>TUE</span>
          </template>
        </el-table-column>

        <el-table-column label="用户数" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.userNum }}</span>
          </template>
        </el-table-column>
        <el-table-column label="球总数" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.ballNum }}</span>
          </template>
        </el-table-column>
        <el-table-column label="爆币总额" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.totalCoins }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">
            <span>{{ timestampToTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="过期时间" align="center">
          <template slot-scope="scope">
            <span>{{ timestampToTime(scope.row.updateTime )}}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        @current-change="currentPageChange"
        :current-page="currentPage"
        :page-size="pagesize"
        layout="total,prev, pager, next"
        :total="totla"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { coinBallList } from "../../apis/contentRules";
export default {
  name: "explosionRecords",
  components: {},
  data() {
    return {
      options: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "1",
          label: "TUE"
        }
        // {
        //   value: "2",
        //   label: "POC"
        // }
      ],
      coin_type: "",
      search_value: "",
      currentPage: 1,
      pagesize: 10,
      totla: 0,
      table_data: [],
      sea_value: ""
    };
  },

  created() {
    this.initial_data();
  },
  mounted() {},
  computed: {},
  methods: {
    // 分页
    currentPageChange(e) {
      this.currentPage = e;
      let data = {
        page: this.currentPage,
        rows: 10,
        coinApplyId: this.sea_value,
        coinType: ""
      };
      this.get_data(data);
    },
    get_data(data) {
      coinBallList(data).then(response => {
        this.table_data = response.data.data;
        this.totla = response.data.total;
        if (arguments.length == 2) {
          this.sea_value = this.search_value;
        }
      });
    },

    initial_data() {
      this.currentPage = 1;
      let data = {
        page: 1,
        rows: 10,
        coinApplyId: "",
        coinType: ""
      };
      this.get_data(data);
    },
    search_data() {
      if (this.search_value == "") {
        let data = {
          page: 1,
          rows: 10,
          coinApplyId: this.search_value,
          coinType: ""
        };
        this.get_data(data, 1);
      } else {
        let re = /^\+?[0-9][0-9]*$/;
        if (!re.test(this.search_value)) {
          this.$message.error("爆币批次号为数字，请正确输入批次号！");
        } else {
          let data = {
            page: 1,
            rows: 10,
            coinApplyId: this.search_value,
            coinType: ""
          };
          this.get_data(data, 1);
        }
      }
    }
  }
};
</script>
<style>
</style>
<style  scoped>
.el-pagination {
  position: relative;
  float: right;
  margin-right: 3%;
}
.exr_con {
  background-color: #ffffff;
  padding: 20px 30px;
  padding-bottom: 60px;
}
.flex {
  width: 28%;
  display: flex;
}
.exr_search_con {
  display: flex;
  margin-top: 30px;
}
.exr_search_title {
  font-size: 16px;
  display: inline-block;
  line-height: 2.5;
  width: 120px;
}
.margin_left {
  margin-left: 5%;
}
.tab_title {
  display: flex;
  justify-content: space-between;
}
.tab_all {
  margin-top: 50px;
}
</style>