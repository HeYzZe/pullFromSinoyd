<template>
  <el-card fill>
    <!-- 查询表单 -->
    <div slot="header">
      <el-form inline
               :model="queryForm">
        <el-form-item label="使用开始时间：">
          <el-date-picker v-model="queryForm.fromTime"
                          type="date"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="使用结束时间：">
          <el-date-picker v-model="queryForm.toTime"
                          type="date"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     icon="fas fa-search"
                     @click="onQueryList()">查 询</el-button>
          <el-button type="primary"
                     icon="fas fa-upload"
                     :disabled="!itemList.length"
                     :loading="exportStatus"
                     @click="onClickExport()">导 出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 按钮 -->
    <div class="mar-x-sm mar-y-xs fn-flex fn-no-wrap">
      <el-button type="primary"
                 icon="fas fa-plus"
                 @click="onOpenDialog()">新 增</el-button>
      <el-button type="danger"
                 icon="fas fa-trash-alt"
                 :disabled="!selectedIds.length"
                 @click="onDeleteItem()">删 除
      </el-button>
    </div>
    <!-- 列表 -->
    <el-table border
              highlight-current-row
              height="calc(100% - 71px)"
              v-loading="loading"
              :data="itemList"
              :row-class-name="rowClassName"
              @select="onChangeCheck"
              @select-all="onChangeCheckAll"
              @selection-change="onChangeSelected">
      <el-table-column align="center"
                       type="selection"
                       width="40"></el-table-column>
      <el-table-column align="center"
                       label="No."
                       width="50"
                       type="index"
                       :index="index"></el-table-column>
      <el-table-column align="center"
                       label="操作"
                       width="120"
                       show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button type="primary"
                     icon="fas fa-pencil-alt"
                     @click="onOpenDialog(scope.row)">详细</el-button>
        </template>
      </el-table-column>
      <el-table-column property="useDate"
                       label="使用日期"
                       min-width="100"
                       show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.useDate === '1753-01-01 00:00:00' ? '' : scope.row.useDate | date}}
        </template>
      </el-table-column>
      <el-table-column property="useDepId"
                       label="使用部门"
                       min-width="100"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="expenditureTypeName"
                       label="支出项目类别"
                       min-width="100"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="specificUse"
                       label="具体用途"
                       min-width="150"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="useMoneyAmount"
                       label="金额（万元）"
                       min-width="150"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="operatorName"
                       label="经办人"
                       min-width="150"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="dealUserName"
                       label="审核人"
                       min-width="150"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="approverUserName"
                       label="批准人"
                       min-width="150"
                       show-overflow-tooltip>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <paging-query v-model="pager"
                  @query="getItemList()" />
    <form-dialog @query="getItemList"
                 :expenditure-type="dict.ExpenditureType"
                 ref="formDialog"></form-dialog>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex';
import { queryList, deleteItem } from '@/global/libs/mixins';
import formDialog from './components/formDialog';
import { analyzeResp } from '@/global/libs/util';

export default {
  mixins: [queryList, deleteItem],
  components: { formDialog },
  computed: mapGetters('auth', ['userType', 'orgGuid']),
  data() {
    return {
      url: 'wholeprocess/safetyProductionCostUse',
      isAuto: false,
      exportStatus: false,
      queryForm: {
        psId: '',
        fromTime: '',
        toTime: '',
        sort: 'useDate-',
      },
      dict: {
        ExpenditureType: [],
      },
    };
  },
  created() {
    if (this.userType === 'ent') {
      this.queryForm.psId = this.orgGuid;
    }
    this.onQueryList();
    this.getDictList();
  },
  methods: {
    // 新增编辑窗口
    onOpenDialog(row) {
      this.$refs.formDialog.openDialog(row);
    },
    // 导出
    onClickExport() {
      this.exportStatus = true;
      this.$http.post('wholeprocess/safetyProductionCostUse/export', this.queryForm, {
        responseType: 'arraybuffer',
      }).then((response) => {
        const fileName = `费用使用${new Date().toLocaleDateString()}.xls`;
        const fileBlob = new Blob([response.data], { type: 'application/x-xls' });
        if (window.navigator.msSaveOrOpenBlob) {
          navigator.msSaveBlob(fileBlob, fileName);
        } else {
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(fileBlob);
          link.download = fileName;
          document.body.appendChild(link);  // fix: 修复在火狐未触发下载问题
          link.click();
          window.URL.revokeObjectURL(link.href);
          document.body.removeChild(link);
        }
      }, ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.exportStatus = false;
      });
    },
    // 获取字典表数据
    getDictList() {
      Object.keys(this.dict).forEach(((key) => {
        this.$store.dispatch('dict/GET_SELECT_TYPE', key).then((val) => {
          this.dict[key] = val;
        });
      }));
    },
  },
};
</script>
