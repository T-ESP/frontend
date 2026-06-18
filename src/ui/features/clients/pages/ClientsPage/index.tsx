import { useState, useEffect } from "react";
import { FiMessageSquare, FiUserPlus, FiSearch, FiMail, FiPhone, FiDownload, FiRefreshCw, FiMoreVertical, FiGift, FiPlus, FiMinus } from "react-icons/fi";
import { KpiStatCard, topNDistribution } from "@/ui/components/common/KpiStatCard/KpiStatCard";
import { Input } from "@/components/ui/input";
import { loyaltyService } from "@/infrastructure/api/services/loyaltyService";
import type { LoyaltyUserStats } from "@/domain/models/Loyalty";

const mockClients = [
  {
    id: 1,
    name: "Jason Price",
    email: "kulhman.jeremy@yahoo.com",
    phone: "+33 6 12 34 56 78",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    orders: 24,
    totalSpent: 4520,
    status: "Active"
  },
  {
    id: 2,
    name: "Duane Dean",
    email: "rusty.bednar@wind.biz",
    phone: "+33 6 23 45 67 89",
    avatar: "https://randomuser.me/api/portraits/men/65.jpg",
    orders: 18,
    totalSpent: 3280,
    status: "Active"
  },
  {
    id: 3,
    name: "Jonathan Barker",
    email: "cora.haley@quinn.biz",
    phone: "+33 6 34 56 78 90",
    avatar: "https://randomuser.me/api/portraits/men/91.jpg",
    orders: 32,
    totalSpent: 6890,
    status: "VIP"
  },
  {
    id: 4,
    name: "Rosie Glover",
    email: "lockman.manuj@gmail.com",
    phone: "+33 6 45 67 89 01",
    avatar: "https://randomuser.me/api/portraits/women/55.jpg",
    orders: 12,
    totalSpent: 1950,
    status: "Active"
  },
  {
    id: 5,
    name: "Patrick Greer",
    email: "peralta.ehrman@wiso.net",
    phone: "+33 6 56 78 90 12",
    avatar: "https://randomuser.me/api/portraits/men/38.jpg",
    orders: 8,
    totalSpent: 1120,
    status: "Inactive"
  },
  {
    id: 6,
    name: "Darrell Ortega",
    email: "chaya.shield@emjay.info",
    phone: "+33 6 67 89 01 23",
    avatar: "https://randomuser.me/api/portraits/men/33.jpg",
    orders: 45,
    totalSpent: 12450,
    status: "VIP"
  },
];

interface AdjustModalState {
  clientId: number;
  clientName: string;
  currentPoints: number;
}

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [loyaltyStats, setLoyaltyStats] = useState<Record<number, LoyaltyUserStats>>({});
  const [adjustModal, setAdjustModal] = useState<AdjustModalState | null>(null);
  const [adjustAmount, setAdjustAmount] = useState("");
  const [adjustReason, setAdjustReason] = useState("");
  const [adjusting, setAdjusting] = useState(false);
  const [adjustError, setAdjustError] = useState<string | null>(null);

  useEffect(() => {
    mockClients.forEach((client) => {
      loyaltyService
        .getUserStats(client.id)
        .then((stats) =>
          setLoyaltyStats((prev) => ({ ...prev, [client.id]: stats }))
        )
        .catch(() => {
          // silently ignore if loyalty stats unavailable for a client
        });
    });
  }, []);

  const filteredClients = mockClients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === "All Status" || client.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const totalClients = mockClients.length;
  const vipCount = mockClients.filter((c) => c.status === "VIP").length;
  const activeCount = mockClients.filter((c) => c.status === "Active").length;
  const totalSpent = mockClients.reduce((s, c) => s + c.totalSpent, 0);
  const formatCurrency = (v: number) =>
    new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(v);

  const openAdjustModal = (client: typeof mockClients[0]) => {
    setAdjustModal({
      clientId: client.id,
      clientName: client.name,
      currentPoints: loyaltyStats[client.id]?.total_points ?? 0,
    });
    setAdjustAmount("");
    setAdjustReason("");
    setAdjustError(null);
  };

  const handleAdjustPoints = async () => {
    if (!adjustModal) return;
    const pts = parseInt(adjustAmount, 10);
    if (isNaN(pts) || pts === 0) {
      setAdjustError("Enter a non-zero integer (positive to add, negative to deduct).");
      return;
    }
    setAdjusting(true);
    setAdjustError(null);
    try {
      const updated = await loyaltyService.adjustPoints(adjustModal.clientId, {
        points: pts,
        reason: adjustReason || undefined,
      });
      setLoyaltyStats((prev) => ({ ...prev, [adjustModal.clientId]: updated }));
      setAdjustModal(null);
    } catch {
      setAdjustError("Failed to adjust points. Please try again.");
    } finally {
      setAdjusting(false);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KpiStatCard
          title="Total clients"
          value={totalClients.toString()}
          description="dans la base"
          chartData={topNDistribution(mockClients, (c) => c.orders, 7)}
          chartType="bar"
        />
        <KpiStatCard
          title="Clients VIP"
          value={vipCount.toString()}
          description="clients premium"
          chartData={topNDistribution(
            mockClients.filter((c) => c.status === "VIP"),
            (c) => c.totalSpent,
            7,
          )}
          chartType="line"
        />
        <KpiStatCard
          title="Clients actifs"
          value={activeCount.toString()}
          description="actifs ce mois"
          chartData={topNDistribution(
            mockClients.filter((c) => c.status === "Active"),
            (c) => c.orders,
            7,
          )}
          chartType="bar"
        />
        <KpiStatCard
          title="Total dépensé"
          value={formatCurrency(totalSpent)}
          description="cumul tous clients"
          chartData={topNDistribution(mockClients, (c) => c.totalSpent, 7)}
          chartType="line"
        />
      </div>

      {/* Header Section */}
      <div className="bg-card border border-border shadow-sm rounded-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h3 className="text-xl font-bold text-foreground">Client Management</h3>
            <p className="text-sm text-muted-foreground mt-0.5">{filteredClients.length} clients</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground transition-colors bg-card border border-border rounded-lg hover:bg-muted">
              <FiRefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700">
              <FiDownload className="w-4 h-4" />
              Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700">
              <FiUserPlus className="w-4 h-4" />
              Add Client
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="px-6 py-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <FiSearch className="absolute w-5 h-5 text-muted-foreground/70 -translate-y-1/2 left-3 top-1/2" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by client name or email..."
                className="h-10 pl-10"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2.5 text-sm font-medium bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-border transition-all cursor-pointer min-w-40"
            >
              <option value="All Status">All Status</option>
              <option value="Active">✓ Active</option>
              <option value="VIP">⭐ VIP</option>
              <option value="Inactive">✗ Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Clients List */}
      <div className="space-y-3">
        {filteredClients.map((client) => {
          const loyalty = loyaltyStats[client.id];
          return (
            <div
              key={client.id}
              className="transition-all duration-300 bg-card border border-border rounded-lg shadow-sm hover:shadow-md hover:border-l-4 hover:border-l-purple-500 group"
            >
              <div className="flex items-center gap-4 p-4">
                <img
                  src={client.avatar}
                  alt={client.name}
                  className="w-12 h-12 border-2 border-border rounded-full"
                />

                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold leading-tight text-foreground transition-colors group-hover:text-purple-600">
                    {client.name}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <FiMail className="w-3.5 h-3.5 text-muted-foreground/70" />
                      <span className="text-sm">{client.email}</span>
                    </div>
                    <span className="text-muted-foreground/60">•</span>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <FiPhone className="w-3.5 h-3.5 text-muted-foreground/70" />
                      <span className="text-sm">{client.phone}</span>
                    </div>
                  </div>
                  {loyalty && (
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs text-purple-600 font-mono bg-purple-50 px-2 py-0.5 rounded">
                        {loyalty.total_points} pts
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center min-w-20">
                    <p className="text-lg font-bold text-foreground">{client.orders}</p>
                    <p className="text-xs text-muted-foreground">Orders</p>
                  </div>
                  <div className="text-center min-w-25">
                    <p className="text-lg font-bold text-foreground">{client.totalSpent.toLocaleString()} €</p>
                    <p className="text-xs text-muted-foreground">Total Spent</p>
                  </div>

                  {/* Loyalty points */}
                  <div className="text-center min-w-20">
                    <div className="flex items-center justify-center gap-1">
                      <FiGift className="w-3.5 h-3.5 text-purple-400" />
                      <p className="text-lg font-bold text-purple-700">
                        {loyalty !== undefined ? loyalty.total_points.toLocaleString() : "—"}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">Points</p>
                  </div>

                  <span
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                      client.status === "VIP"
                        ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30"
                        : client.status === "Active"
                        ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                        : "bg-muted text-muted-foreground border border-border"
                    }`}
                  >
                    {client.status === "VIP" && "⭐ "}
                    {client.status}
                  </span>
                  <button
                    onClick={() => openAdjustModal(client)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-600 transition-colors rounded-lg bg-purple-50 hover:bg-purple-100"
                    title="Adjust loyalty points"
                  >
                    <FiGift className="w-4 h-4" />
                    Points
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-600 transition-colors rounded-lg bg-purple-50 hover:bg-purple-100">
                    <FiMessageSquare className="w-4 h-4" />
                    Message
                  </button>
                  <button className="p-2 text-muted-foreground transition-colors rounded-lg hover:bg-muted">
                    <FiMoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Adjust Points Modal */}
      {adjustModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-card rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
            <h4 className="text-lg font-bold text-foreground mb-1">Adjust Loyalty Points</h4>
            <p className="text-sm text-muted-foreground mb-5">
              {adjustModal.clientName} — current balance:{" "}
              <strong className="text-purple-700">{adjustModal.currentPoints} pts</strong>
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                  Points adjustment
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setAdjustAmount((prev) => {
                        const n = parseInt(prev || "0", 10);
                        return String(Math.abs(n) > 0 ? -Math.abs(n) : n);
                      })
                    }
                    className="flex items-center justify-center w-10 h-10 border border-red-500/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors shrink-0"
                    title="Deduct points"
                  >
                    <FiMinus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    value={adjustAmount}
                    onChange={(e) => setAdjustAmount(e.target.value)}
                    placeholder="e.g. 50 to add, -20 to deduct"
                    className="flex-1 px-4 py-2.5 text-sm bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-card transition-all"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setAdjustAmount((prev) => {
                        const n = parseInt(prev || "0", 10);
                        return String(Math.abs(n));
                      })
                    }
                    className="flex items-center justify-center w-10 h-10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-500/10 transition-colors shrink-0"
                    title="Add points"
                  >
                    <FiPlus className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground/70 mt-1">Positive number adds points, negative deducts.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                  Reason <span className="text-muted-foreground/70 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="e.g. Birthday bonus, correction..."
                  className="w-full px-4 py-2.5 text-sm bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-card transition-all"
                />
              </div>

              {adjustError && (
                <p className="text-sm text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                  {adjustError}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setAdjustModal(null)}
                className="px-4 py-2 text-sm font-medium text-muted-foreground bg-card border border-border rounded-lg hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAdjustPoints}
                disabled={adjusting}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {adjusting ? "Saving..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
