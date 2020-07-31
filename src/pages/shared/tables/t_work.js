export default [{
        key: "id",
        title: "序号",
        align: "center",
        type: "index",
        width: 60
    },
    {
        key: "type_id",
        title: "工作类别",
        type: "type",
        width: 80,
        option: {
            align: "center",
            getters: "kernel/types",
            getters_key: 'task_type'
        },
    }, {
        key: "title",
        title: "工作内容",
        type: 'link',
        
        minWidth:100,
        align: "center",
        event: "process"
    }, {
        key: "charger",
        title: "负责人",
        type: 'user',
        width: 100,
        option: {

            align: "center"
        },
        event: "open"
    }, {
        key: "startTime",
        title: "计划开始",
        type: 'time',
        width: 120,
        align: "center",
        option: {
            type: 'date'
        }
    }, {
        key: "deadline",
        title: "计划完成",
        type: 'time',
        width: 120,
        align: "center",
        option: {
            type: 'date'
        }
    }, {
        key: "endTime",
        title: "实际完成",
        type: 'time',
        width: 120,
        align: "center",
        option: {
            type: 'date'
        }
    }, {
        key: "state",
        title: "状态",
        type: "state",
        align: "center",
        width: 120,
        option: {
            states: ['未开始', '进行中', '已超期','按期完成','超期完成'],
            colors:['#aaa','orange','red','green','darkgreen']
        }
    }, {
        key: "stype",
        title: "任务类型",
        type: "type",
        width: 140,
        align: "center",
        option: {
            getters: 'kernel/worktypes'
        }
    }, {
        key: "tools",
        title: "操作",
        fixed:"right",
        type: "tool",
        width: 200,
        align: "center",
        buttons: [{
                    label: "处理",
                    event: 'process'
                },{
            label: "编辑",
            event: 'edit'
        },{
            label:"删除",
            event:'delete'
        }]
    }
]