import { useEffect, useRef } from 'react'
import type { ConstellationData } from '../../shared/types'
import { CONSTELLATION_DATES, ENGLISH_TO_CHINESE_MAP } from '../../shared/constants'
import FortuneChart from './FortuneChart'
import CardWrapper from './CardWrapper'

interface Props {
  data: ConstellationData | null
  loading: boolean
  error: string | null
  selectedSign: string
  onSignChange: (sign: string) => void
}

const SIGNS = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
]


const COLOR_MAP: Record<string, string> = {
  '红': '#ef4444', '红色': '#ef4444',
  '橙': '#f97316', '橙色': '#f97316',
  '黄': '#eab308', '黄色': '#eab308',
  '绿': '#22c55e', '绿色': '#22c55e',
  '蓝': '#3b82f6', '蓝色': '#3b82f6',
  '紫': '#a855f7', '紫色': '#a855f7',
  '粉': '#ec4899', '粉色': '#ec4899',
  '白': '#f1f5f9', '白色': '#f1f5f9',
  '黑': '#1e293b', '黑色': '#1e293b',
  '金': '#f59e0b', '金色': '#f59e0b',
  '银': '#94a3b8', '银色': '#94a3b8',
  '棕': '#a16207', '棕色': '#a16207',
  '青': '#06b6d4', '青色': '#06b6d4',
  '灰': '#6b7280', '灰色': '#6b7280',
}

const STAR_ICON = (
  <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
)

export default function ConstellationCard({ data, loading, error, selectedSign, onSignChange }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // 选中后将当前项滚动到可视区居中
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return
    const idx = SIGNS.indexOf(selectedSign)
    const item = container.children[idx] as HTMLElement
    if (!item) return
    const offset = item.offsetLeft - container.clientWidth / 2 + item.clientWidth / 2
    container.scrollTo({ left: offset, behavior: 'smooth' })
  }, [selectedSign])

  const handlePrev = () => {
    const idx = SIGNS.indexOf(selectedSign)
    if (idx > 0) onSignChange(SIGNS[idx - 1])
  }

  const handleNext = () => {
    const idx = SIGNS.indexOf(selectedSign)
    if (idx < SIGNS.length - 1) onSignChange(SIGNS[idx + 1])
  }

  return (
    <CardWrapper title="星座运势" icon={STAR_ICON}>
      {/* 星座选择器 — 左右滑动 */}
      <div className="mb-4">
        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePrev}
            disabled={SIGNS.indexOf(selectedSign) === 0}
            className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-text-muted disabled:opacity-25 hover:text-text-secondary hover:bg-fortune-border transition-colors"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div ref={scrollRef} className="flex gap-1 overflow-x-auto hide-scrollbar flex-1 bg-fortune-light rounded-xl p-1">
            {SIGNS.map((sign) => (
              <button
                key={sign}
                onClick={() => onSignChange(sign)}
                className={`flex-shrink-0 flex flex-col items-center gap-0.5 py-1.5 px-2.5 rounded-lg transition-all ${
                  selectedSign === sign
                    ? 'bg-white shadow-sm text-primary'
                    : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                <span className="text-[11px] font-semibold whitespace-nowrap">{ENGLISH_TO_CHINESE_MAP[sign]}</span>
                <span className="text-[9px] opacity-60 whitespace-nowrap">{CONSTELLATION_DATES[sign]}</span>
              </button>
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={SIGNS.indexOf(selectedSign) === SIGNS.length - 1}
            className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-text-muted disabled:opacity-25 hover:text-text-secondary hover:bg-fortune-border transition-colors"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

      </div>

      {/* 内容区域 */}
      {loading ? (
        <ConstellationSkeleton />
      ) : error ? (
        <div className="bg-red-50 text-red-800 p-4 rounded-lg border-l-4 border-red-500">
          加载失败：{error}
        </div>
      ) : data ? (
        <>
          {/* 图表 */}
          <FortuneChart indices={data.indices} />

          {/* 综合说明 */}
          <div className="mt-4 pt-4 border-t border-fortune-border">
            <p className="text-xs text-text-muted mb-2">今日综合运势</p>
            <p className="text-sm text-text-primary leading-relaxed">
              {data.overall_fortune || '暂无数据'}
            </p>
          </div>

          {/* 幸运信息 */}
          <div className="flex items-center justify-around mt-4 pt-4 border-t border-fortune-border">
            <LuckyTag label="幸运数字" value={String(data.lucky_number)} />
            <div className="w-px h-8 bg-fortune-border" />
            <LuckyTag
              label="幸运颜色"
              value={data.lucky_color}
              colorSwatch={COLOR_MAP[data.lucky_color]}
            />
            <div className="w-px h-8 bg-fortune-border" />
            <LuckyTag label="贵人星座" value={data.lucky_constellation || '—'} />
          </div>
        </>
      ) : (
        <div className="text-center text-text-muted py-10">请选择星座查看运势</div>
      )}
    </CardWrapper>
  )
}

function ConstellationSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-[200px] rounded-lg bg-fortune-border/40" />
      <div className="pt-4 border-t border-fortune-border space-y-2">
        <div className="h-3 w-16 bg-fortune-border rounded" />
        <div className="h-3 w-full bg-fortune-border/60 rounded" />
        <div className="h-3 w-4/5 bg-fortune-border/60 rounded" />
      </div>
      <div className="flex justify-around pt-4 border-t border-fortune-border">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex flex-col items-center gap-1.5">
            <div className="h-2.5 w-12 bg-fortune-border/60 rounded" />
            <div className="h-3.5 w-10 bg-fortune-border rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}

function LuckyTag({ label, value, colorSwatch }: { label: string; value: string; colorSwatch?: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      <span className="text-[10px] text-text-muted mb-1">{label}</span>
      <div className="flex items-center gap-1.5">
        {colorSwatch && (
          <span
            className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: colorSwatch }}
          />
        )}
        <span className="text-sm font-semibold text-text-primary">{value}</span>
      </div>
    </div>
  )
}
