import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {createFilesApi} from '@/api.js'

export const useFilesStore = defineStore('files', () => {
  const files = ref([])
  const selected = ref([])
  const loading = ref(false)
  const error = ref(null)

  const filesApi = createFilesApi()

  async function fetchFilesList() {
    loading.value = true
    error.value = null
    try {
      files.value = await filesApi.fetchFilesList();
    } catch (error) {
      error.value = error.message || 'Failed to fetch files list';
    } finally {
      loading.value = false;
    }
  }

  async function uploadArchive(file) {
    try {
      await filesApi.uploadArchive(file)
      await fetchFilesList()
      alert('Uploaded successfully.')
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Failed to upload file.')
    }
  }

  async function downloadArchive() {
    try {
      if (selected.value.length > 0)
        await filesApi.downloadArchive(selected.value)
    } catch (error) {
      console.error('Error downloading file:', error)
      alert('Failed to download file.')
    }
  }

  async function selectFile(id, isChecked) {
    const index = selected.value.indexOf(id)
    if (isChecked) {
      if (index === -1)
        selected.value.push(id)
    } else {
      if (index !== -1)
        selected.value.splice(index, 1)
    }
  }

  return {
    files,
    loading,
    error,

    fetchFilesList,
    uploadArchive,
    downloadArchive,
    selectFile,
  }
})
