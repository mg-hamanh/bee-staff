import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { formatCurrency } from "@/utils/formatters";

ChartJS.register(ArcElement, Tooltip, Legend);

interface KPIChartProps {
  minTargetAmount: number;
  targetPercent: number | null;
}

export default function SemiCircleChart({
  minTargetAmount,
  targetPercent,
}: KPIChartProps) {
  const percent = targetPercent ?? 0;
  const target = formatCurrency(minTargetAmount);

  const data = {
    labels: ["Đạt được", "Còn lại"],
    datasets: [
      {
        data: [percent, 100 - percent],
        backgroundColor: ["#3b82f6", "#e5e7eb"], // blue và gray
        borderWidth: 0,
      },
    ],
  };

  const options = {
    rotation: -90, // bắt đầu từ bên trái
    circumference: 180, // chỉ vẽ nửa hình tròn
    cutout: "70%", // tạo donut
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `${context.label}: ${context.parsed}%`;
          },
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="w-64 h-32 relative p-2">
      <Doughnut data={data} options={options} />
      {/* Hiển thị số phần trăm ở giữa */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-xl font-bold">
        <div className="flex flex-col items-center">
          <span>{percent}%</span>
          <span>{target}</span>
        </div>
      </div>
    </div>
  );
}
