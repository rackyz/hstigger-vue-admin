export default {
    key: "user",
    idkey:"gy_id",
    restful: {
        key: "users"
    },
    name: "用户管理",
    desc: "用户管理及权限等操作",
    searcher: {
        containsIn: ['gy_user','gy_name','gy_phone']
    },
    filter: {},
    tools: {
        button: ['add']
    },
    beforeUpdate:(item)=>{
        if (item.groups)
            item.groups = JSON.stringify(item.groups)
        if (item.role)
            item.role = JSON.stringify(item.role)
    },
    
    cols: [{
            key: 'id',
            title: '序号',
            type: 'index',
            width: 60
        },  {
            key: 'user',
            title: '用户名',
            type: 'link',
            width: 100,
            event: 'open',
            option:{
                align:"center",
                event:'open'
            }
        }, {
            key: 'id',
            title: '姓名',
            type: 'user',
            width: 150,
            option: {
                getters:"user/users",
                align: "center"
            }
        }, {
            key: 'phone',
            title: '手机号',
            type: 'text',
            width: 150,
             option: {
                 align: "center"
             }
        }, {
            key: 'deps',
            title: '部门',
            type: 'type',
            width:250,
            option:{
                getters:"user/deps",
                multiple:true
            }
        }, {
            key: 'roles',
            title: '角色',
            type: 'type',
            width:120,
            option: {
                 getters: "user/roles",
                multiple: true
            }

        }, {
            key: 'lastlogin_at',
            title: '最近登录',
            type: 'time',
            width: 150,
            option: {
                type: "smart"
            }
        }, {
            key: "state",
            title: "账号状态",
            type: "bool",
            width: 100,
            option:{
                texts:["已启用","已禁用"],
                colors:["green","red"]
            }
        },
        {
            key: "passweak",
            title: "密码状态",
            type: "bool",
            width: 100,
            option: {
                texts: ["更改", "初始"],
                colors: ["green", "red"]
            }
        },
         {
             key: "created_at",
             title: "创建日期",
             type: "time",
             width: 100,
             option: {
                type:'date'
             }
         }, {
             key: "created_by",
             title: "创建人",
             type: "user",
             width: 100,
             option: {
                 getters:"user/users"
             }
         }, {
             key: "tools",
             title: "操作",
             type: "tool",
             buttons: ['edit', 'delete', {
                         label: '详情',
                         event: 'open'
                     }, {
                label:'禁用/启用',
                event:'lock'
             },{
                 label:'重置密码',
                 event:'reset'
             }],
             option: {
                type:"text"
             }
         },
    ],
    pageSize: 100,
    form: {
        def: {
            user:{
                label:"登录名",
                editable:true,
                control:"input",
                option:{
                    required:true,
                    rules: [{
                        type: 'name'
                    }, {
                        remote: 'user/isNameExist',
                        msg: '该名称已存在,请更换'
                    }]
                }
            },
            name: {
                label: "姓名",
                editable: true,
                control: "input",
                option: {
                    required: true
                }
            },
            roles: {
                label: "角色",
                control: "select",
                option: {
                    getters:'user/roles',
                    multiple:true
                }
            },
            avatar: {
                label: "头像",
                editable: true,
                control: "image"
            },
            deps:{
                label: "部门",
                control: "select",
                option:{
                   getters: 'user/deps',
                    multiple: true
                }
            },
            phone:{
                label:"电话",
                control:"input"
            }


        },
        layout: `<div>
        <Row :gutter='10'>
        <Col span='10'>{{user}}</Col><Col span='10'>{{name}}</Col><Col span='4'>{{avatar}}</Col>
        </Row>
        <Row :gutter='10' style='margin-top:10px;'><Col span='12'>{{phone}}</Col>
        </Row><Row :gutter='10' style='margin-top:10px;'><Col span='24'>{{deps}}</Col>
        </Row><Row :gutter='10' style='margin-top:10px;'><Col span='24'>{{roles}}</Col>
        </Row></div>`,
        

        option: {}
    },
    filterData: (items,{
            searchText = ""
        }) => {
        return items.filter(v=>{
             let st = searchText.trim()
             let {name,phone,user} = v
             if (st)
                 if ((name && name.includes(st)) || (phone && phone.includes(st)) || (user && user.includes(st)))
                     return true
                else
                    return false
             return true
        })
       
    },
    editor: {
        width: 430
    },
}