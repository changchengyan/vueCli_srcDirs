import fetch from '../fetch';

import domainURL from '../urls';

// 示例接口
export function getData(params,context) {
    return fetch({
        url: domainURL.getData,
        method: 'post',
        params: params
    },context);
}

// 获取监测点

export function getPipeMonitorPoint(params,context) {
    return fetch({
        url: domainURL.getPipeMonitorPoint,
        method: 'post',
        params: params
    },context);
}

// 删除监测点

export function deleteMonitor(params,context) {
    return fetch({
        url: domainURL.deleteMonitor,
        method: 'post',
        params: params
    },context);
}


