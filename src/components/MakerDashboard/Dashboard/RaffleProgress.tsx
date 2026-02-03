import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { fontWeight } from "@mui/system";

// Register required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);
const RaffleProgress = () => {
	const data = {
		labels: ["Hoàn thành", "Đang diễn ra", "Đang chờ", "Hủy bỏ"],
		datasets: [
			{
				data: [41, 35, 24, 10],
				backgroundColor: ["#4CAF50", "#FFC107", "#F44336", "#9E9E9E"],
			},
		],
	};

	const options = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			tooltip: {
				enabled: true, // Tooltips will still work on hover
			},
			datalabels: {
				display: true, // Always show data labels
				color: "#fff", // Label color
				font: {
					size: 14, // Font size
				},
				fontWeight: "bold",
			},
		},
	};

	return (
		<div className="p-4 bg-white rounded-lg shadow-md w-full">
			<h2 className="text-lg font-bold mb-4">Biểu đồ quá trình</h2>
			<div className="h-64">
				<Doughnut data={data} options={options} />
			</div>
		</div>
	);
};

export default RaffleProgress;
