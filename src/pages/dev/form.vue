<style lang="less">
.ll-content{
    .ivu-tabs-content{
            position: absolute;
            top:38px;
            bottom:0;
            left:0;
            right:0;
            .ivu-tabs-tabpane{
                position: relative;
                height:100%;
                width:100%;
                overflow: hidden;
                overflow-y:auto;
            }
        }
}
</style>
<template>
     <div class="l-page">
      <div class="l-menu-wrap">
          <h1>
              目录
          </h1>
          <template v-for="m in contents">
          
          <div class="l-menu-item" :class="selectedId==m.id?'l-menu-item-selected':''" @click="selectedId=m.id" :key="m.id">
              {{m.name}}
          </div>
          </template>
      </div>
      <div class="ll-content">
          <div class="full-fill">
        <Tabs class="full-fill" value="name1">
            <TabPane label="文档" name="name1"> <xArticle class="l-article" :id="selected.article" /></TabPane>
            <TabPane label="测试" name="name2"> <gzFormEditor :formdef="selected.form" /></TabPane>
        </Tabs>
    </div>
        </div>
  </div>
</template>


<script>
import devBase from './formcontrols/base.js'
import devInput from './formcontrols/input.js'
import devSelect from './formcontrols/select.js'
import devFile from './formcontrols/file.js'
import devList from './formcontrols/list.js'
import devForm from './formcontrols/form.js'
import devTime from './formcontrols/time.js'
import xArticle from '@refs/editor/article'
import gzFormEditor from '@refs/gzUI/form-editor/editor'

export default {
    data(){
        return{
            selectedId:"base",
            editing:false,
            contents:[{
                id:"base",
                name:"1.基础介绍 - gzForm"
                
            },{
                id:"input",
                name:"2.输入框 - gzINPUT "
                
            },{
                 id:"select",
                name:"3.选择框 - gzSELECT"
            },{
                 id:"time",
                name:"4.文件上传 - gzTime"
            },{
                 id:"file",
                name:"5.文件上传 - gzFILE"
            },{
                 id:"list",
                name:"6.列表 - gzList"
            },{
                 id:"form",
                name:"7.内置表单 - gzForm"
            }]
        }
    },
    computed:{
        selected(){
            const list = {
                base:devBase,
                input:devInput,
                select:devSelect,
                file:devFile
            }
            return list[this.selectedId] || {}
        }
    },
    components:{
       xArticle,gzFormEditor
    }
}
</script>

<style lang="less" scoped>
td{
    padding:10px;
}
.editor-wrapper{
   position: relative;
   height:800px;
   width:100%;
}
.l-page{
    position: absolute;
    left:0;
    right:0;
    bottom:0;
    top:0;
    .l-menu-wrap{
        position: absolute;
        left:0;
        top:0;
        bottom:0;
        width:220px;
        overflow-y:auto;
        border-right:1px solid #dfdfdf;
        h1{
            padding:20px;
            padding-bottom:10px;
        }
        .l-menu-item{
            width:100%;
            padding:5px 20px;
            display: flex;
            align-items: center;
            font-size:16px;
        }
        .l-menu-item-selected{
            color:rgb(11, 147, 245);
            font-weight: bold;
        }

        .l-menu-item:hover{
            cursor: pointer;
            color:#aaa;
        }
    }

    .ll-content{
        position: absolute;
        left:220px;
        right:0;
        bottom:0;
        top:0;
        overflow: hidden;
        overflow-y: auto;

        
    }
}

.l-title{
    display: flex;
    align-items: center;
    font-size:12px;
    font-family: consolas;
    justify-content: space-between;
    padding:10px;
    background:linear-gradient(to bottom,#fff,#eee,#fff);
}
</style>