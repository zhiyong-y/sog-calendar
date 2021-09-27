<template>
  <div class="popover">popover</div>
</template>

<script>
export default {};
</script>

<style scoped>
.popover {
  position: absolute;
  left: 128px;
  top: -125px;
  z-index: 999;
  background: #fff;
  width: 200px;
  height: 350px;
  border-radius: 6px;
  border: 1px solid #e3e3e3;
  box-shadow: 0 0 10px rgb(0 0 0 / 10%);
  transition: all ease-in-out 1s;
}
.popover::before {
  content: "";
  display: block;
  position: absolute;
  top: 50%;
  left: -10px;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-bottom: 10px solid transparent;
  border-top: 10px solid transparent;
  border-right: 10px solid red;
}
</style>
