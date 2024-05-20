<template>
  <h2>Files:</h2>
  <div v-if="files?.length>0">
    <table>
      <tr>
        <th></th>
        <th>Filename</th>
        <th>Size</th>
      </tr>
      <tr v-for="file in files" :key="file.id">
        <th><input type="checkbox" value="{{ file.id }}" @change="event => handleFileCheck(file.id, event.currentTarget.checked)"/></th>
        <th>{{ file.filename }}</th>
        <th>{{ file.size }}</th>
      </tr>
    </table>
  </div>
  <div v-else>No files yet. Upload archive.</div>
  <button @click="handleDownload">Download</button>
</template>

<script setup>
import { useFilesStore } from '../stores/files';
import { storeToRefs } from 'pinia';

const filesStore = useFilesStore();
const { files, loading, err7or } = storeToRefs(filesStore)
filesStore.fetchFilesList()

function handleDownload() {
  filesStore.downloadArchive()
}

function handleFileCheck(id, isChecked) {
  filesStore.selectFile(id, isChecked)
}

</script>
