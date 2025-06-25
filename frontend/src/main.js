import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import NutUI from '@nutui/nutui'
import App from './App.vue'

// 路由配置
const routes = [
  { path: '/', name: 'Home', component: () => import('./views/Home.vue') },
  { path: '/entry/:date?', name: 'Entry', component: () => import('./views/Entry.vue') },
  { path: '/chart', name: 'Chart', component: () => import('./views/Chart.vue') },
  { path: '/export', name: 'Export', component: () => import('./views/Export.vue') },
  { path: '/settings', name: 'Settings', component: () => import('./views/Settings.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const pinia = createPinia()
const app = createApp(App)

app.use(NutUI)
app.use(router)
app.use(pinia)
app.mount('#app')
