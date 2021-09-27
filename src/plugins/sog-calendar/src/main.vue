<template>
  <div class="calendar-box">
    <div class="select-mode"></div>
    <div class="tools-box flex">
      <div class="con-tips flex-10">{{ year }}年{{ month + 1 }}月</div>
      <div class="switch-box flex-1 flex">
        <div class="pre-btn flex-1 iconfont" @click="getPreDate">&#xe603;</div>
        <div class="now-btn flex-1" @click="getNowDate">今天</div>
        <div class="next-btn flex-1 iconfont" @click="getNextDate">
          &#xe61f;
        </div>
      </div>
    </div>
    <div class="weeks-box flex">
      <div class="week flex-1" v-for="(item, index) in weekLabel" :key="index">
        {{ item }}
      </div>
    </div>
    <div class="date-box flex">
      <div
        class="day flex-1"
        v-for="(item, index) in calendarArr"
        :key="index"
        :class="[
          { 'no-current-month': !isCurrentMonth(item.date) },
          { today: isCurrentDay(item.year, item.month, item.day) },
          { active: currentSelected == item },
          { weekend: isWeekend(item.week) },
        ]"
        @click="handleClick(item, $event)"
        @dblclick="handleDbClick"
      >
        <!-- 农历日期 -->
        <div class="date-label flex">
          <span class="flex-1">{{ item.day }}</span>
          <span class="flex-1">{{ item.lunar }}</span>
        </div>
        <!-- 二十四节气 -->
        <div
          class="solar-term flex-1"
          v-if="item.solarTerm && item.solarTerm != ''"
        >
          {{ item.solarTerm }}
        </div>
        <!-- 当日日程，如果当日日程大于4，点击查看详情 -->
        <div
          class="schedule-box"
          v-if="item.schedule && item.schedule.length > 0"
        >
          <div
            class="schedule-item flex-1"
            v-for="(s, i) in item.schedule.slice(0, 2)"
            :key="i"
          >
            {{ s.name }}
          </div>
          <div class="schedule-tips" v-if="item.schedule.length > 2">
            查看更多
          </div>
        </div>
        <div class="signin">
          <img
            src="../img/yiqiandao.png"
            alt="signin"
            v-if="item.isSign === 1"
          />
          <img
            src="../img/weiqiandao.png"
            alt="signin"
            v-else-if="item.isSign === 0"
          />
        </div>
        <!-- 扩展插槽 -->
        <slot name="signin"></slot>
        <transition name="slide-fade">
          <popover v-if="currentSelected == item && open"></popover>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getYearMonthDay,
  getDate,
  scheduleHandle,
  signHandle,
} from "../util/util";
import calendar from "../util/Calendar";
import popover from "./popover.vue";
export default {
  components: {
    popover,
  },
  name: "SogCalendar",
  props: {
    /**
     * 星期展示label
     */
    weekLabel: {
      type: Array,
      required: false,
      default: () => ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
    },
    /**
     * 当月的日程数组
     */
    scheduleArr: {
      type: Array,
      required: false,
      default: () => [],
    },
    /**
     * 是否展示二十四节气
     */
    isDisplaySolarTerm: {
      type: Boolean,
      required: false,
      default: true,
    },
    /**
     * 签到数据数组
     * 相应的业务场景，有需要传数组
     */
    signArr: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  data() {
    return {
      days: 42, // 日历展示35天/42天
      calendarArr: [],
      year: null,
      month: null,
      day: null,
      timer: null,
      currentSelected: null,
      open: false,
    };
  },
  created() {
    this.initCalendar(new Date());
  },
  methods: {
    /**
     * 1. 获取当前年月日 2021/09/25
     * 2. 获取当月第一天 2021/09/01
     * 3. 判断当月第一天是周几
     * 4. 用上月的最后几天补全
     */
    initCalendar(date) {
      // clear arr
      this.calendarArr = [];
      // 当前年月日
      let { year, month, day } = getYearMonthDay(date);
      this.year = year;
      this.month = month;
      this.day = day;
      // 当月第一天
      let currentMonthFirstDay = getDate(year, month, 1);
      // 当月第一天周几
      let currentMonthFirstDayWeek = currentMonthFirstDay.getDay();

      // 差值，即当月1号之前的补位
      let startDate =
        currentMonthFirstDay - currentMonthFirstDayWeek * 24 * 3600 * 1000;
      for (let i = 0; i < this.days; i++) {
        let dateObj = {};
        let _date = new Date(startDate + i * 24 * 3600 * 1000);
        dateObj.date = _date;
        dateObj.year = _date.getFullYear();
        dateObj.month = _date.getMonth() + 1;
        dateObj.day = _date.getDate();
        dateObj.week = dateObj.date.getDay();
        // 处理农历月份
        dateObj.lunar = calendar(_date).lunarDayCn.includes("初一")
          ? calendar(_date).lunarMonthCn + calendar(_date).lunarDayCn
          : calendar(_date).lunarDayCn;
        // 当日对应节气
        this.isDisplaySolarTerm
          ? (dateObj.solarTerm = calendar(_date).solarTerm)
          : null;

        // 默认当日选中
        if (
          dateObj.year === year &&
          dateObj.month === month + 1 &&
          dateObj.day === day
        ) {
          this.currentSelected = dateObj;
        }
        this.calendarArr.push(dateObj);
      }
      // 日历数据准备完成后匹配日程数据
      scheduleHandle(this.calendarArr, this.scheduleArr, this.$set);
      // 匹配签到数据
      signHandle(this.calendarArr, this.signArr, this.$set);
    },
    isCurrentMonth(date) {
      // let { year: curYear, month: curMonth } = getYearMonthDay(new Date());
      let { year, month } = getYearMonthDay(date);
      return this.year === year && this.month === month;
    },
    isCurrentDay(year, month, day) {
      let {
        year: curYear,
        month: curMonth,
        day: curDay,
      } = getYearMonthDay(new Date());
      return year === curYear && month === curMonth + 1 && day === curDay;
    },
    isWeekend(week) {
      return week === 0 || week === 6;
    },
    getPreDate() {
      let _pre = null;
      if (this.month === 1) {
        _pre = getDate(this.year - 1, 12, this.day);
      } else {
        _pre = getDate(this.year, this.month - 1, this.day);
      }
      this.initCalendar(_pre);
    },
    getNextDate() {
      let _next = null;
      if (this.month === 12) {
        _next = getDate(this.year + 1, 1, this.day);
      } else {
        _next = getDate(this.year, this.month + 1, this.day);
      }
      this.initCalendar(_next);
    },
    getNowDate() {
      this.initCalendar(new Date());
    },
    handleClick(selectedDay, e) {
      let timers = this.timer;
      if (timers) {
        clearTimeout(timers);
        this.timer = null;
        this.currentSelected = selectedDay;
        // this.open = this.open ? false : true;
      } else {
        this.timer = setTimeout(() => {
          this.currentSelected = selectedDay;
          // this.open = this.open ? false : true;
          // 更新当前点击时间
          this.day = selectedDay.day;
        });
      }
      this.$emit("click", e);
    },
    handleDbClick() {
      let timers = this.timer;
      if (timers) {
        clearTimeout(timers);
        this.timer = null;
      }
      console.log("dbclick");
    },
  },
};
</script>

<style scoped>
@import url("../css/style.css");
.calendar-box {
  width: 840px;
  min-width: 840px;
  border-bottom: 1px solid var(--border-color);
}
/* 当前月份展示title */
.tools-box .con-tips {
  text-align: left;
  font-size: var(--title-font-size);
  font-weight: 500;
  padding: 6px 0;
}
/* 切换月份 */
.tools-box .switch-box {
  text-align: right;
}
.tools-box .switch-box > div {
  text-align: center;
  line-height: 20px;
  border-radius: 4px;
  cursor: pointer;
  margin: 10px 0;
  color: #333;
}
.tools-box .switch-box > div:hover {
  background: #f4f4f4;
}
.tools-box .switch-box .pre-btn,
.tools-box .switch-box .next-btn {
  width: 20px;
  min-width: 20px;
  max-width: 20px;
  height: 20px;
  min-height: 20px;
  max-height: 20px;
  font-size: 12px;
  border: 1px solid var(--border-color);
}
.tools-box .switch-box .now-btn {
  width: 40px;
  min-width: 40px;
  max-width: 40px;
  height: 20px;
  min-height: 20px;
  max-height: 20px;
  font-size: 12px;
  border: 1px solid var(--border-color);
}

.calendar-box .date-box,
.calendar-box .weeks-box {
  flex-wrap: wrap;
}

/* 每天的容器 */
.calendar-box .date-box > .day {
  width: 120px;
  min-width: 120px;
  max-width: 120px;
  height: 100px;
  min-height: 100px;
  max-height: 100px;
  border-top: 1px solid var(--border-color);
  border-left: 1px solid var(--border-color);
  /* cursor: pointer; */
}
.calendar-box .date-box > .day:hover {
  background: #f4f4f4;
}
.calendar-box .date-box > .day:nth-child(7n) {
  border-right: 1px solid var(--border-color);
}
/** 农历日期 */
.calendar-box .date-box .date-label {
  padding: 6px 6px;
}
.calendar-box .date-box .date-label > span:first-child {
  text-align: left;
}
.calendar-box .date-box .date-label > span:last-child {
  font-size: 12px;
  text-align: right;
}
/** 节气以及日程 */
/* .calendar-box .date-box > .day > div:not(.date-label), */
.calendar-box
  .date-box
  > .day
  > div:not(.date-label):not(.schedule-box):not(.slot):not(.popover):not(.signin) {
  width: 90%;
  min-width: 90%;
  max-width: 90%;
  height: 18px;
  min-height: 18px;
  max-height: 18px;
  margin: 0 auto;
  line-height: 14px;
  font-size: 12px;
  text-align: left;
  padding: 2px 4px;
  box-sizing: border-box;
  color: #333;
  border-radius: 2px;
  margin-bottom: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.calendar-box .date-box .solar-term {
  background: #d9f4d1;
}
/**日程 */
.calendar-box .date-box .schedule-box {
  width: 90%;
  min-width: 90%;
  max-width: 90%;
  margin: 0 auto;
  box-sizing: border-box;
  color: #333;
}
.calendar-box .date-box .schedule-item {
  height: 18px;
  min-height: 18px;
  max-height: 18px;
  line-height: 14px;
  font-size: 12px;
  text-align: left;
  padding: 2px 4px;
  background: #bf56d9;
  border-radius: 2px;
  margin-bottom: 2px;
}
.calendar-box .date-box .schedule-tips {
  height: 18px;
  min-height: 18px;
  max-height: 18px;
  line-height: 14px;
  font-size: 12px;
  padding: 2px 4px;
  border-radius: 2px;
  margin-top: 4px;
  cursor: pointer;
}

.calendar-box .weeks-box > .week {
  width: 120px;
  min-width: 120px;
  max-width: 120px;
  height: 30px;
  min-height: 30px;
  max-height: 30px;
  text-align: right;
  font-size: 12px;
  border-top: 1px solid var(--border-color);
  border-left: 1px solid var(--border-color);
  line-height: 30px;
  padding: 0 10px;
}
.calendar-box .weeks-box > .week:last-child {
  border-right: 1px solid var(--border-color);
}

.no-current-month {
  color: #c8c8c8;
}
.calendar-box .date-box > .day.active {
  border: 2px solid red;
}
.calendar-box .date-box > .day.today .date-label > span:nth-child(1) {
  display: block;
  width: 25px;
  height: 25px;
  min-width: 25px;
  max-width: 25px;
  padding: 4px;
  background: red;
  border-radius: 50%;
  font-size: 14px;
  text-align: center;
  color: #fff;
}
.weekend {
  background: #f4f4f4;
}

/* vue组件动画 */
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}

.signin {
  width: 100%;
  height: 66px;
  padding: 0 10px 15px 10px;
}
.signin > img {
  height: 100%;
}
</style>
