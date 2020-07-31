<style lang="less">
.l-list-item-card{
   width:200px;
   height:240px;
   border:1px solid #dfdfdf;
   margin:10px;padding:15px;
   box-shadow: none;
   filter:none !important;
   border:1px solid #dfdfdf !important;
   display: flex;
   align-items: center;
   flex-direction: column;
   border-radius: 10px !important;
   text-align: center;
   cursor: pointer;
   .name{
       font-size:20px;
       margin-top:10px;
       text-align: center;
   }

   i{
       border:2px solid #aaa;
       border-radius: 50%;
       padding:25px;
   }
}


.l-list-item-card:hover{
     background:rgb(216, 239, 253);
     
    transition: all 0.3s;
}

.l-list-item-card-selected{
    border:2px solid rgb(10, 190, 255) !important;
    transition: all 0.3s;
}

.l-list-item-user{
    width:160px;
    display: flex;
    padding:10px;
    background:#fff;
    cursor: pointer;
    border-radius: 5px;

    .info{
        padding:2px 0;
        font-size:16px;
        color:#333;
        line-height:18px;
    }
    
}

.l-list-item-user:hover{
     background:rgb(192, 232, 236);
    transition: all 0.3s;
}
</style>
<template>
  <div class="l-page dashboard" >
     <Card style="margin:10px;font-size:25px;">
        角色权限
        <div style="font-size:14px;color:#888;">配置角色、部门的权限，为用户分配角色</div>
      </Card>
       <Row :gutter="10" style="margin:5px;">
          <Col :span='24'>
          <Tabs type="card" :value="type_id" :animated="false" @on-click='type_id=$event' >
                <TabPane :label="`基本角色(${getRoles(11).length})`" :name="11" style="background:#fff;padding:10px;">
                    <Alert  show-icon closable>
        系统通用权限的角色划分，标识用户对于各模块的访问和操作权限
    </Alert>
                    <div class="l-list" style="margin:20px;margin-top:10px;">
                        <template v-for="r in getRoles(11)">
                        <div class="l-list-item-card" :class="{'l-list-item-card-selected':selected == r}" :key="r.id">
                            <Icon :type="r.icon" size='45' :color="r.color" />
                            <div class="name">{{r.name}}</div>
                            <div style="text-align:center"><a @click="Config(r)">配置</a> | <a @click="Edit(r)">修改</a><template v-if="r.id>1000"> | <a @click="Delete(r)">删除</a></template></div>
                            <div style="text-align:center;font-size:12px;color:#aaa">{{r.desc}}</div>
                        </div>
                        </template>
                         
                        <div class="l-list-item-card" style="border:3px dashed #dfdfdf !important;" @click="Add">
                            <Icon type="ios-add" size='80' color="#aaa" style="border:none" />
                             <div class="name" style='margin-top:0px;text-align:center;color:#aaa !important;'>添加角色</div> 
                        </div>
                         
                    </div>

                   

                </TabPane>
                <TabPane :label="`项目角色(${getRoles(12).length})`" :name="12"  style="background:#fff;padding:10px;">
                     <Alert   show-icon closable>
        项目权限划分，对应项目岗位角色分配
    </Alert>
                    <div class="l-list" style="margin:20px;margin-top:10px;">
                        <template v-for="r in getRoles(12)">
                        <div class="l-list-item-card" :key="r.id">
                            <Icon :type="r.icon" size='45' :color="r.color" />
                            <div class="name">{{r.name}}</div>
                            <div style="text-align:center"><a @click="Config(r)">配置</a> | <a @click="Edit(r)">修改</a><template v-if="r.id>1000"> | <a @click="Delete(r)">删除</a></template></div>
                            <div style="text-align:center;font-size:12px;color:#aaa">{{r.desc}}</div>
                        </div>
                        </template>
                         
                        <div class="l-list-item-card" style="border:3px dashed #dfdfdf !important;" @click="Add">
                            <Icon type="ios-add" size='80' color="#aaa" style="border:none" />
                             <div class="name" style='margin-top:0px;text-align:center;color:#aaa !important;'>添加角色</div> 
                        </div>
                         
                    </div>



                </TabPane>
                <TabPane :label="`部门角色(${getRoles(13).length})`" :name="13"  style="background:#fff;padding:10px;">
                     <Alert  show-icon closable>
        部门权限划分，对应部门岗位角色分配
    </Alert>
                    <div class="l-list" style="margin:20px;margin-top:10px;">
                        <template v-for="r in getRoles(13)">
                        <div class="l-list-item-card" :class="{'l-list-item-card-selected':selected == r}" :key="r.id">
                            <Icon :type="r.icon" size='45' :color="r.color" />
                            <div class="name">{{r.name}}</div>
                            <div style="text-align:center"><a @click="Config(r)">配置</a> | <a @click="Edit(r)">修改</a><template v-if="r.id>1000"> | <a @click="Delete(r)">删除</a></template></div>
                            <div style="text-align:center;font-size:12px;color:#aaa">{{r.desc}}</div>
                        </div>
                        </template>
                         
                        <div class="l-list-item-card" style="border:3px dashed #dfdfdf !important;" @click="Add">
                            <Icon type="ios-add" size='80' color="#aaa" style="border:none" />
                             <div class="name" style='margin-top:0px;text-align:center;color:#aaa !important;'>添加角色</div> 
                        </div>
                         
                    </div>

                </TabPane>
            </Tabs>
        
        
      
      </Col>
      
      </Row>
      

      <!-- modal -->
    
    <Modal v-model="showModalConfig" :title="`配置角色 / ${role.name}`" footer-hide>
        <div class="l-toolbox l-list">
                <div class="l-tool">
                    <Icon type="md-document" size="25" />
                    <div class="label">保存</div>
                    </div>
        </div>
        <div style="height:400px;padding:20px;">
            自由权限系统后续加入
        </div>    
    </Modal> 

     <Modal v-model="showModal" :title="!role.id?'新建角色':'编辑角色'"  footer-hide>
     <gzForm style="margin:10px;" editable ref="form" :form="roleForm" :data="role" @on-submit="Patch" />
     </Modal>
  </div>
</template>

<script>
import tableDef from './t_user'
import gzForm from '@refs/gzUI/form/index'
import gAvatar from '@refs/avatar/index'
import { mapActions, mapGetters } from 'vuex'
export default {
    
    data(){
        return {
            tabIndex:'basic',
            loading:false,
            showModal:false,
            showModalConfig:false,
            current:undefined,
            selected:null,

           
            role:{},
            type_id:11,

           selection:[],
        }
    },
    computed:{
        ...mapGetters("user",['users','getRoles']),
        tableDef(){
            return tableDef
        },
        roles(){
            return this.getRoles(this.type_id)
        },
        user_table() {
           return tableDef.cols
        },
        user_form(){
            return tableDef.form
        },
        roleForm(){
           return {
              layout:`<div><Row  :gutter="10"><Col :span="4">{{icon}}</Col><Col :span="14">{{name}}</Col><Col :span="6">{{color}}</Col></Row><Row style='margin-top:10px' :gutter="10"><Col :span="24">{{desc}}</Col></Row></div>`,
            //   option:{
            //       hideAction:true
            //   },
              def:{
                icon:{
                  label:"图标",
                  control:"select",
                  option:{
                    options:['logo-twitter','md-star','ios-person'],
                    type:'icon',
                    text:true,
                    defaultValue:'ios-person',
                    required:true
                  }
                },
                name:{
                  label:"名称",
                  control:"input",
                  option:{
                    maxlen:16,
                    required:true
                  }
                },
                color:{
                  label:"颜色",
                  control:"color",
                  option:{
                      required:true,
                    defaultValue:"#333333"
                  }
                },
                desc:{
                  label:"描述",
                  control:"input",
                  option:{
                     type:"textarea"
                  }
                }
              }
            }
         }
    },
    components:{
        gzForm,gAvatar
    },
    methods:{
        Add(){
            this.role = {}
            this.showModal = true
        },
        Edit(r){
            this.role = r
            this.showModal = true
        },
        Config(r){
            this.role = r
            this.showModalConfig = true
        },
        Patch(e){
            if(!e.id)
                e.type_id = this.type_id
            console.log("PATCH:",e)
            this.$store.dispatch('user/patchRole',e).then(role=>{
                this.Success(e.id?'修改成功':'添加完成')
                this.showModal = false
                this.role = {}
            }).catch(e=>{
                this.Error(e)
            })
        },
        Select(item){
            if(item != this.selected)
                this.selected = item
            else
                this.selected = null
        },
        Delete(item){
            var that = this
            this.Confirm(`确定删除角色<span style='margin:0 3px;color:red;'>${item.name}</span>?`,()=>{
                 that.$store.dispatch('user/delRole',item.id).then(e=>{
                that.Success('删除成功')
            }).catch(e=>{
                that.Error(e)
            })
            })
        }
    }
}
</script>
<style lang="less" scoped>
.l-toolbox{
    border-bottom:1px solid #dfdfdf;
    padding:10px;
    .l-tool{
        text-align: center;
        padding:0 10px;
        margin:0 10px;
        font-size:12px;
        cursor: pointer;
        .label{
            margin-top:3px;
        }
    }
    .l-tool:hover{
        color:rgb(41, 191, 255);
    }
}
.l-status{
    padding:5px;
    font-size:12px;
    color:#aaa;
    border-top:1px solid #dfdfdf;
}
</style>