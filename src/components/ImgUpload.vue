<template>
  <div id="imgUpload" :style="{width:width || '100%', height:height || '100%' }">
    <div class="input-area" :style="{left: !multiple ? 0 : fileList.length * 105 + '%' }">
      <input type="file" @change="getFile($event)" class="file-input" accept="image/jpeg,image/jpg,image/png,image/svg">
      <i class="el-icon-plus icon-add" style="font-size: 30px; color: #888"></i>
    </div>

    <div class="thumbnail" v-show="fileList && fileList.length" v-for="(imgSrc, index) in imgSrcList" :key="index" :style="{left: !multiple ? 0 : index * 105 + '%' }">
      <img :src="imgSrc" alt="" class="image">
      <div class="operation-container">
        <div class="operation">
          <i class="el-icon-circle-close icon-toPreview --icon"  @click="deleteFile(index)"></i>
          <i  class="el-icon-zoom-in icon-delete --icon"  @click="showPreviewImg(imgSrc)"></i>
        </div>
      </div>
    </div>

    <div class="-preview-wrapper" v-show="showPreview">
      <div class="--modal">
        <i class="el-icon-close" @click="hidePreviewImg"></i>
        <img :src="previewImgSrc" alt="" id="preview">
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ImgUpload',
    props: {
      name: String, // 不传name返回file， 传name 返回{name: <name>, file: <file>},父元素通过监听onGetFile获得数据
      multiple: Boolean,  // 默认只能传单个，传多个会返回[<file>,<file>]
      maxSize: Number, // 单位M
      width: Number,
      height: Number,
    },
    data () {
      return {
        fileList:[],
        imgSrcList: [],
        maxSizeDefault: 5 ,// 默认最大5M
        previewImgSrc: '',
        showPreview: false,   // 显示预览
      }
    },
    methods: {
      getFile (event) {
        let files = event.target.files;
        if (files.length) {
          let file = files[0];
          let fileSize = file.size;
          let maxSize = this.maxSize || this.maxSizeDefault;
          if(fileSize > maxSize * 1024 * 1024){
            this.$message({
              message: `请上传小于${maxSize}M的图片`,
              type:'warning'
            });
            return
          }
          if (!this.multiple) {
            this.imgSrcList.length = 0;
            this.fileList.length = 0;
          }
          let reader=new FileReader();
          let that = this;
          reader.readAsDataURL(file);    //将文件读取为 DataURL(base64)
          reader.onload=function(evt){   //读取操作完成时触发。
            that.imgSrcList.push(evt.target.result)
          };
          this.fileList.push(file);
          this.passToParent();
        }
      },
      deleteFile (index) {
        this.fileList.splice(index, 1);
        this.imgSrcList.splice(index, 1);
      },
      passToParent () {
        let file = this.multiple ? this.fileList : this.fileList[0];
        let res = this.name ? {name: this.name, file } : file;
        this.$emit('onGetFile', res)
      },
      showPreviewImg (imgSrc) {
        this.previewImgSrc = imgSrc;
        this.showPreview = true;
      },
      hidePreviewImg () {
        this.previewImgSrc = '';
        this.showPreview = false;
      }
    }
  }
</script>

<style scoped lang="scss">
  #imgUpload{
    position: relative;
    border-radius: 6px;

    .input-area{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      background: #fbfdff;
      border-radius: 6px;
      border: 1px dashed #d9d9d9;
      &:hover {
        border-color: #409EFF;
      }
      .icon-add{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1;
      }
      .file-input{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        z-index: 10;
        cursor: pointer;
      }
    }

    .thumbnail{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 6px;
      overflow: hidden;
      z-index: 2;
      box-shadow: 0 0 3px #aaa;
      img{
        width: 100%;
        height: 100%;
      }
      .operation-container{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 5;
        opacity: 0;

        transition: all 0.2s linear;
        &:hover{
          opacity: 1;
          background: rgba(0,0,0,0.35);
        }
        .operation{
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 30%;
          min-width: 70px;
          max-width: 300px;
          .--icon{
            color: #fff;
            font-size: 30px;
            cursor: pointer;
          }
          .icon-toPreview{

          }
          .icon-delete{
            margin-left: 10px;
          }
        }
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
        width: 30%;
        >img{
          width: 100%;
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
  }
</style>
