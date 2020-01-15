<template>
  <div>
  <el-dialog
    :title="show_type === ShowTypeEnum.VIEWING ? '查看详情' : show_type === ShowTypeEnum.CREATING ? `编辑${project_name}` : ''"
    :visible.sync="centerDialogVisible"
    :before-close="close_outermost_dialog"
    width="50%"
    height="80%"
    center>
    <el-form ref="form" :model="form" label-width="35%" class="--form">
      <el-form-item :label="project_name + '编号:'">
        <span>{{project_data.projectNo}}</span>
      </el-form-item>
      <el-form-item :label="project_name + '名称:'">
        <el-input v-model="project_data.name" :disabled="is_locked" style="width: 200px;"></el-input>
      </el-form-item>
      <el-form-item :label="project_name + '归属:'">
        <el-select v-model="project_data.merchantId" placeholder="请选择" v-if="show_type === ShowTypeEnum.CREATING">
          <el-option
            v-for="item in merchant_list"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <span v-if="show_type === ShowTypeEnum.VIEWING">{{project_data.merchantName}}</span>
      </el-form-item>
      <el-form-item :label="'是否发行' + XTO + ':'">
        <el-select v-model="project_data.xtoRelease" placeholder="请选择" :disabled="is_locked" style="width: 150px;">
          <el-option label="是" :value="1"></el-option>
          <el-option label="否" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="XTO + '名称:'">
        <el-input v-model="project_data.xtoName" :disabled="is_locked" style="width: 200px;"></el-input>
      </el-form-item>
      <el-form-item :label="XTO + '过期时间:'">
        <el-select v-model="project_data.xtoExpiredTime" placeholder="请选择" :disabled="is_locked" style="width: 150px;">
          <el-option label="24小时" :value="24"></el-option>
          <el-option label="48小时" :value="48"></el-option>
          <el-option label="72小时" :value="72"></el-option>
          <el-option label="96小时" :value="96"></el-option>
          <el-option label="120小时" :value="120"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="'请上传' + XTO + '图标(宽度不限):'">
        <div class="project-icon-upload">
          <!--在这里设置centerDialogVisible,为了实现数据的重置 -->
          <el-upload
            v-if="show_type === ShowTypeEnum.CREATING && centerDialogVisible"
            class="avatar-uploader"
            :action="get_project_image_upload_api()"
            :show-file-list="false"
            :on-success="handle_upload_xto_icon_success"
            :before-upload="before_img_upload">
            <el-image
              class="avatar"
              v-if="xto_icon_url_temporary || project_data.xtoIconUrl"
              :src="xto_icon_url_temporary || project_data.xtoIconUrl"
              :preview-src-list="[xto_icon_url_temporary || project_data.xtoIconUrl]">
            </el-image>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
        <el-image
          v-if="show_type === ShowTypeEnum.VIEWING"
          style="width: 150px; height: 150px"
          :src="project_data.xtoIconUrl"
          :preview-src-list="[project_data.xtoIconUrl]">
        </el-image>
<!--        <el-input v-model="project_data.xtoIconUrl"></el-input>-->
      </el-form-item>
      <el-form-item :label="`推广${XTO}数量:`">
        <el-input type="number" v-model="project_data.xtoInviteMaxCount" :disabled="is_locked"  style="width: 30%;"></el-input>
      </el-form-item>
      <el-form-item :label="'每个推广MTO所需下属芯客MTO数量:'">
        <el-input type="number" v-model="project_data.xtoInviteRoundCount" :disabled="is_locked"  style="width: 30%;"></el-input>
      </el-form-item>
      <el-form-item :label="'消费' + XTO + '数量:'">
        <el-input type="number" v-model="project_data.xtoExchangeMaxCount" :disabled="is_locked"  style="width: 30%;"></el-input>
      </el-form-item>
      <el-form-item :label="'兑换一个消费' + XTO + '所需积分:'">
        <el-input type="number" v-model="project_data.xtoExchangeRoundPoint" :disabled="is_locked"  style="width: 30%;"></el-input>
      </el-form-item>
      <el-form-item label="芯城营业额分红比例:" v-if="project_type_id === ProjectTypeIdEnum.XIN_MALL" >
        <div class="percent" style="width: 30%; position:relative">
          <el-input type="number" v-model="project_data.profitMallPercent" :disabled="is_locked"></el-input>
          <span class="tcw_color_bg" style="text-align:center; width: 30%; height:100%; position:absolute; top:0; right: 0; color: #fff">%</span>
        </div>
      </el-form-item>
      <el-form-item label="芯品营业额分红比例:" style="position:relative" class="percent">
        <div style="width: 30%; position:relative">
          <el-input type="number"  v-model="project_data.profitBrandPercent" :disabled="is_locked"></el-input>
          <span class="tcw_color_bg" style="text-align:center; width: 30%; height:100%; position:absolute; top:0; right: 0; color: #fff">%</span>
        </div>
      </el-form-item>
      <el-form-item label="小程序的图片链接:">
        <el-input v-model="project_data.miniappUrl" :disabled="is_locked"  style="width: 80%;"></el-input>
      </el-form-item>
      <el-form-item label="请上传介绍图片(宽度不限):" class="upload-introduction-image">
        <ul class="image-list">
          <li v-for="(item, index) in project_data.projectDescPicture" :key="index">
            <el-image
              class="image"
              :src="item">
            </el-image>
            <span class="el-upload-list__item-actions" v-if="show_type === ShowTypeEnum.CREATING">
              <span class="el-upload-list">
                <span class="el-upload-list__item-preview" @click="show_img_preview(item)">
                  <i class="el-icon-zoom-in"></i>
                </span>
                <span class="el-upload-list__item-deletes" style="margin-left:15px" @click="handle_remove_project_desc_picture(index)">
                  <i class="el-icon-delete"></i>
                </span>
              </span>
            </span>
          </li>
        </ul>
        <!--在这里设置centerDialogVisible,为了实现数据的重置 -->
        <el-upload
          v-if="show_type === ShowTypeEnum.CREATING && centerDialogVisible"
          :action="get_project_image_upload_api()"
          :on-success="handle_upload_project_desc_picture_success"
          list-type="picture-card"
          :before-upload="before_img_upload"
          :on-preview="show_img_preview_type2"
          :on-remove="handle_remove_project_desc_picture_temporary">
          <i class="el-icon-plus"></i>
        </el-upload>
<!--        <el-input v-model="project_data.name"></el-input>-->
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" style="width:120px" @click="centerDialogVisible = false" >{{show_type === ShowTypeEnum.CREATING ? '放弃编辑' : '关闭'}}</el-button>
      <el-button type="primary" style="width:120px" @click="create_project" v-if="show_type === ShowTypeEnum.CREATING" :loading="btn_loading">确认待上线</el-button>
    </span>
  </el-dialog>
  <div class="-preview-wrapper" v-show="img_preview_visible">
    <div class="--modal">
      <i class="el-icon-close" @click="img_preview_visible = false"></i>
      <img :src="img_preview_url" alt="" id="preview">
    </div>
  </div>
  </div>
</template>

<script>
  import { ProjectTypeIdEnum, XtoReviewStatusEnum } from '../../../utils/data/enum';
  import xinProjectManagementApi from "../../../apis/xinProjectManagementApi";
  import merchantManagementApi from "../../../apis/merchantManagementApi";

  import ImgUpload from '../../../components/ImgUpload';
  const ShowTypeEnum = {
    CREATING: 0,
    VIEWING: 1,
  };
  export default {
    name: "ViewingAndCreatingXTO",
    data () {
      return {
        form:{},
        centerDialogVisible: false,
        show_type: '',
        project_type_id: '',
        project_name: '',
        XTO: '',
        project_data: {},
        xto_icon_url_temporary: '',   // 新传的xto_icon本地链接
        project_desc_picture_list_temporary: [], // 新传的desc_picture实际链接list
        project_desc_picture_file_list_temporary: [], // 新传的desc_picture的file list
        is_locked: true,
        img_preview_url: '',
        img_preview_visible: false,
        merchant_list: [],
        ProjectTypeIdEnum: ProjectTypeIdEnum,
        ShowTypeEnum: ShowTypeEnum,
        btn_loading: false,
      }
    },
    components: { ImgUpload },
    computed: {
      project_desc_picture_list_waiting_upload () {
        return this.project_data.projectDescPicture.concat(this.project_desc_picture_list_temporary);
      }
    },
    methods: {
      /**
       *
       * @param show_type 0创建 1查看
       * @param project_type_id  商城 品牌
       * @param project_data
       */
      show_dialog (show_type, project_type_id, project_data) {
        this.show_type = show_type;
        this.project_type_id = project_type_id;

        if (this.project_type_id === ProjectTypeIdEnum.XIN_MALL ) {
          this.project_name = '芯城';
          this.XTO = 'MTO';
        } else if (this.project_type_id === ProjectTypeIdEnum.XIN_PRODUCT) {
          this.project_name = '芯品';
          this.XTO = 'BTO';
        }

        this.is_locked = this.show_type === ShowTypeEnum.VIEWING;
        if (this.show_type === ShowTypeEnum.CREATING) {
          this.get_merchant_list();
        }

        this.project_data = JSON.parse(JSON.stringify(project_data || {}));
        this.project_data.profitMallPercent = (this.project_data.profitMallPercent * 100).toFixed(2);
        this.project_data.profitBrandPercent = (this.project_data.profitBrandPercent * 100).toFixed(2);
        if (this.project_data.projectDescPicture.constructor !== Array) {
          this.project_data.projectDescPicture = []
        }
        this.xto_icon_url_temporary = '';
        this.project_desc_picture_list_temporary = [];
        this.project_desc_picture_file_list_temporary = [];
        this.btn_loading = false;
        this.centerDialogVisible = true;
      },
      create_project () {
        let {id, name, xtoRelease, xtoName, xtoExpiredTime, xtoInviteMaxCount, xtoInviteRoundCount, xtoExchangeMaxCount, xtoExchangeRoundPoint, profitMallPercent, profitBrandPercent, xtoIconUrl, miniappUrl, projectDescPicture} = this.project_data;
        profitMallPercent = (profitMallPercent /100).toFixed(4) - 0;
        profitBrandPercent = (profitBrandPercent /100).toFixed(4) - 0;
        let project_name = this.project_name;
        let XTO = this.XTO;
        if(!name) {
          this.$message.error(`请填写${project_name}名称`);
          return;
        }
        if(this.$isNullOrEmpty(xtoRelease)) {
          this.$message.error(`请选择是否发行${XTO}`);
          return;
        }
        if(!xtoName) {
          this.$message.error(`请填写${XTO}名称`);
          return;
        }
        if(!xtoExpiredTime) {
          this.$message.error(`请选择${XTO}过期时间`);
          return;
        }
        if(!xtoIconUrl) {
          this.$message.error(`请上传${XTO}图标`);
          return;
        }
        if(!xtoInviteMaxCount) {
          this.$message.error(`请填写推广${XTO}数量:`);
          return;
        }
        if(!xtoInviteRoundCount) {
          this.$message.error(`请填写${project_name}名称`);
          return;
        }
        if(!xtoExchangeMaxCount) {
          this.$message.error(`请填写消费${XTO}数量:`);
          return;
        }
        if(!xtoExchangeRoundPoint) {
          this.$message.error(`请填写兑换一个消费${XTO}所需积分:`);
          return;
        }
        if(this.project_type_id === ProjectTypeIdEnum.XIN_MALL && !profitMallPercent) {
          this.$message.error(`请填写芯城营业额分红比例`);
          return;
        }
        if(!profitBrandPercent) {
          this.$message.error(`请填写芯品营业额分红比例`);
          return;
        }

        if(!miniappUrl) {
          this.$message.error('请填写小程序的图片链接');
          return;
        }
        if(!this.project_desc_picture_list_waiting_upload || !this.project_desc_picture_list_waiting_upload.length) {
          this.$message.error(`请上传介绍图片`);
          return;
        }
        this.btn_loading = true;
        projectDescPicture = projectDescPicture.concat(this.project_desc_picture_list_temporary);
        let data = {
          id, name, xtoRelease, xtoName, xtoExpiredTime, xtoExchangeMaxCount, xtoExchangeRoundPoint, xtoInviteMaxCount, xtoInviteRoundCount, profitMallPercent, profitBrandPercent, xtoIconUrl, miniappUrl, projectDescPicture: this.project_desc_picture_list_waiting_upload
        };
        xinProjectManagementApi.update_project(data).then(() => {
          this.$message({
            message: '编辑成功',
            type: 'success'
          });
          this.close_outermost_dialog();
          this.$emit('onCreateSuccess');
          this.btn_loading = false;
        }).catch(() => {
          this.btn_loading = false;
        })
      },
      get_project_image_upload_api () {
        return xinProjectManagementApi.upload_project_image();
      },
      get_merchant_list () {
        merchantManagementApi.get_merchant_list().then((res) => {
          let data = res['data'] || {};
          this.merchant_list = data.data || [];
        }).catch(() => {

        })
      },
      before_img_upload (file) {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 5;
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG或png 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 5MB!');
        }
        return isJPG && isLt2M;
      },
      handle_upload_xto_icon_success (res ,file) {
        this.xto_icon_url_temporary = URL.createObjectURL(file.raw);
        this.project_data.xtoIconUrl = res && res.data;
      },
      handle_upload_project_desc_picture_success (res, file) {
        this.project_desc_picture_file_list_temporary.push(file);
        this.project_desc_picture_list_temporary.push(res && res.data);
      },
      handle_remove_project_desc_picture (index) {
        this.project_data.projectDescPicture.splice(index, 1);
      },
      handle_remove_project_desc_picture_temporary (file) {
        let index = this.project_desc_picture_file_list_temporary.indexOf(file);
        this.project_desc_picture_file_list_temporary.splice(index, 1);
        this.project_desc_picture_list_temporary.splice(index, 1);
      },
      close_outermost_dialog () {
        this.centerDialogVisible = false;
      },
      show_img_preview (img_url) {
        this.img_preview_url = img_url;
        this.img_preview_visible = true;
      },
      show_img_preview_type2 (file) {
        this.show_img_preview(file.url)
      },
      warning (text) {
        this.$message({
          message: '创建成功',
          type: 'success'
        })
      },
    }
  }
</script>

<style scoped lang="scss">
  .--form{
    .el-form-item{
      margin-bottom: 12px;
    }
    .upload-introduction-image{
      >div{
        >ul{
          display: inline;
        }
        >div{
          display: inline;
          >ul{
            display: inline;
          }
        }
      }

      .image-list{
        >li{
          display: inline-block;
          position: relative;
          width: 148px;
          height: 148px;
          margin: 0 8px 8px 0;
          border-radius: 6px;
          overflow: hidden;
          .image{
            width: 100%;
            height: 100%;
          }
          .el-upload-list__item-actions {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            cursor: default;
            text-align: center;
            color: #fff;
            opacity: 0;
            font-size: 20px;
            background-color: rgba(0, 0, 0, 0.5);
            -webkit-transition: opacity .3s;
            transition: opacity .3s;
            &:hover{
              opacity: 1;
            }
            .el-upload-list{
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%,-50%);
              >span+span{
                margin-left: 5px;
                cursor: pointer;
              }
            }
          }
        }
      }
    }

  }
  .dialog-body{
    &.viewing{
      >div{
        border-bottom: 1px solid #ebeef5;
        &:hover{
          background-color: #f5f7fa
        }
      }
    }
    >div{
      padding-left: 10px;
      height: 45px;
      line-height: 45px;
      .input{
        width: 200px;
      }
      >label{
        display: inline-block;
        width: 300px;
        text-align: right;
        margin-right: 20px;
        color: #666;
      }
      >span{
        color: #333;
      }
    }
  }

  .dialog-footer {
    padding-bottom: 20px;
    >button+button{
      margin-left: 15px;
    }
  }
  .el-dialog__footer {
    padding-bottom: 40px;
  }

  .project-icon-upload {
    /deep/ .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

    /deep/ .avatar-uploader .el-upload:hover {
      border-color: #409EFF;
    }

    /deep/ .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 150px;
      height: 150px;
      line-height: 150px;
      text-align: center;
    }

    /deep/ .avatar {
      width: 150px;
      height: 150px;
      display: block;
    }
  }

  .-preview-wrapper {
    z-index: 99999;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.4);
    .--modal{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      height: 70%;
      /*width: 30%;*/
      >img{
        height: 100%;
      }
      .el-icon-close{
        position: absolute;
        top: 0;
        right: -50px;
        font-size: 36px;
        cursor: pointer;
        color: #fff;
      }
    }
  }


</style>
