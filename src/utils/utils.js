var out = {}

/** 
 * 将字符映射为颜色
*/
out.mapColor = function (ch,base) {
    let d = ch.charCodeAt(0)

    const dRange = 40896 - 19968
    d = d - 19968
    if (d < 0)
        d = 10000
    let baseColor = base || 180 * 180 * 180
    let colorRange = 256 * 256 * 256 - baseColor
    let mapped = baseColor + parseInt((d * colorRange / dRange))

    mapped = mapped.toString(16)
    while (mapped.length < 6)
        mapped = '0' + mapped

    return '#' + mapped
}


out.getFullFileURL = function(url){
    if(!url)
        return
        
    if(url.includes('http'))
        return url
    else
        return 'https://nbgz-pmis-1257839135.cos.ap-shanghai.myqcloud.com/files/'+url
}

out.mapHealthColor= function(value){
    if(value < 50){
        return 'red'
    }else if(value < 75){
        return 'orange'
    }else{
        return 'green'
    }
}

/** 
 * 判断测试组是否含有给定target的值 
 * 应用场景 : 用户名及分组、角色权限检测
 * */
out.crossIncludes = function(target,...tests){
    let result = false
    for(let i=0;i<tests.length;i++){
        let test = tests[i]
        if (Array.isArray(target)) {
            if (Array.isArray(test)) {
                for(let j=0;j<test.length;j++){
                    let w = test[j]
                    if (w && target.includes(w))
                        return true
                }
            } else {
                if (test && target.includes(test))
                    return true
            }
        } else {
            if (Array.isArray(test)) {
                if (target && test.includes(target))
                     return true
            } else {
                if (test == target)
                     return true
            }
        }

    }
    return false
}

import moment from 'moment'

import XLSX from 'xlsx'
out.file2Xce = (file)=> {
    let wb = null
    return new Promise(function (resolve, reject) {
        const reader = new FileReader()
        reader.onload = function (e) {
            const data = e.target.result
            wb = XLSX.read(data, {
                type: 'binary'
            })
            const result = []
            wb.SheetNames.forEach((sheetName) => {
                result.push({
                    sheetName: sheetName,
                    sheet: XLSX.utils.sheet_to_json(wb.Sheets[sheetName])
                })
            })
            resolve(result)
        }
        reader.readAsBinaryString(file)
    })

}



out.formatSalarySemicolon = (salary) => {
    salary = salary ? parseFloat(salary) : 0
    let output = ""
    let fraction = salary.toString().split('.')[1]
    if (fraction)
        fraction = "." + fraction.slice(0,2)
    else
        fraction = ""
    salary = salary.toString().split('.')[0]
    if (salary > 1000) {
        output = ',' + ("000" + salary % 1000).slice(-3)
        salary = parseInt(salary / 1000)
    } else {
        return fraction ? salary + fraction : salary
    }

    while (salary > 1000) {
        output = "," + ("000" + salary % 1000).slice(-3) + output
        salary = parseInt(salary / 1000)
    }


    if (salary > 0)
        output = salary + output

    return output + fraction
}

out.formatSalary = (salary) =>{
    let nagivate = false
    if(salary < 0){
        salary = -salary
        nagivate = true
    }
     var num = salary ? Math.floor(salary) : 0
     var output = ""
     const units = [" "," 万", " 亿", " 兆"]
     let count = 0
     while (num >= 10000) {
         num = num / 10000
         count++
     }

     return (nagivate?'-':'') +  num.toFixed(2) + units[count]
}


out.parseImport = (data) => {
    try {
        let sheet = data[0].sheet
        let dataItems = []
        const mapType = d => {
            switch (d) {
                case '项管':
                    return 6
            }
        }

        const mapDep = d=>{
            switch(d){
                case '项管':
                    return 6
            }
        }
      
        let added_parents = []

        sheet.forEach(v => {
            if (v['合同编号']) {
                let item = {}
                item.code = v['合同编号']
                
                item.name = v['合同名称']
                item.type_id = mapType(v['部门'])
                item.amount = v["总体合同收费情况（万元）"] * 10000
                item.amount = parseInt(item.amount)
                item.startTime = v['开工时间']
                item.left = v['__EMPTY'] * 10000
               
                item.payed  = item.amount - item.left
                 delete item.left
                item.dep_id = mapDep(v['部门'])
                item.endTime = v['竣工两份']
                item.conditions_raw = v['收款条件']
                item.current_workPoint = v['当前工程节点']
                if (item.code) {
                    item.code = item.code.toString()
                    item.code = item.code.replace('.', '-')
                    item.code = item.code.toUpperCase()
                    if (item.code.includes('-')) {
                        item.parent_id = item.code.split('-')[0]
                        let parent = sheet.find(v => v.code == item.parent_id)
                        if (!parent) {
                            parent = dataItems.find(v => v.code == item.parent_id)
                            if (!parent) {
                                parent = Object.assign({},
                                    item)
                                parent.code = parent.parent_id
                                delete parent.parent_id
                                parent.amount = item.amount
                                dataItems.push(parent)
                            } else {
                                parent.amount += item.amount
                            }
                        }
                    }
                }
                dataItems.push(item)
            }
        })

        return dataItems

    } catch (e) {
        return
    }
}

out.renderFullAmount = (h, amount, highlight, center) => {
    if (amount) {
        if (typeof highlight == 'boolean')
            highlight = "red"
        return h("div", {
            style: {
                display: "flex",
                alignItems: "center",
                justifyContent: center ? "center" : "flex-end"
            }
        }, [h("span", {
            style: {
                color: "#aaa",
            }
        }, "¥"), h("span", {
            style: {
                color: highlight ? highlight : "#888",
                marginLeft: "0.2rem",
                marginRight: center ? '' : "1rem"
            }
        }, out.formatSalarySemicolon(amount))])
    }
}
out.renderEmpty = (h)=>{
    return h('span',{},'-')
}

out.renderContractState = (h,state)=>{
    const stateNames = [
        '准备中',
        "已审核",
        "已入库",
        "待删除"
    ]
    const colors = [
        '#888',
        'orange',
        '#2d8cf0',
        'green'
    ]
    let stateName = stateNames[state]
    return h('span', {
        style: {
            color: colors[state]
        }
    }, stateName || '-')
}

out.renderAmount = (h,amount,highlight,center)=>{
    amount = amount || 0
        if(typeof highlight=='boolean' && highlight)
            highlight = "red"
        return h("div", {
            style: {
                display: "flex",
                alignItems: "center",
                justifyContent: center?"center":"flex-end"
            }
        }, [h("span", {
            style: {
                color: "#aaa",
            }
        }, "¥"), h("span", {
            style: {
                color: highlight ? highlight : "#888",
                marginLeft: "0.2rem",
                marginRight: center?'':"1rem"
            }
        }, out.formatSalary(amount))])
    
}

out.moment = (date,format)=>{
    if(!date)
        return moment()
    if (date.includes(':') && !format) {
        return moment(date)
    }else if(format){
        return moment(date,format)
    }else{
        return moment(date,'YYYY-MM-DD')
    }
}

out.durationOfDate = (d1,d2)=>{
    if(d1 && d2){
        let md1 = d1.includes(':') ? moment(d1) : moment(d1, 'YYYY-MM-DD')
        let md2 = d2.includes(':') ? moment(d2) : moment(d2, 'YYYY-MM-DD')
        return moment.duration(md2-md1)
    }
} 

out.isBeforeToday = (d, format, vnow) => {
    let md = moment(d,format)
    let today = moment(vnow).startOf('day')
    if(md < today){
        return true
    }else
        return false
}

out.dateAddDays = (d,days)=>{
    if(d && days){
    let m = d.includes(':') ? moment(d) : moment(d, 'YYYY-MM-DD')
    return m.add(days,'days')
    }else{
        return moment(d)
    }
}

out.days2months = (d)=>{
    let days = parseInt(d)
    return (days /30.4)
}

out.dateOffset = (d1,d2)=>{
    return moment.duration(moment(d2)-moment(d1))
}

out.renderType = (h,type)=>{
    if(type)
        return h('gzType', {
            props: {
                value: type
            },
            styles: {
                float: 'left',
                marginLeft: '0.5rem'
            }
        })
}

out.renderTypeById = (h,t,types)=>{
    if(!Array.isArray(types))
        return
    let type = types.find(v=>v.id == t)
    if (type)
       return h('gzType', {
           props: {
               value: type
           },
           styles: {
               float: 'left',
               marginLeft: '0.5rem'
           }
       })
}

out.renderDateSimple = (h,d,hl)=>{
     if (typeof d == 'string' && d != "null" && d != "") {
         let m = d.includes('T') ? moment(d) : moment(d, 'YYYY-MM-DD')
         let dateString = m.startOf("day").format('YYYY-MM-DD')
          return h('div', {
                      style: {
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center'

                      }
                  }, [h('div', {
                          style: {
                              color: hl ? 'blue' : '#777',
                              textAlign: 'cener',
                              fontSize: '0.7rem',
                              lineHeight: '1rem'
                          }
                      }, dateString)]
          )
          } else {
              return h('span', {}, '-')
          }
                
}

out.renderDate = (h,d,highlight)=>{
    if(typeof d == 'string' && d != "null" && d != ""){
        let m = d.includes('T')?moment(d):moment(d,'YYYY-MM-DD')
        let dateString = m.startOf("day").format('YYYY/MM/DD')
        let dateSmart = m.fromNow()
        if(dateSmart.includes('小时'))
            dateSmart = '1天内'
        return h('div',{
            style:{
                display:'flex',
                flexDirection:'column',
                alignItems:'center',
                justifyContent:'center'
                
            }
        },[h('div',{
            style:{
                color: highlight?'blue':'#777',
                textAlign:'cener',
                fontSize:'0.7rem',
                lineHeight:'0.9rem'
            }
        },dateString),h('div',{
            style:{
                color:'#aaa',
                fontSize:'0.5rem',
                
                lineHeight: '0.6rem',
                textAlign:'center'
            }
        },dateSmart)])
    }else{
        return h('span',{},'-')
    }
    
}

out.renderCompareMark= (h,d,r)=>{
   
    return h('Icon',{props:{
        type:d>=0?'md-arrow-dropup':'md-arrow-dropdown',
        size:14
    },
    style:{
        color:!r ? ((d>0)?'red':'green'):(d>=0?'green':'red')
    }})
}

out.renderMark = (h,d,r)=>{
     return h('Icon', {
    props: {
        type: 'ios-checkmark-circle-outline',
        size: 16
    },
    style: {
    color: 'green',
    marginLeft:'0.25rem',
    marginRight:'0.25rem'
    }
    })
}

out.renderCompare = (h, d, offset, colorReverse, renderFunc,inline) => {
    if (d || offset) {
        const styleInline = {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }

        const styleNotInline = {
               display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
        }

        let renderItems = [h('div', {
            style: {
                color: '#777',
                textAlign: 'center',
                fontSize: '0.7rem',
                lineHeight: '1rem',

            }
        }, [renderFunc ? renderFunc(h, d) : d])]
        if (offset != 0 && (Math.abs(offset) > 0.01))
            renderItems.push(h('div', {
                style: {
                    color: colorReverse ? (offset >= 0 ? 'green' : 'red') : (offset > 0 ? 'red' : 'green'),
                    fontSize: '10px',

                    lineHeight: inline ? '' : '0.6rem',
                    textAlign: 'center',
                    display: "flex",
                    alignItems: "center"
                }
            }, [h('span',{
                style:{
                marginLeft:inline?'0.5rem':'',
                marginRight:'0.25rem'
                }
            },offset>0?'+':'-'), renderFunc ? renderFunc(h, Math.abs(offset)) : offset.toFixed(2)]))
        return h('div', {
            style: inline ? styleInline : styleNotInline
        },renderItems)
    } else {
        return h('span', {}, '-')
    }

}


out.renderComparePercent = (h, d, percent, colorReverse, renderFunc, inline) => {
    if (d || percent) {
        const styleInline = {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }

        const styleNotInline = {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        }

        let renderItems = [h('div', {
            style: {
                color: '#777',
                textAlign: 'center',
                fontSize: '0.7rem',
                lineHeight: '1rem',

            }
        }, [renderFunc ? renderFunc(h, d) : d])]
            renderItems.push(h('div', {
                style: {
                    color: colorReverse ? (percent <= 0? 'green' : 'red') : (percent > 0 ? 'red' : 'green'),
                    fontSize: '10px',

                    lineHeight: inline ? '' : '0.6rem',
                    textAlign: 'center',
                    display: "flex",
                    alignItems: "center"
                }
            }, [out.renderCompareMark(h, percent, colorReverse),Math.abs(percent*100).toFixed(1) +'%']))
        return h('div', {
            style: inline ? styleInline : styleNotInline
        }, renderItems)
    } else {
        return h('span', {}, '-')
    }

}


// d1 > d2, return 0
out.offsetMonth = (d1,d2)=>{
    let dm1 = moment(d1)
    let dm2 = moment(d2)
    let y1 = dm1.year()
    let y2 =dm2.year()
    let m1 = dm1.month()+1
    let m2 = dm2.month()+1

    let offset = 0
    if(y2 > y1){
        offset = (y2 - y1 - 1) * 12 + (12 - m1 + 1) + m2
    }else{
        offset = m2 - m1 + 1
    }
    return offset
}

out.offsetYear = (d1,d2)=>{
    return parseInt(d2)-parseInt(d1)
}

out.calcInDuration = (inStart, inEnd, outStart, outEnd)=> {
    let start, end
    if (inStart.isBefore(outStart)) {
        if (inEnd.isBefore(outStart))
            return 0
        else {
            start = outStart
            end = inEnd.isBefore(outEnd) ? inEnd : outEnd
        }
    } else {
        if (inStart.isAfter(outEnd)) {
            return 0
        } else {
            start = inStart
            end = inEnd.isBefore(outEnd) ? inEnd : outEnd
        }
    }
    if (end < start)
        return 0

    return moment.duration(end - start).as('month')
}

out.renderProgressValue = (h, percent,value,color='#cef',bgcolor='#fff') => {
    value = value || (percent*100).toFixed(1) + '%'
    let percentItems = []
    if (typeof percent != 'undefined')
        percentItems.push(h("div", {
            style: {
                position: 'absolute',
                left: 0,
                height: "1.8rem",
                zIndex: '0',
               
                background: color,
                width: (percent && percent > 100 ? 100 : (percent || 0)) + '%'
            }
        }))
    else
        return

    percentItems.push(h('div', {
        style: {
            zIndex: 1,
            color:'#333',
            position: 'relative',
            width:"100%",
            textAligh:"right"
        }
    }, [value]))

    return h("div", {
        style: {
            position: "relative",
            height: "2rem",
            display: 'flex',
            alignItems: 'center',

            background: bgcolor,
            justifyContent: 'center',
            margin: '0 0.5rem'
        }
    }, percentItems)
}


out.renderCompareProgress = (h,percent)=>{
    let percentItems = []
    if (typeof percent != 'undefined')
        percentItems.push(h("div", {
            style: {
                position: 'absolute',
                left: 0,
                height: "2rem",
                zIndex: '0',
                
                background: percent > 100 ? '#5cb515' : '#fa3833',
                width: (percent && percent > 100 ? 100 : (percent || 0)) + '%'
            }
        }))
    else
        return
    percentItems.push(h('span', {
        style: {
            zIndex: 1,
            color: 'white',
            position: 'relative'
        }
    }, (percent || 0) + '%'))

    return h("div", {
        style: {
            position: "relative",
            height: "2rem",
            display: 'flex',
            alignItems: 'center',
            
            background: '#ddd',
            justifyContent: 'center',
            margin: '0 0.5rem'
        }
    }, percentItems)
}


out.renderProgress = (h, percent,percent2) => {
    
    let percentItems = []
    if(typeof percent != 'undefined')
        percentItems.push(h("div", {
            style: {
                position: 'absolute',
                left: 0,
                height: "2rem",
                zIndex: '0',
                transition:'all 0.3s',
                background: '#5fabf1',
                width: (percent && percent > 100 ? 100 : (percent || 0)) + '%'
            }
        }))
    else
        return
    if(percent2){
        percentItems.push(h("div", {
            style: {
                position: 'absolute',
                left: 0,
                height: "2rem",
                zIndex: '1',
                color:"#eee",
                background: 'green',
                textAlign:'center',
                width: (percent2 && percent2 > 100 ? 100 : (percent2 || 0)) + '%'
            }
        }, (percent2 && percent2 > 100 ? 100 : (percent2 ? percent2.toFixed(2) : 0)) + '%'))
    }
    
    if(typeof percent == 'string')
        percent  = parseFloat(percent)

    if(typeof percent != 'number')
        percent = 0
    if(percent > 100)
        percent = 100
    else 
        percent = percent.toFixed(2)

    percentItems.push(h('span', {
        style: {
            zIndex: 1,
            position: 'relative'
        }
    }, (percent + '%')))
    
    return h("div", {
        style: {
            position: "relative",
            height: "2rem",
            display: 'flex',
            alignItems: 'center',
            background: '#ddd',
            justifyContent: 'center',
            margin: '0 0.5rem'
        }
    }, percentItems)
}
out.getRoleName = role=>{
    const roleMap = {
        'fd':'财务部',
        'fda':'财务部管理',
        'ob':'公司管理',
        'test':'测试账号',
        'admin':'超级管理',
        'pd':'项目部',
        'pda':'项目部管理',
        'od':'经营部',
        'oda':'经营部管理',
        'pkey':'pkey码登录'
    }

    return roleMap[role]
}
out.renderMark = (h, icon, prompt, clickHandler) => {
   return h('Tooltip', {
        props: {
            content: prompt,
            placement: 'top',
            theme: 'light'
        },


        style: {
            marginLeft: '0.5rem',
            color: '#fff',
            fontSize: "0.7rem",
            cursor: 'pointer',
            fontWeight: "bold",
            width: "18px",
            height: "18px",
            textAlign: "center",
            lineHeight: "18px",
            borderRadius: "50%",
            background: "#aaa"
        },


    }, [h('a', {
        style: {
            width: '100%',
            height: '100%'
        },
        on: {
            click:clickHandler
        }
    }, [h('Icon', {
        props: {
            type: icon,
            size: '8',
            color: '#fff'

        }
    })])])
}


out.handleSpinCustom = (the)=>{
     return {
         start(){
             this.timerId = setTimeout(() => {
                 the.$Spin.show({
                     render: (h) => {
                         return h('div', [
                             h('Icon', {
                                 'class': 'gz-spin-icon-load',
                                 props: {
                                     type: 'ios-loading',
                                     size: 18
                                 }
                             }),
                             h('div', 'Loading')
                         ])
                     }
                 });
             }, 2000);
         },
         stop(){
             clearTimeout(this.timerId)
             the.$Spin.hide();
         }
     }
   
}

out.renderText= (h,text)=>{
    return h('span',{
        styles:{
            float:'left',
            marginLeft:'0.5rem',
            textAlgin:'left'
        }
    },text)
}

out.renderHTML = (h,html)=>{
    return h('span', {
                style: {
                    textAlign: 'left',
                    float:'left',
                    marginLeft:'0.5rem'
                },
                domProps: {
                    innerHTML: html
                },
            }
            )
}

out.renderDep = (h, dep,color, icon) => {
    if (dep)
        return h("div", {
            style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "left",
                marginLeft: "1rem",
                color: color || 'green',
            }
        }, [h("Icon", {
            props: {
                type: icon || 'ios-people-outline',
                color:'green',
                size:15
            },
            style: {
                width: '1rem',
                height: '1rem',
                color: color || 'green',
                marginRight: "0.5rem"
            }
        }), dep])
    else
        return h('span', {}, '-')
}



out.renderUser = (h,user,avatar)=>{
    if(user)
        return h("div", {
            style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "left",
                marginLeft: "1rem",
                color: "#666"
            }
        }, [h("img", {
            attrs: {
                src: avatar || 'https://nbgz-pmis-1257839135.cos.ap-shanghai.myqcloud.com/icon/guest.png'
            },
            style: {
                width: '1rem',
                height: '1rem',
                marginRight: "0.5rem"
            }
        }), user])
    else
        return h('span',{},'-')
}


out.renderTitle = (h,title,inputTime,onClickHandler)=>{
    let showNewMark = false 
    if(inputTime && moment().add('days',-3)<moment(inputTime)){
        showNewMark =  true
     }

     let renderItems = [h(
         'span', {
             style:{textAlign:'left'},
             domProps: {
                 innerHTML: title
             },
         })]
    if(showNewMark)
         renderItems.push(h("img", {
                     attrs: {
                         src: "https://nbgz-pmis-1257839135.cos.ap-shanghai.myqcloud.com/beauty/new.gif"
                     },
                     style: {
                         marginLeft: "0.5rem"
                     }
                 }))


     return h(onClickHandler ? "a" : "span", {
         class: 'flow',
         style: {
             float: "left",
             marginLeft: "0.5rem",
             marginRight:"0.5rem",
             textAlign:"left"
         },
         on: {
             click: onClickHandler
         }
     }, renderItems)
}


const processData = {
    _is_module:true
}
processData.formatTime = (item, key, formatter) => {
    if(!item[key])
        return
    let m = moment(item[key])
    item[key + 'Text'] = m.format(formatter  || 'YYYY-MM-DD HH:mm:ss')
    item[key+'Smart'] = m.fromNow()
}
out.processData = processData


out.formatSmartTime = timeStr =>{
    if(!timeStr){
        return "无"
    }
    let m  = moment(timeStr)
    if(m.isAfter(moment().startOf('day'))){
        return '今天 '+ m.format('HH:mm')
    }else if(m.isAfter(moment().startOf('year'))){
        return m.format("M月D日")
    }else{
        return m.format("YYYY年M月")
    }
}


out.isNew = timeStr => {
    if (timeStr) {
        return moment(timeStr).isAfter(moment().subtract(3,'days'))
    }
}


out.install = v => {
    for (let x in out) {
        if (typeof out[x] === 'object' && !out[x]._is_module)
            v.component(x, out[x])
        else{
            if (v.prototype.util)
                v.prototype.util[x] = out[x]
        else
            v.prototype.util = {
                [x]: out[x]
            }
        }
    }

}


import {makeTree} from './utils.1.0'
out.makeTree = makeTree

export default out