// "use strict";

let popupUtils = {};
/**
 * @description 创建基于IFrame的弹出框.
 * */
popupUtils.createIFramePopupObject = function (data, configProps) {
    //
    // let pointGeometry = this._createPopupLocation(data, configProps);
    // let popupTitle = data[configProps.titleField];
    //
    // if (configProps.titleSuffix) {
    //     //
    //     popupTitle += configProps.titleSuffix;
    // }
    let popupObject = {
        title: configProps.titleField,
        // location: pointGeometry,
        content: getPopupContent(data, configProps),
        actions: []
    };
    //
    // window.graphic = data;
    //
    return popupObject;
};

function getPopupContent(data, configProps) {
    // let popupDiv = document.createElement('div');
    //
    // popupDiv.classList.add('popup');
    //
    let framePanel = document.createElement("iframe");
    // framePanel.frameborder = "0";
    // framePanel.style = "border:none;";
    framePanel.style.border = "none;";
    framePanel.name = "widgetContainer";
    framePanel.src = configProps.url;
    //
    // framePanel.setAttribute("src", configProps.url);
    framePanel.width = "500";
    framePanel.height = "500";
    framePanel.scrolling = "no";
    framePanel.frameBorder = "0";

    // framePanel.classList.add('popup');
    // framePanel.classList.add('u-widget-ctn');
    // popupDiv.appendChild(framePanel);
    //
    // window.graphic = data;
    return framePanel;
}

//
// //
// popupUtils.skipToMapView = function (data, configProps) {
//     //
//     //设置默认值.
//     configProps.lonField = configProps.lonField || 'LGTD';
//     configProps.latField = configProps.latField || 'LTTD';
//     this.view = configProps.view;
//     let dx = parseFloat(data[configProps.lonField]);
//     let dy = parseFloat(data[configProps.latField]);
//     if (dx && dy) {
//         //从地图上点击时，不执行定位.
//         if (!configProps.isClickOnView) {
//             this.view.goTo([dx, dy]);
//         }
//         return true;
//     }
//     else {
//         //
//         alert('不存在空间坐标信息，无法定位.');
//         return false;
//     }
// };
export default popupUtils;