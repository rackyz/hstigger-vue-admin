import axios from 'axios'
let axiosServer = axios.create({
  baseURL: 'http://192.168.14.40:5858/',
  //baseURL:"https://www.nbgzpmis.xyz:10000",
  timeout: 5000
})
axiosServer.interceptors.request.use(config => {
    return config;
}, err => {
    Message.error('请求超时!');
    return Promise.resolve(err);
})

axiosServer.defaults.headers = {
    "api-version": "v0"
}

axiosServer.interceptors.response.use(data => {
    if (data && data.data && data.data.code === -1) {
        return Promise.reject((data.data.error ? data.data.error : (data.data.message ? data.data.message : '未知')))
    }
    return data;
}, err => {
    if (err.message.includes('timeout')) {
        return Promise.reject('网络连接超时')
    }

    if (err.response) {
        if (err.response.status == 504 || err.response.status == 404) {
            return Promise.reject(`网络连接失败:[${err.response.status}]`)
        } else if (err.response.status == 403) {
            return Promise.reject('403-权限不足,请联系管理员!')
        } else if(err.response.status == 401){
            return Promise.reject("tokenoutofdate")
        } else {
            return Promise.reject(`${err.response.status}] ${err}`)
        }


    }

    if (err.config.method == 'options') {
        return Promise.reject('服务器访问失败')
    }
    return Promise.reject(err);
})

export default axiosServer