import { useState, useEffect } from "react";
import { useAuth } from "@/App";
import Sidebar from "@/components/Sidebar";
import OpportunityCard from "@/components/OpportunityCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Search, Plus, FileText, Users, TrendingUp, GitBranch, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SECTORS = ["Agriculture", "Marine / Frozen Foods", "Pharma", "Special Chemicals", "Value-Added Agri Products"];
const REGIONS = ["Africa", "Middle East", "Europe"];
const STATUSES = ["Active", "Draft", "Matched", "Closed"];

export default function AdminDashboard() {
  const { authAxios } = useAuth();
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sectorFilter, setSectorFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [hsnCode, setHsnCode] = useState("");
  const [discoveryProduct, setDiscoveryProduct] = useState("");
  const [discoveryCountry, setDiscoveryCountry] = useState("");
  const [discoveryLoading, setDiscoveryLoading] = useState(false);

  const handleDiscovery = async () => {
    if (!hsnCode || !discoveryProduct) {
      toast.error("Please enter an HSN Code and Product Name");
      return;
    }
    setDiscoveryLoading(true);
    toast.info("Paperclip Agent Dispatched. Browsing global trade logs...", { duration: 3500 });
    
    try {
      await authAxios.post("/discovery/start", {
        hsn_code: hsnCode,
        product_name: discoveryProduct,
        target_countries: discoveryCountry ? [discoveryCountry] : []
      });
      
      // Simulate waiting for agent to finish
      setTimeout(() => {
        toast.success("Agent discovered new buyers! Updating ecosystem.");
        fetchData();
        setDiscoveryLoading(false);
        setHsnCode("");
        setDiscoveryProduct("");
        setDiscoveryCountry("");
      }, 3500);
      
    } catch (e) {
      toast.error("Failed to dispatch agent");
      setDiscoveryLoading(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [oppRes, statsRes] = await Promise.all([
        authAxios.get("/opportunities"),
        authAxios.get("/stats")
      ]);
      setOpportunities(oppRes.data);
      setStats(statsRes.data);
    } catch (e) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch = opp.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          opp.source_country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = sectorFilter === "all" || opp.sector === sectorFilter;
    const matchesRegion = regionFilter === "all" || opp.region === regionFilter;
    const matchesStatus = statusFilter === "all" || opp.status === statusFilter;
    return matchesSearch && matchesSector && matchesRegion && matchesStatus;
  });

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content bg-offwhite">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold text-slate-900 tracking-tight">
                Command Center
              </h1>
              <p className="mt-1 text-slate-500">Trade opportunity management dashboard</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={fetchData}
                data-testid="refresh-btn"
                className="border-slate-200"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button
                onClick={() => navigate("/admin/create-opportunity")}
                data-testid="new-opportunity-btn"
                className="bg-navy hover:bg-charcoal text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Opportunity
              </Button>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8">
          {/* Stats Grid */}
          {stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="premium-card p-6 rounded-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-sm flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stats.total_opportunities}</p>
                    <p className="text-xs uppercase tracking-wider text-slate-500 font-medium">Total Opportunities</p>
                  </div>
                </div>
              </div>
              <div className="premium-card p-6 rounded-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-sm flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stats.active_opportunities}</p>
                    <p className="text-xs uppercase tracking-wider text-slate-500 font-medium">Active</p>
                  </div>
                </div>
              </div>
              <div className="premium-card p-6 rounded-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-50 rounded-sm flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stats.total_exporters}</p>
                    <p className="text-xs uppercase tracking-wider text-slate-500 font-medium">Exporters</p>
                  </div>
                </div>
              </div>
              <div className="premium-card p-6 rounded-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-50 rounded-sm flex items-center justify-center">
                    <GitBranch className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stats.total_deals}</p>
                    <p className="text-xs uppercase tracking-wider text-slate-500 font-medium">Active Deals</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI Discovery Agent */}
          <div className="premium-card p-6 rounded-sm mb-6 border-l-4 border-l-indigo-500 bg-indigo-50/30">
            <div className="flex items-start justify-between">
              <div className="max-w-3xl">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-sm bg-indigo-100 flex items-center justify-center">
                    <Search className="w-4 h-4 text-indigo-600" />
                  </div>
                  <h2 className="font-display text-lg font-bold text-slate-900">PaperclipAI: Autonomous Buyer Discovery</h2>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                  Dispatch an AI Agent to scrape global trade databases and Volza logs to find live buyers importing your specific goods right now.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">HSN Code</label>
                    <Input 
                      placeholder="e.g. 1006.30" 
                      value={hsnCode} 
                      onChange={e => setHsnCode(e.target.value)}
                      className="bg-white border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Product Name</label>
                    <Input 
                      placeholder="e.g. Basmati Rice" 
                      value={discoveryProduct} 
                      onChange={e => setDiscoveryProduct(e.target.value)}
                      className="bg-white border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Target Country (Optional)</label>
                    <Input 
                      placeholder="e.g. UAE" 
                      value={discoveryCountry} 
                      onChange={e => setDiscoveryCountry(e.target.value)}
                      className="bg-white border-slate-200"
                    />
                  </div>
                </div>
                <Button 
                  onClick={handleDiscovery} 
                  disabled={discoveryLoading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {discoveryLoading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
                  {discoveryLoading ? "Agent Scraping Web..." : "Dispatch Discovery Agent"}
                </Button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="premium-card p-4 rounded-sm mb-6">
            <div className="flex flex-col lg:flex-row items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search opportunities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  data-testid="search-input"
                  className="pl-10 bg-slate-50 border-slate-200"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex items-center gap-3 w-full lg:w-auto">
                <Select value={sectorFilter} onValueChange={setSectorFilter}>
                  <SelectTrigger className="w-full lg:w-48 bg-white" data-testid="sector-filter">
                    <SelectValue placeholder="All Sectors" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sectors</SelectItem>
                    {SECTORS.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={regionFilter} onValueChange={setRegionFilter}>
                  <SelectTrigger className="w-full lg:w-40 bg-white" data-testid="region-filter">
                    <SelectValue placeholder="All Regions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    {REGIONS.map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full lg:w-36 bg-white" data-testid="status-filter">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Opportunities Grid */}
          {loading ? (
            <div className="text-center py-12 text-slate-500">Loading opportunities...</div>
          ) : filteredOpportunities.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No opportunities found</p>
              <Button
                onClick={() => navigate("/admin/create-opportunity")}
                className="mt-4 bg-navy hover:bg-charcoal text-white"
              >
                Create First Opportunity
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="opportunities-grid">
              {filteredOpportunities.map((opp) => (
                <OpportunityCard key={opp.id} opportunity={opp} showScores />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
