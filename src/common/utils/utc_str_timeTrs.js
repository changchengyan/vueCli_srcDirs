/**
 * UTC 格式的日期 转换成字符串日期
 */

export default class TransformTime{
    constructor(val){
        this.utcTime =new Date(val);
        this.year = null;
        this.month = null;
        this.day = null;
        this.hour  = null;
        this.minutes = null;
        this.seconds = null;
    }

    format_yymmdd(){
        let temp_time =this.utcTime;
        temp_time = temp_time.toLocaleDateString();
        this.year = temp_time.split("/")[0];
        this.month  = parseInt(temp_time.split("/")[1])<10?"0"+temp_time.split("/")[1]:temp_time.split("/")[1];
        this.day  = parseInt(temp_time.split("/")[2])<10?"0"+temp_time.split("/")[2]:temp_time.split("/")[2];
        return this.year+"/"+this.month+"/"+this.day;
    }

    format_yymm(){
        let temp_time =this.utcTime;
        temp_time = temp_time.toLocaleDateString();
        this.year = temp_time.split("/")[0];
        this.month  = parseInt(temp_time.split("/")[1])<10?"0"+temp_time.split("/")[1]:temp_time.split("/")[1];
        return this.year+"/"+this.month;
    }
    format_yy(){
        let temp_time =this.utcTime;
        temp_time = temp_time.toLocaleDateString();
        this.year = temp_time.split("/")[0];
        return this.year;
    }
    
}