import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { CheckCircle, Clock, Truck, Leaf } from "lucide-react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { useNavigate } from "react-router-dom"; // ✅ added

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const EmissionTracker: React.FC = () => {
  const [chartData, setChartData] = useState<number[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const navigate = useNavigate(); // ✅ added

  useEffect(() => {
    setChartData(Array.from({ length: 6 }, () => Math.floor(Math.random() * 200) + 50));
    setLocations([
      { id: 1, name: "Delhi", coords: [28.6139, 77.209] },
      { id: 2, name: "Mumbai", coords: [19.076, 72.8777] },
      { id: 3, name: "Pune", coords: [18.5204, 73.8567] },
    ]);
  }, []);

  const data = {
    labels: ["Jan", "Mar", "May", "Jul", "Sep", "Nov"],
    datasets: [
      {
        label: "Verified vs Unverified Emissions",
        data: chartData,
        borderColor: "rgba(22,163,74,1)",
        backgroundColor: "rgba(22,163,74,0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: "#eee" }, beginAtZero: true },
    },
  };

  const icon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [28, 28],
  });

  const navItems = [
    { label: "Overview", path: "/overview" },
    { label: "Company Reports", path: "/company-reports" },
    { label: "Transport Emissions", path: "/transport-emissions" },
    { label: "Verification Requests", path: "/verification-requests" },
    { label: "Set Emission Limits", path: "/set-emission-limits" },
    { label: "Alerts", path: "/alerts" },
    { label: "Queries", path: "/answering-query" },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 font-[Inter]">
      {/* Sidebar */}
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
                onClick={() => navigate(item.path)} // ✅ Added navigation
                className={`cursor-pointer rounded-lg px-3 py-2 text-gray-700 transition-all duration-300 ${
                  item.label === "Overview"
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

      {/* Main Content */}
      <main className="flex-1 p-8 space-y-6 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-semibold text-gray-800"
          >
            Dashboard
          </motion.h2>
          <input
            type="text"
            placeholder="Search"
            className="border px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>

        {/* Summary Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Total Verified Emissions", value: 12500, suffix: " tons", icon: <CheckCircle className="text-green-600" /> },
            { title: "Pending Company Reports", value: 23, suffix: "", icon: <Clock className="text-yellow-500" /> },
            { title: "Transport Sector Emissions", value: 4800, suffix: " tons", icon: <Truck className="text-gray-700" /> },
            { title: "Approved Carbon Offsets", value: 3200, suffix: " tons", icon: <Leaf className="text-green-500" /> },
          ].map((card, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.03 }}
              className="bg-gradient-to-br from-white to-green-50 p-6 rounded-2xl shadow-md hover:shadow-xl flex items-center gap-4 transition-shadow duration-300"
            >
              <div className="p-3 bg-emerald-100 rounded-full shadow-inner">{card.icon}</div>
              <div>
                <h3 className="text-gray-600 font-medium">{card.title}</h3>
                <p className="text-2xl font-semibold text-emerald-700">
                  <CountUp end={card.value} duration={2} /> {card.suffix}
                </p>
              </div>
            </motion.div>
          ))}
        </section>

        {/* Line Chart */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white p-6 rounded-2xl shadow-md h-64"
        >
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Verified vs Unverified Emissions</h3>
          <div className="h-48">
            <Line data={data} options={options} />
          </div>
        </motion.section>

        {/* Map Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-white p-6 rounded-2xl shadow-md h-96"
        >
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Emission Map</h3>
          <MapContainer
            center={[22.9734, 78.6569]}
            zoom={5}
            className="w-full h-[400px] rounded-2xl shadow-inner"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {locations.map((loc) => (
              <Marker key={loc.id} position={loc.coords} icon={icon}>
                <Popup>
                  <strong>{loc.name}</strong> <br /> Emission hotspot
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </motion.section>

        {/* Recent Submissions Table */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white p-6 rounded-2xl shadow-md"
        >
          <h3 className="text-2xl font-bold mb-4 text-gray-700">Recent Company Submissions</h3>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-600 text-xl font-bold border-b">
                <th className="py-2">Company Name</th>
                <th className="py-2">Emission Value</th>
                <th className="py-2">Verification Status</th>
                <th className="py-2">Date</th>
                <th className="py-2">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-0.5xl">
              {[
                { name: "EcoTech Solutions", value: "1,200 tons", status: "Verified", date: "2024-07-20", action: "View" },
                { name: "GreenDrive Motors", value: "850 tons", status: "Pending", date: "2024-07-18", action: "Approve" },
                { name: "Solaris Energy", value: "1,500 tons", status: "Verified", date: "2024-07-15", action: "View" },
                { name: "BioFuel Innovations", value: "600 tons", status: "Pending", date: "2024-07-12", action: "Approve" },
                { name: "AquaPure Systems", value: "900 tons", status: "Verified", date: "2024-07-10", action: "View" },
              ].map((row, idx) => (
                <motion.tr
                  key={idx}
                  whileHover={{ backgroundColor: "#f0fdf4" }}
                >
                  <td className="py-2">{row.name}</td>
                  <td>{row.value}</td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        row.status === "Verified"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td>{row.date}</td>
                  <td>
                    <button className="text-emerald-600 hover:underline">{row.action}</button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.section>
      </main>
    </div>
  );
};

export default EmissionTracker;
