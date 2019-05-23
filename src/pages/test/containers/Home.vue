<template>
  <div class="hello">
    <poupe :status="status">
      poupe组件
    </poupe>
    <p>{{count}}</p>
    <p>{{modulo}}</p>
    <el-row>
        <el-button type="primary" plain @click="add">增加</el-button>
        <el-button type="info" plain @click="decrement">减少</el-button>
    </el-row>
  </div>
</template>

<script  >
import {mapActions,mapState,mapGetters} from "vuex";
import Poupe from '@/common/components/poupe/Poupe.vue'
export default {
  name: "Test",
  components:{
    Poupe
  },
  data() {
    return {
      status:false,
    };
  },
  computed:{
    ...mapState({
      count: state =>{
        return state.homeStore.count
      }       
    }),
    ...mapGetters({
      modulo:"modulo"
    })
  },
  methods: {
    ...mapActions({
      add:"increase",
      decrement:"decrease"
    })
    
  }
};
</script>
<style  lang="scss" scoped>

</style>
