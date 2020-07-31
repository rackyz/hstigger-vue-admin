let out = {}

out.ArrayRemove = (arr,cb_finder)=>{
    let index =  arr.findIndex(cb_finder)
    if(index == -1)
        return
    else
        arr.splice(index,1)
}

out.ArrayAdd = (arr,o)=>{
    let index = arr.findIndex(v=>v==o)
    if(index == -1)
        arr.push(o)
}

export default out