<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <SogCalendar :scheduleArr="scheduleArr" style="margin: 0 auto" />
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      scheduleArr: [
        { name: "测试日程安排1", id: 1, date: "2021-09-05" },
        { name: "测试日程安排1", id: 2, date: "2021-09-05" },
        { name: "测试日程安排1", id: 3, date: "2021-09-05" },
        { name: "测试日程安排1", id: 4, date: "2021-09-18" },
      ],
    };
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
