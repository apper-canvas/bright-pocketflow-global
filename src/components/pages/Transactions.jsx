import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const Transactions = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gradient-to-br from-secondary to-purple-600 rounded-xl flex items-center justify-center">
          <ApperIcon name="Receipt" size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600">View and manage all your transactions</p>
        </div>
      </div>

      <Card className="p-8 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name="Receipt" size={24} className="text-gray-400" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Transaction History
        </h3>
        
        <p className="text-gray-600 mb-6">
          This feature is coming soon! You'll be able to view, filter, and manage all your transactions here.
        </p>
        
        <div className="bg-blue-50 rounded-lg p-4 text-left">
          <h4 className="font-medium text-blue-900 mb-2">Coming Features:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Advanced filtering and search</li>
            <li>• Transaction categories and tags</li>
            <li>• Export transaction data</li>
            <li>• Bulk transaction management</li>
            <li>• Receipt photo attachments</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default Transactions;