import fetch from '../fetch';

import domainURL from '../urls';

//  示例接口
export function getData(params,context) {
    return fetch({
        url: domainURL.getData,
        method: 'post',
        params: params
    },context);
}