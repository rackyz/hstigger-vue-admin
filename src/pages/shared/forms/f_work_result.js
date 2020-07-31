import moment from "moment";

export default {
    
        title: '工作成果提交',
        layout: `<div>
                <Row :gutter='10' style='margin-top:10px'>
                <Col :span='12'>{{date}}</Col>
                </Row>
                <Row :gutter='10' style='margin-top:10px'>
                <Col :span='24'>{{content}}</Col>
                </Row>
                <Row :gutter='10' style='margin-top:10px'>
                <Col :span='24' style='height:200px' >{{files}}</Col></Row></div>`,
        def: {
            date: {
                label: "完成日期",
                control: "time",
                option: {
                    type: 'date',
                    defaultValue:moment().format()
                }
            },
            content: {
                label: "情况说明",
                control: 'input',
                option: {
                    type: "textarea",
                    height: 100,
                    defaultValue:"本工作已按期完成"
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
            editable: true,
            hideReset:true,
            submitText:"下一步"
        }
    
}