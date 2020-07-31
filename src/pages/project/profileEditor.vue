<template>
  <div style="background:#dfdfdf;">
      <Row :gutter="10" style="margin:10px;">
          <Col :span='24'>
      <Card style="background:#fff;">
          <div slot='title'>
         <h1>项目配置</h1>
         <sub>在此页面维护项目的基本信息</sub>
         </div>
         <gzForm style="margin-top:10px;" :form="form" editable :data="project" @on-submit="onSubmit"/>
      </Card>
      </Col>
     
      </Row>
      
  </div>
</template>

<script>
import gzForm from '@refs/gzUI/form/index'
import {mapGetters, mapActions} from 'vuex'
export default {
    data(){
        return {
            form:{
                title:'项目基本情况',
                layout:"<div><Row :gutter='10'><Col :span='4'>{{code}}</Col><Col :span='20'>{{name}}</Col></Row><Row :gutter='10' style='margin-top:10px'><Col :span='6'>{{buildtype}}</Col><Col :span='6'>{{managetype}}</Col><Col :span='6'>{{position}}</Col><Col :span='6'></Col></Row><Row :gutter='10' style='margin-top:10px'><Col :span='6'>{{constructionSide}}</Col><Col :span='6'>{{investionSide}}</Col><Col :span='6'>{{supervisorSide}}</Col><Col :span='6'></Col></Row><Row :gutter='10' style='margin-top:10px'><Col :span='24' style='height:200px' >{{desc}}</Col></Row><Row style='margin-top:10px'><Col>{{images}}</Row></Col></Row></div>",
                def:{
                    code:{
                        label:"项目编号",
                        control:'input',
                        editable:false
                    },
                    name:{
                        label:"项目名称",
                        control:'input'
                    },
                    buildtype:{
                         label:"建筑类型",
                        control:'input'
                    },
                    managetype:{
                        label:"管理类型",
                        control:'input'
                    },position:{
                        label:"项目地点",
                        control:'input'
                    },
                    desc:{
                        label:"项目简介",
                        control:"input",
                        option:{
                            type:"textarea"
                        }
                    },
                    constructionSide:{
                        label:"建设单位",
                        control:"input"
                    },
                    investionSide:{
                        label:"投资单位",
                        control:"input"
                    },
                    supervisorSide:{
                        label:"监理单位",
                        control:"input"
                    },
                    images:{
                        label:"效果图",
                        control:"files",
                        option:{
                            maxlen:5,
                            type:'image',
                            multiple:true
                        }
                    }

                },
                option:{
                    editable:true
                }
            },
        }
    },
    components:{
        gzForm
    },
    computed:{
        ...mapGetters('project',['get']),
        id(){
            return this.$route.params.id
        },
        project(){
            return this.get(this.id) || {}
        }
    },
    methods:{
        ...mapActions('project',{
            patchProject:"patch"
        }),
        onSubmit(e){
            var that = this
            this.$Modal.confirm({
                title:"提交确认",
                content:"确定要更新项目信息?",
                onOk(){
                    e.id = that.id
                    e._action = 'basic'
                    that.patchProject(e).then(res=>{
                        that.$Notice.success({
                            title:"修改成功"
                        })
                    }).catch(e=>{
                        that.$nextTick(x=>{
                             that.$Modal.error({
                                title:"提交失败",
                                content:e
                            })
                        })
                       
                    })
                }
            })
        }
    }
}
</script>

<style>

</style>