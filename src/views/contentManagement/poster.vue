<template>
  <div>
    <!-- 添加广告 -->
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
        <el-form-item label="图片上传" prop="image_url">
          <el-upload
            class="avatar-uploader"
            action
            :show-file-list="false"
            :beforeUpload="this.before_avatar_upload"
            :http-request="handle_request"
          >
            <img v-if="rule_form.local_url" :src="rule_form.local_url" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span class="tcw_auxiliary_text">只能上传jpg/png格式文件，文件不能超过2M</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog_cancle()">取 消</el-button>
        <el-button type="primary" @click="dialog_sure()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 宣传链接 -->
    <!-- <el-dialog
      title="宣传链接"
      :visible.sync="dialog_visible_1"
      width="40%"
      :before-close="dialog_link_cancle"
    >
      <el-form
        :model="rule_form_1"
        :rules="rules_1"
        ref="rule_form_1"
        label-width="150px"
        class="demo-rule_form"
      >
        <el-form-item label="宣传链接" prop="edit_link">
          <el-input v-model="rule_form_1.edit_link" style="width: 80%;"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog_link_cancle()">取 消</el-button>
        <el-button type="primary" @click="dialog_link_sure()">确 定</el-button>
      </span>
    </el-dialog>-->
    <div
      class="pit_con"
      v-loading="loading"
      element-loading-background="rgba(0, 0, 0, 0.8) opacity: 0.7"
    >
      <div class="tab_all">
        <div class="tab_title">
          <span class="tcw_main_title">海报管理</span>
          <div>
            <el-button type="primary" @click="add_poster()">添加海报</el-button>
            <!-- <el-button type="primary" @click="promotion_link()">宣传链接</el-button> -->
          </div>
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
          <el-table-column type="selection" align="center" width="200"></el-table-column>
          <el-table-column label="图片" align="center">
            <template slot-scope="scope">
              <el-image style="width: 100px; height: 100px" :src="scope.row.imageUrl" fit="contain"></el-image>
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

          <el-table-column label="操作" align="center" width="200">
            <template slot-scope="scope">
              <div class="table_edit">
                <span class="operational_style" @click="table_edit(scope.row)">编辑</span>
                <!-- <span class="operational_style" @click="table_del(scope.row)">删除</span> -->
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
  appimage,
  statusUpdate,
  // UpdateAdStateClose,
  // UpdateAdStateOpen,
  projectUpload,
  appimageAdd,
  appimageUpdate
} from "../../apis/contentRules";
export default {
  name: "poster",
  components: {},
  data() {
    return {
      loading: false,
      multiple_selection: [],
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
      currentPage: 1,
      pagesize: 10,
      totla: 0,
      dialog_visible: false,
      dialog_visible_1: false,
      rule_form: {
        image_url: "",
        local_url: ""
      },
      rules: {
        image_url: [
          {
            required: true,
            message: "请选择上传的图片",
            trigger: "change"
          }
        ]
      },
      rule_form_1: {
        edit_link: "",
        id: ""
      },
      rules_1: {
        edit_link: [
          { required: true, message: "请输入宣传链接", trigger: "blur" }
        ]
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
      appimage(data).then(response => {
        this.table_data = response.data.data;
        this.totla = response.data.total;
      });
    },
    initial_data() {
      this.currentPage = 1;
      let data = { page: 1, rows: 10, status: "", type: "2", name: "" };
      this.get_data(data);
    },
    // get_poster_link() {
    //   PosterQRMangementQry().then(response => {
    //     this.rule_form_1 = {
    //       edit_link: response.resultMap.List[0].QRUrl,
    //       id: response.resultMap.List[0].id
    //     };
    //   });
    // },

    // 全选
    handleSelectionChange(val) {
      this.multiple_selection = val;
    },
    // 分页
    currentPageChange(e) {
      this.currentPage = e;
      let data = { page: 1, rows: 10, status: "", type: "2", name: "" };
      this.get_data(data);
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
          this.$message.success("启用状态修改成功！");
          this.currentPageChange(this.currentPage);
          let that = this;
          setTimeout(() => {
            that.loading = false;
          }, 500);
        });
      }
    },
    // 添加海报
    add_poster() {
      this.dia_title.name = "添加海报";
      this.dia_title.the_way = 0;
      this.dialog_visible = true;
    },
    // 取消添加
    dialog_cancle() {
      this.rule_form = {
        image_url: "",
        local_url: ""
      };
      this.dialog_visible = false;
    },
    submitForm(e) {
      let is_ok;
      if (e === 0) {
        this.$refs["rule_form"].validate(valid => {
          if (valid) {
            is_ok = true;
          } else {
            is_ok = false;
            return false;
          }
        });
      } else {
        this.$refs["rule_form_1"].validate(valid => {
          if (valid) {
            is_ok = true;
          } else {
            is_ok = false;
            return false;
          }
        });
      }

      return is_ok;
    },
    // 确认添加
    dialog_sure() {
      if (this.submitForm(0)) {
        if (this.dia_title.the_way == 0) {
          let data = {
            name: "",
            type: 2,
            imageUrl: this.rule_form.image_url,
            url: "",
            beginTime: 0,
            endTime: 0
          };

          appimageAdd(data).then(response => {
            this.$message.success("海报添加成功！");
            this.dialog_cancle();
            this.currentPageChange(this.currentPage);
          });
        } else {
          let data = {
            id: this.edit_id,
            name: "",
            imageUrl: this.rule_form.image_url,
            url: "",
            beginTime: 0,
            endTime: 0
          };
          appimageUpdate(data).then(response => {
            this.$message.success("海报编辑成功！");
            this.dialog_cancle();
            this.currentPageChange(this.currentPage);
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
      });
    },
    // 编辑广告
    table_edit(e) {
      this.dia_title.name = "编辑海报";
      this.dia_title.the_way = 1;
      this.edit_id = e.id;
      this.rule_form = {
        image_url: e.imageUrl,
        local_url: e.imageUrl
      };
      this.dialog_visible = true;
    }
    //删除
    // table_del(e) {
    //   let data = {
    //     id: e.id + ""
    //   };
    //   PosterMangementDelete(data).then(response => {
    //     this.$message.success("删除成功！");
    //     this.currentPageChange(this.currentPage);
    //   });
    // }
    // promotion_link() {
    //   this.get_poster_link();
    //   let that = this;
    //   setTimeout(() => {
    //     that.dialog_visible_1 = true;
    //   }, 500);
    // },
    // dialog_link_cancle() {
    //   this.dialog_visible_1 = false;
    //   this.rule_form_1 = {
    //     edit_link: "",
    //     id: ""
    //   };
    // },
    // dialog_link_sure() {
    //   if (this.submitForm(1)) {
    //     let data = {
    //       id: this.rule_form_1.id + "",
    //       QRUrl: this.rule_form_1.edit_link
    //     };
    //     PosterQRMangementUpdate(data).then(response => {
    //       this.$message.success("宣传链接修改成功");
    //       this.dialog_link_cancle();
    //     });
    //   }
    // }
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
.table_edit {
  display: flex;
  justify-content: space-around;
}
</style>