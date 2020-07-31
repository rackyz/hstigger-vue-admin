export default {
    layout: `<div>
        <Row :gutter='10'>
        <Col span='24'>{{name}}</Col>
        </Row><Row :gutter='10'  style='margin-top:10px;'>
        <Col span='8'>{{stype}}</Col><Col span='8'>{{type_id}}</Col><Col span='8'>{{charger}}</Col>
        </Row>
        <Row :gutter='10' style='margin-top:10px;'>
        <Col span='12'>{{startDate}}</Col><Col span='12'>{{endDate}}</Col>
        </Row>
        <Row :gutter='10' style='margin-top:10px;'>
        <Col style='height:400px;'>{{content}}</Col>
        </Row></div>`,

    def: {
            name: {
                label: "标题",
                editable: true,
                control: "input",

                option: {
                    required: true
                }
            },
            stype: {
                label: "任务类型",
                editable: true,
                control: "select",
                option: {
                    getters: "kernel/taskTypes",
                    text: true,
                    required: true
                }
            },
            type_id: {
                label: "子类型",
                editable: true,
                control: "select",
                option: {
                    getters: 'kernel/taskTypes',
                    relMode: "replace",
                    relKey: "stype",
                    relativeGetter: "kernel/getTaskSubTypes",
                    text: true,
                    required: true
                }
            },
            charger: {
                label: "负责人",
                editable: true,
                control: "select",
                option: {
                    getters: 'kernel/users',
                    idKey: "id",
                    labelKey: "name",
                    required: true
                }
            },
            startDate: {
                label: '开始日期',
                editable: true,
                control: 'time'
            },
            endDate: {
                label: '结束日期',
                editable: true,
                control: 'time'
            },
            content: {
                label: "内容",
                editable: true,
                control: "input",
                option: {
                    type: 'md',
                    maxlen: 128
                }
            }
        }

}