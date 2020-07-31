export default {
    layout: `<div>
        <Row :gutter='10'>
        <Col span='24'>{{title}}</Col>
        </Row><Row :gutter='10'  style='margin-top:10px;'>
        <Col span='8'>{{stype}}</Col><Col span='8'>{{type_id}}</Col><Col span='8'>{{duration}}</Col>
        </Row>
        <Row :gutter='10' style='margin-top:10px;'>
        <Col>{{content}}</Col>
        </Row> <Row :gutter='10' style='margin-top:10px;'>
        <Col>{{files}}</Col>
        </Row></div>`,

    def: {
        title: {
            label: "标题",
            editable: true,
            control: "input",

            option: {
                required: true
            }
        },
        stype: {
            label: "工作类型",
            editable: true,
            control: "select",
            option: {
                getters: 'kernel/worktypes',
                required: true
            }
        },
        type_id: {
            label: "工作分类",
            editable: true,
            control: "select",
            option: {
                getters: 'kernel/types',

                key: 'task_type',
                required: true
            }
        },
        duration:{
            label:"计划时间",
            control:"input",
            option:{
                type:"number"
            }
        },
        content: {
            label: "内容描述",
            editable: true,
            control: "input",
            option: {
                type: 'textarea',
                height: 200,
                maxlen: 1024
            }
        },
        files: {
            label: "附件",
            control: "files",
            option: {
                type: 'list'
            }
        }


    }

}