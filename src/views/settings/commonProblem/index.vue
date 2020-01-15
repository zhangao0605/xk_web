<template>
  <div id="common-problem" class="tcw_container tcw_height_auto">
    <el-row>
      <el-col :span="9">
        <label for="problem-type">问题类别</label>
        <el-select v-model="problem_type_selection" clearable placeholder="请选择" id="problem-type" style="margin-left: 15px">
          <el-option
            v-for="(item,index) in problem_types"
            :key="index"
            :label="item.parentTitle"
            :value="item.parentId">
          </el-option>
        </el-select>
        <el-button type="primary" @click="search_problem_list" style="width:100px; margin-left: 15px">查询</el-button>
      </el-col>
      <el-col :span="10">
        <el-button type="primary" @click="operate_common_problem_list(CommonProblemOpenStateEnum.OPEN)">批量启用</el-button>
        <el-button type="primary" @click="operate_common_problem_list(CommonProblemOpenStateEnum.CLOSE)">批量禁用</el-button>
      </el-col>
      <el-col :span="5" style="text-align: right">
        <el-button type="primary" @click="create_problem">添加问题</el-button>
      </el-col>
    </el-row>

    <el-table
      :data="table_data"
      border
      @selection-change="handle_problem_selection_change"
      style="width: 100%; margin-top: 30px">
      <el-table-column
        type="selection"
        width="100px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="parentTitle"
        label="问题类别"
        align="center">
      </el-table-column>
      <el-table-column
        prop="title"
        align="center"
        label="问题名称">
      </el-table-column>
      <el-table-column
        align="center"
        label="启用状态">
        <template slot-scope="scope">
          <el-switch
            @change="operate_common_problem_single(scope.row)"
            v-model="scope.row.status == CommonProblemOpenStateEnum.OPEN"
           />
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作">
        <template slot-scope="scope">
          <el-link type="primary" :underline="false" @click="edit_problem(scope.row)">编辑</el-link>
          <el-link type="primary" :underline="false" @click="delete_problem(scope.row)" style="margin-left: 20px">删除</el-link>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-show="data_total / page_size > 1"
      background
      style="margin-top: 10px;text-align: right"
      @current-change="handle_page_index_change"
      :current-page.sync="page_index"
      :page-size="page_size"
      layout="total, prev, pager, next"
      :total="data_total">
    </el-pagination>
    <common-problem-editing ref="_commonProblemEditing" @handle_complete="search_problem_list"/>
  </div>
</template>
<script>
  import { CommonProblemTypeEnum, CommonProblemOpenStateEnum, EditingTypeEnum } from '../../../utils/data/enum';
  import settingsApi from '../../../apis/settingsApi';
  import commonProblemEditing from './components/commonProblemEditing'

  export default {
    components: {commonProblemEditing},
    data () {
      return {
        problem_types: [],
        problem_type_selection: '',
        table_data: [],
        problem_selection_list: [],
        page_index: 1,
        page_size: 10,
        data_total: 0,
        CommonProblemOpenStateEnum: CommonProblemOpenStateEnum
      }
    },
    created () {
      this.get_problem_category_list().then(() => {
        this.get_common_problem_list()
      });

    },
    methods: {
      get_problem_category_list () {
        return new Promise((resolve, reject) => {
          settingsApi.get_common_problem_list(0, 1, 100).then((res) => {
            let data = res['data'] || {};
            this.problem_types = data.data || [];
            resolve()
          }).catch((err) => {
            console.log(err);
            reject()
          })
        });
      },
      get_common_problem_list () {
        settingsApi.get_common_problem_list(this.problem_type_selection, this.page_index, this.page_size).then((res) => {
          let data = res['data'] || {};
          this.table_data = data.data || [];
          this.data_total = data.total || 0;
        }).catch(() => {
          // TODO
        })
      },
      search_problem_list () {
        this.page_index = 1;
        this.get_common_problem_list();
      },
      handle_page_index_change () {
        this.get_common_problem_list()
      },
      handle_problem_selection_change (val) {
        this.problem_selection_list = val;
      },
      operate_common_problem_single (item) {
        let status = item.status, id_list = item.id + '';
        let status_setting;
        if (status === CommonProblemOpenStateEnum.OPEN) {
          status_setting = CommonProblemOpenStateEnum.CLOSE;
        }else if (status === CommonProblemOpenStateEnum.CLOSE) {
          status_setting = CommonProblemOpenStateEnum.OPEN;
        }
        this.change_common_problem_status(status_setting, id_list)

      },
      operate_common_problem_list (status_setting) {
        if(!this.problem_selection_list || !this.problem_selection_list.length){
          this.$message({
            message: '请在表格中选择需要操作的数据',
            type: 'warning'
          });
          return;
        }
        let id_list = this.problem_selection_list.map((item) => {
          return item.id;
        }).join(',');


        this.change_common_problem_status(status_setting, id_list)

      },
      change_common_problem_status (status_setting, id_list) {
        settingsApi.change_common_problem_status(status_setting, id_list).then(() => {
          this.get_common_problem_list()
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        }).catch(() => {

        })
      },
      create_problem () {
        this.$refs._commonProblemEditing.show_problem_addition_dialog(EditingTypeEnum.CREATION)
      },
      edit_problem (item) {
        if (this.$isNullOrEmpty(item)) {
          return;
        }
        this.$refs._commonProblemEditing.show_problem_addition_dialog(EditingTypeEnum.EDITING, item)
      },
      delete_problem (item) {
        if (this.$isNullOrEmpty(item)) {
          return;
        }
        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let questionSeq = item.questionSeq + '';
          settingsApi.delete_problem(questionSeq).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.get_common_problem_list()
          }).catch(() => {
            //TODO
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '您已取消删除操作'
          });
        });
      },
      format_common_problem (row, column) {
        let status = row[column.property];
        for (let i = 0; i < problem_types.length; i++) {
          if(problem_types[i].value === status){
            return problem_types[i].name;
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>
