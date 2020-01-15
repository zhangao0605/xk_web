<template>
  <div class="excor_con">
    <el-dialog
      title="爆币审核"
      :visible.sync="dialog_visible"
      width="30%"
      :before-close="dialog_cancle"
    >
      <el-form
        :model="rule_form"
        :rules="rules"
        ref="rule_form"
        label-width="150px"
        class="demo-rule_form"
      >
        <el-form-item label="币类型">
          <el-radio v-model="rule_form.is_pass" :disabled="disabled" label="1">审核通过</el-radio>
          <el-radio v-model="rule_form.is_pass" :disabled="disabled" label="2">审核驳回</el-radio>
        </el-form-item>
        <el-form-item label="反馈详情" prop="desc">
          <el-input
            :disabled="disabled"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 6}"
            placeholder="请输入内容"
            style="width:80%"
            v-model="rule_form.desc"
          ></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog_cancle()">取 消</el-button>
        <el-button type="primary" @click="dialog_sure()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- <div class="aw_search">
      <div class="tcw_main_title">筛选查询</div>
      <div class="aw_search_con">
        <div class="flex">
          <span class="aw_search_title">币类型：</span>
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
          <span class="aw_search_title">审核状态：</span>
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
        <!-- <el-button type="primary" @click="add_rules()">添加规则</el-button> -->
      </div>
      <el-table
        ref="multipleTable"
        :data="table_data"
        tooltip-effect="dark"
        style="width: 100%;margin-bottom: 30px;margin-top: 40px"
        :header-cell-style="this.tableHeaderColor"
      >
        <el-table-column label="币类型" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.cointype=='1'?'TUE':'POC' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="球爆币最小值" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.coinminvalue }}</span>
          </template>
        </el-table-column>
        <el-table-column label="球爆币最大值" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.coinmaxvalue }}</span>
          </template>
        </el-table-column>
        <el-table-column label="每次每人球个数" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.ballno }}</span>
          </template>
        </el-table-column>
        <el-table-column label="时间间隔（m)" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.period }}</span>
          </template>
        </el-table-column>
        <el-table-column label="单日用户币上限" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.perlimit }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createtime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="球过期时间（h）" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.expiredate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="审核状态" align="center">
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
        </el-table-column>

        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <span
              class="operational_style"
              @click="table_review(scope.row.id)"
              v-if="scope.row.ischeck==3"
            >审核</span>
            <span v-else class="operational_style" @click="table_view(scope.row)">查看</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- <el-pagination
        background
        @current-change="currentPageChange"
        :current-page="currentPage"
        :page-size="pagesize"
        layout="total,prev, pager, next"
        :total="totla"
      ></el-pagination>-->
    </div>
  </div>
</template>

<script>
// import {
//   CoinBurstRuleQuery,
//   CoinBurstRuleAdd,
//   CoinBurstRuleQueryCointype,
//   CoinBurstRuleUpdate
// } from "../../apis/contentRules";
export default {
  name: "explosiveCoinReview",
  components: {},
  data() {
    return {
      disabled: false,
      table_data: [],
      rule_form: {
        is_pass: "1",
        desc: ""
      },
      rules: {
        desc: [{ required: true, message: "请输入反馈详情", trigger: "blur" }]
      },
      dialog_visible: false,
      edit_id: "",
      is_post: false
    };
  },

  created() {
    this.initial_data();
  },
  mounted() {},
  computed: {},
  methods: {
    get_data(data) {
      CoinBurstRuleQuery(data).then(response => {
        this.table_data = response.resultMap.List;
        this.totla = response.resultMap.recordNumber;
      });
    },

    initial_data() {
      let data = {
        cointype: "",
        ischeck: "",
        currentIndex: 0,
        pageSize: 10
      };
      this.get_data(data);
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
    table_review(e) {
      this.disabled = false;
      this.is_post = true;
      this.edit_id = e;
      this.dialog_visible = true;
    },
    dialog_cancle() {
      this.dialog_visible = false;
      this.$refs["rule_form"].resetFields();
      this.rule_form = {
        is_pass: "1",
        desc: ""
      };
    },
    // 确认审核
    dialog_sure() {
      if (this.submitForm()) {
        if (this.is_post) {
          let data = {
            id: this.edit_id,
            ischeck: this.rule_form.is_pass,
            suggestion: this.rule_form.desc
          };
          CoinBurstRuleUpdate(data).then(response => {
            this.$message.success("爆币规则审核成功！");
            this.initial_data();
            this.dialog_cancle();
          });
        } else {
          this.dialog_cancle();
        }
      }
    },
    //  查看
    table_view(e) {
      this.is_post = false;
      this.disabled = true;
      this.edit_id = e.id;
      this.rule_form = {
        is_pass: e.ischeck,
        desc: e.suggestion
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
.excor_con {
  background-color: #ffffff;
  padding: 20px 30px;
  padding-bottom: 60px;
}
.flex {
  width: 28%;
  display: flex;
}
.excor_search_con {
  display: flex;
  margin-top: 30px;
}
.excor_search_title {
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
</style>