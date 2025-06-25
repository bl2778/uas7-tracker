import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import dayjs from 'dayjs'
import { apiService } from '@/utils/api'

export const useUasStore = defineStore('uas', () => {
  // 状态
  const entries = ref([])
  const uas7Data = ref({})
  const userId = ref('default-user')
  const loading = ref(false)

  // 计算属性
  const todayEntry = computed(() => {
    const today = dayjs().format('YYYY-MM-DD')
    return entries.value.find(entry => entry.date === today)
  })

  const recentEntries = computed(() => {
    return entries.value.slice(0, 30)
  })

  // 方法
  const loadEntries = async () => {
    try {
      loading.value = true
      const response = await apiService.getDiaryEntries(userId.value)
      if (response.success) {
        entries.value = response.data
      }
    } catch (error) {
      console.error('加载日记条目失败:', error)
    } finally {
      loading.value = false
    }
  }

  const saveEntry = async (entryData) => {
    try {
      loading.value = true
      const response = await apiService.saveDiaryEntry(userId.value, entryData)
      if (response.success) {
        await loadEntries()
        await calculateUAS7()
        return response.data
      }
    } catch (error) {
      console.error('保存日记条目失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const calculateUAS7 = async () => {
    try {
      const response = await apiService.getUAS7(userId.value)
      if (response.success) {
        uas7Data.value = response.data
      }
    } catch (error) {
      console.error('计算UAS7失败:', error)
    }
  }

  const getEntryByDate = (date) => {
    return entries.value.find(entry => entry.date === date)
  }

  const getTodayEntry = () => {
    return todayEntry.value
  }

  return {
    entries,
    uas7Data,
    userId,
    loading,
    todayEntry,
    recentEntries,
    loadEntries,
    saveEntry,
    calculateUAS7,
    getEntryByDate,
    getTodayEntry
  }
})
