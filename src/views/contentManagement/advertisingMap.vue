<template>
  <div
    class="aw_con"
    v-loading="loading"
    element-loading-background="rgba(0, 0, 0, 0.8) opacity: 0.7"
  >
    <!-- 添加广告 -->
    <el-dialog
      :title="dia_title.name"
      :visible.sync="dialogVisible"
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
        <el-form-item label="活动名称" prop="name">
          <el-input v-model="rule_form.name" style="width: 80%;"></el-input>
        </el-form-item>
        <el-form-item label="有效期" prop="date">
          <el-date-picker
            v-model="rule_form.date"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            style="width: 80%;"
            value-format="timestamp"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="横幅图片" prop="image_url">
          <el-upload
            class="avatar-uploader"
            action
            :show-file-list="false"
            :http-request="handle_request"
          >
            <img v-if="rule_form.local_url" :src="rule_form.local_url" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="横幅链接">
          <el-input v-model="rule_form.link" style="width: 80%;"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog_cancle()">取 消</el-button>
        <el-button type="primary" @click="dialog_sure()">确 定</el-button>
      </span>
    </el-dialog>
    <div class="aw_search">
      <div class="tcw_main_title">筛选查询</div>
      <div class="aw_search_con">
        <div class="flex">
          <span class="aw_search_title">横幅名称：</span>
          <el-input v-model="search_value" placeholder="请输入横幅名称" style="width:65%"></el-input>
        </div>
        <div class="flex margin_left">
          <span class="aw_search_title">启用状态：</span>
          <el-select v-model="select_value" style="width:65%" placeholder="请选择">
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
        <el-button type="primary" @click="add_ads()">添加横幅</el-button>
      </div>
      <div class="aw_search_con">
        <div class="flex">
          <span class="aw_search_title">批量操作：</span>
          <el-select v-model="select_value_1" style="width:65%" placeholder="请选择">
            <el-option
              v-for="item in options_1"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="flex margin_left">
          <el-button type="primary" @click="batch_operation()">批量操作</el-button>
        </div>
      </div>
      <el-table
        ref="multipleTable"
        :data="table_data"
        tooltip-effect="dark"
        style="width: 100%;margin-bottom: 30px;margin-top: 40px"
        @selection-change="handleSelectionChange"
        :header-cell-style="this.tableHeaderColor"
      >
        <el-table-column type="selection" align="center" width="80"></el-table-column>
        <el-table-column label="横幅名称" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="横幅图片" align="center">
          <template slot-scope="scope">
            <el-image style="width: 100px; height: 100px" :src="scope.row.imageUrl" fit="contain"></el-image>
          </template>
        </el-table-column>
        <el-table-column label="有效期" align="center" width="300">
          <template slot-scope="scope">
            <span>{{timestampToTime(scope.row.beginTime)}}&nbsp;至&nbsp;{{timestampToTime(scope.row.endTime)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="启用状态" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status==1"
              active-color="#7D46F5"
              inactive-color="#BFBFBF"
              @change="swich_is([scope.row.id],scope.row.status)"
            ></el-switch>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div class="table_edit">
              <span class="operational_style" @click="table_edit(scope.row)">编辑</span>
              <!-- <span class="operational_style" @click="table_del(scope.row.id)">删除</span> -->
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
</template>

<script>
import {
  appimage,
  statusUpdate,
  UpdateAdStateOpen,
  UpdateAdStateClose,
  projectUpload,
  appimageAdd,
  // AdMangementDelete,
  appimageUpdate
} from "../../apis/contentRules";
export default {
  name: "advertisingMap",
  components: {},
  data() {
    return {
      dia_title: {
        name: "",
        the_way: 0
      },
      rule_form: {
        name: "",
        date: "",
        image_url: "",
        local_url: "",
        link: ""
      },
      rules: {
        name: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
        date: [
          {
            required: true,
            message: "请选择开始结束时间",
            trigger: "change"
          }
        ],
        image_url: [
          {
            required: true,
            message: "请选择上传的图片",
            trigger: "change"
          }
        ]
      },

      dialogVisible: false,
      loading: false,
      search_value: "",
      options: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "1",
          label: "启用"
        },
        {
          value: "0",
          label: "禁用"
        }
      ],
      select_value: "",
      options_1: [
        {
          value: "",
          label: "请选择操作"
        },
        {
          value: "0",
          label: "批量启用"
        },
        {
          value: "1",
          label: "批量禁用"
        }
      ],
      select_value_1: "",
      table_data: [],
      multiple_selection: [],
      currentPage: 1,
      pagesize: 10,
      totla: 0,
      edit_id: "",
      filters: {
        name: "",
        status: ""
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
      appimage(data).then(response => {
        this.table_data = response.data.data;
        this.totla = response.data.total;
        if (arguments.length == 2) {
          this.filters.name = this.search_value;
          this.filters.status = this.select_value;
        }
      });
    },
    initial_data() {
      this.search_value = "";
      this.select_value = "";
      this.select_value = "";
      this.currentPage = 1;
      let data = {
        page: this.currentPage,
        rows: 10,
        status: "",
        type: "1",
        name: ""
      };
      this.get_data(data);
    },
    // 筛选
    search_data() {
      this.currentPage = 1;
      this.select_value_1 = "";
      let data = {
        page: this.currentPage,
        rows: 10,
        status: this.select_value,
        type: "1",
        name: this.search_value
      };
      this.get_data(data, 1);
    },
    // 分页
    currentPageChange(e) {
      this.currentPage = e;
      let data = {
        page: this.currentPage,
        rows: 10,
        status: this.filters.status,
        type: "1",
        name: this.filters.name
      };
      this.get_data(data);
    },
    // 全选
    handleSelectionChange(val) {
      this.multiple_selection = val;
    },
    // 批量操作
    batch_operation() {
      if (this.multiple_selection.length === 0) {
        this.$message.error("请选择后在进行批量操作！");
      } else {
        if (this.select_value_1 == "") {
          this.$message.error("请选择批量禁用、批量启用后，在进行批量操作！");
        } else {
          let arr = [];
          this.multiple_selection.forEach((item, index, self) => {
            arr.push(item.id);
          });
          // console.log(arr);
          this.swich_is(arr, this.select_value_1);
        }
      }
    },
    // 开关
    swich_is(e, q) {
      this.loading = true;
      if (q == 1) {
        let data = { idList: e, status: 0 };
        statusUpdate(data).then(response => {
          this.currentPageChange(this.currentPage);
          this.$message.success("启用状态修改成功！");
          let that = this;
          setTimeout(() => {
            that.loading = false;
          }, 500);
        });
      } else {
        let data = { idList: e, status: 1 };
        statusUpdate(data).then(response => {
          this.currentPageChange(this.currentPage);
          this.$message.success("启用状态修改成功！");
          let that = this;
          setTimeout(() => {
            that.loading = false;
          }, 500);
        });
      }
      // statusUpdate
    },
    // 添加广告
    add_ads() {
      this.dia_title.name = "添加横幅";
      this.dia_title.the_way = 0;
      this.dialogVisible = true;
    },
    // 取消添加
    dialog_cancle() {
      this.$refs["rule_form"].resetFields();
      this.rule_form = {
        name: "",
        date: "",
        image_url: "",
        local_url: "",
        link: ""
      };
      this.dialogVisible = false;
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
          let data = {
            name: this.rule_form.name,
            beginTime: this.rule_form.date[0] / 1000,
            endTime: this.rule_form.date[1] / 1000,
            imageUrl: this.rule_form.image_url,
            url: this.rule_form.link,
            type: 1
          };
          appimageAdd(data).then(response => {
            this.$message.success("横幅添加成功！");
            this.initial_data();
            this.dialog_cancle();
          });
        } else {
          let data = {
            name: this.rule_form.name,
            beginTime: this.rule_form.date[0] / 1000,
            endTime: this.rule_form.date[1] / 1000,
            imageUrl: this.rule_form.image_url,
            url: this.rule_form.link,
            id: this.edit_id
          };
          appimageUpdate(data).then(response => {
            this.$message.success("横幅编辑成功！");
            this.currentPageChange(this.currentPage);
            this.dialog_cancle();
          });
        }
      } else {
      }
    },
    handle_request(param) {
      let form = new FormData();
      form.append("file", param.file);
      projectUpload(form).then(response => {
        const reader = new FileReader();
        reader.readAsDataURL(param.file);
        reader.onload = () => {
          const _base64 = reader.result;
          this.rule_form.local_url = _base64; //将_base64赋值给图片的src，实现图片预览
        };
        this.rule_form.image_url = response.data;
        // this.$refs["rule_form"].clearValidate("image_url");
      });
    },

    // 删除广告
    table_del(e) {
      let data = { id: e };
      AdMangementDelete(data).then(response => {
        let data = {
          page: this.currentPage,
          rows: 10,
          status: this.select_value,
          type: "1",
          name: this.search_value
        };
        this.$message.success("删除成功！");
        this.get_data(data);
      });
    },
    // 编辑广告
    table_edit(e) {
      this.dia_title.name = "编辑横幅";
      this.dia_title.the_way = 1;
      this.edit_id = e.id;
      this.rule_form = {
        name: e.name,
        date: [e.beginTime * 1000, e.endTime * 1000],
        local_url: e.imageUrl,
        image_url: e.imageUrl,
        link: e.url
      };
      this.dialogVisible = true;
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
.aw_con {
  background-color: #ffffff;
  padding: 20px 30px;
  padding-bottom: 60px;
}
.flex {
  width: 28%;
  display: flex;
}
.aw_search_con {
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
</style>