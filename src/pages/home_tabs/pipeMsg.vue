<template>
    <div id="pipeMsg">
        <tabs-underline  @tab_line_index="activedTab" :tabs="tabList" ref="tabsUnderline">
            <template v-if="tabList.list.length>0">
                <template v-if="tabIndex===0">
                    <div class="featureToggle">
                        <div class="tips">
                            <i class="el-icon-view"></i>
                            <span>查看方式</span>
                        </div>
                        <div class="select-tabs">
                            <div class="select-item" :class="{actived:selectFlag}" @click="selectThis">年代</div>
                            <el-select v-model="areaItem" placeholder="区域" @change="handleArea">
                                <el-option v-for="item in areaLists" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                            <el-select v-model="productItem" placeholder="材质" @change="handleProduct">
                                <el-option v-for="item in productLists" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                            <el-select v-model="caliberItem" placeholder="管径" @change="handleCaliber">
                                <el-option v-for="item in caliberLists" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="time-picker"  v-if="selectFlag">
                        <div class="bolls">
                            <div class="translate-wrap">
                                <div class="inner-wrap" :style="{top:topDis+'px'}">
                                    <div class="boll_line"></div>
                                    <div class="time-line" v-for="(item,index) in years" :key='index'>
                                        <template v-if='index==0'>
                                            <div class="time-ball big"></div>
                                        </template>
                                        <template v-else>
                                            <div class="time-ball "></div>
                                        </template>
                                        <div class='years-str' :class="{active:index==activeFlag}" @click="heightLight(index)">{{item}}
                                        </div>
                                    </div>
                                    <div class="last-ball"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="search-wrap">
                        <span>搜索:</span>
                        <el-input type="text" clearable placeholder="请输入管道名称" />
                        <el-button class="defaultShow">搜索</el-button>
                    </div>
                    <div class="export">
                        <el-checkbox v-model="oldChecked">超期使用管道</el-checkbox>
                        <div class="export-button"><span>导出</span></div>
                    </div>
                    <div class="main-table">
                        <table-list :totalNum="totalPages" :currentPage="currentPage">
                            <thead>
                                <tr>
                                    <th><span>管道名称</span></th>
                                    <th><span>管道编号</span></th>
                                    <th><span>管径</span></th>
                                    <th><span>材质</span></th>
                                    <th><span>已用年限(使用寿命)</span></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><span>宁东路管网</span></td>
                                    <td><span>NDGS0001</span></td>
                                    <td><span>DN600</span></td>
                                    <td><span>PE</span></td>
                                    <td><span>39(30)</span></td>
                                </tr>
                                <tr>
                                    <td><span>宁东路管网</span></td>
                                    <td><span>NDGS0001</span></td>
                                    <td><span>DN600</span></td>
                                    <td><span>PE</span></td>
                                    <td><span>39(30)</span></td>
                                </tr>
                            </tbody>
                        </table-list>
                    </div>
                </template>
                <template v-else-if="tabIndex===1">
                    <table class="innerTable">
                        <thead>
                            <tr>
                                <th><span>阀门名称</span></th>
                                <th><span>阀门编号</span></th>
                                <th><span>关联管道编号</span></th>
                                <th><span>规格型号</span></th>
                                <th><span>已用年限(使用寿命)</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><span>1#底阀</span></td>
                                <td><span>NDGS0001</span></td>
                                <td><span>DNGS0001</span></td>
                                <td><span>DN200</span></td>
                                <td><span>39(30)</span></td>
                            </tr>
                            <tr>
                                <td><span>1#底阀</span></td>
                                <td><span>NDGS0001</span></td>
                                <td><span>DNGS0001</span></td>
                                <td><span>DN200</span></td>
                                <td><span>39(30)</span></td>
                            </tr>
                        </tbody>
                    </table>
                </template>
                <template v-else-if="tabIndex===2">
                    <table class="innerTable">
                        <thead>
                        <tr>
                            <th><span>检修井名称</span></th>
                            <th><span>检修井编号</span></th>
                            <th><span>关联管道编号</span></th>
                            <th><span>规格型号</span></th>
                            <th><span>已用年限(使用寿命)</span></th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td><span>1#检修井</span></td>
                            <td><span>NDGS0001</span></td>
                            <td><span>DNGS0001</span></td>
                            <td><span>XF-065</span></td>
                            <td><span>39(30)</span></td>
                        </tr>
                        <tr>
                            <td><span>1#检修井</span></td>
                            <td><span>NDGS0001</span></td>
                            <td><span>DNGS0001</span></td>
                            <td><span>XF-065</span></td>
                            <td><span>39(30)</span></td>
                        </tr>
                        </tbody>
                    </table>
                </template>
                <template v-else-if="tabIndex===3">
                    <table class="innerTable">
                        <thead>
                        <tr>
                            <th><span>消防栓名称</span></th>
                            <th><span>消防栓编号</span></th>
                            <th><span>关联管道编号</span></th>
                            <th><span>规格型号</span></th>
                            <th><span>已用年限(使用寿命)</span></th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td><span>1#消防栓</span></td>
                            <td><span>NDGS0001</span></td>
                            <td><span>DNGS0001</span></td>
                            <td><span>XF-065</span></td>
                            <td><span>39(30)</span></td>
                        </tr>
                        <tr>
                            <td><span>1#消防栓</span></td>
                            <td><span>NDGS0001</span></td>
                            <td><span>DNGS0001</span></td>
                            <td><span>XF-065</span></td>
                            <td><span>39(30)</span></td>
                        </tr>
                        </tbody>
                    </table>
                </template>
            </template>
        </tabs-underline>

    </div>
</template>

<script>
    import TableList from '../../common/components/tableList';
    import TabsUnderline from '../../common/components/tabsUnderline';

    import {
        getDictByPCode,getOrganDictTree
    } from '@/api/interfaces/common_api';

    import {mapGetters} from 'vuex';
    export default {
        name: 'pipeMsg',
        components: {TabsUnderline, TableList},
        data(){
            return{
                areaItem:'',
                areaLists:[],
                productItem:'',
                productLists:[],
                caliberItem:'',
                caliberLists:[],
                selectFlag:false, //年代选取的布尔值
                totalPages:1,
                currentPage:1,
                topDis: 0, // 时间线向上滚动的距离
                activeFlag: null, // 时间轴的激活状态
                tabList:[],
                tabIndex:0, //默认的激活页签
                oldChecked:false, //超期服务 开关
            };
        },
        methods:{
            selectThis(){
                this.selectFlag =  !this.selectFlag;
            },
            handleArea(e){

            },
            handleProduct(e){
                   
            },
            handleCaliber(e){

            },
            //点击获取年代
            heightLight(index) {
                this.activeFlag = index;

                let temp_str = this.years[index];
                let temp_start = temp_str.split('-')[0];
                if (temp_start == '1949以前') {
                    this.selectTime = '1900-1949';
                } else {
                    this.selectTime = this.years[index];
                }
                this.searchPipe();
            },
            searchPipe(){

            },
           
            get_pipe_select(){
                let that = this;
                //构建select
                let buildItem=function(param,temp_arr,callBack){
                 //   location.setLocalStorage('','');
                    getDictByPCode(param,that).then(res => {
                        let arr= res&&res.length?res:[];
                        for(let i=0;i<arr.length;i++){
                            let o = arr[i];
                            temp_arr[i+1] = {label:o.name,value:o.id};
                        }
                        callBack(temp_arr);
                    });
                };

            //    let orgIds = JOSN.parse(window.sessionStorage.getItem('user')).organizationIds; 
                //获取区域
                getOrganDictTree({code: 'CQ',organizationId: '402881d162b284680162b3a41362012a'},that).then(res=>{
                   let arr= res.data&&res.data.length?res.data:[];
                    let temp_arr=[{label: '全部区域',value: ''}];
                        for(let i=0;i<arr.length;i++){
                            let o = arr[i];
                            temp_arr[i+1] = {label:o.name,value:o.id};
                        }
                        that.areaLists = temp_arr;
                });

                //获取材质
                buildItem({pcode: 'pipe_material'},[{label: '全部材质',value: ''}],arr=>{
                    that.productLists = arr;
                });
                //获取管径
                buildItem({pcode: 'pipe_radius'},[{label: '全部管径',value: ''}],arr=>{
                    that.caliberLists = arr;
                });

            },
            activedTab(index){
                this.tabIndex = index;
            },
            fromFather(obj){
                let that = this;
                that.$refs.tabsUnderline.fromFather(obj);
                this.tabList = obj;
                this.tabIndex = obj.currentIndex -1;
            }
        },
        computed: {
            years() {
                let temp_year = new Date().getFullYear();
                let yearStr = String(temp_year);
                let thisFront_year = yearStr.substring(0, yearStr.length - 1);
                thisFront_year = parseInt(thisFront_year + '0');
                let endYear = 1940;
                let D_year = (thisFront_year - endYear) / 10 + 1;
                let temp_list = [];
                for (let i = 0; i < D_year; i++) {
                    temp_list.push(
                        thisFront_year - i * 10 + '-' + (thisFront_year - i * 10 + 9)
                    );
                }
                temp_list.push('1949以前');
                return temp_list;
            },
            ...mapGetters({
                get_sunTab_pipe:'get_sunTab_pipe'
            }),
        },
        created() {
            let that = this;
            this.tabList ={list:that.get_sunTab_pipe,leftIds:[]} ;

            this.get_pipe_select(); 
        }
    };
</script>

<style scoped lang="scss">
    #pipeMsg {
        width: 100%;
        height: 100%;
        tbody{
            td:first-child{
                span{
                    cursor: pointer;
                    text-decoration: underline;
                    color: #0b83fe;
                }
            }
        }

        .featureToggle {
            width: 348px;
            background: #fff;
            padding: 5px;
            z-index: 100;
            .tips {
                line-height: 20px;
                border-bottom: 1px solid #ccc;
            }
            .select-tabs {
                width: 100%;
                height: 40px;
                display: flex;
                justify-content: space-around;
                align-items: center;
                font-size: 14px;
                .select-item {
                    width: 50px; // margin-right: 10px;
                    line-height: 25px;
                    padding: 0 10px;
                    border-radius: 5px;
                    background: #fff;
                    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
                    cursor: pointer;
                    &.small {
                        font-size: 12px;
                        width: 40px;
                        padding: 0;
                        text-align: center;
                        margin-left: 5px;
                    }
                    &.actived {
                        background: #cbf3fc;
                    }
                }
                .el-select {
                    width: 90px !important;
                    &.small {
                        transform: scale(0.8);
                    }
                }
            }
        }
        .time-picker {
            position: absolute;
            top: 0;
            left: -100px;
            width: 100px;
            height: 65%;
            min-height: 327px;
            border: 1px solid #ccccc8; // background: #2f6ca0;
            background: linear-gradient(to top, #428acf, #3d6e9f, #428acf);
            opacity: 0.8;
            z-index: 10000;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            .close {
                position: absolute;
                top: 5px;
                left: 5px;
                z-index: 99;
                display: inline-block;
                width: 14px;
                height: 14px;
                border: 1px solid #fff;
                color: #fff;
                font-size: 12px;
                text-align: center;
                cursor: pointer;
            }
            .bolls {
                width: 100%;
                height: 100%;
                position: relative;
                padding-top: 20px;
                .translate-wrap {
                    width: 100%;
                    height: calc(100% - 20px);
                    position: relative;
                    overflow-y: hidden;
                    .inner-wrap {
                        width: 100%; // padding: 20px 0;
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        justify-content: flex-start;
                        position: absolute;
                        top: 0;
                        left: 0; // z-index: -1;
                        .boll_line {
                            position: absolute;
                            top: 10px;
                            bottom: 20px;
                            left: 50%;
                            height: calc(100%);
                            width: 2px;
                            background: #6090c0;
                            z-index: -10;
                            margin-left: -1px;
                        }
                        .last-ball {
                            cursor: pointer;
                        }
                        .time-line {
                            height: 11.11%; // opacity: 0%;
                            position: relative;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            .years-str {
                                height: 30px;
                                width: 100%;
                                cursor: pointer;
                                text-align: center;
                                line-height: 30px;
                                color: #fff;
                                font-size: 12px;
                                background: url("../../assets/images/home/timeLine_mormal.png");
                                background-repeat: no-repeat;
                                background-position: center center;
                                margin-top: 20px;
                                &.active {
                                    background: url("../../assets/images/home/timeLine_active.png");
                                    background-repeat: no-repeat;
                                    background-position: center center;
                                }
                            }
                        }
                        .time-ball {
                            position: absolute;
                            top: 5px;
                            left: 50%;
                            width: 10px;
                            height: 10px;
                            margin-left: -5px; // margin-top: -5px;
                            background: url("../../assets/images/home/smallBoll.png");
                            background-repeat: no-repeat;
                            background-position: center center;
                            &.big {
                                background: url("../../assets/images/home/bigBoll.png");
                                background-repeat: no-repeat;
                                background-position: center center;
                                cursor: pointer;
                            }
                        }
                    }
                }
            }
            .last-ball {
                height: 10px;
                margin-top: 10px;
                background: url("../../assets/images/home/bigBoll.png");
                background-repeat: no-repeat;
                background-position: center center;
            }
            .yearList {
                width: 100%;
                height: 100%;
                padding: 45% 0;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                .years-item {
                    width: 100%;
                    height: 30px;
                    background: #fff;
                    text-align: center;
                    line-height: 30px;
                }
            }
        }

        .search-wrap{
            width: 100%;
            display: flex;
            justify-content: space-between;
            height: 30px;
            line-height: 30px;
            padding: 0 5px;
            margin-bottom: 10px;
            span{
                display: inline-block;
                width: 40px;
                line-height: 30px;
            }
            .el-input{
                width: calc(100% - 120px);
            }
            .el-button{
                width:60px ;
                padding: 0;
            }
        }
        .export{
            width:100%;
            padding: 5px 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .export-button{
                width: 40px;
                line-height: 20px;
                height: 20px;
                background: #418738;
                color: #fff;
                line-height: 20px;
                text-align: center;
                font-size: 12px;
                cursor: pointer;
            }
        }
        .main-table{
            width: 100%;
            height: calc(100% - 162px);
        }



    }
</style>