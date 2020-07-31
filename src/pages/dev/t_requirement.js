module.exports = {
    key: "requirements",
    restful: {
        key: "orders",
        stype: "requirement"
    },
    name: "需求联系单",
    desc: "您可以在此页面创建本项目关于需求沟通的工单",
    // sortby:{
    //     key:"updateTime",
    //     type:"time",
    //     order:"desc"
    // },
    searcher: {
        containsIn: ['name']
    },
    filter: {
        selectors:['type','state']
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
        key: 'type_id',
        title: '需求类型',
        type: 'type',
        width: 120,
        option: {
            align: "center"
        }
    },  {
        key: 'name',
        title: '需求名称',
        type: 'link',
        event: 'open',
        option:{
            linkTo:"orders"
        },
        maxwidth: 200
    },{
        key: 'inputor',
        title: '创建者',
        type: 'user',
        maxwidth: 200
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
        key: 'updateTime',
        title: '更新时间',
        type: 'time',
        option:{
            type:"smart"
        }
    },{
        key: 'editor',
        title: '编辑者',
        type: 'text',
        maxwidth: 200
    }, {
        type: 'tool',
        title: '操作',
        buttons: ["edit", "delete"],
        minWidth: 100
    }],
    pageSize: 100,
    auth:(key,item,userinfo)=>{
        console.log("def-auth:",key,item,userinfo )
        if(!userinfo)
            return false
        if(userinfo.role == "admin" || userinfo.role == "dev"){
            return true      
        }else{
            if(item.inputor === userinfo.gy_id){
                return true
            }else{
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
                    options:['开发需求','功能性需求','适用性需求','界面及其他'],
                    text:true
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