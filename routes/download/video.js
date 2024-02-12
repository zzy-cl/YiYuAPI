const axios = require('axios')

function downloadVideo(url) {
  return axios({
    method: 'get', url: url, responseType: 'arraybuffer'
  })
      .then(res => res.data)
      .catch(err => {
        console.log(err);
        return {
          code: 1, message: '数据流转化失败，请重试'
        };
      });
}

module.exports = {
  downloadVideo
}