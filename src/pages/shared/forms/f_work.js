export default {
    layout: `<div>
        <Row :gutter='10'>
        <Col span='24'>{{title}}</Col>
        </Row><Row :gutter='10'  style='margin-top:10px;'>
        <Col span='8'>{{stype}}</Col><Col span='8'>{{type_id}}</Col><Col span='8'>{{charger}}</Col>
        </Row>
        <Row :gutter='10' style='margin-top:10px;'>
        <Col span='12'>{{project}}</Col> <Col span='12'>{{dep}}</Col>
        </Row>
        <Row :gutter='10' style='margin-top:10px;'>
        <Col span='12'>{{startTime}}</Col><Col span='12'>{{deadline}}</Col>
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
        project: {
            label: "项目",
            editable: true,
            control: "select",
            option: {
                getters: 'project/list',
                multiple: true
            }
        },
        dep: {
            label: "部门",
            editable: true,
            control: "select",
            option: {
                getters: 'kernel/groups',
                multiple: true
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
            control: 'time'
        },
        deadline: {
            label: '结束日期',
            control: 'time'
        },
        content: {
            label: "内容描述",
            editable: true,
            control: "input",
            option: {
                type: 'md',
                height: 300
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