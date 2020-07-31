module.exports = {
    key: "bugreports",
    restful: {
        key: "orders",
        stype: "bugreport"
    },
    name: "BUG反馈",
    desc: "您在测试中发现的任何问题请在此页面反馈给开发者",
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
    },{
        key: 'type_id',
        title: '类型',
        type: 'type',
        width:100,
        option:{
            base:20000
        }
        
    },  {
        key: 'name',
        title: '标题',
        type: 'link',
            event: 'open',
            option: {
                linkTo: "orders"
            },
            minWidth:100,
            maxwidth: 200
    }, {
        key: 'state',
        title: '状态',
        type: 'state',
        width: 80,
        option: {
            states: ["待处理", "处理中", "搁置","已完成","已关闭"]
        }
    }, {
        key: 'inputor',
        title: '创建人',
        type: 'user',
        width: 100
    }, {
        key: 'inputTime',
        title: '创建时间',
         type: 'time',
             width: 100,
             option: {
                 type: "smart"
             }
    }, {
        key: 'editor',
        title: '回复人',
        type: 'user',
        width: 100
    },
    {
        key: 'updateTime',
        title: '回复时间',
        type: 'time',
        width:100,
            option: {
                type: "smart"
            }
    }, {
        type: 'tool',
        title: '操作',
        buttons: ["edit", "delete"],
        minWidth: 100
    }],
    pageSize: 100,
    auth: (key, item, userinfo) => {
        console.log("def-auth:", key, item, userinfo)
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
                option: {}
            },
            type_id: {
                label: "类型",
                editable: true,
                control: "select",
                option: {
                    options:['页面崩溃','功能及逻辑性错误','界面及文字性错误','其他'],
                    text: true
                }
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
        <Col span='6'>{{type_id}}</Col><Col span='18'>{{name}}</Col>
        </Row>
        <Row :gutter='10' style='margin-top:10px;'>
        <Col style='height:400px;margin-top:10px;'>{{content}}</Col>
        </Row></div>`,

        option: {}
    }
}