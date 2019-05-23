/**
 *  两点 经纬度  转换成距离
 */

export class Get_lgtd_lttd_dist {
    constructor(lgtd1, lttd1, lgtd2, lttd2) {
        this.lgtd1 = parseFloat(lgtd1);
        this.lttd1 = parseFloat(lttd1);
        this.lgtd2 = parseFloat(lgtd2);
        this.lttd2 = parseFloat(lttd2);
    }
    getDistance() {
        let Lttd1 = this.rad(this.lttd1); // 纬度
        let Lttd2 = this.rad(this.lttd1);
        let a = Lttd1 - Lttd2;//两点纬度之差
        let b = this.rad(this.lgtd1) - this.rad(this.lgtd2); //经度之差
        let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(Lttd1) * Math.cos(Lttd2) * Math.pow(Math.sin(b / 2), 2)));//计算两点距离的公式
        s = s * 6378137.0;//弧长乘地球半径（半径为米）
        s = Math.abs(Math.round(s * 10000) / 10000);//精确距离的数值
        return s;
    }
    rad(d) {
        return d * Math.PI / 180.00; //角度转换成弧度
    }
    static getInstance(lgtd1, lttd1, lgtd2, lttd2) {
        if(!this.instance) {
            this.instance = new Get_lgtd_lttd_dist(lgtd1, lttd1, lgtd2, lttd2);
        }
        return this.instance;
    }
}