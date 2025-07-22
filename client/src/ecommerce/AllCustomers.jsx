// src/App.js
import React, { useState, useEffect } from "react";
import {
  FaUsers,
  FaShoppingCart,
  FaChartLine,
  FaCog,
  FaBell,
  FaSearch,
  FaUserCircle,
  FaFilter,
  FaSync,
  FaEye,
  FaEdit,
  FaTrash,
  FaPlus,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

const AllCustomers = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });

  // Simulate real-time data updates
  useEffect(() => {
    // Generate initial dummy data
    const generateDummyData = () => {
      const names = [
        "John",
        "Emma",
        "Michael",
        "Sophia",
        "William",
        "Olivia",
        "James",
        "Isabella",
        "Benjamin",
        "Mia",
      ];
      const lastNames = [
        "Smith",
        "Johnson",
        "Williams",
        "Brown",
        "Jones",
        "Garcia",
        "Miller",
        "Davis",
        "Rodriguez",
        "Martinez",
      ];
      const statuses = ["Active", "Pending", "Inactive", "VIP"];
      const locations = [
        "New York",
        "Los Angeles",
        "Chicago",
        "Houston",
        "Phoenix",
        "Philadelphia",
        "San Antonio",
        "San Diego",
        "Dallas",
        "San Jose",
      ];

      return Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        name: `${names[Math.floor(Math.random() * names.length)]} ${
          lastNames[Math.floor(Math.random() * lastNames.length)]
        }`,
        email: `user${i + 1}@example.com`,
        phone: `+1 (${Math.floor(Math.random() * 900) + 100})-${
          Math.floor(Math.random() * 900) + 100
        }-${Math.floor(Math.random() * 9000) + 1000}`,
        location: locations[Math.floor(Math.random() * locations.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        orders: Math.floor(Math.random() * 100),
        spent: (Math.random() * 10000).toFixed(2),
        lastActive: new Date(
          Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
        )
          .toISOString()
          .split("T")[0],
        joined: new Date(
          Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000
        )
          .toISOString()
          .split("T")[0],
      }));
    };

    setCustomers(generateDummyData());

    // Simulate real-time updates
    const interval = setInterval(() => {
      setCustomers((prev) => {
        const updated = [...prev];
        // Randomly update 1-3 customers
        const count = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < count; i++) {
          const index = Math.floor(Math.random() * updated.length);
          if (Math.random() > 0.7) {
            updated[index].status = ["Active", "Pending", "Inactive", "VIP"][
              Math.floor(Math.random() * 4)
            ];
          }
          updated[index].orders += Math.floor(Math.random() * 3);
          updated[index].spent = (
            parseFloat(updated[index].spent) +
            Math.random() * 100
          ).toFixed(2);
        }
        return updated;
      });
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...customers];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (customer) =>
          customer.name.toLowerCase().includes(term) ||
          customer.email.toLowerCase().includes(term) ||
          customer.phone.includes(term) ||
          customer.location.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((customer) => customer.status === statusFilter);
    }

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredCustomers(result);
  }, [customers, searchTerm, statusFilter, sortConfig]);

  // Handle sorting
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Inactive":
        return "bg-gray-100 text-gray-800";
      case "VIP":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  // Stats for dashboard cards
  const stats = {
    totalCustomers: customers.length,
    activeCustomers: customers.filter((c) => c.status === "Active").length,
    newCustomers: customers.filter(
      (c) =>
        new Date(c.joined) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ).length,
    vipCustomers: customers.filter((c) => c.status === "VIP").length,
  };

  return (
    <div className="flex  overflow-y-auto bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <header className="bg-white shadow">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search customers..."
                  className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>

              <div className="ml-4 flex items-center">
                <select
                  className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Inactive">Inactive</option>
                  <option value="VIP">VIP</option>
                </select>
                <button className="ml-2 p-2 rounded-lg hover:bg-gray-100">
                  <FaFilter />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Cards */}
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardCard
            title="Total Customers"
            value={stats.totalCustomers}
            icon={<FaUsers className="text-3xl" />}
            color="bg-blue-500"
          />
          <DashboardCard
            title="Active Customers"
            value={stats.activeCustomers}
            icon={<FaUserCircle className="text-3xl" />}
            color="bg-green-500"
          />
          <DashboardCard
            title="New Customers"
            value={stats.newCustomers}
            icon={<FaPlus className="text-3xl" />}
            color="bg-yellow-500"
          />
          <DashboardCard
            title="VIP Customers"
            value={stats.vipCustomers}
            icon={<FaUserCircle className="text-3xl" />}
            color="bg-purple-500"
          />
        </div>

        {/* Customer Table */}
        <div className="p-4 ">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">Customer Details</h2>
              <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                <FaSync className="mr-2" />
                <span>Real-time Updates</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <TableHeader
                      name="ID"
                      sortKey="id"
                      sortConfig={sortConfig}
                      requestSort={requestSort}
                    />
                    <TableHeader
                      name="Name"
                      sortKey="name"
                      sortConfig={sortConfig}
                      requestSort={requestSort}
                    />
                    <TableHeader
                      name="Email"
                      sortKey="email"
                      sortConfig={sortConfig}
                      requestSort={requestSort}
                    />
                    <TableHeader
                      name="Phone"
                      sortKey="phone"
                      sortConfig={sortConfig}
                      requestSort={requestSort}
                    />
                    <TableHeader
                      name="Location"
                      sortKey="location"
                      sortConfig={sortConfig}
                      requestSort={requestSort}
                    />
                    <TableHeader
                      name="Status"
                      sortKey="status"
                      sortConfig={sortConfig}
                      requestSort={requestSort}
                    />
                    <TableHeader
                      name="Orders"
                      sortKey="orders"
                      sortConfig={sortConfig}
                      requestSort={requestSort}
                    />
                    <TableHeader
                      name="Total Spent"
                      sortKey="spent"
                      sortConfig={sortConfig}
                      requestSort={requestSort}
                    />
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCustomers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {customer.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              Joined: {customer.joined}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            customer.status
                          )}`}
                        >
                          {customer.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.orders}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${customer.spent}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <FaEye />
                          </button>
                          <button className="text-yellow-600 hover:text-yellow-900">
                            <FaEdit />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to{" "}
                    <span className="font-medium">10</span> of{" "}
                    <span className="font-medium">
                      {filteredCustomers.length}
                    </span>{" "}
                    results
                  </p>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <a
                      href="#"
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      Previous
                    </a>
                    <a
                      href="#"
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      1
                    </a>
                    <a
                      href="#"
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      2
                    </a>
                    <a
                      href="#"
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      3
                    </a>
                    <a
                      href="#"
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      Next
                    </a>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Dashboard Card Component
const DashboardCard = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden transform transition duration-300 hover:scale-105 ">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`${color} p-3 rounded-lg text-white`}>{icon}</div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-600">{title}</h3>
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Table Header Component
const TableHeader = ({ name, sortKey, sortConfig, requestSort }) => {
  const isActive = sortConfig.key === sortKey;

  return (
    <th
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer  hover:bg-gray-100"
      onClick={() => requestSort(sortKey)}
    >
      <div className="flex items-center">
        {name}
        {isActive && (
          <span className="ml-1">
            {sortConfig.direction === "asc" ? (
              <FaArrowUp size={12} />
            ) : (
              <FaArrowDown size={12} />
            )}
          </span>
        )}
      </div>
    </th>
  );
};

export default AllCustomers;
