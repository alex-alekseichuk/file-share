<template>
  <h2>Upload archive:</h2>
  <form>
    <input type="file" @change="handleFileChange" />
  </form>
</template>

<script setup>
import { useFilesStore } from '../stores/files';
import { storeToRefs } from 'pinia';

const filesStore = useFilesStore()
const { loading, error } = storeToRefs(filesStore)

async function handleFileChange(event) {
  const fileList = event.target.files
  if (fileList.length > 0) {
    await filesStore.uploadArchive(fileList[0])
  }
}

</script>
