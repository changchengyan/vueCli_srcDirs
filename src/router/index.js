import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

let routes = [{
    path:'/',
    component:()=>import('@/pages/init') // 初始化数据
  },
  {
    path:'/mainContent',
    component:()=>import('@/pages/mainContent'),//主要内容包裹器
    name:'mainContent',
    children:[
      {
        path:'/',
        redirect:'/home'
      },
      {
        path:'/home',
        component:()=>import('@/pages/home'),//首页
        name:'home',
        meta:{
          index:1
        }
      },
      {
        path:'/pipeMonitor/changeShifts',
        component:()=>import('@/pages/pipeMonitor/changeShifts'),  //管网巡检  交接班
        name:'changeShifts',
        meta:{
          index:2
        }
      },
      {
        path:'/pipeMonitor/monitorRecord',
        component:()=>import('@/pages/pipeMonitor/monitorRecord'), //管网巡检  巡检记录
        name:'dutyRecord',
        meta:{
          index:3
        }
      },
      {
        path:'/pipeMonitor/dutyRecord',
        component:()=>import('@/pages/pipeMonitor/dutyRecord'),  //管网巡检  值班记事
        name:'monitorRecord',
        meta:{
          index:4
        }
      },
      {
        path:'/pipeRecord/pipeStandingBook',
        component:()=>import('@/pages/pipeRecord/pipeStandingBook'), //管网档案  管网台账
        name:'pipeStandingBook',
        meta:{
          index:5
        }
      },
      {
        path:'/pipeRecord/addPipe',
        component:()=>import('@/pages/pipeRecord/addPipes'), //管网档案 新增管网
        name:'pipeAdd',
        meta:{
          index:6
        }
      },
      {
        path:'/pipeRecord/devStandingBook',
        component:()=>import('@/pages/pipeRecord/devStandingBook'), //管网档案  设备台账
        name:'devStandingBook',
        meta:{
          index:7
        }
      },
      {
        path:'/pipeRecord/addDev',
        component:()=>import('@/pages/pipeRecord/addDeves'),//管网档案  新增设备
        name:'addDeves',
        meta:{
          index:8
        }
      },
      {
        path:'/pipeStatistic/pipeMsg',
        component:()=>import('@/pages/pipeStatistic/pipeMsg'), //统计分析  管网信息
        name:'pipeMsg',
        meta:{
          index:9
        }
      },
      {
        path:'/pipeStatistic/monitorMsg',
        component:()=>import('@/pages/pipeStatistic/monitorMsg'), //统计分析  监测信息
        name:'monitorMsg',
        meta:{
          index:10
        }
      },
      {
        path:'/pipeStatistic/enterpriseTable',
        component:()=>import('@/pages/pipeStatistic/enterpriseTable'), //统计分析  企业报表
        name:'enterpriseTable',
        meta:{
          index:11
        }
      },
      {
        path:'/pipeSetting/siteMonitor',
        component:()=>import('@/pages/pipeSetting/siteMonitor'),//系统配置  监测站点
        name:'siteMonitor',
        meta:{
          index:12
        }
      },
      {
        path:'/pipeSetting/addSites',
        component:()=>import('@/pages/pipeSetting/sites/addSite'), //系统配置  监测站点 新增站点
        name:'addSites',
        meta:{
          index:13
        }
      },
      {
        path:'/pipeSetting/zoneConfig',
        component:()=>import('@/pages/pipeSetting/zoneConfig'), //系统配置  分区配置
        name:'zoneConfig',
        meta:{
          index:14
        }
      },
      {
        path:'/pipeSetting/projectConfig',
        component:()=>import('@/pages/pipeSetting/projectConfig'),  //系统配置  工程配置
        name:'projectConfig',
        meta:{
          index:15
        }
      }
    ]
  },
  {
    path: '/error',
    component:()=>import('@/pages/500'),// 500
    name: 'error',
    meta:{
      index:16
    }
  },
  {
    path: '*',
    component: ()=>import('@/pages/404'),//404
    name: 'noFound',
    meta:{
      index:17
    }
  }
];


let router = new VueRouter({
    mode: 'hash',
    base: '/',
    routes: routes,
});

router.addRoutes(routes);

// 拦截路由地址...
// router.beforeEach((to, from, next) => {
//     //
//     let loginPath = '/login';
//     let login = localStorage.getItem('__app_token__');
//     let path = to.path;
//     if (path === loginPath) {
//         next();
//         return;
//     }
//     if (login) {
//         // if (path === '/') {
//         //     next({
//         //         path: 'demo'
//         //     })
//         // } else {
//         //     next()
//         // }
//         next();
//     } else {
//         next({
//             path: loginPath
//         })
//     }
// });

export default router;
