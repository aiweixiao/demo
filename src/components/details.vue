<template>
  <div class="details">
       <Hd :tit='tit'></Hd>
       <div>
           <group>
                <cell title="工单信息"  class="tit" ></cell>
            </group>  
            <group v-for="item in list" :key="item.id">
                <cell :title="item" >
                        <x-input ></x-input>
                </cell>
            </group>
            <group v-for="item2 in list2" :key="item2.id">
                <cell :title="item2" >
                        <datetime v-model="minuteListValue" format="YYYY-MM-DD HH:mm"  ></datetime>
                </cell>
            </group>
       </div>
        <div>
              <group>
               <cell title="工序过程"  class="tit" ></cell>
             </group>  
              <el-table :data="tableData2"style="width: 100%" :row-key="getRowKey" :expand-row-keys="expandIndex" @row-click="tableRowClick">
                    <el-table-column type="expand">
                        <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="工序编号">
                            <span>{{ props.row.processNumber }}</span>
                            </el-form-item>
                            <el-form-item label="工序名称">
                            <span>{{ props.row.processName }}</span>
                            </el-form-item>
                            <el-form-item label="设备编号">
                            <span>{{ props.row.deviceID }}</span>
                            </el-form-item>
                             <el-form-item label="设备名称">
                            <span>{{ props.row.deviceName }}</span>
                            </el-form-item>
                            <el-form-item label="工序数量">
                            <span>{{ props.row.processQuantity}}</span>
                            </el-form-item>
                            <el-form-item label="操作工">
                            <span>{{ props.row.Operator }}</span>
                            </el-form-item>
                            <el-form-item label="计划开始时间">
                            <span>{{ props.row.planStartTime}}</span>
                            </el-form-item>
                            <el-form-item label="计划完成时间">
                            <span>{{ props.row.plannedCompletionTime }}</span>
                            </el-form-item>
                            <el-form-item label="实际开始时间">
                            <span>{{ props.row.startTime}}</span>
                            </el-form-item>
                            <el-form-item label="实际完成时间">
                            <span>{{ props.row.completionTime}}</span>
                            </el-form-item>
                            <el-form-item label="报工数">
                            <span>{{ props.row.jobDay }}</span>
                            </el-form-item>
                        </el-form>
                        </template>
                    </el-table-column>
                <el-table-column label="工序编号" prop="processNumber"></el-table-column>
                <el-table-column label="工序名称" prop="processName"></el-table-column>
               <el-table-column label="设备编号" prop="deviceID"></el-table-column>
             </el-table>
        </div>
        <div>
            <group>
                <cell title="生产动态"  class="tit" ></cell>
            </group>  
             <div class="device-charts">
                   <div class="produce-main"  :style="{height:'350px',width:'328px' }"></div>
               </div>
        </div>
        <div>
            <group>
                <cell title="问题记录"  class="tit" ></cell>
            </group>
             <x-table :cell-bordered="false" :content-bordered="false" style="background-color:#fff;">
                <thead>
                <tr style="background-color:floralwhite">
                    <th>序号</th>
                    <th>订单号</th>
                    <th>问题描述</th>
                    <th>工厂</th>
                    <th>车间编号</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td v-for="item in list3" :key="item.id">{{item}}</td>
                </tr>
              </tbody>
          </x-table>
          <div class="page">
                 <!-- <p>显示第1至1项结果,共1项</p>
                <el-pagination small layout="prev, pager, next" :total="50"> </el-pagination> -->
                 <flexbox>
                    <flexbox-item><div class="flex-text">显示第1至1项结果,共1项</div></flexbox-item>
                    <flexbox-item><el-pagination small layout="prev, pager, next" :total="50"> </el-pagination></flexbox-item>
                </flexbox>
          </div>
        </div>
           <div>
           <group>
                <cell title="班次信息"  class="tit" ></cell>
            </group>  
            <group v-for="item in list4" :key="item.id">
                <cell :title="item" >
                        <x-input ></x-input>
                </cell>
            </group>
       </div>
      <Fd :active='num'></Fd>
  </div>
</template>
<script>
import Hd from "./herads";
import Fd from "./Fooders";
import { Cell, XInput, Datetime, XTable, Flexbox, FlexboxItem,Group} from "vux";
import echarts from "echarts";
export default {
  data() {
    return {
      num:3,
      tit: "设置",  
      list: ["产品型号", "工单编号", "订单数量", "报工数量"],
      list2: ["计划开始时间", "计划完成时间", "实际开始时间", "实际完成时间"],
      list3:[1,100000,'备注',1100,'JJ01'],
      list4:['车间','操作工','班组'],
      minuteListValue: "2017-06-12 09:00",
      expandIndex:[],
      tableData2: [
        {
          processNumber:'0010',//工序编号
          processName:'精底面',//工序名称
          deviceID:'001',//设备编号
          deviceName:'插件',//设备名称
          processQuantity:'2',//工序数量
          Operator:'张三',//操作工
          jobDay:'28',//报工数
          planStartTime:'2017-06-12',//计划开始时间
          plannedCompletionTime:'2017-06-12',//计划完成时间
          startTime:'2017-06-12',//实际开始时间
          completionTime:'2017-06-12'//实际完成时间      
        },
         {
          processNumber:'0020',//工序编号
          processName:'精底面',//工序名称
          deviceID:'001',//设备编号
          deviceName:'插件',//设备名称
          processQuantity:'2',//工序数量
          Operator:'张三',//操作工
          jobDay:'28',//报工数
          planStartTime:'2017-06-12',//计划开始时间
          plannedCompletionTime:'2017-06-12',//计划完成时间
          startTime:'2017-06-12',//实际开始时间
          completionTime:'2017-06-12'//实际完成时间      
        }
    ]
    };
  },
  components: {
    Group,
    XInput,
    Datetime,
    Flexbox, 
    FlexboxItem,
    XTable,
    Cell,
    Hd, 
    Fd
 },
  mounted() {
    var produceMyChart = echarts.init(document.querySelector(".produce-main"));
    produceMyChart.setOption({
      tooltip: {},
      legend: {
        top:20,
        data: ["计划完成时间"]
      },
      xAxis: {
        data: [1, 2, 3, 4, 5, 6, 7]
      },
      yAxis: {},
      series: [
        { 
          name:'计划完成时间',   
          type: "line",
          data: [10, 10, 10, 10, 10, 10, 10]
        }
      ]
    });
  },
  methods:{
    tableRowClick(row){
      let index = this.tableData2.indexOf(row);
      let inindex = this.expandIndex.indexOf(index);
      if(inindex > -1){
        this.expandIndex.splice(inindex,1);
      }else {
        this.expandIndex.push(index);
      }
    },
    getRowKey(row){
      let index = this.tableData2.indexOf(row);
      return index;
    }
  }
};
</script>
<style>
.details .weui-input {
  border: 1px solid #ccc;
  color: #5a5e66;
}
.details .weui-cell {
  padding: 3px 20px !important;
}
.details .vux-no-group-title {
  margin-top: 0 !important;
}
.details .vux-label {
  font-size: 14px !important;
  color:#99a9bf;
}
.details .tit .vux-label {
  font-size: 16px !important;
  text-align: left;
  color: #878d99;
}
.details .tit {
   background-color: #f5f5f5;
   padding: 5px 10px !important
}
.details .vux-cell-value{
    font-size: 14px !important;
    color: #5a5e66;
}
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
 .details   .el-table__expanded-cell[class*=cell]{
     padding: 15px !important;
 }
 .details .el-form--inline .el-form-item{
     margin-right: 0 !important;
 }
 .details .el-form-item__label,.details .el-form-item__content{
     font-size: 12px !important;
     line-height: 25px !important;
 }
 .details .el-table td,  .details .el-table th{
      padding: 5px 0 !important;
 }
 .produce-main{
     margin: 0 auto;
 }
 .flex-text{
     font-size: 12px;
     color: #5a5e66;
     padding: 0 5px !important;
 }
 .details  .vux-table td,  .details .vux-table th{
   font-size: 14px !important;
   line-height: 35px !important;
 }
 .details .page{
     background-color: #fff;
 }
</style>

