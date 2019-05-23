/**
 * @description 阀门图层配置文件.
 *
 * @author wangsl.
 * */

let xfs2dConfig = {
    //
    layerId: 'fm_3d_layer',
    //弹出框信息.
    popupTemplate: {
        url: 'https://www.baidu.com',
        titleField: '阀门',
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
        let symbolProps={
            type: "picture-marker", 
            url: `${dse.baseURL}/static/gis_temporary_pic/fm.png`,
            width: "16px",
            height: "25px"
        }
        //
        return symbolProps;
    }
};
//
export default xfs2dConfig;

