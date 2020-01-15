<template>
  <el-menu
    :default-active="defaultActive"
    class="el-menu-vertical-demo"
    menu-trigger="click"
    text-color="rgb(95, 102, 143)"
    mode="vertical"
  >
    <div v-for="(item,index) in navmenuDefault" :key="index">
      <el-submenu :index="item.parent && item.parent.name" v-if="item.child &&item.child.length!=0">
        <template slot="title">
          <i class="el-icon-menu"></i>
          <span>{{item.parent.name}}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item
            class="menu-second"
            v-for="(item_1,index_1) in item.child"
            :key="index_1"
            :index="item_1.path"
            @click="to_path(item_1.path)"
          >{{item_1.name}}</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <div @click="to_path(item.parent.path)" v-else>
        <el-menu-item :index="item.parent && item.parent.path">
          <i class="el-icon-menu"></i>
          <span>{{item.parent.name}}</span>
        </el-menu-item>
      </div>
    </div>
  </el-menu>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import { byUser } from "../apis/contract";

const { mapState } = createNamespacedHelpers("user");

export default {
  name: "Slidebar",
  data() {
    return {
      navmenu: "",
      navmenuDefault: [
        {
          parent: {
            name: "首页",
            path: "/home"
          }
        },
        {
          parent: {
            name: "用户管理",
            path: ""
          },
          child: [{ name: "用户管理列表", path: "/userManagementList" }]
        },
        {
          parent: {
            name: "供商管理",
            path: "/merchantManagement"
          },
          child: []
        },
        {
          parent: {
            name: "芯城管理",
            path: "/xinMallManagement"
          },
          child: []
        },
        {
          parent: {
            name: "芯品管理",
            path: "/xinProductManagement"
          },
          child: []
        },
        {
          parent: {
            name: "内容管理",
            path: ""
          },
          child: [
            { name: "赚赚图片管理", path: "/pictures" },
            { name: "横幅管理", path: "/advertisingMap" },
            { name: "海报管理", path: "/poster" },
            { name: "消息管理", path: "/news" }
          ]
        },
        {
          parent: {
            name: "规则管理",
            path: ""
          },
          child: [
            { name: "爆币规则列表", path: "/explosionRules" },
            // { name: "爆币审核列表", path: "/explosiveCoinReview" },
            { name: "爆币记录", path: "/explosionRecords" }
          ]
        },
        {
          parent: {
            name: "数字资产管理",
            path: ""
          },
          child: [{ name: "交易记录", path: "/tradingRecord" }]
        },
        {
          parent: {
            name: "配额管理",
            path: ""
          },
          child: [
            { name: "配额记录", path: "/quotaRecord" },
            { name: "配额审核", path: "/quotaAduit" }
          ]
        },
        {
          parent: {
            name: "设置",
            path: ""
          },
          child: [
            { name: "常见问题", path: "/commonProblem" },
            { name: "版本管理", path: "/versionManagement" }
          ]
        },
        {
          parent: {
            name: "芯客后台",
            path: ""
          },
          child: [
            { name: "卡片管理", path: "/cardManagement" },
            { name: "规则设置", path: "/rulesSetting" },
            { name: "卡片及原价设置", path: "/cardSetting" }
          ]
        }
      ]
    };
  },
  created() {},
  computed: {
    defaultActive() {
      return this.$route.path;
    }
  },
  methods: {
    to_string(e) {
      return e.toString();
    },
    to_path(e) {
      this.$router.push({ path: e });
    }
  }
};
</script>
<style lang="scss" scoped>
.el-menu {
  text-align: left;
  /*min-width: 210px !important;*/
  width: 100%;
  /*background-color: #304156;*/
  height: 100%;
  overflow: auto;
  border: none;
  padding-top: 20px;
}
.el-menu::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}
.el-menu-item-group .el-menu-item {
  margin-left: 9px;
}
.el-menu::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px #ffffff;
  background: #dbe2f1;
}

.el-menu::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px #ffffff;
  border-radius: 10px;
  background: #ffffff;
}
// /deep/.el-menu-item {
//   padding-left: 20% !important;
// }
// /deep/.el-submenu__title {
//   padding-left: 20% !important;
// }
// .menu-second {
//   padding-left: 31% !important;
// }
.slid_select {
  width: 82%;
  /*background-color: red*/
  margin-left: 9%;
}
.kk {
  width: 96%;
  box-shadow: 5px 0 10px 0 rgba(224, 230, 242, 0.9);
}
</style>
