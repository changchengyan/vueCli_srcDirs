
<template>
    <div id="liveVideo">
        <template v-if="videoList.length>0&&videoList[0].url!==''">
            <div class="pannel" :style="{width:pannel_width}">
                <div class="pannel-item" :style="{width:item_width}" :id="'video'+i" @click="selectThisVideo(i,v)" :class="{selectedVideo:video_activedIndex==i}" v-for="(v,i) in videoList" :key="i" >
                    <template v-if="v.url!=''">
                        <video :id="'player'+i"  class="video-js vjs-default-skin"  :poster="v.snapUrl"   controls preload="none" autoplay >
                            <source :src="v.url" type="rtmp/flv">
                        </video>
                    </template>
                    <template v-else>
                        <div class="noURL">没有视频源</div>
                    </template>

                </div>
            </div>
            <div class="controllBox">
                <div class="toggleBar" @click="toggleShowCtrl">
                    <i class="el-icon-arrow-left"></i>
                </div>
                <div class="inner-pannel" :style="{width:contr_width}" v-if="show_pannel==true">
                    <div class="able">
                        <div class="topHead">
                            <span>功能</span>
                        </div>
                        <div class="row">
                            <div class="able-item one" :class="{selectScreenNum:screenNum==1}" @click="show(1)" title="一屏"></div>
                            <div class="able-item four" :class="{selectScreenNum:screenNum==4}" @click="show(4)" title="四屏"></div>
                            <div class="able-item nine" :class="{selectScreenNum:screenNum==9}" @click="show(9)" title="九屏"></div>
                            <div class="able-item sixteen" :class="{selectScreenNum:screenNum==16}" @click="show(16)" title="十六屏"></div>
                        </div>
                        <div class="row">
                            <div class="able-item startAll" :class="{ifstart:startAll_flag==true}" @click="all_start" title="全部开始预览"></div>
                            <div class="able-item  stopAll" :class="{ifstop:stopAll_flag==true}" @click="all_stop" title="全部停止预览"> </div>
                        </div>
                        <!-- <div class="row">
                            <div class="able-item mainStream" :class="{stream:streamNum==0}" @click="stream(0)" title="主码流"></div>
                            <div class="able-item sunStream " :class="{stream:streamNum==1}" @click="stream(1)" title="子码流"></div>
                            <div class="able-item xuniStream" :class="{stream:streamNum==2}" @click="stream(2)" title="虚拟码流"></div>
                        </div> -->
                        <div class="row">
                            <div class="able-item getPic" :class="{if_getPic:picFlag==true}" @click="getPic" title="抓图"></div>
                            <div class="able-item fullScreen" :class="{if_fullScreen:fullScreenFlag==true}" @click="fullScreen" title="全屏"> </div>
                        </div>
                    </div>
                    <div class="steeringWheel">
                        <div class="topHead">
                            <span>云台</span>
                        </div>
                        <div class="row">
                            <div class="bg-cicle">
                                <div title="硬件暂不支持" class="inner-cicle" :class="{stopThis:stopItemFlag==true}"></div>
                                <!-- @click="thisDirc(i)" -->
                                <div title="硬件暂不支持" class="sm-cicle-item" :class="{hoverPic:ctrl_dicration_num==i}" v-for="(v,i) in steeringWheel_list" :key="i" :style="{transform: 'rotate('+i*90+'deg)'}"></div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="contr-pannel-item">
                                <!-- title="缩小" -->
                                <span title="硬件暂不支持"  class="sm" :class="{if_sm_flag:sm_flag==true}"></span>
                                <!-- title="放大" -->
                                <span title="硬件暂不支持" class="bg"  :class="{if_bg_flag:bg_flag==true}"></span>
                                <!-- title="聚焦-" -->
                                <span title="硬件暂不支持" class="fucus_reduce" :class="{if_fucus_reduce_flag:fucus_reduce_flag==true}"></span>
                            </div>
                            <div class="contr-pannel-item">
                                <!-- title="聚焦+" -->
                                <span title="硬件暂不支持"   :class="{if_focus_add_flag:focus_add_flag==true}"  class="focus_add" ></span>
                                <!-- title="光圈-"  -->
                                <span title="硬件暂不支持"   :class="{if_light_reduce_flag:light_reduce_flag==true}"  class="light_reduce" ></span>
                                <!-- title="光圈+"   -->
                                <span title="硬件暂不支持"   :class="{if_light_reduce_flag:light_reduce_flag==true}"  class="light_add" ></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <template v-else>
            <div class="distribution_technology">
                <img src="../../assets/images/common/noData.png" alt="">
                <span>暂时没有配置视频！</span>
            </div>
        </template>
    </div>
</template>

<script>

    import videojs from '../../../static/videojs/video';

    import {
        getsnap
    } from '@/api/interfaces/common_api';

    export default {
        props: ['videoList_','viewpart'],
        name:'liveVideo',
        data() {
            return {
                videoList: [],
                copy_videoList: [],
                video_activedIndex: null, //当前选择的视频的索引
                innerVideoList: [], //外部传来的视频列表
                pannel_width: 'calc(100% - 310px)',
                contr_width: '260px',
                steeringWheel_list: [
                    1, 2, 3, 4
                ],
                autoplay: true,
                item_width: '100%',
                liveFlag: true,
                fluent: true,
                screenNum: 1, //当前屏幕的视频数
                startAll_flag: false,
                stopAll_flag: false,
                streamNum: null, //主码流
                picFlag: false,
                fullScreenFlag: false,
                sm_flag: false,
                bg_flag: false,
                fucus_reduce_flag: false,
                focus_add_flag: false,
                light_reduce_flag: false,
                show_pannel: true,
                ctrl_dicration_num: null,
                stopItemFlag: false, // 当前的摄像头停止播放
                current_channel_num: '', //当前通道的number
                videoUrl: 'rtmp://218.95.175.78:10935/hls/stream_1',
                downloadPic_url:'', //将要下载的 摄像快照
            };
        },
        methods: {
            show(num) {
                let that = this;

                // let video_ids = this.get_all_video_id()
                // for (let i = 0; i < video_ids.length; i++) {
                //     let temp_player = videojs(video_ids[i], {}, function () {
                //         this.dispose()
                //     })
                // }

                this.screenNum = num;
                this.video_activedIndex = null;
                let temp_num = parseInt(num);
                this.$store.commit('set_videoCtrol_index',temp_num);

                let lists = JSON.parse(JSON.stringify(that.copy_videoList));
                if (temp_num == 1) {
                    this.videoList = [lists[0]];
                    this.item_width = '100%';

                } else if (temp_num == 4) {
                    this.videoList = lists.slice(0, 4);
                    this.item_width = '50%';
                } else if (temp_num == 9) {
                    this.videoList = lists.slice(0, 9);
                    this.item_width = '33.33%';
                } else {
                    this.videoList = lists;
                    this.item_width = '25%';
                }
                setTimeout(function () {
                    let doms = that.get_all_video_id();
                    for (let i = 0; i < doms.length; i++) {
                        if(that.videoList[i].url!==''){
                             videojs(doms[i], {}, function () {
                                this.on('ended', function () {
                                    this.pause();
                                    this.hide();
                                    this.play();
                                });
                            });
                        }
                        // temp_dom.play()
                    }
                }, 1000);

            },
            onPlayerPlay($event, i) {
                console.log($event);
            },
            all_start() {
                let video_ids = this.get_all_video_id();
                for (let i = 0; i < video_ids.length; i++) {
                    let temp_player = videojs(video_ids[i], {}, function () {
                        this.on('ended', function () {
                            this.pause();
                            this.hide();
                        });
                    });
                    temp_player.play();
                }
            },
            all_stop() {
                let video_ids = this.get_all_video_id();
                for (let i = 0; i < video_ids.length; i++) {
                    let temp_player = videojs(video_ids[i], {}, function () {});
                    temp_player.pause();
                }
            },
            selectThisVideo(i, v) {
                this.video_activedIndex = i;
                this.current_channel_num = v;
                this.downloadPic_url = v.snapUrl;
            },
            stream(num) {
                this.streamNum = num;
            },
            getsnap_(channel) {

                getsnap({
                    channel: channel
                }).then(res => {
                    console.log(res);
                }).catch(error => {
                    console.log(error);
                });
            },
            get_all_video_id() {
                let temp_arr = this.videoList;
                let temp_video_ids = [];
                for (let i = 0; i < temp_arr.length; i++) {
                    temp_video_ids.push('player' + i);
                }
                return temp_video_ids;
            },
            getPic() {
                let num = this.current_channel_num;
                if (!num) {
                    this.$message.error('请选择一个视频!');
                    return;
                }
                let link = this.downloadPic_url;
                window.open(link);
            },
            fullScreen() {
                let temp_index = this.video_activedIndex;
                if (temp_index === null) {
                    this.$message.error('请选择一个视频!');
                    return;
                }
                let temp_dom = 'player' + temp_index;
                let dom = videojs(temp_dom, {}, function () {});
                dom.requestFullscreen();
            },
            toggleShowCtrl() {
                this.show_pannel = !this.show_pannel;
                if (this.show_pannel) {
                    this.pannel_width = 'calc(100% - 310px)';
                } else {
                    this.pannel_width = 'calc(100%)';
                }
            },
            thisDirc(i) {
                this.ctrl_dicration_num = i;
            },
            temp_videoList(arr) {
                if(arr&&arr.length===0){
                    return  [];
                }
                let temp_arr = arr;
                let formate_16 = [];
                for (let i = 0; i < 16; i++) {
                    let temp_json = {};
                    temp_json.snapUrl = '';
                    temp_json.status = '';
                    temp_json.url = '';
                    temp_json.channelName = '';
                    if (i <= temp_arr.length - 1) {
                        temp_json.snapUrl = temp_arr[i].snapUrl;
                        temp_json.status = temp_arr[i].status;
                        temp_json.url = temp_arr[i].url;
                        temp_json.channelName = temp_arr[i].channelName;
                        formate_16.push(temp_json);
                    } else {
                        temp_json.snapUrl = '';
                        temp_json.status = '';
                        temp_json.url = '';
                        temp_json.channelName = '';
                        formate_16.push(temp_json);
                    }

                }
                return formate_16;
            }
        },
        created() {

            let temp_arr = this.videoList_?this.videoList_:[];
            this.copy_videoList = this.temp_videoList(temp_arr);
            if (this.copy_videoList.length > 0) {
                this.videoList = [(this.copy_videoList)[0]];
            }

        },
        mounted() {
            let that = this;
            setTimeout(function () {
                if (that.videoList.length > 0) {
                    if(that.videoList[0].url!=''){
                         videojs('player0', {}, function () {
                            this.on('ended', function () {
                                this.pause();
                                this.hide();
                                this.play();
                            });
                        });
                    }
                    // temp_dom.play()
                }
            }, 1000);
        },
        watch: {
            videoList_: {
                handler(newValue, oldValue) {
                    let video_ids = this.get_all_video_id();
                    for (let i = 0; i < video_ids.length; i++) {
                        if(this.videoList[i].url!==''){
                             videojs(video_ids[i], {}, function () {
                                this.dispose();
                            });
                        }
                    }
                    this.screenNum= this.$store.getters.get_videoPannelIndex;
                    this.video_activedIndex = null;
                    if(  this.screenNum===1){
                        this.item_width = '100%';
                    }
                    this.copy_videoList = this.temp_videoList(newValue);
                    this.videoList =this.copy_videoList.length>0?[(this.copy_videoList)[0]]:[];
                    setTimeout(()=>{
                        if(this.videoList&&this.videoList.length>0&&this.videoList[0].url!==''){

                            videojs('player0', {}, function () {
                                this.on('ended', function () {
                                    this.pause();
                                    this.hide();
                                    this.play();
                                });
                            });
                        }
                    },1500);

                },
                immediate: true,
                deep: true
            },
            viewpart:{
                handler(newValue,oldValue){

                },
                immediate:true
            }
        },
        beforeDestroy(){
            let that  = this;
            let video_ids = this.get_all_video_id();
            for (let i = 0; i < video_ids.length; i++) {
                if(that.videoList[i].url!==''){
                     videojs(video_ids[i], {}, function () {
                        this.dispose();
                    });
                }

            }
        }
    };
</script>

<style lang="scss" scoped>
    #liveVideo {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        background: #fff;
        padding: 10px;

        font-size: 14px;
        color: #333;

        .pannel {
            height: 100%;
            background: #fff;
            border-radius: 10px;
            display: flex;
            flex-wrap: wrap;

            .pannel-item {
                // width: 33.33%;
                background: #000;
                padding: 15px;

                &.selectedVideo {
                    border: 4px solid yellow;
                }

                &>div {
                    width: 100%;
                    height: 100%;

                    .vjs-big-play-button {
                        top: 50%;
                        left: 50%;
                        margin-top: -0.75em;
                        margin-left: -0.75em;
                    }
                }

            }
        }

        .controllBox {
            height: 100%;
            border-radius: 10px;
            position: relative;
            // overflow-y: auto;

            .toggleBar {
                width: 30px;
                line-height: 80px;
                height: 80px;
                position: absolute;
                top: 50%;
                left: -30px;
                border: 1px solid #ccc;
                text-align: center;
                background: #eaeaea;
            }

            .inner-pannel {
                height: 100%;
                background: #eaeaea;
                border-radius: 10px;

                .able {
                    width: 100%;
                    padding: 10px;

                    .topHead {
                        width: 100%;
                        margin-bottom: 10px;
                        font-weight: 600;
                        font-size: 16px;
                    }

                    .row {
                        width: 100%;
                        display: flex;
                        justify-content: flex-start;
                        margin-bottom: 10px;

                        .able-item {
                            width: 40px;
                            height: 40px;
                            line-height: 40px;
                            border: 1px solid #ccc;
                            text-align: center;
                            margin-right: 10px;
                            cursor: pointer;

                            &.one {
                                background: url("../../assets/images/video/one.png") no-repeat;
                                background-size: 100% 100%;
                                background-position: center center;

                                &.selectScreenNum {
                                    background: url("../../assets/images/video/one_select.png") no-repeat;
                                    background-size: 100% 100%;
                                    background-position: center center;
                                }
                            }

                            &.four {
                                background: url("../../assets/images/video/four.png") no-repeat;
                                background-size: 100% 100%;
                                background-position: center center;

                                &.selectScreenNum {
                                    background: url("../../assets/images/video/four_select.png") no-repeat;
                                    background-size: 100% 100%;
                                    background-position: center center;
                                }
                            }

                            &.nine {
                                background: url("../../assets/images/video/nine.png") no-repeat;
                                background-size: 100% 100%;
                                background-position: center center;

                                &.selectScreenNum {
                                    background: url("../../assets/images/video/nine_select.png") no-repeat;
                                    background-size: 100% 100%;
                                    background-position: center center;
                                }
                            }

                            &.sixteen {
                                background: url("../../assets/images/video/sixteen.png") no-repeat;
                                background-size: 100% 100%;
                                background-position: center center;

                                &.selectScreenNum {
                                    background: url("../../assets/images/video/sixteen_select.png") no-repeat;
                                    background-size: 100% 100%;
                                    background-position: center center;
                                }
                            }

                            &.startAll {
                                background: url("../../assets/images/video/all_start.png") no-repeat;
                                background-size: 100% 100%;
                                background-position: center center;

                                &.ifstart {
                                    background: url("../../assets/images/video/all_start_select.png") no-repeat;
                                    background-size: 100% 100%;
                                    background-position: center center;
                                }
                            }

                            &.stopAll {
                                background: url("../../assets/images/video/all_stop.png") no-repeat;
                                background-size: 100% 100%;
                                background-position: center center;

                                &.ifstop {
                                    background: url("../../assets/images/video/all_stop_select.png") no-repeat;
                                    background-size: 100% 100%;
                                    background-position: center center;
                                }
                            }

                            &.mainStream {
                                background: url("../../assets/images/video/mian_stream.png") no-repeat;
                                background-size: 100% 100%;
                                background-position: center center;

                                &.stream {
                                    background: url("../../assets/images/video/mian_stream_hover.png") no-repeat;
                                    background-size: 100% 100%;
                                    background-position: center center;
                                }
                            }

                            &.sunStream {
                                background: url("../../assets/images/video/sun_stream.png") no-repeat;
                                background-size: 100% 100%;
                                background-position: center center;

                                &.stream {
                                    background: url("../../assets/images/video/sun_stream_hover.png") no-repeat;
                                    background-size: 100% 100%;
                                    background-position: center center;
                                }
                            }

                            &.xuniStream {
                                background: url("../../assets/images/video/xuni_stream.png") no-repeat;
                                background-size: 100% 100%;
                                background-position: center center;

                                &.stream {
                                    background: url("../../assets/images/video/xuni_stream_hover.png") no-repeat;
                                    background-size: 100% 100%;
                                    background-position: center center;
                                }
                            }

                            &.getPic {
                                background: url("../../assets/images/video/getPic.png") no-repeat;
                                background-size: 100% 100%;
                                background-position: center center;

                                &.if_getPic {
                                    background: url("../../assets/images/video/getPic_hover.png") no-repeat;
                                    background-size: 100% 100%;
                                    background-position: center center;
                                }
                            }

                            &.fullScreen {
                                background: url("../../assets/images/video/fullScreen.png") no-repeat;
                                background-size: 100% 100%;
                                background-position: center center;

                                &.if_fullScreen {
                                    background: url("../../assets/images/video/fullScreen_hover.png") no-repeat;
                                    background-size: 100% 100%;
                                    background-position: center center;
                                }
                            }
                        }

                    }

                }

                .steeringWheel {
                    width: 100%;
                    padding: 0 10px;

                    .topHead {
                        width: 100%;
                        margin-bottom: 30px;
                        font-weight: 600;
                        font-size: 16px;

                        span {
                            line-height: 30px;
                        }
                    }

                    .row {
                        width: 100%;

                        .bg-cicle {
                            width: 200px;
                            height: 200px;
                            border-radius: 50%;
                            margin: 0 auto;
                            position: relative;
                            margin-bottom: 30px;

                            // background: -webkit-radial-gradient(#b9b9b9 70%,#8e8f91 30%  ); /* Safari 5.1 - 6.0 */
                            // background: -o-radial-gradient(#b9b9b9 70%,#8e8f91 30%); /* Opera 11.6 - 12.0 */
                            // background: -moz-radial-gradient#b9b9b9 70%,(#8e8f91 30%); /* Firefox 3.6 - 15 */
                            // background: radial-gradient(#b9b9b9 70%,#8e8f91 30%); /* 标准的语法 */
                            background: #b9b9b9;
                            box-shadow: 0px 0px 20px #8e8f91 inset;

                            .inner-cicle {
                                width: 100px;
                                height: 100px;
                                border-radius: 50%;
                                // background: green;
                                position: absolute;
                                top: 50%;
                                left: 50%;
                                margin-top: -50px;
                                margin-left: -50px;
                                background: url("../../assets/images/video/stop.png") no-repeat;
                                background-size: 100% 100%;
                                background-position: center center;

                                cursor: not-allowed;

                                &.stopThis {
                                    color: #fff;
                                    background: url("../../assets/images/video/stop_hover.png") no-repeat;
                                    background-size: 100% 100%;
                                    background-position: center center;
                                }
                            }

                            .sm-cicle-item {
                                width: 40px;
                                height: 40px;
                                border-radius: 50%;
                                background: url("../../assets/images/video/dirction.png") no-repeat;
                                background-size: 100% 100%;
                                background-position: center center;
                                position: absolute;
                                margin-top: -20px;
                                margin-left: -20px;
                                color: #333;
                                line-height: 40px;
                                text-align: center;
                                left: 50%;
                                // cursor: pointer;
                                cursor: not-allowed;

                                &.hoverPic {
                                    background: #000;
                                    color: #fff;
                                    background: url("../../assets/images/video/dirction_select.png") no-repeat;
                                    background-size: 100% 100%;
                                    background-position: center center;
                                }

                                &:not(:first-child) {
                                    transform-origin: 20px 120px;
                                }

                            }

                        }

                        .contr-pannel-item {
                            width: 140px;
                            margin: 0 auto;

                            display: flex;
                            justify-content: center;
                            margin-bottom: 10px;

                            span {
                                display: inline-block;
                                width: 40px;
                                height: 40px;
                                margin-right: 10px;
                                background: green;
                                line-height: 40px;
                                text-align: center;
                                color: #fff;
                                // cursor: pointer;
                                cursor: not-allowed;

                                &:last-child {
                                    margin-right: 0;
                                }

                                &.sm {
                                    background: url("../../assets/images/video/sm.png") no-repeat;
                                    background-size: 100% 100%;
                                    background-position: center center;

                                    &.if_sm_flag {
                                        background: url("../../assets/images/video/sm_hover.png") no-repeat;
                                        background-size: 100% 100%;
                                        background-position: center center;
                                    }
                                }

                                &.bg {
                                    background: url("../../assets/images/video/bg.png") no-repeat;
                                    background-size: 100% 100%;
                                    background-position: center center;

                                    &.if_bg_flag {
                                        background: url("../../assets/images/video/bg_hover.png") no-repeat;
                                        background-size: 100% 100%;
                                        background-position: center center;
                                    }
                                }

                                &.fucus_reduce {
                                    background: url("../../assets/images/video/focus_reduce.png") no-repeat;
                                    background-size: 100% 100%;
                                    background-position: center center;

                                    &.if_fucus_reduce_flag {
                                        background: url("../../assets/images/video/focus_reduce_hover.png") no-repeat;
                                        background-size: 100% 100%;
                                        background-position: center center;
                                    }
                                }

                                &.focus_add {
                                    background: url("../../assets/images/video/focus_add.png") no-repeat;
                                    background-size: 100% 100%;
                                    background-position: center center;

                                    &.if_focus_add_flag {
                                        background: url("../../assets/images/video/focus_add_hover.png") no-repeat;
                                        background-size: 100% 100%;
                                        background-position: center center;
                                    }
                                }

                                &.light_reduce {
                                    background: url("../../assets/images/video/light_reduce.png") no-repeat;
                                    background-size: 100% 100%;
                                    background-position: center center;

                                    &.if_light_reduce_flag {
                                        background: url("../../assets/images/video/light_reduce_hover.png") no-repeat;
                                        background-size: 100% 100%;
                                        background-position: center center;
                                    }
                                }

                                &.light_add {
                                    background: url("../../assets/images/video/light_add.png") no-repeat;
                                    background-size: 100% 100%;
                                    background-position: center center;

                                    &.if_light_reduce_flag {
                                        background: url("../../assets/images/video/light_add_hover.png") no-repeat;
                                        background-size: 100% 100%;
                                        background-position: center center;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        .topHead {
            border-bottom: 1px solid #ddd;
            margin-bottom: 30px;

            span {
                line-height: 30px;
            }
        }

        .distribution_technology{
            width:100%;
            height:100%;
            display:flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            span{
                display:inline-block;
                padding-top: 20px;
                font-size: 16px;
                font-weight: 600;
            }
        }

        .noURL{
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: #fff;
            font-weight: 600;
        }


    }
</style>
