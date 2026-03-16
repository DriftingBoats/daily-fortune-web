import type { FortuneData } from '../../shared/types'
import CardWrapper from './CardWrapper'

interface Props {
  data: FortuneData | null
  loading: boolean
  error: string | null
}

const CALENDAR_ICON = (
  <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
  </svg>
)

function AlmanacSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {/* 区块1：头部 */}
      <div className="pb-4 border-b border-fortune-border space-y-2 flex flex-col items-center">
        <div className="h-5 w-20 bg-[#ddd5c8]/60 rounded-full" />
        <div className="h-7 w-48 bg-[#ddd5c8]/60 rounded-lg" />
        <div className="h-4 w-32 bg-[#ddd5c8]/40 rounded" />
      </div>
      {/* 区块2：宜忌居中 */}
      <div className="pb-4 border-b border-fortune-border space-y-3 text-center">
        <div className="flex flex-col items-center gap-1.5">
          <div className="h-5 w-8 bg-green-200 rounded" />
          <div className="h-4 w-40 bg-green-100 rounded" />
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <div className="h-5 w-8 bg-red-200 rounded" />
          <div className="h-4 w-36 bg-red-100 rounded" />
        </div>
      </div>
      {/* 区块3：列表行 */}
      <div className="space-y-0">
        {[1,2,3,4,5].map(i => (
          <div key={i} className="flex justify-between py-1.5 border-b border-fortune-border/50">
            <div className="h-3 w-16 bg-[#ddd5c8]/50 rounded" />
            <div className="h-3 w-24 bg-[#ddd5c8]/40 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AlmanacCard({ data, loading, error }: Props) {
  if (loading) return <CardWrapper title="老黄历" icon={CALENDAR_ICON}><AlmanacSkeleton /></CardWrapper>
  if (error) return (
    <CardWrapper title="老黄历" icon={CALENDAR_ICON}>
      <div className="bg-red-50 text-red-800 p-4 rounded-lg border-l-4 border-red-500">
        加载失败：{error}
      </div>
    </CardWrapper>
  )
  if (!data) return null

  const { date_info, fortune_info } = data

  const yiItems = fortune_info.fitness?.split(/[、,，]/).filter(Boolean) || []
  const jiItems = fortune_info.taboo?.split(/[、,，]/).filter(Boolean) || []

  const festivalPills = [date_info.festival, date_info.lunar_festival, date_info.jieqi].filter(Boolean)

  const hasSupplementary = !!(fortune_info.pengzu || fortune_info.wuxing || fortune_info.jianshen || fortune_info.xingsu)
  const hasFooter = !!(fortune_info.shenwei || fortune_info.chongsha || fortune_info.taishen)

  return (
    <CardWrapper title="老黄历" icon={CALENDAR_ICON}>
      {/* 区块1：农历头部 */}
      <div className="mb-4 pb-4 border-b border-fortune-border text-center">
        {festivalPills.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1.5 mb-2">
            {festivalPills.map((p, i) => (
              <span key={i} className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                {p}
              </span>
            ))}
          </div>
        )}
        <h2 className="text-2xl font-semibold text-text-primary">
          {date_info.year_ganzhi ? `${date_info.year_ganzhi}年 ` : ''}
          {date_info.month_ganzhi ? `${date_info.month_ganzhi}月 ` : ''}
          {date_info.lunar_formatted}
        </h2>
        <p className="text-sm text-text-muted mt-1">
          {[date_info.zodiac && `${date_info.zodiac}年`, date_info.day_ganzhi && `日干支 ${date_info.day_ganzhi}`]
            .filter(Boolean)
            .join(' · ')}
        </p>
      </div>

      {/* 区块2：宜忌居中展示 */}
      {(yiItems.length > 0 || jiItems.length > 0) && (
        <div className="mb-4 pb-4 border-b border-fortune-border space-y-3 text-center">
          {yiItems.length > 0 && (
            <div>
              <span className="text-xs font-bold text-white bg-green-600 px-2 py-0.5 rounded">宜</span>
              <p className="text-xs text-green-700 leading-relaxed mt-1.5">{yiItems.join('　')}</p>
            </div>
          )}
          {jiItems.length > 0 && (
            <div>
              <span className="text-xs font-bold text-white bg-red-500 px-2 py-0.5 rounded">忌</span>
              <p className="text-xs text-red-600 leading-relaxed mt-1.5">{jiItems.join('　')}</p>
            </div>
          )}
        </div>
      )}

      {/* 区块3：列表形式展示补充信息 */}
      {(hasSupplementary || hasFooter) && (
        <div className="space-y-0">
          {fortune_info.jianshen && <ListRow label="建除十二值" value={fortune_info.jianshen} />}
          {fortune_info.wuxing && <ListRow label="五行纳音" value={fortune_info.wuxing} />}
          {fortune_info.xingsu && <ListRow label="星宿" value={fortune_info.xingsu} />}
          {fortune_info.pengzu && <ListRow label="彭祖百忌" value={fortune_info.pengzu} />}
          {fortune_info.shenwei && <ListRow label="神位" value={fortune_info.shenwei} />}
          {fortune_info.chongsha && <ListRow label="冲煞" value={fortune_info.chongsha} />}
          {fortune_info.taishen && <ListRow label="胎神" value={fortune_info.taishen} />}
        </div>
      )}
    </CardWrapper>
  )
}

function ListRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between py-1.5 border-b border-fortune-border/50 last:border-0">
      <span className="text-xs text-text-muted flex-shrink-0 mr-4">{label}</span>
      <span className="text-sm text-text-primary text-right leading-relaxed">{value}</span>
    </div>
  )
}
