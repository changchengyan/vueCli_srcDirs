

import fetch from '../fetch';

import domainURL from '../urls';


// 获取session
export function getSessionUser(context) {
    return fetch({
        url: domainURL.getSessionUser,
        method: 'get',
        params:''
    },context);
}

// 获取文件相对路径
export function getFilePathUrl(params,context) {
    return fetch({
        method: 'post',
        url: domainURL.getFilePathUrl,
        params: params
    },context);
}
//获取菜单列表
export function listAllUserChildrenById(params,context) {
    return fetch({
        url: domainURL.listAllUserChildrenById,
        method: 'post',
        params: params
    },context);
}
// 获取组织树
export function getOrgTree(params,context) {
    return fetch({
        url: domainURL.getOrgTree,
        method: 'post',
        params: params
    },context);
}

//  获取路由列表
export function getResourceByIdAndUser(params,context) {
    return fetch({
        url: domainURL.getResourceByIdAndUser,
        method: 'post',
        params: params
    },context);
}

//获取字典信息
export function getDictByPCode(params,context) {
    return fetch({
        url: domainURL.getDictByPCode,
        method: 'get',
        params: params
    },context);
}

//获取组织机构
export function getOrganDictTree(params,context) {
    return fetch({
        url: domainURL.getOrganDictTree,
        method: 'get',
        params: params
    },context);
}

/**
 *  获取 视频类
 */

// 获取通道
export function getchannels(params,context) {
    return fetch({
        url: domainURL.getchannels,
        method: 'get',
        params: params
    },context);
}

// 获取视频流配置
export function getchannelsconfig(params,context) {
    return fetch({
        url: domainURL.getchannelsconfig,
        method: 'get',
        params: params
    },context);
}

// 获取 视频流
export function getchannelstream(params,context) {
    return fetch({
        url: domainURL.getchannelstream+`&&Channel=${params.Channel}&&Protocol=${params.Protocol}`,
        method: 'get',
        params: params
    },context);
}

// 获取 视频快照
export function getsnap(params,context) {
    return fetch({
        url: domainURL.getsnap+`${params}`,
        method: 'get',
        params: params
    },context);
}
//获取视频 列表
export function getVideoList(params,context) {
    return fetch({
        url: domainURL.getVideoList,
        method: 'post',
        params: params
    },context);
}
























































































































































































































