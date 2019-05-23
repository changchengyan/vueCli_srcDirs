/**
 * 按照如下返回当前日期所在的  年  旬  月 周
 */

export default class JudgeTime {
    /**
     * 
     * @param {} judgeFlag 
     *  '1' 按照年
     *  '2' 按照旬
     *  "3" 按照月
     *  "4" 按照星期
     */
    constructor(judgeFlag) {
        this.judgeFlag = judgeFlag;
        this.startTime = "";
        this.endTime = "";
        this.time = new Date();
        this.instance = null;
    }
    /**
     * 旬
     */
    getByPeriod(month) {
        let data_json = {
            startTime: "",
            endTime: ""
        }
        let temp_month = parseInt(month);
        if (temp_month <= 3 && temp_month >= 1) {
            data_json.startTime = this.time.getFullYear() + "/01/01";
            data_json.endTime = this.time.getFullYear() + "/03/31";
        } else if (temp_month <= 6 && temp_month > 3) {
            data_json.startTime = this.time.getFullYear() + "/04/01";
            data_json.endTime = this.time.getFullYear() + "/06/30";
        } else if (temp_month <= 9 && temp_month > 6) {
            data_json.startTime = this.time.getFullYear() + "/07/01";
            data_json.endTime = this.time.getFullYear() + "/09/30";
        } else {
            data_json.startTime = this.time.getFullYear() + "/10/01";
            data_json.endTime = this.time.getFullYear() + "/12/31";
        }
        return data_json
    }

    /**
     *  按照月
     */
    getByMonth(month) {
        let data_json = {
            startTime: "",
            endTime: ""
        }
        let temp_month = parseInt(month);
        switch (temp_month) {
            case 1:
                data_json.startTime = this.time.getFullYear() + "/01/01";
                data_json.endTime = this.time.getFullYear() + "/01/31";
                break;
            case 2:
                data_json.startTime = this.time.getFullYear() + "/02/01";
                data_json.endTime = this.time.getFullYear() + "/02/30";
                break;
            case 3:
                data_json.startTime = this.time.getFullYear() + "/03/01";
                data_json.endTime = this.time.getFullYear() + "/03/31";
                break;
            case 4:
                data_json.startTime = this.time.getFullYear() + "/04/01";
                data_json.endTime = this.time.getFullYear() + "/04/30";
                break;
            case 5:
                data_json.startTime = this.time.getFullYear() + "/05/01";
                data_json.endTime = this.time.getFullYear() + "/05/31";
                break;
            case 6:
                data_json.startTime = this.time.getFullYear() + "/06/01";
                data_json.endTime = this.time.getFullYear() + "/06/30";
                break;
            case 7:
                data_json.startTime = this.time.getFullYear() + "/07/01";
                data_json.endTime = this.time.getFullYear() + "/07/31";
                break;
            case 8:
                data_json.startTime = this.time.getFullYear() + "/08/01";
                data_json.endTime = this.time.getFullYear() + "/08/31";
                break;
            case 9:
                data_json.startTime = this.time.getFullYear() + "/09/01";
                data_json.endTime = this.time.getFullYear() + "/09/30";
                break;
            case 10:
                data_json.startTime = this.time.getFullYear() + "/10/01";
                data_json.endTime = this.time.getFullYear() + "/10/31";
                break;
            case 11:
                data_json.startTime = this.time.getFullYear() + "/11/01";
                data_json.endTime = this.time.getFullYear() + "/11/30";
                break;
            case 12:
                data_json.startTime = this.time.getFullYear() + "/12/01";
                data_json.endTime = this.time.getFullYear() + "/12/31";
                break;
        }
        return data_json
    }

    /**
     * 按星期  可计算上周的开始或结束时间   开始getByWeek(7)  结束 getByWeek(1)
     * 可计算本周的开始或结束时间   开始getByWeek(0)  结束 getByWeek(-6)
     */
    getByWeek(n) {
        let now = new Date();
        let year = now.getFullYear();
        //因为月份是从0开始的,所以获取这个月的月份数要加1才行
        let month = now.getMonth() + 1;
        let date = now.getDate();
        let day = now.getDay();
        //判断是否为周日,如果不是的话,就让今天的day-1(例如星期二就是2-1)
        if (day !== 0) {
            n = n + (day - 1);
        }
        else {
            n = n + day;
        }
        if (day) {
            //这个判断是为了解决跨年的问题
            if (month > 1) {
                month = month;
            }
            //这个判断是为了解决跨年的问题,月份是从0开始的
            else {
                year = year - 1;
                month = 12;
            }
        }
        now.setDate(now.getDate() - n);
        year = now.getFullYear();
        month = now.getMonth() + 1;
        date = now.getDate();
        let s = year + "/" + (month < 10 ? ('0' + month) : month) + "/" + (date < 10 ? ('0' + date) : date);
        return s;
    }

    formateTime() {
        let flag = this.judgeFlag;
        let thisMonth = this.time.getMonth() + 1 < 10 ? "0" + (this.time.getMonth() + 1) : (this.time.getMonth() + 1);
        let thisDay = this.time.getDate()<10?"0"+this.time.getDate():this.time.getDate()
        switch (flag) {
            case "1":
                this.startTime = this.time.getFullYear() +"/"+thisMonth+"/"+thisDay;
                this.endTime = this.time.getFullYear() + "/12/31";
                break;
            case "2":
                this.startTime = this.getByPeriod(thisMonth).startTime;
                this.endTime = this.getByPeriod(thisMonth).endTime;
                break;
            case "3":
                this.startTime = this.getByMonth(thisMonth).startTime;
                this.endTime = this.getByMonth(thisMonth).endTime;
                break;
            case "4":
                this.startTime = this.getByWeek(0);
                this.endTime = this.getByWeek(-6);

                break;
        }


        return {
            startTime: this.startTime,
            endTime: this.endTime
        }
    }


}