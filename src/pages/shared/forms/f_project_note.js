export default {
    title: '项目基本情况',
    layout: "<div><Row :gutter='10'><Col :span='24' style='height:200px' >{{note}}</Col></Row></div>",
    def: {
        note: {
            label: "项目公告",
            control: "input",
            option: {
                type: "textarea"
            }
        }

    },
    option: {
        editable: true
    }
}