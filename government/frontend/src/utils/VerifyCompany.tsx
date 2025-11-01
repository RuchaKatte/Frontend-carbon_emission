import React, { useState } from "react";
import { motion } from "framer-motion";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";

interface Company {
  name: string;
  email: string;
  organization: string;
  role: string;
  daysPending: number;
}

const PendingRegistrations: React.FC = () => {
  const navigate = useNavigate();
  const navItems = [
    { label: "Overview", path: "/overview" },
    { label: "Company Reports", path: "/company-reports" },
    { label: "Transport Emissions", path: "/transport-emissions" },
    { label: "Verification Requests", path: "/verification-requests" },
    { label: "Set Emission Limits", path: "/set-emission-limits" },
    { label: "Alerts", path: "/alerts" },
    { label: "Settings", path: "/settings" },
  ];

  const [companies, setCompanies] = useState<Company[]>([
    { name: "John Doe", email: "john@company.com", organization: "ABC Industries", role: "INDUSTRY ADMIN", daysPending: 1 },
    { name: "Sarah Smith", email: "sarah@greentech.com", organization: "GreenTech Solutions", role: "COMPLIANCE OFFICER", daysPending: 3 },
    { name: "Michael Johnson", email: "michael@ecoworks.io", organization: "EcoWorks Inc", role: "INDUSTRY ADMIN", daysPending: 5 },
    { name: "Emily Chen", email: "emily@sustaintech.com", organization: "SustainTech Corp", role: "DATA ANALYST", daysPending: 2 },
    { name: "David Wilson", email: "david@cleanenergy.com", organization: "Clean Energy Ltd", role: "COMPLIANCE OFFICER", daysPending: 7 },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);

  const filteredCompanies = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.organization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportCSV = () => {
    const worksheet = XLSX.utils.json_to_sheet(companies);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Pending Companies");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "pending_companies.xlsx");
  };

  const handleAction = (company: Company, type: "approve" | "reject") => {
    setSelectedCompany(company);
    setActionType(type);
  };

  const confirmAction = () => {
    if (selectedCompany && actionType) {
      alert(`${selectedCompany.name} from ${selectedCompany.organization} has been ${actionType === "approve" ? "approved" : "rejected"}.`);
      setCompanies(companies.filter((c) => c.email !== selectedCompany.email));
      setSelectedCompany(null);
      setActionType(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-white font-[Inter]">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white/80 backdrop-blur-lg shadow-2xl flex flex-col justify-between p-6 rounded-r-3xl border-r border-emerald-100">
        <div>
          <h1 className="text-3xl font-extrabold text-emerald-600 mb-1 tracking-tight">
            Emission <span className="text-green-700">Tracker</span>
          </h1>
          <p className="text-sm text-gray-400 mb-6">Admin Panel</p>

          <nav className="space-y-2">
            {navItems.map((item, i) => (
              <motion.p
                key={i}
                whileHover={{ scale: 1.05, x: 6 }}
                onClick={() => navigate(item.path)}
                className="cursor-pointer rounded-lg px-3 py-2 text-gray-700 font-medium transition-all duration-300 hover:text-emerald-700 hover:bg-emerald-50"
              >
                {item.label}
              </motion.p>
            ))}
          </nav>
        </div>
        <p className="text-xs text-gray-400">© 2025 EcoTrack</p>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Pending Company Registrations
          </h2>

          <div className="flex space-x-3">
            <input
              type="text"
              placeholder="🔍 Search by name, email, or organization"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-2.5 w-80 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-sm"
            />
            <button
              onClick={handleExportCSV}
              className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-4 py-2.5 rounded-xl shadow hover:opacity-90 transition"
            >
              ⬇️ Export CSV
            </button>
            <button
              onClick={() => alert("Filter options coming soon")}
              className="bg-white border border-gray-300 hover:bg-gray-100 px-4 py-2.5 rounded-xl shadow-sm transition"
            >
              ⚙️ Filter
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden border border-emerald-100">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gradient-to-r from-emerald-100 to-green-50 text-gray-800">
              <tr>
                <th className="py-3.5 px-5 font-semibold">Name</th>
                <th className="py-3.5 px-5 font-semibold">Email</th>
                <th className="py-3.5 px-5 font-semibold">Organization</th>
                <th className="py-3.5 px-5 font-semibold">Role</th>
                <th className="py-3.5 px-5 font-semibold">Days Pending</th>
                <th className="py-3.5 px-5 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.map((c, i) => (
                <tr
                  key={i}
                  className="border-t border-gray-100 hover:bg-emerald-50/60 transition-all duration-200"
                >
                  <td className="py-3 px-5 text-gray-700 font-medium">{c.name}</td>
                  <td className="py-3 px-5 text-gray-600">{c.email}</td>
                  <td className="py-3 px-5 text-gray-700">{c.organization}</td>
                  <td className="py-3 px-5">
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                      {c.role}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-gray-600">{c.daysPending} days</td>
                  <td className="py-3 px-5 flex justify-center gap-3">
                    <button
                      onClick={() => handleAction(c, "approve")}
                      className="bg-emerald-600 text-white px-4 py-1.5 rounded-lg hover:bg-emerald-700 transition shadow-sm"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(c, "reject")}
                      className="bg-red-500 text-white px-4 py-1.5 rounded-lg hover:bg-red-600 transition shadow-sm"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredCompanies.length === 0 && (
            <div className="text-center py-8 text-gray-500 font-medium">
              No matching results found.
            </div>
          )}
        </div>

        {/* Confirmation Modal */}
        {selectedCompany && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-96 border border-emerald-100"
            >
              <h3 className="text-xl font-bold text-gray-800 text-center mb-4 capitalize">
                Confirm {actionType}?
              </h3>
              <div className="text-gray-700 text-sm mb-4 space-y-1">
                <p><strong>Name:</strong> {selectedCompany.name}</p>
                <p><strong>Email:</strong> {selectedCompany.email}</p>
                <p><strong>Organization:</strong> {selectedCompany.organization}</p>
                <p><strong>Role:</strong> {selectedCompany.role}</p>
              </div>

              <div className="flex justify-between mt-4">
                <button
                  onClick={() => {
                    setSelectedCompany(null);
                    setActionType(null);
                  }}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAction}
                  className={`px-4 py-2 rounded-lg text-white font-medium shadow ${
                    actionType === "approve"
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingRegistrations;
