import { useState, useEffect } from "react";
import { Package, ShoppingCart, Users, BarChart3, PlusCircle, UserPlus, ClipboardList } from "lucide-react";
import { fetchAllProducts, fetchAllOrders, fetchAllUsers } from "../services/api";

function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalStock: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [products, orders, users] = await Promise.all([
        fetchAllProducts(),
        fetchAllOrders(),
        fetchAllUsers(),
      ]);

      const totalStock = products.reduce((sum, p) => sum + (p.availableStock || 0), 0);

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalUsers: users.length,
        totalStock,
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: "Total Products", value: stats.totalProducts, icon: Package, accent: "emerald" },
    { label: "Total Orders", value: stats.totalOrders, icon: ShoppingCart, accent: "amber" },
    { label: "Total Users", value: stats.totalUsers, icon: Users, accent: "violet" },
    { label: "Total Stock", value: stats.totalStock, icon: BarChart3, accent: "sky" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-gray-200 border-t-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back, here’s what’s happening today</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                  <p className="text-3xl font-semibold text-gray-900">{stat.value}</p>
                </div>
                <div
                  className={`w-14 h-14 flex items-center justify-center rounded-xl bg-${stat.accent}-50 text-${stat.accent}-600`}
                >
                  <Icon size={26} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-5">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition font-medium">
              <PlusCircle size={18} />
              Add New Product
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-violet-50 text-violet-700 hover:bg-violet-100 transition font-medium">
              <UserPlus size={18} />
              Create New User
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 transition font-medium">
              <ClipboardList size={18} />
              View All Orders
            </button>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-5">System Status</h2>
          <div className="space-y-4">
            {["Server Status", "Database", "Real-time Updates"].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-gray-600">{item}</span>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">
                  ● Active
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
