<template>
  <div class="showUrlBox">
    <div class="showUrlTable">
      <el-table :data="urlArray" :border="true" style="width: 100%">
        <el-table-column prop="fileName" label="文件名" width="180"/>
        <el-table-column prop="url" label="文件地址"/>
      </el-table>
    </div>
  </div>
</template>
<script>

import {ref, toRef, watchEffect} from "vue";

export default {
  name: "ShowUploadUrl",
  props: {
    respUrlList: Array
  },
  setup(props){

    let urlArray = ref([]);

    watchEffect(()=>{
      let propUrlList = toRef(props,'respUrlList');
      for (let i = 0; i < propUrlList.value.length; i++) {
        urlArray.value.push(propUrlList.value[i])
      }
    })

    return{
      urlArray
    }

  }
}
</script>

<style scoped>

.showUrlBox {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1200px;
}

.showUrlTable {
  width: 100%;
}

</style>