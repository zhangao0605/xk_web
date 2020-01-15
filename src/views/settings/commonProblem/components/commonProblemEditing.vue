<template>
  <el-dialog
    :title="editing_type === EditingTypeEnum.CREATION ? '添加问题' : '编辑问题'"
    :visible.sync="dialog_visible"
    width="35%"
    center>
    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
      <el-form-item label="问题类别" prop="problem_type">
        <el-select v-model="form.problem_type" placeholder="请选择" id="problem-type">
          <el-option
            v-for="item in problem_types"
            :key="item.value"
            :label="item.name"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="问题名称" prop="problem_name">
        <el-input v-model="form.problem_name"></el-input>
      </el-form-item>
      <el-form-item label="问题答案" prop="problem_answer">
        <el-input v-model="form.problem_answer" type="textarea" :rows="3"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialog_visible = false" style="width: 20%">返回</el-button>
      <el-button type="primary" @click="submit_problem" style="width: 20%" >提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { CommonProblemTypeEnum, EditingTypeEnum } from '../../../../utils/data/enum';
  import settingsApi from '../../../../apis/settingsApi';

  const problem_types = [
    {name: '关于团队', value: CommonProblemTypeEnum.ABOUT_TEAM},
    {name: '关于分享', value: CommonProblemTypeEnum.ABOUT_SHARE},
    {name: '关于佣金', value: CommonProblemTypeEnum.ABOUT_COMMISSION},
  ];

  export default {
    name: "commonProblemEditing",
    data () {
      return {
        dialog_visible: false,
        problem_types: problem_types,
        editing_type: '',
        problem_edited: null,
        form: {
          problem_type: '',
          problem_name: '',
          problem_answer: ''
        },
        rules: {
          problem_type: [
            { required: true, message: '请选择问题类别', trigger: 'blur' },
          ],
          problem_name: [
            { required: true, message: '请输入问题名称', trigger: 'blur' },
          ],
          problem_answer: [
            { required: true, message: '请输入问题答案', trigger: 'blur' },
          ]
        },
        EditingTypeEnum: EditingTypeEnum
      }
    },
    methods: {
      show_problem_addition_dialog (type, problem_edited = {}) {
        console.log(problem_edited);
        this.editing_type = type;
        this.dialog_visible = true;
        this.form.problem_type = problem_edited.questionType;
        this.form.problem_name = problem_edited.questionName;
        this.form.problem_answer = problem_edited.questionContent;
        this.problem_edited = problem_edited;
      },
      submit_problem () {
        if (this.$isNullOrEmpty(this.form.problem_type)) {
          this.warning('请选择问题类别');
          return;
        }
        if (!this.form.problem_name) {
          this.warning('请输入问题名称');
          return;
        }
        if (!this.form.problem_answer) {
          this.warning('请输入问题答案');
          return;
        }
        if (this.editing_type === EditingTypeEnum.CREATION) {
          settingsApi.add_problem(this.form.problem_type, this.form.problem_name, this.form.problem_answer ).then(() => {
            this.$message({
              message: '添加成功',
              type: 'success'
            });
            this.dialog_visible = false;
            this.$emit('handle_complete')
          }).catch(() => {
            // TODO;
          })
        } else if (this.editing_type === EditingTypeEnum.EDITING) {
          let question_seq = (this.problem_edited && this.problem_edited.questionSeq || '') + ''
          settingsApi.submit_problem_edited(this.form.problem_type, this.form.problem_name, this.form.problem_answer, question_seq ).then(() => {
            this.$message({
              message: '编辑成功',
              type: 'success'
            });
            this.dialog_visible = false;
            this.$emit('handle_complete')
          }).catch(() => {
            // TODO;
          })
        }
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

<style scoped>

</style>
