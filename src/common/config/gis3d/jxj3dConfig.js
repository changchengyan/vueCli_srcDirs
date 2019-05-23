/**
 * @description 消防栓图层配置文件.
 *
 * @author wangsl.
 * */

let jxj3dConfig = {
    //
    layerId: 'xfs_3d_layer',
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
            type: "polygon-3d",  // autocasts as new PointSymbol3D()
            symbolLayers: [{
                type: "object",  // autocasts as new ObjectSymbol3DLayer()
                size: 1,  // diameter of the object from east to west in meters
                width:1,
                height:0.2,
                outline:{
                    color: "blue",
                    size: "0.5px"
                },
                resource: {
                    href:`${dse.baseURL}/static/models/jxj.json`,
                },
                material: { color: "#ff0000" }
            }]
        };
        //
        return symbolProps;
    }
};
//
export default jxj3dConfig;

