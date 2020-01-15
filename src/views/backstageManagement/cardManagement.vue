<template>
  <div>
    <div class="bam_con">
      <el-tabs v-model="active_name" @tab-click="handleClick">
        <div class="bam_search"></div>
        <div class="exr_search">
          <div class="exr_search_con">
            <div class="flex" style="width:30%">
              <el-input v-model="searchs.search_phone" style="width: 70%;" placeholder="请输入手机号进行搜索"></el-input>
              <div class="flex" style="margin-left:10%">
                <el-button type="primary" @click="search_phone()">查询</el-button>
              </div>
            </div>
            <div class="flex" style="width:40%;margin-left:2%">
              <el-select v-model="searchs.is_transfer" style="width:70%" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-select
                v-model="searchs.is_use"
                style="width:70%"
                class="margin_left"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in options_1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <div class="flex" style="margin-left:7.5%">
                <el-button type="primary" @click="search_filter()">筛选</el-button>
              </div>
            </div>
          </div>
        </div>
        <el-tab-pane label="芯城卡管理" name="10"></el-tab-pane>
        <el-tab-pane label="芯品卡管理" name="11"></el-tab-pane>
        <el-tab-pane label="芯客卡管理" name="1"></el-tab-pane>
        <el-tab-pane label="城客卡管理" name="20"></el-tab-pane>
        <el-tab-pane label="品客卡管理" name="21"></el-tab-pane>
        <el-tab-pane label="伴生AI卡管理" name="2"></el-tab-pane>
      </el-tabs>
      <el-table
        :data="table_data"
        tooltip-effect="dark"
        style="width: 100%;margin-bottom: 30px;margin-top: 40px"
        :header-cell-style="this.tableHeaderColor"
      >
        <el-table-column label="卡编号" align="center" fixed width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.projectNo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" width="200">
          <template slot-scope="scope">
            <span>{{ timestampToTime(scope.row.createTime)}}</span>
          </template>
        </el-table-column>

        <el-table-column label="过期时间" align="center" width="200">
          <template slot-scope="scope">
            <span>{{ timestampToTime(scope.row.useEndTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建人ID" align="center" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.userId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建人身份" align="center" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.parentIdentity==0?'普通用户':scope.row.parentIdentity==1?'芯客':scope.row.parentIdentity==2?'导师':'校董'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建人手机" align="center" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.parentPhone }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否已转让" align="center" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.parentId==0?'否':'是' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="受让人ID" align="center" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.userId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="受让人手机" align="center" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.phone }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否已使用" align="center" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.status==1?'是':'否' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="使用时间" align="center" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.updateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否已过期" align="center" width="200" fixed="right" v-if="is_co">
          <template slot-scope="scope">
            <span>{{ scope.row.status==2?'是':'否' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="兑换的商城" align="center" width="200" fixed="right" v-if="!is_co">
          <template slot-scope="scope">
            <span>{{ scope.row.projectName }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        @current-change="currentPageChange"
        :current-page="currentPage"
        :page-size="pagesize"
        layout="total,prev, pager, next"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { usercard } from "../../apis/contentRules";
import { validPhoneNumber } from "../../utils/validate";
export default {
  name: "",
  components: {},
  data() {
    return {
      active_name: "10",
      currentPage: 1,
      pagesize: 10,
      total: 0,
      searchs: {
        search_phone: "",
        is_transfer: "",
        is_use: ""
      },
      options: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "1",
          label: "已转让"
        },
        {
          value: "0",
          label: "未转让"
        }
      ],
      options_1: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "0",
          label: "未使用"
        },
        {
          value: "1",
          label: "已使用"
        },
        {
          value: "2",
          label: "未使用已过期"
        },
        {
          value: "3",
          label: "使用后已过期"
        }
      ],
      table_data: [],
      is_co: false,
      seach_ph: ""
      // is_card_title: ""
    };
  },

  created() {
    this.initial_data();
  },
  mounted() {},
  computed: {},
  methods: {
    get_data(e) {
      usercard(e).then(response => {
        this.table_data = response.data.data;
        this.total = response.data.total;
        if (arguments.length == 2) {
          this.seach_ph = this.searchs.search_phone;
        }
      });
    },
    initial_data() {
      this.currentPage = 1;
      this.searchs = {
        search_phone: "",
        is_transfer: "",
        is_use: ""
      };
      let data = {
        // 卡类型 1 芯客卡 2 伴生AI卡 10 芯城卡 11 芯品卡 20 城客卡 21 品客卡
        cardType: this.active_name,
        // 是否转让 0 未转让  1 一转让
        existParent: "",
        // 是否使用0 待使用 1 已使用
        status: "",
        // 芯城卡编号
        projectNo: "",
        phone: "",
        // 一直为空
        project: "",
        address: "",
        rows: "10",
        page: "1"
      };
      this.get_data(data);
    },
    handleClick() {
      if (this.active_name == "10" || this.active_name == "11") {
        this.is_co = false;
      } else {
        this.is_co = true;
      }
      this.initial_data();
    },
    // 分页
    currentPageChange(e) {
      if (arguments.length == 1) {
        this.currentPage = e;
      }
      let data = {
        cardType: this.active_name,
        existParent: this.searchs.is_transfer,
        status: this.searchs.is_use,
        phone: this.seach_ph,
        projectNo: "",
        project: "",
        address: "",
        rows: "10",
        page: this.currentPage
      };
      this.get_data(data);
    },
    // 手机号搜索
    search_phone() {
      if (validPhoneNumber(this.searchs.search_phone)) {
        this.searchs.is_use = "";
        this.searchs.is_transfer = "";
        this.currentPage = 1;
        let data = {
          cardType: this.active_name,
          existParent: "",
          status: "",
          phone: this.searchs.search_phone,
          projectNo: "",
          project: "",
          address: "",
          rows: "10",
          page: 1
        };
        if (this.searchs.search_phone == "") {
          data.phone = "";
        }
        this.get_data(data, 1);
      } else {
        this.$message.error("请输入正确手机号进行搜索！");
      }
    },
    // 条件筛选
    search_filter() {
      this.currentPage = 1;
      this.currentPageChange(this.currentPage, 1);
    }
  }
};
</script>
<style>
.bam_con .el-tabs__item {
  font-size: 18px;
}
</style>
<style  scoped>
.el-pagination {
  position: relative;
  float: right;
  margin-right: 3%;
}
.bam_con {
  background-color: #ffffff;
  padding: 20px 30px;
  padding-bottom: 60px;
}
.exr_search_title {
  font-size: 16px;
  display: inline-block;
  line-height: 2.5;
  width: 120px;
}
.exr_search_con {
  display: flex;
  margin-top: 30px;
}
.flex {
  width: 28%;
  display: flex;
}
.margin_left {
  margin-left: 5%;
}
</style>