import axios from 'axios';

export function createFilesApi() {
    const BASE_URL = 'http://localhost:3001/api'

    async function fetchFilesList() {
        const response = await axios.get(`${BASE_URL}/files`)
        return response.data.files ?? [];
    }

    async function uploadArchive(file) {
        const formData = new FormData();
        formData.append('file', file);
        const response = await axios.post(`${BASE_URL}/upload-archive`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }

    async function downloadArchive(fileIds) {
        const url = `${BASE_URL}/download-archive?files=${fileIds.join(',')}`
        window.location = url
        return
        const response = await axios.get(url)

        const contentDisposition = response.headers['content-disposition'];
        let filename = 'files.zip'; // Default filename
        if (contentDisposition && contentDisposition.indexOf('attachment') !== -1) {
            const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            const matches = filenameRegex.exec(contentDisposition);
            if (matches != null && matches[1]) {
                filename = matches[1].replace(/['"]/g, ''); // Remove quotes if present
            }
        }

        const blob = new Blob([response.data], { type: 'application/zip' })
        // Create a link element and set its href to the Blob URL
        const link = document.createElement('a');
        const blobUrl = URL.createObjectURL(blob);
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
    }

    return {
        fetchFilesList,
        uploadArchive,
        downloadArchive,
    }
}
