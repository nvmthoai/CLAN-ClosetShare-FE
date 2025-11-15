import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProductList from "@/components/ProductList";
import { ArrowLeft, ToggleLeft, ToggleRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProductDemo() {
  const navigate = useNavigate();
  const [useMockData, setUseMockData] = useState(true);
  const [shopId] = useState("1"); // Demo shop ID

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/20 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/profile/shops")}
            className="flex items-center gap-2 px-4 py-2 border-2 border-gray-200 rounded-xl text-gray-900 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-500 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Product List Demo</h1>
            <p className="text-gray-600 mt-1">
              Demo việc chuyển đổi giữa Mock Data và API
            </p>
          </div>
        </div>

        {/* Toggle Section */}
        <Card className="p-6 mb-6 border-2 border-gray-100 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Data Source Toggle</h3>
              <p className="text-gray-600 text-sm">
                Chuyển đổi giữa Mock Data và API để test UI
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 font-medium">Mock Data</span>
                <button
                  onClick={() => setUseMockData(!useMockData)}
                  className="flex items-center gap-2 p-2 rounded-xl border-2 border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                >
                  {useMockData ? (
                    <ToggleRight className="w-6 h-6 text-blue-500" />
                  ) : (
                    <ToggleLeft className="w-6 h-6 text-gray-400" />
                  )}
                  <span className="text-sm font-bold">
                    {useMockData ? "ON" : "OFF"}
                  </span>
                </button>
                <span className="text-sm text-gray-600 font-medium">API</span>
              </div>
              <Badge className={useMockData ? "bg-gray-100 text-gray-800 border-gray-200" : "bg-blue-500 text-white"}>
                {useMockData ? "Mock Data" : "API"}
              </Badge>
            </div>
          </div>
        </Card>

        {/* API Information */}
        <Card className="p-6 mb-6 border-2 border-gray-100 shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-4">API Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-bold text-gray-900 mb-2">Endpoint:</h4>
              <code className="bg-gray-100 px-3 py-1.5 rounded-xl text-xs font-mono border border-gray-200">
                GET /products
              </code>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2">Required Parameters:</h4>
              <ul className="text-gray-700 space-y-1">
                <li>• shopId (string)</li>
                <li>• page (number)</li>
                <li>• limit (number)</li>
                <li>• search (string)</li>
                <li>• type (string)</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Product List */}
        <ProductList shopId={shopId} useMockData={useMockData} />

        {/* Instructions */}
        <Card className="p-6 mt-6 border-2 border-gray-100 shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Hướng dẫn sử dụng</h3>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">1.</span>
              <span>
                <strong className="text-gray-900">Mock Data Mode:</strong> Hiển thị dữ liệu mẫu, search và filter bị disable
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">2.</span>
              <span>
                <strong className="text-gray-900">API Mode:</strong> Kết nối với API thực, search và filter hoạt động, có pagination
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">3.</span>
              <span>
                <strong className="text-gray-900">Khi có API:</strong> Chỉ cần thay đổi <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">useMockData</code> thành <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">false</code>
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
