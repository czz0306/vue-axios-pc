import http from '../http/axios.js'
export const data = (params) => {
    return http('/qzx/selectList', params)
    // return axios.post(baseUrl + '/qzx/selectList', params).then(res => { return res.data.result });
}
let list = {
    data,
}
export default list;