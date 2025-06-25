<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">趋势分析</h1>
      <p class="page-subtitle">症状变化趋势与统计数据</p>
    </div>

    <!-- 图表选项卡 -->
    <div class="chart-tabs card">
      <div class="tab-group">
        <button 
          v-for="tab in chartTabs" 
          :key="tab.key"
          :class="['tab-button', { active: activeTab === tab.key }]" 
          @click="activeTab = tab.key"
        >
          <div class="tab-icon-wrapper">
            <svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path :d="tab.iconPath"/>
            </svg>
          </div>
          <span class="tab-label">{{ tab.label }}</span>
        </button>
      </div>
    </div>

    <!-- 图表内容 -->
    <div class="chart-container card">
      <div v-if="activeTab === 'daily'" class="chart-section">
        <div class="chart-header">
          <div class="chart-icon-wrapper">
            <svg class="chart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M3 3v18h18M7 12l4-4 4 4 4-4"/>
            </svg>
          </div>
          <div class="chart-info">
            <h3>近30天日评分趋势</h3>
            <p>每日症状评分变化曲线</p>
          </div>
        </div>
        <div ref="dailyChart" class="chart-canvas"></div>
      </div>
      
      <div v-else-if="activeTab === 'weekly'" class="chart-section">
        <div class="chart-header">
          <div class="chart-icon-wrapper">
            <svg class="chart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M3 3v18h18M7 17l3-8 4 8 4-4"/>
            </svg>
          </div>
          <div class="chart-info">
            <h3>近12周UAS7趋势</h3>
            <p>每周综合评分统计</p>
          </div>
        </div>
        <div ref="weeklyChart" class="chart-canvas"></div>
      </div>

      <div v-else-if="activeTab === 'factors'" class="chart-section">
        <div class="chart-header">
          <div class="chart-icon-wrapper">
            <svg class="chart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253"/>
            </svg>
          </div>
          <div class="chart-info">
            <h3>影响因子分析</h3>
            <p>各种因素对症状的关联性</p>
          </div>
        </div>
        <div class="factors-analysis">
          <div 
            v-for="factor in factorsData" 
            :key="factor.name"
            class="factor-item"
          >
            <div class="factor-info">
              <div class="factor-icon-wrapper">
                <span class="factor-icon">{{ factor.icon }}</span>
              </div>
              <div class="factor-details">
                <span class="factor-name">{{ factor.name }}</span>
                <span class="factor-count">{{ factor.count }}次记录</span>
              </div>
            </div>
            <div class="factor-correlation">
              <div class="correlation-bar">
                <div 
                  class="correlation-fill"
                  :style="{ 
                    width: `${factor.correlation * 100}%`,
                    backgroundColor: getCorrelationColor(factor.correlation)
                  }"
                ></div>
              </div>
              <span class="correlation-value">{{ (factor.correlation * 100).toFixed(0) }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 统计摘要 -->
    <div class="stats-container">
      <div class="stat-card card">
        <div class="stat-icon-wrapper">
          <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-label">平均日评分</span>
          <div class="stat-value" :class="`score-${getScoreLevel(averageDailyScore)}`">
            {{ averageDailyScore.toFixed(1) }}
          </div>
          <div class="stat-trend">
            <svg class="trend-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M7 14l3-3 3 3 5-5"/>
            </svg>
            <span>较上周 {{ trendText }}</span>
          </div>
        </div>
      </div>

      <div class="stat-card card">
        <div class="stat-icon-wrapper">
          <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-label">最高日评分</span>
          <div class="stat-value" :class="`score-${getScoreLevel(maxDailyScore)}`">
            {{ maxDailyScore }}
          </div>
          <div class="stat-date">{{ maxScoreDate }}</div>
        </div>
      </div>

      <div class="stat-card card">
        <div class="stat-icon-wrapper">
          <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-label">本周UAS7</span>
          <div class="stat-value" :class="`severity-${currentUAS7Severity}`">
            {{ currentUAS7 }}
          </div>
          <div class="stat-status">{{ currentUAS7Text }}</div>
        </div>
      </div>
    </div>

    <!-- 记录建议 -->
    <div class="suggestions card" v-if="suggestions.length > 0">
      <div class="suggestions-header">
        <div class="suggestions-icon-wrapper">
          <svg class="suggestions-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
        <h3>智能建议</h3>
      </div>
      <div class="suggestions-list">
        <div 
          v-for="suggestion in suggestions" 
          :key="suggestion.id"
          class="suggestion-item"
        >
          <div class="suggestion-icon-wrapper">
            <span class="suggestion-emoji">{{ suggestion.icon }}</span>
          </div>
          <div class="suggestion-content">
            <div class="suggestion-title">{{ suggestion.title }}</div>
            <div class="suggestion-desc">{{ suggestion.description }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useUasStore } from '@/stores/uas'
import * as echarts from 'echarts'
import dayjs from 'dayjs'

export default {
  name: 'Chart',
  setup() {
    const uasStore = useUasStore()
    const activeTab = ref('daily')
    const dailyChart = ref(null)
    const weeklyChart = ref(null)
    
    let dailyChartInstance = null
    let weeklyChartInstance = null

    const chartTabs = [
      { 
        key: 'daily', 
        label: '日趋势',
        iconPath: 'M3 3v18h18M7 12l4-4 4 4 4-4'
      },
      { 
        key: 'weekly', 
        label: '周趋势',
        iconPath: 'M3 3v18h18M7 17l3-8 4 8 4-4'
      },
      { 
        key: 'factors', 
        label: '影响因子',
        iconPath: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253'
      }
    ]

    const factorsData = ref([
      { name: '服药', icon: '💊', count: 12, correlation: 0.8 },
      { name: '饮酒', icon: '🍷', count: 5, correlation: 0.3 },
      { name: '运动', icon: '🏃', count: 8, correlation: 0.6 },
      { name: '压力', icon: '😰', count: 10, correlation: 0.7 },
      { name: '海鲜', icon: '🦐', count: 3, correlation: 0.4 },
      { name: '辛辣', icon: '🌶️', count: 6, correlation: 0.5 }
    ])

    const suggestions = ref([
      {
        id: 1,
        icon: '📊',
        title: '保持记录频率',
        description: '您本周的记录很完整，建议继续保持这个习惯'
      },
      {
        id: 2,
        icon: '🍃',
        title: '关注饮食影响',
        description: '海鲜类食物可能与症状加重有关，建议减少摄入'
      }
    ])

    const averageDailyScore = computed(() => {
      const scores = uasStore.entries.map(entry => entry.day_score)
      return scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0
    })

    const maxDailyScore = computed(() => {
      const scores = uasStore.entries.map(entry => entry.day_score)
      return scores.length > 0 ? Math.max(...scores) : 0
    })

    const maxScoreDate = computed(() => {
      if (uasStore.entries.length === 0) return ''
      const maxEntry = uasStore.entries.find(entry => entry.day_score === maxDailyScore.value)
      return maxEntry ? dayjs(maxEntry.date).format('MM月DD日') : ''
    })

    const currentUAS7 = computed(() => {
      return uasStore.uas7Data.score || 0
    })

    const currentUAS7Severity = computed(() => {
      return uasStore.uas7Data.severity?.level || 'mild'
    })

    const currentUAS7Text = computed(() => {
      return uasStore.uas7Data.severity?.text || '暂无数据'
    })

    const trendText = computed(() => {
      return '下降 12%'
    })

    const getScoreLevel = (score) => {
      if (score <= 1) return 'good'
      if (score <= 3) return 'fair'
      if (score <= 5) return 'poor'
      return 'severe'
    }

    const getCorrelationColor = (correlation) => {
      if (correlation >= 0.7) return '#B5827A'
      if (correlation >= 0.5) return '#B8956B'
      if (correlation >= 0.3) return '#88BDF2'
      return '#6B9B7F'
    }

    const initDailyChart = () => {
      if (!dailyChart.value) return
      
      const data = uasStore.entries.slice(0, 30).reverse().map(entry => ({
        date: entry.date,
        score: entry.day_score
      }))

      const option = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'axis',
          backgroundColor: '#FFFFFF',
          borderColor: '#E2E8F0',
          borderWidth: 1,
          textStyle: {
            color: '#2C3E50',
            fontSize: 13
          },
          formatter: (params) => {
            const point = params[0]
            return `${dayjs(point.axisValue).format('MM月DD日')}<br/>评分: ${point.value}分`
          }
        },
        grid: {
          left: '5%',
          right: '5%',
          top: '10%',
          bottom: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: data.map(item => item.date),
          axisLabel: { 
            fontSize: 11,
            color: '#78909C',
            formatter: (value) => dayjs(value).format('MM/DD')
          },
          axisLine: {
            lineStyle: { color: '#E2E8F0' }
          },
          axisTick: { show: false }
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: 6,
          axisLabel: { 
            fontSize: 11,
            color: '#78909C'
          },
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: {
            lineStyle: { 
              color: '#F1F5F9',
              type: 'dashed'
            }
          }
        },
        series: [{
          data: data.map(item => item.score),
          type: 'line',
          smooth: true,
          lineStyle: { 
            color: '#6A89A7', 
            width: 3 
          },
          itemStyle: { 
            color: '#6A89A7',
            borderWidth: 2,
            borderColor: '#FFFFFF'
          },
          areaStyle: { 
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(106, 137, 167, 0.3)' },
                { offset: 1, color: 'rgba(106, 137, 167, 0.05)' }
              ]
            }
          }
        }]
      }

      dailyChartInstance = echarts.init(dailyChart.value)
      dailyChartInstance.setOption(option)
    }

    const initWeeklyChart = () => {
      if (!weeklyChart.value) return

      const weeklyData = []
      for (let i = 11; i >= 0; i--) {
        const weekStart = dayjs().subtract(i, 'week').startOf('week')
        const score = Math.floor(Math.random() * 25) + 5
        weeklyData.push({
          week: weekStart.format('MM/DD'),
          score: score
        })
      }

      const option = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'axis',
          backgroundColor: '#FFFFFF',
          borderColor: '#E2E8F0',
          borderWidth: 1,
          textStyle: {
            color: '#2C3E50',
            fontSize: 13
          },
          formatter: (params) => {
            const point = params[0]
            return `${point.axisValue}周<br/>UAS7: ${point.value}分`
          }
        },
        grid: {
          left: '5%',
          right: '5%',
          top: '10%',
          bottom: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: weeklyData.map(item => item.week),
          axisLabel: { 
            fontSize: 11,
            color: '#78909C'
          },
          axisLine: {
            lineStyle: { color: '#E2E8F0' }
          },
          axisTick: { show: false }
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: 42,
          axisLabel: { 
            fontSize: 11,
            color: '#78909C'
          },
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: {
            lineStyle: { 
              color: '#F1F5F9',
              type: 'dashed'
            }
          }
        },
        series: [{
          data: weeklyData.map(item => item.score),
          type: 'bar',
          barWidth: '60%',
          itemStyle: {
            color: (params) => {
              const score = params.value
              if (score <= 6) return '#6B9B7F'
              if (score <= 15) return '#B8956B'
              if (score <= 27) return '#B5827A'
              return '#A67B82'
            },
            borderRadius: [4, 4, 0, 0]
          }
        }]
      }

      weeklyChartInstance = echarts.init(weeklyChart.value)
      weeklyChartInstance.setOption(option)
    }

    onMounted(async () => {
      await uasStore.loadEntries()
      await uasStore.calculateUAS7()
      
      nextTick(() => {
        initDailyChart()
        initWeeklyChart()
      })
    })

    return {
      activeTab,
      chartTabs,
      dailyChart,
      weeklyChart,
      factorsData,
      suggestions,
      averageDailyScore,
      maxDailyScore,
      maxScoreDate,
      currentUAS7,
      currentUAS7Severity,
      currentUAS7Text,
      trendText,
      getScoreLevel,
      getCorrelationColor
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

/* 选项卡样式 */
.chart-tabs {
  padding: 8px;
  margin-bottom: 20px;
}

.tab-group {
  display: flex;
  background: var(--color-secondary-system-background);
  border-radius: 12px;
  padding: 4px;
}

.tab-button {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 12px;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.25s ease;
  color: var(--color-tertiary-label);
}

.tab-button.active {
  background: var(--color-secondary-grouped-background);
  color: var(--color-primary);
  box-shadow: var(--shadow-sm);
}

.tab-icon-wrapper {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tab-icon {
  width: 18px;
  height: 18px;
}

.tab-label {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: -0.01em;
}

/* 图表容器 */
.chart-container {
  margin-bottom: 20px;
}

.chart-section {
  padding: 4px 0;
}

.chart-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding: 0 4px;
}

.chart-icon-wrapper {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(106, 137, 167, 0.1);
  border-radius: 8px;
  flex-shrink: 0;
}

.chart-icon {
  width: 18px;
  height: 18px;
  color: var(--color-primary);
}

.chart-info {
  flex: 1;
}

.chart-info h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-label);
  margin-bottom: 4px;
  letter-spacing: -0.01em;
}

.chart-info p {
  font-size: 14px;
  color: var(--color-secondary-label);
  margin: 0;
}

.chart-canvas {
  height: 280px;
  width: 100%;
  margin-bottom: 8px;
}

/* 因子分析 */
.factors-analysis {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.factor-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: var(--color-secondary-system-background);
  border-radius: 12px;
  border: 1px solid var(--color-border-light);
}

.factor-info {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.factor-icon-wrapper {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.factor-icon {
  font-size: 20px;
}

.factor-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.factor-name {
  font-weight: 600;
  color: var(--color-label);
  font-size: 15px;
}

.factor-count {
  font-size: 12px;
  color: var(--color-tertiary-label);
}

.factor-correlation {
  display: flex;
  align-items: center;
  gap: 12px;
}

.correlation-bar {
  width: 60px;
  height: 6px;
  background: var(--color-border-light);
  border-radius: 3px;
  overflow: hidden;
}

.correlation-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.6s ease;
}

.correlation-value {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-secondary-label);
  min-width: 35px;
  text-align: right;
}

/* 统计卡片 */
.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.stat-card {
  padding: 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
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
  width: 18px;
  height: 18px;
  color: var(--color-primary);
}

.stat-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.stat-label {
  font-size: 12px;
  color: var(--color-secondary-label);
  font-weight: 500;
  text-align: center;
}

.stat-value {
  font-size: 28px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.02em;
}

.score-good { color: #6B9B7F; }
.score-fair { color: #B8956B; }
.score-poor { color: #B5827A; }
.score-severe { color: #A67B82; }

.severity-mild { color: #6B9B7F; }
.severity-light { color: #B8956B; }
.severity-moderate { color: #B5827A; }
.severity-severe { color: #A67B82; }

.stat-trend {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 11px;
  color: var(--color-tertiary-label);
}

.trend-icon {
  width: 12px;
  height: 12px;
  color: #6B9B7F;
  flex-shrink: 0;
}

.stat-date, .stat-status {
  font-size: 11px;
  color: var(--color-tertiary-label);
  font-weight: 500;
}

/* 建议部分 */
.suggestions {
  padding: 24px;
}

.suggestions-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.suggestions-icon-wrapper {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(106, 137, 167, 0.1);
  border-radius: 8px;
  flex-shrink: 0;
}

.suggestions-icon {
  width: 18px;
  height: 18px;
  color: var(--color-primary);
}

.suggestions-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-label);
  margin: 0;
  letter-spacing: -0.02em;
}

.suggestions-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.suggestion-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  background: var(--color-secondary-system-background);
  border-radius: 12px;
  border: 1px solid var(--color-border-light);
}

.suggestion-icon-wrapper {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
}

.suggestion-emoji {
  font-size: 18px;
}

.suggestion-content {
  flex: 1;
}

.suggestion-title {
  font-weight: 600;
  color: var(--color-label);
  margin-bottom: 4px;
  font-size: 15px;
}

.suggestion-desc {
  font-size: 13px;
  color: var(--color-secondary-label);
  line-height: 1.4;
}
</style>
