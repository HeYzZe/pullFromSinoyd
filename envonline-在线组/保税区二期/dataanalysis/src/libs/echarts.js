import Echarts from 'echarts';

export default {
  install(Vue) {
    // eslint-disable-next-line
    Vue.echarts = Vue.prototype.$echarts = Echarts;
  },
};
