/**
 * Created by Extra on 2017-12-12 14:55:02.
 */

define(["esri/config", "esri/layers/WebTileLayer"], function (config, WebTileLayer) {
    config.request.corsEnabledServers.push(
        "www.google.cn",
    );
    return WebTileLayer.createSubclass({
        declaredClass: "dse.layers.GoogleImageLayer",
        properties: {
            copyright: "Google",
            urlTemplate: "http://www.google.cn/maps/vt?lyrs=s@748&gl=cn&x={col}&y={row}&z={level}",
            operationalLayerType: "GoogleImageLayer",
            type: {
                value: "s",
                json: { read: !1 }
            }
        }
    })
});

