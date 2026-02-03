import React from "react";
import { Bar } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Tooltip,
	Legend,
} from "chart.js";

// Register required Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const RaffleAnalytics = () => {
	const data = {
		labels: ["S", "M", "T", "W", "T", "F", "S"],
		datasets: [
			{
				label: "Raffle Participation",
				data: [75, 50, 60, 80, 90, 70, 85],
				backgroundColor: "rgba(75, 192, 192, 0.6)",
			},
		],
	};

	const options = {
		responsive: true,
		maintainAspectRatio: false,
	};

	return (
		<div className="p-4 bg-white rounded-lg shadow-md h-full w-full flex flex-col">
			<h2 className="text-lg font-bold mb-4">Biểu đồ phân tích</h2>
			<div className="flex-1 min-h-0">
				<Bar data={data} options={options} />
			</div>
		</div>
	);
};

export default RaffleAnalytics;
