import actions from './actions-type'
export default {
    increase({commit,state},data){
        commit(actions.INCREASE, data)

    },
    decrease({commit,state},data){
        commit(actions.DECREASE, data)
    }
}