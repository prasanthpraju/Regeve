 import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Service Card Component
const ServiceCard = ({ icon, title, description, onClick, color, isActive = true }) => {
  return (
    <div 
      className={`bg-white rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-gray-100 overflow-hidden group ${
        !isActive ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl'
      }`}
      onClick={isActive ? onClick : null}
    >
      <div className="p-6">
        <div className={`w-14 h-14 rounded-xl ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
        {!isActive && (
          <div className="mt-2 text-sm text-red-500 font-medium">
            🔒 Not subscribed
          </div>
        )}
        <div className={`mt-4 flex items-center ${isActive ? 'text-blue-600' : 'text-gray-400'} font-medium`}>
          <span>{isActive ? "Access Service" : "Upgrade to Access"}</span>
          <svg 
            className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform duration-300" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </div>
  );
};

// Profile Sidebar Component
const ProfileSidebar = ({ adminData, onLogout }) => {
  const getInitials = (name) => {
    if (!name) return "A";
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="bg-gradient-to-br from-blue-900 to-purple-900 text-white rounded-2xl shadow-2xl p-6 h-full">
      {/* Profile Header */}
      <div className="text-center mb-8">
        <div className="relative inline-block">
          <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 p-1 mx-auto mb-4">
            <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center text-4xl">
              {getInitials(adminData?.name)}
            </div>
          </div>
          <div className="absolute bottom-6 right-6 w-8 h-8 bg-green-500 rounded-full border-4 border-blue-900 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold">{adminData?.companyName || "Company Name"}</h2>
        <p className="text-blue-200">{adminData?.occupation || "Administrator"}</p>
      </div>

      {/* Admin Status */}
      <div className="bg-blue-800/30 backdrop-blur-sm rounded-xl p-4 mb-6 border border-blue-700/50">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-blue-200">Account Status</p>
            <p className={`text-lg font-semibold ${adminData?.Approved_Admin ? 'text-green-400' : 'text-yellow-400'}`}>
              {adminData?.Approved_Admin ? '✓ Approved' : '⏳ Pending Approval'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-200">Admin ID</p>
            <p className="font-mono text-sm">{adminData?._id?.substring(0, 8) || "ADM001"}</p>
          </div>
        </div>
      </div>

      {/* Admin Details */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-blue-800/50 flex items-center justify-center">
            <span className="text-lg">📧</span>
          </div>
          <div>
            <p className="text-sm text-blue-200">Email</p>
            <p className="font-medium truncate">{adminData?.email || "admin@example.com"}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-blue-800/50 flex items-center justify-center">
            <span className="text-lg">📱</span>
          </div>
          <div>
            <p className="text-sm text-blue-200">Phone</p>
            <p className="font-medium">{adminData?.phoneNumber || "Not provided"}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-blue-800/50 flex items-center justify-center">
            <span className="text-lg">🆔</span>
          </div>
          <div>
            <p className="text-sm text-blue-200">ID Card</p>
            <p className="font-medium">{adminData?.idCard || "Not provided"}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-blue-800/50 flex items-center justify-center">
            <span className="text-lg">🎂</span>
          </div>
          <div>
            <p className="text-sm text-blue-200">Date of Birth</p>
            <p className="font-medium">
              {adminData?.dob ? new Date(adminData.dob).toLocaleDateString() : "Not provided"}
            </p>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={onLogout}
        className="w-full mt-8 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center space-x-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span>Logout</span>
      </button>
    </div>
  );
};

// Main Dashboard Component
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeServices: 0,
    pendingRequests: 0,
    revenue: 0
  });

  // Available services - map these to your registration form services
  const availableServices = [
    {
      id: "foodManagement",
      icon: "🍽️",
      title: "Food Management",
      description: "Manage menus, orders, and restaurant operations",
      color: "bg-green-100 text-green-600",
      route: "/service/food-management"
    },
    {
      id: "electionSystem",
      icon: "🗳️",
      title: "Election System",
      description: "Conduct polls, surveys, and voting processes",
      color: "bg-blue-100 text-blue-600",
      route: "/electionhome"
    },
    {
      id: "luckydraw",
      icon: "🎁",
      title: "Lucky Draw",
      description: "Create raffles, contests, and prize distributions",
      color: "bg-purple-100 text-purple-600",
      route: "/luckydraw"
    },
    {
      id: "dashboard",
      icon: "📊",
      title: "Dashboard Analytics",
      description: "Analytics, reports, and data visualization",
      color: "bg-orange-100 text-orange-600",
      route: "/dashboard"
    },
    {
      id: "digitalRegistration",
      icon: "📝",
      title: "Digital Registration",
      description: "Online form submissions and e-registration",
      color: "bg-indigo-100 text-indigo-600",
      route: "/service/registration"
    },
    {
      id: "settings",
      icon: "⚙️",
      title: "Settings",
      description: "Manage account and service settings",
      color: "bg-gray-100 text-gray-600",
      route: "/admin/settings"
    }
  ];

  useEffect(() => {
    // Fetch admin data from localStorage
    const fetchAdminData = () => {
      try {
        const storedData = localStorage.getItem("adminData");
        const token = localStorage.getItem("adminToken");
        
        if (!storedData || !token) {
          // If no auth data, redirect to login
          navigate("/login");
          return;
        }

        const data = JSON.parse(storedData);
        setAdminData(data);
        
        // Count active services from registration data
        const activeServices = data.Services ? 
          Object.values(data.Services).filter(Boolean).length : 0;
        
        setStats(prev => ({
          ...prev,
          activeServices
        }));
      } catch (error) {
        console.error("Error fetching admin data:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [navigate]);

  const handleServiceClick = (service) => {
    if (adminData?.Services && adminData.Services[service.id]) {
      navigate(service.route);
    } else {
      alert(`You don't have access to ${service.title}. Please contact support to subscribe.`);
    }
  };

  const handleLogout = () => {
    // Clear all admin data from localStorage
    localStorage.removeItem("adminData");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmail");
    
    // Redirect to login page
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Top Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-blue-600">Regeve</span>
                <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  Admin
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="font-medium text-gray-900">{adminData?.name || "Admin"}</p>
                  <p className="text-sm text-gray-500">{adminData?.companyName || "Company"}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  {adminData?.name?.charAt(0)?.toUpperCase() || "A"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, <span className="text-blue-600">{adminData?.name || "Admin"}</span>! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your services and monitor your dashboard from here
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Services</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeServices}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-2xl text-blue-600">📦</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                  style={{ width: `${(stats.activeServices / 6) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Account Status</p>
                <p className="text-2xl font-bold text-gray-900">
                  {adminData?.Approved_Admin ? "Active" : "Pending"}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-2xl text-green-600">
                  {adminData?.Approved_Admin ? "✅" : "⏳"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="text-2xl font-bold text-gray-900">
                  {adminData?.createdAt ? new Date(adminData.createdAt).getFullYear() : new Date().getFullYear()}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-2xl text-purple-600">📅</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Email Verified</p>
                <p className="text-2xl font-bold text-gray-900">
                  {adminData?.Email_Verify ? "Yes" : "No"}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <span className="text-2xl text-orange-600">📧</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Services Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 h-full">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Your Services</h2>
                <span className="text-sm text-gray-500">
                  {stats.activeServices} of {availableServices.length} active
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {availableServices.map((service) => (
                  <ServiceCard
                    key={service.id}
                    icon={service.icon}
                    title={service.title}
                    description={service.description}
                    color={service.color}
                    isActive={adminData?.Services?.[service.id] || false}
                    onClick={() => handleServiceClick(service)}
                  />
                ))}
              </div>

              {/* Quick Actions */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-3 px-4 rounded-xl transition-colors duration-300 flex items-center justify-center space-x-2">
                    <span>🔄</span>
                    <span>Refresh Services</span>
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="bg-red-50 hover:bg-red-100 text-red-700 font-medium py-3 px-4 rounded-xl transition-colors duration-300 flex items-center justify-center space-x-2"
                  >
                    <span>🚪</span>
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Sidebar */}
          <div>
            <ProfileSidebar 
              adminData={adminData} 
              onLogout={handleLogout}
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { action: "Logged in", time: "Just now", icon: "🔐" },
              { action: "Accessed Dashboard", time: "Today", icon: "📊" },
              { action: "Viewed Services", time: "Today", icon: "👁️" },
              { action: "Account created", time: adminData?.createdAt ? new Date(adminData.createdAt).toLocaleDateString() : "Recently", icon: "✨" },
            ].map((activity, index) => (
              <div 
                key={index}
                className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-xl transition-colors duration-200"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-lg">{activity.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-600">
                © {new Date().getFullYear()} Regeve Admin Dashboard. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <button 
                onClick={handleLogout}
                className="text-gray-500 hover:text-red-600 transition-colors"
              >
                Sign Out
              </button>
              <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">Support</a>
              <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">Help Center</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}