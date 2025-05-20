import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import API from "../../lib/axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const GrafikIndex = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    API.get("/peminjaman", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    })
      .then((res) => {
        const data = res.data.data;

        const grouped = {};

        data.forEach((item) => {
          const month = new Date(item.tgl_pinjam).toLocaleString("default", {
            month: "long",
          });

          if (!grouped[month]) grouped[month] = 0;
          grouped[month]++;
        });

        const labels = Object.keys(grouped);
        const values = Object.values(grouped);

        setChartData({
          labels,
          datasets: [
            {
              label: "Jumlah Peminjaman per Bulan",
              data: values,
              backgroundColor: "rgba(54, 162, 235, 0.6)",
              borderRadius: 5,
            },
          ],
        });
      })
      .catch((err) => {
        console.error("Gagal memuat data grafik:", err);
      });
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4 text-white">Grafik Peminjaman per Bulan</h2>
      <Bar data={chartData} />
    </div>
  );
};

export default GrafikIndex;
