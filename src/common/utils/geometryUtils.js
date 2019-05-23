/**
 * @description 主要用于解决管网数据叠加在地图上时出现的数据偏移问题。
 *
 * @author wangsl
 * */

//@private
function transformLat(x, y) {
    var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(y * pi) + 40.0 * Math.sin(y / 3.0 * pi)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(y / 12.0 * pi) + 320 * Math.sin(y * pi / 30.0)) * 2.0 / 3.0;
    return ret;
}

//@private
function transformLon(x, y) {
    x = parseFloat(x);
    y = parseFloat(y);
    var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(x * pi) + 40.0 * Math.sin(x / 3.0 * pi)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(x / 12.0 * pi) + 300.0 * Math.sin(x / 30.0 * pi)) * 2.0 / 3.0;
    return ret;
}

var pi = Math.PI;

var ee = 0.00669342162296594323, a = 6378245.0;

//
//wgs84 to 火星坐标系 (GCJ-02)
function gps84_To_Gcj02(lon, lat) {
    lat = parseFloat(lat);

    lon = parseFloat(lon);

    var dLat = transformLat(lon - 105.0, lat - 35.0);

    var dLon = transformLon(lon - 105.0, lat - 35.0);

    var radLat = lat / 180.0 * Math.PI;

    var magic = Math.sin(radLat);

    magic = 1 - ee * magic * magic;

    var sqrtMagic = Math.sqrt(magic);

    dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * pi);

    dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * pi);

    var mgLat = lat + dLat;

    var mgLon = lon + dLon;

    return [mgLon, mgLat];
}

/**
 * @description wgs84 to 火星坐标系 (GCJ-02),主要用于线面.
 *
 * @param {Number[[[x,y]]]}  rings arcgis rings 或者 paths
 *
 * @param {String} convertCoordSym 地图类型, 目前只有 google.
 *
 * @return {Array} arcgis rings 或者 paths.
 * */
export function convertGeometrySR(rings, convertCoordSym) {
    //
    // let gc2Gra = {};
    rings = rings || [];
    let newPaths = [];
    rings.forEach((path, index) => {
        //
        let newPath = [];
        path.forEach((path1, index1) => {
            //
            let points = null;
            if (convertCoordSym === 'google') {
                //
                points = gps84_To_Gcj02(path1[0], path1[1]);
            } else {
                //
                points = path1;
            }
            // let points = gps84_To_Gcj02(path1[0], path1[1]);
            newPath.push(points);
        });
        newPaths.push(newPath);
    });

    return newPaths;
}
/**
 * @description wgs84 to 火星坐标系 (GCJ-02),主要用于坐标点.
 *
 * @param {Array} points  经纬度数组. [x,y]
 *
 * @param {String} convertCoordSym 地图类型, 目前只有 google.
 *
 * @return {Array} arcgis rings 或者 paths.
 * */
export function convertGeometryPointSR(points, convertCoordSym) {
    //
    //
    if (convertCoordSym === 'google') {
        return gps84_To_Gcj02(points[0], points[1], convertCoordSym);
    } else {
        //
        return points;
    }
}