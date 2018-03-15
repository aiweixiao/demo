<template>
<div>
   <Hd :tit='tit'></Hd>
  <el-table :data="tableData3" style="width: 100%">
    <el-table-column fixed prop="reason" label="停机原因" width="150"></el-table-column>
    <el-table-column prop="reason1"   label="订单1" width="80"></el-table-column>
    <el-table-column    prop="reason2"   label="订单2" width="80"></el-table-column>
    <el-table-column  prop="reason3" label="订单3"  width="80"></el-table-column>
    <el-table-column  prop="reason4"   label="订单4"   width="80"> </el-table-column>
    <el-table-column  prop="reason5"  label="订单5"   width="80"> </el-table-column>
  </el-table>
   <Fd :active='num'></Fd>
</div>

</template>

<script>
import { Scroller } from "vux";
import Hd from "./herads";
import Fd from "./Fooders";
export default {
  components: {
    Hd,
    Fd,
    Scroller
  },
  data() {
    return {
      num: 2,
      tit: "问题列表",
      tableData3: [
        {
          reason: "原因1",
          reason1: "1",
          reason2: "1",
          reason3: "1",
          reason4: "1",
          reason5: 1
        },
        {
          reason: "原因1",
          reason1: "1",
          reason2: "1",
          reason3: "1",
          reason4: "1",
          reason5: 1
        },
        {
          reason: "原因1",
          reason1: "1",
          reason2: "1",
          reason3: "1",
          reason4: "1",
          reason5: 1
        },
        {
          reason: "原因1",
          reason1: "1",
          reason2: "1",
          reason3: "1",
          reason4: "1",
          reason5: 1
        },
        {
          reason: "原因1",
          reason1: "1",
          reason2: "1",
          reason3: "1",
          reason4: "1",
          reason5: 1
        },
        {
          reason: "原因1",
          reason1: "1",
          reason2: "1",
          reason3: "1",
          reason4: "1",
          reason5: 1
        },
        {
          reason: "停机次数",
          reason1: "4",
          reason2: "4",
          reason3: "4",
          reason4: "4",
          reason5: "4"
        },
        {
          reason: "总停机时常(小时)",
          reason1: "20",
          reason2: "20",
          reason3: "20",
          reason4: "20",
          reason5: "20"
        }
      ]
    };
  }
};
</script>