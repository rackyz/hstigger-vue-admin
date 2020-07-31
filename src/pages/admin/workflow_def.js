


const BX001 = {
    workflow:{
        code: "W001",
        type: "综合",
        name: "事业部标准报销流程",
        desc: "事业部员工的报销需要由事业部经理审核(同时抄送综合部)，审核通过后由总公司审核后交于财务室处理",
    },
    forms: [{
        id: "V001",
        type: "render",
        name: "报销申请单",
        layout: "<div class='a-form'><Row class='a-title'>事业部标准报销申请表</Row><Row :gutter='10' style='margin-top:10px'><Col :span='6'>{{date}}</Col><Col :span='8'>{{type}}</Col><Col :span='10'>{{amount}}</Col></Row><Row style='margin-top:10px'><Col>{{inputor}}</Col></Row><Row style='margin-top:10px;'><Col style='height:150px'>{{desc}}</Col></Row><Row style='margin-top:10px'><Col style='height:150px'>{{bills}}</Col></Row><Row style='margin-top:10px'><Col style='height:150px'>{{files}}</Col></Row><Row style='margin-top:10px'><Col :span='8'>{{checkor}}</Col></Row><Row style='margin-top:10px'><Col :span='8'>{{cc}}</Col></Row></div>",
        data: ['inputor', 'desc', 'type', 'files', 'date', 'amount', 'bills', 'checkor', 'cc'],
        node: "N001"
    }],
    nodes: [{
        id: "N001",
        type: "create",
        name: "填写报销申请",
        label: "填写报销申请",
        view: "V001",
    }, {
        id: "N002-1",
        type: "authorise",
        name: "综合部",
        name: "综合部"
    }, {
        id: "N002-2",
        type: "authorise",
        name: "事业部",
        label: "事业部"
    }, {
        id: "N003",
        type: "authorise",
        name: "总公司审核",
        label: "总公司审核",
        data: ['note2']
    }, {
        id: "N004",
        type: "authorise",
        name: "财务部复核",
        label: "财务部复核"
    }, {
        id: "N005",
        type: "end",
        name: "结束",
        api: "tasks"
    }],
    actions: [{
        type: "submit",
        name: "抄送",
        from: "N002-2",
        to: "N002-1"
    }, {
        type: "submit",
        name: "提交部门审核",
        from: "N001",
        to: "N002-2"
    }, {
        type: "reject",
        name: "审核不通过",
        from: "N002-2",
        to: "N001"
    }, {
        type: "approve",
        name: "发送总公司审核",
        from: "N002-2",
        to: "N003",
        condition: [(data) => data.day <= 3],
        data: ['note1']
    }, {
        type: "reject",
        name: "审核不通过",
        from: "N003",
        to: "N001"
    }, {
        type: "reject",
        name: "审核不通过",
        from: "N004",
        to: "N001"
    }, {
        type: "approve",
        name: "审核通过",
        from: "N003",
        to: "N004",
        condition: [(data) => data.day > 3],
        data: ['note1']
    }, {
        type: "approve",
        name: "审核通过",
        from: "N004",
        to: "N005",
        condition: [(data) => data.day > 3],
        data: ['note1']
    }],

    data: {
        inputor: {
            label: "申请人",
            control: "select",
            option: {
                multiple: true,
                getters: "kernel/userAsOptions"
            }
        },
        inputorDep: {
            label: "所在部门",
            control: "input"
        },
        type: {
            label: "申请类型",
            control: "select",
            option: {
                options: ["差旅费", "办公费", "购买商品及服务费用"]
            }
        },
        date: {
            label: "申请日期",
            control: "time"
        },
        bills: {
            label: '发票信息',
            control: "files",
            option: {
                type: "image",
                size: "big"
            }
        },
        files: {
            label: '附件',
            control: "files"
        },
        amount: {
            label: "报销金额",
            control: "input",
            option: {
                type: "amount",
                required: "true"
            }
        },
        desc: {
            label: "申请说明",
            control: "input",
            option: {
                type: "textarea",
                maxlen: "128",
                rows: 4
            }
        },
        accquiredTime: {
            control: "time"
        },
        checkor: {
            label: "审核部门",
            control: "select",
            option: {
                getters: "kernel/deps",
                relKey: "inputor",
                relativeGetter: "kernel/getDepsCharger",
                relMode: "replace"
            }
        },
        cc: {
            label: "抄送部门",
            control: "select",
            option: {
                getters: "kernel/deps",
                defaultValue: "dep0000000000KT1"
            }
        }

    }
}

const list = [BX001]



export default {list}
