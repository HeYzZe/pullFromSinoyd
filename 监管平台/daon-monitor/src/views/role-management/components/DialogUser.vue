<template>
  <a-modal
    class="Page-CurrentUser"
    width="780px"
    :visible="isVisible"
    title="用户信息"
    :footer="null"
    :maskClosable="false"
    @cancel="closeDialog">
    <div class="mar-t-xs">
      <a-button type="primary" icon="plus" @click="onAddClick"> 新 增</a-button>
      <a-button type="danger" icon="delete" :disabled="!selectedRowKeys.length" @click="onRemoveClick"> 删 除</a-button>
    </div>
    <a-table
      rowKey="id"
      size="small"
      :loading='loading'
      :columns='columns'
      :dataSource='itemList'
      :pagination="pagination"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      @change="_change"
    >
    </a-table>
    <DialogUserList ref="dialogUserList" @refreshList="getItemList"></DialogUserList>
  </a-modal>
</template>

<script>
import { userQuery, getCurrentUsers, removeUser } from '@/api/modules/role-management.js';
import { queryTest } from '@/mixins';
import DialogUserList from './components/DialogUserList';

export default {
  name: '',
  mixins: [queryTest],
  components: {
    DialogUserList,
  },
  data() {
    return {
      loading: {
        spinning: false,
        tip: '数据加载中',
      },
      columns: [
        {
          title: 'No.',
          dataIndex: 'index',
          key: 'index',
          align: 'center',
          width: 50,
          customRender: (text, record, index) => `${index + 1 + (this.queryForm.page - 1) * this.queryForm.rows}`,
        },
        {
          title: '用户名称',
          dataIndex: 'userName',
          key: 'userName',
          width: 120,
          scopedSlots: { customRender: 'nameSlot' },
        },
        {
          title: '中文名称',
          dataIndex: 'name',
          key: 'name',
          width: 120,
        },
        {
          title: '手机号码',
          dataIndex: 'mobile',
          key: 'mobile',
          width: 120,
        },
        {
          title: '邮箱地址',
          dataIndex: 'email',
          key: 'email',
          // width: 150,
        },
      ],
      isVisible: false,
      row: {},
      pagination: {
        total: 0,
        current: 1,
        defaultPageSize: 10,
        pageSizeOptions: ['10', '15', '30', '50'],
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: total => `共${total}条`,
      },
      selectedRowKeys: [],
      queryForm: userQuery(),
      getList: getCurrentUsers,
      itemList: [],
    };
  },
  methods: {
    // 用户新增事件
    onAddClick() {
      this.$refs.dialogUserList.openDialog(this.row);
    },
    // 用户移除事件
    onRemoveClick() {
      this.$confirm({
        title: '提示',
        content: '你确定要删除当前选中的用户吗？',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          removeUser(this.selectedRowKeys, this.row).then((response) => {
            if (response.data.code === 200) {
              this.$message.success('删除成功', 3);
            } else {
              this.$message.warning(response.data.message || response.data.msg, 3);
            }
            this.selectedRowKeys = [];
            this.getItemList();
          });
        },
      });
    },
    // 弹框显示
    openDialog(row) {
      this.row = row;
      this.queryForm.roleId = row.id;
      this.getItemList();
      this.isVisible = true;
    },
    // 弹框隐藏
    closeDialog() {
      this.isVisible = false;
      this.row = {};
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    // 页码改变，参数改变后页码及每页条数
    _change(current) {
      this.queryForm.page = current.current;
      this.pagination.current = current.current;
      this.queryForm.rows = current.pageSize;
      this.getItemList();
    },
  },
  created() {},
};
</script>
<style lang="scss">
.Page-CurrentUser{
  .ant-modal-content{
    .ant-modal-body{
      padding: 0 12px;
    }
  }
  .ant-table-small{
    margin-top: 5px !important;
    .ant-table-content{
      min-height: 418px;
      .ant-table-body{
        margin: 0;
      }
      .ant-table-placeholder{
        padding: 0;
        border-bottom: none;
        .ant-empty{
          min-height: 380px;
          line-height: 380px;
          margin: 0;
        }
      }
      .ant-table-tbody > tr > td,th{
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
</style>
