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
      {/* 区块2：宜忌 */}
      <div className="pb-4 border-b border-fortune-border space-y-2">
        <div className="flex items-start gap-3">
          <div className="h-5 w-5 bg-green-200 rounded" />
          <div className="flex gap-2 flex-wrap">
            {[1,2,3,4].map(i => <div key={i} className="h-4 w-12 bg-green-100 rounded" />)}
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="h-5 w-5 bg-red-200 rounded" />
          <div className="flex gap-2 flex-wrap">
            {[1,2,3].map(i => <div key={i} className="h-4 w-12 bg-red-100 rounded" />)}
          </div>
        </div>
      </div>
      {/* 区块3：补充信息 */}
      <div className="pb-4 border-b border-fortune-border space-y-2">
        <div className="grid grid-cols-3 gap-2">
          {[1,2,3].map(i => <div key={i} className="h-10 bg-white/50 rounded" />)}
        </div>
        <div className="h-8 bg-white/50 rounded" />
      </div>
      {/* 区块4：神位/冲煞/胎神 */}
      <div className="grid grid-cols-3 gap-2">
        {[1,2,3].map(i => <div key={i} className="h-12 bg-white/50 rounded" />)}
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

      {/* 区块2：宜忌内联平铺 */}
      {(yiItems.length > 0 || jiItems.length > 0) && (
        <div className="mb-4 pb-4 border-b border-fortune-border space-y-2">
          {yiItems.length > 0 && (
            <div className="flex items-start gap-3">
              <span className="text-xs font-bold text-white bg-green-600 w-5 h-5 flex-shrink-0 flex items-center justify-center rounded mt-0.5">宜</span>
              <p className="text-xs text-green-700 leading-relaxed">{yiItems.join('　')}</p>
            </div>
          )}
          {jiItems.length > 0 && (
            <div className="flex items-start gap-3">
              <span className="text-xs font-bold text-white bg-red-500 w-5 h-5 flex-shrink-0 flex items-center justify-center rounded mt-0.5">忌</span>
              <p className="text-xs text-red-600 leading-relaxed">{jiItems.join('　')}</p>
            </div>
          )}
        </div>
      )}

      {/* 区块3：建除/五行/星宿/彭祖百忌 */}
      {hasSupplementary && (
        <div className={`mb-4 pb-4 ${hasFooter ? 'border-b border-fortune-border' : ''} space-y-2`}>
          {(fortune_info.jianshen || fortune_info.wuxing || fortune_info.xingsu) && (
            <div className="grid grid-cols-3 gap-2">
              {fortune_info.jianshen && <KvItem label="建除" value={fortune_info.jianshen} />}
              {fortune_info.wuxing && <KvItem label="五行" value={fortune_info.wuxing} />}
              {fortune_info.xingsu && <KvItem label="星宿" value={fortune_info.xingsu} />}
            </div>
          )}
          {fortune_info.pengzu && (
            <div className="text-xs text-text-secondary leading-relaxed">
              <span className="text-text-muted mr-1">彭祖百忌</span>
              {fortune_info.pengzu}
            </div>
          )}
        </div>
      )}

      {/* 区块4：神位/冲煞/胎神 */}
      {hasFooter && (
        <div className="flex justify-around pt-1">
          {fortune_info.shenwei && <InfoItem label="神位" value={fortune_info.shenwei} />}
          {fortune_info.chongsha && <InfoItem label="冲煞" value={fortune_info.chongsha} />}
          {fortune_info.taishen && <InfoItem label="胎神" value={fortune_info.taishen} />}
        </div>
      )}
    </CardWrapper>
  )
}

function KvItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="text-[10px] text-text-muted mb-0.5">{label}</p>
      <p className="text-xs text-text-secondary font-medium leading-snug">{value}</p>
    </div>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="text-[10px] text-text-muted mb-0.5">{label}</p>
      <p className="text-xs text-text-secondary font-medium leading-snug">{value}</p>
    </div>
  )
}
