<!-- 污染物特征因子名录库 -->
<template>
  <el-card>
    <template slot="header">
      <el-form inline
               :model="queryForm">
        <el-form-item label="企业名称：">
          <el-select v-model="queryForm.psId"
                     autofocus
                     clearable
                     filterable
                     style="width: 250px">
            <el-option v-for="(item, index) in psBaseList"
                       :key="index"
                       :label="item.psName"
                       :value="item.psId">
            </el-option>
          </el-select>
          <!-- <el-input
            v-model="queryForm.key"
            clearable
            style="width:150px"
            @keyup.enter.native="getItemList(true)"></el-input> -->
        </el-form-item>
        <el-form-item label="因子类型："
                      prop="keyChemicalsNameCodeId">
          <el-select clearable
                     v-model="queryForm.factorType">
            <el-option v-for="(item, key) in $enum.get('FACTORS_TYPE')"
                       :key="key"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="因子名称：">
          <el-input clearable
                    style="width:150px"
                    v-model="queryForm.factorName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     icon="fas fa-search"
                     @click="getItemList(true)">查 询</el-button>
        </el-form-item>
      </el-form>
    </template>
    <div class="mar-x-sm mar-y-xs fn-flex fn-no-wrap">
      <el-button type="primary"
                 icon="fas fa-plus"
                 @click="onClickAdd()">新 增</el-button>
      <el-button type="danger"
                 icon="fas fa-trash-alt"
                 :disabled="!selectedIds.length"
                 @click="onDeleteItem()">删 除
      </el-button>
      <div class="flex-1 text-right pad-l-sm">
        <el-button type="primary"
                   icon="fas fa-upload"
                   :disabled="!itemList.length"
                   :loading="exportStatus"
                   @click="onClickExport()">导 出
        </el-button>
      </div>
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
                       width="37"></el-table-column>
      <el-table-column align="center"
                       label="No."
                       width="50"
                       type="index"
                       :index="index"></el-table-column>
      <el-table-column align="center"
                       label="操作"
                       width="67">
        <template slot-scope="scope">
          <el-button type="primary"
                     icon="fas fa-pencil-alt"
                     @click="onClickEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column property="psName"
                       label="企业名称"
                       min-width="220"
                       show-overflow-tooltip></el-table-column>
      <el-table-column property="factorType"
                       label="因子类型"
                       width="120">
        <template slot-scope="scope">
          {{ $enum.getLabel('FACTORS_TYPE', scope.row.factorType) }}
        </template>
      </el-table-column>
      <el-table-column property="factorName"
                       label="因子名称"
                       width="150"
                       show-overflow-tooltip></el-table-column>
      <el-table-column property="upperLimitValue"
                       label="上限值"
                       width="100"
                       show-overflow-tooltip></el-table-column>
      <el-table-column property="lowerLimitValue"
                       label="下限值"
                       width="100"
                       show-overflow-tooltip></el-table-column>
      <el-table-column property="unit"
                       label="浓度单位"
                       width="100"
                       show-overflow-tooltip></el-table-column>
      <el-table-column property="cou"
                       label="排放量"
                       width="100"
                       show-overflow-tooltip></el-table-column>
      <el-table-column property="couUnit"
                       label="排放量单位"
                       width="100"
                       show-overflow-tooltip></el-table-column>
      <el-table-column property="outPutRuleValue"
                       label="排放规律"
                       width="120"
                       show-overflow-tooltip></el-table-column>
      <el-table-column property="outPutRange"
                       label="排放范围"
                       width="120"
                       show-overflow-tooltip></el-table-column>
      <el-table-column property="implementationCriteria"
                       label="执行标准"
                       width="120"
                       show-overflow-tooltip></el-table-column>
      <el-table-column property="modifyDate"
                       label="修改日期"
                       width="100"
                       show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.modifyDate | date }}
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <paging-query v-model="pager"
                  @query="getItemList()" />

    <!-- 编辑弹框 -->
    <dialog-form ref="dialog"
                 :read-only="readOnly"
                 @query="getItemList()" />
  </el-card>
</template>


<script>
import { analyzeResp } from '@/global/libs/util';
import { queryList, deleteItem } from '@/global/libs/mixins';
import DialogForm from './components/DialogForm';

export default {
  name: 'FactorDirectory',
  mixins: [
    queryList,
    deleteItem,
  ],
  components: {
    DialogForm,
  },
  data() {
    return {
      url: 'bas/pSCharacteristicPollutants',
      isAuto: false,
      readOnly: false,
      exportStatus: false,
      psBaseList: [],
      // 字典数据
      dict: {},
      // 查询表单绑定变量
      queryForm: {
        psId: '',       // 企业名称
        factorType: '', // 因子类型
      },
    };
  },
  created() {
    this.getPsBaseList();
    this.getDictList();
    this.getItemList();
  },
  methods: {
    // 单击新增回调
    onClickAdd() {
      this.$refs.dialog.openDialog();
    },
    // 单击编辑回调
    onClickEdit(row) {
      this.$refs.dialog.openDialog(row);
    },
    // 获取字典表数据
    getDictList() {
      Object.keys(this.dict).forEach(((key) => {
        this.$store.dispatch('dict/GET_SELECT_TYPE', key).then((val) => {
          this.dict[key] = val;
        });
      }));
    },
    // 获取记录列表
    getItemList() {
      this.loading = true;
      this.selectedIndexs = [];  // 触发查询时取消勾选高亮
      const { page, rows } = this.pager;
      this.$http.post(`${this.url}/find`, this.queryForm, {
        params: { page, rows, sort: 'psId+,factorType+,factorName' },
      }).then((response) => {
        if (response.data.success) {
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
    },
    // 导出
    onClickExport() {
      this.exportStatus = true;
      // const { page, rows } = this.pager;
      this.$http.post('bas/pSCharacteristicPollutants/export', this.queryForm, {
        responseType: 'arraybuffer',
        // params: {
        //   page,
        //   rows,
        //   sort: 'psId+,factorType+,factorName',
        // },
      }).then((response) => {
        const fileName = `污染物特征因子名录库${new Date().toLocaleDateString()}.xls`;
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
    // 获取企业列表
    getPsBaseList() {
      this.$http.get('bas/psBaseInfo', {
        params: {
          page: 1, rows: 10000, psType: -1, sort: 'psName',
        },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.psBaseList = response.data.data;
        }
      });
    },
  },
};
</script>
