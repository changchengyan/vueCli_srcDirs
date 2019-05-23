import actions from './actions-type'
export default {
    [actions.DECREASE](state,data){
        state.count--
    },
    [actions.INCREASE](state,data){
        state.count++
    }
}