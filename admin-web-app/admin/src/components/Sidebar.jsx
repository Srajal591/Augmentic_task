import { LayoutDashboard, Boxes, Users, LogOut } from "lucide-react";

function Sidebar({ currentPage, onNavigate, onLogout, user }) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "inventory", label: "Inventory", icon: Boxes },
    { id: "users", label: "Users", icon: Users },
  ];

  return (
    <div className="w-72 h-screen fixed left-0 top-0 bg-white border-r border-gray-200 shadow-lg flex flex-col">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100">
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Augmentic</h1>
        <p className="text-sm text-gray-500">Admin Panel</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-6 py-3 mb-1 text-left transition-all rounded-r-full group \
                ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700 border-l-4 border-emerald-500"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent"
                }`}
            >
              <Icon
                size={20}
                className={`transition \
                  ${isActive ? "text-emerald-600" : "text-gray-400 group-hover:text-gray-600"}`}
              />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Info + Logout */}
      <div className="px-6 py-5 border-t border-gray-100">
        <div className="mb-4">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Logged in as</p>
          <p className="text-sm font-medium text-gray-800 truncate">{user?.name}</p>
          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white py-2.5 rounded-xl transition font-medium"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
