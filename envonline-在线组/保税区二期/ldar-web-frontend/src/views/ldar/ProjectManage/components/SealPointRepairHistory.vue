<template>
  <dialog-modal ref="dialog" title="修复历史" size="middle">
    <el-form inline :model="queryForm">
      <el-row>
        <el-col :span="6">
          <el-form-item style="color: #409EFF;" label="密封点编号：">{{this.data.sealPointNo}}</el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item style="color: #409EFF;" label="密封点类型：">{{this.data.sealPointType}}</el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item style="color: #409EFF;" label="首检速率：">{{this.data.firstTestRate}}</el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table :data="itemList" border height="calc(100% - 70px)">
      <el-table-column align="center" type="index" width="50" label="No."></el-table-column>
      <el-table-column align="center" prop="repairsCountt" label="修复次数" show-overflow-tooltip>
        <template slot-scope="scope">{{"第"+scope.row.repairsCountt+"次修复"}}</template>
      </el-table-column>
      <el-table-column align="center" prop="repairDate" label="修复日期" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.repairDate | date }}</template>
      </el-table-column>
      <el-table-column align="center" prop="postRepairRate" label="修复后速率" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="isQualified" label="是否合格" show-overflow-tooltip>
        <template slot-scope="scope">{{ isQualified = scope.row.isQualified?"合格":"不合格" }}</template>
      </el-table-column>
    </el-table>
    <paging-query :pager="pager" @query="getItemList" />
  </dialog-modal>
</template>

<script>
import { queryList } from '@/libs/mixins';

export default {
  name: 'SealPointRepairHistory',
  mixins: [
    queryList,
  ],
  data() {
    return {
      itemList: [],
      idAuto: false,
      url: '/ldar/sealPointRepairHistory',
      queryForm: {
        sealPointId: '',
      },
      data: {},
    };
  },
  methods: {
    openDialog(row) {
      this.data = row;
      this.queryForm.sealPointId = row.id;
      this.onQueryList();
      this.$refs.dialog.openDialog();
    },
  },
};
</script>
