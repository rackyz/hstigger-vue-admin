import localWorkflow from './workflow_def'

const restful = {key:"workflows"}

export default {
    key: "workflow",
    idkey: "id",
    restful,
    name: "流程模板管理",
    desc: "预定义的流程模板管理",
    localItems: localWorkflow.list,
    searcher: {
        containsIn: ['name', 'code']
    },
    filter: {},
    tools: {
        button: ['add']
    },
    
    cols: [{
            key: 'id',
            title: '序号',
            type: 'index',
            width: 60
        }, {
            key: 'type',
            title: '类型',
            type: 'type',
            width: 150,
            option: {
                base: 20000
            }

        }, {
            key: 'name',
            title: '名称',
            type: 'link',
            width: 150,
            option: {
                align: "center"
            }
        }, {
            key: 'instanceCount',
            title: '实例数',
            type: 'text',
            width: 150,
            option:{
                align: "center",
                defaultValue: "0"
            }
        },{
            key:"local",
            title:"本地",
            type:"bool",
            width:80
        },{
            key: 'updator',
            title: '上传者',
            type: 'user',
            width: 150
        }, {
            key: 'updateTime',
            title: '上传时间',
            type: 'time',
            width: 150
        },
        {
            type: 'tool',
            title: '操作',
            buttons: [{name:"安装/更新",event:'install'}],
            minWidth: 100
        }
    ],
    eventHandler:((e,item,vue)=>{
        if(e == 'install'){
            vue.$Modal.confirm({
                title:"操作确认",
                content:"安装本地模板会在服务器端创建一个新的模板(不会覆盖以往模板),是否继续?",
                onOk:()=>{
                    console.log("[WORKFLOW]:",item)
                    vue.$store.dispatch("tables/saveItem", {
                            key: 'workflow',
                            item,
                            restful
                        }).then(res => {
                            setTimeout(() => {
                                    vue.$Modal.success({
                                        title: "创建成功"
                                    })
                            }, 1000);
                            
                        }).catch(e=>{
                             setTimeout(() => {
                                vue.$Modal.error({
                                    title: "创建失败",
                                    content: "<span style='font-weight:bold;margin-right:10px;padidng:5px;color:red;'>消息</span>" + e
                                })
                             }, 1000);
                            
                        })
                }
            })
        }else if(e=="preview"){
            // open a local test for workflow
             
        }

        return true
    }),
    pageSize: 100,
    form: {
        def: {
            type: {
                label: "类型",
                editable: true,
                control: "select",
                option: {
                    options: ['企业管理', '人事管理', '项目管理']
                }
            },
            name: {
                label: "名称",
                editable: true,
                control: "input",
                option: {}
            },
            desc: {
                label: "描述",
                editable: true,
                control: "input",
                option: {
                   type:"textarea",
                   height:200
                }
            }
        },
        layout: `<div>
        <Row :gutter='10'>
        <Col span='8'>{{type}}</Col><Col span='16'>{{name}}</Col>
        </Row>
        <Row :gutter='10' style='margin-top:10px;'><Col span='24'>{{desc}}</Col>
        </Row></div>`,

        option: {}
    }
}