<template>
  <div id="version-detail-and-addition" class="tcw_container tcw_height_auto">
    <div class="tcw_main_title">
      {{title}}
    </div>
    <el-form ref="form" :model="form" :rules="rules" label-width="150px" class="--form">
      <el-form-item label="版本号" prop="versionNo">
        <el-input v-model="form.versionNo" placeholder="请输入版本号" :disabled="is_locked"></el-input>
      </el-form-item>
      <el-form-item label="APP类型" prop="os">
        <el-select v-model="form.os" placeholder="请选择" :disabled="is_locked">
          <el-option label="IOS" :value="AppTypeEnum.IOS"></el-option>
          <el-option label="Android" :value="AppTypeEnum.ANDROID"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上传版本" prop="url">
        <el-input v-model="form.url" placeholder="请输入下载链接" :disabled="is_locked"></el-input>
      </el-form-item>
      <el-form-item label="版本描述" prop="description">
        <el-input v-model="form.description" type="textarea" autosize placeholder="请输入版本描述" :disabled="is_locked"></el-input>
      </el-form-item>
      <el-form-item label="更新类型" prop="forceUpdate">
        <el-select v-model="form.forceUpdate" placeholder="请选择" :disabled="is_locked">
          <el-option label="强制更新" :value="AppUpdateTypeEnum.FORCE"></el-option>
          <el-option label="非强制更新" :value="AppUpdateTypeEnum.UNFORCED"></el-option>
        </el-select>
      </el-form-item>
      <el-row style="text-align: center">
        <el-button @click="go_back">返回列表</el-button>
        <el-button type="primary" style="width: 100px" v-if="this.type==='versionAddition'" @click="create_version">提交</el-button>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  import { AppTypeEnum, AppUpdateTypeEnum } from '../../../../utils/data/enum';
  import settingsApi from "../../../../apis/settingsApi";
  export default {
    data () {
      return {
        is_locked: false,
        type: '',
        title: '',
        version_detail: {},
        form: { },
        rules: { },
        AppTypeEnum: AppTypeEnum,
        AppUpdateTypeEnum: AppUpdateTypeEnum
      }
    },
    created () {
      this.init()
    },
    methods: {
      init () {
        let path = this.$route.path;
        if (path === '/versionDetail') {
          this.get_version_detail();
          this.is_locked = true;
          this.title = '基本信息';
          this.type = 'versionDetail'
        } else if (path === '/versionAddition') {
          this.title = '新加版本';
          this.type = 'versionAddition';
          this.rules = {
            versionNo: [
              { required: true, message: '请输入版本号', trigger: 'blur' },
            ],
            os: [
              { required: true, message: '请选择APP类型', trigger: 'blur' },
            ],
            url: [
              { required: true, message: '请输入下载链接', trigger: 'blur' },
            ],
            description: [
              { required: true, message: '请输入版本描述', trigger: 'blur' },
            ],
            forceUpdate: [
              { required: true, message: '选择更新类型', trigger: 'blur' },
            ]
          }

        }
      },
      get_version_detail () {
        this.form = this.$storage.temp('session', 'versionDetail') || {};
      },
      create_version () {
        let {versionNo, os, url, description, forceUpdate} = this.form;
        if (!versionNo) {
          this.warning('请输入版本号');
          return;
        }
        if (this.$isNullOrEmpty(os)) {
          this.warning('请选择APP类型');
          return;
        }
        if (!url) {
          this.warning('请输入下载链接');
          return;
        }
        if (!description) {
          this.warning('请输入版本描述');
          return;
        }
        if (this.$isNullOrEmpty(forceUpdate)) {
          this.warning('选择更新类型');
          return;
        }
        settingsApi.create_version(this.form).then(() => {
          this.$message({
            message: '添加成功',
            type: 'success'
          });
          let that = this
          setTimeout(() => {
            that.go_back()
          }, 500)
        }).catch(() => {
          //TODO;
        })
      },
      go_back () {
        this.$router.back()
      },
      warning (text) {
        this.$message({
          message: text,
          type: 'warning'
        })
      }
    },
    beforeDestroy() {
      this.$storage.temp('session', 'versionDetail', '');
    }
  }
</script>

<style scoped lang="scss">
  .--form{
    width: 700px;
    margin: 30px auto 0;
    /deep/.el-input__inner{
      color: #666;
      cursor: auto;
    }
    /deep/.el-textarea__inner {
      color: #666;
      cursor: auto;
    }
    /deep/.is-checked.el-radio__inner {
      background-color: #F5F7FA;
      border-color: #E4E7ED;
    }
  }
</style>

