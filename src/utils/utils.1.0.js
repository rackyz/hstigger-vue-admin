export let makeTree = (list,options)=>{
    let defaultOptions = {
        KEY: 'id',
        PARENT_KEY: 'parent_id',
        PROCESS_NODE:v=>v,
        LIST_KEY:'subs'
    }
    Object.assign(defaultOptions,options)

    let {
        KEY,
        PARENT_KEY,
        PROCESS_NODE,
        LIST_KEY
    } = defaultOptions

    list.forEach(v=>{
        delete v.subs
    })

    // save to map
    let map = {}
    let roots = []
    list.forEach(v=>{
        let key = v[KEY]
        if(key === undefined){
            console.error('Key is not defined:',KEY,v)
            return
        }
        if(map[key]){
            console.error('Key is existed:',v[KEY])
            return
        }
        map[key] = PROCESS_NODE(v)
    })

    list.forEach(v=>{
        let parentKey = v[PARENT_KEY]
        if(parentKey){
            let parent = map[parentKey]
            if(!parent){
                console.error('Parent is not exist:',parentKey,v,map)
                return
            }

            let list = parent[LIST_KEY]
            let node = PROCESS_NODE(v)
            if(!list){
                parent[LIST_KEY] = [node]
            }else{
                 parent[LIST_KEY].push(node)
            }
        }else{
            roots.push(v)
        }
    })


    return roots
}
