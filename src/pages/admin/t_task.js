export default {
    key: "orders",
    name: "任务",
    desc: "指派任务给负责人，并可追踪任务的进度情况",
    searcher: {
        containsIn: ['name']
    },
    filter: {
        selectors: ['type', 'state']
    },
    tools: {
        button: ['add']
    },
    cols: [{
            key: 'id',
            title: '序号',
            type: 'index',
            width: 60
        },{
            key:"stype",
            title:"任务类型",
            type:"type",
            option:{
                align:"center"
            }
        }, {
            key: 'type_id',
            title: '详细分类',
            type: 'type',
            width: 120,
            option: {
                align: "center"
            }
        }, {
            key: 'name',
            title: '任务名称',
            type: 'link',
            event: 'open',
            option: {
                linkTo: "orders"
            },
            maxwidth: 200
        }, {
            key: 'inputor',
            title: '发起人',
            type: 'user',
            maxwidth: 200
        }, {
            key: 'charger',
            title: '负责人',
            type: 'user',
            maxwidth: 200
        }, {
            key: 'endTime',
            title: '截止日期',
            type: 'date',
            width: 120
        }, {
            key: 'timestate',
            title: '时间状态',
            type: 'state',
            width: 80,
            option: {
                states: ["正常", "已超期"]
            }
        }, {
            key: 'state',
            title: '状态',
            type: 'state',
            width: 80,
            option: {
                states: ["待处理", "处理中", "搁置", "已完成", "已关闭"]
            }
        },
        {
            key: 'replyTime',
            title: '最新回复',
            type: 'time',
            option: {
                type: "smart"
            }
        }, {
            key: 'replier',
            title: '回复人',
            type: 'text',
            maxwidth: 200
        }, {
            type: 'tool',
            title: '操作',
            buttons: ["edit", "delete"],
            minWidth: 100
        }
    ],
    pageSize: 100,
    auth: (key, item, userinfo) => {
        if (!userinfo)
            return false
        if (userinfo.role == "admin" || userinfo.role == "dev") {
            return true
        } else {
            if (item.inputor === userinfo.gy_id) {
                return true
            } else {
                return false
            }
        }
    },
    form: {
        def: {
            name: {
                label: "标题",
                editable: true,
                control: "input",
                
                option: {
                    required: true
                }
            },
            stype: {
                label: "任务类型",
                editable: true,
                control: "select",
                option: {
                    getters: "kernel/taskTypes",
                    text: true,
                    required: true
                }
            },
            type_id: {
                label: "子类型",
                editable: true,
                control: "select",
                option: {
                     getters: 'kernel/taskTypes',
                     relMode:"replace",
                    relKey:"stype",
                    relativeGetter: "kernel/getTaskSubTypes",
                    text: true,
                    required: true
                }
            },
            charger:{
                label:"负责人",
                editable:true,
                control:"select",
                option:{
                    getters:'kernel/users',
                    idKey: "id",
                    labelKey:"name",
                    required: true
                }
            },
            startDate:{
                label:'开始日期',
                editable:true,
                control:'time'
            },
            endDate: {
                label: '结束日期',
                editable: true,
                control: 'time'
            },
            content: {
                label: "内容",
                editable: true,
                control: "input",
                option: {
                    type: 'md',
                    maxlen: 128
                }
            },


        },
        layout: `<div>
        <Row :gutter='10'>
        <Col span='24'>{{name}}</Col>
        </Row><Row :gutter='10'  style='margin-top:10px;'>
        <Col span='8'>{{stype}}</Col><Col span='8'>{{type_id}}</Col><Col span='8'>{{charger}}</Col>
        </Row>
        <Row :gutter='10' style='margin-top:10px;'>
        <Col span='12'>{{startDate}}</Col><Col span='12'>{{endDate}}</Col>
        </Row>
        <Row :gutter='10' style='margin-top:10px;'>
        <Col style='height:400px;'>{{content}}</Col>
        </Row></div>`,

        option: {}
    }
}