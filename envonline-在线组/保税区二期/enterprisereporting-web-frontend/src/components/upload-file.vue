<template>
<!-- 使用方法：
    id               必传,列表数据的id
    isRequest        是否调用获取附件的接口
    isUpdate         是否调用上传附件的接口
    btn              可选, 当所传值包含[add, down, remove]时,显示添加附件选项,反之，隐藏
    @update-success  当发送上传附件请求后，请求成功的回调
    @update-recover  当发送上传附件请求后，无论请求成功与否都会触发的回调
      触发的父组件方法中必然包含该代码：
        this.isRequset = false;
        this.isUpdate = false;
      示例：
        父组件 <upload-file
                id="itemModel.id || ''"
                :isRequest="isRequest"
                :isUpdate="isUpdate"
                @update-recover="updateRecover"
              >
          methods: {
            updateRecover() {
              this.isRequset = false;
              this.isUpdate = false;
            }
          }
-->

  <div class="mod-upload-file" v-loading="loading">
    <el-upload
      ref="addFile"
      action=""
      multiple
      :http-request="onSendUpload"
      v-show="!(monofile && fileList.length === 1) && btn.includes('add')"
      :auto-upload="true"
      :file-list="fileList"
      :on-remove="onRemove"
      :on-change="onChange"
      :show-file-list="false">
      <el-button type="text" class="pad-l-0" @click="onClickUpload">添加附件</el-button>
    </el-upload>
    <!-- 文件列表展示区 -->
    <el-row :gutter="5" style="margin-top: -5px">
      <el-col class="mar-t-xs" v-for="(item, index) in fileList" :key="index" :span="24 / col">
        <div :class="{ 'file-item': 1, 'fn-flex': 1,
          'border-danger': removeIndex === index,
          'no-updata': item.status === 'ready',
        }" :title="item.status !== 'ready' ? item[props.name] : item.name">
          <div class="item-type">
            <svg class="icon" aria-hidden="true">
              <use v-if="item.status !== 'ready'" :xlink:href="`#${getIcon(item[props.name])}`"></use>
              <use v-else :xlink:href="`#${getIcon(item.name)}`"></use>
            </svg>
          </div>
          <div class="item-name flex-1">
            <div v-if="item.status !== 'ready'" :title="item[props.name]">{{ item[props.name] }}</div>
            <div v-else :title="item.name">{{ item.name }}</div>
          </div>
          <div class="item-option">
            <div class="btn-down" :title="item.status === 'ready' ? '上传失败请删除后重新上传' : '下载'"
               v-show="btn.includes('down')" @click="onClickDown(item)">
              <i class="el-icon-download"></i>
            </div>
            <div
              v-show="btn.includes('remove')"
              class="btn-close"
              title="删除"
              @click="onClickRemove(item, index)"
              @mouseenter="removeIndex = index"
              @mouseleave="removeIndex = -1">
              <i class="el-icon-close"></i>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <span v-if="fileList.length === 0 && !btn.includes('add')">暂无附件</span>
  </div>
</template>

<script>
import '~/fonts/iconfont.js';
import { analyzeResp, getFileIcon } from '@/global/libs/util';

export default {
  name: 'UploadFile',
  props: {
    docTypeId: {
      type: [String, Number],
      default: '',
    },
    id: {                // 列表数据id
      required: true,
      validator(value) {
        return ['undefined', 'string', null].indexOf((typeof value)) !== -1;
      },
    },
    isRequest: {         // 是否调用获取上传附件的接口, 必须
      type: Boolean,
      required: true,
    },
    monofile: {          // 是否隐藏添加附件这些文字
      type: Boolean,
      default: false,
    },
    col: {               // 多列布局的列数
      type: [String, Number],
      default: 3,
    },
    btn: {               // 按钮 add down remove
      type: String,
      default: 'add down remove',
    },
    props: {
      type: Object,
      default: () => ({
        name: 'docName',   // 文件名
        size: 'docSize',   // 文件大小
        link: 'path',      // 文件下载链接
      }),
    },
  },
  data() {
    return {
      url: 'res/document/upload',
      loading: false,
      removeIndex: -1,
      fileList: [],             // 附件列表
    };
  },
  watch: {
    isRequest: {           // 目的是判断是否需要调用获取附件的接口
      handler(val) {
        if (val) {
          this.getItemList();
        }
      },
      immediate: true,
    },
  },
  methods: {
    getIcon: getFileIcon,         // 获取文件图标
    onSendUpload() {              // 文件上传前回调方法
      const tempList = this.fileList.filter(item => item.status === 'ready');
      if (tempList.length === 0) {
        this.$emit('update-success', true);
        this.$emit('update-recover');
        return false;
      }
      return this.uploadQuery(this.beforeUpload(tempList));
    },
    onChange(file, fileList) {    // 文件状态改变时的钩子,添加文件、上传成功、和上传失败
      this.fileList = fileList;
    },

    /** 请求层 */
    getItemList() {               // 获取附件列表
      this.loading = true;
      this.$http.get('res/document', {
        params: {
          objectId: this.id,
          docTypeId: this.docTypeId,
          rows: 1000000,
          page: 1,
        },
      }).then((response) => {
        if (response.status === 200) {
          this.fileList = response.data.data;
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
    uploadQuery(data) {           // 上传方法
      this.loading = true;
      this.$http.post(`res/document/upload/?objectId=${this.id}`, data).then((response) => {
        if (response.status === 200) {
          this.$message.success({
            message: '上传成功',
            duration: 3000,
            showClose: true,
          });
          this.getItemList();
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, ({ response }) => {
        if (!response || !response.response) this.$message.error({ message: '附件上传失败。' });
        analyzeResp(response);
      }).finally(() => {
        this.loading = false;
      });
    },
    onClickDown(row) {            // 点击下载
      if (row.status === 'ready') return;
      this.$http.get(`res/document/download?id=${row.id}`, {
        responseType: 'blob',
      }).then((response) => {
        const isFaild = response.headers['content-type'] === 'application/json;charset=UTF-8';
        if (isFaild) {
          const reader = new FileReader();
          reader.onload = e => this.$message.warning(JSON.parse(e.target.result).msg);
          reader.readAsText(response.data);
        } else {
          const fileName = row.docName;
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
        }
      }, (response) => {
        analyzeResp(response);
      });
    },
    onClickRemove(row, index) {   // 移除附件
      if (row.status === 'ready') {
        this.fileList.splice(index, 1);
        return;
      }
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => (
        this.$http.delete('res/document', { data: [row.id] })
      )).then((response) => {
        if (response.status === 200) {
          this.$message.success({
            message: '删除成功',
            duration: 3000,
            showClose: true,
          });
          this.getItemList();
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
    onRemove(file, fileList) {    // 文件列表移除文件时的钩子
      this.fileList = fileList;
    },

    /** 特殊方法 */
    beforeUpload(val) {           // 上传前将文件转化成 formData 格式
      const formData = new FormData();
      val.forEach((item) => {
        console.log(item);
        formData.append('file', item.raw, item.raw.name);
        formData.append('docTypeId', this.docTypeId);
      });
      return formData;
    },
    onClickUpload() {             // 单击添加文件
    },
  },
};
</script>
