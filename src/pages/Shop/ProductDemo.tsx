import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProductList from "@/components/ProductList";
import { ArrowLeft, ToggleLeft, ToggleRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProductDemo() {
  const navigate = useNavigate();
  const [useMockData, setUseMockData] = useState(true);
  const [shopId] = useState("1"); // Demo shop ID

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/profile/shops")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product List Demo</h1>
          <p className="text-gray-600 mt-1">
            Demo việc chuyển đổi giữa Mock Data và API
          </p>
        </div>
      </div>

      {/* Toggle Section */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">Data Source Toggle</h3>
            <p className="text-gray-600 text-sm">
              Chuyển đổi giữa Mock Data và API để test UI
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Mock Data</span>
              <button
                onClick={() => setUseMockData(!useMockData)}
                className="flex items-center gap-2 p-2 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                {useMockData ? (
                  <ToggleRight className="w-6 h-6 text-purple-600" />
                ) : (
                  <ToggleLeft className="w-6 h-6 text-gray-400" />
                )}
                <span className="text-sm font-medium">
                  {useMockData ? "ON" : "OFF"}
                </span>
              </button>
              <span className="text-sm text-gray-600">API</span>
            </div>
            <Badge variant={useMockData ? "secondary" : "default"}>
              {useMockData ? "Mock Data" : "API"}
            </Badge>
          </div>
        </div>
      </Card>

      {/* API Information */}
      <Card className="p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">API Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Endpoint:</h4>
            <code className="bg-gray-100 px-2 py-1 rounded text-xs">
              GET /products
            </code>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Required Parameters:</h4>
            <ul className="text-gray-600 space-y-1">
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
      <Card className="p-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">Hướng dẫn sử dụng</h3>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-start gap-2">
            <span className="text-purple-600 font-medium">1.</span>
            <span>
              <strong>Mock Data Mode:</strong> Hiển thị dữ liệu mẫu, search và filter bị disable
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-purple-600 font-medium">2.</span>
            <span>
              <strong>API Mode:</strong> Kết nối với API thực, search và filter hoạt động, có pagination
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-purple-600 font-medium">3.</span>
            <span>
              <strong>Khi có API:</strong> Chỉ cần thay đổi <code className="bg-gray-100 px-1 rounded">useMockData</code> thành <code className="bg-gray-100 px-1 rounded">false</code>
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
