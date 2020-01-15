<template>
  <div
    class="exru_con"
    v-loading="loading"
    element-loading-background="rgba(0, 0, 0, 0.8) opacity: 0.7"
  >
    <el-dialog
      :title="dia_title.name"
      :visible.sync="dialog_visible"
      width="40%"
      :before-close="dialog_cancle"
    >
      <el-form
        :model="rule_form"
        :rules="rules"
        ref="rule_form"
        label-width="150px"
        class="demo-rule_form"
      >
        <el-form-item label="币类型" prop="coin_type">
          <el-select v-model="rule_form.coin_type" disabled style="width:70%" placeholder="请选择">
            <el-option
              v-for="item in options_2"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="球爆币最小值" prop="coin_min_value">
          <el-input v-model.number="rule_form.coin_min_value" style="width: 70%;"></el-input>
          <span class="unit">个</span>
        </el-form-item>
        <el-form-item label="球爆币最大值" prop="coin_max_value">
          <el-input v-model.number="rule_form.coin_max_value" style="width: 70%;"></el-input>
          <span class="unit">个</span>
        </el-form-item>
        <el-form-item label="时间间隔" prop="period">
          <el-input v-model.number="rule_form.period" style="width: 70%;"></el-input>
          <span class="unit">秒</span>
        </el-form-item>
        <el-form-item label="球过期时间" prop="expiredate">
          <el-input v-model.number="rule_form.expiredate" style="width: 70%;"></el-input>
          <span class="unit">秒</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog_cancle()">取 消</el-button>
        <el-button type="primary" @click="dialog_sure()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- <div class="exru_search">
      <div class="tcw_main_title">筛选查询</div>
      <div class="exru_search_con">
        <div class="flex">
          <span class="exru_search_title">币类型：</span>
          <el-select v-model="coin_type" style="width:65%" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="flex margin_left">
          <span class="exru_search_title">审核状态：</span>
          <el-select v-model="is_check" style="width:65%" placeholder="请选择">
            <el-option
              v-for="item in options_1"
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
    </div>-->
    <div class="tab_all">
      <div class="tab_title">
        <span class="tcw_main_title">数据列表</span>
        <el-button type="primary" @click="add_rules()">添加规则</el-button>
      </div>
      <el-table
        ref="multipleTable"
        :data="table_data"
        tooltip-effect="dark"
        style="width: 100%;margin-bottom: 30px;margin-top: 40px"
        :header-cell-style="this.tableHeaderColor"
      >
        <el-table-column label="币类型" align="center">
          <template slot-scope>
            <span>TUE</span>
          </template>
        </el-table-column>
        <el-table-column label="球爆币最小值" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.coinMinValue }}</span>
          </template>
        </el-table-column>
        <el-table-column label="球爆币最大值" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.coinMaxValue }}</span>
          </template>
        </el-table-column>
        <el-table-column label="每次每人球个数" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.ballNum }}</span>
          </template>
        </el-table-column>
        <el-table-column label="时间间隔（s)" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.periodTime }}</span>
          </template>
        </el-table-column>

        <el-table-column label="球过期时间（s）" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.expireTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">
            <span>{{ timestampToTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="审核状态" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.ischeck==1?'审核通过':scope.row.ischeck==2?'审核驳回':'待审核'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="审核时间" align="center">
          <template slot-scope="scope">
            <span
              v-if="scope.row.updatetime==''||scope.row.updatetime==undefined||scope.row.updatetime==null"
            >--</span>
            <span v-else>{{scope.row.updatetime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="管理员ID" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.adminid }}</span>
          </template>
        </el-table-column>-->

        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <span class="operational_style" @click="table_edit(scope.row)">编辑</span>
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
import {
  coinBallRuleList,
  coinBallRuleAdd,
  // CoinBurstRuleQueryCointype,
  coinBallRuleUpdate
} from "../../apis/contentRules";
export default {
  name: "explosionRules",
  components: {},
  data() {
    return {
      disabled: false,
      loading: false,
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
      options_2: [
        {
          value: "1",
          label: "TUE"
        }
        // {
        //   value: "2",
        //   label: "POC"
        // }
      ],
      options_1: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "1",
          label: "审核通过"
        },
        {
          value: "2",
          label: "已驳回"
        },
        {
          value: "3",
          label: "待审核"
        }
      ],
      is_check: "",
      currentPage: 1,
      pagesize: 10,
      totla: 0,
      table_data: [],
      rule_form: {
        coin_type: "1",
        coin_min_value: "",
        coin_max_value: "",
        period: "",
        expiredate: ""
      },
      rules: {
        coin_min_value: [
          { required: true, message: "请输入球爆币最小值", trigger: "blur" },
          { type: "number", message: "球爆币最小值必须为数字值" }
        ],
        coin_max_value: [
          { required: true, message: "请输入球爆币最大值", trigger: "blur" },
          { type: "number", message: "球爆币最大值必须为数字值" }
        ],
        period: [
          { required: true, message: "请输入时间间隔", trigger: "blur" },
          { type: "number", message: "时间间隔必须为数字值" }
        ],
        expiredate: [
          { required: true, message: "请输入球过期时间", trigger: "blur" },
          { type: "number", message: "过期时间必须为数字值" }
        ]
      },
      dialog_visible: false,
      dia_title: {
        name: "",
        the_way: 0
      }
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
      let data = { page: this.currentPage, rows: 10, coinType: "" };
      this.get_data(data);
    },
    // search_data() {
    //   let data = {
    //     cointype: this.coin_type,
    //     ischeck: this.is_check,
    //     currentIndex: 0,
    //     pageSize: 10
    //   };
    //   this.get_data(data);
    // },
    get_data(data) {
      coinBallRuleList(data).then(response => {
        this.table_data = response.data.data;
        this.totla = response.data.total;
      });
    },

    initial_data() {
      this.currentPage = 1;
      let data = { page: 1, rows: 10, coinType: "" };
      this.get_data(data);
    },
    // 添加规则
    add_rules() {
      this.dia_title.name = "添加爆币规则";
      this.dia_title.the_way = 0;
      this.dialog_visible = true;
    },
    submitForm() {
      let is_ok;
      this.$refs["rule_form"].validate(valid => {
        if (valid) {
          is_ok = true;
        } else {
          is_ok = false;
          return false;
        }
      });
      return is_ok;
    },
    // 取消添加
    dialog_cancle() {
      this.$refs["rule_form"].resetFields();
      this.rule_form = {
        coin_type: "1",
        coin_min_value: "",
        coin_max_value: "",
        period: "",
        expiredate: ""
      };
      this.dialog_visible = false;
    },
    // 确认添加
    dialog_sure() {
      if (this.submitForm()) {
        if (this.dia_title.the_way == 0) {
          let data = {
            coinType: this.rule_form.coin_type,
            ballNum: "1",
            coinMinValue: this.rule_form.coin_min_value,
            coinMaxValue: this.rule_form.coin_max_value,
            periodTime: this.rule_form.period,
            expireTime: this.rule_form.expiredate,
            status: 0
          };
          coinBallRuleAdd(data).then(response => {
            this.$message.success("爆币规则添加成功！");
            this.initial_data(this.currentPage);
            this.dialog_cancle();
          });
        } else {
          let data = {
            id: this.edit_id + "",
            coinType: this.rule_form.coin_type,
            ballNum: "1",
            coinMinValue: this.rule_form.coin_min_value,
            coinMaxValue: this.rule_form.coin_max_value,
            periodTime: this.rule_form.period,
            expireTime: this.rule_form.expiredate,
            status: 0
          };
          coinBallRuleUpdate(data).then(response => {
            this.$message.success("爆币规则编辑成功！");
            this.currentPageChange(this.currentPage);
            this.dialog_cancle();
          });
        }
      } else {
      }
    },
    // 编辑规则
    table_edit(e) {
      this.dia_title.name = "编辑爆币规则";
      this.dia_title.the_way = 1;
      this.edit_id = e.id;
      this.rule_form = {
        coin_type: e.coinType + "",
        coin_min_value: e.coinMinValue,
        coin_max_value: e.coinMaxValue,
        period: e.periodTime,
        expiredate: e.expireTime
      };
      this.dialog_visible = true;
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
.exru_con {
  background-color: #ffffff;
  padding: 20px 30px;
  padding-bottom: 60px;
}
.flex {
  width: 28%;
  display: flex;
}
.exru_search_con {
  display: flex;
  margin-top: 30px;
}
.aw_search_title {
  font-size: 16px;
  display: inline-block;
  line-height: 2.5;
  width: 90px;
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
.table_edit {
  display: flex;
  justify-content: space-around;
}
.unit {
  display: inline-block;
  font-size: 16px;
  margin-left: 5%;
  color: rgb(125, 70, 245);
}
</style>