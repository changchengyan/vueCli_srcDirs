/**
 * @description 电线图层配置文件.
 *
 * @author wangsl.
 * */

let gzd2dConfig = {
    //
    layerId: 'jxj_2d_layer',
    //弹出框信息.
    popupTemplate: {
        url: 'https://www.bing.com',
        titleField: '电线',
        titleSuffix: '详细信息'
    },
    //提示框.
    tipsTemplate: {
        visible: false,
        //默认显示图片
        // imgUrl: projectUrl + "/images/icon1.png",
        //图片路径字段.
        imgField: "url",
        width: 200,
        // height: 200,
        fields: [
            { "测站简介": "NAME" }
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
            type: "simple-fill",  // autocasts as new SimpleFillSymbol()
            color: "red",
            outline: {  // autocasts as new SimpleLineSymbol()
                color: [128, 128, 128, 0.5],
                width: "0.5px"
            }
        };
        return symbolProps;
    }
};
//
export default gzd2dConfig;

