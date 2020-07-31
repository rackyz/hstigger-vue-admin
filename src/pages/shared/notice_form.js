export default {
    title: '新增通知',
    layout: `<div>
                 <Row :gutter='10'>
                <Col :span='24'>{{title}}</Col></Row>
                <Row :gutter='5'>
                <Col :span='8' style='margin-top:5px'>{{importance_type}}</Col><Col :span='8' style='margin-top:5px'>{{visibility_type}}</Col><Col :span='8' style='margin-top:5px'>{{file_type}}</Col></Row>
                <Row style="margin-top:5px"><Col :span='24'>{{region}}</Col></Row>
                 <Row :gutter='5' style='margin-top:5px'>
                <Col :span='24'>{{content}}</Col></Row>
                <Row :gutter='5' style='margin-top:5px'>
                <Col :span='12'>{{files}}</Col><Col :span='12'>{{images}}</Col></Row></div>`,
    def: {
        title: {
            label: "标题",
            control: "input",
            option: {
                maxlen:128,
                required:true
            }
        },
        author:{
            label:"作者",
            control:"input",
            option:{
                maxlen:16,
                required:true
            }
        },
        
        importance_type:{
            label:"优先级",
            control:"select",
            option:{
                getters:'type/getTypes',
                key: 'Importance',
                required: true,
                defaultTo:81
            }
        },
        file_type:{
            label:"文稿格式",
            control:"select",
            option:{
                getters: 'type/getTypes',
                key: 'ArticleFileType',
                require:true,
                defaultTo:71
            }
        },
        visibility_type: {
               label: "通知范围",
                   control: "select",
                   option: {
                       getters: 'type/getTypes',
                       key: 'Visibility',
                       require: true,
                       defaultTo: 92
                   }
        },
        region:{
            label:"可见人员",
            control:"select",
            option:{
                getters:'user/users'
            }
        },
        content: {
            label: "正文",
            control: 'input',
            option: {
                type:"textarea",
                required:true,
                height:200
            }
        },
        images:{
            label: "图片",
            control:"files"
        },
        files: {
            label: "附件",
            control: "files",
                option: {
                    list: true
                }
        }
    }
}