export default class Arcgis_mkt_jwd {
    /**
     * 
     * @param {*} obj   传入的经纬度数据  数组形式  []
     */
    constructor( arr) {
        this.arr = arr;
    }
    lonlat2mercator() {
        let temp_arr = this.arr;
        let mercator = [0, 0];
        let x = temp_arr[0] * 20037508.34 / 180;
        let y = Math.log(Math.tan((90 + temp_arr[1]) * Math.PI / 360)) / (Math.PI / 180);
        y = y * 20037508.34 / 180;
        mercator[0] = x;
        mercator[1] = y;
        return mercator;
    }
    mercator2lonlat() {
        let temp_arr = this.arr;
        var lonlat = [0, 0];
        var x = temp_arr[0] / 20037508.34 * 180;
        var y = temp_arr[1] / 20037508.34 * 180;
        y = 180 / Math.PI * (2 * Math.atan(Math.exp(y * Math.PI / 180)) - Math.PI / 2);
        lonlat[0] = x;
        lonlat[1] = y;
        return lonlat;
    }
}