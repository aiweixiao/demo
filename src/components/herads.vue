<template>
 <div>
    <div class="heard">
      <div class="herad-infro">
         <h3 class="herad-infro-tit">{{tit}}</h3>
         <i class="iconfont icon-scan" @click="scanCode"></i>
      </div>
    </div>
    <div style="height:43px"></div>
 </div>
</template>
<script>
import Top from "../util/Jtxy-mobile";

export default {
  props: ["tit"],
  data() {
    return {
      barCode: ""
  
    };
  },
  created:function(){
                this.$message("barCode");

  },
  methods: {
    goReturn() {
      this.$router.go(-1);
    },
    scanCode() {
        let self = this;
      TOP.scm.selector.scanCode(barCode => {
        self.barCode = JSON.parse(barCode);
                self.$message(barCode);

      });
    }
  }
};
</script>
<style lang="less">
.heard {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  background-color: #fff;
  border-bottom: 1px solid #ccc;
}

.herad-infro {
  position: relative;
}

.herad-infro-tit {
  font-size: 14px;
  color: #666;
  text-align: center;
}
.herad-infro .iconfont {
  position: absolute;
  right: 0px;
  top: -2px;
  color: #358fc5;
  font-size: 18px;
}
</style>


