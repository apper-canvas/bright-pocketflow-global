import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const Settings = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl flex items-center justify-center">
          <ApperIcon name="Settings" size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Customize your budget tracking experience</p>
        </div>
      </div>

      <Card className="p-8 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name="Settings" size={24} className="text-gray-400" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          App Preferences
        </h3>
        
        <p className="text-gray-600 mb-6">
          This feature is coming soon! Customize your budget categories, notifications, and app preferences.
        </p>
        
        <div className="bg-purple-50 rounded-lg p-4 text-left">
          <h4 className="font-medium text-purple-900 mb-2">Coming Features:</h4>
          <ul className="text-sm text-purple-800 space-y-1">
            <li>• Custom budget categories</li>
            <li>• Notification preferences</li>
            <li>• Currency and date formats</li>
            <li>• Data backup and sync</li>
            <li>• Theme customization</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default Settings;