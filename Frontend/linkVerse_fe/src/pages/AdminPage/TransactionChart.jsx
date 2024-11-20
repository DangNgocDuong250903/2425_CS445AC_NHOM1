import React from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Margin, Padding } from "@mui/icons-material";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const TransactionChart = () => {
    const data = {
        labels: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
        datasets: [
            {
                label: "Tương Tác",
                data: [1000, 3000, 5000, 8000, 15000, 18000, 14000, 10000, 9000, 7000, 6000, 5000],
                borderColor: "#ff2e3c",
                fill: false,
                tension: 0.4,
            },
            {
                label: "Tiếp cận",
                data: [2000, 4000, 7000, 12000, 20000, 24000, 18000, 15000, 11000, 9000, 7000, 6000],
                borderColor: "#1f80cb",
                fill: false,
                tension: 0.4,
            },
        ],
    };

    const options = {
        maintainAspectRatio: false, // Cho phép tùy chỉnh kích thước
        plugins: {
            title: {
                display: true,
            },
            tooltip: {
                enabled: true,
                callbacks: {
                    label: function (tooltipItem) {
                        return `${tooltipItem.dataset.label}: ${tooltipItem.raw.toLocaleString()} lượt`;
                    },
                },
            },
            legend: {
                display: true,
                position: "top",
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Biểu Đồ Tương tác và Lượng tiếp cận theo tháng",
                    padding: {
                        top: 20,
                        bottom: 10, // Khoảng cách giữa trục x và biểu đồ
                    },
                    font: {
                        size: 16,
                        weight: "bold",
                    },
                    color: "#333",
                },
            },
            y: {
                title: {
                    display: true,
                },
            },
        },
    };

    return (
        <div className="h-[450px] p-5 mt-5 bg-white rounded-lg shadow-md">
            <h2 className="font-medium">Biểu đồ Tương tác và Tiếp cận</h2>
            <div className="w-full h-[400px]">
                <Line data={data} options={options} />
            </div>
        </div>
    );
};

export default TransactionChart;
