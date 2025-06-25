<template>
  <div class="page-container">
    <!-- 顶部标题区域 -->
    <div class="page-header">
      <h1 class="page-title">UAS7 追踪</h1>
      <p class="page-subtitle">慢性荨麻疹症状记录</p>
    </div>

    <!-- 今日状态卡片 -->
    <div class="today-status-card card">
      <div class="card-header">
        <svg class="header-icon" viewBox="0 0 24 24" fill="none">
          <path d="M8 2v4 M16 2v4 M3 10h18 M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" stroke="currentColor" stroke-width="1.5"/>
        </svg>
        今日状态
      </div>
      
      <div v-if="todayEntry" class="status-content">
        <div class="score-display">
          <div class="main-score" :class="`score-${getScoreLevel(todayEntry.day_score)}`">
            {{ todayEntry.day_score }}
          </div>
          <div class="score-breakdown">
            风团 {{ todayEntry.wheal_score }} + 瘙痒 {{ todayEntry.itch_score }}
          </div>
        </div>
        <div class="status-indicator">
          <div class="status-ring" :class="`ring-${getScoreLevel(todayEntry.day_score)}`">
            <div class="ring-inner"></div>
          </div>
          <div class="status-time">
            {{ formatTime(todayEntry.updated_at) }}
          </div>
        </div>
      </div>
      
      <div v-else class="no-record-state">
        <div class="empty-state-icon">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M9 12l2 2 4-4 M7.835 4.697a3.42 3.42 0 0 0 1.946-.806 3.42 3.42 0 0 1 4.438 0 3.42 3.42 0 0 0 1.946.806 3.42 3.42 0 0 1 3.138 3.138 3.42 3.42 0 0 0 .806 1.946 3.42 3.42 0 0 1 0 4.438 3.42 3.42 0 0 0-.806 1.946 3.42 3.42 0 0 1-3.138 3.138 3.42 3.42 0 0 0-1.946.806 3.42 3.42 0 0 1-4.438 0 3.42 3.42 0 0 0-1.946-.806 3.42 3.42 0 0 1-3.138-3.138 3.42 3.42 0 0 0-.806-1.946 3.42 3.42 0 0 1 0-4.438 3.42 3.42 0 0 0 .806-1.946 3.42 3.42 0 0 1 3.138-3.138z" stroke="currentColor" stroke-width="1.5"/>
          </svg>
        </div>
        <div class="empty-state-text">今日尚未记录症状</div>
        <button class="btn-primary" @click="goToEntry">
          <svg class="btn-icon" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14 M5 12h14" stroke="currentColor" stroke-width="2"/>
          </svg>
          开始记录
        </button>
      </div>
    </div>

    <!-- UAS7 周评分卡片 -->
    <div class="uas7-card card">
      <div class="card-header">
        <svg class="header-icon" viewBox="0 0 24 24" fill="none">
          <path d="M3 3v18h18 M7 12l4-4 4 4 4-4" stroke="currentColor" stroke-width="1.5"/>
        </svg>
        UAS7 周评分
      </div>
      
      <div class="uas7-content">
        <div class="uas7-score-container">
          <div 
            class="uas7-score" 
            :class="`severity-${uas7Data.severity?.level}`"
          >
            {{ uas7Data.score || 0 }}
          </div>
          <div class="uas7-indicator">
            <div 
              class="severity-text"
              :style="{ color: getSeverityColor(uas7Data.severity?.level) }"
            >
              {{ uas7Data.severity?.text || '暂无数据' }}
            </div>
            <div class="completeness-info">
              <span class="days-recorded">{{ uas7Data.daysRecorded || 0 }}/7 天</span>
              <span v-if="!uas7Data.isComplete" class="incomplete-badge">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 9v4 M12 17h.01 M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="currentColor" stroke-width="1.5"/>
                </svg>
                数据不完整
              </span>
            </div>
          </div>
        </div>
        
        <!-- 优雅的进度指示器 -->
        <div class="progress-container">
          <div class="progress-circle">
            <svg viewBox="0 0 42 42">
              <circle
                class="progress-bg"
                cx="21"
                cy="21"
                r="15.5"
                fill="none"
                stroke="var(--color-border-light)"
                stroke-width="2"
              />
              <circle
                class="progress-bar"
                cx="21"
                cy="21"
                r="15.5"
                fill="none"
                :stroke="getSeverityColor(uas7Data.severity?.level)"
                stroke-width="3"
                stroke-linecap="round"
                :stroke-dasharray="`${(uas7Data.score || 0) / 42 * 97.4} 97.4`"
                transform="rotate(-90 21 21)"
              />
            </svg>
            <div class="progress-label">{{ Math.round((uas7Data.score || 0) / 42 * 100) }}%</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 近期趋势卡片 -->
    <div v-if="recentEntries.length > 0" class="trend-card card">
      <div class="card-header">
        <svg class="header-icon" viewBox="0 0 24 24" fill="none">
          <path d="M3 3v18h18 M7 12l4-4 4 4 4-4" stroke="currentColor" stroke-width="1.5"/>
        </svg>
        近期趋势
      </div>
      
      <div class="trend-chart">
        <div class="chart-container">
          <div 
            v-for="(entry, index) in recentEntries.slice(0, 14).reverse()" 
            :key="entry.date"
            class="trend-bar"
            :style="{ 
              height: `${Math.max((entry.day_score / 6) * 48, 3)}px`,
              backgroundColor: getScoreColor(entry.day_score),
              animationDelay: `${index * 0.05}s`
            }"
            :title="`${formatDate(entry.date)}: ${entry.day_score}分`"
          />
        </div>
        <div class="chart-labels">
          <span>14天前</span>
          <span>今天</span>
        </div>
      </div>
    </div>

    <!-- 快速操作区域 -->
    <div class="quick-actions">
      <button class="btn-primary action-button" @click="goToEntry">
        <svg class="action-icon" viewBox="0 0 24 24" fill="none">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="1.5"/>
        </svg>
        <span class="action-text">记录今天症状</span>
      </button>
      
      <button class="btn-secondary action-button" @click="goToChart" style="margin-top: 12px;">
        <svg class="action-icon" viewBox="0 0 24 24" fill="none">
          <path d="M3 3v18h18 M7 12l4-4 4 4 4-4" stroke="currentColor" stroke-width="1.5"/>
        </svg>
        <span class="action-text">查看详细趋势</span>
      </button>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUasStore } from '@/stores/uas'
import dayjs from 'dayjs'

export default {
  name: 'Home',
  setup() {
    const router = useRouter()
    const uasStore = useUasStore()

    const todayEntry = computed(() => uasStore.todayEntry)
    const uas7Data = computed(() => uasStore.uas7Data)
    const recentEntries = computed(() => uasStore.recentEntries)

    const goToEntry = () => {
      router.push('/entry')
    }

    const goToChart = () => {
      router.push('/chart')
    }

    const formatTime = (timeStr) => {
      return dayjs(timeStr).format('HH:mm')
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

    const getSeverityColor = (level) => {
      switch(level) {
        case 'mild': return '#6B9B7F'
        case 'light': return '#B8956B'
        case 'moderate': return '#B5827A'
        case 'severe': return '#A67B82'
        default: return '#6A89A7'
      }
    }

    onMounted(async () => {
      await uasStore.loadEntries()
      await uasStore.calculateUAS7()
    })

    return {
      todayEntry,
      uas7Data,
      recentEntries,
      goToEntry,
      goToChart,
      formatTime,
      formatDate,
      getScoreLevel,
      getScoreColor,
      getSeverityColor
    }
  }
}
</script>

<style scoped>
.page-header {
  text-align: center;
  margin-bottom: 36px;
  padding-top: 20px;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--color-label);
  margin-bottom: 6px;
  letter-spacing: -0.03em;
}

.page-subtitle {
  font-size: 15px;
  color: var(--color-secondary-label);
  font-weight: 500;
  letter-spacing: -0.01em;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 600;
  color: var(--color-label);
  margin-bottom: 24px;
  letter-spacing: -0.02em;
}

.header-icon {
  width: 20px;
  height: 20px;
  color: var(--color-primary);
  stroke-width: 1.5;
}

/* 今日状态卡片 */
.status-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.score-display {
  flex: 1;
}

.main-score {
  font-size: 52px;
  font-weight: 800;
  line-height: 1;
  margin-bottom: 6px;
  letter-spacing: -0.02em;
}

.score-good { color: #6B9B7F; }
.score-fair { color: #B8956B; }
.score-poor { color: #B5827A; }
.score-severe { color: #A67B82; }

.score-breakdown {
  font-size: 13px;
  color: var(--color-tertiary-label);
  font-weight: 500;
  letter-spacing: -0.01em;
}

.status-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.status-ring {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.ring-good { background: rgba(107, 155, 127, 0.12); }
.ring-fair { background: rgba(184, 149, 107, 0.12); }
.ring-poor { background: rgba(181, 130, 122, 0.12); }
.ring-severe { background: rgba(166, 123, 130, 0.12); }

.ring-inner {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: currentColor;
}

.ring-good .ring-inner { background: #6B9B7F; }
.ring-fair .ring-inner { background: #B8956B; }
.ring-poor .ring-inner { background: #B5827A; }
.ring-severe .ring-inner { background: #A67B82; }

.status-time {
  font-size: 11px;
  color: var(--color-quaternary-label);
  font-weight: 500;
}

.no-record-state {
  text-align: center;
  padding: 32px 20px;
}

.empty-state-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  color: var(--color-muted);
}

.empty-state-icon svg {
  width: 100%;
  height: 100%;
}

.empty-state-text {
  font-size: 16px;
  color: var(--color-secondary-label);
  margin-bottom: 24px;
  font-weight: 500;
}

/* UAS7 卡片 */
.uas7-content {
  display: flex;
  align-items: center;
  gap: 28px;
}

.uas7-score-container {
  flex: 1;
}

.uas7-score {
  font-size: 48px;
  font-weight: 800;
  line-height: 1;
  margin-bottom: 10px;
  letter-spacing: -0.02em;
}

.severity-mild { color: #6B9B7F; }
.severity-light { color: #B8956B; }
.severity-moderate { color: #B5827A; }
.severity-severe { color: #A67B82; }

.severity-text {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 6px;
  letter-spacing: -0.01em;
}

.completeness-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--color-tertiary-label);
}

.days-recorded {
  font-weight: 600;
}

.incomplete-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--color-warning);
  font-weight: 500;
}

.incomplete-badge svg {
  width: 12px;
  height: 12px;
}

/* 进度圆环 */
.progress-container {
  position: relative;
}

.progress-circle {
  width: 80px;
  height: 80px;
  position: relative;
}

.progress-circle svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.progress-bar {
  transition: stroke-dasharray 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.progress-label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 12px;
  font-weight: 600;
  color: var(--color-primary);
}

/* 趋势图表 */
.chart-container {
  display: flex;
  align-items: end;
  gap: 2px;
  height: 56px;
  margin-bottom: 12px;
  padding: 0 6px;
}

.trend-bar {
  flex: 1;
  border-radius: 3px;
  min-height: 3px;
  animation: slideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) both;
  transition: all 0.3s ease;
  cursor: pointer;
}

.trend-bar:hover {
  opacity: 0.8;
  transform: translateY(-1px);
}

@keyframes slideUp {
  from {
    height: 3px !important;
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.chart-labels {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: var(--color-tertiary-label);
  padding: 0 6px;
  font-weight: 500;
}

/* 快速操作 */
.quick-actions {
  margin-top: 28px;
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 20px 28px;
}

.action-icon {
  width: 18px;
  height: 18px;
  color: currentColor;
}

.btn-icon {
  width: 16px;
  height: 16px;
  color: currentColor;
}

.action-text {
  font-weight: 600;
  letter-spacing: -0.01em;
}
</style>
