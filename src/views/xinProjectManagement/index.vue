<template>
  <div class="tcw_container tcw_height_auto" id="xin—mall-and-project-management">

    <el-tabs v-model="tabs_active_name" @tab-click="handle_tab_click">
      <el-tab-pane label="校董对接" :name="TabsEnum.TO_PRINCIPAL"/>
      <el-tab-pane label="芯际对接" :name="TabsEnum.TO_THINKEY"/>
      <el-tab-pane :label="'待上线' + project_name" :name="TabsEnum.WAITING_ON_LINE"/>
      <el-tab-pane :label="'已上线' + project_name" :name="TabsEnum.ON_LINE"/>
      <el-tab-pane :label="'已关闭' + project_name" :name="TabsEnum.OFF_LINE"/>
    </el-tabs>

    <el-row class="block">
      <el-col :span="6">
        <label for="ID">{{project_name}}编号</label>
        <el-input id="ID" v-model="project_no" clearable class="search-item"></el-input>
      </el-col>
      <el-col :span="6">
        <label for="release-status">是否发行{{XTO}}</label>
        <el-select id="release-status" clearable v-model="xto_release_selected" placeholder="请选择" class="search-item">
          <el-option label="已发行" :value="XTOReleaseStatusEnum.RELEASE"></el-option>
          <el-option label="未发行" :value="XTOReleaseStatusEnum.NOT_RELEASE"></el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-button type="primary" @click="search_project_list">查询</el-button>
      </el-col>
    </el-row>

    <div class="table-area block">
      <el-table
        v-loading="table_loading"
        :data="table_data"
        border
        style="margin-top: 30px">
        <template v-for="(header_item, index) in table_header">
          <el-table-column  :key="index" :label="header_item.label" align="center" :width="header_item.width" v-if="show_table_column(header_item)" >
            <template slot-scope="scope">
              <span v-if="!header_item.toDo">{{ format(scope.row[header_item.prop] || (scope.row.user && scope.row.user[header_item.secondProp]), header_item.formatType )}}</span>
              <el-link v-if="header_item.toDo" type="primary" @click="handle_table_cell_click(header_item.toDo, scope.row)">{{ format(scope.row[header_item.prop] || (scope.row.user && scope.row.user[header_item.secondProp]), header_item.format )}}</el-link>
            </template>
          </el-table-column>
        </template>
        <el-table-column
          v-if="tabs_active_name === TabsEnum.WAITING_ON_LINE
          || tabs_active_name === TabsEnum.TO_THINKEY
          || tabs_active_name === TabsEnum.ON_LINE
          || tabs_active_name === TabsEnum.OFF_LINE"
          fixed="right"
          width="200"
          align="center"
          label="操作">
          <template slot-scope="scope" >
            <div class="operations">
              <el-link class="link" type="primary" :underline="false" @click="check_project(scope.row)" v-if="tabs_active_name === TabsEnum.ON_LINE || tabs_active_name === TabsEnum.OFF_LINE">查看</el-link>
              <el-link class="link" type="primary" :underline="false" @click="create_project(scope.row)"  v-if="scope.row.status === ProjectOnlineStatusEnum.APPROVE_BY_GUIDANCE_TEACHER_OR_PRINCIPAL || scope.row.status === ProjectOnlineStatusEnum.WAITING_ON_LINE ">编辑{{project_name}}</el-link>
              <el-link class="link" type="primary" :underline="false" @click="change_identity(scope.row)" v-if="tabs_active_name === TabsEnum.WAITING_ON_LINE">上线</el-link>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-divider/>
    </div>

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

    <ViewingAndCreatingXTO @onCreateSuccess="handle_create_project_success" ref="_viewingAndCreatingXTO"/>
  </div>
</template>

<script>
  import { ProjectTypeIdEnum, ProjectOnlineStatusEnum, XTOReleaseStatusEnum } from '../../utils/data/enum'
  import xinProjectManagementApi from "../../apis/xinProjectManagementApi";
  import ViewingAndCreatingXTO from "./components/ViewingAndCreatingXTO";
  import DialogWithTable from "../../components/DialogWithTable";

  const TabsEnum = {
    ALL_XIN : '-1',
    TO_PRINCIPAL: '1',
    TO_THINKEY: '2',
    WAITING_ON_LINE: '3',
    ON_LINE: '4',
    OFF_LINE: '5'
  };

  export default {
    data () {
      return {
        tabs_active_name: TabsEnum.TO_PRINCIPAL,
        project_name: '',
        project_type_id: '',
        XTO: '',
        project_no: '',
        xto_release_selected: '',
        table_data: [],
        table_header: [],
        ProjectTypeIdEnum: ProjectTypeIdEnum,
        ProjectOnlineStatusEnum: ProjectOnlineStatusEnum,
        XTOReleaseStatusEnum: XTOReleaseStatusEnum,
        project_online_status_list: '',
        TabsEnum: TabsEnum,
        data_total: 0,
        page_size: 10,
        page_index: 1,
        table_loading: false,
      }
    },
    components: { ViewingAndCreatingXTO, DialogWithTable },
    watch: {
      '$route' () {
        this.init()
      }
    },
    created () {
      this.init()
    },
    methods: {
      init () {
        let path = this.$route.path;
        switch (path) {
          case '/xinMallManagement':
            this.project_name = '芯城';
            this.project_type_id = ProjectTypeIdEnum.XIN_MALL;
            this.XTO = 'MTO';
            break;
          case '/xinProductManagement':
            this.project_name = '芯品';
            this.project_type_id = ProjectTypeIdEnum.XIN_PRODUCT;
            this.XTO = 'BTO';
            break;
        }
        this.init_table_header ();
        this.get_project_list();
      },
      // 初始化表格头部数据
      init_table_header () {
        this.table_header = [
          new TableTh('createTime', '', '申请时间', 100, '', 'format_time', [TabsEnum.TO_PRINCIPAL, TabsEnum.TO_THINKEY],[],),

          new TableTh('projectNo', '', `${this.project_name}编号`, '', '', '', []),

          new TableTh('userCardNo', '', `${this.project_name}卡编号`, '', '', '', [TabsEnum.TO_PRINCIPAL, TabsEnum.TO_THINKEY]),

          new TableTh('name', '', `${this.project_name}名称`, '', '', '', []),

          new TableTh('', 'nickname', this.project_type_id === ProjectTypeIdEnum.XIN_MALL ? '商城联系人' : '供应商联系人', '', '', '', [TabsEnum.TO_PRINCIPAL, TabsEnum.TO_THINKEY]),

          new TableTh('', 'phone', '联系电话', '', '', '', [TabsEnum.TO_PRINCIPAL, TabsEnum.TO_THINKEY]),

          new TableTh('', 'wechat', '联系微信', '','', '',  [TabsEnum.TO_PRINCIPAL, TabsEnum.TO_THINKEY]),

          new TableTh('reviewUserName', '', '审核校董', '', '', '', [TabsEnum.TO_PRINCIPAL, TabsEnum.TO_THINKEY]),

          new TableTh('reviewUserPhone', '', '审核校董联系方式', '','', '',  [TabsEnum.TO_PRINCIPAL, TabsEnum.TO_THINKEY]),

          new TableTh('merchantName', '', '芯城归属', '','', '',  [TabsEnum.WAITING_ON_LINE, TabsEnum.ON_LINE, TabsEnum.OFF_LINE, TabsEnum.ALL_XIN], [ProjectTypeIdEnum.XIN_MALL]),

          // new TableTh('merchantName', '', '下属品牌', '', []),

          new TableTh('xtoRelease', '', `是否发行${this.XTO}`, '','', 'format_MTO_release',  [], []),

          new TableTh('xtoName', '', `${this.XTO}名称`, '', '', '',  [TabsEnum.WAITING_ON_LINE, TabsEnum.ON_LINE, TabsEnum.OFF_LINE, TabsEnum.ALL_XIN]),

          new TableTh('projectUserCount', '', this.project_type_id === ProjectTypeIdEnum.XIN_MALL ? '城客成员' : '品客成员' , '', 'show_project_user_detail', '', [TabsEnum.WAITING_ON_LINE, TabsEnum.ON_LINE, TabsEnum.OFF_LINE, TabsEnum.ALL_XIN]),

          new TableTh('xtoInviteLeftCount', '', `推广${this.XTO}余量`, '', '', '', [TabsEnum.WAITING_ON_LINE, TabsEnum.ON_LINE, TabsEnum.OFF_LINE, TabsEnum.ALL_XIN]),

          new TableTh('xtoInviteMaxCount', '', `推广${this.XTO}总量`, '', '', '', [TabsEnum.WAITING_ON_LINE, TabsEnum.ON_LINE, TabsEnum.OFF_LINE, TabsEnum.ALL_XIN]),

          new TableTh('xtoExchangeLeftCount', '', `消费${this.XTO}余量`, '', '', '',  [TabsEnum.WAITING_ON_LINE, TabsEnum.ON_LINE, TabsEnum.OFF_LINE, TabsEnum.ALL_XIN]),

          new TableTh('xtoExchangeMaxCount', '', `消费${this.XTO}总量`, '', '', '',  [TabsEnum.WAITING_ON_LINE, TabsEnum.ON_LINE, TabsEnum.OFF_LINE, TabsEnum.ALL_XIN]),

          new TableTh('profitMallCoins', '', '芯城营业额分成', '', '', '', [TabsEnum.WAITING_ON_LINE, TabsEnum.ON_LINE, TabsEnum.OFF_LINE, TabsEnum.ALL_XIN],[ProjectTypeIdEnum.XIN_MALL]),

          new TableTh('profitMallPercent', '', '芯城营业额分成比例', '', '' ,'format_percent', [TabsEnum.WAITING_ON_LINE, TabsEnum.ON_LINE, TabsEnum.OFF_LINE, TabsEnum.ALL_XIN],[ProjectTypeIdEnum.XIN_MALL]),

          new TableTh('profitBrandCoins', '', '芯品营业额分成', '', '', '', [TabsEnum.WAITING_ON_LINE, TabsEnum.ON_LINE, TabsEnum.OFF_LINE, TabsEnum.ALL_XIN]),

          new TableTh('profitBrandPercent', '', '芯品营业额分成比例', '','', 'format_percent', [TabsEnum.WAITING_ON_LINE, TabsEnum.ON_LINE, TabsEnum.OFF_LINE, TabsEnum.ALL_XIN],[],),

          new TableTh('contractAddress', '', `${this.XTO}合约地址`, '', '', '', [TabsEnum.WAITING_ON_LINE, TabsEnum.ON_LINE, TabsEnum.OFF_LINE, TabsEnum.ALL_XIN]),

          new TableTh('userXTOCount', '', `${this.XTO}持有用户`, '', '', '', [TabsEnum.WAITING_ON_LINE, TabsEnum.ON_LINE, TabsEnum.OFF_LINE, TabsEnum.ALL_XIN]),

          new TableTh('status', '', `${this.project_name}状态`, '', '','format_project_status', [],[]),
        ]
      },
      // 根据条件显示表格的列
      show_table_column (item) {
        let validate1 = !item['showByTabList'] || !item['showByTabList'].length || item['showByTabList'].indexOf(this.tabs_active_name) > -1;
        let validate2 = !item['showByProjectList'] || !item['showByProjectList'].length || item['showByProjectList'].indexOf(this.project_type_id) > -1;
        return validate1 && validate2;
      },
      format (content, formater) {
        if (!formater) {
          return content
        }
        switch (formater) {
          case 'format_time': return this.$formatTime(content);
          case 'format_project_status': return this.format_project_status(content);
          case 'format_percent': return this.format_percent(content);
          case 'format_MTO_release': return this.format_MTO_release(content);
        }
      },
      get_project_list () {
        this.table_loading = true;
        xinProjectManagementApi.get_project_list(
          this.page_index,
          this.page_size,
          this.project_type_id,
          this.project_online_status_list,
          this.project_no.trim(),
          this.xto_release_selected - 0).then((res) => {
            let data = res['data'] || {};
            this.data_total = data.total || 0;
            this.table_data = data.data || [];
            this.table_loading = false;
          }).catch(() => {
            // TODO;
          })
      },
      search_project_list () {
        this.page_index = 1;
        this.get_project_list();
      },
      handle_tab_click () {
        switch (this.tabs_active_name) {
          case TabsEnum.TO_PRINCIPAL:
            this.project_online_status_list = ''
              + ProjectOnlineStatusEnum.WAITING_REVIEW + ','
              + ProjectOnlineStatusEnum.REJECT_BY_GUIDANCE_TEACHER_OR_PRINCIPAL + ','
              + ProjectOnlineStatusEnum.APPROVE_BY_GUIDANCE_TEACHER_OR_PRINCIPAL;
            break;
          case TabsEnum.TO_THINKEY:
            this.project_online_status_list = ''
              + ProjectOnlineStatusEnum.APPROVE_BY_GUIDANCE_TEACHER_OR_PRINCIPAL + ','
              + ProjectOnlineStatusEnum.WAITING_ON_LINE + ','
              + ProjectOnlineStatusEnum.ON_LINE + ','
              + ProjectOnlineStatusEnum.OFF_LINE + ',';
            break;
          case TabsEnum.ALL_XIN:
            this.project_online_status_list = ''
              + ProjectOnlineStatusEnum.WAITING_ON_LINE + ','
              + ProjectOnlineStatusEnum.ON_LINE + ','
              + ProjectOnlineStatusEnum.OFF_LINE + ',';
            break;
          case TabsEnum.WAITING_ON_LINE:
            this.project_online_status_list = ''
              + ProjectOnlineStatusEnum.WAITING_ON_LINE;
            break;
          case TabsEnum.ON_LINE:
            this.project_online_status_list = ''
              + ProjectOnlineStatusEnum.ON_LINE;
            break;
          case TabsEnum.OFF_LINE:
            this.project_online_status_list = ''
              + ProjectOnlineStatusEnum.OFF_LINE;
            break;
        }
        this.get_project_list();
      },
      handle_page_index_change () {
        this.get_project_list();
      },
      check_project (item) {
        this.$refs._viewingAndCreatingXTO.show_dialog(1,this.project_type_id, item)
      },
      create_project (item) {
        this.$refs._viewingAndCreatingXTO.show_dialog(0,this.project_type_id, item)
      },
      handle_create_project_success () {
        this.tabs_active_name = TabsEnum.WAITING_ON_LINE;
        this.page_index = 1;
        this.get_project_list()
      },
      handle_table_cell_click (todo, item) {
        console.log(todo, item)
      },
      format_project_status (status) {
        switch (status) {
          case ProjectOnlineStatusEnum.WAITING_REVIEW: return '待审核';
          case ProjectOnlineStatusEnum.REJECT_BY_GUIDANCE_TEACHER_OR_PRINCIPAL: return '已驳回(校董或导师)';
          case ProjectOnlineStatusEnum.APPROVE_BY_GUIDANCE_TEACHER_OR_PRINCIPAL: return '已通过(校董或导师)';
          case ProjectOnlineStatusEnum.WAITING_ON_LINE: return '待上线';
          case ProjectOnlineStatusEnum.ON_LINE: return '已上线';
          case ProjectOnlineStatusEnum.OFF_LINE: return '已下线';
        }
      },
      format_percent (number) {
        return (number * 100).toFixed(2) + '%';
      },
      format_MTO_release (status) {
        return status === XTOReleaseStatusEnum.RELEASE ? '是' : '否';
      }
    }
  }
  class TableTh{
    constructor (prop, secondProp, label,  width, toDo, formatType, showByTabList, showByProjectList ) {
      this.prop = prop;
      this.secondProp = secondProp;
      this.label = label;
      this.width = width;
      this.showByTabList = showByTabList;
      this.showByProjectList = showByProjectList;
      this.formatType = formatType;
      this.toDo = toDo;
    }
  }
</script>

<style scoped lang="scss">
  #xin—mall-and-project-management{
    .search-item{
      width: 60%;
      margin-left: 3%;
    }
    .table-area{
      width: 100%;
      overflow: scroll;
      .operations {
        .link+.link{
          margin-left: 10px;
        }
      }
    }
    .block {
      margin-top: 30px;
    }
  }


</style>
