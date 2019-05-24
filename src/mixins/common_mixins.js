import monthDays from '../utils/month_days';

import Lunar from '../utils/lunar_solar';

export let monthDayList = {
    data(){
        return{
            yearList:[],
            yearItem: null,
            monthList:[],
            monthItem:null,
        };
    },
    methods: {
        monthDayList(year, month) {
            let dayList = [];
            let dayNum = monthDays(year, month);
            for (let i = 0; i < dayNum; i++) {
                let temp_json = {};
                let temp_day = i + 1;
                temp_json.day = '' + (i + 1);
                temp_json.lunar = (Lunar.toLunar(year, month, temp_day))[6];
                temp_json.status = false;
                dayList.push(temp_json);
            }

            return dayList;
        },
        mergeFetchMonthList(year, month, fetchList) {
            let that = this;
            let bgList = [];
            if (fetchList && fetchList.length > 0) {
                bgList =fetchList.concat(that.monthDayList(year, month));
            } else {
                bgList = this.monthDayList(year, month);
            }
            const res = new Map();
            let newList = bgList.filter((a) => !res.has(a.day) && res.set(a, 1));
            newList = that.funTool.chunk(newList,7);
            return newList;
        },
        yearList_(){
            let list = [];
            let date = new Date();
            let year = date.getFullYear();
            for(let i=0;i<10;i++){
                let temp_json = {};
                temp_json.label = (year-i)+'';
                temp_json.value = year -i;
                list.push(temp_json);
            }
            return list;
        },
        monthList_(){
            let list = [];
            // let date = new Date();
            // let month = date.getMonth()+1;
            for(let i=1;i<=12;i++){
                let temp_json = {};
                temp_json.label = i+'';
                temp_json.value = i;
                list.push(temp_json);
            }
            return list;
        }
    },
    mounted(){

    }
};