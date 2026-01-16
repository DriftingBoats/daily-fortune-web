import { useState, useEffect } from 'react'
import type { FortuneData } from '../../shared/types'
import { fetchFortuneApi } from '../lib/api'

export function useFortune() {
  const [data, setData] = useState<FortuneData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      
      const result = await fetchFortuneApi()
      
      if (result.success && result.data) {
        setData(result.data)
      } else {
        setError(result.error || '加载失败')
      }
      
      setLoading(false)
    }
    
    load()
  }, [])

  return { data, loading, error }
}
