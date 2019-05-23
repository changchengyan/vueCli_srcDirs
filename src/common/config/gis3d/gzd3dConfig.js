/**
 * @description 消防栓图层配置文件.
 *
 * @author wangsl.
 * */

let gzd3dConfig = {
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
            type: "point-3d",  // autocasts as new PointSymbol3D()
            symbolLayers: [{
                type: "object",  // autocasts as new ObjectSymbol3DLayer()
                // size: 34,  // diameter of the object from east to west in meters
                width:10,
                height:36,
                outline:{
                    color: "blue",
                    size: "0.5px"
                },
                resource: {
                    // primitive: "cylinder",
                    // href:'http://10.100.50.137:8080/static/temp/ddd_0.json'
                    // href:`${dse.baseURL}/static/models/xfs.json`,
                },
                material: { color: "#ff0000" }
            }]
        };
        //
        return symbolProps;
    }
};
//
export default gzd3dConfig;

