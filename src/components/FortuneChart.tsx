import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, ChartDataLabels)

interface Props {
  indices: {
    comprehensive: number
    love: number
    work: number
    money: number
    health: number
  }
}

export default function FortuneChart({ indices }: Props) {
  const labels = ['综合', '爱情', '事业', '财运', '健康']
  const values = [
    indices.comprehensive,
    indices.love,
    indices.work,
    indices.money,
    indices.health
  ]
  const colors = ['#B45309', '#CA8A04', '#65A30D', '#EA580C', '#A16207']

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: colors,
        borderColor: colors,
        borderWidth: 1,
        borderRadius: 8,
        borderSkipped: false as const,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 40,
        bottom: 10,
        left: 10,
        right: 10,
      },
    },
    scales: {
      y: {
        display: false,
      },
      x: {
        display: true,
        grid: {
          display: false,
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 12,
            weight: 500 as const,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
      datalabels: {
        anchor: 'end' as const,
        align: 'top' as const,
        formatter: (value: number) => value + '分',
        color: '#1e293b',
        font: {
          weight: 'bold' as const,
          size: 14,
        },
        offset: 8,
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart' as const,
    },
  }

  return (
    <div className="bg-fortune-light rounded-lg p-4 h-[200px]">
      <Bar data={data} options={options} />
    </div>
  )
}
