import * as esriLoader from "esri-loader";
let startJs = dse.arcgis_startJS;
const options = {
    url: startJs,
    dojoConfig: dse.gisConfig
};

export let LoadSurface = {
    methods: {
        LoadSurface(data) {
            var polygonInfo = data.polygonInfo;
            esriLoader.loadModules([
                'esri/Graphic',
                "esri/Color",
                "esri/symbols/TextSymbol",
            ], options).then(([Graphic, Color, TextSymbol]) => {
                var rings = [];
                rings.push(JSON.parse(polygonInfo))
                let polygon = {
                    type: "polygon", // autocasts as Polygon
                    rings: rings,
                    spatialReference: { "wkid": 102100 },
                };
                var fillColor
                var outLineColor
                switch (data.attributes.lev) {
                    case "1":
                        fillColor = new Color([163, 234, 201, 0.6]);
                        outLineColor = new Color([0, 86, 31]);
                        break;
                    case "2":
                        fillColor = new Color([244, 227, 171, 0.6]);
                        outLineColor = new Color([236, 105, 65]);
                        break;
                    case "3":
                        fillColor = new Color([253, 200, 245, 0.6]);
                        outLineColor = new Color([255, 0, 255]);
                        break;
                    default:
                        fillColor = new Color([163, 234, 201, 0.6]);
                        outLineColor = new Color([0, 86, 31]);
                        break;
                }
                var symbol = {
                    type: "simple-fill",  // autocasts as new SimpleFillSymbol()
                    color: fillColor,
                    style: "solid",
                    outline: {  // autocasts as new SimpleLineSymbol()
                        color: outLineColor,
                        width: 2,
                        style: 'dash'
                    }
                }
                var graphic_polygon = new Graphic({
                    geometry: polygon,
                    symbol: symbol,
                    attributes: data.attributes
                });
                var textSymbol = {
                    type: "text",  // autocasts as new TextSymbol()
                    text: data.attributes.leakInfo.name,
                    font: {  // autocast as new Font()
                        size: 12,
                        family: "sans-serif",
                        weight: "bold"
                    }
                };
                var graphic_text = new Graphic({
                    geometry: polygon,
                    symbol: textSymbol,
                    attributes: data.attributes
                });
                var leakLayer = this.map.findLayerById('leakAge');
                leakLayer.add(graphic_polygon)
                leakLayer.add(graphic_text)          
                this.view.goTo(graphic_polygon)
            })
        }
        
    }
}

//加载分区标签
export let LoadLeakLabel = {
    methods: {
        LoadLeakLabel(data) {
            var polygonInfo = data.polygonInfo;
            esriLoader.loadModules([
                'esri/Graphic',
            ], window.DSE.options).then(([Graphic]) => {
                var a = [];
                a.push(JSON.parse(polygonInfo))
                let polygon = {
                    type: "polygon", // autocasts as Polygon
                    rings: a,
                    spatialReference: { "wkid": 102100 },
                };

                const path = process.env.NODE_ENV === 'development' ? '/static/gis_temporary_pic/' : './static/gis_temporary_pic/'
                var pictureSymbol = {
                    type: "picture-marker",  // autocasts as new PictureMarkerSymbol()
                    url: path+'leak-background.png' ,
                    width: "70px",
                    height: "30px",
                    xoffset: 0,
                    yoffset: -18,
                  };
                // var leakBackground = new PictureMarkerSymbol(path + 'leak-background.png', 70, 30).setOffset(0, -20);
                var RateTextSymbol = {
                    type: "text",  // autocasts as new TextSymbol()
                    text: data.attributes.leakRate?'漏损率：'+data.attributes.leakRate+'%':'漏损率：--',
                    color: [251, 85, 140],
                    font: {  // autocast as new Font()
                        size: 8,
                        family: "sans-serif",
                        weight: "bold"
                    },
                    xoffset: 0,
                    yoffset: -15,
                };
                var VolumeTextSymbol ={
                    type: "text",  // autocasts as new TextSymbol()
                    text: data.attributes.leakSum?'漏损量：'+data.attributes.leakSum+'吨':'漏损量：--',
                    color: [251, 85, 140],
                    font: {  // autocast as new Font()
                        size: 8,
                        family: "sans-serif",
                        weight: "bold"
                    },
                    xoffset: 0,
                    yoffset: -25,
                }
                var graphic_volume = new Graphic({
                    geometry: polygon,
                    symbol: VolumeTextSymbol,
                    attributes: data.attributes
                });
                var graphic_rate = new Graphic({
                    geometry: polygon,
                    symbol: RateTextSymbol,
                    attributes: data.attributes
                });
                var graphic_Picture = new Graphic({
                    geometry: polygon,
                    symbol: pictureSymbol,
                    attributes: data.attributes
                });
                // var leakBackground_graphic = new Graphic(graphic_polygon.geometry, leakBackground, data.attributes)
                // var Rate_graphic = new Graphic(graphic_polygon.geometry, RateTextSymbol, data.attributes)
                // var Volume_graphic = new Graphic(graphic_polygon.geometry, VolumeTextSymbol, data.attributes)
                var leakLayer = this.map.findLayerById('leakAge');
                leakLayer.add(graphic_Picture)
                leakLayer.add(graphic_volume)
                leakLayer.add(graphic_rate)

                // leakLayer.add(Rate_graphic)
                // leakLayer.add(Volume_graphic)
            })
        }
    }
}
