// Module : Kernel
// Desc   : kernel services for system

import axiosServer from '../libs/axios';
const state = {
    workflows:{},
    instances:{}
}

const getters = {
    // workflow_id=>流程对象
    getWorkflow:state=>id=>{
        if(id == 'order'){
            return {
                nodes:[{
                    id:'upload',
                    name:'上传',
                    desc:"上传该项工作结果相关材料",
                    charger: '胡佳翰',
                    chargerDesc:'负责人',
                    layout:`<div>
                            <Row :gutter='10' style='margin-top:10px'>
                            <Col :span='12'>{{date}}</Col>
                            </Row>
                            <Row :gutter='10' style='margin-top:10px'>
                            <Col :span='24'>{{content}}</Col>
                            </Row>
                            <Row :gutter='10' style='margin-top:10px'>
                            <Col :span='24' style='height:200px' >{{files}}</Col></Row></div>`

                }],
                actions: [{
                            from: 'start',
                            to: 'upload',
                            name: '配置'
                        },{
                    from:'upload',
                    to:'end',
                    name:'上传'
                }],
                datadef:{
                    // configuration
                    enableSMS:{
                        label:"短信通知",
                        type:'bool'
                    },
                    ["upload/charger"]:{
                        label:"负责人",
                        type:"user"
                    },
                    ["upload/noticer"]: {
                        label: "抄送人",
                        type: "user",
                        option:{
                            multiple:true
                        }
                    },
                    // form
                     date: {
                        label: "完成日期",
                        control: "time",
                        option: {
                            type: 'date',
                            defaultValue: moment().format()
                        }
                    },
                    content: {
                        label: "情况说明",
                        control: 'input',
                        option: {
                            type: "textarea",
                            height: 100,
                            defaultValue: "本工作已按期完成"
                        }
                    },
                    files: {
                        label: "附件",
                        control: "files",
                        option: {
                            required: true,
                            list: true
                        }
                    }
                    
                }
                
            }
        }
    },
    // 获取活动节点
    getActiveNodes:state=>thread_id=>{
        return {
            database: {},
            records: [],
            current: {},
            node: {},
        }
    }
}

const actions = {
    getInstance:({commit},id)=>{
        return new Promise((resolve,reject)=>{
            axiosServer.get(`instances/${id}`).then(res=>{
                let item = res.data.data
                commit("saveInstance",item)
                resolve(item)
            }).catch(e=>{
                reject(e)
            })
        })
    },
    get: ({
        commit
    }, id) => {
        return new Promise((resolve, reject) => {
            axiosServer.get(`workflows/${id}`).then(res => {
                let item = res.data.data
                commit("save", item)
                resolve(item)
            }).catch(e => {
                reject(e)
            })
        })
    },
    patch:({
        commit
    },object)=>{
        return new Promise((resolve, reject) => {
            axiosServer.patch(`workflows/${id}`, object).then(res => {
                let item = res.data.data
                commit("patch", object)
                resolve(item)
            }).catch(e => {
                reject(e)
            })
        })
    }
}

const mutations = {
    patch(state, item) {
    }

}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}