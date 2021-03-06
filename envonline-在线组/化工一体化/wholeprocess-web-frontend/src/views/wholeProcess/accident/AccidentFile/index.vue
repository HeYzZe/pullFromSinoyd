<template>
  <el-card fill>
    <!-- 查询表单 -->
    <div slot="header">
      <el-form inline :model="queryForm">
        <el-form-item label="发生时间：">
          <el-date-picker
            v-model="queryForm.fromTime"
            type="date"
            style="width: 140px"
            value-format="yyyy-MM-dd 00:00:00"
            :picker-options="pickStart"
            placeholder="开始日期"></el-date-picker>
          <span class="demonstration">~</span>
          <el-date-picker
            v-model="queryForm.toTime"
            type="date"
            style="width: 140px"
            value-format="yyyy-MM-dd 00:00:00"
            :picker-options="pickEnd"
            placeholder="结束日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="关键字：" prop="keyWord">
          <el-input v-model="queryForm.keyWord" clearable></el-input>
        </el-form-item>
        <el-form-item label="事故类型：">
          <el-select v-model="queryForm.accidentType"
                      style="width:140px;"
                      clearable>
            <el-option v-for="(item,index) in $enum.ACCIDENTTYPE"
                      :key="index"
                      :label="item.label"
                      :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="事故等级：">
          <el-select v-model="queryForm.accidentLevel"
                      style="width:140px;"
                      clearable>
            <el-option v-for="(item,index) in $enum.ACCIDENTLEVEL"
                      :key="index"
                      :label="item.label"
                      :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="onQueryList()">查 询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 按钮 -->
    <div class="mar-x-sm mar-y-xs fn-flex fn-no-wrap">
      <el-button type="primary"
                  icon="fas fa-plus"
                   @click="onClickAdd()">新 增</el-button>
      <el-button type="danger"
                  icon="fas fa-trash-alt"
                  :disabled="!selectedIds.length"
                  @click="onDeleteItem()">删 除
      </el-button>
      <el-button type="primary"
                  icon="fas fa-download"
                  :disabled="!itemList.length"
                  :loading="exportStatus"
                  @click="onClickExport()">导 出</el-button>
    </div>
    <!-- 列表 -->
    <el-table border highlight-current-row height="calc(100% - 71px)" v-loading="loading" :data="itemList"
      :row-class-name="rowClassName" @select="onChangeCheck" @select-all="onChangeCheckAll"
      @selection-change="onChangeSelected">
      <el-table-column align="center" type="selection" width="40"></el-table-column>
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column align="center" label="操作" width="160" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickEdit(scope.row)">编辑</el-button>
          <el-button type="primary" icon="fas fa-user" @click="onClickUser(scope.row)">伤亡人员</el-button>
        </template>
      </el-table-column>
      <el-table-column property="accidentNo" label="事故编号" min-width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="accidentName" label="事故名称" min-width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="accidentType" label="事故类型" min-width="100" show-overflow-tooltip>
        <template slot-scope="{ row }">
          {{ $enum.ACCIDENTTYPE.find(e => e.value === row.accidentType)
            && $enum.ACCIDENTTYPE.find(e => e.value === row.accidentType).label }}
        </template>
      </el-table-column>
      <el-table-column property="accidentLevel" label="事故等级" min-width="100" show-overflow-tooltip>
        <template slot-scope="{ row }">
          {{ $enum.ACCIDENTLEVEL.find(e => e.value === row.accidentLevel)
            && $enum.ACCIDENTLEVEL.find(e => e.value === row.accidentLevel).label }}
        </template>
      </el-table-column>
      <el-table-column property="occurrenceTime" label="发生时间" min-width="160" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="occurrenceAddress" label="发生地点" min-width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="deptName" label="所属部门" min-width="100" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="accidentNature" label="事故性质" min-width="100" show-overflow-tooltip>
        <template slot-scope="{ row }">
          {{ $enum.ACCIDENTNATURE.find(e => e.value === row.accidentNature)
            && $enum.ACCIDENTNATURE.find(e => e.value === row.accidentNature).label }}
        </template>
      </el-table-column>
      <el-table-column property="minorNumber" label="轻伤人数" min-width="80" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="seriousNumber" label="重伤人数" min-width="80" show-overflow-tooltip>
      </el-table-column>
       <el-table-column property="deathNumber" label="死亡人数" min-width="80" show-overflow-tooltip>
      </el-table-column>
       <el-table-column property="economicLoss" label="经济损失(万元)" min-width="120" show-overflow-tooltip>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <paging-query v-model="pager" @query="getItemList()" />
    <dialog-form ref="formDialog" @query="getItemList()" ></dialog-form>
    <dialog-person ref="userDialog" @query="getItemList()"></dialog-person>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex';
import { analyzeResp } from '@/global/libs/util';
import { queryList, deleteItem } from '@/global/libs/mixins';
import DialogForm from './components/DialogForm';
import DialogPerson from './components/DialogPerson';

export default {
  name: 'AccidentFile',
  mixins: [queryList, deleteItem],
  components: {
    DialogForm,
    DialogPerson,
  },
  data() {
    return {
      url: 'wholeprocess/accidentArchive',
      isAuto: false,
      exportStatus: false,
      queryForm: {
        psId: '',
        fromTime: '',
        toTime: '',
        keyWord: '',
        accidentType: '',
        accidentLevel: '',
        sort: 'occurrenceTime-',
      },
    };
  },
  computed: {
    ...mapGetters('auth', ['userType', 'orgGuid']),
    pickStart() {
      return {
        disabledDate: (time) => {
          if (this.queryForm.toTime) {
            return time.getTime() > new Date(this.queryForm.toTime).getTime();
          }
          return false;
        },
      };
    },
    pickEnd() {
      return {
        disabledDate: (time) => {
          if (this.queryForm.fromTime) {
            return time.getTime() < new Date(this.queryForm.fromTime).getTime();
          }
          return false;
        },
      };
    },
  },
  created() {
    if (this.userType === 'ent') {
      this.queryForm.psId = this.orgGuid;
    }
    this.onQueryList();
  },
  methods: {
    onClickAdd() {
      this.$refs.formDialog.openDialog();
    },
    // 新增编辑窗口
    onClickEdit(row) {
      this.$refs.formDialog.openDialog(row);
    },
    onClickUser(row) {
      this.$refs.userDialog.openDialog(row);
    },
    // 导出
    onClickExport() {
      this.exportStatus = true;
      this.$http.post('wholeprocess/accidentArchive/export', this.queryForm, {
        responseType: 'arraybuffer',
      }).then((response) => {
        // const fileName = decodeURI(response.headers['content-disposition']).split('=')[1];
        const fileName = `事故档案${new Date().getTime()}.xls`;
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
