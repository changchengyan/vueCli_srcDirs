/**
 * @description 管网图层配置文件.
 *
 * @author wangsl.
 * */

let gw2dConfig_new = {
    //
    layerId: 'gw_2d_layer',
    //
    queryField: '',
    keyField: 'ID',
    //弹出框信息.
    popupTemplate: {
        visible:true,
        // url: `${dse.baseURL}/#/pipe/pipeNet_route/gisFrame_msg_pipe`, //开发环境
        url: `${dse.baseURL}/?id=${id}#/pipe/pipeNet_route/gisFrame_msg_pipe`,  //上线环境
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

        let keyField = 'TYPE';
        //
        attributes = attributes || {};
        let symbolFlags =parseFloat(attributes[keyField]);
        let symbolProps = {
            type: "simple-line",
            color: "#1086ff",
            width: 4
        };
        if (symbolFlags === 1) {
            //
            symbolProps = {
                type: "simple-line",
                color: "#0056c1",
                width: 4
            };


        } else if (symbolFlags === 2) {
            symbolProps = {
                type: "simple-line",
                color: "#ddd",
                width: 4
            };
        } else if (symbolFlags === 3) {
            //
            symbolProps = {
                type: "simple-line",
                color: "red",
                width: 4
            };
        }
        return symbolProps;
    }
};
//
export default gw2dConfig_new;
