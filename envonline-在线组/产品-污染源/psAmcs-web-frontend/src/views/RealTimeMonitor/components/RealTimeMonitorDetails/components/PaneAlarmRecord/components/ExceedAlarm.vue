<template>
  <!-- 单点详情 -- 超标报警 -->
  <div class="fill-h">
    <el-form :model="queryForm" inline class="mar-t-xs mar-l-sm">
      <!-- <el-form-item label="报警时间：">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          :picker-options="pickStart"
          :clearable="false">
        </el-date-picker>
      </el-form-item> -->

      <el-form-item label="报警时间：">
        <el-date-picker
          style="width:140px"
          v-model="queryForm.fromDate"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :clearable="false"
          :editable="false"
        ></el-date-picker>&nbsp;~
        <el-date-picker
          style="width:140px"
          v-model="queryForm.toDate"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :clearable="false"
          :editable="false"
        ></el-date-picker>
      </el-form-item>

      <el-form-item label="报警类型：">
        <el-select
          v-model="queryForm.alarmTypeIds"
          multiple
          collapse-tags
          style="width: 180px;"
          clearable
        >
          <el-option
            v-for="(item,index) in alarmTypeList"
            :key="index"
            :value="item.id"
            :label="item.alarmTypeName">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="报警等级：">
        <el-select v-model="queryForm.alarmLevel">
          <el-option :value="-1" label="全部"></el-option>
          <el-option
            v-for="(item,index) in $enum.get('ALARM_LEVEL')"
            :key="index"
            :value="item.value"
            :label="item.label">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="fas fa-download" :loading="downloading" @click="onDownload">导 出</el-button>
      </el-form-item>
    </el-form>
    <el-table
      border
      highlight-current-row
      height="calc(100% - 70px)"
      v-loading="loading"
      :data="itemList"
      @selection-change="onChangeSelected"
      @row-dblclick="rowDblclick"
    >
      <el-table-column align="center" label="No." min-width="50" type="index" :index="index"></el-table-column>
      <el-table-column label="区域" prop="regionName" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="污染源名称" prop="psName" min-width="140" show-overflow-tooltip></el-table-column>
      <el-table-column label="站点名称" prop="portName" min-width="130" show-overflow-tooltip></el-table-column>
      <el-table-column label="报警时间" prop="alarmTstamp" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="报警类型" prop="alarmTypeName" min-width="90" show-overflow-tooltip></el-table-column>
      <el-table-column label="报警等级" prop="alarmLevelName" min-width="90" show-overflow-tooltip></el-table-column>
      <el-table-column label="超标因子" prop="factorName" min-width="90" show-overflow-tooltip></el-table-column>
      <el-table-column label="超标值" prop="factorValue" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column label="标准值" min-width="90" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.lowValue}}~{{scope.row.upperValue}}</span>
        </template>
      </el-table-column>
      <el-table-column label="报警内容" prop="alarmContent" min-width="180" show-overflow-tooltip></el-table-column>
    </el-table>
    <paging-query :pager="pager" @query="getItemList"></paging-query>

    <!-- 双击行 -->
    <form-echarts-dialog ref="dialog"/>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { analyzeResp } from '@/global/libs/util';
import { formatDate } from '@/global/libs/tools';
import { queryList } from '@/global/libs/mixins';
import FormEchartsDialog from './FormEchartDialog.vue';

export default {
  name: 'ExceedAlarm',
  mixins: [queryList],
  components: {
    FormEchartsDialog,
  },
  data() {
    return {
      url: 'alarm/alarmRecord',
      isAuto: false,
      downloading: false,
      alarmTypeIds: [],            // 必传报警类型
      queryForm: {
        fromDate: formatDate(new Date(new Date().getTime() - 2 * 24 * 3600000), 'Y-m-d'),
        toDate: formatDate(new Date(), 'Y-m-d'),
        alarmLevel: -1,
        portId: '',
        alarmTypeIds: [],
      },
      pickerOneDate: '',
      pickStart: {
        onPick: ({ maxDate, minDate }) => {
          this.pickerOneDate = minDate.getTime();
          if (maxDate) {
            this.pickerOneDate = '';
          }
        },
        disabledDate: (time) => {
          if (this.pickerOneDate !== '') {
            const date = 30 * 24 * 3600000;
            const max = this.pickerOneDate + date - 24 * 3600 * 1000;
            const min = this.pickerOneDate - date;
            return time.getTime() > max || time.getTime() < min || time.getTime() > new Date();
          }
          return time.getTime() > new Date();
        },
      },
      itemList: [],
      portList: [],
      alarmTypeList: [],
    };
  },
  computed: {
    dateRange: {
      get() {
        // 为何为'', 当dateRange值不为 '' 时,时间选项会从 1970年1月1日开始
        return (!this.queryForm.fromDate && !this.queryForm.toDate)
          ? ''
          : [this.queryForm.fromDate, this.queryForm.toDate];
      },
      set(val) {
        [this.queryForm.fromDate, this.queryForm.toDate] = val || ['', ''];
      },
    },
    ...mapState({
      portInfo: state => state.portInfo,
      amcsType: state => state.auth.amcsType,
    }),
  },
  watch: {
    // eslint-disable-next-line
    'portInfo.portId'(val) {
      this.onQueryList();
    },
  },
  created() {
  },
  methods: {
    onTabClick() {
      this.getAlarmTypeList();
    },
    rowDblclick(row) {               // 双击列表行
      this.$refs.dialog.openDialog({ ...row, portType: this.amcsType });
    },

    /** 接口层 */
    getAlarmTypeList() {            // 报警类型
      this.$http.post('alarm/alarmType/code?page=1&rows=1000000', {
        alarmTypeCodes: ['AlarmOverProofHour', 'AlarmOverProofDay'],
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.alarmTypeList = response.data.data;
          this.alarmTypeIds = this.alarmTypeList.map(item => item.id);
          this.getItemList();
        }
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
    getItemList() {                 // 获取记录列表
      if (!this.isInTimerange()) return;
      const stamp = new Date(this.queryForm.toDate).getTime() - new Date(this.queryForm.fromDate).getTime();
      if (stamp > 1111111130 * 3600 * 1000 * 24) {
        this.$message.warning('请选择30天内的时间');
      } else {
        this.queryForm.portId = this.portInfo.portId;
        this.loading = true;
        this.selectedIndexs = [];
        const { page, rows } = this.pager;
        const params = { ...this.queryForm };
        if (params.alarmTypeIds.length === 0) {
          params.alarmTypeIds = this.alarmTypeIds;
        }
        this.$http.post(this.url, params, {
          params: {
            page,
            rows,
            sort: 'alarmLevel+,alarmTstamp-,factorName+',
          },
        }).then((response) => {
          if (response.status === 200 && response.data.success) {
            this.itemList = response.data.data;
            this.pager.count = response.data.count;
          } else {
            this.$message.warning({
              message: response.data.msg,
              duration: 3000,
              showClose: true,
            });
          }
        }, ({ response }) => {
          analyzeResp(response);
        }).finally(() => {
          this.loading = false;
        });
      }
    },
    onDownload() {                  // 下载数据
      if (!this.isInTimerange()) return;
      const stamp = new Date(this.queryForm.toDate).getTime() - new Date(this.queryForm.fromDate).getTime();
      if (stamp > 30 * 3600 * 1000 * 24) {
        this.$message.warning('请选择30天内的时间');
      } else {
        this.downloading = true;
        this.$http.post('alarm/alarmRecord/export?sort=alarmLevel%2B,alarmTstamp-,factorName%2B', {
          ...this.queryForm,
          isExportAlarmOverProof: true,
        }, {
          responseType: 'blob',
        }).then((response) => {
          const fileName = `报警记录${new Date().toLocaleDateString()}.xls`;
          const blob = new Blob([response.data], { type: 'application/x-xls' });
          if (window.navigator.msSaveOrOpenBlob) {
            navigator.msSaveBlob(blob, fileName);
          } else {
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
            window.URL.revokeObjectURL(link.href);
          }
        }, ({ response }) => {
          analyzeResp(response);
        }).finally(() => {
          this.downloading = false;
        });
      }
    },

    // 特殊方法
    isInTimerange() { // 判断当前日期跨度是否超过30天
      let stamp = 0;
      let res;
      stamp = new Date(this.queryForm.toDate).getTime() - new Date(this.queryForm.fromDate).getTime();
      if (stamp > 30 * 3600 * 1000 * 24) {
        res = false;
        this.$message.warning('请选择30天内的时间');
      } else {
        res = true;
      }
      return res;
    },
  },
};
</script>
