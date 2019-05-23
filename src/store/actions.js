import actions from './actions-type'
export default {
    handleMenuShow({commit,state},data){
        commit(actions.MENUSHOW, data)
    }
}