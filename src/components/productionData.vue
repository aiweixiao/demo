<template>
  <div class="productionData">
    <Hd :tit='tit'></Hd>
    <div v-for="(item,i) in list" :key="item.id">
           <group>
            <cell :title="i" :link="item.link" class="fontBig"></cell>
          </group>
           <div class="device-charts" v-if="item.show">
                   <div class="mainBox"  :style="{height:'350px',width:'328px' }"></div>
            </div>
            <flexbox v-for="list in item.list2" :key="list.id">
            <flexbox-item v-for="info in list " :key="info.id">
                    <group>
                        <cell :title="info"></cell>
                    </group>   
            </flexbox-item>
         </flexbox>

    </div>
   <Fd :active='num'></Fd>

  </div>

</template>
<script>
import { Flexbox, Cell, FlexboxItem, XInput, Group } from "vux";
import Hd from "./herads";
import Fd from "./Fooders";
import echarts from "echarts";
export default {
  data() {
    return {
      num:1,  
      tit: "生产数据",
      list: {
        '工单信息': {
          link: "/",
          show: false,
         list2: [["产品型号", "目标产出量"], ["工单编号", "实际生产数量"]]
        },
        '工艺数据': {
          link: "",
          show: false,
          info: []
        },
        '生产动态': {
          show: true
        },
        '班次信息':{
             show: false,
             list2: [["工厂", ""], ["车间", ""], ["班长", ""], ["操作工", ""]]
        }
      },
    };
  },
  components: {
    Flexbox,
    Cell,
    FlexboxItem,
    XInput,
    Group,
    Hd,
    Fd
  },
  mounted() {
    var myChart = echarts.init(document.querySelector(".mainBox"));
    myChart.setOption({
      tooltip: {},
      legend: {
        data: ["PPM"]
      },
      xAxis: {
        data: [1, 2, 3, 4, 5, 6, 7]
      },
      yAxis: {},
      series: [
        {
          type: "line",
          data: [10, 10, 10, 10, 10, 10, 10]
        }
      ]
    });
  }
};
</script>
<style>
.fontBig {
  font-weight: 600;
}
.productionData .weui-cells {
  line-height: 14px !important;
  font-size: 14px !important;
}
.productionData .weui-cell {
  min-height: 14px !important;
}
.productionData .vux-no-group-title {
  margin-top: 5px !important;
}
.mainBox{
    margin: 0 auto;
}
</style>


