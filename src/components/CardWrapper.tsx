interface Props {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
}

export default function CardWrapper({ title, icon, children }: Props) {
  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/30">
      <div className="flex items-center mb-5 pb-3 border-b border-fortune-border">
        <div className="mr-2.5">
          {icon}
        </div>
        <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
      </div>
      {children}
    </div>
  )
}
