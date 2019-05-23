import moment from 'moment';
export const getWeekDates = (date)=>{
    let weeks = [];
    weeks[0] = moment(date).subtract(1, 'days').format('YYYY-MM-DD');
    weeks[1] = moment(date).format('YYYY-MM-DD');
    weeks[2] = moment(date).add(1, 'days').format('YYYY-MM-DD');
    weeks[3] = moment(date).add(2, 'days').format('YYYY-MM-DD');
    weeks[4] = moment(date).add(3, 'days').format('YYYY-MM-DD');
    weeks[5] = moment(date).add(4, 'days').format('YYYY-MM-DD');
    weeks[6] = moment(date).add(5, 'days').format('YYYY-MM-DD');
    return weeks;
}