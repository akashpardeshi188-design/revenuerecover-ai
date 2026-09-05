import React from 'react';
import { Navbar } from '@/components/marketing/Navbar';
import Link from 'next/link';
import {
  ShieldCheck,
  Zap,
  PhoneCall,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Building2,
  Sparkles,
} from 'lucide-react';
import { CountryCode, TradeCategory } from '@/lib/discovery/types';
import { getCountrySpec } from '@/config/countries';

export default async function GeoContractorLandingPage({
  params,
}: {
  params: Promise<{ country: string; city: string; category: string }>;
}) {
  const { country, city, category } = await params;
  const decodedCity = decodeURIComponent(city).replace(/-/g, ' ');
  const uppercaseCountry = country.toUpperCase() as CountryCode;
  const uppercaseCategory = category.toUpperCase() as TradeCategory;

  const countrySpec = getCountrySpec(uppercaseCountry);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" /> {decodedCity}, {countrySpec.name}
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            AI Missed-Call Recovery for{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              {decodedCity} {uppercaseCategory} Contractors
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Never lose another customer call in {decodedCity}. RevenueRecover AI automatically texts back missed homeowner calls in 45 seconds, booking the job before your competitor picks up.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="https://www.paypal.com/ncp/payment/GFXAWMG4S227E"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/20 hover:scale-105 transition flex items-center gap-2"
            >
              <Zap className="w-4 h-4 fill-slate-950" /> Start 1-Click Setup ({countrySpec.currencySymbol}119/mo)
            </Link>
          </div>
        </div>

        {/* Value Proposition Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
              45s
            </div>
            <h3 className="text-base font-bold text-white">Instant Text-Back in {decodedCity}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Homeowners call the next contractor on Google if you miss their call. Our AI responds in 45 seconds to secure the dispatch.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
              150+
            </div>
            <h3 className="text-base font-bold text-white">150–200 Local {decodedCity} Leads</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every Growth subscription includes verified local homeowner inquiries in your {decodedCity} service ZIP codes.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">{countrySpec.complianceFramework[0]} Compliant</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Built strictly within {countrySpec.name} communication laws with full consent lineage and quiet hours protection.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
