import type { FortuneData, ApiResponse } from '../../shared/types'

const API_BASE = '/api'

export async function fetchFortuneApi(): Promise<ApiResponse<FortuneData>> {
  try {
    const response = await fetch(`${API_BASE}/fortune`)
    if (!response.ok) {
      return { success: false, error: `HTTP ${response.status}` }
    }
    return await response.json()
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '网络错误' 
    }
  }
}

import type { ConstellationData } from '../../shared/types'

export async function fetchConstellationApi(sign: string): Promise<ApiResponse<ConstellationData>> {
  try {
    const response = await fetch(`${API_BASE}/constellation?sign=${sign}`)
    if (!response.ok) {
      return { success: false, error: `HTTP ${response.status}` }
    }
    return await response.json()
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '网络错误' 
    }
  }
}

export interface HitokotoData {
  hitokoto: string
  from?: string
  from_who?: string
}

const HITOKOTO_URLS = [
  'https://v1.hitokoto.cn/',
  'https://api.hitokoto.cn/',
]

export async function fetchHitokotoApi(): Promise<HitokotoData | null> {
  for (const url of HITOKOTO_URLS) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)
      
      const response = await fetch(url, {
        signal: controller.signal,
        headers: { 'Accept': 'application/json' }
      })
      
      clearTimeout(timeoutId)
      
      if (response.ok) {
        const data = await response.json()
        if (data?.hitokoto) {
          return data
        }
      }
    } catch {
      continue
    }
  }
  return null
}
