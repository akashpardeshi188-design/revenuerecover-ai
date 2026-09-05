'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/marketing/Navbar';
import { GrowthNav } from '@/components/growth/GrowthNav';
import {
  Globe2,
  Search,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  Zap,
  Activity,
  DollarSign,
  Building2,
  Layers,
  Sparkles,
  RefreshCcw,
  Sliders,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { GLOBAL_SOURCE_REGISTRY } from '@/lib/discovery/registry';
import { CountryCode, TradeCategory, BusinessMaster, DiscoveryJobReport } from '@/lib/discovery/types';

export default function AdminGlobalDiscoveryPage() {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>('USA');
  const [selectedCity, setSelectedCity] = useState('Dallas');
  const [selectedCategory, setSelectedCategory] = useState<TradeCategory>('HVAC');
  const [radiusMiles, setRadiusMiles] = useState(25);
  const [isLoading, setIsLoading] = useState(false);
  const [discoveredBusinesses, setDiscoveredBusinesses] = useState<BusinessMaster[]>([]);
  const [lastReport, setLastReport] = useState<DiscoveryJobReport | null>(null);
  const [activeTab, setActiveTab] = useState<'DISCOVERY' | 'SOURCES' | 'CREDENTIALS' | 'COMPLIANCE'>('DISCOVERY');

  const handleRunDiscovery = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/discovery/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country: selectedCountry,
          city: selectedCity,
          category: selectedCategory,
          radiusMiles,
          limitPerSource: 10,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setDiscoveredBusinesses(data.businesses || []);
        setLastReport(data.report || null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        <GrowthNav />

        {/* Top Header Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5" /> Global Contractor Discovery &amp; Intelligence
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[11px] font-bold">
                Multi-Tenant v2.4
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-2">
              Autonomous Discovery &amp; Identity Control Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              &ldquo;No relevant business lead should be unnecessarily missed.&rdquo; Multi-source ingestion across Google, Yelp, Foursquare, Bing, and Government Registries.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl text-center min-w-[110px]">
              <div className="text-xs text-slate-400">Sources</div>
              <div className="text-lg font-black text-emerald-400 font-mono">
                {GLOBAL_SOURCE_REGISTRY.filter((s) => s.enabled).length} Active
              </div>
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl text-center min-w-[110px]">
              <div className="text-xs text-slate-400">Target Markets</div>
              <div className="text-lg font-black text-cyan-400 font-mono">USA • UK • CA</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 gap-2 overflow-x-auto pb-1 text-xs font-bold">
          <button
            onClick={() => setActiveTab('DISCOVERY')}
            className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 ${
              activeTab === 'DISCOVERY'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Search className="w-4 h-4" /> Live Discovery Engine
          </button>
          <button
            onClick={() => setActiveTab('SOURCES')}
            className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 ${
              activeTab === 'SOURCES'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" /> Global Source Registry ({GLOBAL_SOURCE_REGISTRY.length})
          </button>
          <button
            onClick={() => setActiveTab('CREDENTIALS')}
            className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 ${
              activeTab === 'CREDENTIALS'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> API Credentials &amp; Health
          </button>
          <button
            onClick={() => setActiveTab('COMPLIANCE')}
            className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 ${
              activeTab === 'COMPLIANCE'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <ShieldAlert className="w-4 h-4" /> Compliance Guardrails (TCPA/GDPR)
          </button>
        </div>

        {/* TAB 1: LIVE DISCOVERY RUNNER */}
        {activeTab === 'DISCOVERY' && (
          <div className="space-y-6">
            {/* Search Parameter Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" /> Target Discovery Parameters
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs text-slate-400 font-medium">Target Country</label>
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value as CountryCode)}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500"
                  >
                    <option value="USA">🇺🇸 United States (USA)</option>
                    <option value="GBR">🇬🇧 United Kingdom (UK)</option>
                    <option value="CAN">🇨🇦 Canada (CAN)</option>
                    <option value="AUS">🇦🇺 Australia (AUS)</option>
                    <option value="IND">🇮🇳 India (IND)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-medium">City / Metropolitan Market</label>
                  <input
                    type="text"
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    placeholder="e.g. Dallas, London, Toronto"
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-medium">Trade Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as TradeCategory)}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500"
                  >
                    <option value="HVAC">❄️ HVAC (Heating &amp; Air)</option>
                    <option value="PLUMBING">🔧 Plumbing &amp; Drain</option>
                    <option value="ELECTRICAL">⚡ Electrical &amp; Wiring</option>
                    <option value="ROOFING">🏠 Roofing &amp; Gutters</option>
                    <option value="SOLAR">☀️ Solar &amp; Energy</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-medium">Search Radius (Miles)</label>
                  <input
                    type="number"
                    value={radiusMiles}
                    onChange={(e) => setRadiusMiles(Number(e.target.value))}
                    min={5}
                    max={100}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleRunDiscovery}
                  disabled={isLoading}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 hover:scale-[1.02] transition flex items-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <RefreshCcw className="w-4 h-4 animate-spin" /> Ingesting &amp; Resolving Entities...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 fill-slate-950" /> Execute Multi-Source Discovery
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Execution Report Banner */}
            {lastReport && (
              <div className="p-5 bg-slate-900 border border-emerald-500/40 rounded-3xl grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
                <div>
                  <div className="text-[11px] text-slate-400">Total Discovered</div>
                  <div className="text-xl font-black text-white font-mono">{lastReport.totalRawDiscovered}</div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-400">Unique Master Entities</div>
                  <div className="text-xl font-black text-emerald-400 font-mono">{lastReport.totalUniqueEntities}</div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-400">Duplicates Consolidated</div>
                  <div className="text-xl font-black text-cyan-400 font-mono">{lastReport.duplicatesConsolidated}</div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-400">Verified High Trust</div>
                  <div className="text-xl font-black text-amber-400 font-mono">{lastReport.verifiedCount}</div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-400">API Cost</div>
                  <div className="text-xl font-black text-purple-400 font-mono">${lastReport.estimatedCostUSD}</div>
                </div>
              </div>
            )}

            {/* Discovered Businesses Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-400" /> Discovered Master Contractor Entities
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  {discoveredBusinesses.length} Master Entities
                </span>
              </div>

              {discoveredBusinesses.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs">
                  Click &ldquo;Execute Multi-Source Discovery&rdquo; above to query global sources and ingest verified contractors.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="p-3">Master Business Name</th>
                        <th className="p-3">Trade</th>
                        <th className="p-3">Phone (E.164)</th>
                        <th className="p-3">Website Domain</th>
                        <th className="p-3">Location</th>
                        <th className="p-3">Sources</th>
                        <th className="p-3">Verification Score</th>
                        <th className="p-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {discoveredBusinesses.map((biz) => (
                        <tr key={biz.id} className="hover:bg-slate-800/40 transition">
                          <td className="p-3 font-bold text-white">
                            <div>{biz.businessName}</div>
                            <div className="text-[10px] text-slate-400 font-normal">{biz.addressLine1}</div>
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-[10px] font-bold text-slate-300">
                              {biz.primaryTrade}
                            </span>
                          </td>
                          <td className="p-3 font-mono text-emerald-400">
                            {biz.phoneE164 || 'Pending phone'}
                          </td>
                          <td className="p-3 text-slate-400 font-mono">
                            {biz.domain ? (
                              <a
                                href={biz.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-cyan-400 hover:underline flex items-center gap-1"
                              >
                                {biz.domain} <ExternalLink className="w-3 h-3" />
                              </a>
                            ) : (
                              'No domain'
                            )}
                          </td>
                          <td className="p-3">
                            {biz.city}, {biz.stateProvince} ({biz.country})
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/30 text-purple-300 font-mono text-[10px] font-bold">
                              {biz.sourceCount} Sources
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                                <div
                                  className="bg-emerald-400 h-full rounded-full"
                                  style={{ width: `${biz.verificationScore}%` }}
                                />
                              </div>
                              <span className="font-mono font-bold text-slate-200">
                                {biz.verificationScore}%
                              </span>
                            </div>
                          </td>
                          <td className="p-3 text-right">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                biz.verificationStatus === 'VERIFIED'
                                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                                  : 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                              }`}
                            >
                              {biz.verificationStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: GLOBAL SOURCE REGISTRY */}
        {activeTab === 'SOURCES' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" /> Evaluated Global Source Registry
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3">Source Name</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Country</th>
                    <th className="p-3">API Auth</th>
                    <th className="p-3">Rate Limit</th>
                    <th className="p-3">Cost / Call</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Compliance Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {GLOBAL_SOURCE_REGISTRY.map((src) => (
                    <tr key={src.id} className="hover:bg-slate-800/40 transition">
                      <td className="p-3 font-bold text-white">
                        {src.sourceName}
                      </td>
                      <td className="p-3 text-slate-400">{src.sourceType}</td>
                      <td className="p-3 font-mono">{src.country}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-[10px] font-mono">
                          {src.authenticationType}
                        </span>
                      </td>
                      <td className="p-3 font-mono">{src.rateLimitPerMinute}/min</td>
                      <td className="p-3 font-mono text-emerald-400">${src.estimatedCostPerCallUSD}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            src.integrationStatus === 'CONNECTED'
                              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                              : src.integrationStatus === 'AWAITING_CREDENTIALS'
                              ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                              : 'bg-red-500/10 border border-red-500/30 text-red-400'
                          }`}
                        >
                          {src.integrationStatus}
                        </span>
                      </td>
                      <td className="p-3 text-[10px] text-slate-400 max-w-xs truncate">
                        {src.complianceNotes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: CREDENTIALS & HEALTH */}
        {activeTab === 'CREDENTIALS' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> API Connections &amp; Health Checks
            </h3>
            <p className="text-xs text-slate-400">
              Centralized environment configuration. Set keys in <code>.env.local</code> to activate live API queries.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span>Google Maps &amp; Places API</span>
                  <span className="text-emerald-400 text-[10px]">READY</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">Env: GOOGLE_MAPS_API_KEY</div>
                <div className="text-[10px] text-slate-500">Provides high-accuracy contractor phone &amp; address resolution.</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span>Yelp Fusion API</span>
                  <span className="text-emerald-400 text-[10px]">READY</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">Env: YELP_API_KEY</div>
                <div className="text-[10px] text-slate-500">Provides trade categorization, review counts, and verified status.</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span>Foursquare Places API</span>
                  <span className="text-emerald-400 text-[10px]">READY</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">Env: FOURSQUARE_API_KEY</div>
                <div className="text-[10px] text-slate-500">Global trade venue dataset covering North America and Europe.</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span>UK Companies House API</span>
                  <span className="text-emerald-400 text-[10px]">READY</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">Env: UK_COMPANIES_HOUSE_API_KEY</div>
                <div className="text-[10px] text-slate-500">Official UK Government registered company verification.</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: COMPLIANCE */}
        {activeTab === 'COMPLIANCE' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-emerald-400" /> Multi-Region Compliance Frameworks
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-sm font-bold text-emerald-400">🇺🇸 USA: TCPA &amp; CAN-SPAM</div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Enforces prior express written consent, automatic 8 PM–8 AM quiet hours per recipient timezone, and internal DNC list suppression.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-sm font-bold text-cyan-400">🇬🇧 UK: GDPR &amp; PECR</div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Legitimate interest assessment for B2B corporate contacts, mandatory privacy notice, and 1-click unsubscribe headers.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-sm font-bold text-purple-400">🇨🇦 Canada: CASL</div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Implied business consent tracking (6-month inquiry window) with complete audit trail of consent timestamps.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
