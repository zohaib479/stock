"use client";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

export default function PortfolioChart() {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Portfolio Value",
        data: [10000, 10500, 10200, 11000, 11500],
        borderColor: "#00b894",
        backgroundColor: "#00b89444",
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="bg-[#2d2d3f] p-4 rounded shadow">
      <Line data={data} />
    </div>
  );
}
