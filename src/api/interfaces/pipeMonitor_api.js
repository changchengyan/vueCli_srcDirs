import fetch from '../fetch';

import domainURL from '../urls';

//监测项列表查询(新增使用)
export function getMonitoringProgram(params,context) {
    return fetch({
        url: domainURL.getMonitoringProgram,
        method: 'post',
        params: params
    },context);
}
// 上传新增或编辑的基础设置
export function addMonitor(params,context) {
    return fetch({
        url: domainURL.addMonitor,
        method: 'post',
        params: params
    },context);
}
//监测点查询（监测项详情）   监测点查询（列表和详情）
export function queryPointMonitor(params,context) {
    return fetch({
        url: domainURL.queryPointMonitor,
        method: 'post',
        params: params
    },context);
}
// 编辑监测列表
export function updateMonitor(params,context) {
    return fetch({
        url: domainURL.updateMonitor,
        method: 'post',
        params: params
    },context);
}