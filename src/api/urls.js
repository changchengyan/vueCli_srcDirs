
import dse from '../config/inner_config';

const SERVICES = dse.base_api_url;

const VIDEOSERVICE = dse.video_api_url;

export default{

    // 上传文件的 接口 示例
    uploadFile:'',
    // 通用的接口
    getSessionUser:`${SERVICES}/sysController/getSessionUser.do?r=${Math.random()}`,
    getFilePathUrl:`${SERVICES}/CommonCtrl/getFilePathUrl.do`,
    listAllUserChildrenById:`${SERVICES}/resourceController/listAllUserChildrenById.do`,
    getOrgTree:`${SERVICES}/pipeLeakController/getOrgTree.do`,
    getResourceByIdAndUser:`${SERVICES}/resourceController/listAllUserChildrenById.do`,
    getDictByPCode:`${SERVICES}/CommonCtrl/getDictByPCode.do`,
    /** 获取组织机构*/
    getOrganDictTree:`${SERVICES}/productStructController/getOrganDictTree.do`,

    // 视频类
    // 获取通道 get
    getchannels:`${VIDEOSERVICE}/getchannels?t=${new Date().getTime()}`,
    //获取视频流配置 get
    getchannelsconfig:`${VIDEOSERVICE}/getchannelsconfig?t=${new Date().getTime()}`,
    // 获取 视频流 get
    getchannelstream:`${VIDEOSERVICE}/getchannelstream?t=${new Date().getTime()}&&Line=‘local‘&From=’lan‘`,
    //获取 视频快照 get
    getsnap:`${VIDEOSERVICE}/api/v1/getsnap?`,
    //获取视频 列表
    getVideoList:`${SERVICES}/videoCtrl/getVideoList.do`,



    // 首页的接口


    // 管网监测


    // 管网档案


    // 统计分析


    getPipeDeviceNumReport:`${SERVICES}/monitorBase/getPipeMonitorPoint.do`,
    getPipeDeviceValveReport:`${SERVICES}/monitorBase/getPipeMonitorPoint.do`,
    getPipeRadiusReport:`${SERVICES}/monitorBase/getPipeMonitorPoint.do`,

    //系统配置

    getPipeMonitorPoint:`${SERVICES}/monitorBase/getPipeMonitorPoint.do`,
    deleteMonitor:`${SERVICES}/monitorPoint/deleteMonitor.do`,
    getMonitoringProgram:`${SERVICES}/monitorBase/getMonitoringProgram.do`,
    addMonitor:`${SERVICES}/monitorPoint/addMonitor.do`,
    queryPointMonitor:`${SERVICES}/monitorPoint/queryPointMonitor.do`,
    updateMonitor:`${SERVICES}/monitorPoint/updateMonitor.do`,

};