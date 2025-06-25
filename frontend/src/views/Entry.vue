<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">症状记录</h1>
      <div class="date-selector">
        <button class="date-nav-btn" @click="changeDate(-1)" :disabled="!canGoBack">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2"/>
          </svg>
        </button>
        <div class="current-date">
          <span class="date-text">{{ formatDate(currentDate) }}</span>
          <span class="date-day">{{ getDayOfWeek(currentDate) }}</span>
        </div>
        <button class="date-nav-btn" @click="changeDate(1)" :disabled="isToday">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2"/>
          </svg>
        </button>
      </div>
    </div>

    <form @submit.prevent="saveEntry" class="entry-form">
      <!-- 风团评分 -->
      <div class="form-section card">
        <div class="section-header">
          <svg class="section-icon" viewBox="0 0 24 24" fill="none">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" stroke-width="1.5"/>
          </svg>
          <div class="section-info">
            <h3>风团评分 <span class="required">*</span></h3>
            <p class="section-desc">请根据风团数量和大小选择评分</p>
          </div>
        </div>
        
        <div class="radio-group">
          <label 
            v-for="option in whealOptions" 
            :key="option.value"
            class="radio-option"
            :class="{ active: formData.whealScore === option.value }"
          >
            <input 
              type="radio" 
              :value="option.value" 
              v-model="formData.whealScore"
              class="radio-input"
            />
            <div class="radio-content">
              <div class="radio-score">{{ option.value }}</div>
              <div class="radio-label">{{ option.label }}</div>
              <div class="radio-desc">{{ option.desc }}</div>
            </div>
            <div class="radio-indicator"></div>
          </label>
        </div>
      </div>

      <!-- 瘙痒评分 -->
      <div class="form-section card">
        <div class="section-header">
          <svg class="section-icon" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z M8 12l2 2 4-4" stroke="currentColor" stroke-width="1.5"/>
          </svg>
          <div class="section-info">
            <h3>瘙痒评分 <span class="required">*</span></h3>
            <p class="section-desc">请根据瘙痒程度和影响选择评分</p>
          </div>
        </div>
        
        <div class="radio-group">
          <label 
            v-for="option in itchOptions" 
            :key="option.value"
            class="radio-option"
            :class="{ active: formData.itchScore === option.value }"
          >
            <input 
              type="radio" 
              :value="option.value" 
              v-model="formData.itchScore"
              class="radio-input"
            />
            <div class="radio-content">
              <div class="radio-score">{{ option.value }}</div>
              <div class="radio-label">{{ option.label }}</div>
              <div class="radio-desc">{{ option.desc }}</div>
            </div>
            <div class="radio-indicator"></div>
          </label>
        </div>
      </div>

      <!-- 辅助因子 -->
      <div class="form-section card">
        <div class="section-header">
          <svg class="section-icon" viewBox="0 0 24 24" fill="none">
            <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" stroke="currentColor" stroke-width="1.5"/>
          </svg>
          <div class="section-info">
            <h3>辅助因子</h3>
            <p class="section-desc">选择可能影响症状的因素</p>
          </div>
        </div>
        
        <div class="checkbox-grid">
          <label 
            v-for="factor in auxFactors" 
            :key="factor.key"
            class="checkbox-option"
            :class="{ active: selectedFactors.includes(factor.key) }"
          >
            <input 
              type="checkbox" 
              :value="factor.key" 
              v-model="selectedFactors"
              class="checkbox-input"
            />
            <div class="checkbox-content">
              <div class="checkbox-icon">{{ factor.icon }}</div>
              <div class="checkbox-label">{{ factor.label }}</div>
            </div>
            <div class="checkbox-indicator">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
          </label>
        </div>
      </div>

      <!-- 备注 -->
      <div class="form-section card">
        <div class="section-header">
          <svg class="section-icon" viewBox="0 0 24 24" fill="none">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="1.5"/>
          </svg>
          <div class="section-info">
            <h3>备注</h3>
            <p class="section-desc">记录其他相关信息（可选）</p>
          </div>
        </div>
        
        <div class="textarea-container">
          <textarea 
            v-model="formData.note" 
            placeholder="今天有什么特别的情况吗？比如天气变化、饮食、情绪等..."
            class="note-textarea"
            :maxlength="200"
            rows="4"
          ></textarea>
          <div class="textarea-counter">{{ formData.note.length }}/200</div>
        </div>
      </div>

      <!-- 当日总分显示 -->
      <div class="score-preview card" v-if="dayScore > 0">
        <div class="preview-header">
          <svg class="preview-icon" viewBox="0 0 24 24" fill="none">
            <path d="M9 12l2 2 4-4 M7.835 4.697a3.42 3.42 0 0 0 1.946-.806 3.42 3.42 0 0 1 4.438 0 3.42 3.42 0 0 0 1.946.806 3.42 3.42 0 0 1 3.138 3.138 3.42 3.42 0 0 0 .806 1.946 3.42 3.42 0 0 1 0 4.438 3.42 3.42 0 0 0-.806 1.946 3.42 3.42 0 0 1-3.138 3.138 3.42 3.42 0 0 0-1.946.806 3.42 3.42 0 0 1-4.438 0 3.42 3.42 0 0 0-1.946-.806 3.42 3.42 0 0 1-3.138-3.138 3.42 3.42 0 0 0-.806-1.946 3.42 3.42 0 0 1 0-4.438 3.42 3.42 0 0 0 .806-1.946 3.42 3.42 0 0 1 3.138-3.138z" stroke="currentColor" stroke-width="1.5"/>
          </svg>
          <h3>当日评分预览</h3>
        </div>
        <div class="preview-content">
          <div class="day-score" :class="`score-${getScoreLevel(dayScore)}`">
            {{ dayScore }}
          </div>
          <div class="score-breakdown">
            <div class="breakdown-item">
              <span class="breakdown-label">风团</span>
              <span class="breakdown-value">{{ formData.whealScore }}</span>
            </div>
            <div class="breakdown-plus">+</div>
            <div class="breakdown-item">
              <span class="breakdown-label">瘙痒</span>
              <span class="breakdown-value">{{ formData.itchScore }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 提交按钮 -->
      <div class="submit-section">
        <button 
          type="submit"
          class="btn-primary submit-btn"
          :disabled="!canSubmit || loading"
        >
          <svg v-if="loading" class="loading-icon" viewBox="0 0 24 24" fill="none">
            <path d="M12 2v4 M12 18v4 M6.31 6.31l1.42 1.42 M14.83 14.83l1.42 1.42 M2 12h4 M18 12h4 M6.31 17.69l1.42-1.42 M14.83 9.17l1.42-1.42" stroke="currentColor" stroke-width="2"/>
          </svg>
          <svg v-else class="submit-icon" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2"/>
          </svg>
          {{ loading ? '保存中...' : (existingEntry ? '更新记录' : '保存记录') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUasStore } from '@/stores/uas'
import dayjs from 'dayjs'

export default {
  name: 'Entry',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const uasStore = useUasStore()

    const currentDate = ref(dayjs().format('YYYY-MM-DD'))
    const formData = ref({
      whealScore: '',
      itchScore: '',
      note: ''
    })
    const selectedFactors = ref([])
    const loading = ref(false)

    const whealOptions = [
      { value: '0', label: '无风团', desc: '皮肤正常，无可见风团' },
      { value: '1', label: '轻微', desc: '＜20个小风团' },
      { value: '2', label: '中度', desc: '20-50个风团或几个大风团' },
      { value: '3', label: '重度', desc: '＞50个风团或大面积风团' }
    ]

    const itchOptions = [
      { value: '0', label: '无瘙痒', desc: '完全不痒，无不适感' },
      { value: '1', label: '轻度', desc: '轻微痒感，不影响日常活动' },
      { value: '2', label: '中度', desc: '明显痒感，偶尔影响活动或睡眠' },
      { value: '3', label: '重度', desc: '剧烈瘙痒，严重影响活动和睡眠' }
    ]

    const auxFactors = [
      { key: 'medication', label: '服药', icon: '💊' },
      { key: 'alcohol', label: '饮酒', icon: '🍷' },
      { key: 'exercise', label: '运动', icon: '🏃' },
      { key: 'stress', label: '压力', icon: '😰' },
      { key: 'seafood', label: '海鲜', icon: '🦐' },
      { key: 'spicy', label: '辛辣', icon: '🌶️' },
      { key: 'dairy', label: '乳制品', icon: '🥛' },
      { key: 'weather', label: '天气变化', icon: '🌤️' }
    ]

    // 计算属性
    const dayScore = computed(() => {
      const wheal = parseInt(formData.value.whealScore) || 0
      const itch = parseInt(formData.value.itchScore) || 0
      return wheal + itch
    })

    const canSubmit = computed(() => {
      return formData.value.whealScore !== '' && formData.value.itchScore !== ''
    })

    const isToday = computed(() => {
      return currentDate.value === dayjs().format('YYYY-MM-DD')
    })

    const canGoBack = computed(() => {
      const minDate = dayjs().subtract(6, 'day')
      return dayjs(currentDate.value).isAfter(minDate)
    })

    const existingEntry = computed(() => {
      return uasStore.getEntryByDate(currentDate.value)
    })

    // 方法
    const formatDate = (dateStr) => {
      const date = dayjs(dateStr)
      const today = dayjs()
      
      if (date.isSame(today, 'day')) {
        return '今天'
      } else if (date.isSame(today.subtract(1, 'day'), 'day')) {
        return '昨天'
      } else {
        return date.format('MM月DD日')
      }
    }

    const getDayOfWeek = (dateStr) => {
      const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      return days[dayjs(dateStr).day()]
    }

    const changeDate = (days) => {
      const newDate = dayjs(currentDate.value).add(days, 'day')
      const maxDate = dayjs()
      const minDate = dayjs().subtract(6, 'day')

      if (newDate.isAfter(maxDate) || newDate.isBefore(minDate)) {
        return
      }

      currentDate.value = newDate.format('YYYY-MM-DD')
    }

    const getScoreLevel = (score) => {
      if (score <= 1) return 'good'
      if (score <= 3) return 'fair'
      if (score <= 5) return 'poor'
      return 'severe'
    }

    const loadExistingEntry = () => {
      const entry = existingEntry.value
      if (entry) {
        formData.value = {
          whealScore: entry.wheal_score.toString(),
          itchScore: entry.itch_score.toString(),
          note: entry.note || ''
        }
        
        const auxFactors = entry.aux_factors || {}
        selectedFactors.value = Object.keys(auxFactors).filter(key => auxFactors[key])
      } else {
        formData.value = {
          whealScore: '',
          itchScore: '',
          note: ''
        }
        selectedFactors.value = []
      }
    }

    const saveEntry = async () => {
      if (!canSubmit.value) return

      try {
        loading.value = true

        const auxFactorsObj = {}
        selectedFactors.value.forEach(factor => {
          auxFactorsObj[factor] = true
        })

        const entryData = {
          date: currentDate.value,
          whealScore: parseInt(formData.value.whealScore),
          itchScore: parseInt(formData.value.itchScore),
          auxFactors: auxFactorsObj,
          note: formData.value.note
        }

        await uasStore.saveEntry(entryData)
        
        // 简单的成功反馈
        const successMessage = document.createElement('div')
        successMessage.textContent = '保存成功！'
        successMessage.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: #6B9B7F;
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          z-index: 1000;
          font-weight: 500;
        `
        document.body.appendChild(successMessage)
        
        setTimeout(() => {
          document.body.removeChild(successMessage)
          router.push('/')
        }, 1000)

      } catch (error) {
        console.error('保存失败:', error)
        alert('保存失败，请重试')
      } finally {
        loading.value = false
      }
    }

    watch(currentDate, loadExistingEntry)

    onMounted(() => {
      if (route.params.date) {
        currentDate.value = route.params.date
      }
      loadExistingEntry()
    })

    return {
      currentDate,
      formData,
      selectedFactors,
      loading,
      whealOptions,
      itchOptions,
      auxFactors,
      dayScore,
      canSubmit,
      isToday,
      canGoBack,
      existingEntry,
      formatDate,
      getDayOfWeek,
      changeDate,
      getScoreLevel,
      saveEntry
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
  margin-bottom: 20px;
  letter-spacing: -0.02em;
}

.date-selector {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 16px;
  background: var(--color-secondary-grouped-background);
  border-radius: 16px;
  border: 0.5px solid var(--color-border-light);
}

.date-nav-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-secondary-system-background);
  border: 0.5px solid var(--color-border);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--color-primary);
}

.date-nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.date-nav-btn:not(:disabled):hover {
  background: var(--color-primary-lighter);
  transform: translateY(-1px);
}

.date-nav-btn svg {
  width: 18px;
  height: 18px;
}

.current-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 120px;
}

.date-text {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-label);
  letter-spacing: -0.01em;
}

.date-day {
  font-size: 12px;
  color: var(--color-secondary-label);
  font-weight: 500;
}

.entry-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-section {
  padding: 24px;
}

.section-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 24px;
}

.section-icon {
  width: 24px;
  height: 24px;
  color: var(--color-primary);
  flex-shrink: 0;
  margin-top: 2px;
}

.section-info h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-label);
  margin-bottom: 4px;
  letter-spacing: -0.01em;
}

.required {
  color: var(--color-danger);
  font-weight: 700;
}

.section-desc {
  font-size: 14px;
  color: var(--color-secondary-label);
  margin: 0;
  line-height: 1.4;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.radio-option {
  display: flex;
  align-items: center;
  padding: 20px;
  background: var(--color-secondary-system-background);
  border: 1.5px solid var(--color-border-light);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.25s ease;
  position: relative;
}

.radio-option:hover {
  border-color: var(--color-primary);
  background: var(--color-tertiary-system-background);
}

.radio-option.active {
  border-color: var(--color-primary);
  background: rgba(106, 137, 167, 0.08);
}

.radio-input {
  display: none;
}

.radio-content {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 16px;
}

.radio-score {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary);
  color: white;
  border-radius: 50%;
  font-weight: 700;
  font-size: 16px;
}

.radio-label {
  font-weight: 600;
  color: var(--color-label);
  min-width: 60px;
}

.radio-desc {
  font-size: 14px;
  color: var(--color-secondary-label);
  line-height: 1.3;
}

.radio-indicator {
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-border);
  border-radius: 50%;
  transition: all 0.2s ease;
}

.radio-option.active .radio-indicator {
  border-color: var(--color-primary);
  background: var(--color-primary);
  position: relative;
}

.radio-option.active .radio-indicator::after {
  content: '';
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.checkbox-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
}

.checkbox-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 16px;
  background: var(--color-secondary-system-background);
  border: 1.5px solid var(--color-border-light);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.25s ease;
  text-align: center;
}

.checkbox-option:hover {
  border-color: var(--color-primary);
  background: var(--color-tertiary-system-background);
}

.checkbox-option.active {
  border-color: var(--color-primary);
  background: rgba(106, 137, 167, 0.08);
}

.checkbox-input {
  display: none;
}

.checkbox-content {
  margin-bottom: 12px;
}

.checkbox-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.checkbox-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-label);
}

.checkbox-indicator {
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-border);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.checkbox-option.active .checkbox-indicator {
  border-color: var(--color-primary);
  background: var(--color-primary);
}

.checkbox-indicator svg {
  width: 12px;
  height: 12px;
  color: white;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.checkbox-option.active .checkbox-indicator svg {
  opacity: 1;
}

.textarea-container {
  position: relative;
}

.note-textarea {
  width: 100%;
  padding: 20px;
  border: 1.5px solid var(--color-border-light);
  border-radius: 16px;
  background: var(--color-secondary-system-background);
  color: var(--color-label);
  font-size: 16px;
  line-height: 1.5;
  resize: vertical;
  min-height: 120px;
  font-family: inherit;
  transition: all 0.2s ease;
}

.note-textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  background: var(--color-tertiary-system-background);
}

.note-textarea::placeholder {
  color: var(--color-tertiary-label);
}

.textarea-counter {
  position: absolute;
  bottom: 12px;
  right: 16px;
  font-size: 12px;
  color: var(--color-tertiary-label);
  background: rgba(255, 255, 255, 0.9);
  padding: 4px 8px;
  border-radius: 4px;
}

.score-preview {
  background: linear-gradient(135deg, rgba(106, 137, 167, 0.08) 0%, rgba(189, 221, 252, 0.08) 100%);
  border: 1.5px solid var(--color-primary-lighter);
}

.preview-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.preview-icon {
  width: 20px;
  height: 20px;
  color: var(--color-primary);
}

.preview-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-primary);
  margin: 0;
}

.preview-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.day-score {
  font-size: 48px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.02em;
}

.score-good { color: #6B9B7F; }
.score-fair { color: #B8956B; }
.score-poor { color: #B5827A; }
.score-severe { color: #A67B82; }

.score-breakdown {
  display: flex;
  align-items: center;
  gap: 16px;
}

.breakdown-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.breakdown-label {
  font-size: 12px;
  color: var(--color-secondary-label);
  font-weight: 500;
}

.breakdown-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-primary);
}

.breakdown-plus {
  font-size: 20px;
  color: var(--color-tertiary-label);
  font-weight: 300;
}

.submit-section {
  margin-top: 8px;
}

.submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 20px;
  font-size: 18px;
}

.submit-icon, .loading-icon {
  width: 20px;
  height: 20px;
}

.loading-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
