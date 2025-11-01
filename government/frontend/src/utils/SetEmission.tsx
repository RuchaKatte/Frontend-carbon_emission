import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

type Company = {
  id: number;
  name: string;
  sector: string;
  current: number;
  limit: number;
};

const initialCompanies: Company[] = [
  { id: 1, name: "EcoTech Solutions", sector: "Manufacturing", current: 480, limit: 500 },
  { id: 2, name: "GreenDrive Motors", sector: "Transportation", current: 850, limit: 800 },
  { id: 3, name: "Solaris Energy", sector: "Energy", current: 700, limit: 1200 },
  { id: 4, name: "BioFuel Innovations", sector: "Agriculture", current: 450, limit: 400 },
  { id: 5, name: "AquaPure Systems", sector: "Manufacturing", current: 780, limit: 800 },
  { id: 6, name: "CarbonCapture Inc.", sector: "Energy", current: 950, limit: 1000 },
  { id: 7, name: "HeavyMetal Corp", sector: "Manufacturing", current: 1500, limit: 1200 },
  { id: 8, name: "AeroLogistics", sector: "Transportation", current: 750, limit: 800 },
];

export default function EmissionDashboard(): JSX.Element {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "compliant" | "exceeded" | "approaching">("all");
  const [sectorFilter, setSectorFilter] = useState<string>("all");
  const [showFilter, setShowFilter] = useState(false);
  const [showNewLimitModal, setShowNewLimitModal] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [draftName, setDraftName] = useState("");
  const [draftValue, setDraftValue] = useState<number | "">("");

  const sectors = useMemo(() => {
    const s = new Set<string>(companies.map((c) => c.sector));
    return ["all", ...Array.from(s)];
  }, [companies]);

  const statusOf = (c: Company) => {
    if (c.current > c.limit) return "Exceeded";
    const ratio = c.current / c.limit;
    if (ratio >= 0.85) return "Approaching";
    return "Compliant";
  };

  const filtered = companies.filter((c) => {
    if (statusFilter !== "all") {
      const st = statusOf(c).toLowerCase();
      if (statusFilter === "compliant" && st !== "compliant") return false;
      if (statusFilter === "exceeded" && st !== "exceeded") return false;
      if (statusFilter === "approaching" && st !== "approaching") return false;
    }
    if (sectorFilter !== "all" && c.sector !== sectorFilter) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const exportCSV = () => {
    const headers = ["Company","Sector","Current Emissions","Emission Limit","Status"];
    const rows = companies.map((c) => [c.name, c.sector, c.current.toString(), c.limit.toString(), statusOf(c)]);
    const csv = [headers, ...rows].map((r) => r.map((cell) => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "companies_emissions.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const startEdit = (c: Company) => {
    setEditingId(c.id);
    setDraftName(c.name);
    setDraftValue(c.current);
  };
  const cancelEdit = () => {
    setEditingId(null);
    setDraftName("");
    setDraftValue("");
  };
  const saveEdit = () => {
    if (editingId == null) return;
    setCompanies((prev) => prev.map((p) => p.id === editingId ? { ...p, name: draftName, current: Number(draftValue) } : p));
    cancelEdit();
  };

  const [newLimitSector, setNewLimitSector] = useState<string>("Manufacturing");
  const [newLimitValue, setNewLimitValue] = useState<number | "">("");
  const [newLimitCompany, setNewLimitCompany] = useState<string>(""); 
  const applyNewLimits = () => {
    if (!newLimitValue) return;
    setCompanies((prev) => prev.map((c) => c.sector === newLimitSector ? { ...c, limit: Number(newLimitValue) } : c));
    setShowNewLimitModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-lime-50 flex text-slate-700 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white/80 backdrop-blur-lg shadow-lg p-6 rounded-r-2xl">
        <h2 className="text-2xl font-bold mb-8 text-emerald-700 tracking-wide">🌱 Emission Tracker</h2>
        <div className="space-y-2">
          <Link to="/government"><SidebarItem label="Overview" icon="home" /></Link>
          <SidebarItem label="Company Reports" icon="building" />
          <SidebarItem label="Transport Emissions" icon="truck" />
          <SidebarItem label="Verification Requests" icon="shield" />
          <SidebarItem label="Set Emission Limits" icon="chart" active />
          <SidebarItem label="Alerts" icon="bell" />
          <SidebarItem label="Settings" icon="cog" />
        </div>
      </aside>

      {/* Main Section */}
      <main className="flex-1 p-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-emerald-700">Set Emission Limit</h1>
          <div className="flex items-center gap-4">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-emerald-200 focus:ring-2 focus:ring-emerald-400 rounded-full px-4 py-2 w-80 text-slate-700 placeholder:text-slate-400"
              placeholder="🔍 Search companies..."
            />
            <button onClick={exportCSV} className="px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-medium rounded-lg shadow-sm transition-all">
              Export CSV
            </button>
            <button onClick={() => setShowFilter(!showFilter)} className="px-4 py-2 bg-lime-100 hover:bg-lime-200 text-lime-700 font-medium rounded-lg shadow-sm transition-all">
              Filter
            </button>
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-lg shadow-inner">👤</div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-12 gap-8">
          {/* Sector Progress */}
          <section className="col-span-4 bg-white rounded-2xl shadow-lg p-6 border border-emerald-100">
            <h3 className="text-lg font-semibold mb-6 text-emerald-700">Emission Limits by Sector</h3>
            <SectorRow name="Manufacturing" used={5000} total={10000} />
            <SectorRow name="Transportation" used={3000} total={8000} />
            <SectorRow name="Energy" used={6500} total={12000} />
            <SectorRow name="Agriculture" used={2000} total={5000} />
            <div className="mt-8">
              <button
                onClick={() => setShowNewLimitModal(true)}
                className="w-full bg-gradient-to-r from-emerald-600 to-lime-500 hover:opacity-90 text-white py-3 rounded-xl font-medium transition-all shadow-md"
              >
                + Set New Limits
              </button>
            </div>
          </section>

          {/* Company Data */}
          <section className="col-span-8 bg-white rounded-2xl shadow-lg p-6 border border-emerald-100">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold text-emerald-700">Company Emission Data</h3>
            </div>

            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-slate-500 border-b pb-3">
              <div className="col-span-4">Company Name</div>
              <div className="col-span-2">Sector</div>
              <div className="col-span-2">Current (tons)</div>
              <div className="col-span-2">Limit (tons)</div>
              <div className="col-span-2">Status</div>
            </div>

            <div className="space-y-4 mt-4">
              {filtered.map((c) => (
                <div key={c.id} className="grid grid-cols-12 items-center gap-4 py-3 border-b hover:bg-emerald-50/50 rounded-lg transition-all">
                  <div className="col-span-4">
                    {editingId === c.id ? (
                      <div className="flex gap-2">
                        <input
                          className="border border-emerald-300 focus:ring-2 focus:ring-emerald-400 rounded px-2 py-1 flex-1"
                          value={draftName}
                          onChange={(e) => setDraftName(e.target.value)}
                        />
                        <div className="flex gap-1">
                          <button onClick={saveEdit} className="px-2 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700">Save</button>
                          <button onClick={cancelEdit} className="px-2 py-1 border rounded hover:bg-slate-100">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-slate-700">{c.name}</div>
                        <button onClick={() => startEdit(c)} className="px-2 py-1 text-xs text-emerald-600 hover:bg-emerald-100 rounded">
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="col-span-2 text-sm">{c.sector}</div>
                  <div className="col-span-2 text-sm font-semibold text-slate-700">{c.current}</div>
                  <div className="col-span-2 text-sm font-semibold text-slate-700">{c.limit}</div>
                  <div className="col-span-2">
                    <StatusPill status={statusOf(c)} />
                    <div className="mt-2"><RangeBar current={c.current} limit={c.limit} /></div>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && <div className="p-4 text-center text-gray-400">No companies match filters</div>}
            </div>
          </section>
        </div>
      </main>

      {/* Modal */}
      {showNewLimitModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl w-96 p-6">
            <h4 className="text-lg font-semibold mb-4 text-emerald-700">Set New Limits</h4>
            <label className="block text-sm mb-2 text-slate-600">Company Name</label>
            <input
              type="text"
              value={newLimitCompany || ""}
              onChange={(e) => setNewLimitCompany(e.target.value === "" ? "" : e.target.value)}
              className="w-full border border-emerald-200 focus:ring-2 focus:ring-emerald-400 rounded px-2 py-1 mb-4"
            />
            <label className="block text-sm text-slate-600">Sector</label>
            <select
              value={newLimitSector}
              onChange={(e) => setNewLimitSector(e.target.value)}
              className="w-full border border-emerald-200 focus:ring-2 focus:ring-emerald-400 rounded px-2 py-1 mb-3"
            >
              {Array.from(new Set(companies.map((c) => c.sector))).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <label className="block text-sm text-slate-600">New limit (tons)</label>
            <input
              type="number"
              value={newLimitValue || ""}
              onChange={(e) => setNewLimitValue(e.target.value === "" ? "" : Number(e.target.value))}
              className="w-full border border-emerald-200 focus:ring-2 focus:ring-emerald-400 rounded px-2 py-1 mb-4"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowNewLimitModal(false)} className="px-4 py-1 rounded hover:bg-slate-100">Cancel</button>
              <button onClick={applyNewLimits} className="px-4 py-1 bg-gradient-to-r from-emerald-600 to-lime-500 text-white rounded hover:opacity-90 shadow-md">Apply</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SidebarItem({ label, icon, active = false }: { label: string; icon: string; active?: boolean }) {
  const icons: Record<string, string> = {
    home: "🏠",
    building: "🏢",
    truck: "🚚",
    shield: "🛡️",
    chart: "📊",
    bell: "🔔",
    cog: "⚙️",
  };
  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
        active
          ? "bg-gradient-to-r from-emerald-100 to-lime-100 text-emerald-800 font-semibold shadow-sm"
          : "hover:bg-emerald-50 text-slate-600"
      }`}
    >
      <div className="w-8 h-8 flex items-center justify-center text-lg">{icons[icon] ?? "🔹"}</div>
      <div>{label}</div>
    </div>
  );
}

function SectorRow({ name, used, total }: { name: string; used: number; total: number }) {
  const pct = Math.min(100, Math.round((used / total) * 100));
  return (
    <div className="mb-5">
      <div className="flex justify-between mb-1">
        <div className="font-medium text-slate-700">{name}</div>
        <div className="text-sm text-slate-500">{used} / {total} tons</div>
      </div>
      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: `linear-gradient(90deg,#059669,#a3e635)` }} />
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    Compliant: { label: "Compliant", cls: "bg-emerald-100 text-emerald-700" },
    Exceeded: { label: "Exceeded", cls: "bg-red-100 text-red-700" },
    Approaching: { label: "Approaching Limit", cls: "bg-yellow-100 text-yellow-700" },
  };
  const r = map[status] ?? { label: status, cls: "bg-gray-100 text-gray-700" };
  return <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${r.cls}`}>{r.label}</span>;
}

function RangeBar({ current, limit }: { current: number; limit: number }) {
  const pct = Math.min(100, Math.round((current / limit) * 100));
  const color =
    pct > 100
      ? "linear-gradient(90deg,#ef4444,#fca5a5)"
      : pct >= 85
      ? "linear-gradient(90deg,#f59e0b,#fde68a)"
      : "linear-gradient(90deg,#10b981,#6ee7b7)";
  return (
    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}
