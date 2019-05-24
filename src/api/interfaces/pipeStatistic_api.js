import fetch from '../fetch';

import domainURL from '../urls';



//根据年月统计管网信息
export function getPipeDeviceNumReport(params,context) {
    return fetch({
        url: domainURL.getPipeDeviceNumReport,
        method: 'post',
        params: params
    },context);
}

//  根据年月、设备类型统计设备数量
export function getPipeDeviceValveReport(params,context) {
    return fetch({
        url: domainURL.getPipeDeviceValveReport,
        method: 'post',
        params: params
    },context);
}
// 根据年和设备类型统计设备数量
export function getPipeRadiusReport(params,context) {
    return fetch({
        url: domainURL.getPipeRadiusReport,
        method: 'post',
        params: params
    },context);
}