import { useState } from 'react'
import Header from './components/Header'
import AlmanacCard from './components/AlmanacCard'
import ConstellationCard from './components/ConstellationCard'
import { useFortune } from './hooks/useFortune'
import { useConstellation } from './hooks/useConstellation'

function App() {
  const [selectedSign, setSelectedSign] = useState('aries')
  const { data: fortuneData, loading: fortuneLoading, error: fortuneError } = useFortune()
  const { data: constellationData, loading: constellationLoading, error: constellationError } = useConstellation(selectedSign)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#efe7da] via-[#f5f0e8] to-[#faf7f1]">
      <div className="max-w-6xl mx-auto px-4 py-8 md:px-8">
        <Header />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-7">
          <AlmanacCard 
            data={fortuneData} 
            loading={fortuneLoading} 
            error={fortuneError} 
          />
          
          <ConstellationCard
            data={constellationData}
            loading={constellationLoading}
            error={constellationError}
            selectedSign={selectedSign}
            onSignChange={setSelectedSign}
          />
        </div>

        <footer className="text-center py-6 mt-4 text-text-muted text-xs border-t border-fortune-border pt-4">
          <p>Created by @王明明 · Powered By AI &amp; 天行数据 · 仅供娱乐参考</p>
        </footer>
      </div>
    </div>
  )
}

export default App
