
<template>
    <div class="login">
    
    <div class="header">
        项目管理信息平台 <span class="ver">v1.0 - d</span><br />
        <span class="sub">PROJECT MANAGEMENT INFORMATIO SYSTEM</span>
    </div>
    
    <div class="login-wrap">
        <gLogin :loading="loading" @submit="submitForm" @forget="forget"/>
    </div>
    <Modal v-model="isVerificationShow" footer-hide width="430">
  <PuzzleVerification
      :puzzleImgList="puzzleImgList"
      blockType="puzzle"
      :onSuccess="handleSuccess"
      width="400"
      height="230"

    />
    </Modal>
    <div class="footer">
        <div class="company">
            <img src="/static/img/logo-black-tran.png"> 
        <div class="desc">
        <span style='font-size:20px;'>宁波江北开发投资集团有限公司</span><br />
        联系地址: 宁波市江北区慈城镇保黎北路55号 <br />
        系统管理员(开发): 15991913205（马）
        </div>
        </div>
    </div>
    </div>
</template>

<script>
import DNAAnimation from '@refs/misc/dna.vue'
import gLogin from '@refs/gzUI/login/index'
import PuzzleVerification from 'vue-puzzle-verification'
import { mapActions } from 'vuex'

export default {
    data: function () {
        return {
            loading: false,
            error:false,
            isVerificationShow:false,
            puzzleImgList:['https://nbgz-pmis-1257839135.cos.ap-shanghai.myqcloud.com/code.jpg']
        }
    },
    components:{gLogin,PuzzleVerification},
    mounted(){
        let skey = localStorage.getItem("kt-token")
        let path = localStorage.getItem("last-route-path")
        var that = this
        if(skey){
            this._whoami(skey).then(userinfo=>{
                if(!path || path == '/')
                    path = "/dashboard"
                that.$router.push(path)
            })
        }
        
    },
    methods: {
        ...mapActions('user', {
            login: 'login',
            _whoami:"whoami",
            logout: 'logout',
            forgetPassword:"forgetPassword"
        }),
        handleSuccess(e){
        },
        submitForm(formData) {
            this.loading = true
            this.error = false
            var that = this
            
            this.login(formData).then(token => {
                this.$Notice.success({
                    title: '登录成功'
                })
                setTimeout(() => { 
                    this.loading = false; 
                    that.$router.push("/dashboard")
                }, 1000)
            }).catch(e => {
                this.error = true;
                this.$Modal.error({
                    title: '登录失败',
                    content: e
                })
                setTimeout(() => { this.loading = false }, 1000)
            })    
        },
        forget(formData){
            this.loading = true
            let phone = formData.phone
            this.forgetPassword(phone).then(()=>{
                 this.$Modal.success({
                    title:"操作成功",
                    content: '您的密码已发送至:'+phone+",请收到之后，及时进行修改"
                })
            }).catch(e=>{
                 this.error = true;
                this.$Modal.error({
                    title: '发送失败',
                    content: e
                })
            }).finally(()=>{
                 setTimeout(() => { this.loading = false }, 1000)
            })
        }
    }
}
</script>