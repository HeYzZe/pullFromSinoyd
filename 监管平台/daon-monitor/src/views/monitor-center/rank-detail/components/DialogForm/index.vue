<template>
  <a-modal
    class="DialogForm-modal"
    width="1440px"
    :title="title"
    :visible="isVisible"
    :maskClosable="false"
    :centered="true"
    :footer="false"
    @cancel="closeDialog"
  >
    <a-spin :spinning="loading.spinning">
      <!-- 检索表单 -->
      <div>
        <a-form layout="inline" class="form-class">
          <a-form-item label="年度：">
            <a-date-picker
              mode="year"
              format="YYYY"
              v-model="queryForm.year"
              placeholder="请选择年份"
              :allowClear="false"
              :open="isOpen"
              @openChange="_openChange"
              @panelChange="_panaelChange"
              :disabled="true"
              style="width:150px">
            </a-date-picker>
          </a-form-item>
          <a-form-item :label="`${item.periodText === 'season' ? '评分季度：' : '评分月度：'}`">
            <a-select v-model="queryForm.index" style="width: 120px">
              <a-select-option
                v-for="(item, index) in item.periodText === 'season' ? quarterData : mouthData"
                :value="index+1"
                :key="index">
              {{item}}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item class="mar-r-0">
            <a-button type="primary" icon="search" @click="onQueryList">查 询</a-button>
          </a-form-item>
        </a-form>
      </div>
      <div class="spin-content">
        <div class="left">
          <div class="echarts-class">
            <p class="title">{{item.year}}年度{{togetherName()}}扣分明细</p>
            <div ref="myChart" style="height: 300px"></div>
          </div>
          <div class="score-class">
            <p class="title">{{item.year}}年度{{togetherName()}}得分</p>
            <div class="first-circle-class">
              <div class="second-circle-class">
                <div class="third-circle-class">
                  <p class="score">{{resData.points}}</p>
                  <p class="type">得分</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="table-class">
          <span class="title">{{item.year}}年度{{togetherName()}}{{isAuto? '自动得分' : '重大事件扣分'}}</span>
          <span style="margin-left:20px;color:#aaaeb8" v-if="isAuto">
            <a-icon type="exclamation-circle" theme="filled"></a-icon>
            <span style="margin-left:5px">说明：自动得分等于所有点位扣分数的平均值</span>
          </span>
          <div style="height: calc(100% - 38px);padding: 10px;">
            <a-tabs @change="callback" type="card" v-model="activeKey">
              <a-tab-pane tab="自动扣分明细" key="1">
                <auto-table
                  ref="AutoTable"
                  :year="queryForm.year.format('l').slice(0, 4)"
                  :index="queryForm.index"
                  :companyId="companyId"/>
              </a-tab-pane>
              <a-tab-pane tab="手动扣分明细" key="2">
                <matt-table
                  ref="MattTable"
                  :year="queryForm.year.format('l').slice(0, 4)"
                  :index="queryForm.index"
                  :companyId="companyId"/>
              </a-tab-pane>
            </a-tabs>
          </div>
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
import moment from 'moment';
import echarts from 'echarts';
import AutoTable from './components/auto-table';
import MattTable from './components/matt-table';
import { emptyFormQuery, getFormList } from '@/api/modules/rank-detail.js';

export default {
  name: 'DialogForm',
  components: {
    AutoTable,
    MattTable,
  },
  data() {
    return {
      activeKey: '1',
      title: '',
      companyId: '',
      queryForm: emptyFormQuery(),
      isVisible: false,
      loading: {
        spinning: false,
        tip: '数据加载中',
      },
      myChart: null,
      isOpen: false,
      option: {
        color: ['#C6DE12', '#219DDB', '#2EB974'],
        grid: {
          right: '20%',
          top: '5%',
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)',
        },
        series: [
          {
            type: 'pie',
            radius: [30, 60],
            center: ['50%', '50%'],
            roseType: 'area',
            label: {
              show: true,
              formatter: (e) => {   // 让series 中的文字进行换行
                let newStr;
                let start;
                let end;
                const nameLen = e.name.length; // 每个内容名称的长度
                const maxName = 4; // 每行最多显示的字数
                const newRow = Math.ceil(nameLen / maxName); // 最多能显示几行，向上取整比如2.1就是3行
                if (nameLen > maxName) { // 如果长度大于每行最多显示的字数
                  for (let i = 0; i < newRow; i++) { // 循环次数就是行数
                    let old = ''; // 每次截取的字符
                    start = i * maxName; // 截取的起点
                    end = start + maxName; // 截取的终点
                    if (i === newRow - 1) { // 最后一行就不换行了
                      old = e.name.substring(start);
                    } else {
                      // eslint-disable-next-line
                      old = e.name.substring(start, end) + '\n';
                    }
                    newStr += old; // 拼接字符串
                  }
                } else { // 如果小于每行最多显示的字数就返回原来的字符串
                  newStr = e.name;
                }
                return newStr.replace(new RegExp('undefined', 'g'), '');
              },
            },
            labelLine: {
              normal: {
                length: 10,
              },
            },
            data: [],
          },
        ],
      },
      item: {
        year: '2019',
      },
      quarterData: ['第一季度', '第二季度', '第三季度', '第四季度'],
      mouthData: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      // 接口获取的数据
      resData: {},
      isAuto: true,
      index: '',
    };
  },

  methods: {
    // 根据季度/月份转换描述
    togetherName() {
      // 当为月度时
      /* eslint-disable */
      if (this.item.periodText === 'month') {
        return this.mouthData.filter((val, index) => index === this.index - 1)[0];
      } else {
        return this.quarterData.filter((val, index) => index === this.index - 1)[0];
      }
    },
    // 标签页切换事件
    callback(key) {
      if (key === '1') {
        this.isAuto = true;
        this.getAutoData();
      } else {
        this.isAuto = false;
        this.getDiyData();
      }
    },
    // 日期选择器日历面板显示
    _openChange(val) {
      this.isOpen = val;
    },
    // 选择日期日历面板隐藏
    _panaelChange(val) {
      if (val) {
        this.isOpen = false;
        this.queryForm.year = val;
      }
    },
    onQueryList() {
      this.index = this.queryForm.index;
      this.getData(this.queryForm, this.item.companyId);
    },
    // 弹框显示
    openDialog(item) {
      this.isVisible = true;
      this.item = item;
      if (item.periodText === 'month') {
        // 设置月度默认值
        if (moment().month() === 0) {
          this.queryForm.index = 11;
        } else {
          this.queryForm.index = moment().month();
        }
      } else {
        // 设置季度默认值
        /* eslint-disable */
        if (1 <= moment().month() + 1 <= 3) {
          this.queryForm.index = 1;
        } else if (4 <= moment().month() + 1 <= 6) {
          this.queryForm.index = 2;
        } else if (7 <= moment().month() + 1 <= 9) {
          this.queryForm.index = 3;
        } else {
          this.queryForm.index = 4;
        }
      }
      this.index = this.queryForm.index;
      this.getData(this.queryForm, item.companyId);
    },
    // 获取图表数据
    getData(queryForm, id) {
      this.loading.spinning = true;
      getFormList(queryForm, id).then((res) => {
        if (res.data.success && res.data.code === 200) {
          this.option.series[0].data = [];
          this.resData = res.data.data;
          this.loading.spinning = false;
          // // 传递企业id、年度、季度、月度（index）到组件
          // 当获取的数据对象为空时
          if (!this.resData.list) {
            if (this.activeKey === '1') {
              this.$refs.AutoTable.autoItemList = [];
            } else {
              this.$refs.MattTable.mattItemList = [];
            }
            this.myChart.clear();
            return;
          }
          // 判断当时的状态
          if (this.activeKey === '1') {
            this.getAutoData();
          } else {
            this.getDiyData();
          }
          this.$nextTick(() => {
            this.drawEchart();
          });
        } else {
          if (this.activeKey === '1') {
            this.$refs.AutoTable.autoItemList = [];
          } else {
            this.$refs.MattTable.mattItemList = [];
          }
          this.loading.spinning = false;
          this.$message.error(res.data.msg);
        }
      });
    },
    // 弹框隐藏
    closeDialog() {
      // 初始化状态
      this.queryForm.year = moment().endOf('year');
      this.queryForm.index = 1;
      this.option.series[0].data = [];
      this.activeKey = '1';
      this.isVisible = false;
    },
    drawEchart() {
      this.resData.list.forEach((el) => {
        if (el.pointType === 0) {  // 为是否聘用运维公司时
          if (!el.idList) {
            this.option.series[0].data.push({ value: Math.abs(el.sumPoint ? el.sumPoint : 0), name: '是否聘用专业运维公司' });
          }
        } else if (el.pointType === 1) { // 当为自动得分时
          if (el.sumPoint) {
            this.option.series[0].data.push({ value: Math.abs(el.sumPoint), name: '自动得分' });
          }
        } else {
          if (el.sumPoint) {
            this.option.series[0].data.push({ value: Math.abs(el.sumPoint), name: '重大事件' });
          }
        }
      });
      this.myChart = echarts.init(this.$refs.myChart);
      this.myChart.setOption(this.option);
      window.onresize = () => {
        this.myChart.resize();
      };
    },
    // 获取自动得分数据
    getAutoData() {
      if (!this.resData.list) return;
      const row = this.resData.list ? this.resData.list.filter(val => val.pointType === 1)[0] : {};
      this.isAuto = true;
      this.$nextTick(() => {
        this.$refs.AutoTable.getAutoList(row.idList);
      });
      // this.$refs.AutoTable.list = row.idList ? row.idList : [];
    },
    // 获取重大事项数据
    getDiyData() {
      if (!this.resData.list) return;
      const row = this.resData.list.filter(val => val.pointType === 2)[0];
      this.isAuto = false;
      this.$nextTick(() => {
        this.$refs.MattTable.getDiyList(row.idList);
      });
      // this.$refs.MattTable.list = row.idList;
    },
  },
};
</script>

<style lang="scss">
.DialogForm-modal{
  .ant-modal-content{
    .ant-modal-body{
      padding: 5px!important;
    }
  }
}
</style>

<style lang="scss" scoped>
.title{
  color: #178FFF;
  padding-left: 20px;
  height: 35px;
  line-height: 35px;
}
.spin-content{
  padding-top: 5px;
  background-color: #F6F7F9;
  display: grid;
  grid-template-columns: 320px 1fr;
  .left{
    width: 320px;
    height: 100%;
    >.echarts-class{
      width: 320px;
      height: 322.5px;
      background-color: #fff;
    }
    >.score-class{
      width: 320px;
      height: 292px;
      margin-top: 5px;
      background-color: #fff;
      position: relative;
    }
  }
  >.table-class{
    width: 1105px;
    height: 100%;
    margin-left: 5px;
    background-color: #fff;
  }
}
.posi-abso{
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}
.first-circle-class{
  width: 150px;
  height: 150px;
  background-color: #EFFAFF;
  border-radius: 50%;
  @extend .posi-abso;
  >.second-circle-class{
    width: 140px;
    height: 140px;
    background-color: #DFF1FF;
    border-radius: 50%;
    @extend .posi-abso;
    >.third-circle-class{
      width: 130px;
      height: 130px;
      background-color: #fff;
      border: 3px solid #B5EAFC;
      border-radius: 50%;
      box-shadow: 0px 0px 25px #B5EAFC inset;
      @extend .posi-abso;
      >.score{
        color: #15C729;
        font-size: 40px;
        margin-top: 35px;
        text-align: center;
      }
      >.type{
        text-align: center;
      }
    }
  }
}
.form-class{
  height: 40px;
  position: absolute;
  right: 0;
  top: 5px;
}
</style>
