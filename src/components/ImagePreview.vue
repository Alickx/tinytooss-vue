<template>
  <div>
    <el-image-viewer
        v-bind="$attrs"
        ref="elImageViewer"
    />
  </div>
</template>

<script>
import ElImageViewer from 'element-plus/lib/components/image-viewer'
import {onMounted, ref} from "vue";
import mitt from "mitt";

export default {
  name: "ImagePreview",
  components: {
    ElImageViewer
  },
  props: {
    maskhide: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {

    let elImageViewer = ref(null);
    const emitter = mitt();

    onMounted(() => {
      if (props.maskhide) {
        addHideToMask();
      }
    })

    const addHideToMask = () => {
      if (elImageViewer.value) {
        const mask = elImageViewer.value.$el.querySelector('.el-image-viewer__mask');
        if (mask) {
          // 遮罩层增加点击事件，关闭预览
          mask.addEventListener('click',hide)
          // hook卸载事件，移除之前添加在mask元素的事件
          emitter.on('hook:beforeMount', () => {
            mask && mask.removeEventListener('click', hide)
          })
        }
      }
    }

    const hide = () => {
      if (elImageViewer.value) {
        elImageViewer.value.hide();
      }
    }
    return {
      elImageViewer,
      addHideToMask
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-image-viewer__btn.el-image-viewer__close {
  color: #fff;
}
</style>