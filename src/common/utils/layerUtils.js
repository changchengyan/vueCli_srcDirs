/**
 * @description 图层查询工具类.
 *
 * @author wangsl.
 * */
import popupUtils from './popupUtils';

import { convertGeometryPointSR, convertGeometrySR } from './geometryUtils';

let layerUtils = {};
//
let QueryTask = null;

let Query = null;

let GraphicsLayer = null;

let Graphic = null;

//
layerUtils.bindAmdClass = function (queryTask, query, graphicsLayer, graphic) {
    //
    QueryTask = queryTask;
    Query = query;
    GraphicsLayer = graphicsLayer;
    Graphic = graphic;
};
/**
 * @description 加载管网3d数据.
 *
 * @param { Map} map ESRI  地图对象实例.
 * @param {Object} layerConfig 图层配置信息, 对应 ../config/gis3d/ 里面对应的配置文件.
 *
 * */
layerUtils.loadData = function (map, layerConfig,companyId) {
    //
    //
    let depth = layerConfig.depth || -15;
    let queryTask = new QueryTask({
        //
        url: layerConfig.url
    });
    let resultsLayer = new GraphicsLayer({
        id: layerConfig.layerId,
        elevationInfo: {
            mode: 'relative-to-ground',
            offset: depth
        }
    });
    let labelLayer = new GraphicsLayer({
        //
        id: layerConfig.layerId + '_label'
    });
    map.add(resultsLayer);
    //
    let isShowLabels = layerConfig.layerLabels && layerConfig.layerLabels.visible;
    if (isShowLabels) {
        //
        map.add(labelLayer);
    }
    let queryParam = new Query();
    //
    queryParam.returnGeometry = true;
    queryParam.outFields = ['*'];
    if(companyId!==undefined){
        queryParam.where = "COMPANY_ID = '" + companyId + "'";
    }else{
        queryParam.where = '1=1';
    }
    //
    queryTask.execute(queryParam)
        .then((featureSet) => {
            //
            resultsLayer.removeAll();
            let features = featureSet.features;
            //
            features.forEach((feature, index) => {
                //
                feature.symbol = layerConfig.symbolCallBack(feature.attributes);
                //
                if (layerConfig.popupTemplate && layerConfig.popupTemplate.visible) {
                    let popupTemplate = popupUtils.createIFramePopupObject(feature.attributes, layerConfig.popupTemplate);
                    //
                    feature.popupTemplate = popupTemplate;
                }
                //不是google地图，不调用下面代码.
                //dse.convertCoordSym === 'google'
                if (layerConfig.convertCoordSym === 'google') {
                    let newGraphic = layerUtils._convertFeature(feature, layerConfig);
                    resultsLayer.add(newGraphic);
                } else {
                    //
                    resultsLayer.add(feature);
                }
                //添加标签图层.
                if (isShowLabels) {
                    //
                    let geo = this.getCenterPoint(feature.geometry);
                    let gra = new Graphic({
                        geometry: geo,
                        symbol: layerConfig.layerLabels.symbol
                    });
                    //
                    labelLayer.add(gra);
                }
            });
        })
        .catch((error) => {
            console.log(error);
        });
    //
    return resultsLayer;
};

/**
 * @description 根据条件查询要素，并将结果添加到地图中。
 *
 * @param {Object} layerConfig 图层配置信息, 对应 ../config/gis3d/ 里面对应的配置文件.
 * @param {Object} queryParam 查询参数, esri Query 对象实例.
 * @param {GraphicsLayer} targetLayer 结果图层.
 *
 *
 * */
layerUtils.queryFeatures = function (layerConfig, queryParam, targetLayer,copyLayer) {
    //
    if (QueryTask) {
        let queryTask = new QueryTask({
            url: layerConfig.url
        });
        queryTask.execute(queryParam)
            .then((featureSet) => {
                if(targetLayer){
                    targetLayer.removeAll();
                    copyLayer.removeAll();
                }
                let features = featureSet.features;
                features.forEach((feature, index) => {
                    feature.symbol = targetLayer.symbolInfo;
                    let popupTemplate = popupUtils.createIFramePopupObject(feature.attributes, layerConfig.popupTemplate);
                    //
                    feature.popupTemplate = popupTemplate;
                    //不是google地图，不调用下面代码.
                    if (layerConfig.convertCoordSym === 'google') {
                        let newGraphic = layerUtils._convertFeature(feature, layerConfig);
                        targetLayer.add(newGraphic);
                    } else {
                        targetLayer.add(feature);
                    }
                });
            })
            .catch((error) => {
                console.log(error)
            });
    }
};

//@private
// 转换查询结果的坐标.
layerUtils._convertFeature = function (feature, layerConfig) {
    //
    let points = [];
    let tempGeo = feature.geometry;
    let newGeo = {};
    //点.
    if (feature.geometry.type === 'point') {
        //
        points = convertGeometryPointSR([tempGeo.x, tempGeo.y], 'google');
        // x: points[0],
        // y: points[1]
        //暂时屏蔽 该方法  待谷歌皮肤 完善
        newGeo = {
            type: 'point',
            x: points[0],
            y: points[1]
        };
    } else if (feature.geometry.type === 'polyline') {
        // 线.
        newGeo = {
            //
            type: 'polyline',
            paths: convertGeometrySR(tempGeo.paths, 'google')
        };
        //
    } else if (feature.geometry.type === 'polygon') {
        //面.
        newGeo = {
            type: 'polygon',
            rings: convertGeometrySR(tempGeo.rings, 'google')
        };
    }
    let newGraphic = new Graphic({
        geometry: newGeo,
        attributes: feature.attributes,
        symbol: layerConfig.symbolCallBack(feature.attributes),
        popupTemplate: feature.popupTemplate
    });
    //
    return newGraphic;
};

//
layerUtils.getGraphic = function (layer, keyField, graphicId) {
    //
    if (layer && keyField && graphicId) {
        //
        let results = layer.graphics.items.filter((item, index) => {
            //
            return item.attributes[keyField] = graphicId;
        });
        // debugger;
        return results && results.length > 0 ? results[0] : null;
    } else {
        //
        return null;
    }
};
//获取线段中点.
layerUtils.getCenterPoint = function (polyline) {
    let point = {};
    let pathCount = polyline.paths.length;
    if (pathCount > 0) {
        //
        // let xys = polyline.paths[0][0];
        // point = {
        //     type: "point", // autocasts as new Point()
        //     x: xys[0],
        //     y: xys[1]
        // };


    }
    return polyline.getPoint(0, 1);
};
//
export default layerUtils;