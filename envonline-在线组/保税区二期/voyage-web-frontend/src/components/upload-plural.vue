<template>
<!-- 使用方法：
    id               必传,列表数据的id
    isUpload         是否调用上传附件的接口
    btn              可选, 当所传值包含[add, down, remove]时,显示添加附件选项,反之，隐藏
    表单上传复数文件
-->

  <div class="mod-upload-file" v-loading="loading">
    <!--
      action               必传
      :show-file-list=""   是否显示已上传文件列表
      multiple             是否支持多选文件
      :auto-upload=""      是否在选取文件后立即上传
      :file-list=""        文件列表
      :on-remove=""        文件列表移除文件时的钩子
      :on-change=""        文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    -->
    <el-upload
      ref="addFile"
      action=""
      multiple
      v-show="!(monofile && fileList.length === 1)"
      :auto-upload="false"
      :file-list="fileList"
      :on-remove="onRemove"
      :on-change="onChange"
      :show-file-list="false">
      <el-button v-show="btn.includes('add')" type="text" class="pad-l-0" @click="onClickUpload">添加附件</el-button>
    </el-upload>
    <!-- 文件列表展示区 -->
    <el-row :gutter="5" style="margin-top: -5px">
      <el-col class="mar-t-xs" v-for="(item, index) in fileList" :key="index" :span="24 / col">
        <div :class="{ 'file-item': 1, 'fn-flex': 1,
          'border-danger': removeIndex === index,
          'border-warning': item.status === 'ready',
        }">
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
            <div class="btn-down" :title="item.status === 'ready' ? '需上传后才能下载' : '下载'"
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
    isOnly: {            // 是否一次只能传一个文件
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      url: 'res/document/upload',
      isUpload: false,
      loading: false,
      removeIndex: -1,
      fileList: [],             // 附件列表
    };
  },
  computed: {
    itemList() {
      return this.fileList.filter(file => file.status === 'ready');
    },
    // 文件大小数组
    // filesSize() {
    //   return this.itemList.filter(file => file.status === 'ready')
    //     .map(val => val.size / 1024 / 1024);
    // },
    // // 单个上传文件 true: 小于10MB, false: 文件大小超出
    // isFileSize() {
    //   return this.itemList.every(size => size < 10);
    // },
    // // 多个上传文件 true: 小于100MB, false: 总大小超出
    // isFilesSize() {
    //   return this.itemList.reduce((val, newVal) => val + newVal, 0) < 100;
    // },
  },
  watch: {
    isUpload(val) {        // 目的是判断是否需要调用上传附件的接口
      if (val) {
        this.uploadFile();
      }
    },
    id: {
      handler(val) {
        if (val) {
          this.getItemList();
        }
      },
      immediate: true,
    },
  },
  // created() {
  //   // if (this.id) {
  //   //   this.getItemList();
  //   // }
  // },
  methods: {
    getIcon: getFileIcon,         // 获取文件图标
    onChange(file, fileList) {    // 文件状态改变时的钩子,添加文件、上传成功、和上传失败
      this.fileList = fileList;
    },
    onRemove(file, fileList) {    // 文件列表移除文件时的钩子
      this.fileList = fileList;
    },

    /** 请求层 */
    getItemList() {               // 获取附件列表
      this.fileList = [];
      this.loading = true;
      this.$http.get('res/document', {
        params: {
          objectId: this.id,
          // docTypeId: this.docTypeId,
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
    uploadPort(formatData, name) {  // 上传附件接口
      return new Promise((reslove, reject) => {
        this.$http.post('res/document/upload', formatData.param, formatData.config)
          .then((response) => {
            if (response.data.success) {
              reslove(name);
            } else {
              reject(name);
            }
          }, () => {
            reject(name);
          });
      });
    },

    /** 特殊方法 */
    uploadFile() {              // 判断上传文件是否符合要求
      if (this.isOnly && this.fileList.length > 1) {
        this.$message.info('仅支持单个文件上传');
      } else if (!this.itemList.length) {
        // this.$message.info({
        //   message: '请选择需要上传的附件',
        //   showClose: true,
        //   duration: 3000,
        // });
        this.$emit('close');
      } else {
        this.beforeUpload();
      }
      // if (!this.itemList.length) {
      //   this.$message.info('请选择需要上传的附件');
      // } else if (!this.isFileSize) {
      //   this.$message.info('单个文件大小不能超过10MB');
      // } else if (!this.isFilesSize) {
      //   this.$message.info('上传文件总大小不能超过100MB');
      // } else {
      //   this.beforeUpload();
      // }
    },
    beforeUpload() {            // 上传文件前后处理
      this.isUpload = false;
      // 1. 转换格式
      const arrUpload = [];
      this.itemList.forEach((file) => {
        const formatData = {
          param: {},
          config: {},
        };
        formatData.param = new FormData();  // 创建form对象
        formatData.param.append('file', file.raw, file.name);  // file对象是 beforeUpload 参数
        formatData.config = {
          params: {
            objectId: this.id,
            // docTypeId: this.docTypeId,
          },
        };
        arrUpload.push(this.uploadPort(formatData, file.name));
      });
      // 2. 统一处理所有的上传文件
      this.loading = true;
      Promise.all(arrUpload).then((res) => {
        this.$message({
          type: 'success',
          message: '上传成功',
          showClose: true,
          duration: 3000,
        });
        // this.getItemList();
        this.$emit('close', res);
        // this.$refs.dialog.closeDialog();
      }).catch((error) => {
        this.$message.wraning({
          message: `文件${error.join(',')}上传失败`,
          showClose: true,
          duration: 3000,
        });
      }).finally(() => {
        this.loading = false;
      });
    },
    onClickUpload() {                 // 单击添加文件
    },
  },
};
</script>
