export default {
    layout: `<div>
        <Row :gutter='10'>
        <Col span='6'>{{type_id}}</Col><Col span='18'>{{title}}</Col>
        </Row>
        <Row :gutter='10' style='margin-top:10px;'>
        <Col span='12'>{{startTime}}</Col><Col span='12'>{{deadline}}</Col>
        </Row>
        <Row :gutter='10' style='margin-top:10px;'>
        <Col>{{content}}</Col>
        </Row> <Row :gutter='10' style='margin-top:10px;'>
        <Col>{{files}}</Col>
        </Row>
        
        <Row :gutter='10'  style='margin-top:20px;'>
        <Col span='12'>{{stype}}</Col><Col span='12'>{{charger}}</Col>
        </Row>
        </div>`,

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
        projectMul: {
            label: "克隆",
            editable: true,
            control: "bool"
        },
        charger: {
            label: "负责人",
            editable: true,
            control: "select",
            option: {
                getters: 'kernel/userAsOptions',
                required: true
            }
        },
        startTime: {
            label: '开始日期',
            editable: true,
            control: 'time'
        },
        deadline: {
            label: '截止日期',
            editable: true,
            control: 'time'
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