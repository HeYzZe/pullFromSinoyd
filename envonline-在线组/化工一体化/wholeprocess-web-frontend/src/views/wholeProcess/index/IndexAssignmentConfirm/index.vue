<template>
  <el-card fill>
    <!-- 查询表单 -->
    <div slot="header">
      <el-form inline
               :model="queryForm">
        <el-form-item label="所属年份：">
          <el-date-picker v-model="queryForm.belongYear"
                          type="year"
                          value-format="yyyy"
                          placeholder="选择年">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     icon="fas fa-search"
                     @click="onQueryList()">查 询</el-button>
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
                       width="100"
                       show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button type="primary"
                     icon="fas fa-pencil-alt"
                     @click="onOpenDialog(scope.row)">详细</el-button>
        </template>
      </el-table-column>
      <el-table-column property="belongYear"
                       label="年度"
                       min-width="100"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="responsibleLevel"
                       label="考核部门"
                       min-width="120"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="indexQty"
                       label="目标指标数"
                       min-width="120"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="selfReachStandardQty"
                       label="自评达标数"
                       min-width="120"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="confirmReachStandardQty"
                       label="考核达标数"
                       min-width="120"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="confirmStatusName"
                       label="考核结论"
                       min-width="120"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="confirmUserName"
                       label="考核人"
                       min-width="120"
                       show-overflow-tooltip>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <paging-query v-model="pager"
                  @query="getItemList()" />
    <form-dialog @query="getItemList"
                 ref="formDialog"></form-dialog>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex';
import { queryList, deleteItem } from '@/global/libs/mixins';
import formDialog from './components/formDialog';

export default {
  mixins: [queryList, deleteItem],
  components: { formDialog },
  computed: mapGetters('auth', ['userType', 'orgGuid']),
  data() {
    return {
      url: 'wholeprocess/indexAssignmentConfirm',
      isAuto: false,
      exportStatus: false,
      queryForm: {
        psId: '',
        belongYear: '',
        // sort: 'indexName+',
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
  },
};
</script>
