"use client";
import { useState, useEffect } from "react";
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
const MONTHS = ["Jan","Feb","Mar","Apr","May"];
export default function PortfolioChart() {
  const [data, setData] = useState({
    labels: MONTHS, 
    datasets: [
      {
        label: "Portfolio Value",
        data: [10000, 10500, 10200, 11000, 11500],
        borderColor: "#00b894",
        backgroundColor: "#00b89444",
        tension: 0.3,
      },
    ],
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const newData = prev.datasets[0].data.map((val) => {
          const change = Math.floor(Math.random() * 500 - 250); // -250 to +250
          return val + change;
        });

        return {
          ...prev,
          datasets: [
            {
              ...prev.datasets[0],
              data: newData,
            },
          ],
        };
      });
    }, 2000); 
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="bg-[#2d2d3f] p-4 rounded shadow">
      <Line data={data} />
    </div>
  );
}
