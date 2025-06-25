<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">设置</h1>
      <p class="page-subtitle">个性化您的使用体验</p>
    </div>

    <!-- 提醒设置 -->
    <div class="settings-section card">
      <div class="section-header">
        <svg class="section-icon" viewBox="0 0 24 24" fill="none">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" stroke-width="1.5"/>
        </svg>
        <h3>提醒设置</h3>
      </div>
      
      <div class="settings-list">
        <div class="setting-item">
          <div class="setting-info">
            <div class="setting-title">每日记录提醒</div>
            <div class="setting-desc">每天提醒您记录症状</div>
          </div>
          <div class="setting-control">
            <label class="toggle-switch">
              <input 
                type="checkbox" 
                v-model="settings.dailyReminder"
                @change="saveSettings"
              />
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>
        
        <div class="setting-item" v-if="settings.dailyReminder">
          <div class="setting-info">
            <div class="setting-title">提醒时间</div>
            <div class="setting-desc">选择合适的提醒时间</div>
          </div>
          <div class="setting-control">
            <input 
              type="time" 
              v-model="settings.reminderTime"
              @change="saveSettings"
              class="time-input"
            />
          </div>
        </div>
        
        <div class="setting-item">
          <div class="setting-info">
            <div class="setting-title">服药提醒</div>
            <div class="setting-desc">提醒您按时服药</div>
          </div>
          <div class="setting-control">
            <label class="toggle-switch">
              <input 
                type="checkbox" 
                v-model="settings.medicationReminder"
                @change="saveSettings"
              />
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div class="setting-item" v-if="settings.medicationReminder">
          <div class="setting-info">
            <div class="setting-title">服药时间</div>
            <div class="setting-desc">设置用药提醒时间</div>
          </div>
          <div class="setting-control">
            <div class="medication-times">
              <input 
                v-for="(time, index) in settings.medicationTimes" 
                :key="index"
                type="time" 
                v-model="settings.medicationTimes[index]"
                @change="saveSettings"
                class="time-input small"
              />
              <button 
                v-if="settings.medicationTimes.length < 3"
                @click="addMedicationTime"
                class="add-time-btn"
              >
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14 M5 12h14" stroke="currentColor" stroke-width="2"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 数据管理 -->
    <div class="settings-section card">
      <div class="section-header">
        <svg class="section-icon" viewBox="0 0 24 24" fill="none">
          <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34 M18 2l4 4 M22 6l-10 10-4 1 1-4 10-10z" stroke="currentColor" stroke-width="1.5"/>
        </svg>
        <h3>数据管理</h3>
      </div>
      
      <div class="data-actions">
        <div class="action-card" @click="exportData">
          <div class="action-icon export">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12" stroke="currentColor" stroke-width="1.5"/>
            </svg>
          </div>
          <div class="action-content">
            <div class="action-title">导出数据</div>
            <div class="action-desc">备份您的所有记录</div>
          </div>
          <div class="action-arrow">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
        </div>
        
        <div class="action-card" @click="importData">
          <div class="action-icon import">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3" stroke="currentColor" stroke-width="1.5"/>
            </svg>
          </div>
          <div class="action-content">
            <div class="action-title">导入数据</div>
            <div class="action-desc">从备份文件恢复数据</div>
          </div>
          <div class="action-arrow">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
        </div>
        
        <div class="action-card" @click="syncData">
          <div class="action-icon sync">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8 M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16 M8 8l4 4 4-4" stroke="currentColor" stroke-width="1.5"/>
            </svg>
          </div>
          <div class="action-content">
            <div class="action-title">云端同步</div>
            <div class="action-desc">同步数据到云端（开发中）</div>
          </div>
          <div class="action-arrow">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
        </div>
        
        <div class="action-card danger" @click="clearData">
          <div class="action-icon clear">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18 M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6 M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2 M10 11v6 M14 11v6" stroke="currentColor" stroke-width="1.5"/>
            </svg>
          </div>
          <div class="action-content">
            <div class="action-title">清除所有数据</div>
            <div class="action-desc">删除所有记录（不可恢复）</div>
          </div>
          <div class="action-arrow">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- 使用统计 -->
    <div class="settings-section card">
      <div class="section-header">
        <svg class="section-icon" viewBox="0 0 24 24" fill="none">
          <path d="M3 3v18h18 M7 12l4-4 4 4 4-4" stroke="currentColor" stroke-width="1.5"/>
        </svg>
        <h3>使用统计</h3>
      </div>
      
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-icon">📊</div>
          <div class="stat-content">
            <div class="stat-value">{{ totalEntries }}</div>
            <div class="stat-label">总记录数</div>
          </div>
        </div>
        
        <div class="stat-item">
          <div class="stat-icon">📅</div>
          <div class="stat-content">
            <div class="stat-value">{{ usageDays }}</div>
            <div class="stat-label">使用天数</div>
          </div>
        </div>
        
        <div class="stat-item">
          <div class="stat-icon">🏆</div>
          <div class="stat-content">
            <div class="stat-value">{{ streakDays }}</div>
            <div class="stat-label">连续记录</div>
          </div>
        </div>
        
        <div class="stat-item">
          <div class="stat-icon">📈</div>
          <div class="stat-content">
            <div class="stat-value">{{ averageScore.toFixed(1) }}</div>
            <div class="stat-label">平均评分</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 关于信息 -->
    <div class="settings-section card">
      <div class="section-header">
        <svg class="section-icon" viewBox="0 0 24 24" fill="none">
          <path d="M12 16v-4 M12 8h.01 M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="currentColor" stroke-width="1.5"/>
        </svg>
        <h3>关于</h3>
      </div>
      
      <div class="about-content">
        <div class="app-info">
          <div class="app-logo">
            <div class="logo-circle">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M9 12l2 2 4-4 M7.835 4.697a3.42 3.42 0 0 0 1.946-.806 3.42 3.42 0 0 1 4.438 0 3.42 3.42 0 0 0 1.946.806 3.42 3.42 0 0 1 3.138 3.138 3.42 3.42 0 0 0 .806 1.946 3.42 3.42 0 0 1 0 4.438 3.42 3.42 0 0 0-.806 1.946 3.42 3.42 0 0 1-3.138 3.138 3.42 3.42 0 0 0-1.946.806 3.42 3.42 0 0 1-4.438 0 3.42 3.42 0 0 0-1.946-.806 3.42 3.42 0 0 1-3.138-3.138 3.42 3.42 0 0 0-.806-1.946 3.42 3.42 0 0 1 0-4.438 3.42 3.42 0 0 0 .806-1.946 3.42 3.42 0 0 1 3.138-3.138z" stroke="currentColor" stroke-width="1.5"/>
              </svg>
            </div>
          </div>
          <div class="app-details">
            <div class="app-name">UAS7 追踪</div>
            <div class="app-version">版本 1.0.0</div>
            <div class="app-build">构建 2025.06.25</div>
          </div>
        </div>
        
        <div class="info-list">
          <div class="info-item">
            <span class="info-label">开发者</span>
            <span class="info-value">健康管理团队</span>
          </div>
          <div class="info-item">
            <span class="info-label">技术支持</span>
            <span class="info-value">support@uas7.app</span>
          </div>
          <div class="info-item">
            <span class="info-label">隐私政策</span>
            <span class="info-value info-link" @click="showPrivacyPolicy">查看详情</span>
          </div>
          <div class="info-item">
            <span class="info-label">使用条款</span>
            <span class="info-value info-link" @click="showTerms">查看详情</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 免责声明 -->
    <div class="disclaimer card">
      <div class="disclaimer-header">
        <svg class="disclaimer-icon" viewBox="0 0 24 24" fill="none">
          <path d="M12 9v4 M12 17h.01 M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="currentColor" stroke-width="1.5"/>
        </svg>
        <strong>重要提醒</strong>
      </div>
      <div class="disclaimer-content">
        <p>本应用仅用于个人症状记录和健康管理参考，不能替代专业医疗诊断和治疗。</p>
        <p>如有健康问题，请及时咨询专业医生或医疗机构。</p>
        <p>记录的数据仅保存在您的设备本地，我们不会收集或存储您的个人健康信息。</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useUasStore } from '@/stores/uas'
import dayjs from 'dayjs'

export default {
  name: 'Settings',
  setup() {
    const uasStore = useUasStore()
    
    const settings = ref({
      dailyReminder: true,
      reminderTime: '21:30',
      medicationReminder: false,
      medicationTimes: ['08:00']
    })

    const totalEntries = computed(() => {
      return uasStore.entries.length
    })

    const usageDays = computed(() => {
      if (uasStore.entries.length === 0) return 0
      const firstEntry = uasStore.entries[uasStore.entries.length - 1]
      return dayjs().diff(dayjs(firstEntry.date), 'day') + 1
    })

    const streakDays = computed(() => {
      // 计算连续记录天数
      if (uasStore.entries.length === 0) return 0
      
      let streak = 0
      let currentDate = dayjs()
      
      while (true) {
        const dateStr = currentDate.format('YYYY-MM-DD')
        const hasEntry = uasStore.entries.some(entry => entry.date === dateStr)
        
        if (hasEntry) {
          streak++
          currentDate = currentDate.subtract(1, 'day')
        } else {
          break
        }
        
        if (streak > 365) break // 防止无限循环
      }
      
      return streak
    })

    const averageScore = computed(() => {
      if (uasStore.entries.length === 0) return 0
      const total = uasStore.entries.reduce((sum, entry) => sum + entry.day_score, 0)
      return total / uasStore.entries.length
    })

    const addMedicationTime = () => {
      if (settings.value.medicationTimes.length < 3) {
        settings.value.medicationTimes.push('12:00')
        saveSettings()
      }
    }

    const saveSettings = () => {
      localStorage.setItem('uas7-settings', JSON.stringify(settings.value))
      showToast('设置已保存', 'success')
    }

    const exportData = () => {
      try {
        const data = {
          entries: uasStore.entries,
          settings: settings.value,
          exportInfo: {
            date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            version: '1.0.0',
            totalEntries: totalEntries.value
          }
        }
        
        const jsonString = JSON.stringify(data, null, 2)
        const blob = new Blob([jsonString], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        
        const link = document.createElement('a')
        link.href = url
        link.download = `uas7-backup-${dayjs().format('YYYY-MM-DD')}.json`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        
        showToast('数据导出成功！', 'success')
      } catch (error) {
        console.error('导出失败:', error)
        showToast('数据导出失败，请重试', 'error')
      }
    }

    const importData = () => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.json'
      
      input.onchange = (event) => {
        const file = event.target.files[0]
        if (!file) return
        
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target.result)
            if (data.entries && Array.isArray(data.entries)) {
              showToast('数据导入功能正在开发中...', 'info')
            } else {
              throw new Error('Invalid data format')
            }
          } catch (error) {
            console.error('导入失败:', error)
            showToast('文件格式错误，请选择有效的备份文件', 'error')
          }
        }
        reader.readAsText(file)
      }
      
      input.click()
    }

    const syncData = () => {
      showToast('云端同步功能正在开发中...', 'info')
    }

    const clearData = () => {
      if (confirm('⚠️ 确定要清除所有数据吗？\n\n此操作将删除所有症状记录，且无法恢复。建议先导出备份。')) {
        if (confirm('最后确认：真的要删除所有记录吗？')) {
          showToast('数据清除功能正在开发中...', 'info')
        }
      }
    }

    const showPrivacyPolicy = () => {
      const policy = `
隐私政策

1. 数据收集
我们不会收集、存储或传输您的个人健康数据。所有症状记录仅保存在您的设备本地。

2. 数据使用
您的数据仅用于本应用的功能实现，包括症状记录、趋势分析和报告生成。

3. 数据安全
我们采用本地加密存储，确保您的数据安全。建议定期备份重要数据。

4. 数据分享
我们不会与第三方分享您的任何健康数据。

5. 联系我们
如有隐私相关问题，请联系：support@uas7.app
      `
      alert(policy.trim())
    }

    const showTerms = () => {
      const terms = `
使用条款

1. 医疗免责声明
本应用仅用于个人健康记录和参考，不能替代专业医疗诊断。

2. 使用责任
用户需对记录数据的准确性负责，并理解应用的局限性。

3. 服务可用性
我们努力保证服务稳定，但不保证100%可用性。

4. 更新和修改
我们可能会更新应用功能和条款，重要变更会通知用户。

5. 技术支持
如需帮助，请联系：support@uas7.app
      `
      alert(terms.trim())
    }

    const showToast = (message, type = 'info') => {
      const colors = {
        success: '#6B9B7F',
        error: '#B5827A',
        info: '#6A89A7'
      }
      
      const toast = document.createElement('div')
      toast.textContent = message
      toast.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: ${colors[type]};
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        z-index: 1000;
        font-weight: 500;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      `
      document.body.appendChild(toast)
      
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast)
        }
      }, 3000)
    }

    onMounted(() => {
      // 加载设置
      const savedSettings = localStorage.getItem('uas7-settings')
      if (savedSettings) {
        settings.value = { ...settings.value, ...JSON.parse(savedSettings) }
      }
      
      // 加载数据
      uasStore.loadEntries()
    })

    return {
      settings,
      totalEntries,
      usageDays,
      streakDays,
      averageScore,
      addMedicationTime,
      saveSettings,
      exportData,
      importData,
      syncData,
      clearData,
      showPrivacyPolicy,
      showTerms
    }
  }
}
</script>

<style scoped>
.page-header {
  text-align: center;
  margin-bottom: 32px;
  padding-top: 8px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-label);
  margin-bottom: 6px;
  letter-spacing: -0.02em;
}

.page-subtitle {
  font-size: 15px;
  color: var(--color-secondary-label);
  font-weight: 500;
}

.settings-section {
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border-light);
}

.section-icon {
  width: 24px;
  height: 24px;
  color: var(--color-primary);
  flex-shrink: 0;
}

.section-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-label);
  margin: 0;
  letter-spacing: -0.01em;
}

.settings-list {
  display: flex;
  flex-direction: column;
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 0;
  border-bottom: 1px solid var(--color-border-light);
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-info {
  flex: 1;
}

.setting-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-label);
  margin-bottom: 4px;
  letter-spacing: -0.01em;
}

.setting-desc {
  font-size: 13px;
  color: var(--color-secondary-label);
  line-height: 1.4;
}

.setting-control {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 28px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-border);
  transition: 0.3s ease;
  border-radius: 14px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 22px;
  width: 22px;
  left: 3px;
  bottom: 3px;
  background: white;
  transition: 0.3s ease;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

input:checked + .toggle-slider {
  background: var(--color-primary);
}

input:checked + .toggle-slider:before {
  transform: translateX(20px);
}

.time-input {
  padding: 8px 12px;
  border: 1.5px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-secondary-system-background);
  color: var(--color-label);
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.time-input:focus {
  outline: none;
  border-color: var(--color-primary);
  background: var(--color-tertiary-system-background);
}

.time-input.small {
  padding: 6px 10px;
  font-size: 13px;
  min-width: 80px;
}

.medication-times {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.add-time-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary-lighter);
  border: 1px solid var(--color-primary);
  border-radius: 6px;
  color: var(--color-primary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-time-btn:hover {
  background: var(--color-primary);
  color: white;
}

.add-time-btn svg {
  width: 16px;
  height: 16px;
}

.data-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: var(--color-secondary-system-background);
  border: 1.5px solid var(--color-border-light);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.25s ease;
}

.action-card:hover {
  border-color: var(--color-primary);
  background: var(--color-tertiary-system-background);
  transform: translateY(-1px);
}

.action-card.danger {
  border-color: var(--color-danger);
}

.action-card.danger:hover {
  border-color: var(--color-danger);
  background: rgba(181, 130, 122, 0.08);
}

.action-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  flex-shrink: 0;
}

.action-icon.export { background: rgba(107, 155, 127, 0.15); color: #6B9B7F; }
.action-icon.import { background: rgba(136, 189, 242, 0.15); color: #88BDF2; }
.action-icon.sync { background: rgba(106, 137, 167, 0.15); color: #6A89A7; }
.action-icon.clear { background: rgba(181, 130, 122, 0.15); color: #B5827A; }

.action-icon svg {
  width: 20px;
  height: 20px;
}

.action-content {
  flex: 1;
}

.action-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-label);
  margin-bottom: 4px;
  letter-spacing: -0.01em;
}

.action-card.danger .action-title {
  color: var(--color-danger);
}

.action-desc {
  font-size: 13px;
  color: var(--color-secondary-label);
  line-height: 1.4;
}

.action-arrow {
  color: var(--color-tertiary-label);
}

.action-arrow svg {
  width: 16px;
  height: 16px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px;
  background: var(--color-secondary-system-background);
  border-radius: 12px;
  border: 1px solid var(--color-border-light);
}

.stat-icon {
  font-size: 28px;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-primary);
  line-height: 1;
  margin-bottom: 4px;
  letter-spacing: -0.01em;
}

.stat-label {
  font-size: 12px;
  color: var(--color-secondary-label);
  font-weight: 500;
}

.about-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.app-info {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: var(--color-secondary-system-background);
  border-radius: 16px;
  border: 1px solid var(--color-border-light);
}

.app-logo {
  flex-shrink: 0;
}

.logo-circle {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.logo-circle svg {
  width: 28px;
  height: 28px;
}

.app-details {
  flex: 1;
}

.app-name {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-label);
  margin-bottom: 4px;
  letter-spacing: -0.01em;
}

.app-version {
  font-size: 14px;
  color: var(--color-secondary-label);
  font-weight: 500;
  margin-bottom: 2px;
}

.app-build {
  font-size: 12px;
  color: var(--color-tertiary-label);
}

.info-list {
  display: flex;
  flex-direction: column;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid var(--color-border-light);
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 14px;
  color: var(--color-secondary-label);
  font-weight: 500;
}

.info-value {
  font-size: 14px;
  color: var(--color-label);
  font-weight: 500;
}

.info-link {
  color: var(--color-primary);
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.info-link:hover {
  opacity: 0.7;
}

.disclaimer {
  background: linear-gradient(135deg, rgba(184, 149, 107, 0.08) 0%, rgba(181, 130, 122, 0.08) 100%);
  border: 1.5px solid rgba(184, 149, 107, 0.3);
}

.disclaimer-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  color: #B8956B;
  font-size: 16px;
  font-weight: 600;
}

.disclaimer-icon {
  width: 20px;
  height: 20px;
}

.disclaimer-content {
  color: var(--color-secondary-label);
  font-size: 14px;
  line-height: 1.6;
}

.disclaimer-content p {
  margin-bottom: 12px;
}

.disclaimer-content p:last-child {
  margin-bottom: 0;
}
</style>
