/**
 *
 * @param {当前时间} date
 * @returns 年月日
 */
const getYearMonthDay = (date) => {
  let year = date.getFullYear();
  let month = date.getMonth();
  let day = date.getDate();
  return { year, month, day };
};
/**
 *
 * @param {年份} year
 * @param {月份} month
 * @param {天} day
 * @returns 返回对应日期格式
 */
const getDate = (year, month, day) => {
  return new Date(year, month, day);
};
const getDateByFormatter = (str) => {
  return new Date(str);
};
/**
 *
 * @param {当月日历数组} calendarArr
 * @param {当月日程数组} scheduleArr
 * @param {强制更新} $set
 * @returns 匹配好的日历数组
 */
const scheduleHandle = (calendarArr, scheduleArr, $set) => {
  calendarArr = calendarArr.map((item) => {
    let _schedule = [];
    scheduleArr.map((s) => {
      let _bool =
        s.date ===
        item.year +
          "-" +
          item.month.toString().padStart(2, "0") +
          "-" +
          item.day.toString().padStart(2, "0");
      if (_bool) {
        _schedule.push(s);
        $set(item, "schedule", _schedule);
        // $set(calendarArr, index, item);
      }
    });
  });
  return calendarArr;
};
/**
 *
 * @param {当月日历数组} calendarArr
 * @param {当月签到数据} signArr
 * @param {强制更新} $set
 * @returns 匹配好的日历数组
 */
const signHandle = (calendarArr, signArr, $set) => {
  calendarArr = calendarArr.map((item) => {
    signArr.map((s) => {
      // console.log(getDateByFormatter(s.date));
      // console.log(getDateByFormatter(item));
      // console.log(item);
      let _bool2 = getDateByFormatter(s.date) === item.date;
      let _bool =
        s.date ===
        item.year +
          "-" +
          item.month.toString().padStart(2, "0") +
          "-" +
          item.day.toString().padStart(2, "0");
      console.log(_bool2);
      if (_bool) {
        // 大于当前时间不展示是否已经签到
        $set(item, "isSign", s.isSignIn);
      }
    });
  });
  return calendarArr;
};
export { getYearMonthDay, getDate, scheduleHandle, signHandle };
