import { useState, useEffect } from 'react'
import type { ConstellationData } from '../../shared/types'
import { fetchConstellationApi } from '../lib/api'

export function useConstellation(sign: string) {
  const [data, setData] = useState<ConstellationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      if (!sign) return
      
      setLoading(true)
      setError(null)
      
      const result = await fetchConstellationApi(sign)
      
      if (result.success && result.data) {
        setData(result.data)
      } else {
        setError(result.error || '加载失败')
      }
      
      setLoading(false)
    }
    
    load()
  }, [sign])

  return { data, loading, error }
}
