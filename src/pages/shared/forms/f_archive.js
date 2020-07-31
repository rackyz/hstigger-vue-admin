export default {
    
        title: '档案',
        layout: `<div><Row :gutter='10'>
                <Col :span='8'>{{code}}</Col>
                <Col :span='16'>{{name}}</Col>
                </Row>
                <Row :gutter='10' style='margin-top:10px'>
                <Col :span='7'>{{date}}</Col>
                <Col :span='10'>{{type}}</Col>
                <Col :span='7'>{{type2}}</Col>
                </Row>
                <Row :gutter='10' style='margin-top:10px'>
                <Col :span='24'>{{note}}</Col>
                </Row>
                <Row :gutter='10' style='margin-top:10px'>
                <Col :span='24' style='height:200px' >{{files}}</Col></Row></div>`,
        def: {
            code: {
                label: "档案编号",
                control: 'input',
                option: {
                    required: true
                }
            },
            name: {
                label: "档案名称",
                control: 'input',

                option: {
                    required: true
                }
            },
            date: {
                label: "档案日期",
                control: "time",
                option: {
                    type: 'date'
                }
            },
            type: {
                label: "档案分类",
                control: 'select',
                option: {
                    required: true,
                    getters: "kernel/types",
                    key: "archive_type"
                }
            },
            type2: {
                label: "档案类型",
                control: 'select',
                option: {
                    required: true,
                    getters: "kernel/types",
                    key: "archive_type2"
                }
            },
            note: {
                label: "备注",
                control: 'input',
                option: {
                    type: "textarea",
                    height: 100
                }
            },
            files: {
                label: "附件",
                control: "files",
                option: {
                    required: true,
                    list: true
                }
            }
        },
        option: {
            editable: true
        }
    
}