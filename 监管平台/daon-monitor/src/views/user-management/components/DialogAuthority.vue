<template>
  <a-modal
    class="dialog-authority"
    :visible="isVisible"
    title="用户权限"
    :maskClosable="false"
    @cancel="closeDialog">
    <a-tree
      v-if="treeData.length"
      v-model="selectedKeys"
      :treeData="treeData"
      :defaultExpandAll="true"
    >
    </a-tree>
    <div slot="footer">
      <a-button icon="close" @click="closeDialog">关 闭</a-button>
    </div>
  </a-modal>
</template>

<script>
import { getAllAuthority, getAuthority } from '@/api/modules/user-management.js';

export default {
  name: '',
  components: {},
  data() {
    return {
      isVisible: false,
      authorityList: [],
      selectedKeys: [],
      treeData: [],
    };
  },
  methods: {
    // 弹框显示
    openDialog(row) {
      // this.getAuthorityList();
      this.getCurrentAuthority(row);
      this.isVisible = true;
    },
    // 弹框隐藏
    closeDialog() {
      this.isVisible = false;
      this.selectedKeys = [];
    },
    // 生成树
    generateTree(data) {
      const tem = [];
      for (let i = 0; i < data.length; i++) {
        const node = data[i];
        const obj = {
          key: node.id,
          title: node.name,
        };
        if (node.children && node.children.length !== 0) {
          this.generateTree(node.children);
          obj.children = this.generateTree(node.children);
        }
        tem.push(obj);
      }
      return tem;
    },
    // 获取当前用户权限
    getCurrentAuthority(row) {
      getAuthority(row).then((response) => {
        if (response.data.code === 200 && response.data.success) {
          this.authorityList = response.data.data;
          this.treeData = this.generateTree(this.authorityList);
          // this.selectedKeys = response.data.data.permissionIdList;
        } else {
          this.$message.warning(response.data.msg, 3);
        }
      });
    },
    // 获取权限列表
    getAuthorityList() {
      getAllAuthority().then((response) => {
        if (response.data.code === 200 && response.data.success) {
          this.authorityList = response.data.data;
          this.treeData = this.generateTree(this.authorityList);
        } else {
          this.$message.warning(response.data.msg, 3);
        }
      });
    },
  },
  created() {},
};
</script>
<style lang="scss">
  .dialog-authority{
    .ant-modal-content{
      .ant-modal-body{
        padding: 0 24px;
        height: 70vh;
        overflow: auto;
      }
    }
  }
</style>
