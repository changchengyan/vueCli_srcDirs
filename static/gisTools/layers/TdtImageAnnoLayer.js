/**
 * Created by Extra on 2017-12-12 14:55:02.
 */
define(["esri/config", "esri/layers/WebTileLayer"], function (config, WebTileLayer) {
    config.request.corsEnabledServers.push(
        "t0.tianditu.com",
        "t1.tianditu.com",
        "t2.tianditu.com",
        "t3.tianditu.com",
        "t4.tianditu.com",
        "t5.tianditu.com",
        "t6.tianditu.com",
        "t7.tianditu.com"
    );
    return WebTileLayer.createSubclass({
        declaredClass: "dse.layers.TdtImageAnnoLayer",
        properties: {
            copyright: "天地图",
            subDomains: {
                value: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"]
            },
            urlTemplate: "http://{subDomain}.tianditu.com/DataServer?T=cia_w&x={col}&y={row}&l={level}",
            operationalLayerType: "TdtImageAnnoLayer",
            type: {
                value: "cia_w",
                json: { read: !1 }
            }
        }
    })
});

