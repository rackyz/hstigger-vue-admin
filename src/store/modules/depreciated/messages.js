/** vuex store module
 *  name : messages
 *  desc : holding message information in local memory
 */

 const state = {
    /** session
     *     - from
     *     - to 
     *     - replyable (e.g system message)
     *     - content
     *     - last meessage info:
     *          - send time
     *          - desc
     *          - 
     *     - messages(order by date from )
     *          - date
     *          - content
     *          - content type
     */
 }

 const getters = {
    session:(state,id)=>{
        return state.sessions.find(v=>v.id == id)
    }
 }

 const mutations = {

 }

 const actions = {
    /** get data from database */
    getData:(commit)=>{

    }
 }

 module.exports = {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
 }