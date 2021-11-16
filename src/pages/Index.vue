<template>
  <div class="uploadMain">
    <div class="upload-input">
      <input type="file" v-show="false" ref="fileInput" multiple @change="uploadImageData"
             accept="image/jpeg,image/jpg,image/png">
    </div>
    <div class="upload-box" v-on="dragEvents" :class="[isDragOver ? 'is-dragover': '']"
         v-show="isShowUploadImage===false"
         @click="uploadInputButton">
      <div class="upload-tip">
        <h1>可以直接拖拽文件</h1>
      </div>
      <div class="upload-info">
        <h1 style="color: #000000">上传与分享您的照片</h1><br>
        <span>坚决抵制一切违法违规图片！</span><br>
        <el-button @click.stop="uploadInputButton">开始上传</el-button>
      </div>
    </div>
    <div class="image-show-box" v-show="isShowUploadImage">
      <div class="image-preview">
        <ul class="image-items">
          <li v-for="file in filesList"
              :key="file.uid"
          >
            <div class="image-item">
              <div class="file-content">
                <el-image
                    style="width: 150px; height: 150px; cursor: pointer"
                    :src=file.url
                    ref="preview"
                    @click="imagePreview(file.url)"
                >
                </el-image>
              </div>
              <div class="file-footer">
                <div style="height: 70%; position:relative;text-align: center;">
                  <span>{{ file.name }}</span>
                </div>
                <div class="file-control-button">
                  <el-button size="mini" @click="removeFile(file.uid)"><i class="iconfont icon-lajitong"></i></el-button>
                  <el-button size="mini" @click="imagePreview(file.url)"><i class="iconfont icon-fangdajing"></i>
                  </el-button>
                </div>
              </div>
            </div>
          </li>
        </ul>
        <div class="upload-control" v-show="isShowUploadImage">
          <div class="progressShow">
            <el-progress
                :text-inside="true"
                :stroke-width="40"
                :percentage=uploadProgress
                :status=uploadStatus
            />
          </div>
          <div style="margin-left: 20px">
            <el-button-group>
              <el-button type="primary" @click="uploadInputButton">添加文件</el-button>
              <el-button type="primary" @click="resetImage">重置图片</el-button>
              <el-button type="primary" @click="uploadFile">提交</el-button>
            </el-button-group>
          </div>
        </div>
      </div>
    </div>
    <div class="showUploadUrlTable" v-if="isShowRespUrlTable && isShowUploadImage">
      <ShowUploadUrl :resp-url-list="respUrlList"/>
    </div>
  </div>
  <ImagePreview v-if="dialogVisible"
                :onClose='closeImagePreview' :url-list="[imageUrl]"/>
</template>
<script>
import {reactive, ref} from "vue";
import {ElMessage} from "element-plus";
import {ImageUpload} from "@/assets/api";
import {v4 as uuidv4} from 'uuid';
import ImagePreview from "@/components/ImagePreview";
import ShowUploadUrl from "@/components/ShowUploadUrl";

export default {
  name: "Index",
  components: {
    ImagePreview,
    ShowUploadUrl
  },
  setup() {
    let direction = ref('ttb');
    let fileInput = ref(null);
    let isShowUploadImage = ref(false);
    let filesList = ref([]);
    let uploadProgress = ref(0);
    let uploadStatus = ref('');
    let srcList = ref([])
    let dialogVisible = ref(false);
    let imageUrl = ref('')
    const isDragOver = ref(false)
    let imageData = ref(null);
    let respUrlList = ref([])
    let isShowRespUrlTable = ref(false);

    // 处理dragover，dragleave事件
    const handleDrag = (e, over) => {
      e.preventDefault()
      isDragOver.value = over;
    }
    // 处理drop事件，当文件释放落下后展示图片
    const handleDrop = (e) => {
      e.preventDefault()
      isDragOver.value = false
      if (e.dataTransfer) {
        dropImageData(e.dataTransfer.files);
      }
    }

    //处理文件拖拽逻辑，当文件拖拽进入区域则isDragOver为true，离开则为false，当文件释放则读取文件
    const dragEvents = {
      'dragover': (e) => {
        handleDrag(e, true)
      },
      'dragleave': (e) => {
        handleDrag(e, false)
      },
      'drop': handleDrop
    }

    //点击上传按钮事件
    const uploadInputButton = () => {
      fileInput.value.click();
    }

    //点击上传区域事件
    const uploadFormPoint = () => {
      fileInput.value.click();
    }

    //关闭预览大图事件
    const closeImagePreview = () => {
      dialogVisible.value = false;
    }

    //传入指定预览图片地址，并且打开预览组件
    const imagePreview = (url) => {
      imageUrl.value = url;
      dialogVisible.value = true;
    }

    //传入图片的uid作为索引，删除图片，如果
    // todo 随着图片的删除而删除链接
    const removeFile = (uid) => {
      filesList.value = filesList.value.filter(file => file.uid !== uid)
      if (filesList.value.length <= 0) {
        isShowUploadImage.value = false;
        //删除完图片，进度条进度归零
        uploadProgress.value = 0;
      }
    }

    //重置图片
    const resetImage = () => {
      if (filesList.value.length > 0) {
        filesList.value = [];
        isShowUploadImage.value = false;
      }
    }

    //点击上传按钮触发上传
    const uploadFile = () => {
      postFile(imageData.value);
    }

    //添加图片数据到图片预览列表
    const uploadImageData = (e) => {
      const target = e.target
      const files = target.files;
      imageData.value = getImageData(files);
      isShowUploadImage.value = true;
    }

    //拖拽图片释放后，添加拖拽携带图片到图片展示列表中
    const dropImageData = (files) => {
      imageData.value = getImageData(files);
      isShowUploadImage.value = true;
    }

    //添加图片到图片展示列表中
    const getImageData = (files) => {
      //进度条状态重置
      uploadStatus.value = '';
      //添加图片后进度条归零
      uploadProgress.value = 0;
      const formData = new FormData()
      let fileObj = reactive({})
      for (let i = 0; i < files.length; i++) {
        let uploadedFile = files[i]
        formData.append('file', uploadedFile)
        //存储图片到fileList上
        fileObj = {
          uid: uuidv4(), // 文件唯一id
          size: uploadedFile.size / 1024,
          name: uploadedFile.name,
          raw: uploadedFile,
          url: URL.createObjectURL(uploadedFile)
        }
        filesList.value.push(fileObj)
        srcList.value.push(fileObj.url)
      }
      return formData;
    }

    //发送图片文件方法
    const postFile = (formData) => {
      ImageUpload(formData, progressEvent => {
        uploadProgress.value = (progressEvent.loaded / progressEvent.total * 100 | 0)
      }).then(resp => {
        isShowUploadImage.value = true;
        if (resp.code === 200) {
          ElMessage.success({
            message: '上传图片成功！'
          });
          uploadStatus.value = 'success'
          respUrlList.value = resp.data;
          isShowRespUrlTable.value = true;
        } else {
          ElMessage.error({
            message: resp.message
          })
          uploadStatus.value = 'exception'
        }
      }).catch(() => {
        isShowUploadImage.value = true;
        ElMessage.error("系统发生了一个错误，请稍等！");
        uploadStatus.value = 'exception'
      }).finally(() => {
        if (fileInput.value) {
          fileInput.value.value = ''
        }
      })
    }

    return {
      direction,
      uploadInputButton,
      uploadFormPoint,
      fileInput,
      isShowUploadImage,
      uploadImageData,
      filesList,
      removeFile,
      uploadProgress,
      uploadStatus,
      srcList,
      imagePreview,
      dialogVisible,
      closeImagePreview,
      imageUrl,
      dragEvents,
      isDragOver,
      uploadFile,
      resetImage,
      respUrlList,
      isShowRespUrlTable,

    }
  }
}
</script>

<style scoped>

.uploadMain{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.upload-box {
  height: 400px;
  margin-top: 20px;
  border: 2px dashed gray;
  padding: 50px;
  cursor: pointer;
}

.upload-tip {
  font-size: 24px;
  color: #aaaaaa;
  text-align: center;
}

.upload-info {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 600px;
  height: 100%;
}

.image-show-box {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: -50px;
}

.image-preview {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 1350px;
  height: 80%;
  border: 1px solid var(--el-border-color-base);
}

.image-items {
  display: flex;
  flex-wrap: wrap;
}

.image-item {
  margin: 8px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  box-shadow: 0 0 10px 0 rgb(0 0 0 / 20%);
  padding: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 220px;
  height: 250px;
}

.image-item:hover {
  border: 1px solid rgba(0, 0, 0, 0.3);
  box-shadow: 0 0 10px 0 rgb(0 0 0 / 40%);
}

.file-footer {
  width: 100%;
  height: 100%;
}

.file-control-button {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}

.upload-control {
  display: flex;
  flex-direction: row;
  margin: 10px;
  border-top: 1px solid rgba(0, 0, 0, 0.3);
  padding-top: 10px;
}

.progressShow {
  width: 78%;
}

.showUploadUrlTable{


}

.el-image__inner,
.el-image__error {
  visibility: hidden;
}

.is-dragover {
  background: #eeeeee;
}

</style>