<template>
  <el-card fill>
    <!-- 查询表单 -->
    <div slot="header">
      <el-form inline :model="queryForm">
        <el-form-item label="能源名称：" prop="energyName" hint-down>
          <el-input v-model="queryForm.energyName"></el-input>
        </el-form-item>
        <el-form-item label="是否进行安全评价：" prop="isSafetyEvaluation">
          <el-select v-model="queryForm.isSafetyEvaluation" autofocus clearable>
            <el-option v-for="item in $enum.WHETHER" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否设置监控设施：" prop="isMonitor">
          <el-select v-model="queryForm.isMonitor" autofocus clearable>
            <el-option v-for="item in $enum.WHETHER" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="onQueryList()">查 询</el-button>
          <el-button type="primary" icon="fas fa-upload" :disabled="!itemList.length" :loading="exportStatus"
            @click="onClickExport()">导 出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 按钮 -->
    <div class="mar-x-sm mar-y-xs fn-flex fn-no-wrap">
      <el-button type="primary" icon="fas fa-plus" @click="onOpenDialog()">新 增</el-button>
      <el-button type="danger" icon="fas fa-trash-alt" :disabled="!selectedIds.length" @click="onDeleteItem()">删 除
      </el-button>
    </div>
    <!-- 列表 -->
    <el-table border highlight-current-row height="calc(100% - 71px)" v-loading="loading" :data="itemList"
      :row-class-name="rowClassName" @select="onChangeCheck" @select-all="onChangeCheckAll"
      @selection-change="onChangeSelected">
      <el-table-column align="center" type="selection" width="40"></el-table-column>
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column align="center" label="操作" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-pencil-alt" @click="onOpenDialog(scope.row)">详细</el-button>
        </template>
      </el-table-column>
      <el-table-column property="energyName" label="能源名称" min-width="100" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="annualConsumption" label="年用量（t/m³）" min-width="100" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="maxStorageCapacity" label="最大储存量（t/m³）" min-width="100" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="involveProcess" label="涉及工艺" min-width="150" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="isSafetyEvaluation" label="是否进行安全评价" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">{{$enum.getLabel('WHETHER',scope.row.isSafetyEvaluation)}}</template>
      </el-table-column>
      <el-table-column property="isMonitor" label="是否设置监控设施" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">{{$enum.getLabel('WHETHER',scope.row.isMonitor)}}</template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <paging-query v-model="pager" @query="getItemList()" />
    <form-dialog @query="getItemList" ref="formDialog"></form-dialog>
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
      url: 'wholeprocess/chemicalEnergySourceInfo',
      isAuto: false,
      exportStatus: false,
      queryForm: {
        psId: '',
        energyName: '',
        isSafetyEvaluation: '',
        isMonitor: '',
        sort: 'energyName+',
      },
    };
  },
  created() {
    if (this.userType === 'ent') {
      this.queryForm.psId = this.orgGuid;
    }
    this.onQueryList();
  },
  methods: {
    // 新增编辑窗口
    onOpenDialog(row) {
      this.$refs.formDialog.openDialog(row);
    },
    // 导出
    onClickExport() {
      this.exportStatus = true;
      this.$http.post('wholeprocess/chemicalEnergySourceInfo/export', this.queryForm, {
        responseType: 'arraybuffer',
      }).then((response) => {
        const fileName = `化学能源信息${new Date().toLocaleDateString()}.xls`;
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
  },
};
</script>
