import { freezeObj } from '../tools'

// 用户类型
export const UserTypeEnum = {
  COMMON: 0,     // 普通用户
  COMPANY: 1,    // 企业
  STAFF: 2,      // 员工
};

// 注册资质审核结果
export const RegistrationInfoReviewResultEnum = {
  NOT_SUBMITTED: -1,   // 未提交资质
  IN_REVIEWING: 0,     // 审核中
  APPROVED: 1,         // 审核通过
  REJECTED: 2          // 审核失败
};

// 注册审核结果（用于页面状态）
export const RegistrationReviewResultForPageEnum = {
  SUCCESS:    20000,        // 注册成功
  FAIL:       10000,        // 注册失败
  REVIEWING:  30003,        // 审核中
  INVALID:    50000         // 已失效
};

// 一般问题分类
export const CommonProblemTypeEnum = {
  ABOUT_TEAM: '0',         //关于团队
  ABOUT_SHARE: '1',        //关于分享
  ABOUT_COMMISSION:'2'     //关于佣金
};

// 问题开启状态
export const CommonProblemOpenStateEnum = {
  OPEN: 1,               //开启
  CLOSE: 0,              //关闭
};


// 编辑的类型
export const EditingTypeEnum = {
  CREATION: '0',              //创建
  EDITING: '1',               //编辑
};

// APP类型
export const AppTypeEnum = {
  ANDROID: 1,
  IOS: 2,
};

// APP更新类型
export const AppUpdateTypeEnum = {
  UNFORCED: 0,      //非强制
  FORCE: 1,         //强制
};

// 用户身份
export const UserIdentifyEnum = {
  ORDINARY_MEMBER: 1,     // 普通会员
  GUIDANCE_TEACHER: 2,    // 导师
  PRINCIPAL: 3,           // 校董
  XIN_CUSTOMER: 4         // 芯客
};

// 产品类型
export const ProjectTypeIdEnum = {
  XIN_MALL: 1,        // 芯城
  XIN_PRODUCT: 2      // 芯品
};

// xto审核状态
export const ProjectOnlineStatusEnum = {
  WAITING_REVIEW: 0,                                   // 待审核
  APPROVE_BY_GUIDANCE_TEACHER_OR_PRINCIPAL: 1,         // 校董或导师通过
  REJECT_BY_GUIDANCE_TEACHER_OR_PRINCIPAL:2,           // 校董或导师驳回
  WAITING_ON_LINE: 3,                                  // 芯际待上线
  ON_LINE: 4 ,                                         // 芯际通过
  OFF_LINE: 5 ,                                        // 芯际通过
};

// 是否发行XTO
export const XTOReleaseStatusEnum  =  {
  RELEASE: 1,             // 待审核
  NOT_RELEASE: 0,         // 校董或导师通过
};

// 商户上架状态
export const MerchantOpeningStatusEnum  =  {
  OPEN: 1,             // 开启的
  CLOSED: 0,           // 关闭的
};




freezeObj(RegistrationInfoReviewResultEnum);
freezeObj(RegistrationReviewResultForPageEnum);
freezeObj(CommonProblemTypeEnum);
freezeObj(CommonProblemOpenStateEnum);





