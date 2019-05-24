/**
 * 全局配置文件在这，方便自己 ，也要方便他人
 *   注释信息一定要 写清楚
 */
// 公共方法
var getIndexUrl = function (app) {
  var indexPath = '';
  if (app) {
    indexPath = location.protocol + '//' + location.host + app;
  } else {
    indexPath = location.protocol + '//' + location.host;
  }
  return indexPath;
};
// 服务端文件所在的根目录
// window.baseURL = getIndexUrl('/dashboard/nd');
//本地开发路径
window.baseURL = getIndexUrl();



//服务器端静态资源所在的目录
// window.static_baseUrl = getIndexUrl('/dashboard/nd/static')
//本地静态资源所在的目录
window.static_baseUrl = getIndexUrl('/static');

//  获取路由数据
// window.routers = 'http://www.whdse.cn:56012/znb'
//arcgis 启动IP
// window.arcgis_IP = 'http://sw.nxstjt.com';
window.arcgis_IP = 'http://10.100.50.71:2282';
// arcgis 的资源图层IP
// window.arcgis_resourceIP = 'http://sw.nxstjt.com';
window.arcgis_resourceIP = 'http://10.100.50.71:6080';

//  水质、水压、水流的数据
window.arcgis_ObservationItem_resourceIP = 'http://10.100.50.71:6080';



// 正式环境接口地址
// window.base_api_url = 'http://sw.nxstjt.com/pipe';
// 说明 该地址既是接口地址 、也是跳转服务地址
window.base_api_url = 'http://www.whdse.cn:56095/pipe';   //  开发服务器
// window.base_api_url = 'http://www.whdse.cn:56070/pipe' ;  //测试服务器
// window.base_api_url = 'http://10.100.50.197:8080/pipe';   // 本地接口网址 雷
// window.base_api_url = 'http://10.100.50.210:8080/pipe';   // 本地接口网址 贾
// window.base_api_url = 'http://10.100.50.120:8080/pipe';   // 本地接口网址 童
// window.base_api_url = 'http://10.100.50.170:8080/pipe';   // 本地接口网址 王


// //水凝 管网图层 本地
// window.waterAge_gisUrl = 'http://10.100.50.71:6080/arcgis/rest/services//waterAgeMapService/MapServer/0';
//水凝 管网图层  线上
window.waterAge_gisUrl ='http://sw.nxstjt.com/arcgis/rest/services//waterAgeMapService/MapServer/0';


//arcgis 导出服务地址
window.arcgisExportMap = window.arcgis_IP+'/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task';
// window.arcgisExportMap = 'http://10.100.3.118:6080/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task';
// window.arcgisExportMap = 'https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task';
