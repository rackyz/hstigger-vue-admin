module.exports = {
    key: "forms",
    name: "表单",
    desc: "可自定义的系统内置表单工具，用于信息交互、工作流程",
    searcher: {
        containsIn: ['name']
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
        title: '表单类型',
        type: 'type',
        width: 200
    }, {
        key: 'name',
        title: '表单名称',
        linkTo:"formTesters",
        type: 'link',
        width: 200
    }, {
        key: 'desc',
        title: '描述',
        type: 'text',
        minWidth: 100,
        tooltip: true,
        maxWidth: 300
    }, {
        type: 'tool',
        title: '操作',
        buttons: [{
            label: "调试",
            event: 'open'
        }, "edit", "delete"],
        option:{
            linkTo:'forms'
        },
        minWidth: 100
    }],
    eventHandler: ((e, item, vue) => {
                if (e == 'debug') {
                    let routerUrl = vue.$router.resolve({
                        path: `/forms/${item.id}`
                    });
                    window.open(routerUrl.href, "_blank");
                    return true
                }
            }),
    pageSize: 100,
    form: {
        def: {
            name: {
                label: "名称",
                editable: true,
                control: "input",
                option: {}
            },
            type:{
                label:"类型",
                editable:true,
                control:"select",
                option:{
                    options:["通用","系统"],
                    type:"text",
                    defaultValue:"通用"
                }
            },
            desc: {
                label: "描述",
                editable: true,
                control: "input",
                option: {
                    type: 'textarea'
                }
            },
            def: {
                label: "字段列",
                editable: true,
                control: "input",
                option: {
                    type: 'textarea'
                }
            },
            layout: {
                label: "布局",
                editable: true,
                control: "input",
                option: {
                    type: 'textarea'
                }
            },
            option: {
                label: "参数",
                editable: true,
                control: "input",
                option: {
                    type: 'textarea'
                }
            }
        },
        layout: "<div><Row :gutter='10'><Col span='6'>{{type}}</Col><Col span='18'>{{name}}</Col></Row><Row :gutter='10' style='margin-top:10px;'><Col style='height:100px'>{{desc}}</Col><Col style='height:200px;margin-top:10px;'>{{layout}}</Col><Col style='height:200px;margin-top:10px;'>{{def}}</Col><Col style='height:200px;margin-top:10px;'>{{option}}</Col></Row></div>",

        option: {}
    }
}