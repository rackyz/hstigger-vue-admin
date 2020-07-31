module.exports = {
    key: "files",
    name: "文件",
    desc: "用户文件管理",
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
        width: 80
    }, {
        key: 'vdisk',
        title: '目录',
        type: 'type',
        width:100
    }, {
        key: 'name',
        title: '文件名',
        linkTo: "formTesters",
        type: 'link',
        width: 200
    },{
        key: 'ext',
        title: '类型',
        type: 'filetype',
        width:100
    }, {
        key: 'size',
        title: '大小',
        type: 'filesize',
        width:100
    }, {
        key: 'ref',
        title: '引用',
        type:"number",
        width: 100
    }, {
        key: 'inputor',
        title: '上传人',
        type: 'user',
        width: 100
    },{
        key:"inputTime",
        title:"上传时间",
        type:"time",
        width:150
    }, {
        type: 'tool',
        title: '操作',
        buttons: [{
            label: "下载",
            event: 'download'
        }, "edit", "delete"],
    
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
            vdisk:{
                label:"目录",
                editable:true,
                control:"input"
            },
            name: {
                label: "名称",
                editable: true,
                control: "input",
                option: {}
            },
           
            url: {
                label: "文件",
                editable: true,
                control: "files",
                option: {
                    multiple:false
                }
            }
        },
        layout: "<div><Row :gutter='10'><Col span='6'>{{vdisk}}</Col><Col span='18'>{{name}}</Col></Row><Row :gutter='10' style='margin-top:10px;'><Col style='height:100px'>{{url}}</Col></Row></div>",

        option: {}
    }
}