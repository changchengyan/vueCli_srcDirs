<template>
	<div id="monitor">
		<div class="topHead">
			<div class="leftTabs">
				<span class="tabItem" :class="{actived:index==tabItem_actived}" @click="selectThis(index)" v-for="(item,index) in tabs" :key="index">
                {{item.name}}
            </span>
			</div>
			<span class="goBack" @click="goBack">返回</span>
		</div>
		<div class="contant">
			<template >
				<div class="sumMonitor" v-show="tabItem_actived===0">
					<div class="topSelect-time">
						<span class="marginRight">选择时间：   </span>
						<el-date-picker @change="getThisDate" v-model="NightMinFlowLine.endDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" format="yyyy-MM-dd">
						</el-date-picker>
					</div>
					<div class="chart">
						<IEcharts class="echarts" :resizable="true" :option="NightMinFlowLine" :loading="NightMinFlowLine.loading" @ready="NightMinFlowLine_ready"></IEcharts>
					</div>
				</div>
			</template>
			<template>
				<div class="sumMonitor"  v-show="tabItem_actived===1">
					<div class="topSelect-time">
						<span class="marginRight">选择年: </span>
						<el-date-picker @change="selectYear" v-model="LeakLine.year" type="year" placeholder="选择年" value-format="yyyy" format="yyyy">
						</el-date-picker>
					</div>
					<div class="chart">
						<IEcharts class="echarts" :resizable="true" :option="LeakLine" :loading="LeakLine.loading" @ready="LeakLine_ready"></IEcharts>
					</div>
				</div>
			</template>
			<template>
				<div class="sumMonitor"  v-show="tabItem_actived===2">
					<div class="topSelect-time">
						<span class="marginRight">选择时间：</span>
						<!--<el-select v-model="rulerItem" placeholder="请选择">
                        <el-option v-for="item in selectRuler" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>-->
						<el-date-picker @change="selectDate" v-model="totalFlowLine.warnSdate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" format="yyyy-MM-dd">
						</el-date-picker>
					</div>
					<div class="chart">
						<IEcharts class="echarts" :resizable="true" :option="totalFlowLine" :loading="totalFlowLine.loading" @ready="totalFlowLine_ready"></IEcharts>
					</div>
				</div>
			</template>

		</div>
	</div>
</template>

<script>
	import IEcharts from "vue-echarts-v3/src/full.js";
	import {
		getFlowLineChart,
		getLeakLineChart,
		getNightMinFlow
	} from "@/api/leaktest/monitorWarning";
	export default {
		components: {
			IEcharts
		},
		data() {
			return {
				areaId: "",
				tabs: [{
						name: "夜间最小流量"
					},
					{
						name: "漏损分析"
					},
					{
						name: "累计流量监测"
					}
				],
				tabItem_actived: 0, //激活状态的tab 索引
				selectRuler: [{
					value: '1',
					label: '天'
				}, {
					value: '2',
					label: '月'
				}, {
					value: '3',
					label: '季度'
				}, {
					value: '4',
					label: '年'
				}],
				rulerItem: '',
				dataSelect: "",
				totalFlowLine: {
					warnSdate: "",
					loading: false,
					tooltip: {
						trigger: "axis",
						formatter: function (params) {
                        // var res='<div><p>当前日期：'+params[0].name+'日</p></div>' 
                        var res='' ;						
                        for(var i=0;i<params.length;i++){
                        	if(!params[i].data){
                        		params[i].data = "- -"
                        	}
                         res+='<p>'+params[i].seriesName+'日-'+params[i].name+'时  :  '+params[i].data+'  m³</p>'
                        }
                        return res;
                        },
					},
					legend: {
						bottom: "10%",
						data: []
					},
					grid: {
						top: "5%",
						left: "5%",
						right: "5%",
						bottom: "20%"
					},
					xAxis: {
						type: "category",
						name: "时间",
						boundaryGap: false,
						data: ["0:00", "1:00", "2:00", "3:00", "4:00", "5:00", "6:00", "7:00", "8:00", "9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"]
					},
					yAxis: {
						type: "value",
						name: "(m³)",
						nameLocation: "end"
					},
					color: ["#4dacf5", "#e79a27", "#6bb436"],
					series: [

					]
				},
				NightMinFlowLine: {
					startDate: "",
					endDate: "",
					loading: false,
					tooltip: {
						trigger: "axis",
						formatter: function (params) {
                        // var res='<div><p>当前日期：'+params[0].name+'日</p></div>' 
                        var res='' ;						
                        for(var i=0;i<params.length;i++){
                        	if(!params[i].data){
                        		params[i].data = "- -"
                        	}
                         res+='<p>'+params[i].seriesName+'日-'+params[i].name+'时  :  '+params[i].data+'  m³</p>'
                        }
                        return res;
                        },
					},
					legend: {
						bottom: "10%",
						data: []
					},
					grid: {
						top: "5%",
						left: "5%",
						right: "5%",
						bottom: "20%"
					},
					xAxis: {
						type: "category",
						name: "时间",
						boundaryGap: false,
						data: ["02:00","02:05","02:10","02:15","02:20","02:25","02:30","02:35","02:40","02:45","02:50","02:55","03:00",
							"03:05","03:10","03:15","03:20","03:25","03:30","03:35","03:40","03:45","03:50","03:55","04:00"]
					},
					yAxis: {
						type: "value",
						name: "(m³)",
						nameLocation: "end"
					},
					color: ["#4dacf5", "#e79a27", "#6bb436"],
					series: []
				},
				LeakLine: {
					year: "",
					loading: false,
					 tooltip : {
					 	show:true,
				        trigger: 'axis',
				        formatter: function (params) {
                        // var res='<div><p>当前日期：'+params[0].name+'日</p></div>' 
                        var res='' ;						
                        var unit = "";
                        for(var i=0;i<params.length;i++){
                        	if(!params[i].data){
                        		params[i].data = "- -"
                        	}
                        	if(params[i].seriesName=="平均压力"){
                        		unit = "Mpa"
                        	}else{
                        		unit = "m³"
                        	}
                         res+='<p>'+params[i].name+'-'+params[i].seriesName+'  :  '+params[i].data+unit+'</p>'
                        }
                        return res;
                        },
				    },
					legend: {
						bottom: "10%",
						data: ["供水量", "用水量", "平均压力"]
					},
					grid: {
						top: "5%",
						left: "5%",
						right: "5%",
						bottom: "20%"
					},
					xAxis: {
						type: "category",
						name: "时间",
						boundaryGap: false,
						data: [
							"一月", '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'
						]
					},
					yAxis: [{
						type: "value",
						name: "(m³)",
					},
					{
						type: "value",
						name: "(Mpa)",
					}],
					color: ["#4dacf5", "#e79a27", "#6bb436"],
					series: [{
							name: '供水量',
							type: 'line',

							lineStyle: {
				                normal: {
				                    width: 10
				                }
				            },
							data: [
							]

						},
						{
							name: '用水量',
							type: 'line',
							lineStyle: {
				                normal: {
				                    width: 10
				                }
				            },
							data: [
							]
						}, {
							name: '平均压力',
							yAxisIndex:1,
							type: 'line',
							lineStyle: {
				                normal: {
				                    width: 10,
				                }
				            },
							data: [
							]
						}
					]
				},
				totalFlowLine_instance:null,
				NightMinFlowLine_instance:null,
				LeakLine_instance:null
			}
		},
		methods: {
			selectYear(val) {
				this.LeakLine.year = val;
				this.getLeakLine();
			},
			goBack() {
				this.$router.go(-1)
				this.$store.commit("setAside_status", true);
				this.$emit("showAside");
			},
			selectThis(index) {
				this.tabItem_actived = index;
				// if(this.tabItem_actived == "0"){
				// 	this.LeakLine_instance.clear()
				// 	this.totalFlowLine_instance.clear()
				// 	this.getNightMinFlowData();
				// }
				// if(this.tabItem_actived == "1"){
				// 	this.NightMinFlowLine_instance.clear()
				// 	this.totalFlowLine_instance.clear()
				// 	this.getLeakLine();
				// }
				// if(this.tabItem_actived == "2"){
				// 	this.NightMinFlowLine_instance.clear()
				// 	this.LeakLine_instance.clear()
				// 	this.getFlowLine();
				// }
				
			},
			selectDate(val) {
				this.totalFlowLine.warnSdate = val;
				this.getFlowLine();
			},
			getThisDate(val) {
				this.NightMinFlowLine.endDate = val;
				let curTime = new Date(this.NightMinFlowLine.endDate);
				let startDate = new Date(curTime - (2 * 3600 * 24 * 1000));
				let startYear = startDate.getFullYear()
				let startDonth = (startDate.getMonth() + 1) < 10 ? "0" + (startDate.getMonth() + 1) : (startDate.getMonth() + 1);
				let startDay = (startDate.getDate() + 1) < 10 ? "0" + startDate.getDate() : startDate.getDate();
				this.NightMinFlowLine.startDate = startYear + "-" + startDonth + "-" + startDay;
				this.getNightMinFlowData();
			},
			getLeakLine() {
				let that = this;
				getLeakLineChart({
					"areaId": "" + that.areaId,
					"yearNum": "" + that.LeakLine.year
				}).then(res => {
					if(res.msg == "no user") {
						window.location.href = `${dse.base_api_url}/jump.jsp?jumpUrl=${dse.baseURL}?id=${id}`;
						return;
					}
					if(res.msg == "操作失败") {
						that.$message.error("服务错误!");
						return;
					}
					if(res.status == 1) {
						let LeakLinedata =res.data&& res.data.length > 0 ? res.data : [];
						if(LeakLinedata.length > 0) {
							that.LeakLine.series[0].data = [];
							that.LeakLine.series[1].data = [];
							that.LeakLine.series[2].data = [];
							LeakLinedata.sort(function(x, y) {
								return ~~parseInt(x.monthNum) > ~~parseInt(y.monthNum) ? 1 : -1; //~~去掉数字前面的0
							});


							LeakLinedata.map(item => {
								that.LeakLine.series[0].data.push(item.supply ? item.supply : "");
								that.LeakLine.series[1].data.push(item.use ? item.use : "");
								that.LeakLine.series[2].data.push(item.avgPress ? item.avgPress : "");
							})
						} else {
							that.LeakLine.series[0].data = [];
							that.LeakLine.series[1].data = [];
							that.LeakLine.series[2].data = [];
						}
					} else {
						that.LeakLine.series[0].data = [];
						that.LeakLine.series[1].data = [];
						that.LeakLine.series[2].data = [];
					}
				}).catch(function(error) {
					console.log(error)
				});
			},
			getNightMinFlowData() {
				let that = this;
				getNightMinFlow({
					"areaId": "" + that.areaId,
					"startDate": "" + that.NightMinFlowLine.startDate,
					"endDate": "" + that.NightMinFlowLine.endDate
				}).then(res => {
					if(res.msg == "no user") {
						window.location.href = `${dse.base_api_url}/jump.jsp?jumpUrl=${dse.baseURL}?id=${id}`;
						return;
					}
					if(res.msg == "操作失败") {
						that.$message.error("服务错误!");
						return;
					}
					if(res.status == 1) {
						that.NightMinFlowLine.legend.data = [];
						that.NightMinFlowLine.series = [];
						let data = res.data.length > 0 ? res.data : [];
						if(data.length > 0) {
							data.map(item => {
								that.NightMinFlowLine.legend.data.push(item.dates);
								item.lists = [];
								item.list.map(tab => {
									item.lists.push(tab.minNightFlow);
								})
								that.NightMinFlowLine.series.push({
									name: item.dates,
									type: "line",
									data: item.lists,
									lineStyle: {
						                normal: {
						                    width: 2
						                }
						            },
								})
							})
						}
					} else {
						that.NightMinFlowLine.legend.data = [];
						that.NightMinFlowLine.series = [];
					}
				}).catch(function(error) {
					console.log(error)
				});
			},
			getFlowLine() {
				let that = this;
				getFlowLineChart({
					"areaId": "" + that.areaId,
					"warnSdate": "" + that.totalFlowLine.warnSdate
				}).then(res => {
					if(res.msg == "no user") {
						window.location.href = `${dse.base_api_url}/jump.jsp?jumpUrl=${dse.baseURL}?id=${id}`;
						return;
					}
					if(res.msg == "操作失败") {
						that.$message.error("服务错误!");
						return;
					}
					if(res.status == 1) {
						that.totalFlowLine.legend.data = [];
						that.totalFlowLine.series = [];
						let data = res.data.length > 0 ? res.data : [];
						if(data.length > 0) {
							data.map(item => {
								that.totalFlowLine.legend.data.push(item.dates);
								item.lists = [];
								item.list.map(tab => {
									item.lists.push(tab.supply);
								})
								that.totalFlowLine.series.push({
									name: item.dates,
									type: "line",
									data: item.lists,
									lineStyle: {
						                normal: {
						                    width: 2
						                }
						            },
								})
							})
						}
					} else {
						that.totalFlowLine.legend.data = [];
						that.totalFlowLine.series = [];
					}
				}).catch(function(error) {
					console.log(error)
				});
			},
			NightMinFlowLine_ready(instance){
				this.NightMinFlowLine_instance = instance
			},
			LeakLine_ready(instance){
				this.LeakLine_instance = instance
			},
			totalFlowLine_ready(instance){
				this.totalFlowLine_instance = instance
			}

		},
		created() {
			let that = this;
			that.areaId = that.$route.query.areaId;
			let nowTime = new Date();
			let year = nowTime.getFullYear()
			let month = (nowTime.getMonth() + 1) < 10 ? "0" + (nowTime.getMonth() + 1) : (nowTime.getMonth() + 1);
			let day = (nowTime.getDate() + 1) < 10 ? "0" + nowTime.getDate() : nowTime.getDate();
			this.totalFlowLine.warnSdate = year + "-" + month + "-" + day;
			this.LeakLine.year = "" + year;
			this.NightMinFlowLine.endDate = year + "-" + month + "-" + day;
			let curTime = new Date(this.NightMinFlowLine.endDate);
			let startDate = new Date(curTime - (2 * 3600 * 24 * 1000));
			let startYear = startDate.getFullYear()
			let startDonth = (startDate.getMonth() + 1) < 10 ? "0" + (startDate.getMonth() + 1) : (startDate.getMonth() + 1);
			let startDay = (startDate.getDate() + 1) < 10 ? "0" + startDate.getDate() : startDate.getDate();
			this.NightMinFlowLine.startDate = startYear + "-" + startDonth + "-" + startDay;
			this.getNightMinFlowData();
			this.getFlowLine();
			this.getLeakLine();
		}
	}
</script>

<style lang="scss" scoped>
	#monitor {
		width: 100%;
		height: 100%;
		font-size: 14px;
		color: #333;
		.topHead {
			width: 100%;
			height: 40px;
			display: flex;
			align-items: center;
			position: relative;
			background: #ebebeb;
			.leftTabs {
				width: 400px;
				display: flex;
				justify-content: space-between;
				align-items: center;
				position: absolute;
				bottom: 0;
				left: 50px;
				.tabItem {
					width: 120px;
					padding: 0px 10px;
					background: #fff;
					text-align: center;
					color: #0b82fe;
					line-height: 30px;
					border-top-left-radius: 5px;
					border-top-right-radius: 5px;
					cursor: pointer;
					&.actived {
						background: #0b82fe;
						color: #fff;
					}
				}
			}
			.goBack {
				position: absolute;
				top: 5px;
				right: 20px;
				line-height: 30px;
				padding: 0 20px;
				background: #fe8a01;
				border-radius: 5px;
				color: #fff;
				cursor: pointer;
			}
		}
		.contant {
			width: 100%;
			height: calc(100% - 40px);
			.sumMonitor {
				width: 100%;
				height: 100%;
				.topSelect-time {
					width: 100%;
					height: 80px;
					display: flex;
					justify-content: flex-start;
					align-items: center;
					padding-left: 50px;
					span.marginRight {
						display: inline-block;
						margin-right: 20px;
					}
					.el-select {
						margin-right: 20px;
					}
				}
				.chart {
					width: 100%;
					height: calc(100% - 80px);
				}
			}
		}
	}
</style>