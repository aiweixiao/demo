<template>
  <footer class="ui-fd">
     <ul class="ui-fd-nav">
         <li v-for="(item,index) in menu" :key="item.id"  class="iconfont ui-fd-nav-item" :class="[item.icon,{navActive:index===activeNum}]" @click="itemClick(index)">
              <span> {{item.text}}</span>
         </li>
     </ul>
     <div class="ui-placeholder"></div>
  </footer>
</template>
<script>
export default {
  props: ["active"],
  data() {
    return {
      menu: [
        { icon: "icon-shuju1", text: "数据", url: "/DeviceData" },
        { icon: "icon-shuju", text: "生产数据", url: "/ProductionData" },
        { icon: "icon-wentiliebiao", text: "问题列表", url: "/Problem" },
        // { icon: "icon-shezhi", text: "设置", url: "/Details" }
      ],
      activeNum: 0
    };
  },
  methods: {
    itemClick: function(index, item) {
      this.activeNum = index;
      this.$router.push({
        path: this.menu[index].url
      });
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      this.activeNum = this.active;
    });
  }

};
</script>
<style lang="less">
.ui-fd-nav-item {
  width: 100%;
  color: #a1a1a1;
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.navActive,
.navActive > span,.navActive{
  color: #358fc5 !important;
}
.ui-fd-nav {
  width: 100%;
  position: fixed;
  left: 0;
  bottom: 0;
  height: 50px;
  background: #fff;
  display: flex;
  display: -webkit-flex;
  justify-content: space-around;
  border-top: 1px solid #ccc;
  z-index: 9999;
}
.ui-fd-nav .iconfont {
  font-size: 20px;
}
.ui-fd-nav-item > span {
  font-family: -apple-system-font, "Helvetica Neue", sans-serif !important;
  color: #a1a1a1;
  font-size: 12px;
  margin-top: -8px;
  line-height: 21px;
}
.ui-fd .ui-placeholder {
  width: 100%;
  height: 51px;
  margin-bottom: 0;
}
</style>

