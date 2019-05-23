export default {
    state: {
       baseget_tabs_activedIndex:0,
       road_weight:[], //路面荷载
       pipe_age:[], //管龄
       pipe_burst_num:[], //爆管次数
       pipe_deep:[], //埋深
       water_quality:[], //管网水质监测主项
       dangerLayer:[], //紧急程度
       repairType:[], //检修类型
       monitor_orderStatus:[], //工单状态
    },
    mutations: {
      set_baseSet_tabs_activedIndex(state,val){
          state.baseget_tabs_activedIndex = val
      },
      set_road_weight(state,val){
        state.road_weight = val
      },
      set_pipe_age(state,val){
        state.pipe_age = val
      },
      set_pipe_burst_num(state,val){
        state.pipe_burst_num = val
      },
      set_pipe_deep(state,val){
        state.pipe_deep = val
      },
      set_water_quality(state,val){
        state.water_quality = val
      },
      set_dangerLayer(state,val){
        state.dangerLayer = val
      },
      set_repairType(state,val){
        state.repairType = val
      },
      set_monitor_orderStatus(state,val){
        state.monitor_orderStatus = val
      }
    },
    actions: {

    },
    getters: {
      get_baseSet_tabs_activedIndex(state){
          return state.baseget_tabs_activedIndex
      },
      get_road_weight(state){
         return state.road_weight 
      },
      get_pipe_age(state){
        return state.pipe_age 
      },
      get_pipe_burst_num(state){
        return  state.pipe_burst_num 
      },
      get_pipe_deep(state){
        return  state.pipe_deep 
      },
      get_water_quality(state){
        return  state.water_quality 
      },
      get_dangerLayer(state){
        return  state.dangerLayer 
      },
      get_repairType(state){
       return  state.repairType 
      },
      get_monitor_orderStatus(state){
        return  state.monitor_orderStatus 
      }
    }
}