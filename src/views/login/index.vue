<template>
  <div id="login" >
    <img class="logo" src="../../assets/image/logo-white.png"/>
    <el-row style="height: 100%">
       <el-col :span="10" style="position: relative; height:100%">
         <div class="__modal">
           <el-row class="welcome">
             <span class="text">{{$lan('欢迎来到分布式电商系统后台')}}</span>
           </el-row>
           <el-form ref="form" :model="form" class="__form">
             <el-form-item>
               <label for="username">{{$lan('用户名')}}</label>
               <el-input v-model="form.username" id="username" :placeholder="$lan('请输入您的用户名')" class="height-configurable input"></el-input>
             </el-form-item>
             <el-form-item>
               <label for="password">{{$lan('密码')}}</label>
               <el-input v-model="form.password" id="password" show-password :placeholder="$lan('请输入密码')" class="height-configurable input"></el-input>
             </el-form-item>
             <el-form-item style="position: relative">
               <label for="password">{{$lan('验证码')}}</label>
               <img :src="img_code_url" class="img-code" @click="get_img_code"/>
              <!-- <el-image
                 style="width: 120px; height: 50px;"
                 @click="getImgCode"
                 class="img-code"
                 :src="imgCodeUrl"
                 fir="fill"/>-->
               <el-input v-model="form.code" id="code"  :placeholder="$lan('请输入验证码')" class="height-configurable input"></el-input>
             </el-form-item>
             <el-form-item>
               <el-button type="primary" round @click="to_log_in" :loading="btnLoading"  class="btn-login">{{$lan('登录')}}</el-button>
             </el-form-item>
           </el-form>
         </div>
       </el-col>
    </el-row>
    <HiddenFunction></HiddenFunction>
  </div>
</template>

<script>
  import userApi from '../../apis/userApi'
  import { createNamespacedHelpers } from 'vuex'
  import HiddenFunction from '../../components/HiddenFunction'
  const { mapGetters, mapMutations } = createNamespacedHelpers('user');
  import { getUuid } from '../../utils/tools'

  export default {
    name: 'login',
    components: {
      HiddenFunction
    },
    data () {
      return {
        form: {
          username: '',
          password: '',
          code: '',
        },
        companyConsortiumId: '',
        consortiumName: '',
        img_code_url: '',
        uuid: '',
        btnLoading: false
      }
    },
    created () {
      this.get_img_code();
      let that = this;
      setTimeout(() => {
        if (that.isLogin) {
          that.$router.replace('/home')
        }
      });
      this.companyConsortiumId = this.$route.query.companyConsortiumId
      this.consortiumName = this.$route.query.consortiumName
    },
    computed: {
      ...mapGetters(['isLogin'])
    },
    methods: {
      get_img_code () {
        this.uuid = getUuid();
        this.img_code_url = userApi.getImgCode(this.uuid);
      },
      to_log_in () {
        if (!this.form.username) {
          this.warning('请输入用户名');
          return
        }
        if (!this.form.password) {
          this.warning('请输入密码');
          return
        }

        if (!this.form.code) {
          this.warning('请输入验证码');
          return
        }

        this.btnLoading = true
        userApi.login(this.form.username, this.form.password, this.uuid, this.form.code).then((res) => {
          let data = res['data'] || {};
          let token = data.token;
          this.SET_TOKEN(token);
          this.SET_USER_INFO(data);
          this.$message({
            message: '登录成功！',
            type: 'success'
          });
          let that = this;
          setTimeout(() => {
            that.$router.push('/home');
          },1000)
          this.btnLoading = false;

        }).catch(() => {
          this.btnLoading = false;
          this.get_img_code()
        })
      },
      warning (text) {
        this.$message({
          message: text,
          type: 'warning'
        })
      },
      ...mapMutations(['SET_TOKEN', 'SET_USER_INFO'])
    }
  }
</script>

<style scoped lang="scss">
  #login {
    height: 100%;
    position: relative;
    background: url('../../assets/image/login/bg-login.png') no-repeat;
    background-size:cover;
    .logo{
      position: absolute;
      top: 45%;
      right: 27%;
      transform: translate(50%, -50%);
      width: 25%;
    }
    .__modal {
      width: 80%;
      position: absolute;
      top: 45%;
      left: 60%;
      transform: translate(-50%, -50%);
      .welcome{
        margin-bottom: 40px;
        text-align: left;
        .text{
          color: #fff;
          font-size: 42px;
          font-weight: 700;
        }
      }
      label{
        color: rgb(114,115,140);
        font-size: 18px;
        margin-bottom: 0;
      }
      .__form{
        width: 70%;
      }
      .img-code{
        position: absolute;
        bottom: 4px;
        right: 0;
        width: 120px;
        height: 50px;
        z-index: 10;
        cursor: pointer;
      }

      .input{
        /*width: ;*/
        height: 50px;
        font-size: 18px;
        font-weight: bold;
      }
      .btn-login{
        width: 75%;
      }
      /deep/.el-input__inner{
        background-color: rgba(0,0,0,0) ;
        border-radius: 0;
        border: none;
        border-bottom: 2px solid rgb(199,199,199);
        padding: 0;
        color: #fff;
      }
      .btn-login{
        margin-top: 40px;
        height: 56px;
        font-size: 22px;
        font-weight: bold;
      }
      /deep/.el-button.is-round{
        border-radius: 28px;
      }
      /deep/.el-input__inner{
        color: #fff;
      }

    }
    .reset-and-register{
      margin-top: 40px;
      .forget-password{
        color: rgb(114,115,140);
        font-size: 18px
      }
      .register{
        margin-left: 40px;
        color: #fff;
        font-size: 22px
      }
    }

    /deep/input:-webkit-autofill , textarea:-webkit-autofill, select:-webkit-autofill {
      -webkit-text-fill-color: #ededed !important;
      -webkit-box-shadow: 0 0 0px 1000px transparent  inset !important;
      background-color:transparent;
      background-image: none;
      transition: background-color 50000s ease-in-out 0s; //背景色透明  生效时长  过渡效果  启用时延迟的时间
    }

  }
</style>
