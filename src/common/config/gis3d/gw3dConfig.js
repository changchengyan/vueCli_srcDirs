/**
 * @description 管网图层配置文件.
 *
 * @author wangsl.
 * */

let gw3dConfig = {
    //
    layerId: 'gw_3d_layer',
    //
    queryField: 'PIPELINE_CODE ',
    keyField: 'ID',
    // depth:-20,//管网埋藏深度
    //弹出框信息.
    popupTemplate: {
        // url: 'http://10.100.50.137:8080/#/popup',
        visible: true,
        // url: `${dse.baseURL}/#/pipe/pipeNet_route/gisFrame_msg_pipe`,//开发环境
        url: `${dse.baseURL}/?id=${id}#/pipe/pipeNet_route/gisFrame_msg_pipe`,//生产环境

        // titleField: 'SDE.V_DSE_PIPE_BASEINFO.PIPELINE_CODE',
        titleField: '管网',
        titleSuffix: '详细信息'
    },
    //提示框.
    tipsTemplate: {
        visible: true,
        //默认显示图片
        // imgUrl: projectUrl + "/images/icon1.png",
        //图片路径字段.
        imgField: "url",
        width: 200,
        // height: 200,
        fields: [
            {"测站简介": "NAME"}
            // {"附件": "url"}
        ]
    },
    /**
     * @param {Object} data  信息点属性信息.
     *
     * 为了配置文件可以采用Es6语法编写， 此处只 返回 符号参数,而不是符号的实例
     * */
    symbolCallBack: function (attributes) {

        let keyField = 'TYPE';
        //
        attributes = attributes || {};

        let symbolFlags = parseFloat(attributes[keyField]);
        var symbolProps = {
            type: "line-3d",  // autocasts as new LineSymbol3D()
            symbolLayers: [{
                type: "path",  // autocasts as new PathSymbol3DLayer()
                size: 1,  // 20 meters in diameter
                material: {color: "#44cef6"}
            }]
        };
        if (symbolFlags === 1) {
            //
            symbolProps.symbolLayers = [{
                //
                type: "path",  // autocasts as new PathSymbol3DLayer()
                size: 1,  // 20 meters in diameter
                material: {color: "#44cef6"}
            }];

        } else if (symbolFlags === 2) {
            symbolProps.symbolLayers = [{
                //
                type: "path",  // autocasts as new PathSymbol3DLayer()
                size: 2,  // 20 meters in diameter
                material: {color: "#44cef6"}
            }];
        } else if (symbolFlags === 3) {
            //
            symbolProps.symbolLayers = [{
                //
                type: "path",  // autocasts as new PathSymbol3DLayer()
                size: 2,  // 20 meters in diameter
                material: {color: "#aefcc1"}
            }];
        }
        return symbolProps;
    },
    //图层标签名称.
    layerLabels: {
        visible: false,
        symbol: {
            type: "point-3d",  // autocasts as new PointSymbol3D()
            symbolLayers: [{
                type: "text",  // autocasts as new ObjectSymbol3DLayer()
                width: 5,    // diameter of the object from east to west in meters
                height: 10,  // height of object in meters
                depth: 15,   // diameter of the object from north to south in meters
                resource: { primitive: "cube" },
                material: { color: "red" },
                text:'tests'
            }]
        }
    },
};
//
export default gw3dConfig;

