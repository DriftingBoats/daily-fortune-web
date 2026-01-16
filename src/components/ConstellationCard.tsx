import type { ConstellationData } from '../../shared/types'
import { CONSTELLATION_DATES, ENGLISH_TO_CHINESE_MAP } from '../../shared/constants'
import FortuneChart from './FortuneChart'

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

export default function ConstellationCard({ data, loading, error, selectedSign, onSignChange }: Props) {
  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/30">
      {/* 头部 */}
      <div className="flex items-center mb-5 pb-3 border-b border-fortune-border">
        <div className="w-8 h-8 flex items-center justify-center bg-amber-100 rounded-lg mr-3">
          <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-text-primary">星座运势</h2>
      </div>

      {/* 星座选择器 */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 flex gap-2 overflow-x-auto hide-scrollbar py-1">
          {SIGNS.map((sign) => (
            <button
              key={sign}
              onClick={() => onSignChange(sign)}
              className={`flex-shrink-0 min-w-[72px] py-2 px-2 rounded-lg text-center border transition-colors ${
                selectedSign === sign
                  ? 'bg-primary border-primary text-white'
                  : 'bg-white/50 backdrop-blur border-white/30 text-text-primary hover:bg-white/70 hover:border-primary/50'
              }`}
            >
              <div className="text-xs font-semibold">{ENGLISH_TO_CHINESE_MAP[sign]}</div>
              <div className="text-[10px] opacity-70">{CONSTELLATION_DATES[sign]}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 内容区域 */}
      {loading ? (
        <div className="text-center text-text-muted py-10">正在加载星座运势...</div>
      ) : error ? (
        <div className="bg-red-50 text-red-800 p-4 rounded-lg border-l-4 border-red-500">
          加载失败：{error}
        </div>
      ) : data ? (
        <>
          {/* 图表 */}
          <FortuneChart indices={data.indices} />

          {/* 运势详情 */}
          <div className="mt-4 space-y-3">
            {data.overall_fortune && (
              <div className="bg-white/50 backdrop-blur p-4 rounded-lg border-l-4 border-primary">
                <p className="text-sm text-text-primary leading-relaxed">{data.overall_fortune}</p>
              </div>
            )}

            {/* 幸运信息 */}
            <div className="flex flex-wrap gap-3">
              <LuckyTag label="幸运数字" value={String(data.lucky_number)} />
              <LuckyTag label="幸运颜色" value={data.lucky_color} />
            </div>
          </div>
        </>
      ) : (
        <div className="text-center text-text-muted py-10">请选择星座查看运势</div>
      )}
    </div>
  )
}

function LuckyTag({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col bg-white/50 backdrop-blur border border-white/30 rounded-lg px-4 py-2 min-w-[80px]">
      <span className="text-[10px] text-text-muted">{label}</span>
      <span className="text-sm font-semibold text-primary">{value}</span>
    </div>
  )
}
