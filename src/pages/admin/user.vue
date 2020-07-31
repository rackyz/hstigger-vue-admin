<template>
  <div class="l-page dashboard" >
     <Card style="margin:10px;font-size:25px;">
        用户管理
        <div style="font-size:14px;color:#888;">用户管理模块，用于对用户账号、基本信息、登录状态进行维护和管理</div>
      </Card>
       <Card style='margin:10px' :padding="15">
         
        <div class="flex-between" style="padding:10px;">
            <div class="flex-row project-tools ">
            <Input v-model="searchText" style="margin:0;width:300px" search placeholder="输入姓名/电话/用户名查询"/>

              <div class="flex-wrap project-tools" style="margin-left:10px;">
                 <Button icon="md-add" type='primary' @click="current={};showModal=true;">新增用户</Button>
            <div class="seperator" style="border:1px solid #ddd;height:25px;border-left:none;" />

            <Button icon="md-key"  @click="ResetPassword(selections)">重置密码</Button>
             <Button icon="md-lock" 
             @click="Lock(selections)">禁用</Button>
              <Button icon="md-unlock" 
             @click="UnLock(selections)">启用</Button>
            <Button icon="md-close" style="margin-right:0;"  @click="DeleteUsers(selections)">删除</Button>
            </div>
            </div>
          
        </div>
        <gzTable
                    :columns="user_table"
                    style="margin:10px;"
                    :data="filterData(users)"
                    :loading="loading"
                    multiple
                    :option="{stripe:true}"
                    :onEvent="onEvent"
                />

        <gzForm ref="form" v-model="showModal" :width="420" :title="current && current.id?'修改信息':'新增用户'" style="margin:10px" :form="user_form" :data="current"  editable  @on-submit="patchUser" @on-event='handleEvent' />
      </Card>
      
  </div>
</template>

<script>
import tableDef from './t_user'
import gzForm from '@refs/gzUI/form/modalForm'
import gzTable from '@refs/gzUI/tableframe/table'
import { mapActions, mapGetters } from 'vuex'
export default {
    
    data(){
        return {
            loading:false,
            showModal:false,
            current:{},
            selections:[],
            searchText:"",
            multiple:false
        }
    },
    mounted(){
        this.getData()
    },
    computed:{
        ...mapGetters("user",['users']),
        tableDef(){
            return tableDef
        },
        user_table() {
           return tableDef.cols
        },
        user_form(){
            return tableDef.form
        },
        selections(){
            return this.users.filter(v=>this.selections.includes(v.id))
        }
    },
    components:{
        gzForm,gzTable
    },
    methods:{
        getData(){
            this.loading = true
            this.$store.dispatch('user/queryUsers').then(res=>{
                this.loading = false
            }).finally(()=>{
                this.loading = false
            })
        },
        filterData(items){
            let searchText  =this.searchText
            return tableDef.filterData(items,{searchText})
        },
        onSelect(selection){
            this.selections = selection
            console.log("SELECTION:",selection.map(v=>v.name))
        },
        onEvent(e,item){
            var that = this
            if(e == 'open'){
                this.RouteTo('/users/'+item.user,true)
            }else if(e=='edit'){
                this.current = item
                this.showModal = true
            }else if(e=='delete'){
                this.Confirm(`确定删除用户<span style='margin:0 5px;color:red'>${item.name}</span>?`,()=>{
                    that.DeleteUser(item)
                })
            }else if(e=='reset'){
                let ids = [item.id]
                that.Confirm('确定要重置密码?',()=>{
                    that.ResetPassword(ids)
                })
            }else if(e=='lock'){
                 let users = [item]
                if(item.state == 0)
                    this.Lock(users)
                else
                    this.UnLock(users)
            }else if(e=='select'){
                this.onSelect(item)
            }
        },
        Lock(users){
            console.log("startLock:",users)
            if(!users || users.length == 0)
                this.Error('未选择用户')
            var that = this
            let ids = users.map(v=>v.id)
            that.$store
            .dispatch('user/lockUsers',ids)
            .then(res=>{
                that.Success('账户已禁用')
            }).catch(e=>{
                that.Error(e)
            })
        },
        UnLock(users){
             if(!users || users.length == 0)
                this.Error('未选择用户')
            var that = this
             let ids = users.map(v=>v.id)
            that.$store
            .dispatch('user/unlockUsers',ids)
            .then(res=>{
                that.Success('账户已启用')
            }).catch(e=>{
                that.Error(e)
            })
        },
        DeleteUser(user){
            this.dispatch('user/deleteUser',user.id)
            .then(res=>{
                this.Success('删除已完成')
            }).catch(e=>{
                this.Error(e)
            })
        },
        ResetPassword(ids){
            this.$store
            .dispatch('user/resetPassword',ids)
            .then(res=>{
                this.Success("密码已重置")
            })
            .catch(e=>{
                this.Error(e)
            })
        },
        
        DeleteUsers(users){
             if(!users || users.length == 0)
                this.Error('未选择用户')
            var that = this
                this.$Modal.confirm({
            title:"操作确认",
            content:`确定删除用户<span style='margin:0 5px;color:red'>${users.map(v=>v.name).join(',')}</span>等<span style='margin:0 5px;color:red'>${users.length}</span>位用户的信息?`,
            onOk(){
                that.$store.dispatch('user/deleteUsers',users.map(v=>v.id)).then(res=>{
                    that.$Notice.success({
                        title:"操作成功",
                        desc:"删除已完成"
                    })
                    that.selections = []
                }).catch(e=>{
                    that.$Modal.error({
                        title:'错误',
                        content:e
                    })
                })
            }
        })
        

          
            
        },
        patchUser(item){
            var that = this
            if(this.current.id){
                item.id = this.current.id
            }
            this.$store.dispatch('user/patchUser',item).then(res=>{
                that.Success(item.id?"修改成功":"新增用户成功")
                that.showModal = false
                that.current = undefined
            }).catch(e=>{
                if(typeof(e) == "string" && e.includes('{')){
                   e = JSON.parse(e)
                   if(e.key){
                    that.$refs.form.setError(e.key,e.error)
                    return
                   }
                }

                that.Error(e)
            })
        }
    }
}
</script>
