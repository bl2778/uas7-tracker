<template>
  <div id="app">
    <div class="safe-area-top"></div>
    <router-view />
    <div class="tabbar-container">
      <div class="tabbar-blur"></div>
      <div class="tabbar-content">
        <div 
          v-for="(tab, index) in tabs" 
          :key="tab.path"
          class="tab-item"
          :class="{ active: isActiveTab(tab.path) }"
          @click="navigateTo(tab.path)"
        >
          <div class="tab-icon">
            <svg class="icon" viewBox="0 0 24 24" fill="none">
              <path :d="tab.iconPath" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <span class="tab-label">{{ tab.label }}</span>
        </div>
      </div>
    </div>
    <div class="safe-area-bottom"></div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export default {
  name: 'App',
  setup() {
    const router = useRouter()
    const route = useRoute()
    
    const tabs = [
      { 
        path: '/', 
        label: '首页',
        iconPath: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'
      },
      { 
        path: '/entry', 
        label: '记录',
        iconPath: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'
      },
      { 
        path: '/chart', 
        label: '趋势',
        iconPath: 'M3 3v18h18 M7 12l4-4 4 4 4-4'
      },
      { 
        path: '/export', 
        label: '导出',
        iconPath: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12'
      },
      { 
        path: '/settings', 
        label: '设置',
        iconPath: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z'
      }
    ]

    const isActiveTab = (path) => {
      if (path === '/') {
        return route.path === '/'
      }
      return route.path.startsWith(path)
    }

    const navigateTo = (path) => {
      router.push(path)
    }

    return {
      tabs,
      isActiveTab,
      navigateTo
    }
  }
}
</script>

<style>
@import './styles/colors.css';
@import './styles/typography.css';

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  min-height: 100vh;
  background: var(--color-grouped-background);
}

.safe-area-top {
  height: env(safe-area-inset-top);
  background: var(--color-system-background);
}

.safe-area-bottom {
  height: calc(env(safe-area-inset-bottom) + 83px);
}

.tabbar-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.tabbar-blur {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: var(--backdrop-blur);
  -webkit-backdrop-filter: var(--backdrop-blur);
  border-top: 0.5px solid var(--color-separator);
}

.tabbar-content {
  position: relative;
  display: flex;
  padding: 8px 0 calc(8px + env(safe-area-inset-bottom));
  justify-content: space-around;
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6px 12px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 16px;
  min-width: 64px;
}

.tab-item.active {
  background: rgba(106, 137, 167, 0.08);
  transform: translateY(-1px);
}

.tab-icon {
  margin-bottom: 4px;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.icon {
  width: 22px;
  height: 22px;
  color: var(--color-tertiary-label);
  transition: color 0.25s ease;
}

.tab-item.active .icon {
  color: var(--color-primary);
  transform: scale(1.05);
}

.tab-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--color-tertiary-label);
  transition: color 0.25s ease;
  letter-spacing: -0.01em;
}

.tab-item.active .tab-label {
  color: var(--color-primary);
}

/* 页面容器通用样式 */
.page-container {
  padding: 24px 20px;
  max-width: 428px;
  margin: 0 auto;
  min-height: calc(100vh - 83px - env(safe-area-inset-top) - env(safe-area-inset-bottom));
}

/* 卡片样式 */
.card {
  background: var(--color-secondary-grouped-background);
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 20px;
  border: 0.5px solid var(--color-border-light);
  box-shadow: var(--shadow-sm);
  transition: all 0.25s ease;
}

.card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.card-header {
  font-size: var(--font-title3);
  font-weight: 600;
  color: var(--color-label);
  margin-bottom: 20px;
  letter-spacing: -0.02em;
}

/* 按钮样式 */
.btn-primary {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
  color: white;
  border: none;
  border-radius: 16px;
  padding: 18px 28px;
  font-size: var(--font-body);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
  box-shadow: var(--shadow-sm);
  letter-spacing: -0.01em;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-secondary {
  background: var(--color-secondary-system-background);
  color: var(--color-primary);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 18px 28px;
  font-size: var(--font-body);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
  letter-spacing: -0.01em;
}

.btn-secondary:hover {
  background: var(--color-tertiary-system-background);
  border-color: var(--color-primary);
  transform: translateY(-1px);
}
</style>
