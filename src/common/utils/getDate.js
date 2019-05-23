/**
 *  日期的格式化  当前时间  yy-mm-dd 
 * 或者是  yy-mm-dd hh-mm-ss
 */

export  default class GetDate{
    constructor(){
        this.date = new Date();
        this.year = this.date.getFullYear();
        this.month = this.date.getMonth()+1<10 ?"0"+(this.date.getMonth()+1):this.date.getMonth()+1;
        this.day = this.date.getDate()<10?"0"+this.date.getDate():this.date.getDate();
        this.hour = this.date.getHours()<10?"0"+(this.date.getHours()):this.date.getHours();
        this.min = this.date.getMinutes()<10?"0"+(this.date.getMinutes()):this.date.getMinutes();
        this.sec = this.date.getSeconds()<10?"0"+(this.date.getSeconds()):this.date.getSeconds();
        this.instance = null;
    }
    static getInstance() {
        if(!this.instance) {
            this.instance = new GetDate();
        }
        return this.instance;
    }
    getDate(){
        return this.year+"-"+this.month+"-"+this.day;
    }
    getFullDate(){
        return this.year+"-"+this.month+"-"+this.day+ " "+this.hour+":"+this.min+":"+this.sec;
    }

    getDate_time(type){
        /**
         * type 代表当前所选择的时间段
         * “0”  一个小时以内
         * “1”  12个小时以内
         * ”2“  24个小时以内 
         */
        let timestamp = new Date().getTime();//当前的时间戳
        if(type=="0"){
            timestamp = timestamp - 1 * 60 * 60 * 1000;
        }else if(type=='1'){
            timestamp = timestamp - 12 * 60 * 60 * 1000;
        }else{
            timestamp = timestamp - 24 * 60 * 60 * 1000;
        }
        let  dateBefore = new Date(timestamp);
        let s_year = dateBefore.getFullYear()
        let s_month = dateBefore.getMonth()+1<10?"0"+( dateBefore.getMonth()+1): dateBefore.getMonth()+1;
        let s_day = dateBefore.getDate()<10?"0"+dateBefore.getDate():dateBefore.getDate()
        let s_hours = dateBefore.getHours()<10?"0"+(dateBefore.getHours()):dateBefore.getHours()
        let s_mins = dateBefore.getMinutes()<10?"0"+(dateBefore.getMinutes()):dateBefore.getMinutes()
        let s_secs = dateBefore.getSeconds()<10?"0"+( dateBefore.getSeconds()): dateBefore.getSeconds()
        let endTime = this.getFullDate()
        let startTime = s_year+"-"+s_month+"-"+s_day+" "+s_hours+":"+s_mins+":"+s_secs
        return  {
                startTime:startTime,
                endTime:endTime
            }
    }
}