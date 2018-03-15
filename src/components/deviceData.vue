<template>
  <div class="deviceData">  
      <Hd :tit='tit'></Hd>
    <div class="device-info">
        <flexbox>
            <flexbox-item>
                <div>
                    <group v-for="item in deviceInfo" :key="item.id">
                        <cell :title="item.tit" :link="item.link"  :class='{fontBig:item.fontBig}'></cell>
                    </group>                 
                </div>
            </flexbox-item>
            
              <div  class="device-img">
                  <img :src="devicePic"  alt="设备图片">
              </div>
           
    </flexbox>
    </div>
    <div class="work-info">
        <group>
            <cell title="工单信息" link="/" class="fontBig"></cell>
        </group>
        <flexbox>
            <flexbox-item v-for="item in workInfo" :key="item.id">
                <div>
                    <group v-for="info in item.text" :key="info.id">
                        <cell :title="info" ></cell>
                    </group>
                    
                </div>
            </flexbox-item>
    </flexbox>
    </div>
     
     <div>
          <group>
            <cell title="历史曲线" link="/" ></cell>
        </group>
     
     <flexbox>
            <flexbox-item>
                <div class="device-charts">
                   <div class="main"  :style="{height:'350px',width:'328px' }"></div>
               </div>
            </flexbox-item>
     </flexbox>       
  </div>

    <div>
          <group>
            <cell title="参数仪盘表" link="/" class="fontBig"></cell>
        </group>
     
     <flexbox>
            <flexbox-item>
                <div class="device-charts">
                   <div class="main2"  :style="{height:'300px',width:'282px' }"></div>
               </div>
            </flexbox-item>
     </flexbox> 
      <flexbox>
            <flexbox-item>
                <div class="device-charts">
                   <div class="main3"  :style="{height:'300px',width:'282px' }"></div>
               </div>
            </flexbox-item>
     </flexbox>       
  </div>
   
  <div>
          
          <group>
            <cell title="设备运行参数" link="/" class="fontBig" ></cell>
        </group>
     
     <flexbox v-for="item in chanegeNum" :key="item.id">
            <flexbox-item v-for="num in item.text" :key="num.id">
                <group>
                    <x-input :title="num" ></x-input>
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
      num:0,
      tit: "设备数据",
      deviceInfo: [
        { tit: "设备资料", fontBig: true, link: "/" },
        { tit: "生产线", fontBig: false },
        { tit: "设备编码", fontBig: false },
        { tit: "设备状态", fontBig: false }
      ],
      devicePic: require("../assets/logo.png"),
      workInfo: [{ text: ["产品型号", "目标产出量"] }, { text: ["工单编号", "实际生产数量"] }],
      chanegeNum: [
        { text: ["变量1", "变量2"] },
        { text: ["变量3", "变量4"] },
        { text: ["变量5", "变量6"] },
        { text: ["变量7", "变量8"] },
        { text: ["变量9", "变量10"] }
      ]
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
    var myChart1 = echarts.init(document.querySelector(".main"));
    myChart1.setOption({
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
          data: [10, 13, 10, 10, 8, 10, 10]
        }
      ]
    });
    var myChart2 = echarts.init(document.querySelector(".main2"));
    myChart2.setOption({
      title: {
        text: "主轴功率" //标题文本内容
      },
      toolbox: {
        //可视化的工具箱
        show: true,
        feature: {
          restore: {
            //重置
            show: false
          },
          saveAsImage: {
            //保存图片
            show: false
          }
        }
      },
      tooltip: {
        //弹窗组件
        formatter: "{a} <br/>{b} : {c}%"
      },
      series: [
        {
          name: "主轴转速",
          type: "gauge",
          detail: { formatter: "{value}%" },
          data: [{ value: 45, name: "完成率" }]
        }
      ]
    });
    var myChart3 = echarts.init(document.querySelector(".main3"));
    myChart3.setOption({
      title: {
        text: "业务指标" //标题文本内容
      },
      toolbox: {
        //可视化的工具箱
        show: true,
        feature: {
          restore: {
            //重置
            show: false
          },
          saveAsImage: {
            //保存图片
            show: false
          }
        }
      },
      tooltip: {
        //弹窗组件
        formatter: "{a} <br/>{b} : {c}%"
      },
      series: [
        {
          name: "业务指标",
          type: "gauge",
          detail: { formatter: "{value}%" },
          data: [{ value: 45, name: "完成率" }]
        }
      ]
    });
  }
};
</script>
<style>
.deviceData .weui-cells {
  line-height: 14px !important;
  font-size: 14px !important;
}
.device-img {
  display: block;
  width: 120px;
  height: 156px;
  overflow: hidden;
  display: flex;
  display: -webkit-flex;
  align-items: center;
  justify-content: center;
  margin-left: 6px;
}
.device-img > img {
  max-width: 100%;
}
.device-charts {
  background-color: #fff;
}
.deviceData .weui-input {
  border: 1px solid #d9d9d9;
}
.fontBig {
  font-weight: 600;
}
.main,
.main2,
.main3 {
  margin: 0 auto;
}
.deviceData .vux-no-group-title {
  margin-top: 5px !important;
}
</style>

