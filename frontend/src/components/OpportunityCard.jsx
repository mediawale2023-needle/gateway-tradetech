import { useNavigate } from "react-router-dom";
import { useAuth } from "@/App";
import { MapPin, Package, Calendar, ChevronRight, TrendingUp, AlertTriangle, ShieldCheck, Ship } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const sectorColors = {
  "Agriculture": "sector-agriculture",
  "Marine / Frozen Foods": "sector-marine",
  "Pharma": "sector-pharma",
  "Special Chemicals": "sector-chemicals",
  "Value-Added Agri Products": "sector-valueadded"
};

const statusColors = {
  "Active": "status-active",
  "Draft": "status-draft",
  "Matched": "status-matched",
  "Closed": "status-closed"
};

export default function OpportunityCard({ opportunity, showScores = false }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const handleClick = () => {
    const basePath = isAdmin ? "/admin" : "/exporter";
    navigate(`${basePath}/opportunity/${opportunity.id}`);
  };

  const getScoreColor = (score) => {
    if (score >= 0.7) return "score-high";
    if (score >= 0.4) return "score-medium";
    return "score-low";
  };

  return (
    <div
      onClick={handleClick}
      data-testid={`opportunity-card-${opportunity.id}`}
      className="premium-card p-6 rounded-sm cursor-pointer hover:shadow-elevated transition-shadow group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`sector-badge ${sectorColors[opportunity.sector] || "bg-slate-100 text-slate-600"}`}>
              {opportunity.sector}
            </span>
            <span className={`px-2 py-0.5 text-xs font-medium rounded-sm border ${statusColors[opportunity.status] || "bg-slate-100"}`}>
              {opportunity.status}
            </span>
          </div>
          <h3 className="font-display text-lg font-semibold text-slate-900 group-hover:text-navy transition-colors">
            {opportunity.product_name}
          </h3>
          {opportunity.buyer_name && (
            <p className="text-sm text-slate-500 mt-1 line-clamp-1 font-medium">{opportunity.buyer_name}</p>
          )}
        </div>
        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-gold transition-colors" />
      </div>

      {/* FinTech & Logistics Badges */}
      {(opportunity.credit_insured || opportunity.freight_quote > 0) && (
        <div className="flex flex-wrap gap-2 mb-4">
          {opportunity.credit_insured && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-100">
              <ShieldCheck className="w-3.5 h-3.5" />
              Insured up to ${opportunity.credit_limit?.toLocaleString()}
            </span>
          )}
          {opportunity.freight_quote > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">
              <Ship className="w-3.5 h-3.5" />
              Est. Freight: ${opportunity.freight_quote?.toLocaleString()}
            </span>
          )}
        </div>
      )}

      {/* Details */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <MapPin className="w-4 h-4 text-slate-400" strokeWidth={1.5} />
          <span>{opportunity.source_country}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Package className="w-4 h-4 text-slate-400" strokeWidth={1.5} />
          <span>{opportunity.quantity}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Calendar className="w-4 h-4 text-slate-400" strokeWidth={1.5} />
          <span>{opportunity.delivery_timeline}</span>
        </div>
      </div>

      {/* Compliance Tags */}
      {opportunity.compliance_requirements?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {opportunity.compliance_requirements.slice(0, 3).map((cert) => (
            <Badge key={cert} variant="outline" className="text-xs bg-slate-50 border-slate-200 text-slate-600">
              {cert}
            </Badge>
          ))}
          {opportunity.compliance_requirements.length > 3 && (
            <Badge variant="outline" className="text-xs bg-slate-50 border-slate-200 text-slate-500">
              +{opportunity.compliance_requirements.length - 3}
            </Badge>
          )}
        </div>
      )}

      {/* Scores - Admin only */}
      {showScores && isAdmin && (
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <TrendingUp className={`w-4 h-4 ${getScoreColor(opportunity.opportunity_score)}`} />
            <span className={`text-sm font-medium ${getScoreColor(opportunity.opportunity_score)}`}>
              {Math.round(opportunity.opportunity_score * 100)}%
            </span>
            <span className="text-xs text-slate-400 ml-1">Score</span>
          </div>
          <div className="flex items-center gap-1">
            <AlertTriangle className={`w-4 h-4 ${getScoreColor(1 - opportunity.risk_score)}`} />
            <span className={`text-sm font-medium ${getScoreColor(1 - opportunity.risk_score)}`}>
              {Math.round(opportunity.risk_score * 100)}%
            </span>
            <span className="text-xs text-slate-400 ml-1">Risk</span>
          </div>
        </div>
      )}

      {/* HS Code if available */}
      {opportunity.hs_code && (
        <div className="pt-3 mt-3 border-t border-slate-100">
          <span className="text-xs text-slate-400 font-mono">HS: {opportunity.hs_code}</span>
        </div>
      )}
    </div>
  );
}
