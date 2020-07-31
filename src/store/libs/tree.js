let out = {}


/** makeTree
 *  make node arrays to tree structure with ids, and a query map
 */
out.makeTree = (nodes,idKey='id',parentKey='parent_id')=>{
    let dataNodeMap = {}
    let treeNodeMap = {}
    let tree = []
    nodes.forEach(v=>{
        if(!v){
            console.error(`[tree.js]makeTree:node is null`)
            return
        }

        if(!v[idKey]){
            console.error(`[tree.js]makeTree:node.${idKey} is null`,v)
            return
        }

        if (dataNodeMap[v[idKey]]) {
            console.error(`[tree.js]makeTree:node.${idKey}=${v[idKey]} is already exist`,v)
            return
        }

        dataNodeMap[v[idKey]] = v
        treeNodeMap[v[idKey]] = {
            id: v[idKey],
            parent_id:v[parentKey]
        }
    })

    nodes.forEach(v=>{
        let vnode = treeNodeMap[v[idKey]]
        if(v[parentKey]){
            if (!treeNodeMap[v[parentKey]]) {
                console.error(`[tree.js]makeTree:node.${parentKey}=${v[parentKey]} is not exist`,v)
                return
            }

            let parent = treeNodeMap[v[parentKey]]
            if(parent.subs){
                parent.subs.push(vnode)
            }else{
                parent.subs = [vnode]
            }
        }else{
            tree.push(vnode)
        }
    })

    return {
        dataNodeMap,
        treeNodeMap,
        tree
    }
}

/** AddSubNode */
out.AddSubNode = (parentNode,subNode)=>{
    if(!parentNode){
        console.error('[tree.js]AddSubNode faild:parentNode is null')
        return
    }

    if(parentNode.subs){
        parentNode.subs.push(subNode)
    }else{
        parentNode.subs = [subNode]
    }

    console.log('parentNode:',parentNode)
}

/** AddTreeNode
 * params: dataNodeMap, treeNodeMap, tree
 */
out.AddTreeNode = ({dataNodeMap, treeNodeMap,tree}, parentNodeId, nodeData) => {
    console.log('[tree.js]AddTreeNode',nodeData)
    let dataNode = Object.assign({}, nodeData)
    
    
    //check exist
    let existNode = dataNodeMap[dataNode.id]
    if(existNode){
        console.error('[tree.js]AddTreeNode failed:node is existed',existNode)

        return
    }
    dataNodeMap[dataNode.id] = dataNode

    let treeNode = {
        id: dataNode.id,
        parent_id: parentNodeId
    }
    treeNodeMap[treeNode.id] = treeNode
    if (parentNodeId) {
        let parentNode = treeNodeMap[parentNodeId]
        if(!parentNode){
             console.error('[tree.js]AddTreeNode failed:parentNode is not exist', parentNodeId)
             delete treeNodeMap[treeNode.id]
             return
        }
        out.AddSubNode(parentNode,treeNode)
    }else{
       
        tree.push(treeNode)
    }

    
}


out.UpdateTreeNode = ({
dataNodeMap
},nodeId,nodeData,delegateAssign)=>{
    if(!nodeId){
        console.error('[tree.js]UpdateTreeNode failed:nodeId is null')
        return
    }

    if (!dataNodeMap[nodeId]){
        console.error('[tree.js]UpdateTreeNode failed:nodeId is notexist',nodeId)
        return
    }

    if (!delegateAssign)
        Object.assign(dataNodeMap[nodeId],nodeData)
    else
        delegateAssign(dataNodeMap[nodeId],nodeData)
}

const deleteNodeTree = ({
            dataNodeMap,
            treeNodeMap,
            tree
        },node)=>{
            if(!node){
                console.error('[tree.js]deleteNodeSubs:node is null')
                return
            }

            if(node.subs){
                node.subs.forEach(v=>{
                    deleteNodeTree({
                        dataNodeMap,
                        treeNodeMap,
                        tree
                    },v)
                })
            }

            
            delete dataNodeMap[node.id]
            delete treeNodeMap[node.id]
        }

out.DeleteTreeNode = ({
        dataNodeMap,
        treeNodeMap,
        tree
    }, nodeId) => {

    if (!nodeId) {
        console.error('[tree.js]DeleteTreeNode failed:nodeId is null')
        return
    }

    let node = treeNodeMap[nodeId]
    if(!node){
       console.error('[tree.js]DeleteTreeNode failed:node is not exist', nodeId)
       delete treeNodeMap[treeNode.id]
       return
    }
    if(node.parent_id){
        let parentNode = treeNodeMap[node.parent_id]
        if (!parentNode || !parentNode.subs || !parentNode.subs.length) {
            console.error('[tree.js]DeleteTreeNode failed:parentNode is not exist', node.parent_id)
            return
        }
        let indexOfSubs = parentNode.subs.findIndex(v => v.id == nodeId)
        if(indexOfSubs != -1)
            parentNode.subs.splice(indexOfSubs, 1)
        else
            console.error('[tree.js]DeleteTreeNode failed:node not in tree root subs', node)
    }else{
        let indexOfTree = tree.findIndex(v=>v.id == nodeId)
        if(indexOfTree != -1){
             tree.splice(indexOfTree,1)
        }else{
            console.error('[tree.js]DeleteTreeNode failed:node.parent_id = null but not in tree root',node)
        }
    }

    deleteNodeTree({
        dataNodeMap,
        treeNodeMap,
        tree
    },
    node)

    console.log('after delete:',dataNodeMap,treeNodeMap,tree)
}

out.GetPath = ({treeNodeMap},nodeId)=>{
    console.log("[tree.js]GetPath:",nodeId)
    if (!nodeId) {
        console.error('[tree.js]GetPath failed:nodeId is null')
        return
    }
     
    let node = treeNodeMap[nodeId]
     if (!node) {
         console.error('[tree.js]GetPath failed:node is not exist', nodeId)
         return
     }

    let path = [nodeId]
    while(node.parent_id){
        path.push(node.parent_id)
        node = treeNodeMap[node.parent_id]
        if(!node){
             console.error('[tree.js]GetPath failed:node.parent is not exist', node.parent_id)
             return
        }
    }

    return path
}


export default out