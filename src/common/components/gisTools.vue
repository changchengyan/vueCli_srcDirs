<template>
    <div id="gisTools">
        <slot></slot>
        <div class="default-tool">
            <div class="base-layer">
                <el-dropdown @command="handleLayers">
                  <span class="el-dropdown-link">
                   <i class="el-icon-picture-outline"></i> {{layerItem}}<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-for="(item,index) in baseLayerList" :key="index" :command="item.label">{{item.label}}</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            <div class="draw">
                <el-dropdown @command="handleDraw">
                  <span class="el-dropdown-link">
                    <i class="el-icon-picture-outline"></i>{{drawItem}} <i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-for="(item,index) in drawList" :key="index" :command="item.label">{{item.label}}</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'gisTools',
        data(){
            return{
               baseLayerList:[
                   {
                       value: '1',
                       label: '卫星图'
                   },
                   {
                       value: '2',
                       label: '平面图'
                   },
                   {
                       value: '3',
                       label: '地形图'
                   }
               ],
               layerItem:'底图',
               drawList:[
                   {
                       value: '1',
                       label: '描点'
                   },
                   {
                       value: '2',
                       label: '画线'
                   },
                   {
                       value: '3',
                       label: '画面'
                   },
                   {
                       value: '4',
                       label: '清除全部'
                   }
               ],
               drawItem:'绘图'
            };
        },
        methods:{
            handleLayers(label){
               this.layerItem = label;
            },
            handleDraw(label){
                if(label==='清除全部'){
                    this.drawItem = '绘图';
                    return ;
                }
                this.drawItem = label;
            }
        },
        created() {

        }
    };
</script>

<style scoped lang="scss">
  #gisTools{
      height: 30px;
      position: relative;
      display: flex;
      justify-content: flex-start;
      align-items:center;
      box-shadow: 0 0 5px rgba(0,0,0,0.15);
      padding: 0 5px;
      .default-tool{
          display: flex;
          width: 180px;
          justify-content: space-between;
          &>div{
              width: 85px;
           }
          i:first-child{
              display: inline-block;
              margin-right: 3px;
          }
      }
  }
</style>