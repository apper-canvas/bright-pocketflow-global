import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const Reports = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gradient-to-br from-info to-blue-600 rounded-xl flex items-center justify-center">
          <ApperIcon name="BarChart3" size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600">Insights and analytics for your spending</p>
        </div>
      </div>

      <Card className="p-8 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name="BarChart3" size={24} className="text-gray-400" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Spending Analytics
        </h3>
        
        <p className="text-gray-600 mb-6">
          This feature is coming soon! Get detailed insights into your spending patterns and trends.
        </p>
        
        <div className="bg-green-50 rounded-lg p-4 text-left">
          <h4 className="font-medium text-green-900 mb-2">Coming Features:</h4>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• Monthly and yearly spending trends</li>
            <li>• Category breakdown charts</li>
            <li>• Budget vs actual comparisons</li>
            <li>• Custom date range reports</li>
            <li>• Spending pattern predictions</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default Reports;