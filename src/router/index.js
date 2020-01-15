import Vue from "vue";
import Router from "vue-router";
import Home from "../views/Home.vue";

Vue.use(Router);

export const constantRoutes = [{
    path: '/',
    redirect: '/home'
  },
  {
    path: "/home",
    component: Home,
    name: "home",
    hidden: true,
    children: [{
        path: "/home",
        component: () => import("../views/homCon/index")
      },
      {
        path: "/userManagementList",
        component: () => import( /* webpackChunkName: "userManagement" */ "../views/userManagement/userManagementList")
      },
      {
        path: "/userDetail/:id",
        name: 'userDetail',
        component: () => import( /* webpackChunkName: "userManagement" */ "../views/userManagement/userDetail")
      },
      {
        path: "/tradingRecord",
        component: () => import("../views/dataMeansManage/TradingRecord")
      },
      {
        path: "/quotaRecord",
        component: () => import("../views/quotaManage/QuotaRecord.vue")
      },
      {
        path: "/quotaDetail",
        component: () => import("../views/quotaManage/QuotaRecordDetail.vue")
      },
      {
        path: "/quotaAduit",
        component: () => import("../views/quotaManage/QuotaAduit.vue")
      },
      {
        path: "/commissionSharingManagement",
        component: () => import( /* webpackChunkName: "settings" */ "@/views/settings/commissionSharingManagement")
      },
      {
        path: "/commonProblem",
        component: () => import( /* webpackChunkName: "settings" */ "@/views/settings/commonProblem")
      },
      {
        path: "/versionManagement",
        component: () => import( /* webpackChunkName: "settings" */ "@/views/settings/versionManagement")
      },
      {
        path: "/versionDetail",
        component: () => import( /* webpackChunkName: "settings" */ "@/views/settings/versionManagement/versionDetailAndAddition")
      },
      {
        path: "/versionAddition",
        component: () => import( /* webpackChunkName: "settings" */ "@/views/settings/versionManagement/versionDetailAndAddition")
      },
      {
        path: "/whiteListManagement",
        component: () => import( /* webpackChunkName: "settings" */ "@/views/settings/whiteListManagement")
      },

      {
        path: "/xinMallManagement",
        component: () => import( /* webpackChunkName: "xinProjectManagement" */ "@/views/xinProjectManagement")
      },

      {
        path: "/xinProductManagement",
        component: () => import( /* webpackChunkName: "xinProjectManagement" */ "@/views/xinProjectManagement")
      },
      {
        path: "/merchantManagement",
        component: () => import( /* webpackChunkName: "merchantManagement" */ "@/views/merchantManagement")
      },
      {
        // 广告图管理
        path: "/advertisingMap",
        name: "advertisingMap",
        component: () => import("../views/contentManagement/advertisingMap")
      },
      {
        // 赚赚图片管理
        path: "/pictures",
        name: "pictures",
        component: () => import("../views/contentManagement/pictures")
      },
      {
        // 海报管理
        path: "/poster",
        name: "poster",
        component: () => import("../views/contentManagement/poster")
      },
      {
        // 消息管理
        path: "/news",
        name: "news",
        component: () => import("../views/contentManagement/news")
      },
      {
        // 爆币规则列表
        path: "/explosionRules",
        name: "explosionRules",
        component: () => import("../views/ruleManagement/explosionRules")
      },
      {
        // 爆币审核列表
        path: "/explosiveCoinReview",
        name: "explosiveCoinReview",
        component: () => import("../views/ruleManagement/explosiveCoinReview")
      },
      {
        // 爆币记录
        path: "/explosionRecords",
        name: "explosionRecords",
        component: () => import("../views/ruleManagement/explosionRecords")
      },


      {
        // 城客、品客管理
        path: "/cardManagement",
        name: "cardManagement",
        component: () => import("../views/backstageManagement/cardManagement")
      },
      {
        // 规则设置
        path: "/rulesSetting",
        name: "rulesSetting",
        component: () => import("../views/dataMeansManage/RulesComponent")
      },
      {
        // 卡片及原价设置
        path: "/cardSetting",
        name: "cardSetting",
        component: () => import("../views/dataMeansManage/IdentitySetComponent")
      },
      // {
      //   path: "/userManagement",
      //   name: "userManagement",
      //   component: () => import("../views/authorityManagement/userManagement")
      // }
    ]
  },
  {
    path: "/login",
    name: "login",
    component: () => import( /* webpackChunkName: "login" */ "@/views/login")
  },
  {
    path: "/register",
    name: "register",
    component: () => import( /* webpackChunkName: "login" */ "@/views/register")
  },
  {
    path: "/registerResult",
    name: "registerResult",
    component: () =>
      import( /* webpackChunkName: "login" */ "@/views/registerResult")
  },
  {
    path: "/passwordReset",
    name: "passwordReset",
    component: () =>
      import( /* webpackChunkName: "login" */ "@/views/passwordReset")
  },

];

export const asyncRoutes = [];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({
      y: 0
    }),
    routes: constantRoutes
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
