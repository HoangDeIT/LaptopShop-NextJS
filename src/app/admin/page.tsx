'use client';

import { Box, Card, CardContent, Typography } from '@mui/material';
import { LineChart, BarChart } from '@mui/x-charts';

const DashboardPage = () => {
    return (
        <Box sx={{ padding: '20px', display: 'grid', gap: 2 }}>
            {/* Top Stats Cards */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
                {statsData.map((stat, index) => (
                    <Card key={index} sx={{ textAlign: 'center', padding: '20px' }}>
                        <Typography variant="h5" fontWeight="bold">{stat.value}</Typography>
                        <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
                        <Typography variant="body2" color={stat.change > 0 ? 'green' : 'red'}>
                            {stat.change > 0 ? `↑ ${stat.change}%` : `↓ ${Math.abs(stat.change)}%`}
                        </Typography>
                    </Card>
                ))}
            </Box>

            {/* Charts Section */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 2 }}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Payments Overview</Typography>
                        <LineChart
                            xAxis={[{ scaleType: 'point', data: months }]}
                            series={paymentsData}
                            width={500}
                            height={300}
                        />
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Profit this week</Typography>
                        <BarChart
                            xAxis={[{ scaleType: 'band', data: days }]}
                            series={profitData}
                            width={300}
                            height={300}
                        />
                    </CardContent>

                </Card>
            </Box>
        </Box>
    );
};

// Dummy Data
const statsData = [
    { label: 'Total Views', value: '3.5K', change: 0.43 },
    { label: 'Total Profit', value: '$4.2K', change: 4.35 },
    { label: 'Total Products', value: '3.5K', change: 2.59 },
    { label: 'Total Users', value: '3.5K', change: -0.95 },
];

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const paymentsData = [
    { data: [10, 20, 30, 40, 35, 50, 65, 80, 90, 70, 50, 60], label: 'Received' },
    { data: [5, 15, 25, 35, 30, 45, 60, 75, 85, 65, 45, 55], label: 'Due' }
];

const days = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const profitData = [
    { data: [50, 70, 60, 80, 30, 65, 90], label: 'Sales' },
    { data: [20, 30, 25, 40, 15, 25, 35], label: 'Revenue' }
];

export default DashboardPage;
