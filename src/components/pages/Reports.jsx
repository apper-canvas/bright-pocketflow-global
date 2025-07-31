import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Chart from "react-apexcharts";
import { categoriesService } from "@/services/api/categoriesService";
import { transactionsService } from "@/services/api/transactionsService";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Card from "@/components/atoms/Card";
import { formatCurrency } from "@/utils/currency";

export default function Reports() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categorySpending, setCategorySpending] = useState([]);
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [currentMonthTotal, setCurrentMonthTotal] = useState(0);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadReportsData();
  }, []);

  const loadReportsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [categoriesData, categorySpendingData, monthlyTrendsData, currentMonthSpending] = await Promise.all([
        categoriesService.getAll(),
        transactionsService.getCategorySpending(),
        transactionsService.getMonthlyTrends(6),
        transactionsService.getCurrentMonthSpending()
      ]);

      setCategories(categoriesData);
      setCategorySpending(categorySpendingData);
      setMonthlyTrends(monthlyTrendsData);
      setCurrentMonthTotal(currentMonthSpending);
    } catch (err) {
      console.error('Failed to load reports data:', err);
      setError('Failed to load reports data. Please try again.');
      toast.error('Failed to load reports data');
    } finally {
      setLoading(false);
    }
  };

  // Prepare pie chart data
  const pieChartData = {
    series: categorySpending.map(item => item.amount),
    options: {
      chart: {
        type: 'pie',
        height: 350,
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800
        }
      },
      labels: categorySpending.map(item => {
        const category = categories.find(c => c.Id === item.categoryId);
        return category ? category.name : 'Unknown';
      }),
      colors: categorySpending.map(item => {
        const category = categories.find(c => c.Id === item.categoryId);
        return category ? category.color : '#6B7280';
      }),
      legend: {
        position: 'bottom',
        fontSize: '14px',
        fontFamily: 'Inter, sans-serif'
      },
      dataLabels: {
        enabled: true,
        formatter: function(val) {
          return val.toFixed(1) + '%';
        },
        style: {
          fontSize: '12px',
          fontWeight: 600
        }
      },
      tooltip: {
        y: {
          formatter: function(val) {
            return formatCurrency(val);
          }
        }
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            height: 300
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    }
  };

  // Prepare line chart data
  const lineChartData = {
    series: [{
      name: 'Monthly Spending',
      data: monthlyTrends.map(item => item.amount)
    }],
    options: {
      chart: {
        type: 'line',
        height: 350,
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800
        },
        toolbar: {
          show: false
        }
      },
      stroke: {
        width: 3,
        curve: 'smooth'
      },
      colors: ['#2563EB'],
      xaxis: {
        categories: monthlyTrends.map(item => item.month),
        labels: {
          style: {
            fontSize: '12px',
            fontFamily: 'Inter, sans-serif'
          }
        }
      },
      yaxis: {
        labels: {
          formatter: function(val) {
            return formatCurrency(val);
          },
          style: {
            fontSize: '12px',
            fontFamily: 'Inter, sans-serif'
          }
        }
      },
      grid: {
        borderColor: '#E5E7EB',
        strokeDashArray: 3
      },
      tooltip: {
        y: {
          formatter: function(val) {
            return formatCurrency(val);
          }
        }
      },
      markers: {
        size: 6,
        strokeWidth: 2,
        strokeColors: '#FFFFFF',
        hover: {
          size: 8
        }
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            height: 300
          }
        }
      }]
    }
  };

  // Calculate summary statistics
  const averageMonthlySpending = monthlyTrends.length > 0 
    ? monthlyTrends.reduce((sum, item) => sum + item.amount, 0) / monthlyTrends.length 
    : 0;
  
  const highestSpendingMonth = monthlyTrends.length > 0 
    ? monthlyTrends.reduce((max, item) => item.amount > max.amount ? item : max, monthlyTrends[0])
    : null;

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadReportsData} />;

  return (
    <div className="p-4 pb-20 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold text-gray-900">Reports</h1>
          <p className="text-sm text-gray-600 mt-1">Spending analytics and insights</p>
        </div>
        <button
          onClick={loadReportsData}
          className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ApperIcon name="RefreshCw" size={20} />
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ApperIcon name="TrendingUp" size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(currentMonthTotal)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <ApperIcon name="BarChart3" size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Monthly Avg</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(averageMonthlySpending)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ApperIcon name="Calendar" size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Highest Month</p>
              <p className="text-lg font-semibold text-gray-900">
                {highestSpendingMonth ? formatCurrency(highestSpendingMonth.amount) : '-'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Category Spending Breakdown */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-6">
          <ApperIcon name="PieChart" size={20} className="text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Category Breakdown</h2>
          <span className="text-sm text-gray-500">(Current Month)</span>
        </div>
        
        {categorySpending.length > 0 ? (
          <div className="h-80">
            <Chart
              options={pieChartData.options}
              series={pieChartData.series}
              type="pie"
              height="100%"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <ApperIcon name="PieChart" size={48} className="mb-2 opacity-50" />
            <p>No spending data for this month</p>
          </div>
        )}
      </Card>

      {/* Monthly Spending Trends */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-6">
          <ApperIcon name="TrendingUp" size={20} className="text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Spending Trends</h2>
          <span className="text-sm text-gray-500">(Last 6 Months)</span>
        </div>
        
        {monthlyTrends.length > 0 ? (
          <div className="h-80">
            <Chart
              options={lineChartData.options}
              series={lineChartData.series}
              type="line"
              height="100%"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <ApperIcon name="TrendingUp" size={48} className="mb-2 opacity-50" />
            <p>No trend data available</p>
          </div>
        )}
      </Card>

      {/* Category Details */}
      {categorySpending.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-6">
            <ApperIcon name="List" size={20} className="text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Category Details</h2>
          </div>
          
          <div className="space-y-3">
            {categorySpending.map((item) => {
              const category = categories.find(c => c.Id === item.categoryId);
              const percentage = currentMonthTotal > 0 ? (item.amount / currentMonthTotal) * 100 : 0;
              
              return (
                <div key={item.categoryId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category?.color || '#6B7280' }}
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        {category?.name || 'Unknown'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {percentage.toFixed(1)}% of monthly spending
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(item.amount)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {item.transactionCount} transaction{item.transactionCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
</div>
  );
}