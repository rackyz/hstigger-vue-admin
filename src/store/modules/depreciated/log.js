import moment from 'moment'
const state = {
    logs:[],
    keymap:{},
    regions:[]
}

const getters = {
    logs:state=>{
        return state.logs
    },
    regions:state=>{
        return state.regions
    }
   
}


const actions = {

}

let objectIndex = 1
const registerObject = (state,object)=>{
    if(object && typeof object=='object'){
        let index = objectIndex
        objectIndex++
        object._id = '_obj_'+index
        state.keymap[object._id] = object
    }
}

const parseObject=(state,key,object,level = 0)=>{
    let parsed = {
        key,
        type: typeof object,
        _foldable: true,
        _fold:true,
        level
        }
    if (parsed.type== 'function') {
        parsed.foldable = false
        parsed.proto = 'f ()'
        parsed.value = JSON.stringify(object)
        registerObject(state, parsed)
    } else if (parsed.type == 'object') {
        if(level > 3){
            parsed.type = 'error'
            parsed.value = 'too many levels'
            parsed._foldable = false
            return parsed
        }
         parsed.attrs = []
         if(Array.isArray(object)){
             parsed.proto = object.length?'[ ... ]':'[]'
         }else{
             parsed.proto = Object.keys(object||{}).length?'{ ... }':'{}'
         }

        for (let x in object) {
            parsed.attrs.push(parseObject(state,x,object[x],level+1))
        }
        registerObject(state, parsed)
    }else{
        parsed.value = JSON.stringify(object)
        parsed._foldable = false
    }
    if(level == 0)
        console.log('parsed:',level,parsed)
    return parsed
   
}

const mutations = {
    log:(state,logObject)=>{
        let region = logObject.region
        if(!state.regions.find(v=>v == region))
            state.regions.push(region)

        let items = logObject.items || []
          let debugObject = {
              time: moment().format('HH:mm:ss'),
              region,
              items: items.map(v => parseObject(state,null,v))
          }
          state.logs.push(debugObject)
         
    },
    fold:(state,key)=>{
        let object = state.keymap[key]
        object._fold = !object._fold
        state.logs.splice(0,1,state.logs[0])
    },
    clear:(state)=>{
        state.logs = []
    },
     isFold:(state,key)=>{
         return state.keymap[key] ? state.keymap[key]._fold:false
     }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}