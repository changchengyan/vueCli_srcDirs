/**
 *
 * @param year
 * @param month
 * @returns {number}  返回 当前月份的 天数
 */

export default function monthDays (year,month) {

    let d = new Date(year, month, 0);

    return d.getDate();


}