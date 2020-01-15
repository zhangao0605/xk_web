<template>
  <div>
    <!-- 添加消息 -->
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
        <el-form-item label="商户名称" prop="name">
          <el-input v-model="rule_form.name" style="width: 80%;"></el-input>
        </el-form-item>
        <el-form-item label="公告内容" prop="con">
          <el-input
            v-model="rule_form.con"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入公告内容"
            style="width: 80%;"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog_cancle()">取 消</el-button>
        <el-button type="primary" @click="dialog_sure()">确 定</el-button>
      </span>
    </el-dialog>
    <div
      class="pit_con"
      v-loading="loading"
      element-loading-background="rgba(0, 0, 0, 0.8) opacity: 0.7"
    >
      <div class="tab_all">
        <div class="tab_title">
          <span class="tcw_main_title">消息管理</span>
          <div>
            <!-- <el-button type="primary" @click="add_poster()">发布消息</el-button> -->
          </div>
        </div>
        <el-table
          ref="multipleTable"
          :data="table_data"
          tooltip-effect="dark"
          style="width: 100%;margin-bottom: 30px;margin-top: 40px"
          :header-cell-style="this.tableHeaderColor"
        >
          <!-- <el-table-column type="selection" align="center" width="200"></el-table-column> -->
          <el-table-column label="公告标题" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column label="发布时间" align="center">
            <template slot-scope="scope">
              <span>{{ timestampToTime(scope.row.updateTime )}}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" align="center" width="200">
            <template slot-scope="scope">
              <div class="table_edit">
                <span class="operational_style" @click="table_edit(scope.row)">编辑</span>
                <span class="operational_style" @click="table_del(scope.row.id)">删除</span>
              </div>
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
  </div>
</template>

<script>
import {
  messageappList,
  messageappStatusupdate,
  messageappUpdate
} from "../../apis/contentRules";
export default {
  name: "news",
  components: {},
  data() {
    return {
      loading: false,
      table_data: [],
      currentPage: 1,
      pagesize: 10,
      totla: 0,
      dialog_visible: false,
      rule_form: {
        name: "",
        con: ""
      },
      rules: {
        name: [{ required: true, message: "请输入公告名称", trigger: "blur" }],
        con: [{ required: true, message: "请输入公告内容", trigger: "blur" }]
      },
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
    get_data(data) {
      messageappList(data).then(response => {
        this.table_data = response.data.data;
        this.totla = response.data.total;
      });
    },
    initial_data() {
      this.currentPage = 1;
      let data = { page: this.currentPage, rows: 10 };
      this.get_data(data);
    },
    // 分页
    currentPageChange(e) {
      this.currentPage = e;
      let data = { page: this.currentPage, rows: 10 };
      this.get_data(data);
    },
    // 添加消息
    add_poster() {
      this.dia_title.name = "添加消息";
      this.dia_title.the_way = 0;
      this.dialog_visible = true;
    },
    // 取消添加
    dialog_cancle() {
      this.$refs["rule_form"].resetFields();
      this.rule_form = {
        name: "",
        con: ""
      };
      this.dialog_visible = false;
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
    // 确认添加
    dialog_sure() {
      if (this.submitForm()) {
        if (this.dia_title.the_way == 0) {
          // let data = {
          //   MessageTitel: this.rule_form.name,
          //   MessageContent: this.rule_form.con
          // };
          // MessageInsert(data).then(response => {
          //   this.$message.success("消息添加成功！");
          //   this.dialog_cancle();
          //   this.currentPageChange(this.currentPage);
          // });
        } else {
          let data = {
            title: this.rule_form.name,
            content: this.rule_form.con,
            id: this.edit_id
          };
          messageappUpdate(data).then(response => {
            this.$message.success("消息编辑成功！");
            this.dialog_cancle();
            this.currentPageChange(this.currentPage);
          });
        }
      } else {
      }
    },
    // 编辑广告
    table_edit(e) {
      this.dia_title.name = "编辑消息";
      this.dia_title.the_way = 1;
      this.edit_id = e.id;
      this.rule_form = {
        name: e.title,
        con: e.content
      };
      this.dialog_visible = true;
    },
    //删除
    table_del(e) {
      let data = {
        idList: [e],
        status: 2
      };
      messageappStatusupdate(data).then(response => {
        this.$message.success("删除成功！");
        if (this.table_data.length == 1) {
          if (this.currentPage > 1) {
            this.currentPageChange(this.currentPage - 1);
          }
        } else {
          this.currentPageChange(this.currentPage);
        }
      });
    }
  }
};
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #7d46f5;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 138px;
  height: 138px;
  line-height: 138px;
  text-align: center;
}
.avatar {
  width: 138px;
  height: 138px;
  display: block;
}
</style>
<style  scoped>
.el-pagination {
  position: relative;
  float: right;
  margin-right: 3%;
}
.pit_con {
  background-color: #ffffff;
  padding: 20px 30px;
  padding-bottom: 60px;
}
.flex {
  width: 28%;
  display: flex;
}
.tab_title {
  display: flex;
  justify-content: space-between;
}
.table_edit {
  display: flex;
  justify-content: space-around;
}
</style>