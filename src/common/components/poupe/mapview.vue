<template>
    <div id="view">

           <div class="model" :style="{width:wd?wd:'50%', height:ht?ht:''}">
               <div class="title">
                   <span>{{title}}</span>
                   <img src="../../../assets/images/common/modelHidden.png" alt="" @click='hiddenSelf'>
               </div>
            <div id="map">
            
            </div>

           </div>
    
    </div>
</template>


<script>

/**
 *     ********************************************
 *     *   title                               X  *
 *     * *****************************************
 *     *                                          *
 *     *                                          *
 *     *           <slot></slot>                  *
 *     *                                          *
 *     *                                          *
 *     *                                          *
 *     *******************************************
 */
export default {
    props: {
        position: String,
        title: String,
        wd: String,
        ht: String,
    },
    data() {
        return {
            map: "",
            lnglat: null,
            place: ""
        };
    },
    watch: {
        position(val) {
            if (val) {
                var result = val.split(",");
                this.map.clearMap();
                var marker = new AMap.Marker({
                    position: new AMap.LngLat(result[0], result[1]) //此处根据页面数据可以直接传入经纬度进行描点
                })
                this.map.add(marker)
            }

        }
    },
    methods: {
        hiddenSelf() {
            var obj = {
                lnglat: this.lnglat,
                place: this.place
            }
            this.$emit('hiddenSelf', obj)
        },
        getAddress(coord) {
            // console.log(coord)
            AMap.plugin('AMap.Geocoder', () => {
                var geocoder = new AMap.Geocoder({
                    // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
                    city: '010'
                })

                var lnglat = [coord.lng, coord.lat]

                geocoder.getAddress(lnglat, (status, result) => {
                    // console.log(status, result)
                    if (status === 'complete' && result.info === 'OK') {
                        // result为对应的地理位置详细信息
                        // console.log(result.regeocode.formattedAddress)
                        this.place = result.regeocode.formattedAddress
                    }
                })
            })
        },



    },
    mounted() {
        this.map = new AMap.Map('map', {//'map-location'是对应页面盒子的id
            resizeEnable: true, //自适应大小
            zoom: 14
        });
        if (this.title == '选择地址') {
            this.map.on('click', (ev) => { //添加点击事件,传入对象名，事件名，回调函数
                // 触发事件的地理坐标，AMap.LngLat 类型
                // console.log(ev)
                this.map.clearMap();
                // console.log(ev)
                this.lnglat = ev.lnglat;
                this.getAddress(this.lnglat)
                var marker = new AMap.Marker({
                    position: new AMap.LngLat(this.lnglat.lng, this.lnglat.lat) //此处根据页面数据可以直接传入经纬度进行描点
                })
                this.map.add(marker)
            })
        }



    },
    destroyed() {
        this.map = null;
    }
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
#view {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.2);
  z-index: 100;
  padding-top: 15%;
  .model {
    width: 100%;
    height: 500px;
    #map {
      width: 100%;
      height: 100%;
    }

    margin: 0 auto;
    border-radius: 10px;
    background: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
    .title {
      height: 40px;
      line-height: 40px;
      text-align: right;
      background: #2a91db;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      font-size: 16px;
      color: #fff;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 15px;
      img {
        width: 16px;
        cursor: pointer;
      }
    }
  }
}
</style>

