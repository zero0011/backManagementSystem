import axios from 'axios'
import QS from 'qs'

if (process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL = 'http://10.64.152.17:18888/front'
  // axios.defaults.baseURL = 'http://htp.horizon.ai/front'
} else if (process.env.NODE_ENV === 'production') {
  axios.defaults.baseURL = 'http://10.64.152.17:18888/front'
  // axios.defaults.baseURL = 'http://htp.horizon.ai/front'
  // axios.defaults.baseURL = 'http://10.64.152.17:28888/front'
  // axios.defaults.baseURL = 'http://10.69.2.17:80/front'
}

// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

export function get (url, params) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err.data)
    })
  })
}

export function post (url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, QS.stringify(params), {
      // headers: {
      //   'Content-Type': 'application/x-www-form-urlencoded'
      // }
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err.data)
    })
  })
}
export function postFormData (url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, params, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err.data)
    })
  })
}

export function postObj (url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, params).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err.data)
    })
  })
}

export function put (url, params) {
  return new Promise((resolve, reject) => {
    axios.put(url + '?messageId=' + params).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err.data)
    })
  })
}

export const baseUrl = axios.defaults.baseURL
