// src/components/MessageManagement.js
import React, { useState, useEffect } from "react";
import {
  FaEnvelope,
  FaEnvelopeOpen,
  FaReply,
  FaTrash,
  FaSearch,
  FaFilter,
  FaUserCircle,
  FaPaperclip,
  FaClock,
  FaCheckCircle,
  FaExclamationCircle,
  FaRegStar,
  FaStar,
  FaCog,
  FaPlus,
  FaEllipsisV,
} from "react-icons/fa";

const AllMessage = () => {
  // States for messages and UI
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("inbox");
  const [replyText, setReplyText] = useState("");
  const [isComposing, setIsComposing] = useState(false);

  // Generate initial dummy message data
  useEffect(() => {
    const generateDummyMessages = () => {
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
      const subjects = [
        "Order Inquiry",
        "Shipping Update",
        "Product Question",
        "Return Request",
        "Payment Issue",
        "Account Problem",
        "Technical Support",
        "Feedback",
        "Partnership Inquiry",
      ];
      const statuses = ["unread", "read", "replied", "closed"];
      const priorities = ["low", "medium", "high", "urgent"];

      return Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        customer: customers[Math.floor(Math.random() * customers.length)],
        subject: subjects[Math.floor(Math.random() * subjects.length)],
        preview:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
        status: statuses[Math.floor(Math.random() * statuses.length)],
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        date: new Date(
          Date.now() - Math.floor(Math.random() * 48) * 60 * 60 * 1000
        ).toISOString(),
        starred: Math.random() > 0.7,
        attachments:
          Math.random() > 0.5 ? Math.floor(Math.random() * 3) + 1 : 0,
        thread: Array.from(
          { length: Math.floor(Math.random() * 3) + 1 },
          (_, j) => ({
            id: j + 1,
            sender:
              j === 0
                ? customers[Math.floor(Math.random() * customers.length)]
                : "Admin Support",
            message: `This is message ${
              j + 1
            } in the conversation about ${subjects[
              Math.floor(Math.random() * subjects.length)
            ].toLowerCase()}. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
            timestamp: new Date(
              Date.now() -
                Math.floor(Math.random() * 24) * 60 * 60 * 1000 -
                j * 10000
            ).toISOString(),
          })
        ),
      }));
    };

    setMessages(generateDummyMessages());

    // Simulate real-time message updates
    const interval = setInterval(() => {
      setMessages((prev) => {
        const updated = [...prev];

        // Occasionally add a new message
        if (Math.random() > 0.85) {
          const customers = [
            "New Customer A",
            "New Customer B",
            "New Customer C",
          ];
          const subjects = [
            "New Order Question",
            "Urgent Support Needed",
            "Website Feedback",
          ];

          const newMessage = {
            id: prev.length + 1,
            customer: customers[Math.floor(Math.random() * customers.length)],
            subject: subjects[Math.floor(Math.random() * subjects.length)],
            preview:
              "New message received. Please review as soon as possible...",
            status: "unread",
            priority: ["low", "medium", "high", "urgent"][
              Math.floor(Math.random() * 4)
            ],
            date: new Date().toISOString(),
            starred: false,
            attachments: 0,
            thread: [
              {
                id: 1,
                sender: customers[Math.floor(Math.random() * customers.length)],
                message:
                  "This is a new message that just arrived in your inbox. It requires your attention.",
                timestamp: new Date().toISOString(),
              },
            ],
          };
          updated.unshift(newMessage);
        }

        // Occasionally update status of random messages
        if (Math.random() > 0.8) {
          const index = Math.floor(Math.random() * updated.length);
          if (updated[index].status === "unread" && Math.random() > 0.6) {
            updated[index].status = "read";
          }
        }

        return updated;
      });
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...messages];

    // Apply tab filter
    if (activeTab === "inbox") {
      result = result.filter((msg) => msg.status !== "closed");
    } else if (activeTab === "sent") {
      // In a real app, this would filter sent messages
      result = result.filter((msg) => msg.status === "replied");
    } else if (activeTab === "drafts") {
      // In a real app, this would filter drafts
      result = result.slice(0, 3); // Just for demo
    } else if (activeTab === "starred") {
      result = result.filter((msg) => msg.starred);
    } else if (activeTab === "closed") {
      result = result.filter((msg) => msg.status === "closed");
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (msg) =>
          msg.customer.toLowerCase().includes(term) ||
          msg.subject.toLowerCase().includes(term) ||
          msg.preview.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((msg) => msg.status === statusFilter);
    }

    // Apply priority filter
    if (priorityFilter !== "all") {
      result = result.filter((msg) => msg.priority === priorityFilter);
    }

    setFilteredMessages(result);
  }, [messages, searchTerm, statusFilter, priorityFilter, activeTab]);

  // Stats for dashboard
  const messageStats = {
    total: messages.length,
    unread: messages.filter((msg) => msg.status === "unread").length,
    replied: messages.filter((msg) => msg.status === "replied").length,
    urgent: messages.filter((msg) => msg.priority === "urgent").length,
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "unread":
        return <FaEnvelope className="text-blue-500" />;
      case "read":
        return <FaEnvelopeOpen className="text-gray-400" />;
      case "replied":
        return <FaReply className="text-green-500" />;
      case "closed":
        return <FaCheckCircle className="text-gray-500" />;
      default:
        return <FaEnvelope className="text-gray-400" />;
    }
  };

  // Toggle star
  const toggleStar = (id) => {
    setMessages(
      messages.map((msg) =>
        msg.id === id ? { ...msg, starred: !msg.starred } : msg
      )
    );
  };

  // Mark as read/unread
  const toggleReadStatus = (id) => {
    setMessages(
      messages.map((msg) =>
        msg.id === id
          ? { ...msg, status: msg.status === "unread" ? "read" : "unread" }
          : msg
      )
    );
  };

  // Close message
  const closeMessage = (id) => {
    setMessages(
      messages.map((msg) =>
        msg.id === id ? { ...msg, status: "closed" } : msg
      )
    );
    if (selectedMessage?.id === id) setSelectedMessage(null);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  // Send reply
  const sendReply = () => {
    if (!replyText.trim() || !selectedMessage) return;

    const newThread = {
      id: selectedMessage.thread.length + 1,
      sender: "Admin Support",
      message: replyText,
      timestamp: new Date().toISOString(),
    };

    setMessages(
      messages.map((msg) =>
        msg.id === selectedMessage.id
          ? {
              ...msg,
              status: "replied",
              thread: [...msg.thread, newThread],
            }
          : msg
      )
    );

    setSelectedMessage({
      ...selectedMessage,
      status: "replied",
      thread: [...selectedMessage.thread, newThread],
    });

    setReplyText("");
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Message Center</h1>
            <p className="text-gray-600">
              Manage customer communications and support requests
            </p>
          </div>
          <div className="mt-2 md:mt-0">
            <button
              onClick={() => setIsComposing(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <FaPlus className="mr-2" />
              Compose New
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500">
          <div className="flex justify-between">
            <div>
              <h3 className="text-gray-500 text-sm">Total Messages</h3>
              <p className="text-2xl font-bold">{messageStats.total}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FaEnvelope className="text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-yellow-500">
          <div className="flex justify-between">
            <div>
              <h3 className="text-gray-500 text-sm">Unread Messages</h3>
              <p className="text-2xl font-bold">{messageStats.unread}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <FaEnvelope className="text-yellow-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500">
          <div className="flex justify-between">
            <div>
              <h3 className="text-gray-500 text-sm">Replied</h3>
              <p className="text-2xl font-bold">{messageStats.replied}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FaReply className="text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-red-500">
          <div className="flex justify-between">
            <div>
              <h3 className="text-gray-500 text-sm">Urgent</h3>
              <p className="text-2xl font-bold">{messageStats.urgent}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <FaExclamationCircle className="text-red-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden p-4 pt-0 gap-4">
        {/* Left Panel - Message List */}
        <div
          className={`bg-white rounded-xl shadow-lg flex flex-col ${
            selectedMessage ? "w-full md:w-2/5" : "w-full"
          }`}
        >
          {/* Filters */}
          <div className="p-4 border-b">
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                className={`px-3 py-1 rounded-full ${
                  activeTab === "inbox"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
                }`}
                onClick={() => setActiveTab("inbox")}
              >
                Inbox
              </button>
              <button
                className={`px-3 py-1 rounded-full ${
                  activeTab === "sent"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
                }`}
                onClick={() => setActiveTab("sent")}
              >
                Sent
              </button>
              <button
                className={`px-3 py-1 rounded-full ${
                  activeTab === "drafts"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
                }`}
                onClick={() => setActiveTab("drafts")}
              >
                Drafts
              </button>
              <button
                className={`px-3 py-1 rounded-full ${
                  activeTab === "starred"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
                }`}
                onClick={() => setActiveTab("starred")}
              >
                Starred
              </button>
              <button
                className={`px-3 py-1 rounded-full ${
                  activeTab === "closed"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
                }`}
                onClick={() => setActiveTab("closed")}
              >
                Closed
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search messages..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>

              <div className="flex gap-2">
                <select
                  className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                  <option value="closed">Closed</option>
                </select>

                <select
                  className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                >
                  <option value="all">All Priorities</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Message List */}
          <div className="overflow-y-auto flex-1">
            {filteredMessages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center p-8">
                  <FaEnvelopeOpen className="mx-auto text-gray-400 text-4xl mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700">
                    No messages found
                  </h3>
                  <p className="text-gray-500 mt-2">
                    Try adjusting your filters or search term
                  </p>
                </div>
              </div>
            ) : (
              filteredMessages.map((message) => (
                <div
                  key={message.id}
                  className={`border-b border-gray-100 p-4 cursor-pointer hover:bg-blue-50 transition ${
                    selectedMessage?.id === message.id
                      ? "bg-blue-50 border-l-4 border-blue-500"
                      : ""
                  } ${
                    message.status === "unread" ? "bg-gray-50 font-medium" : ""
                  }`}
                  onClick={() => setSelectedMessage(message)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="mr-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleStar(message.id);
                          }}
                          className="text-gray-400 hover:text-yellow-500"
                        >
                          {message.starred ? (
                            <FaStar className="text-yellow-500" />
                          ) : (
                            <FaRegStar />
                          )}
                        </button>
                      </div>
                      <div className="mr-3">
                        {getStatusIcon(message.status)}
                      </div>
                      <div>
                        <h3 className="text-gray-900 truncate max-w-[200px]">
                          {message.customer}
                        </h3>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(message.date)}
                    </div>
                  </div>

                  <div className="mt-1 flex justify-between">
                    <div className="flex items-center">
                      <span className="font-semibold text-gray-800 mr-2">
                        {message.subject}
                      </span>
                      <span className="text-gray-500 text-sm truncate max-w-[200px]">
                        {message.preview}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {message.attachments > 0 && (
                        <span className="text-gray-400 text-sm flex items-center">
                          <FaPaperclip className="mr-1" /> {message.attachments}
                        </span>
                      )}
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(
                          message.priority
                        )}`}
                      >
                        {message.priority}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Panel - Message Detail */}
        {selectedMessage && (
          <div className="hidden md:flex flex-col flex-1 bg-white rounded-xl shadow-lg">
            <div className="p-4 border-b flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {selectedMessage.subject}
                </h2>
                <div className="flex items-center mt-1">
                  <span className="font-medium text-gray-700 mr-2">
                    {selectedMessage.customer}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(
                      selectedMessage.priority
                    )}`}
                  >
                    {selectedMessage.priority}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleReadStatus(selectedMessage.id)}
                  className="p-2 rounded-full hover:bg-gray-100"
                  title={
                    selectedMessage.status === "unread"
                      ? "Mark as read"
                      : "Mark as unread"
                  }
                >
                  {selectedMessage.status === "unread" ? (
                    <FaEnvelopeOpen />
                  ) : (
                    <FaEnvelope />
                  )}
                </button>
                <button
                  onClick={() => toggleStar(selectedMessage.id)}
                  className="p-2 rounded-full hover:bg-gray-100"
                  title={selectedMessage.starred ? "Unstar" : "Star"}
                >
                  {selectedMessage.starred ? (
                    <FaStar className="text-yellow-500" />
                  ) : (
                    <FaRegStar />
                  )}
                </button>
                <button
                  onClick={() => closeMessage(selectedMessage.id)}
                  className="p-2 rounded-full hover:bg-gray-100"
                  title="Close conversation"
                >
                  <FaCheckCircle />
                </button>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            {/* Message Thread */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {selectedMessage.thread.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-6 ${
                    msg.sender === "Admin Support" ? "ml-8" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10 flex items-center justify-center">
                        <FaUserCircle className="text-gray-500 text-xl" />
                      </div>
                    </div>
                    <div
                      className={`flex-1 ${
                        msg.sender === "Admin Support"
                          ? "bg-blue-100"
                          : "bg-white"
                      } rounded-lg p-4 shadow-sm`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold">{msg.sender}</span>
                        <span className="text-sm text-gray-500 flex items-center">
                          <FaClock className="mr-1" />{" "}
                          {formatDate(msg.timestamp)}
                        </span>
                      </div>
                      <p className="text-gray-700">{msg.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Reply Box */}
            <div className="p-4 border-t">
              <div className="flex items-center mb-2">
                <span className="font-medium mr-4">Reply as:</span>
                <div className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                  <span className="mr-2">Admin Support</span>
                  <FaCog className="text-gray-500" />
                </div>
              </div>
              <textarea
                className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type your reply here..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              ></textarea>
              <div className="flex justify-between items-center mt-2">
                <div className="flex gap-2">
                  <button className="p-2 rounded-full hover:bg-gray-100">
                    <FaPaperclip />
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-100">
                    <FaRegStar />
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                    onClick={() => setReplyText("")}
                  >
                    Discard
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                    onClick={sendReply}
                  >
                    <FaReply className="mr-2" />
                    Send Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Compose Modal */}
      {isComposing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-bold">Compose New Message</h3>
              <button
                onClick={() => setIsComposing(false)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <FaTimes />
              </button>
            </div>

            <div className="p-4">
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">To:</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter customer email"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Subject:</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter message subject"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Message:</label>
                <textarea
                  className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type your message here..."
                ></textarea>
              </div>

              <div className="flex justify-between">
                <div className="flex gap-2">
                  <button className="p-2 rounded-full hover:bg-gray-100">
                    <FaPaperclip />
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                    onClick={() => setIsComposing(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                    onClick={() => setIsComposing(false)}
                  >
                    <FaEnvelope className="mr-2" />
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllMessage;
