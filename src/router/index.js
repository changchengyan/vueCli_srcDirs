import Vue from 'vue'
import VueRouter from 'vue-router'
import { basePath } from '@/common/config/pathConfig'
Vue.use(VueRouter);

// let routes = [
//     // {
//     //     path: "/",
//     //     redirect: "/pipe/pipeNet_route"
//     // },
//     {
//         path: '/pipe/pipeNet_route', //管网信息管理 侧边菜单
//         component: resolve => require(['@/pages/pipeNet_msg/menu'], resolve),
//         name: 'pipeNet_route',
//         redirect: '/pipe/pipeNet_route/pipeNet_home',
//         children: [{
//             path: '/pipe/pipeNet_route/pipeNet_home', //管网信息管理 首页 跳转页
//             component: resolve => require(['@/pages/pipeNet_msg/index'], resolve),
//             name: 'pipeNet_home'
//         }, {
//             path: '/pipe/pipeNet_route/pipeNet_home_group', //管网信息管理 跳转到集团页 
//             component: resolve => require(['@/pages/pipeNet_msg/group'], resolve),
//             name: 'pipeNet_home_group'
//         },
//         {
//             path: '/pipe/pipeNet_route/pipeNet_home_city',//管网信息管理 跳转到城市页
//             component: resolve => require(['@/pages/pipeNet_msg/city'], resolve),
//             name: 'pipeNet_home_city'
//         },
//         {
//             path: '/pipe/pipeNet_route/pipeNet_home_city_editNotify',//管网信息管理 城市页面编辑通知
//             component: resolve => require(['@/pages/pipeNet_msg/city_EditNotify'], resolve),
//             name: 'pipeNet_home_city_EditNotify'
//         },
//         {
//             path: '/pipe/pipeNet_route/pipeNet_home_city_edit',//管网信息管理 城市页面编辑页
//             component: resolve => require(['@/pages/pipeNet_msg/editNews'], resolve),
//             name: 'pipeNet_home_city_editNews'
//         },
//         {
//             path: '/pipe/pipeNet_route/pipeNet_newsItem',//管网信息管理 单条新闻信息
//             component: resolve => require(['@/pages/pipeNet_msg/newsItem'], resolve),
//             name: 'pipeNet_newsItem'
//         },
//         {
//             path: '/pipe/pipeNet_route/pipeNet_msg_2d', //管网信息管理 管网综合信息 2d
//             component: resolve => require(['@/pages/pipeNet_msg/msg_2d'], resolve),
//             name: 'pipeNet_msg_2d'
//         },
//         {
//             path: '/pipe/pipeNet_route/pipeNet_msg_3d', //管网信息管理 管网综合信息 3d
//             component: resolve => require(['@/pages/pipeNet_msg/msg_3d'], resolve),
//             name: 'pipeNet_msg_3d'
//         },
//         {
//             path: '/pipe/pipeNet_route/pipeNet_msg/pdfView', //管网信息管理 管网综合信息 预览pdf
//             component: resolve => require(['@/pages/pipeNet_msg/preview'], resolve),
//             name: 'pdfView'
//         },
//         {
//             path: '/pipe/pipeNet_route/pipeNet_msgAnalysis', //管网信息管理  管网信息统计
//             component: resolve => require(['@/pages/pipeNet_msg/msg_analysis'], resolve),
//             name: 'pipeNet_msgAnalysis'
//         },
//         {
//             path: '/pipe/pipeNet_route/pipeNet_bagUser_manage',  //管网信息管理  大用户管理
//             component: resolve => require(['@/pages/pipeNet_msg/bagUser_manage'], resolve),
//             name: 'pipeNet_bagUser_manage'
//         }, {
//             path: '/pipe/pipeNet_route/pipeNet_waterInformation', //管网信息管理  大用户用水信息
//             component: resolve => require(['@/pages/pipeNet_msg/waterInformation'], resolve),
//             name: 'pipeNet_waterInformation'
//         }, {
//             path: '/pipe/pipeNet_route/pipeNet_waterInformation/infoTable', //管网信息管理   大用户用水信息  分析表格
//             component: resolve => require(['@/pages/pipeNet_msg/infoTable'], resolve),
//             name: 'infoTable'
//         },
//         {
//             path: '/pipe/pipeNet_route/fireAnalysis', //管网信息管理 消防分析
//             component: resolve => require(['@/pages/pipeNet_msg/fireAnalysis'], resolve),
//             name: 'fireAnalysis'
//         }
//         ]
//     },
//     {
//         path: '/pipe/monitor', //管网监测管理
//         redirect: '/pipe/monitor/surver',
//         component: resolve => require(['@/pages/monitor/menu'], resolve),
//         children: [{
//             path: '/pipe/monitor/surver', //管网监测
//             component: resolve => require(['@/pages/monitor/surver'], resolve),
//             name: 'pipe_monitor_surver'
//         }, {
//             path: '/pipe/monitor/earlyWarning', // 预警信息
//             component: resolve => require(['@/pages/monitor/earlyWarning'], resolve),
//             name: 'pipe_monitor_earlyWarning'
//         },
//         {
//             path: '/pipe/monitor/waterStatiastics',  // 水量水质统计
//             component: resolve => require(['@/pages/monitor/waterStatiastics'], resolve),
//             name: 'pipe_monitor_waterStatiastics'
//         },
//         {
//             path: '/pipe/monitor/waterAge_simulate',  // 水龄在线模拟
//             component: resolve => require(['@/pages/monitor/waterAgeSimulate'], resolve),
//             name: 'pipe_monitor_waterAgeSimulate'
//         },
//         {
//             path: '/pipe/monitor/burstingRisk_analysis',  // 爆管风险分析
//             component: resolve => require(['@/pages/monitor/burstingRiskAnalysis'], resolve),
//             name: 'pipe_monitor_burstingRiskAnalysis'
//         },
//         {
//             path: '/pipe/monitor/leaktest',  // 分区漏损
//             component: resolve => require(['@/pages/monitor/leaktest'], resolve),
//             name: 'pipe_monitor_leaktest'
//         },
//         {
//             path: '/pipe/monitor/baseSet',  // 基础设置
//             component: resolve => require(['@/pages/monitor/baseSet'], resolve),
//             name: 'pipe_monitor_baseSet',
//         },
//         {
//             path: '/pipe/monitor/addBase',  // 基础设置 新增
//             component: resolve => require(['@/pages/monitor/addBase'], resolve),
//             name: 'pipe_monitor_addBase'
//         },
//         {
//             path: '/pipe/monitor/dispatch',
//             component: resolve => require(['@/pages/monitor/dispatch'], resolve),
//             name: 'pipe_monitor_dispatch'
//         }
//         ]
//     },
//     {
//         path: '/pipe/leaktest', //分区计量检漏管理
//         redirect: '/pipe/leaktest/zoning_leakDetection',
//         component: resolve => require(['@/pages/leaktest/menu'], resolve),
//         children: [
//             {
//                 path: '/pipe/leaktest/zoning_leakDetection',  //分区计量检漏
//                 component: resolve => require(['@/pages/leaktest/zoning_leakDetection'], resolve),
//                 name: 'pipe_leaktest_zoning_leakDetection'
//             },
//             {
//                 path: '/pipe/leaktest/zoning_map',  //分区地图
//                 component: resolve => require(['@/pages/leaktest/zoningMap'], resolve),
//                 name: 'pipe_leaktest_zoning_map'
//             },
//             {
//                 path: '/pipe/leaktest/lastZoning_map',  //第三级 分区地图 也就是最后一级
//                 component: resolve => require(['@/pages/leaktest/lastZoningMap'], resolve),
//                 name: 'pipe_leaktest_lastZoning_map'
//             },
//             {
//                 path: '/pipe/leaktest/secend_detail',  // 二级分区地图 进入详情
//                 component: resolve => require(['@/pages/leaktest/secend_detail'], resolve),
//                 name: 'pipe_leaktest_secend_detail'
//             },
//             {
//                 path: '/pipe/leaktest/three_detail',  //三级分区地图 进入详情
//                 component: resolve => require(['@/pages/leaktest/three_detail'], resolve),
//                 name: 'pipe_leaktest_three_detail'
//             },

//             {
//                 path: '/pipe/leaktest/zoning_tree',  //分区树
//                 component: resolve => require(['@/pages/leaktest/zoningTree'], resolve),
//                 name: 'pipe_leaktest_zoning_tree'
//             },
//             {
//                 path: '/pipe/leaktest/monitorWarning',//监测预警
//                 component: resolve => require(['@/pages/leaktest/monitorWarning'], resolve),
//                 name: 'pipe_leaktest_monitorWarning'
//             },
//             {
//                 path: '/pipe/leaktest/monitor_chart',//监测预警图表
//                 component: resolve => require(['@/pages/leaktest/monitor_chart'], resolve),
//                 name: 'pipe_leaktest_monitor_chart'
//             },
//             {
//                 path: '/pipe/leaktest/partitionConfig', //分区配置
//                 component: resolve => require(['@/pages/leaktest/partitionConfig'], resolve),
//                 name: 'pipe_leaktest_partitionConfig'
//             }
//         ]
//     },
//     {
//         path: '/pipe/rushrepair', //管网巡检抢修管理
//         redirect: '/pipe/rushrepair/information',
//         component: resolve => require(['@/pages/rushrepair/menu'], resolve),
//         children: [{
//             path: '/pipe/rushrepair/information', //综合信息
//             component: resolve => require(['@/pages/rushrepair/information'], resolve),
//             name: 'pipe_rushrepair_information',
//             meta: ["show"]
//         },
//         {
//             path: '/pipe/rushrepair/plan', //巡检计划定制
//             component: resolve => require(['@/pages/rushrepair/makePlan'], resolve),
//             name: 'pipe_rushrepair_plan'
//         },
//         {
//             path: '/pipe/rushrepair/record', //巡检计划记录
//             component: resolve => require(['@/pages/rushrepair/record'], resolve),
//             name: 'pipe_rushrepair_record',
//         },
//         {
//             path: '/pipe/rushrepair/piperepair', //巡检抢修
//             component: resolve => require(['@/pages/rushrepair/pipeRepair'], resolve),
//             name: 'pipe_rushrepair_piperepair',
//         },
//         {
//             path: '/pipe/rushrepair/edit', //富文本编辑
//             component: resolve => require(['@/pages/rushrepair/edit'], resolve),
//             name: 'pipe_rushrepair_edit',
//         },
//         {
//             path: '/pipe/rushrepair/hiddenDanger',//隐患管理
//             component: resolve => require(['@/pages/rushrepair/hiddenDanger'], resolve),
//             name: 'pipe_rushrepair_hiddenDanger',
//             meta: ["show"]
//         },
//         {
//             path: "/pipe/rushrepair/form",//表单管理
//             component: resolve => require(['@/pages/rushrepair/form'], resolve),
//             name: 'pipe_rushrepair_form',
//         },
//         {
//             path: '/pipe/rushrepair/repair',//检修管理
//             component: resolve => require(['@/pages/rushrepair/repair'], resolve),
//             name: 'pipe_rushrepair_repair',
//             meta: ["show"]
//         },
//         {
//             path: '/pipe/rushrepair/workOrder',//检修管理  新增派工单
//             component: resolve => require(['@/pages/rushrepair/workOrder'], resolve),
//             name: 'pipe_rushrepair_workOrder',
//         },
//         {
//             path: '/pipe/rushrepair/print', //巡检抢修 订单打印的包裹文件
//             component: resolve => require(['@/pages/rushrepair/printOrder_wrap'], resolve),
//             name: 'pipe_rushrepair_print'
//         },
//         {
//             path: '/pipe/rushrepair/statistic',//统计管理
//             component: resolve => require(['@/pages/rushrepair/statistic'], resolve),
//             name: 'pipe_rushrepair_statistic',
//             meta: ["show"],
//             redirect: "/pipe/rushrepair/statistic/routing_statistic",
//             children: [
//                 {
//                     path: '/pipe/rushrepair/statistic/routing_statistic',//巡检统计
//                     component: resolve => require(['@/pages/rushrepair/routing_statistic'], resolve),
//                     name: 'pipe_rushrepair_statistic_routing_statistic',
//                 },
//                 {
//                     path: '/pipe/rushrepair/statistic/performance',//绩效统计
//                     component: resolve => require(['@/pages/rushrepair/performance'], resolve),
//                     name: 'pipe_rushrepair_statistic_performance',
//                 }
//             ]
//         }]
//     },
//     {
//         path: '/pipe/pipeNet_route/gisFrame_msg_pipe', //管网信息综合 综合信息 中的 gis 管网弹窗
//         component: resolve => require(['@/gisFrame/pipeNet_msg/msg_pipe'], resolve),
//         name: 'pipe_pipeNet_msg_pipe'
//     },
//     {
//         path: '/pipe/pipeNet_route/gisFrame_msg_proArea', //管网信息综合 综合信息 中的 gis 再建工程弹窗
//         component: resolve => require(['@/gisFrame/pipeNet_msg/proArea'], resolve),
//         name: 'pipe_pipeNet_msg_proArea'
//     },
//     {
//         path: '/pipe/pipeNet_route/gisFrame_msg_xfs', //管网信息综合 综合信息 中的 gis 消防栓弹窗
//         component: resolve => require(['@/gisFrame/pipeNet_msg/msg_xfs'], resolve),
//         name: 'pipe_pipeNet_msg_xfs'
//     }, {
//         path: '/pipe/pipeNet_route/gisFrame_msg_fm', //管网信息综合 综合信息 中的 gis 阀门弹窗
//         component: resolve => require(['@/gisFrame/pipeNet_msg/msg_fm'], resolve),
//         name: 'pipe_pipeNet_msg_fm'
//     },
//     {
//         path: '/pipe/pipeNet_route/gisFrame_bigUser_manage', //管网信息综合 大用水户管理中的 gis 管网弹窗
//         component: resolve => require(['@/gisFrame/pipeNet_msg/bigUser_manage'], resolve),
//         name: 'pipe_pipeNet_bigUser_manage'
//     },
//     {
//         path: '/pipe/rushrepair/gisFrame_plan_area', //巡检抢修 巡检计划定制 中的 gis 区域弹窗
//         component: resolve => require(['@/gisFrame/rushrepair/makePlan_area'], resolve),
//         name: 'pipe_rushrepair_makePlan_area'
//     },
//     {
//         path: '/pipe/rushrepair/gisFrame_plan_point', //巡检抢修 巡检计划定制 中的 gis 签到点弹窗
//         component: resolve => require(['@/gisFrame/rushrepair/makePlan_point'], resolve),
//         name: 'pipe_rushrepair_makePlan_point'
//     },
//     {
//         path: '/pipe/rushrepair/gisFrame_danger_point', //巡检抢修  综合信息中 管网抢修的 gis 隐患点弹窗
//         component: resolve => require(['@/gisFrame/rushrepair/danger'], resolve),
//         name: 'pipe_rushrepair_danger'
//     },
//     {
//         path: '/pipe/rushrepair/gisFrame_rodeReform', //巡检抢修  综合信息中 管网抢修的 gis 道路改造弹窗
//         component: resolve => require(['@/gisFrame/rushrepair/rodeReform'], resolve),
//         name: 'pipe_rushrepair_rodeReform'
//     },
//     {
//         path: '/pipe/rushrepair/print_order', //巡检抢修 订单打印
//         component: resolve => require(['@/printIframe/order'], resolve),
//         name: 'pipe_rushrepair_print_order'
//     },
//     {
//         path: '/pipe/monitor/gisFrame_monitor_pressAndFlow', //管网监测 中正常的水压和水流
//         component: resolve => require(['@/gisFrame/mointor/surver_pressAndFlow'], resolve),
//         name: 'pipe_monitor_surver_pressAndFlow'
//     },
//     {
//         path: '/pipe/monitor/gisFrame_monitor_waterQc', //管网监测中 正常的水质
//         component: resolve => require(['@/gisFrame/mointor/surver_waterQc'], resolve),
//         name: 'pipe_monitor_surver_waterQc'
//     },
//     {
//         path: '/pipe/monitor/gisFrame_leaktest_waterPress', //  分区漏损  的 水压的弹窗
//         component: resolve => require(['@/gisFrame/leaktest/press'], resolve),
//         name: 'pipe_monitor_leaktest_waterPress'
//     },//     {
//         path: '/pipe/monitor/gisFrame_leaktest_waterFlow', //分区漏损  的 水流的弹窗
//         component: resolve => require(['@/gisFrame/leaktest/flow'], resolve),
//         name: 'pipe_monitor_leaktest_waterFlow'
//     },
//     {
//         path: '/pipe/monitor/gisFrame_monitor_errorPoint', //管网监测中 有问题的水质 水压和水流 
//         component: resolve => require(['@/gisFrame/mointor/surver_error_point'], resolve),
//         name: 'pipe_monitor_surver_errorPoint'
//     },
//     {
//         path: '/pipe/monitor/gisFrame_monitor_leaktest', //管网监测中 分区漏损 gis弹窗
//         component: resolve => require(['@/gisFrame/mointor/leaktest'], resolve),
//         name: 'pipe_monitor_gis_leaktest'
//     },
//     {
//         path: '*',
//         component: resolve => require(['@/pages/404'], resolve),
//         name: 'noFound'
//     }
// ]

let routes=[];


let router = new VueRouter({
    mode: 'hash',
    base: basePath,
    routes
})

// router.beforeEach((route, redirect, next) => {
//     let getSession = sessionStorage.getItem("user");
//     if (!getSession) {
//         window.location.href = `${dse.base_api_url}/jump.jsp?jumpUrl=${dse.baseURL}`
//         return;
//     } else {
//         if (route.name) {
//             next()
//         } else {
//             next({ name: 'noFound' })
//         }
//     }
// }
// );

export default router

