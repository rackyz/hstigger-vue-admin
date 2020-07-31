export default {
    title: '项目基本情况',
        layout: "<div><Row :gutter='10'><Col :span='4'>{{code}}</Col><Col :span='20'>{{name}}</Col></Row><Row :gutter='10' style='margin-top:10px'><Col :span='8'>{{buildtype}}</Col><Col :span='8'>{{managetype}}</Col><Col :span='8'>{{position}}</Col></Row><Row :gutter='10' style='margin-top:10px'><Col :span='12'>{{investionSide}}</Col><Col :span='12'>{{constructionSide}}</Col></Row><Row  :gutter='10' style='margin-top:10px'><Col :span='12'>{{supervisorSide}}</Col></Row><Row  :gutter='10' style='margin-top:10px'><Col :span='8'>{{amount}}</Col><Col :span='8'>{{area}}</Col><Col :span='8'>{{buildingArea}}</Col></Row><Row style='margin-top:10px'><Col :span='24'>{{address}}</Col></Row><Row :gutter='10' style='margin-top:10px'><Col :span='24' style='height:200px' >{{desc}}</Col></Row><Row style='margin-top:10px'><Col>{{images}}</Row></Col></Row></div>",
        def: {
            code: {
                label: "项目编号",
                control: 'input',
                option: {
                    required: true
                }
            },
            name: {
                label: "项目名称",
                control: 'input',

                option: {
                    required: true
                }
            },
            buildtype: {
                label: "建筑类型",
                control: 'select',
                option:{
                    getters:'kernel/types',
                    key:"buildType"
                }
            },
            amount:{
                label:"投资金额",
                control:"input",
                option:{
                    type:"amount"
                }
            },
            area:{
                label: "用地面积(平米)",
                    control: "input",
                    option: {
                        type: "number"
                    }
            },
            buildingArea:{
                label: "建筑面积(平米)",
                    control: "input",
                    option: {
                        type: "number"
                    }
            },
            managetype: {
                label: "管理类型",
                control: 'select',
                    option: {
                        getters: 'kernel/types',
                        key: "manageType"
                    }
            },
            position: {
                label: "项目地点",
                control: 'input'
            },
            address:{
                label:"项目地址",
                control:"input",
                option:{
                    maxlen:255
                }
            },
            desc: {
                label: "项目简介",
                control: "input",
                option: {
                    type: "textarea"
                }
            },
            constructionSide: {
                label: "建设单位",
                control: "input"
            },
            investionSide: {
                label: "投资单位",
                control: "input"
            },
            supervisorSide: {
                label: "监理单位",
                control: "input"
            },
            images: {
                label: "效果图",
                control: "files",
                option: {
                    maxlen: 5,
                    type: 'image',
                    multiple: true
                }
            }

        },
        option: {
            editable: true
        }
    }