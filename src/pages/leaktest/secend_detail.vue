<template>
    <div id="secend_detail">
    	<div class="second_detail">
    		<div class="trees">
				<div class="topHead">
					<span>{{zone_name}}</span>
				</div>
				<div class="main-tree">
					<el-tree :data="tree" :props="defaultProps" :expand-on-click-node="false" @node-click="handleNodeClick" default-expand-all highlight-current></el-tree>
				</div>
			</div>
    		<div class="content">
    			<div class="head">
    				<el-date-picker @change="getThisDate" v-model="selectMonth" type="month" placeholder="选择月" value-format="yyyy-MM" format="yyyy-MM">
					</el-date-picker>
					<div class="btn_box">
						<span v-if="!isEdit" class="edit_btn" @click="thisEdit">编辑</span>
						<span v-if="isEdit" class="edit_btn" @click="save">保存</span>
						<span @click="goback">返回</span>
					</div>
    			</div>
    			<div class="parent_box">
    				<div class="row">
						<div class="col"><span>分区名称</span></div>
						<div class="col">
							<span>{{thisZone.name}}</span>
						</div>
						<div class="col"><span>供水量(m³)</span></div>
						<div class="col">
							<span>{{thisZone.supply}}</span>
						</div>
					</div>
					<div class="row">
						<div class="col"><span>非计量水量(m³)</span></div>
						<div class="col">
							<template v-if="isEdit">
								<input v-model="thisZone.uncountWater" type="text"/>
							</template>
							<template v-else>
								<span>{{thisZone.uncountWater}}</span>
							</template>
						</div>
						<div class="col"><span>漏水量(m³)</span></div>
						<div class="col">
							<span>{{thisZone.leakSum}}</span>
						</div>
					</div>
					<div class="row">
						<div class="col"><span>营收水量(m³)</span></div>
						<div class="col">
							<template v-if="isEdit">
								<input v-model="thisZone.useWater" type="text"/>
							</template>
							<template v-else>
								<span>{{thisZone.useWater}}</span>
							</template>
						</div>
						<div class="col"><span>漏损率(%)</span></div>
						<div class="col">
							<span>{{thisZone.leakRate}}</span>
						</div>
					</div>
			
    			</div>
    			<div class="child_box" >
    				<div class="child_title"  v-if="childZoneList.length > 0">
    					子级分区
    				</div>
    				<div class="child_con"  v-if="childZoneList.length > 0">
						<div id="table">
						    <div class="table-wrap">
						        <table>
						             <tr>
					                    <template v-for="(item,index) in tableHead">
					                        <td :key="index">
					                            <span>{{item}}</span>
					                        </td>
					                    </template>
					                </tr>
					                <template v-for="(v,i) in childZoneList" >
					                    <tr :key="i" v-if="childZoneList.length > 0">
					                        <td class="sm"><span>{{i+1}}</span></td>
					                        <td><span>{{v.name}}</span></td>
					                        <td><span>{{v.supply}}</span></td>
					                        <td><span>{{v.uncountWater}}</span></td>
					                        <td><span>{{v.leakSum}}</span></td>
					                        <td><span>{{v.useWater}}</span></td>
					                        <td><span>{{v.leakRate}}</span></td>
					                        <td><span class="detail-btn" @click="edit(v)">编辑</span></td>
					                    </tr>
					                </template>
					                <template v-if="childZoneList.length == 0">
					                	<tr><td class="no_data" colspan="8"><span>暂无数据</span></td></tr>
					                </template>
						        </table>
						    </div>
						</div>
    				</div>
    			</div>
    		</div>  		
    	</div>
    	<zone-Model :showViewModel="showModelFlag" :title="title"  :wd="wd" cht="calc(100% - 40px)" @hiddenSelf="colseModel">
			<div class="zoneInfo">
    				<div class="row">
						<div class="col"><span>非计量水量(m³)</span></div>
						<div class="col"><input type="text" v-model="saveEvent.uncountWater"/></div>						
					</div>
					<div class="row">
						<div class="col"><span>营收水量(m³)</span></div>
						<div class="col"><input type="text" v-model="saveEvent.useWater"/></div>
					</div>			
					
    		</div>
			<div class="buttonBox">
				<span class="cancel_btn" @click="colseModel">取消</span>
				<span @click="confirm">确定</span>
			</div>
		</zone-Model>
    	
    </div>
</template>
<script>
import {
	getSubareaLeakList,
	updateLeakRecord,
	getAreaTree
} from "@/api/leaktest/zoning_leakDetection";
import zoneModel from "@/common/components/poupe/view"
export default {
	components: {
		zoneModel
	},
    data(){
        return{
        	areaId:null,
        	isEdit:false,
        	selectMonth:"",
        	thisYear:"",
        	thisMonth:"",
        	showModelFlag:false,//
        	title:"",
        	wd:"40%",
        	saveEvent:{
        		areaId:"",
        		uncountWater:"",
        		useWater:""
        	},
        	defaultProps: {
				children: 'children',
				label: 'label'
			},
			childZoneList:[],
			thisZone:"",//当前分区
			tableHead:["序号", "分区名称", "供水量(m³)", "非计量水量(m³)","漏水量(m³)","营收水量(m³)","漏损率(%)", "操作"],
			fileList:[],
			tree:[],
			zone_name:""//分区名称
        }
    },
    methods:{
    	handleNodeClick(val) {
    		this.zone_name = val.label;
    		this.areaId = val.id;
    		this.getSubareaLeakListData();
    		this.isEdit = false;
    		// console.log(this.childZoneList,"childZoneList")
		},
        goback(){
            this.$router.go(-1)
        },
        getThisDate(val){
        	this.selectMonth = val;
        	let dateArr = this.selectMonth.split("-");
        	this.thisYear = dateArr[0];
        	this.thisMonth = dateArr[1];
        	this.isEdit = false;
        	this.getSubareaLeakListData();
        },
        thisEdit(){
        	if(this.thisZone.id){
        		this.isEdit = true;
        	}else{
        		this.$message.error("本月没有供水记录!");
        	}
        },
        edit(v){
        	if(v.id){
        		this.showModelFlag = true;
	        	this.saveEvent.areaId = v.id;
	        	this.saveEvent.useWater = v.useWater;
	        	this.saveEvent.uncountWater = v.uncountWater;
        	}else{
        		this.$message.error("本月没有供水记录!");
        	}
        },
        confirm(){
        	let that = this;
        	updateLeakRecord({
    			"data": [{
					"id": "" + this.saveEvent.areaId,
					"uncountWater": parseFloat(this.saveEvent.uncountWater),
					"useWater": parseFloat(this.saveEvent.useWater)
				}]
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
					that.$message.success("保存成功!");
					that.getSubareaLeakListData();
					this.showModelFlag = false;
				} else {
					that.$message.error(res.msg+"!")					
				}
			}).catch(error => {
				console.log(error)
			})
        },
        colseModel(){
        	this.showModelFlag = false;
        },
        save(){
        	let that = this;        	
        	this.saveEvent.areaId = this.thisZone.id;
        	this.saveEvent.useWater = this.thisZone.useWater;
        	this.saveEvent.uncountWater = this.thisZone.uncountWater;
        	updateLeakRecord({
    			"data": [{
					"id": "" + this.saveEvent.areaId,
					"uncountWater": parseFloat(this.saveEvent.uncountWater),
					"useWater": parseFloat(this.saveEvent.useWater)
				}]
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
					that.$message.success("保存成功!");
					that.isEdit = false;
					that.getSubareaLeakListData();
				} else {
					that.$message.error(res.msg+"!")					
				}
			}).catch(error => {
				console.log(error)
			})
        },
//      saveInfo(){
//      	let that = this;
//      	
//      },
        getSubareaLeakListData() {
			let that = this;
			getSubareaLeakList({
				"areaId": "" + that.areaId,
				"yearNum": "" + that.thisYear,
				"monthNum": "" + that.thisMonth
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
					that.thisZone = res.data ? res.data : "";
					that.childZoneList = res.data.children.length > 0 ? res.data.children : [];

				} else {
					that.$message.error(res.msg+"!")
					that.childZoneList = [];
					that.thisZone = "";
				}

			}).catch(error => {
				console.log(error)
			})
		},
		getAreaTreeList() {
			let that = this;
			getAreaTree({
				"companyId": "" + that.companyId
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
					that.tree = res.data.length > 0 ? res.data : [];
				} else {
					that.$message.error(res.msg+"!")
					that.tree = [];
				}

			}).catch(error => {
				console.log(error)
			})
		},
    },
    created(){
    	let that = this;
    	this.areaId = this.$route.query.areaId;
    	this.companyId = this.$route.query.companyId;
    	this.zone_name = this.$route.query.zone_name;
    	let nowTime = new Date();
		let year = nowTime.getFullYear();
		let month = nowTime.getMonth();
		if(month == "0") {
			this.thisYear = year - 1;
			this.thisMonth = 12;
		} else {
			this.thisYear = year;
			this.thisMonth = month;
		}
		this.selectMonth = this.thisYear + "-" + this.thisMonth;
		if(this.areaId){
			this.getSubareaLeakListData();
		}
		this.getAreaTreeList();
    }
    
}
</script>

<style lang="scss" scoped>
#secend_detail{
    width: 100%;
    height: 100%;
    background: #ebebeb;
    padding: 10px;
    .second_detail{
    	width: 100%;
    	height: 100%;
    	display: flex;
		justify-content: space-between;
    	.content{
    		width: calc(100% - 250px);
    		height: 100%;
    		.head{
    			display: flex;
    			justify-content: space-between;
    			height: 30px;
    			margin-bottom: 10px;
    			align-items: center;
    			.btn_box{
    				span{
	    				display: inline-block;
					    padding: 0 10px;
					    background: #fe8a01;
					    color: #fff;
					    border-radius: 4px;
					    cursor: pointer;
					    height: 25px;
					    line-height: 25px;
					    font-size: 14px;
					    margin-left: 10px;
					    &.edit_btn{
					    	background: #0b83fe;
					    }
	    			}
    			}
    			
    		}
    		.parent_box{
    			width: 100%;
				height: 120px;
				margin-bottom: 10px;
				border: 1px solid #c9c9c9;
				border-bottom: none;
				display: flex;
				flex-direction: column;
				background: #fff;
				.row {
				width: 100%;
				height: 40px;
				display: flex;
				justify-content: space-between;
				.col {
					width: 150px;
					border-right: 1px solid #c9c9c9;
					border-bottom: 1px solid #c9c9c9;
					display: flex;
					justify-content: center;
					align-items: center;
					input{
						width:100%;
						height:100%;
						text-align:center;
						border: none;
						&.textRed{
							color: red;
						}
					}
					
					&:last-child {
						border-right: none;
					}
					&:nth-child(even) {
						width: calc(50% - 150px);
						span{
							width: 100%;
							height: 100%;
							line-height: 40px;
							text-align: center;
							background: #ecf5ff;
						}
					}
					&:nth-child(odd) {
						background: #d6fafa;
						font-weight: 600;
						text-align: center;
					}
					&.noborder {
						border-bottom: none;
					}
					.doc {
						margin-right: 10px;
					}
				}
			}
    		}
    		.child_box{
    			width: 100%;
    			height: calc(100% - 170px);
    			background: #fff;
    			border: 1px solid #ccc;
    			.child_title{
    				height: 40px;
    				line-height: 40px;
    				padding-left: 10px;
    				border-bottom: 1px solid #ccc;
    			}
    			.child_con{
    				
    				#table {
					    width: 100%;
					    height: 100%;
					   
					    font-size: 14px;
					    color: #333;
					    .table-wrap{
					        overflow-y: auto;
					        width: 100%;
					        height: calc(100% - 20px);
					    }
					    table {
					        border-spacing: 0;
					        width: 100%;
					        table-layout: fixed;
					        word-break: break-all; 
					        word-wrap: break-word;
					        tr {
					            width: 100%;
					            td {
					            	&:first-child{
					            		width: 50px;
					            	}
					            	&:last-child{
					            		border-right: none;
					            	}
					                border-right: 1px solid #ccc;
					                border-bottom: 1px solid #ccc;
					                text-align: center;
					                // width: 145px;
					               height: 40px;
					                span {
					                    display: block;
					                    width: 100%;
					                    overflow: hidden;
					                    text-overflow: ellipsis;
					                    white-space: nowrap;
					                    height: 35px;
					                    line-height: 35px;
					                    &.detail-btn{
					                    		margin-left: 10px;
					                    	    display: inline-block;
											    width: auto;
											    cursor: pointer;
											    padding: 0 10px;
											    height: 24px;
											    line-height: 24px;
											    border-radius: 3px;
											    border: 1px solid #0b83fe;
											    overflow: inherit;
					                    }
					                }
					                &.btns{
					                    span{
					                        width: 40px;
					                        // padding: px 0;
					                        line-height: 22px;
					                        border:1px solid #0b83fe;
					                        border-radius: 5px;
					                        cursor: pointer;
					                        // margin-right: 20px;
					                        color: #0b83fe;
					                    }
					                }
					                &.actions{
					                    span{
					                        display: inline-block;
					                        // padding: 4px 10px;
					                        width: 50px;
					                        line-height: 22px;
					                        // border:1px solid  #0b83fe;
					                        color: #0b83fe;
					                        cursor: pointer;
					                        border: 1px solid #0b83fe;
					                        margin-right: 5px;
					                        border-radius: 5px;
					                    }
					                }
					            }
					            &:first-child {
					                td {
					                	height: 50px;
					                	font-weight: 600;
					                    background: #e3ecef;
					                    span{
					                    	display: block;
					                    	height: 50px;
					                    	line-height: 50px;
					                    }
					                }
					            }
					        }
					    }
					}
    			}
    		}
    	}
    	.trees {
			width: 240px;
		    height: 100%;
		    background: #fff;
		    padding: 10px;
		    border-radius: 10px;
			.topHead {
				width: 100%;
			    height: 30px;
			    line-height: 30px;
			    font-weight: 600;
			    background: #c4e9f1;
			    text-align: center;
				span {
					display: inline-block;
					width: 100%;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
			.main-tree {
				width: 100%;
			    height: calc(100% - 30px);
			    overflow-y: auto;
			}
		}
    }
    .zoneInfo{
			width: calc(100% - 20px);
			margin: 10px;
			border-top: 1px solid #ccc;
			border-left: 1px solid #ccc;
			border-right: 1px solid #ccc;
			margin: 40px 0;
			.row {
				width: 100%;
				height: 40px;
				display: flex;
				justify-content: space-between;
				.col {
					width: 150px;
					border-right: 1px solid #c9c9c9;
					border-bottom: 1px solid #c9c9c9;
					display: flex;
					justify-content: center;
					align-items: center;
					span{
						&.pipeInfo{
							text-align: start;
						    overflow: hidden;
						    text-overflow: ellipsis;
						    white-space: nowrap;
						    width: 100%;
						    height: 100%;
						    text-align: center;
						    line-height: 40px;
						}
						
					}
					input{
						width:100%;
						height:100%;
						text-align:center;
						border: none;
						&.textRed{
							color: red;
						}
					}
					
					&:last-child {
						border-right: none;
					}
					&:nth-child(even) {
						width: calc(100% - 150px);
					}
					&:nth-child(odd) {
						background: #d6fafa;
						font-weight: 600;
						text-align: center;
					}
					&.noborder {
						border-bottom: none;
					}
					.doc {
						margin-right: 10px;
					}
				}
			}			
		}
		.buttonBox{
				width:100%;	
				height: 80px;
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;
				background: #e3e3e3;
				border-bottom-left-radius:10px ;
				border-bottom-right-radius:10px ;
				span{
					display: inline-block;
				    padding: 0 20px;
				    background: #0b83fe;
				    color: #fff;
				    border-radius: 4px;
				    cursor: pointer;
				    height: 35px;
				    line-height: 35px;
				    font-size: 14px;
				    margin-left: 10px;
				    &.cancel_btn{
				    	background: #ccccce;
				    }
				}
			}
}
</style>

