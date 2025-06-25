<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">数据导出</h1>
      <p class="page-subtitle">导出和分享您的症状记录</p>
    </div>

    <!-- 日期范围选择 -->
    <div class="date-range-card card">
      <div class="card-header">
        <div class="header-icon-wrapper">
          <svg class="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/>
          </svg>
        </div>
        <h3>选择日期范围</h3>
      </div>
      
      <div class="date-range-content">
        <div class="date-presets">
          <button 
            v-for="preset in datePresets" 
            :key="preset.key"
            :class="['preset-btn', { active: selectedPreset === preset.key }]"
            @click="selectPreset(preset)"
          >
            {{ preset.label }}
          </button>
        </div>
        
        <div class="custom-date-range">
          <div class="date-input-group">
            <label class="date-label">开始日期</label>
            <input 
              type="date" 
              v-model="startDate" 
              :max="endDate"
              class="date-input"
            />
          </div>
          <div class="date-separator">至</div>
          <div class="date-input-group">
            <label class="date-label">结束日期</label>
            <input 
              type="date" 
              v-model="endDate" 
              :min="startDate"
              :max="today"
              class="date-input"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 导出选项 -->
    <div class="export-options card">
      <div class="card-header">
        <div class="header-icon-wrapper">
          <svg class="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
          </svg>
        </div>
        <h3>导出格式</h3>
      </div>
      
      <div class="export-types">
        <div 
          v-for="exportType in exportTypes" 
          :key="exportType.key"
          class="export-type-card"
          @click="handleExport(exportType.key)"
          :class="{ loading: loadingStates[exportType.key] }"
        >
          <div class="export-icon-wrapper">
            <div v-if="!loadingStates[exportType.key]" class="export-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path :d="exportType.iconPath"/>
              </svg>
            </div>
            <div v-else class="loading-spinner">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2v4M12 18v4M6.31 6.31l1.42 1.42M14.83 14.83l1.42 1.42M2 12h4M18 12h4M6.31 17.69l1.42-1.42M14.83 9.17l1.42-1.42"/>
              </svg>
            </div>
          </div>
          <div class="export-info">
            <h3 class="export-title">{{ exportType.title }}</h3>
            <p class="export-desc">{{ exportType.description }}</p>
            <div class="export-features">
              <span 
                v-for="feature in exportType.features" 
                :key="feature"
                class="feature-tag"
              >
                {{ feature }}
              </span>
            </div>
          </div>
          <div class="export-action">
            <svg class="action-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- 数据预览 -->
    <div class="preview-card card">
      <div class="card-header">
        <div class="header-icon-wrapper">
          <svg class="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/>
          </svg>
        </div>
        <h3>数据预览</h3>
      </div>
      
      <div class="preview-stats">
        <div class="preview-stat">
          <div class="stat-icon-wrapper">
            <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M8 2v4M16 2v4M3 10h18"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ filteredEntries.length }}</div>
            <div class="stat-label">记录天数</div>
          </div>
        </div>
        <div class="preview-stat">
          <div class="stat-icon-wrapper">
            <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M3 3v18h18M7 12l4-4 4 4 4-4"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ averageScore.toFixed(1) }}</div>
            <div class="stat-label">平均评分</div>
          </div>
        </div>
        <div class="preview-stat">
          <div class="stat-icon-wrapper">
            <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ maxScore }}</div>
            <div class="stat-label">最高评分</div>
          </div>
        </div>
        <div class="preview-stat">
          <div class="stat-icon-wrapper">
            <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M9 12l2 2 4-4"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ completenessRate }}%</div>
            <div class="stat-label">完整度</div>
          </div>
        </div>
      </div>

      <div class="preview-chart">
        <h4 class="chart-title">期间趋势预览</h4>
        <div class="mini-trend">
          <div 
            v-for="(entry, index) in filteredEntries.slice(-14)" 
            :key="entry.id"
            class="trend-day"
            :style="{ 
              height: `${Math.max((entry.day_score / 6) * 36, 2)}px`,
              backgroundColor: getScoreColor(entry.day_score),
              animationDelay: `${index * 0.03}s`
            }"
            :title="`${formatDate(entry.date)}: ${entry.day_score}分`"
          />
        </div>
        <div class="chart-labels">
          <span>{{ filteredEntries.length > 14 ? '最近14天' : '全部' }}</span>
        </div>
      </div>

      <div class="recent-entries" v-if="filteredEntries.length > 0">
        <h4 class="entries-title">最近记录</h4>
        <div class="entries-list">
          <div 
            v-for="entry in filteredEntries.slice(0, 5)" 
            :key="entry.id"
            class="entry-row"
          >
            <div class="entry-date">{{ formatDate(entry.date) }}</div>
            <div class="entry-scores">
              <span class="score-item">风团 {{ entry.wheal_score }}</span>
              <span class="score-plus">+</span>
              <span class="score-item">瘙痒 {{ entry.itch_score }}</span>
            </div>
            <div class="entry-total" :class="`score-${getScoreLevel(entry.day_score)}`">
              {{ entry.day_score }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useUasStore } from '@/stores/uas'
import dayjs from 'dayjs'

export default {
  name: 'Export',
  setup() {
    const uasStore = useUasStore()
    const selectedPreset = ref('last30')
    const startDate = ref(dayjs().subtract(30, 'day').format('YYYY-MM-DD'))
    const endDate = ref(dayjs().format('YYYY-MM-DD'))
    const today = dayjs().format('YYYY-MM-DD')
    const loadingStates = ref({})

    const datePresets = [
      { key: 'last7', label: '最近7天', days: 7 },
      { key: 'last30', label: '最近30天', days: 30 },
      { key: 'last90', label: '最近3个月', days: 90 },
      { key: 'all', label: '全部数据', days: null }
    ]

    const exportTypes = [
      {
        key: 'pdf',
        title: 'PDF 医疗报告',
        description: '完整的症状分析报告，适合医生诊疗',
        iconPath: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8',
        features: ['趋势图表', '统计分析', '专业格式']
      },
      {
        key: 'csv',
        title: 'CSV 数据表格',
        description: '原始数据，便于进一步分析处理',
        iconPath: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M12 18v-6M8 18v-1M16 18v-3',
        features: ['原始数据', 'Excel兼容', '自定义分析']
      },
      {
        key: 'image',
        title: '趋势图片',
        description: '高清趋势图表，便于分享和展示',
        iconPath: 'M15 8h.01M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6zM9 15l2-2 2.5 2.5L18 10',
        features: ['高清图片', '社交分享', '直观展示']
      },
      {
        key: 'json',
        title: 'JSON 备份',
        description: '完整数据备份，包含所有记录信息',
        iconPath: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
        features: ['完整备份', '数据迁移', '开发友好']
      }
    ]

    const filteredEntries = computed(() => {
      return uasStore.entries.filter(entry => {
        return entry.date >= startDate.value && entry.date <= endDate.value
      })
    })

    const averageScore = computed(() => {
      if (filteredEntries.value.length === 0) return 0
      const total = filteredEntries.value.reduce((sum, entry) => sum + entry.day_score, 0)
      return total / filteredEntries.value.length
    })

    const maxScore = computed(() => {
      if (filteredEntries.value.length === 0) return 0
      return Math.max(...filteredEntries.value.map(entry => entry.day_score))
    })

    const completenessRate = computed(() => {
      const totalDays = dayjs(endDate.value).diff(dayjs(startDate.value), 'day') + 1
      return Math.round((filteredEntries.value.length / totalDays) * 100)
    })

    const selectPreset = (preset) => {
      selectedPreset.value = preset.key
      if (preset.days) {
        startDate.value = dayjs().subtract(preset.days, 'day').format('YYYY-MM-DD')
        endDate.value = dayjs().format('YYYY-MM-DD')
      } else {
        if (uasStore.entries.length > 0) {
          startDate.value = uasStore.entries[uasStore.entries.length - 1].date
          endDate.value = uasStore.entries[0].date
        }
      }
    }

    const formatDate = (dateStr) => {
      return dayjs(dateStr).format('MM/DD')
    }

    const getScoreLevel = (score) => {
      if (score <= 1) return 'good'
      if (score <= 3) return 'fair'
      if (score <= 5) return 'poor'
      return 'severe'
    }

    const getScoreColor = (score) => {
      if (score <= 1) return '#6B9B7F'
      if (score <= 3) return '#B8956B'
      if (score <= 5) return '#B5827A'
      return '#A67B82'
    }

    const handleExport = async (type) => {
      loadingStates.value[type] = true
      
      try {
        switch (type) {
          case 'pdf':
            await exportPDF()
            break
          case 'csv':
            await exportCSV()
            break
          case 'image':
            await exportImage()
            break
          case 'json':
            await exportJSON()
            break
        }
      } catch (error) {
        console.error(`导出${type}失败:`, error)
        showToast(`导出失败，请重试`, 'error')
      } finally {
        loadingStates.value[type] = false
      }
    }

    const exportPDF = async () => {
      await new Promise(resolve => setTimeout(resolve, 2000))
      showToast('PDF报告生成功能开发中...', 'info')
    }

    const exportCSV = async () => {
      const csvContent = generateCSV()
      downloadFile(csvContent, `uas7-data-${startDate.value}-${endDate.value}.csv`, 'text/csv')
      showToast('CSV文件已下载', 'success')
    }

    const exportImage = async () => {
      await new Promise(resolve => setTimeout(resolve, 1500))
      showToast('图片导出功能开发中...', 'info')
    }

    const exportJSON = async () => {
      const jsonData = {
        exportInfo: {
          date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          dateRange: { start: startDate.value, end: endDate.value },
          totalEntries: filteredEntries.value.length,
          version: '1.0.0'
        },
        entries: filteredEntries.value
      }
      
      const jsonString = JSON.stringify(jsonData, null, 2)
      downloadFile(jsonString, `uas7-backup-${startDate.value}-${endDate.value}.json`, 'application/json')
      showToast('JSON备份已下载', 'success')
    }

    const generateCSV = () => {
      const headers = ['日期', '风团评分', '瘙痒评分', '日总分', '辅助因子', '备注']
      const rows = filteredEntries.value.map(entry => [
        entry.date,
        entry.wheal_score,
        entry.itch_score,
        entry.day_score,
        Object.keys(entry.aux_factors || {}).filter(key => entry.aux_factors[key]).join(';'),
        entry.note || ''
      ])
      
      const csvContent = [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n')
      
      return '\uFEFF' + csvContent
    }

    const downloadFile = (content, filename, mimeType) => {
      const blob = new Blob([content], { type: mimeType })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
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
      `
      document.body.appendChild(toast)
      
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast)
        }
      }, 3000)
    }

    onMounted(() => {
      uasStore.loadEntries()
    })

    return {
      selectedPreset,
      startDate,
      endDate,
      today,
      loadingStates,
      datePresets,
      exportTypes,
      filteredEntries,
      averageScore,
      maxScore,
      completenessRate,
      selectPreset,
      formatDate,
      getScoreLevel,
      getScoreColor,
      handleExport
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

/* 卡片头部样式 */
.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.header-icon-wrapper {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(106, 137, 167, 0.1);
  border-radius: 8px;
  flex-shrink: 0;
}

.header-icon {
  width: 18px;
  height: 18px;
  color: var(--color-primary);
}

.card-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-label);
  margin: 0;
  letter-spacing: -0.02em;
}

/* 日期选择区域 */
.date-range-card {
  margin-bottom: 20px;
}

.date-range-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.date-presets {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.preset-btn {
  padding: 8px 16px;
  background: var(--color-secondary-system-background);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  color: var(--color-secondary-label);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.preset-btn.active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.preset-btn:not(.active):hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.custom-date-range {
  display: flex;
  align-items: end;
  gap: 16px;
}

.date-input-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.date-label {
  font-size: 13px;
  color: var(--color-secondary-label);
  font-weight: 500;
}

.date-input {
  padding: 12px 16px;
  border: 1.5px solid var(--color-border);
  border-radius: 12px;
  background: var(--color-secondary-system-background);
  color: var(--color-label);
  font-size: 15px;
  transition: all 0.2s ease;
}

.date-input:focus {
  outline: none;
  border-color: var(--color-primary);
  background: var(--color-tertiary-system-background);
}

.date-separator {
  font-size: 14px;
  color: var(--color-tertiary-label);
  margin-bottom: 6px;
  font-weight: 500;
}

/* 导出选项 */
.export-options {
  margin-bottom: 20px;
}

.export-types {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.export-type-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: var(--color-secondary-system-background);
  border: 1.5px solid var(--color-border-light);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.25s ease;
}

.export-type-card:hover {
  border-color: var(--color-primary);
  background: var(--color-tertiary-system-background);
  transform: translateY(-1px);
}

.export-type-card.loading {
  pointer-events: none;
  opacity: 0.7;
}

.export-icon-wrapper {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(106, 137, 167, 0.1);
  border-radius: 12px;
  flex-shrink: 0;
}

.export-icon svg {
  width: 22px;
  height: 22px;
  color: var(--color-primary);
}

.loading-spinner svg {
  width: 20px;
  height: 20px;
  color: var(--color-primary);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.export-info {
  flex: 1;
}

.export-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-label);
  margin-bottom: 4px;
  letter-spacing: -0.01em;
}

.export-desc {
  font-size: 13px;
  color: var(--color-secondary-label);
  margin-bottom: 8px;
  line-height: 1.4;
}

.export-features {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.feature-tag {
  padding: 2px 8px;
  background: rgba(106, 137, 167, 0.15);
  color: var(--color-primary);
  font-size: 11px;
  font-weight: 500;
  border-radius: 10px;
}

.export-action {
  color: var(--color-tertiary-label);
  flex-shrink: 0;
}

.action-arrow {
  width: 16px;
  height: 16px;
}

/* 数据预览 */
.preview-card {
  padding: 24px;
}

.preview-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.preview-stat {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: var(--color-secondary-system-background);
  border-radius: 12px;
}

.stat-icon-wrapper {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(106, 137, 167, 0.1);
  border-radius: 8px;
  flex-shrink: 0;
}

.stat-icon {
  width: 16px;
  height: 16px;
  color: var(--color-primary);
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 4px;
  letter-spacing: -0.01em;
}

.stat-label {
  font-size: 11px;
  color: var(--color-secondary-label);
  font-weight: 500;
}

.preview-chart {
  margin-bottom: 24px;
}

.chart-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-label);
  margin-bottom: 16px;
}

.mini-trend {
  display: flex;
  align-items: end;
  gap: 2px;
  height: 48px;
  margin-bottom: 8px;
  padding: 0 4px;
}

.trend-day {
  flex: 1;
  border-radius: 2px;
  min-height: 2px;
  animation: slideUp 0.4s ease-out both;
  transition: all 0.2s ease;
}

@keyframes slideUp {
  from {
    height: 2px !important;
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.chart-labels {
  text-align: center;
  font-size: 11px;
  color: var(--color-tertiary-label);
  font-weight: 500;
}

.entries-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-label);
  margin-bottom: 16px;
}

.entries-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.entry-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--color-secondary-system-background);
  border-radius: 8px;
}

.entry-date {
  font-size: 13px;
  color: var(--color-secondary-label);
  font-weight: 500;
  min-width: 40px;
}

.entry-scores {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  justify-content: center;
}

.score-item {
  font-size: 12px;
  color: var(--color-tertiary-label);
}

.score-plus {
  font-size: 10px;
  color: var(--color-quaternary-label);
}

.entry-total {
  font-size: 16px;
  font-weight: 700;
  min-width: 24px;
  text-align: right;
}

.score-good { color: #6B9B7F; }
.score-fair { color: #B8956B; }
.score-poor { color: #B5827A; }
.score-severe { color: #A67B82; }
</style>
