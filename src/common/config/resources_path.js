/**
 * 全局配置文件在这，方便自己 ，也要方便他人
 *   注释信息一定要 写清楚
 */

window.DSE={};
let baseGisUrl = arcgis_IP+'/arcgis_js_v48_api/library/4.8';
//将当前地图内容导出为图片.
// window.DSE.exportMapUrl='http://10.100.3.118:6080/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task';

window.DSE.baseGisUrl = baseGisUrl;
//
let dse = {};
// 服务端需要修改路径为 文件所在的根目录 dse.baseURL = getIndexUrl("/pipe/pages/app/pipe/");
dse.baseURL = baseURL; // ******
dse.static_baseUrl = static_baseUrl;

dse.version = '1.0.0';
// 说明 该地址既是接口地址 、也是跳转服务地址

dse.base_api_url = base_api_url;


//arcgis 启动脚本
// dse.arcgis_startJS = arcgis_IP + "/arcgis_js_v48_api/library/4.8/init.js";
dse.arcgis_startJS = baseGisUrl+ '/init.js';
// arcgis 主题css
// dse.arcgis_themeCss = arcgis_IP+"/arcgis_js_api3.18/library/3.18/3.18/dijit/themes/claro/claro.css";
// arcgis 启动css
// dse.arcgis_mainCss = arcgis_IP + "/arcgis_js_v48_api/library/4.8/esri/css/main.css"
dse.arcgis_mainCss = baseGisUrl + "/esri/css/main.css";
// arcgis 管网资源地址
// dse.arcgis_belowMap = arcgis_resourceIP + "/arcgis/rest/services/0723MapService/MapServer/0";
dse.arcgis_belowMap = arcgis_resourceIP +"/arcgis/rest/services/nxstPipeMapService/MapServer/0"
// dse.arcgis_belowMap = arcgis_resourceIP + "/arcgis/rest/services/elec080701Service/MapServer/0";
// dse.arcgis_belowMap ="http://sw.nxstjt.com/arcgis/rest/services/gas080701Service/MapServer"
// 宁夏省行政区划的图层
dse.ningxia_layer = arcgis_resourceIP+"/arcgis/rest/services//cityMapService/MapServer/0"

// arcgis 的消防栓资源图层
// dse.arcgis_pipe = arcgis_resourceIP + "/arcgis/rest/services/point0723Service/MapServer/0";
dse.arcgis_pipe = arcgis_resourceIP + "/arcgis/rest/services/nxstHrantMapService/MapServer/0";

// arcgis 的阀门资源 图层
// dse.arcgis_points = arcgis_resourceIP + "/arcgis/rest/services/0723PointService/MapServer/0";
dse.arcgis_points = arcgis_resourceIP + "/arcgis/rest/services/nxstValveMapService/MapServer/0";

// arcgis 的电线图层
// dse.arcgis_wire = arcgis_resourceIP + "/arcgis/rest/services/elec080701Service/MapServer/0";
dse.arcgis_wire = arcgis_resourceIP + "/arcgis/rest/services/nxstEleMapService/MapServer/0";

// arcgis 的天然气图层
// dse.arcgis_gas = arcgis_resourceIP + "/arcgis/rest/services/gas080701Service/MapServer/0";
dse.arcgis_gas = arcgis_resourceIP + "/arcgis/rest/services/nxstGasMapService/MapServer/0";

// //arcgis 检修井
dse.arcgis_jxj = arcgis_resourceIP + "/arcgis/rest/services/projectPointService/MapServer/0";
// //arcgis 工作点
dse.arcgis_gzd = arcgis_resourceIP + "/arcgis/rest/services/wellPointService/MapServer/0";


// 中源同心县的管网图层地址
dse.arcgis_zhongyuan_tongxin_pipe = arcgis_resourceIP + "/arcgis/rest/services/zyTxMapService/MapServer/0";

//检测设备的图层  含有水质
dse.arcgis_devs_qc = arcgis_ObservationItem_resourceIP + "/arcgis/rest/services/monitorPointQualityService/MapServer/0"
//检测设备的图层  含有 流量
dse.arcgis_devs_flow = arcgis_ObservationItem_resourceIP + "/arcgis/rest/services/monitorPointFlowService/MapServer/0"
//检测设备的图层  含有 水压 
dse.arcgis_devs_press = arcgis_ObservationItem_resourceIP + "/arcgis/rest/services/monitorPointGageService/MapServer/0"

dse.convertCoordSym = "";  // google  为 google地图  所有的矢量数据必须坐标转换才能显示出来 空为gis   


//  临时 图层配置

// 管网图层 
// 临时的图层校验  如果是六盘山 就显示六盘山，如果是中源，就显示中源，其他默认显示六盘山
dse.pipe_default_layer_url = arcgis_resourceIP+"/arcgis/rest/services/nxstMapService_"
// dse.pipe_default_layer_url = arcgis_resourceIP +"/arcgis/rest/services/0723MapService/MapServer/0";
// 消防栓
dse.xfs_default_layer_url = arcgis_resourceIP+"/arcgis/rest/services/nxstHrantService_"
// dse.xfs_default_layer_url = arcgis_resourceIP + "/arcgis/rest/services/point0723Service/MapServer/0";
// 阀门
dse.fm_default_layer_url = arcgis_resourceIP+"/arcgis/rest/services/nxstValveMapService_";
// dse.fm_default_layer_url =  arcgis_resourceIP + "/arcgis/rest/services/0723PointService/MapServer/0";


//配置底图
//矢量数据对应的坐标偏移算法. 设置为空时表示不执行坐标偏移. 可选值为 google.
dse.convertCoordSym = '';// google 为google地图，切换为这个类型地图时，所有的矢量数据必须做坐标转化后才能正确显示在地图中.
dse.baseMapLayers = [
    {
        id: 'gvec',
        type: 'google',
        url: 'vec',// google url有效值为 vec,img,ter中的一个
        // img_src: DSE.styleName + '/img/maptype/jt1.png',
        name: '矢量图',
        initShow: false
    },
    {

        id: 'gimg',
        type: 'google',
        url: 'img',// google url有效值为 vec,img,ter中的一个
        // img_src: DSE.styleName + '/img/maptype/dx1.png',
        name: '影像图',
        initShow: true
    },
    {

        id: 'gter',
        type: 'google',
        url: 'ter',// google url有效值为 vec,img,ter中的一个
        // img_src: DSE.styleName + '/img/maptype/yx1.png',
        name: '地形图',
        initShow: false
    },
];

// arcgis 地图导出 需要服务端 arcgis 配置打印托管服务  // ******
dse.arcgisExportMap = arcgisExportMap;
// arcgis 外部模块导入配置
dse.gisConfig = {
    async: true,
    packages: [
        {
            name: "dse",
            location: static_baseUrl + "/gisTools"
        }
    ]
}
//管网信息管理 管网综合信息管理 导出pdf
dse.pipeMsg_mkpdf = static_baseUrl + "/makepdf/index.html";
//在线预览pdf 的路径
dse.onlinePrev = static_baseUrl + "/pdfjs/web/viewer.html?file="

// 静态配置打印表单的路径  监测和巡检抢修公用
dse.print_path = static_baseUrl + "/static/print.html";


//配置 区域 ID
dse.area = {
    old: "",
    new: "",
    deve: ""
}
// 设备
dse.devices = []
//传输介质
dse.transmissionMedium = []
// 管口连接方式
dse.interFace = []
// 供水类型
dse.waterSupply_type = []
// 区域
dse.areaLists = [];
// 管材
dse.productLists = []
//管径
dse.caliberLists = []

/**
 * 管网巡检抢修
 */
// 管网 巡检抢修 工单紧急程度
dse.dangerlist = []
// 管网 巡检抢修 工单的检修类型
dse.problem_type = []
// 管网 巡检抢修 工单的派单状态
dse.orderStatus = []

/**
 * 管网监测
 */
// 路面荷载
dse.roadWeights = []
// 管龄
dse.pipe_age= []
// 爆管次数
dse.pipe_burst_num = []
// 管道埋深
dse.pipe_deep = []
//管网水质监测主项
dse.water_quality = []

//水厂组织结构
dse.tree = []
// 方便在gis页面中引出弹窗的数据绑定 
dse.globalData = null;

dse.compyName = "";
dse.compyID = "";
dse.userName = "";

dse.this_ = null;  //绑定 vue的实例

dse.temp_arr = []; //必要条件下  需要挂载的数组

dse.allowBtns={
    pipeMsg:{
        pipe_2d3d:{
            editSave:"8ae4b2d56913e718016947390cd109d7"
        },
        waterInformation:{
            add:"2c9d26c666aff42a016705bd1f010e53",
            edit:"2c9d26c666aff42a016705bd53110e59",
            del:"2c9d26c666aff42a016705bd80c80e5a"
        },
        city_EditNotify:{
            add:"2c9d26c666aff42a016705be8ba10e5c",
            edit:"2c9d26c666aff42a016705beb6d70e5d",
            del:"2c9d26c666aff42a016705bee3850e5e"
        }
    },
    monitor:{
        surver:{
            action:"2c9d26c666aff42a0167068d595c0ec8", //处理
        },
        baseSet:{
            add:"2c9d26c666aff42a0167068e96be0ec9",
            edit:"2c9d26c666aff42a0167068ec5dd0eca",
            del:"2c9d26c666aff42a0167068eed5a0ecb" 
        }
    },
    rushrepair:{
        information:{
            add:"2c9d26c666aff42a0167068fea770ecd" //巡检计划新增
        },
        hiddenDanger:{
            add:"2c9d26c666aff42a01670690d15d0ed0", //新增
            checked:"2c9d26c666aff42a0167069115b90ed1", //核实
            repair:"2c9d26c666aff42a0167069149c90ed2" //检修
        },
        repair:{
            add:"2c9d26c666aff42a01670691c7750ed3",
            dispatch:"2c9d26c666aff42a01670691fcec0ed4" //派单
        }
    },
    leaktest:{

    }
}
export default dse

