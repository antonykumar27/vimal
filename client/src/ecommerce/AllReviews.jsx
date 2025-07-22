// src/components/ReviewManagement.js
import React, { useState, useEffect } from "react";
import {
  FaStar,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
  FaSearch,
  FaFilter,
  FaReply,
  FaRegComment,
  FaRegEye,
} from "react-icons/fa";

const AllReviews = () => {
  // States for reviews and filters
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });

  // Generate initial dummy review data
  useEffect(() => {
    const generateDummyReviews = () => {
      const products = [
        "Wireless Headphones",
        "Smart Watch",
        "Running Shoes",
        "Coffee Maker",
        "Bluetooth Speaker",
        "Yoga Mat",
        "Water Bottle",
        "Backpack",
        "Desk Lamp",
        "Wireless Charger",
      ];
      const customers = [
        "John Smith",
        "Emma Johnson",
        "Michael Williams",
        "Sophia Brown",
        "William Davis",
        "Olivia Miller",
        "James Wilson",
        "Isabella Moore",
        "Benjamin Taylor",
        "Mia Anderson",
      ];
      const comments = [
        "Excellent product, highly recommend!",
        "Good value for money",
        "Not as described, disappointed",
        "Fast shipping and good packaging",
        "Stopped working after 2 weeks",
        "Perfect for my needs",
        "Better than expected quality",
        "Customer service was unhelpful",
        "Exactly what I was looking for",
        "Would buy again without hesitation",
      ];

      return Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        product: products[Math.floor(Math.random() * products.length)],
        customer: customers[Math.floor(Math.random() * customers.length)],
        rating: Math.floor(Math.random() * 5) + 1,
        comment: comments[Math.floor(Math.random() * comments.length)],
        date: new Date(
          Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
        )
          .toISOString()
          .split("T")[0],
        status: ["pending", "approved", "rejected"][
          Math.floor(Math.random() * 3)
        ],
        replies: Math.floor(Math.random() * 3),
        helpful: Math.floor(Math.random() * 20),
      }));
    };

    setReviews(generateDummyReviews());

    // Simulate real-time review updates
    const interval = setInterval(() => {
      setReviews((prev) => {
        const updated = [...prev];
        // Randomly update 1-2 reviews
        const count = Math.floor(Math.random() * 2) + 1;
        for (let i = 0; i < count; i++) {
          const index = Math.floor(Math.random() * updated.length);
          if (Math.random() > 0.7) {
            updated[index].status = ["pending", "approved", "rejected"][
              Math.floor(Math.random() * 3)
            ];
          }
          updated[index].helpful += Math.floor(Math.random() * 3);
        }

        // Occasionally add a new review
        if (Math.random() > 0.8) {
          const newReview = {
            id: prev.length + 1,
            product: ["New Product A", "New Product B", "New Product C"][
              Math.floor(Math.random() * 3)
            ],
            customer: ["New Customer X", "New Customer Y", "New Customer Z"][
              Math.floor(Math.random() * 3)
            ],
            rating: Math.floor(Math.random() * 5) + 1,
            comment: [
              "Just arrived",
              "First impression is good",
              "Quick delivery",
            ][Math.floor(Math.random() * 3)],
            date: new Date().toISOString().split("T")[0],
            status: "pending",
            replies: 0,
            helpful: 0,
          };
          updated.unshift(newReview);
        }

        return updated;
      });
    }, 7000); // Update every 7 seconds

    return () => clearInterval(interval);
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...reviews];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (review) =>
          review.product.toLowerCase().includes(term) ||
          review.customer.toLowerCase().includes(term) ||
          review.comment.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((review) => review.status === statusFilter);
    }

    // Apply rating filter
    if (ratingFilter !== "all") {
      result = result.filter(
        (review) => review.rating === parseInt(ratingFilter)
      );
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

    setFilteredReviews(result);
  }, [reviews, searchTerm, statusFilter, ratingFilter, sortConfig]);

  // Handle sorting
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Get status color and text
  const getStatusInfo = (status) => {
    switch (status) {
      case "approved":
        return { color: "bg-green-100 text-green-800", text: "Approved" };
      case "pending":
        return { color: "bg-yellow-100 text-yellow-800", text: "Pending" };
      case "rejected":
        return { color: "bg-red-100 text-red-800", text: "Rejected" };
      default:
        return { color: "bg-gray-100 text-gray-800", text: "Unknown" };
    }
  };

  // Handle review actions
  const approveReview = (id) => {
    setReviews(
      reviews.map((review) =>
        review.id === id ? { ...review, status: "approved" } : review
      )
    );
  };

  const rejectReview = (id) => {
    setReviews(
      reviews.map((review) =>
        review.id === id ? { ...review, status: "rejected" } : review
      )
    );
  };

  const deleteReview = (id) => {
    setReviews(reviews.filter((review) => review.id !== id));
  };

  // Stats for review dashboard
  const reviewStats = {
    totalReviews: reviews.length,
    pendingReviews: reviews.filter((r) => r.status === "pending").length,
    avgRating: (
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    ).toFixed(1),
    helpfulReviews: reviews.filter((r) => r.helpful > 5).length,
  };

  return (
    <div className="p-4">
      {/* Review Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Review Management
          </h1>
          <p className="text-gray-600">
            Monitor and manage customer reviews in real-time
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center">
            <FaRegComment className="mr-2" />
            Generate Monthly Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-5 rounded-xl shadow-lg border-l-4 border-blue-500">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-gray-500 text-sm">Total Reviews</h3>
              <p className="text-2xl font-bold">{reviewStats.totalReviews}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FaRegComment className="text-blue-500 text-xl" />
            </div>
          </div>
          <div className="mt-2 text-sm text-green-600 font-medium">
            <span>↑ 12% from last month</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-lg border-l-4 border-yellow-500">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-gray-500 text-sm">Pending Reviews</h3>
              <p className="text-2xl font-bold">{reviewStats.pendingReviews}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <FaRegEye className="text-yellow-500 text-xl" />
            </div>
          </div>
          <div className="mt-2 text-sm text-red-600 font-medium">
            <span>↓ 5% from last week</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-lg border-l-4 border-green-500">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-gray-500 text-sm">Average Rating</h3>
              <p className="text-2xl font-bold">
                {reviewStats.avgRating}
                <span className="text-gray-400 text-lg">/5</span>
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FaStar className="text-green-500 text-xl" />
            </div>
          </div>
          <div className="mt-2 flex items-center">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={`text-${
                  i < Math.floor(reviewStats.avgRating) ? "yellow" : "gray"
                }-400 text-sm`}
              />
            ))}
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-lg border-l-4 border-purple-500">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-gray-500 text-sm">Helpful Reviews</h3>
              <p className="text-2xl font-bold">{reviewStats.helpfulReviews}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <FaCheck className="text-purple-500 text-xl" />
            </div>
          </div>
          <div className="mt-2 text-sm text-green-600 font-medium">
            <span>↑ 18% from last month</span>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search reviews by product, customer or comment..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            <select
              className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>

            <button className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 flex items-center">
              <FaFilter className="mr-1" /> More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Review
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReviews.map((review) => (
                <tr key={review.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {review.product}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {review.customer}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`${
                            i < review.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          } text-sm`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-500">
                        ({review.rating})
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {review.comment}
                    </div>
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                      <FaReply className="mr-1" /> {review.replies} replies
                      <span className="mx-2">•</span>
                      <FaCheck className="mr-1" /> {review.helpful} found
                      helpful
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{review.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        getStatusInfo(review.status).color
                      }`}
                    >
                      {getStatusInfo(review.status).text}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {review.status === "pending" && (
                        <>
                          <button
                            onClick={() => approveReview(review.id)}
                            className="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-100"
                            title="Approve"
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={() => rejectReview(review.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100"
                            title="Reject"
                          >
                            <FaTimes />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => deleteReview(review.id)}
                        className="text-gray-600 hover:text-gray-900 p-1 rounded-full hover:bg-gray-100"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                      <button
                        className="text-purple-600 hover:text-purple-900 p-1 rounded-full hover:bg-purple-100"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to{" "}
                <span className="font-medium">10</span> of{" "}
                <span className="font-medium">{filteredReviews.length}</span>{" "}
                reviews
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

      {/* Recent Activity */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Recent Review Activity
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReviews.slice(0, 3).map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-purple-500"
            >
              <div className="flex justify-between">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`${
                        i < review.rating ? "text-yellow-400" : "text-gray-300"
                      } text-sm mr-0.5`}
                    />
                  ))}
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    getStatusInfo(review.status).color
                  }`}
                >
                  {getStatusInfo(review.status).text}
                </span>
              </div>
              <h3 className="font-semibold mt-2">{review.product}</h3>
              <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                {review.comment}
              </p>
              <div className="flex justify-between items-center mt-3">
                <span className="text-sm text-gray-500">{review.customer}</span>
                <span className="text-xs text-gray-400">{review.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllReviews;
