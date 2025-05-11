import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const SimpleBarChart = ({ title, description, data, icon: Icon, chartColor = '#8884d8', valuePrefix = '' }) => {
  if (!data || data.length === 0) {
    return (
      <Card className="shadow-lg h-full flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-gray-700">{title}</CardTitle>
              {description && <CardDescription className="text-xs text-muted-foreground">{description}</CardDescription>}
            </div>
            {Icon && <Icon className="h-6 w-6 text-primary" />}
          </div>
        </CardHeader>
        <CardContent className="flex-grow flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <img className="w-24 h-24 mx-auto mb-3 opacity-50" alt="No data" src="https://images.unsplash.com/photo-1676799909994-e3f26590eaf5" />
            <p className="text-sm">No data available to display chart.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-700">{title}</CardTitle>
            {description && <CardDescription className="text-xs text-muted-foreground">{description}</CardDescription>}
          </div>
          {Icon && <Icon className="h-6 w-6 text-primary" />}
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip formatter={(value) => `${valuePrefix}${value}`} />
            <Legend />
            <Bar dataKey="value" fill={chartColor} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SimpleBarChart;
