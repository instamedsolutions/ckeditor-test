import { FileLoader } from 'ckeditor5';

const JWT = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3NDg5OTgwODIsImV4cCI6MjM1Mzc5ODA4Miwicm9sZXMiOlsiUk9MRV9NRURFQ0lOIiwiUk9MRV9VU0VSIl0sImlkIjozNTc0NywiaW5zdGl0dXRpb24iOiJteSIsImNyZWF0ZWREYXRlIjoxNzQ4OTk4MDgyLCIyZmEiOmZhbHNlfQ.J1KSGQpJWW9-9hcI9QWltzdWDBD_8LNYbj2S3tjVHOUGIewF5TYRJxE_yoaHAEZfQeL2dLM8W_GBsAUqFO-zMR54WNPErkAc9cErfIDyjOV1oNfgDhTHr0xkuUJhMnthl3NafyPyX_dWW3Cfff1d2FHIsppABdxV4Poou-T620S1Zm6_N7P2Zi8bKpmXj0m6X6jvF7nB0IeQdAnYqGqC1fsQCvQL9PqdmUXIEN-CZMCWUk2EtdExEF3wldxWJWcxhRvk4bZqiDCOB_98-gLCiIUcXqYYa_XwHLge5FEv7KM5X8PlMB5ivA8c7vV9p4Xv14CCsOnud4iK3YEQ35GESg';

export const uploadedDataUrls = new Map();

class UploadAdapter {
  loader;
  controller;

  constructor(loader : FileLoader) {
    // Save Loader instance to update upload progress.
    this.loader = loader;
    this.controller = new AbortController();
  }

  async upload() {

    const data = new FormData();

    const file = await this.loader.file;

    if(!(file instanceof File)) {
      // eslint-disable-next-line no-console
      console.error('File is not an instance of File',file);
      return;
    }

    data.append('file',file);
    data.append('getUrl','true');

    return new Promise((resolve, reject) => {
      fetch('https://www.instamed.local/api/v2/upload', {
        method: 'POST',
        body: data,
        headers: {
          'Authorization': `Bearer ${JWT}`,
        },
        credentials: 'include',
        signal: this.controller.signal
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(resData => {

          const responseData = {
            urls: {
              default: resData.url,
            },
          };

          uploadedDataUrls.set(resData.url, resData.key);

          resolve(responseData);
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.error('Upload error:', error);
          reject(error);
        });
    });
  }

  abort() {
    // Abort the upload request.
    if (this.controller) {
      this.controller.abort();
    }
  }
}

export default UploadAdapter;
