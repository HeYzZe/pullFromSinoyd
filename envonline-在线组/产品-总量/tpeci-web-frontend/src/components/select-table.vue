<!-- 弹窗表格选择企业 -->
<template>
  <div>
    <el-tooltip effect="dark" placement="top-start" :disabled="labelModel.length < 9" :content="labelModel">
      <el-input v-model="labelModel" readonly class="z-pointer" :size="size">
        <el-button slot="append" :size="size" @click="openDialog()">
          <i class="fas fa-th-list"></i>
        </el-button>
      </el-input>
    </el-tooltip>
    <!-- 弹窗 -->
    <dialog-modal
      ref="dialog"
      :title="title"
      @close="closeDialog"
      append-to-body
      scrollbar>
      <el-form inline :model="queryForm">
        <el-form-item label="企业名称：">
          <el-input
            v-model="queryForm.psName"
            clearable
            @keyup.enter.native="getItemList()"></el-input>
        </el-form-item>
        <el-form-item label="行政区域：">
          <select-tree
            style="width: 130px"
            v-model="queryForm.regionCodeId"
            lazy
            joint
            rootKey="0"
            url="sys/area"
            :props="{ label: 'areaName' }"
          ></select-tree>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="getItemList">查 询</el-button>
        </el-form-item>
      </el-form>

      <!-- 列表 -->
      <el-table
        border
        height="calc(70vh - 115px)"
        highlight-current-row
        v-loading="loading"
        :data="itemList">
        <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
        <el-table-column align="center" label="操作" width="60">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-check" @click="onClickCheck(scope.row)">确认</el-button>
          </template>
        </el-table-column>
        <el-table-column property="psName" label="企业名称" min-width="180" show-overflow-tooltip></el-table-column>
        <el-table-column property="psShortName" label="企业简称" show-overflow-tooltip></el-table-column>
        <el-table-column property="regionName" label="行政区域" show-overflow-tooltip></el-table-column>
      </el-table>
      <!-- 分页 -->
      <paging-query :pager="pager" @query="getItemList"/>
    </dialog-modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { analyzeResp } from '@/global/libs/util';
// import { queryList, deleteItem } from '@/global/libs/mixins';

export default {
  name: 'SelectTable',
  // mixin: [queryList],
  // 设置绑定参数
  model: {
    prop: 'value',
    event: 'selected',
  },
  props: {
    // v-model 传参
    value: String,
    // label
    label: String,
    // API 接口
    url: {
      type: String,
      required: false,
      default: 'bas/psBaseInfo',
    },
    // 组件大小, 可选 large、small、mini
    size: {
      type: String,
      required: false,
      default: 'mini',
    },
    // 标题
    title: {
      type: String,
      required: false,
      default: '选择企业',
    },
  },
  data() {
    return {
      loading: false,
      valueModel: '',        // 实际值
      labelModel: '',        // 显示值
      queryForm: {
        psName: '',
        psType: 1,
        industryTypeCodeId: '',
        regionCodeId: '',
        attentionDegree: -1,
        psBaseInfoType: -1,
        sort: 'psName',
      },
      itemList: [],
      pager: {            // 分页
        page: 1,
        rows: 15,
        count: 0,
      },
    };
  },
  watch: {
    label: {
      handler(val) {
        this.labelModel = this.value ? val : '';
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    ...mapGetters('auth', ['userType', 'orgGuid']),
  },
  created() {
    // this.labelModel = this.value ? this.label : '';
    if (this.userType === 'ent') {
      this.$set(this.queryForm, 'psId', this.orgGuid);
    }
  },
  methods: {
    // 表格索引衔接
    index(index) {
      return (this.pager.page - 1) * this.pager.rows + index + 1;
    },
    openDialog() {
      this.getItemList();
      this.$refs.dialog.openDialog();
    },
    closeDialog() {
      this.$refs.dialog.closeDialog();
    },
    // 获取选项数据
    getItemList() {
      this.loading = true;
      const { page, rows } = this.pager;
      this.$http.get(this.url, {
        params: { page, rows, ...this.queryForm },
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
    onClickCheck(row) {
      this.$emit('selected', row.psId);
      this.labelModel = row.psName;
      this.$emit('change', row.psName);
      this.closeDialog();
    },
  },
};
</script>
