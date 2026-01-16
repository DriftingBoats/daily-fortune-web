import type { FortuneData } from '../../shared/types'

interface Props {
  data: FortuneData | null
  loading: boolean
  error: string | null
}

function LoadingState() {
  return (
    <div className="text-center text-text-muted py-10">
      正在加载老黄历信息...
    </div>
  )
}

function ErrorState({ error }: { error: string }) {
  return (
    <div className="bg-red-50 text-red-800 p-4 rounded-lg border-l-4 border-red-500">
      加载失败：{error}
    </div>
  )
}

export default function AlmanacCard({ data, loading, error }: Props) {
  if (loading) return <CardWrapper><LoadingState /></CardWrapper>
  if (error) return <CardWrapper><ErrorState error={error} /></CardWrapper>
  if (!data) return null

  const { date_info, fortune_info } = data

  // 解析宜忌
  const yiItems = fortune_info.fitness?.split(/[、,，]/).filter(Boolean) || []
  const jiItems = fortune_info.taboo?.split(/[、,，]/).filter(Boolean) || []

  return (
    <CardWrapper>
      {/* 农历信息头部 */}
      <div className="bg-primary text-white p-5 rounded-lg mb-4">
        <div className="flex items-center justify-center gap-3">
          <h2 className="text-lg font-semibold">
            {date_info.year_ganzhi ? `${date_info.year_ganzhi}年 ` : ''}
            {date_info.lunar_formatted}
          </h2>
          {date_info.zodiac && (
            <span className="bg-white/20 px-2 py-0.5 rounded text-sm">
              {date_info.zodiac}年
            </span>
          )}
        </div>
        {(date_info.festival || date_info.jieqi) && (
          <p className="text-center text-white/80 text-sm mt-2">
            {date_info.festival} {date_info.jieqi}
          </p>
        )}
      </div>

      {/* 宜 */}
      {yiItems.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-green-600 text-white px-2 py-0.5 rounded text-sm font-medium">宜</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {yiItems.map((item, i) => (
              <span key={i} className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm border border-green-200">
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 忌 */}
      {jiItems.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-red-600 text-white px-2 py-0.5 rounded text-sm font-medium">忌</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {jiItems.map((item, i) => (
              <span key={i} className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm border border-red-200">
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 其他信息 */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        {fortune_info.shenwei && (
          <InfoItem label="神位" value={fortune_info.shenwei} />
        )}
        {fortune_info.chongsha && (
          <InfoItem label="冲煞" value={fortune_info.chongsha} />
        )}
      </div>
    </CardWrapper>
  )
}

function CardWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/30">
      <div className="flex items-center mb-5 pb-3 border-b border-fortune-border">
        <div className="w-8 h-8 flex items-center justify-center bg-amber-100 rounded-lg mr-3">
          <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-text-primary">老黄历</h2>
      </div>
      {children}
    </div>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-fortune-light p-3 rounded-lg border-l-3 border-primary">
      <p className="text-xs text-text-muted uppercase tracking-wide mb-1">{label}</p>
      <p className="text-sm text-text-primary font-medium">{value}</p>
    </div>
  )
}
