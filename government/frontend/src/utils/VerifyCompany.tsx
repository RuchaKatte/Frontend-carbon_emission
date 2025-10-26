import React, { useState } from "react";
import { motion } from "framer-motion";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom"; // If using React Router

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
    <div className="flex min-h-screen bg-green-50">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white shadow-xl flex flex-col justify-between p-6 rounded-r-3xl">
        <div>
          <h1 className="text-2xl font-bold text-green-600 mb-2">Emission Tracker</h1>
          <p className="text-sm text-gray-400 mb-6">Admin</p>

          {/* ✅ Updated Navigation */}
          <nav className="space-y-3">
            {navItems.map((item, i) => (
              <motion.p
                key={i}
                whileHover={{ scale: 1.05, x: 4 }}
                onClick={() => navigate(item.path)}
                className={`cursor-pointer rounded-lg px-3 py-2 text-gray-700 transition-all duration-300 ${
                  item.label === "Pending Registrations"
                    ? "bg-gradient-to-r from-emerald-100 to-green-50 text-emerald-800 font-semibold"
                    : "hover:bg-green-50 hover:text-emerald-700"
                }`}
              >
                {item.label}
              </motion.p>
            ))}
          </nav>
        </div>
        <p className="text-xs text-gray-500">© 2025 EcoTrack</p>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Pending Company Registrations</h2>

          <div className="flex space-x-3">
            <input
              type="text"
              placeholder="Search by name, email, or organization"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 w-72 focus:ring-2 focus:ring-green-400"
            />
            <button
              onClick={handleExportCSV}
              className="bg-white border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded-lg flex items-center gap-2"
            >
              ⬇️ Export CSV
            </button>
            <button
              onClick={() => alert('Filter options coming soon')}
              className="bg-white border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded-lg flex items-center gap-2"
            >
              ⚙️ Filter
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-green-100 text-gray-700">
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Organization</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Days Pending</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.map((c, i) => (
                <tr key={i} className="border-t hover:bg-green-50 transition">
                  <td className="py-3 px-4">{c.name}</td>
                  <td className="py-3 px-4">{c.email}</td>
                  <td className="py-3 px-4">{c.organization}</td>
                  <td className="py-3 px-4">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">{c.role}</span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{c.daysPending} days</td>
                  <td className="py-3 px-4 flex gap-2">
                    <button
                      onClick={() => handleAction(c, "approve")}
                      className="bg-green-600 text-white px-4 py-1 rounded-lg hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(c, "reject")}
                      className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredCompanies.length === 0 && (
            <div className="text-center py-6 text-gray-500">No matching results found.</div>
          )}
        </div>

        {/* Confirmation Modal */}
        {selectedCompany && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-lg p-6 w-96">
              <h3 className="text-lg font-bold mb-3 capitalize text-center">
                Confirm {actionType}?
              </h3>
              <p className="text-gray-700 mb-3">
                <strong>Name:</strong> {selectedCompany.name}
                <br />
                <strong>Email:</strong> {selectedCompany.email}
                <br />
                <strong>Organization:</strong> {selectedCompany.organization}
                <br />
                <strong>Role:</strong> {selectedCompany.role}
              </p>

              <div className="flex justify-between mt-4">
                <button
                  onClick={() => {
                    setSelectedCompany(null);
                    setActionType(null);
                  }}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAction}
                  className={`px-4 py-2 rounded-lg text-white ${
                    actionType === "approve" ? "bg-green-600 hover:bg-green-700" : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingRegistrations;
