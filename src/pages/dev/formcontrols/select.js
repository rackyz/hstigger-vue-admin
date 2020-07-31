const def = {
    select1:{
        label:"纯文本",
        control:"select",
        option:{
            options: ["苹果", "香蕉", "橘子", "西瓜"],
            type: "text"
        }
    }, select2: {
        label: "纯文本(序号)",
        control: "select",
        option: {
            options: ["苹果", "香蕉", "橘子", "西瓜"]
           
        }
    }, select3: {
        label: "对象",
        control: "select",
        option: {
            options: [{
                id: "S1",
                label: "胡佳翰"
            }, {
                id: "S2",
                label: "李加翰"
            }, {
                id: "S3",
                label: "张加翰"
            }, {
                id: "S4",
                label: "胡家翰"
            }]
        }
    },
    select4: {
        label: "纯文本(多选)",
        control: "select",
        option: {
            options: ["苹果", "香蕉", "橘子", "西瓜"],
            type:"text",
            multiple:true
        }
    },
    select5: {
        label: "分组",
        control: "select",
        option: {
            options: ["苹果", "香蕉", "橘子", "西瓜"]
        }
    },
    select6: {
        label: "头像",
        control: "select",
        option: {
            options: ["苹果", "香蕉", "橘子", "西瓜"],
            avatar:true
        }
    },
    select7: {
        label: "头像2",
        control: "select",
        option: {
            options: ["苹果", "香蕉", "橘子", "西瓜"],
            avatar: true
        }
    },
    select8: {
        label: "头像3多选",
        control: "select",
        option: {
            options: ["苹果", "香蕉", "橘子", "西瓜"],
            avatar: true,
            multiple:true
        }
    },
    select9: {
        label: "级联",
        control: "select",
        option: {
            options: [{
                id: "S1",
                label: "胡佳翰",
                subs:[{
                    id:"S1.1",
                    label:"傻子"
                },{
                    id:"S2.2",
                    label:"爱豆"
                },{
                    id:"S2.3",
                    label:"火狼"
                }]
            }, {
                id: "S2",
                label: "李加翰"
            }, {
                id: "S3",
                label: "张加翰"
            }, {
                id: "S4",
                label: "胡家翰"
            }],
            multiple:true
        }
    },
}

const option = {
    editable:true
}

const event = {

}
let d = JSON.stringify(def)
let o = JSON.stringify(option)
let e = JSON.stringify(event)
const form =  {
    def: d.substr(1, d.length - 2),
    layout: "<div><Row :gutter='12' ><Col :span='6'>{{select1}}</Col><Col :span='6'>{{select2}}</Col><Col :span='6'>{{select3}}</Col><Col :span='6'>{{select4}}</Col></Row><Row :gutter='12' style='margin-top:10px'><Col :span='6'>{{select5}}</Col><Col :span='6'>{{select6}}</Col><Col :span='6'>{{select7}}</Col><Col :span='6'>{{select8}}</Col></Row><Row :gutter='12' style='margin-top:10px'><Col :span='12'>{{select9}}</Col></Row></div>",
    option: o.substr(1, o.length - 2),
    event: e.substr(1, e.length - 2),
}

console.log("select:",form)

export default {
    form,
    article: "articleCPMISD12"
}
        