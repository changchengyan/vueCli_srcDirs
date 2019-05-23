export default{
    menushow:true,
    comanyID:"",
    userName:"",
    compyName:"",
    firstInit_route:0 ,//判断是否是第一次进入路由
    filePath:"", // 文件的前缀路径
    dept:"", //部门名字
    deptID:"", //部门ID
    tel:"", //手机号,
    areaName:"", //所属行政区域
    orgTree:[],  // 组织树
    cityAreas:[], //城市区域
    cityPosition:"", // 人所在城市的 位置
    btnsIds:[], //所有被允许的ID
    pages_btn_allow:{}, //所有被允许的按钮
    menuList:[], //路由菜单
    pipe_defaultLayer:"", // 管网 六盘山和中源显示各自的，其他默认显示六盘山  临时服务 以后删除
    xfs_defaultLayer:"", //  消防栓  注释内容同上诉要去
    fm_defaultLayer:"" // 阀门  注释内容同上诉要求  
}