import React from 'react';
import { Chart as CharJS, Tooltip, Legend } from "chart.js"
import { Bar } from 'react-chartjs-2';
import { useInventory } from '../../hooks/useInventory';

const SummaryCharts = () => {
    ChartJS.register(Tooltip, Legend);

    const { salesData, inventoryData } = useInventory();

    const salesChartData = {
        labels: salesData.map(sale => sale.date),
        datasets: [
            {
                label: 'Sales',
                data: salesData.map(sale => sale.totalAmount),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
        ],
    };

    const inventoryChartData = {
        labels: inventoryData.map(item => item.name),
        datasets: [
            {
                label: 'Inventory Levels',
                data: inventoryData.map(item => item.quantity),
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
            },
        ],
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white shadow-md rounded-lg p-4">
                <h2 className="text-lg font-semibold">Sales Overview</h2>
                <Bar data={salesChartData} />
            </div>
            <div className="bg-white shadow-md rounded-lg p-4">
                <h2 className="text-lg font-semibold">Inventory Levels</h2>
                <Bar data={inventoryChartData} />
            </div>
        </div>
    );
};

export default SummaryCharts;