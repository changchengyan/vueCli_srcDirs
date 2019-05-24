
/**
 * 全局配置文件在这，方便自己 ，也要方便他人
 *   注释信息一定要 写清楚
 */

//
let dse = {};
// 服务端需要修改路径为 文件所在的根目录 dse.baseURL = getIndexUrl('/pipe/pages/app/pipe/');
dse.baseURL = window.baseURL; // ******
dse.static_baseUrl = window.static_baseUrl;


dse.version = '1.0.0';
// 说明 该地址既是接口地址 、也是跳转服务地址
dse.base_api_url = window.base_api_url;

// 视频的基础APIURL
dse.video_api_url = 'http://218.95.175.78:10800/api/v1';


//配置 区域 ID
dse.area = {
    old: '',
    new: '',
    deve: ''
};
// 设备
dse.devices = [];
//传输介质
dse.transmissionMedium = [];
// 管口连接方式
dse.interFace = [];
// 供水类型
dse.waterSupply_type = [];
// 区域
dse.areaLists = [];
// 管材
dse.productLists = [];
//管径
dse.caliberLists = [];

/**
 * 管网巡检抢修
 */
// 管网 巡检抢修 工单紧急程度
dse.dangerlist = [];
// 管网 巡检抢修 工单的检修类型
dse.problem_type = [];
// 管网 巡检抢修 工单的派单状态
dse.orderStatus = [];

/**
 * 管网监测
 */
// 路面荷载
dse.roadWeights = [];
// 管龄
dse.pipe_age= [];
// 爆管次数
dse.pipe_burst_num = [];
// 管道埋深
dse.pipe_deep = [];
//管网水质监测主项
dse.water_quality = [];

//水厂组织结构
dse.tree = [];
// 方便在gis页面中引出弹窗的数据绑定
dse.globalData = null;

dse.compyName = '';
dse.compyID = '';
dse.userName = '';

dse.this_ = null;  //绑定 vue的实例

dse.temp_arr = []; //必要条件下  需要挂载的数组

dse.allowBtns={
    pipeMsg:{
        pipe_2d3d:{
            editSave:'8ae4b2d56913e718016947390cd109d7'
        },
        waterInformation:{
            add:'2c9d26c666aff42a016705bd1f010e53',
            edit:'2c9d26c666aff42a016705bd53110e59',
            del:'2c9d26c666aff42a016705bd80c80e5a'
        },
        city_EditNotify:{
            add:'2c9d26c666aff42a016705be8ba10e5c',
            edit:'2c9d26c666aff42a016705beb6d70e5d',
            del:'2c9d26c666aff42a016705bee3850e5e'
        }
    },
    monitor:{
        surver:{
            action:'2c9d26c666aff42a0167068d595c0ec8', //处理
        },
        baseSet:{
            add:'2c9d26c666aff42a0167068e96be0ec9',
            edit:'2c9d26c666aff42a0167068ec5dd0eca',
            del:'2c9d26c666aff42a0167068eed5a0ecb'
        }
    },
    rushrepair:{
        information:{
            add:'2c9d26c666aff42a0167068fea770ecd' //巡检计划新增
        },
        hiddenDanger:{
            add:'2c9d26c666aff42a01670690d15d0ed0', //新增
            checked:'2c9d26c666aff42a0167069115b90ed1', //核实
            repair:'2c9d26c666aff42a0167069149c90ed2' //检修
        },
        repair:{
            add:'2c9d26c666aff42a01670691c7750ed3',
            dispatch:'2c9d26c666aff42a01670691fcec0ed4' //派单
        }
    },
    leaktest:{

    }
};

export default dse;