const def = {
    text1: {
        label: "文本框",
        control: "input",
        option: {
            required:true
        }
    },
    select2: {
        label: "纯文本(序号)",
        control: "select",
        option: {
            options: ["苹果", "香蕉", "橘子", "西瓜"],
            type: "index"
        }
    }
}

const option = {
    editable: true
}

const event = {

}
let d = JSON.stringify(def)
let o = JSON.stringify(option)
let e = JSON.stringify(event)
const form = {
    def: d.substr(1, d.length - 2),
    layout: "<div><Row :gutter='12' ><Col :span='6'>{{text1}}</Col><Col :span='6'>{{select2}}</Col></Row></div>",
    option: o.substr(1, o.length - 2),
    event: e.substr(1, e.length - 2),
}

console.log("select:", form)

export default {
    form,
    article: "articleCPMISD10"
}