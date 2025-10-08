import React, { useContext } from 'react';
import { InventoryContext } from '../context/InventoryContext';
import StatsCard from '../components/dashboard/StatsCard';
import SummaryCharts from '../components/dashboard/SummaryCharts';
import Loader from '../components/common/Loader';
import SyncIndicator from '../components/common/SyncIndicator';

const Dashboard = () => {
    const { totalProducts, totalSales, totalRevenue, loading } = useContext(InventoryContext);

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <SyncIndicator />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <StatsCard title="Total Products" value={totalProducts} />
                <StatsCard title="Total Sales" value={totalSales} />
                <StatsCard title="Total Revenue" value={`$${totalRevenue.toFixed(2)}`} />
            </div>
            <SummaryCharts />
        </div>
    );
};

export default Dashboard;