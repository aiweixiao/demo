import Vue from 'vue';
import VueRouter from 'vue-router';
import DeviceData from '../components/deviceData';
import ProductionData from '../components/productionData';
import Problem from '../components/problem';
import Details from '../components/details';


Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'DeviceData',
    component: DeviceData
  },
  {
    path: '/ProductionData',
    name: 'ProductionData',
    component: ProductionData
  },
  {
    path: '/Problem',
    name: 'Problem',
    component: Problem
  },
  {
    path: '/Details',
    name: 'Details',
    component: Details
  }
];
const router = new VueRouter({
  routes
});
export default router;
