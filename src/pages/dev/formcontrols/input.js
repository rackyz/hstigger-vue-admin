module.exports = {
       
        form:{
            def:`"text1":{"label":"短文本", "control":"input","option":{"maxlen":"12"}},
"text2":{"label":"金额","control":"input","option":{"type":"amount","required":"true"}},
"text3":{"label":"数值","control":"input","option":{"type":"number"}},
"text4":{"label":"长文本","control":"input","option":{ "type":"textarea", "maxlen":"128","height":"200"}},
"text5":{"label":"md","control":"input","option":{ "type":"md", "maxlen":"128"}}`,
            layout:"<div><Row :gutter='12' ><Col :span='8'>{{text1}}</Col><Col :span='8'>{{text2}}</Col><Col :span='8'>{{text3}}</Col></Row><Row :gutter='12' style='margin-top:10px' ><Col :span='12'>{{text4}}</Col><Col :span='12'>{{text4}}</Col></Row><Row :gutter='12' style='margin-top:10px' ><Col :span='24'>{{text5}}</Col></Row></div>",
            option:`"editable":"true"`,
            event:"",
        }
        ,
        article: "articleCPMISD11"
    
    }