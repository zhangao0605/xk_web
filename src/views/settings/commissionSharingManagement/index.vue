<template>
  <div id="commission-sharing-management" class="tcw_container tcw_height_auto">
    <div class="tcw_main_title">
      反佣设置
    </div>
    <el-form ref="form" :model="form" :rules="rules" label-width="150px" class="--form">
      <el-form-item label="是否开启反佣">
        <el-radio-group v-model="form.is_open">
          <el-radio label="1">开启</el-radio>
          <el-radio label="0">关闭</el-radio>
        </el-radio-group>
      </el-form-item>
      <template v-if="form.is_open == 1">
        <el-form-item label="一级分佣比例" prop="first_percent" style="position: relative">
          <el-input v-model="form.first_percent" placeholder="请输入正整数" type="number" ></el-input>
          <span class="percent tcw_color_bg">%</span>
        </el-form-item>
        <el-form-item label="二级分佣比例" prop="second_percent" style="position: relative">
          <el-input v-model="form.second_percent" placeholder="请输入正整数" type="number" ></el-input>
          <span class="percent tcw_color_bg">%</span>
        </el-form-item>
      </template>
      <div style="text-align: center; margin-top: 30px">
        <el-button type="primary" style="width: 150px" @click="save">保存</el-button>
      </div>

    </el-form>
  </div>
</template>

<script>
  import settingsApi from "../../../apis/settingsApi";
  import { ruleOfInt } from "../../../utils/rules";
  import { validInt } from "../../../utils/validate";

  export default {
    data () {
      return {
        form: {
          is_open: '',
          first_percent: '',
          second_percent: '',
        },
        rules: {
          first_percent: [
            { pattern: ruleOfInt, message: this.$lan('请输入正整数'), trigger: 'blur' }
          ],
          second_percent: [
            { pattern: ruleOfInt, message: this.$lan('请输入正整数'), trigger: 'blur' }
          ],
        }
      }
    },
    created () {
      this.get_commission_setting();
    },
    methods: {
      get_commission_setting () {
        settingsApi.get_commission_setting().then((res) => {
          let data = res['resultMap'] || {};
          let map = data.map || {};
          this.form.is_open = map.isStart;
          this.form.first_percent = map.firstPercent;
          this.form.second_percent = map.secPercent;
        }).then(() => {
          // TODO;
        })
      },

      save () {
        if (this.$isNullOrEmpty(this.form.is_open)) {
          this.warning('请选择是否开启');
          return;
        }

        if ( this.form.is_open == 1 ) {
          if (this.$isNullOrEmpty(this.form.first_percent)) {
            this.warning('请填写一级分佣比例');
            return;
          }

          if (!validInt(this.form.first_percent)) {
            this.warning('请输入正整数');
            return;
          }

          if (this.$isNullOrEmpty(this.form.second_percent)) {
            this.warning('请填写二级分佣比例');
            return;
          }

          if (!validInt(this.form.second_percent)) {
            this.warning('请输入正整数');
            return;
          }

        }


        settingsApi.set_commission(this.form.is_open, this.form.first_percent, this.form.second_percent).then(() => {
          this.$message({
            message: '设置成功！',
            type: 'success'
          })
          this.get_commission_setting()
        }).catch(() => {

        })
      },
      warning (text) {
        this.$message({
          message: text,
          type: 'warning'
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .--form{
    width: 500px;
    margin: 0 auto;
    padding: 30px 0;
    .percent{
      position: absolute;
      top: 0;
      right: 0;
      width: 30%;
      text-align: center;
      color: #fff;
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }
  }

</style>
