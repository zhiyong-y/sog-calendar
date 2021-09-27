<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <SogCalendar
      :scheduleArr="scheduleArr"
      :isDisplaySolarTerm="false"
      style="margin: 50px auto"
      @click="handleClick"
    >
      <!-- <div slot="signin" class="slot">
        <img src="../src/assets/yiqiandao.png" alt="signin">
      </div> -->
    </SogCalendar>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      scheduleArr: [
        // { name: "测试日程安排1", id: 1, date: "2021-09-05" },
        // { name: "测试日程安排1", id: 2, date: "2021-09-05" },
        // { name: "测试日程安排1", id: 3, date: "2021-09-05" },
        // { name: "测试日程安排1", id: 4, date: "2021-09-18" },
      ],
    };
  },
  methods: {
    handleClick(e) {
      console.log(e);
    }
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
.slot {
  width: 100%;
  height: 66px;
  padding: 0 10px 15px 10px;
}
.slot > img {
  height: 100%;
}
</style>
