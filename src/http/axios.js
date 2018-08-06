import axios from 'axios';
const baseUrl = 'https://www.easy-mock.com/mock/5aa3bcc6dc3b2d7b9d0e99bf/example';
axios.defaults.timeout = 6000;
axios.defaults.retry = 4;
axios.defaults.retryDelay = 1000;
axios.interceptors.request.use(config => {
    //显示loading
    return config
}, error => {
    return Promise.reject(error)
})
axios.interceptors.response.use(undefined, function axiosRetryInterceptor(err) {
    var config = err.config;
    if (!config || !config.retry) return Promise.reject(err);
    config.__retryCount = config.__retryCount || 0;
    if (config.__retryCount >= config.retry) {
        return Promise.reject(err);
    }
    config.__retryCount += 1;
    var backoff = new Promise(function (resolve) {
        setTimeout(function () {
            resolve();
        }, config.retryDelay || 1);
    });
    return backoff.then(function () {
        return axios(config);
    });
});


const http = (url, params) => {
    if (url.indexOf('http') === -1) { url = baseUrl + url }
    let promise = new Promise(function (resolve, reject) {
        axios.post(url, params, ).then(
            (res) => {
                if (res.status == 200) {
                    console.log(res)
                    resolve(res.data.result);
                } else {
                    // 可根据后台errCode进行具体提示
                }
            }
        ).catch(
            (err) => {
                // console.log(err.status)
                reject(err.status);
            }
        )
    })
    return promise;
    // return axios.post(url, params).then(res => { return res.data.result }).catch((error) => console.log(error, 'error'));
}
export default http;