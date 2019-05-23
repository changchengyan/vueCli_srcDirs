/**
 * @description 天然气图层配置文件.
 *
 * @author wangsl.
 * */

let gas3dConfig = {
    //
    layerId: 'gas_3d_layer',
    //弹出框信息.
    popupTemplate: {
        url: 'https://www.baidu.com',
        titleField: 'STNM',
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

        var symbolProps = {
            type: "line-3d",  // autocasts as new LineSymbol3D()
            symbolLayers: [{
                type: "path",  // autocasts as new PathSymbol3DLayer()
                size: 2,  // 20 meters in diameter
                material: {color: "#ff4777"}
            }]
        };
        return symbolProps;
    }
};
//
export default gas3dConfig;

