import { useState, useEffect, useCallback } from 'react'
import { fetchHitokotoApi, type HitokotoData } from '../lib/api'

const FALLBACK_TEXTS = [
  '今日宜：保持乐观，忌：过度焦虑',
  '愿你的每一天都充满阳光',
  '生活不止眼前的苟且，还有诗和远方',
  '每一个不曾起舞的日子，都是对生命的辜负',
  '山重水复疑无路，柳暗花明又一村'
]

export function useHitokoto() {
  const [data, setData] = useState<HitokotoData | null>(null)
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    
    const result = await fetchHitokotoApi()
    
    if (result) {
      setData(result)
    } else {
      // 使用备用文案
      const randomText = FALLBACK_TEXTS[Math.floor(Math.random() * FALLBACK_TEXTS.length)]
      setData({ hitokoto: randomText })
    }
    
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return { data, loading, refresh: load }
}
