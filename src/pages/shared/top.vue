<template>
    <div class='top flex-between' :style="this.page?'margin:0 auto;max-width:1200px;width:100%;':'width:100%'">
        <div class="flex-wrap">
            <div class="icon-button logo visible-xs-block">
                <Icon type="md-menu" size="40" color="#fff" />
            </div>
             <div class='seperator visible-xs-block' style="margin-right:5px;margin-left:0px;height:25px;" />
            <div class="icon-button logo hidden-xs" @click="routeTo('dashboard')">
                <img src="https://nbgz-pmis-1257839135.cos.ap-shanghai.myqcloud.com/kt/logo.png" :xs='0' style="height:25px;position:relative;top:0px;" />
            </div>
            
            <div class='seperator hidden-xs' style="margin-right:15px;margin-left:0px;height:25px;" v-if="title" />

            <div class="sub-title" v-if="title">
                {{title}}
            </div>
            <div class="hidden-xs">
            <slot></slot> 
            </div>
        </div>
        <div class="flex-wrap" style="justify-content:right;
        overflow:visible;height:40px;">
            <span class="text-button text-button-pro hidden-xs" @click="showdebug=!showdebug" v-if="P.DEV">调试工具</span>

             <div class="text-button text-button-pro hidden-xs" :class="'hightlight-text-button '+(showMsgBox?'active-text-button':'')" style="" @click="showMsgBox=!showMsgBox;showOrderBox=false;showTaskBox=false;">
                <Icon type="ios-notifications-outline" size="18" style="margin-right:5px" /> 通知 <span class='value'>5</span>
            </div> 

            <div class="icon-button visible-xs-block">
                 <Icon  type="ios-notifications-outline" size="35" style="margin-right:0px;color:#fff;font-weight:bold;" />
            </div>
            
            <div class='seperator hidden-xs' style="margin-right:15px;margin-left:5px;height:20px;" /> 

            <Dropdown trigger="click"  @on-click='onUserAction'>
                <div class="flex-wrap" style="margin-right:5px;">
                <gAvatar class="hov-shadowed" :size="35" :avatar="userinfo.avatar || 'https://nbgz-pmis-1257839135.cos.ap-shanghai.myqcloud.com/icon/user.png'" :frame="userinfo.frame"  style="position:relative" />

                <div class="text-button text-button-pro hidden-xs"  style="color:yellowgreen;border:none;"> {{userinfo.name}}
                    <Icon type="md-arrow-dropdown" style="font-size:20px;color:#444;text-shadow:-1px -1px 1px #000;margin-left:3px;" />
                </div>
                </div>
                <DropdownMenu slot="list">
                    <DropdownItem name='changepass'>修改密码</DropdownItem>
                    <DropdownItem name='usercenter'>个人中心</DropdownItem>
                    <DropdownItem name='admin' v-if="P.ADMIN">后台管理</DropdownItem>
                    <DropdownItem name='dev' v-if="P.DEV">开发者</DropdownItem>
                    <DropdownItem name='exit' divided>退出</DropdownItem>
                </DropdownMenu>
            </Dropdown>    
        </div>

         <div style="height:0px;position:absolute;left:0;right:0;bottom:3px;border-top:2px solid #000;border-bottom:1px solid #333;" />

        <!-- DEBUG MODAL -->
        <Modal title="调试" style="padding:10px;" footer-hide draggable v-model="showdebug">
            <div style="padding:10px;padding-left:120px;">
            用户: <Select style='display:inline-block;width:200px;' transfer :value="userinfo.id"  @on-change="debug_change_user"> <Option :key="d.id" :name="d.id" v-for="d in users" :value="d.id">
                 {{d.name}}
            </Option>
            </Select><br />
                部门: <Select ref='debug_deps' style='display:inline-block;width:300px;margin-top:5px;' multiple transfer :value="userinfo.deps"  @on-select="debug_change_dep"> <Option :key="d.id" :name="d.id" v-for="d in deps" :value="d.id">
                        {{d.name}}
                </Option>
            </Select><br />
                角色: <Select  ref='debug_roles' style='display:inline-block;width:300px;margin-top:5px;' multiple transfer :value="userinfo.roles"  @on-select="debug_change_role"> <Option :key="d.id" :name="d.id" v-for="d in roles" :value="d.id">
                        {{d.name}}
            </Option>
            </Select>
            <gAvatar :userinfo="userinfo" :size="80" style="position:absolute;left:20px;top:45px;" />
            <br />
            <div class="log">
                </div>
                    </div>
        </Modal>
      
       
        
        <!-- LOGIN MODAL -->
        <div class="login-mask" v-if="!isLogin">
            <div class="login-wrap">
                <div class="promp">{{isLogin?"已登录":"您的登录状态已过期，请重新登录"}}</div>
                <gLogin :loading="loading" @submit="submitForm" @forget="forget"/>
            </div>

            <Modal v-model="showError" title="错误" :z-index="1000" footer-hide width="300">
                <div style="padding:20px;background:#777;color:#fff;font-size:14px;">
                {{error_msg}}
                </div>
            </Modal>
        </div>

        <!-- FORGET PASSWORD MODAL -->
        <gModalForm ref="FormChangePassword" title="修改密码" v-model="showChangePassword" :form="formChangePassword" :data="modelChangePass" @on-submit="ChangePassword" editable />
    </div>
</template>
<script>

import {mapGetters, mapActions, mapMutations} from 'vuex' 
import gLogin from '@refs/gzUI/login/index'
import gAvatar from '@refs/avatar/index'
import gMsgList from './msg.vue'
import gOrderList from './order.vue'
import gTaskList from './task.vue'
import gTask from './task_form.vue'
import gOrder from './order_form.vue'
import gModalForm from '@refs/gzUI/form/modalForm'
export default {
    data(){
        return {
            loading:false,
            showError:false,
            error_msg:"",
            error:false,
            showMsgBox:false,
            showOrderBox:false,
            showTaskBox:false,
            showMsg:false,
            showOrder:false,
            showTask:false,
            showdebug:false,
            showChangePassword:false,
            msg:{},
            task:{},
            order:{},
            modelChangePass:{},
            formChangePassword:{
                layout:"<div><Row><Col :span='24'>{{oldpass}}</Col></Row><Row style='margin-top:5px'><Col :span='24'>{{newpass}}</Col></Row><Row style='margin-top:5px'><Col :span='24'>{{newpass2}}</Col></Row></div>"
                ,
                def:{
                    oldpass:{
                        label:"旧密码",
                        control:'input',
                        option:{
                            type:'password',
                            placeholder:"请再输入旧密码",
                            required:true
                        }

                    },
                    newpass:{
                        label:"新密码",
                        control:'input',
                        option:{
                            type:'password',
                            placeholder:"请输入新密码",
                            required:true
                        }

                    },
                    newpass2:{
                        label:"确认新密码",
                        control:'input',
                        option:{
                            type:'password',
                            placeholder:"请再输入一次新密码",
                            required:true
                        }
                    }
                }
            }
        }
    },
    computed:{
        ...mapGetters('user',{
            isLogin:'isLogin',
            userinfo:"userinfo",
            roles:"roles",
            deps:"deps",
            users:"users",
            P:"permissions"
        }),
        routedPage(){
            let path = this.$route.path
            return path.substr(1)
        },
        
        mydeps(){
            if(this.userinfo && this.userinfo.deps)
                return this.userinfo.deps.map(v=>this.getDep(v))
            else
                return []
        }
    },
    props:{
        title:{
            type:String
        },
        menus:{
            type:Array,
            default:()=>[]
        },
        page:{
            type:Boolean,
            default:false
        }
    },
    mounted(){
        var that = this
        this.$store.dispatch('user/whoami').then(res=>{
            that.$store.dispatch('user/queryDeps')
            that.$store.dispatch('user/queryRoles')
            that.$store.dispatch('type/getData')
        })
        this.$Notice.config({
            top: 550,
            duration: 2
        });

        this.$Message.config({
            bottom:850,
            duration:2
        })
        
        
    },
    components:{
        gLogin,gAvatar,gMsgList,gOrderList,gOrder,gTask,gTaskList,gModalForm
    },
    methods:{
        ...mapMutations('user',['patchUserinfo']),
        ChangePassword(e){
            if(e.newpass != e.newpass2){
                this.$refs.FormChangePassword.setError('newpass2','两次密码输入不一致')
                return
            }


            this.$store.dispatch('user/changePassword',e).then(res=>{
                this.Success('密码修改成功')
                this.showChangePassword = false
            }).catch(e=>{
                this.Error(e)
            })

        },
        onUserAction(e){
            if(e=="exit"){
                this.logout()
            }else if(e=='changepass'){
                this.showChangePassword = true
            }else if(e=='usercenter'){
                this.routeTo('self')
            }else if(e=='admin'){
                this.routeTo('admin')
            }else if(e=='dev'){
                this.routeTo('dev')
            }   
        },
        logout(){
            this.$store.dispatch('user/logout').then(res=>{
                this.$router.push("/")
            })
        },
        getDep(dep_id){
            let dep = this.deps.find(v=>v.id == dep_id)
            if(dep)
                return dep
            else
                return {}
        },
        debug_change_role(e){

        },
        debug_change_user(e){
            this.$store.dispatch('user/loginDebug',{id:e}).then(res=>{
                this.Success("登录成功")
            }).catch(e=>{
                this.Error(e)
            })
        },
        debug_change_dep(e){
            let dep_id = e.value
            let user_deps = this.userinfo.deps
            let action = 'user/addUserDep'
            if(user_deps.includes(dep_id)){
                action = 'user/removeUserDep'
            }
            this.$store.dispatch(action,dep_id).then(()=>{
                this.$Notice.success({
                    title:"操作成功",
                    desc:"用户部门已修改"
                })
            }).catch(e=>{
                console.error(e)
                this.$Notice.error({
                    title:"操作失败",
                    desc:e
                })
            })
        },
        changeRole(e){
            console.log('change:',e)
            this.patchUserinfo({role:e})
        },
        openMsgBox(e){
            this.msg = e
            this.showMsg = true
        },
        openOrderBox(e){
            this.order = e
            this.showOrder = true
        },
        openTaskBox(e){
            this.task = e
            this.showTask = true
        },
        mapRoleName(e){
            const map = {
                dev:"开发人员",
                admin:"系统管理员",
                ob:"系统巡查员",
                member:"员工"
            }

            return map[e]
        },
        routeTo(t){
              let path = "/" + t
            if(this.$route.path != path)
                this.$router.push(path)
            }
        ,
          submitForm(formData) {
            this.loading = true
            this.error = false
            var that = this
            
             this.$store.dispatch('user/login',formData).then(token => {
                this.$Notice.success({
                    title: '登录成功'
                })
                setTimeout(() => { 
                    this.loading = false; 
                }, 1000)
                that.$bus.$emit("ready")
                that.$emit("ready")
            }).catch(e => {
                this.error = true;
                this.error_msg = e
                this.showError = true
                setTimeout(() => { this.loading = false }, 1000)
            })    
        },
        forget(formData){
            this.loading = true
            let phone = formData.phone
             this.$store.dispatch('user/forgetPassword',phone).then(()=>{
                 this.$Modal.success({
                    title:"操作成功",
                    content: '您的密码已发送至:'+phone+",请收到之后，及时进行修改"
                })
            }).catch(e=>{
                 this.error = true;
                this.error_msg = e
                this.showError = true
            }).finally(()=>{
                 setTimeout(() => { this.loading = false }, 1000)
            })
        }
    }
}
</script>

<style lang="less" scoped>
.debug{
    transition:all 1s;
    position: fixed;
    z-index:10000;
    right:10px;
    top:60px;
    min-height:40px;
    background:linear-gradient(to bottom right,rgba(33,33,33,0.5),rgba(0,0,0,0.5)),url('https://nbgz-pmis-1257839135.cos.ap-shanghai.myqcloud.com/black.jpg');
    background-blend-mode: multiply;
    color:#fff;
    border:1px solid #333;
    padding:10px;
    border-radius: 5px;
    max-width: 500px;

   

    .log{
        width:100%;
        position: relative;
        max-height:400px;
        padding:10px;
        text-overflow: ellipsis;
        overflow:hidden;
        overflow-y:auto;
        background:#333;
        margin-top:10px;
    }

    .tool{
        position: absolute;
        right:10px;
        top:10px;
    }

    overflow: hidden;
}

.debug-hide{
    overflow: hidden;
}
.top{
     position: fixed;
        left:0;
        height:50px;
        top:0;
        right:0;
        z-index:2000;
        background:linear-gradient(to bottom right,rgba(33,33,33,0.5),rgba(0,0,0,0.5)),url('https://nbgz-pmis-1257839135.cos.ap-shanghai.myqcloud.com/black.jpg');
        background-blend-mode: multiply;
        filter:drop-shadow(0 1px 3px #333);
        border-bottom:1px solid #333;
        box-sizing: border-box;

        display: flex;
        align-items: center;
        justify-content: space-between;

        .logo{
            filter:brightness(1.2);
        }

        .title{
            font-size:16px;
            
            color:#fff;
            font-family: sans-serif;
            text-shadow: -1px -1px 2px #000;
        }

        .sub-title{
            color:#fff;
            font-size:16px;
            position: relative;
            bottom:-1px;
            letter-spacing: 3px;
            text-shadow:-2px -2px 3px #000,0 0 5px #333;
            color:orange;

        }

        .hov-shadowed{
            filter:drop-shadow(1px 1px 1px #000);
        }

        .name-board{
           
            background:#111;
            
            border-left:none;
            border-top-right-radius: 7px;
            border-bottom-right-radius: 7px;
            z-index:0;
            height:20px;
            font-size:12px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
}

.icon-button{
    padding:10px;
}

.text-button{
    padding:10px;
    color:#fff;
    font-size:14px;
    font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    display: flex;
    align-items: center;
    

    
}


.text-button-pro{
    color:#888;border:1px solid #888;height:27px;border-radius:5px;margin-right:5px;
    border:none;
    .value{
        font-weight:bold;
        margin-left:5px;
    }
}

.hightlight-text-button{
    border-color:yellowgreen;
    color:yellowgreen;
   
}

.active-text-button{
  filter:brightness(1.2);
}

.icon-button:hover,.text-button:hover{
    filter:brightness(1.5);
    cursor: pointer;
}

.icon-button:active,.text-button:active{
    position: relative;
    top:1px;
}


.login-mask{
    position: fixed;
    top:0;
    left:0;
    bottom:-2000px;
    right:0;
    z-index:10000;
    background:rgba(0,0,0,0.6);
    backdrop-filter:blur(2px);

    .login-wrap{
        position: relative;
        width:600px;
        margin:100px auto;
    }

    .promp{
        font-size:15px;
        color:#fff;
        margin:10px 0;
    }
}

</style>