

import { useState } from "react"
import { Search, Filter, Eye, Edit, Trash2, AlertCircle, CheckCircle, Clock } from "lucide-react"

export default function QueryManagement() {
  const [selectedQuery, setSelectedQuery] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [activeNav, setActiveNav] = useState("Pending Registrations")

  const navItems = [
    { label: "Dashboard", path: "/" },
    { label: "Pending Registrations", path: "/pending" },
    { label: "Verified Companies", path: "/verified" },
    { label: "Reports", path: "/reports" },
    { label: "Settings", path: "/settings" },
  ]

  const queries = [
    {
      id: 1,
      company: "GreenTech Industries",
      category: "Manufacturing",
      status: "Open",
      priority: "High",
      submittedDate: "2025-01-15",
      sla: "48 hours",
      description: "Emission reduction strategy review",
    },
    {
      id: 2,
      company: "EcoEnergy Corp",
      category: "Energy",
      status: "In Progress",
      priority: "Medium",
      submittedDate: "2025-01-14",
      sla: "72 hours",
      description: "Carbon footprint assessment",
    },
    {
      id: 3,
      company: "SustainableLogistics",
      category: "Transportation",
      status: "Resolved",
      priority: "Low",
      submittedDate: "2025-01-10",
      sla: "Completed",
      description: "Fleet emission optimization",
    },
    {
      id: 4,
      company: "CleanManufacturing Ltd",
      category: "Manufacturing",
      status: "Open",
      priority: "High",
      submittedDate: "2025-01-16",
      sla: "24 hours",
      description: "Waste management compliance",
    },
    {
      id: 5,
      company: "RenewableEnergy Plus",
      category: "Energy",
      status: "In Progress",
      priority: "Medium",
      submittedDate: "2025-01-13",
      sla: "48 hours",
      description: "Solar panel efficiency audit",
    },
  ]

  const stats = [
    { label: "Total Queries", value: "24", color: "bg-emerald-50", textColor: "text-emerald-700" },
    { label: "Open", value: "8", color: "bg-blue-50", textColor: "text-blue-700" },
    { label: "In Progress", value: "12", color: "bg-amber-50", textColor: "text-amber-700" },
    { label: "Resolved", value: "4", color: "bg-green-50", textColor: "text-green-700" },
  ]

  const filteredQueries = queries.filter((query) => {
    const matchesSearch =
      query.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "All" || query.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status) => {
    switch (status) {
      case "Open":
        return <AlertCircle className="w-4 h-4" />
      case "In Progress":
        return <Clock className="w-4 h-4" />
      case "Resolved":
        return <CheckCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Open":
        return "bg-red-100 text-red-800"
      case "In Progress":
        return "bg-amber-100 text-amber-800"
      case "Resolved":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "text-red-600"
      case "Medium":
        return "text-amber-600"
      case "Low":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-slate-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white shadow-xl flex flex-col justify-between p-6 rounded-r-3xl">
        <div>
          <h1 className="text-2xl font-bold text-emerald-600 mb-2">Emission Tracker</h1>
          <p className="text-sm text-gray-400 mb-6">Admin</p>
          <nav className="space-y-3">
            {navItems.map((item, i) => (
              <p
                key={i}
                onClick={() => setActiveNav(item.label)}
                className={`cursor-pointer rounded-lg px-3 py-2 text-gray-700 transition-all duration-300 transform hover:scale-105 hover:translate-x-1 ${
                  item.label === activeNav
                    ? "bg-gradient-to-r from-emerald-100 to-green-50 text-emerald-800 font-semibold"
                    : "hover:bg-green-50 hover:text-emerald-700"
                }`}
              >
                {item.label}
              </p>
            ))}
          </nav>
        </div>
        <p className="text-xs text-gray-500">© 2025 EcoTrack</p>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* HEADER */}
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-gray-800 mb-2">Query Management</h2>
            <p className="text-gray-600">Manage and track all carbon emission queries</p>
          </div>

          {/* NOTIFICATION BANNER */}
          <div className="mb-6 bg-gradient-to-r from-emerald-50 to-green-50 border-l-4 border-emerald-500 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-emerald-900">SLA Alert</h3>
              <p className="text-sm text-emerald-700">
                3 queries are approaching their SLA deadline. Please prioritize these items.
              </p>
            </div>
          </div>

          {/* STATS BAR */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {stats.map((stat, i) => (
              <div
                key={i}
                className={`${stat.color} rounded-xl p-4 border border-emerald-100 hover:shadow-lg transition-shadow duration-300`}
              >
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* SEARCH & FILTER BAR */}
          <div className="mb-6 flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by company or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white cursor-pointer appearance-none"
              >
                <option>All</option>
                <option>Open</option>
                <option>In Progress</option>
                <option>Resolved</option>
              </select>
            </div>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="flex gap-6">
            {/* QUERY TABLE */}
            <div className="flex-1">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-emerald-50 to-green-50 border-b border-gray-200">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Company</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Category</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Priority</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">SLA</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredQueries.map((query) => (
                        <tr
                          key={query.id}
                          onClick={() => setSelectedQuery(query)}
                          className="border-b border-gray-100 hover:bg-emerald-50 transition-colors duration-200 cursor-pointer"
                        >
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{query.company}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{query.category}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(query.status)}`}
                            >
                              {getStatusIcon(query.status)}
                              {query.status}
                            </span>
                          </td>
                          <td className={`px-6 py-4 text-sm font-semibold ${getPriorityColor(query.priority)}`}>
                            {query.priority}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{query.sla}</td>
                          <td className="px-6 py-4 flex gap-2">
                            <button className="p-2 hover:bg-emerald-100 rounded-lg transition-colors duration-200">
                              <Eye className="w-4 h-4 text-emerald-600" />
                            </button>
                            <button className="p-2 hover:bg-blue-100 rounded-lg transition-colors duration-200">
                              <Edit className="w-4 h-4 text-blue-600" />
                            </button>
                            <button className="p-2 hover:bg-red-100 rounded-lg transition-colors duration-200">
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* DETAIL PANEL */}
            {selectedQuery && (
              <div className="w-80 bg-white rounded-2xl shadow-lg p-6 h-fit sticky top-8">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Query Details</h3>
                  <button
                    onClick={() => setSelectedQuery(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="border-b border-gray-200 pb-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Company</p>
                    <p className="text-sm font-semibold text-gray-900">{selectedQuery.company}</p>
                  </div>

                  <div className="border-b border-gray-200 pb-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Category</p>
                    <p className="text-sm font-semibold text-gray-900">{selectedQuery.category}</p>
                  </div>

                  <div className="border-b border-gray-200 pb-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Status</p>
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedQuery.status)}`}
                    >
                      {getStatusIcon(selectedQuery.status)}
                      {selectedQuery.status}
                    </span>
                  </div>

                  <div className="border-b border-gray-200 pb-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Priority</p>
                    <p className={`text-sm font-semibold ${getPriorityColor(selectedQuery.priority)}`}>
                      {selectedQuery.priority}
                    </p>
                  </div>

                  <div className="border-b border-gray-200 pb-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Submitted Date</p>
                    <p className="text-sm font-semibold text-gray-900">{selectedQuery.submittedDate}</p>
                  </div>

                  <div className="border-b border-gray-200 pb-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">SLA</p>
                    <p className="text-sm font-semibold text-gray-900">{selectedQuery.sla}</p>
                  </div>

                  <div className="pb-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Description</p>
                    <p className="text-sm text-gray-700">{selectedQuery.description}</p>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg transition-colors duration-200">
                      Update
                    </button>
                    <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg transition-colors duration-200">
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
