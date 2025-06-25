import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
api.interceptors.request.use(
  config => {
    console.log('API请求:', config.method?.toUpperCase(), config.url, config.data)
    return config
  },
  error => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  response => {
    console.log('API响应:', response.status, response.data)
    return response.data
  },
  error => {
    console.error('响应错误:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export const apiService = {
  // 获取用户ID
  getUserId: () => api.get('/user'),
  
  // 获取日记条目
  getDiaryEntries: (userId) => api.get(`/diary/${userId}`),
  
  // 保存日记条目
  saveDiaryEntry: (userId, data) => api.post(`/diary/${userId}`, data),
  
  // 获取UAS7分数
  getUAS7: (userId) => api.get(`/uas7/${userId}`)
}
