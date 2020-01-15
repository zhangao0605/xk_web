<template>
  <div class="tcw_container tcw_height_auto">
    <div class="tcw_main_title">
      用户信息
    </div>
    <div>
      <el-form ref="form" :model="form" label-width="200px" class="--form">
        <el-form-item label="用户手机号">
          <span></span>
        </el-form-item>
        <el-form-item label="用户身份">
          <span></span>
        </el-form-item>
        <el-form-item label="用户地址">
          <span></span>
        </el-form-item>
        <el-form-item label="芯城积分">
          <span></span>
          <el-link class="check-detail" type="primary" :underline="false" @click="show_dialog('xin_mall_points')">查看明细</el-link>
        </el-form-item>
        <el-form-item label="芯品积分">
          <span></span>
          <el-link class="check-detail" type="primary" :underline="false" @click="show_dialog('xin_product_points')">查看明细</el-link>
        </el-form-item>
        <el-form-item label="合作的芯城">
          <span></span>
          <el-link class="check-detail" type="primary" :underline="false" @click="show_dialog('xin_mall_cooperative')">查看明细</el-link>
        </el-form-item>
        <el-form-item label="合作的芯品">
          <span></span>
          <el-link class="check-detail" type="primary" :underline="false" @click="show_dialog('xin_product_cooperative')">查看明细</el-link>
        </el-form-item>
        <el-form-item label="用户MTO(数字钱包)">
          <span></span>
          <el-link class="check-detail" type="primary" :underline="false" @click="show_dialog('MTO_number_wallet')">查看明细</el-link>
        </el-form-item>
        <el-form-item label="用户BTO(数字钱包)">
          <span></span>
          <el-link class="check-detail" type="primary" :underline="false" @click="show_dialog('BTO_number_wallet')">查看明细</el-link>
        </el-form-item>
        <el-form-item label="用户TUE(数字钱包)">
          <span></span>
        </el-form-item>
        <el-form-item label="用户MTO(通证钱包)">
          <span></span>
          <el-link class="check-detail" type="primary" :underline="false" @click="show_dialog('MTO_certified_wallet')">查看明细</el-link>
        </el-form-item>
        <el-form-item label="用户BTO(通证钱包)">
          <span></span>
          <el-link class="check-detail" type="primary" :underline="false" @click="show_dialog('BTO_certified_wallet')">查看明细</el-link>
        </el-form-item>
        <el-form-item label="用户TUE(通证钱包)">
          <span></span>
        </el-form-item>
      </el-form>
    </div>

    <el-dialog :title="dialog.title" :visible.sync="dialog.is_show">
      <el-table :data="dialog.table_data">
        <template v-for="item in dialog.table_header">
          <el-table-column
            v-if="!item.next_dialog_mark"
            align="center"
            :prop="item.prop"
            :label="item.label"
            :width="item.width">
          </el-table-column>
          <el-table-column
            v-if="item.next_dialog_mark"
            align="center"
            :prop="item.prop"
            :label="item.label"
            :width="item.width">
            <template slot-scope="scope">
              <el-button @click="show_dialog_2(item.next_dialog_mark, scope.row,)" type="text" size="small">查看</el-button>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </el-dialog>

    <el-dialog :title="dialog_2.title" :visible.sync="dialog_2.is_show">
      <el-table :data="dialog_2.table_data">
        <template v-for="item in dialog_2.table_header">
          <el-table-column
            v-if="!item.next_dialog_mark"
            align="center"
            :prop="item.prop"
            :label="item.label"
            :width="item.width">
          </el-table-column>
          <el-table-column
            v-if="item.next_dialog_mark"
            align="center"
            :prop="item.prop"
            :label="item.label"
            :width="item.width">
            <template slot-scope="scope">
              <el-button @click="show_dialog(item.next_dialog_mark)" type="text" size="small">查看</el-button>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        form: {},
        dialog: {
          is_show: false,
          title: '',
          table_header: [{prop:'', label:'', width: ''}],
          table_data: [

          ]
        },
        dialog_2: {
          is_show: false,
          title: '',
          table_header: [{prop:'', label:'', width: ''}],
          table_data: [

          ]
        }
      }
    },
    methods: {
      // 显示一级弹窗
      show_dialog (mark) {
        switch (mark) {
          case 'xin_mall_points': this.xin_mall_points_dialog (mark); break;
          case 'xin_product_points': this.xin_product_points_dialog (mark); break;
          case 'xin_mall_cooperative': this.xin_mall_cooperative_dialog (mark); break;
          case 'xin_product_cooperative': this.xin_product_cooperative_dialog (mark); break;
          case 'MTO_number_wallet': this.MTO_number_wallet_dialog (mark); break;
          case 'BTO_number_wallet': this.BTO_number_wallet_dialog (mark); break;
          case 'MTO_certified_wallet': this.MTO_certified_wallet_dialog (mark); break;
          case 'BTO_certified_wallet': this.BTO_certified_wallet_dialog (mark); break;
        }
        this.dialog.is_show = true;
      },

      // 显示二级弹窗
      show_dialog_2 (mark, id) {
        console.log(id);
        switch (mark) {
          case 'xin_mall_point_detail': this.xin_mall_point_detail_dialog (mark, id); break;
          case 'xin_product_point_detail': this.xin_product_point_detail_dialog (mark, id); break;
          case 'MTO_extension_detail': this.MTO_extension_detail_dialog (mark, id); break;
          case 'BTO_extension_detail': this.BTO_extension_detail_dialog (mark, id); break;
        }
        this.dialog_2.is_show = true;
      },

      // 显示芯城积分弹窗
      xin_mall_points_dialog (mark) {
        this.dialog.title = '芯城积分';
        this.dialog.table_header =  [
          new TableHeader( mark, '芯城编号', '', '', '' ),
          new TableHeader( mark, '芯城名称', '', '', '' ),
          new TableHeader( mark, '现有积分', '', '', 'xin_mall_point_detail' ),
          ];
        this.dialog.table_data = [{},{},{}];
      },

      // 显示芯品积分弹窗
      xin_product_points_dialog (mark) {
        this.dialog.title = '芯品积分';
        this.dialog.table_header =  [
          new TableHeader( mark, '芯品编号', '', '', ''),
          new TableHeader( mark, '芯品名称', '', '', ''),
          new TableHeader( mark, '现有积分', '', '', 'xin_product_point_detail'),
        ];
        this.dialog.table_data = [{},{},{}];
      },

      // 显示合作的芯城弹窗
      xin_mall_cooperative_dialog (mark) {
        this.dialog.title = '合作的芯城';
        this.dialog.table_header = [
          new TableHeader( mark, '芯城编号', '', '', '' ),
          new TableHeader( mark, '芯城名称', '', '', '' ),
          new TableHeader( mark, '加入时间', '', '', '' ),
          new TableHeader( mark, '消耗的城客卡', '', '', '' ),
          new TableHeader( mark, '推广MTO数量及进度', '', '', 'MTO_extension_detail' ),
        ];
        this.dialog.table_data = [{},{},{}];
      },

      // 显示合作的芯品弹窗
      xin_product_cooperative_dialog (mark) {
        this.dialog.title = '合作的芯品';
        this.dialog.table_header = [
          new TableHeader( mark, '芯品编号', '', '', ''),
          new TableHeader( mark, '芯品名称', '', '', ''),
          new TableHeader( mark, '加入时间', '', '', ''),
          new TableHeader( mark, '消耗的城客卡', '', '', ''),
          new TableHeader( mark, '推广BTO数量及进度', '', '', 'BTO_extension_detail'),
        ];
        this.dialog.table_data = [{},{},{}];
      },

      // 显示用户MTO（数字钱包）
      MTO_number_wallet_dialog (mark) {
        this.dialog.title = '用户MTO(数字钱包)';
        this.dialog.table_header = [
          new TableHeader( mark, 'MTO名称', '', '', ''),
          new TableHeader( mark, '芯城编号', '', '', ''),
          new TableHeader( mark, '芯城名称', '', '', ''),
          new TableHeader( mark, '拥有数量', '', '', ''),
        ];
        this.dialog.table_data = [{},{},{}];
      },

      // 显示用户BTO（数字钱包）
      BTO_number_wallet_dialog (mark) {
        this.dialog.title = '用户BTO(数字钱包)';
        this.dialog.table_header = [
          new TableHeader( mark, 'BTO名称', '', '', ''),
          new TableHeader( mark, '供应商编号', '', '', ''),
          new TableHeader( mark, '供应商名称', '', '', ''),
          new TableHeader( mark, '拥有数量', '', '', ''),
        ];
        this.dialog.table_data = [{},{},{}];
      },

      // 显示用户MTO（通证钱包）
      MTO_certified_wallet_dialog (mark) {
        this.dialog.title = '用户MTO(通证钱包)';
        this.dialog.table_header = [
          new TableHeader( mark, 'MTO名称', '', '', ''),
          new TableHeader( mark, '芯城编号', '', '', ''),
          new TableHeader( mark, '芯城名称', '', '', ''),
          new TableHeader( mark, '拥有数量', '', '', ''),
        ];
        this.dialog.table_data = [{},{},{}];
      },

      // 显示用户BTO（通证钱包）
      BTO_certified_wallet_dialog (mark) {
        this.dialog.title = '用户BTO(通证钱包)';
        this.dialog.table_header = [
          new TableHeader( mark, 'BTO名称', '', '', ''),
          new TableHeader( mark, '供应商编号', '', '', ''),
          new TableHeader( mark, '供应商名称', '', '', ''),
          new TableHeader( mark, '拥有数量', '', '', ''),
        ];
        this.dialog.table_data = [{},{},{}];
      },

      // 芯城积分明细
      xin_mall_point_detail_dialog (mark) {
        this.dialog_2.title = '积分明细';
        this.dialog_2.table_header = [
          new TableHeader( mark, '收支时间', '', '', ''),
          new TableHeader( mark, '收支类型', '', '', ''),
          new TableHeader( mark, '收支', '', '', ''),
          new TableHeader( mark, '数量', '', '', ''),
        ];
        this.dialog_2.table_data = [{},{},{}];
      },

      // 芯品积分明细
      xin_product_point_detail_dialog (mark) {
        this.dialog_2.title = '积分明细';
        this.dialog_2.table_header = [
          new TableHeader( mark, '收支时间', '', '', ''),
          new TableHeader( mark, '收支类型', '', '', ''),
          new TableHeader( mark, '收支', '', '', ''),
          new TableHeader( mark, '数量', '', '', ''),
        ];
        this.dialog_2.table_data = [{},{},{}];
      },

      // MTO推广明细
      MTO_extension_detail_dialog (mark) {
        this.dialog_2.title = '推广明细';
        this.dialog_2.table_header = [
          new TableHeader( mark, '获取MTO时间', '', '', ''),
          new TableHeader( mark, '获取人ID', '', '', ''),
          new TableHeader( mark, '获取人手机', '', '', ''),
          new TableHeader( mark, '数量', '', '', ''),
        ];
        this.dialog_2.table_data = [{},{},{}];
      },

      // BTO推广明细
      BTO_extension_detail_dialog (mark) {
        this.dialog_2.title = '推广明细';
        this.dialog_2.table_header = [
          new TableHeader( mark, '获取BTO时间', '', '', ''),
          new TableHeader( mark, '获取人ID', '', '', ''),
          new TableHeader( mark, '获取人手机', '', '', ''),
          new TableHeader( mark, '数量', '', '', ''),
        ];
        this.dialog_2.table_data = [{},{},{}];
      }
    }

  }

  class TableHeader{
    constructor(table_mark, label, prop, width, next_dialog_mark) {
      this.table_mark = table_mark;
      this.label = label;
      this.prop = prop;
      this.width = width;
      this.next_dialog_mark = next_dialog_mark;
    }

  }
</script>

<style scoped lang="scss">
  .--form{
    /deep/.el-form-item{
      margin-bottom: 10px;
    }
    .check-detail{
      margin-left: 20px;
    }
    /*>div{
      width: 48%;
      display: inline-block;
    }*/
  }
</style>
