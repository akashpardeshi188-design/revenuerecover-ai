import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { DashboardNav } from '@/components/dashboard/DashboardNav';
import { DollarSign, Sparkles, Users, CreditCard, AlertCircle } from 'lucide-react';

const money = (value: number, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value);
const label = (value?: string | null) =>
  (value || 'unknown').replace(/_/g, ' ').replace(/\b\w/g, letter => letter.toUpperCase());

export default async function DashboardOverviewPage() {
  const supabase = await createClient();
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth.user) redirect('/login');

  const { data: profile, error: profileError } = await supabase
    .from('users').select('role, company_id').eq('id', auth.user.id).maybeSingle();
  if (profileError || !profile) redirect('/login?error=profile_pending');
  if (!profile.company_id && !['admin', 'manager'].includes(profile.role)) redirect('/onboarding');

  let companyName = 'Administrator Workspace';
  if (profile.company_id) {
    const { data: company } = await supabase.from('companies').select('name').eq('id', profile.company_id).maybeSingle();
    companyName = company?.name || 'Your Business';
  }

  const [oppResult, leadResult, paymentResult] = await Promise.all([
    supabase.from('recovery_opportunities').select('id,status,recovered_value,reason,created_at').order('created_at', { ascending: false }).limit(100),
    supabase.from('client_leads').select('id,customer_name,customer_email,service_requested,status,estimated_job_value,created_at', { count: 'exact' }).order('created_at', { ascending: false }).limit(5),
    supabase.from('payments').select('id,amount,currency,status,created_at').order('created_at', { ascending: false }).limit(5),
  ]);
  const opportunities = oppResult.data || [];
  const leads = leadResult.data || [];
  const payments = paymentResult.data || [];
  const openCount = opportunities.filter(row => row.status !== 'recovered' && row.status !== 'dismissed').length;
  const recoveredRevenue = opportunities.filter(row => row.status === 'recovered').reduce((sum, row) => sum + Number(row.recovered_value || 0), 0);
  const recentPaymentTotal = payments.reduce((sum, row) => sum + Number(row.amount || 0), 0);
  const errors = [oppResult.error, leadResult.error, paymentResult.error].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
      <DashboardNav />
      <main className="min-w-0 flex-grow p-5 sm:p-8 space-y-7 max-w-7xl">
        <header>
          <div className="flex flex-wrap items-center gap-2"><h1 className="text-2xl font-bold text-white">Revenue Recovery Overview</h1><span className="px-2 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">STAGING DATABASE</span></div>
          <p className="text-sm text-slate-400 mt-1">{companyName} · signed in as {auth.user.email}</p>
        </header>
        {errors > 0 && <div role="status" className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3 text-sm text-amber-200 flex gap-2"><AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />Some staging tables could not be read ({errors}). Totals may be incomplete; verify permissions and table setup.</div>}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <article className="rounded-2xl border border-emerald-500/30 bg-slate-900 p-5"><div className="flex justify-between text-xs text-slate-400"><span>Recovered revenue</span><DollarSign className="w-4 h-4 text-emerald-400" /></div><div className="mt-3 text-3xl font-black text-emerald-300">{money(recoveredRevenue)}</div><p className="mt-2 text-xs text-slate-500">From latest 100 visible recovery records</p></article>
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><div className="flex justify-between text-xs text-slate-400"><span>Open opportunities</span><Sparkles className="w-4 h-4 text-cyan-300" /></div><div className="mt-3 text-3xl font-black">{openCount}</div><p className="mt-2 text-xs text-slate-500">Visible to your authenticated tenant</p></article>
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><div className="flex justify-between text-xs text-slate-400"><span>Customer requests</span><Users className="w-4 h-4 text-blue-300" /></div><div className="mt-3 text-3xl font-black">{leadResult.count ?? leads.length}</div><p className="mt-2 text-xs text-slate-500">Latest five requests listed below</p></article>
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><div className="flex justify-between text-xs text-slate-400"><span>Latest five payments</span><CreditCard className="w-4 h-4 text-amber-300" /></div><div className="mt-3 text-3xl font-black">{money(recentPaymentTotal, payments[0]?.currency || 'USD')}</div><p className="mt-2 text-xs text-slate-500">Not a full historical revenue total</p></article>
        </section>
        <section className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden">
          <div className="p-5 border-b border-slate-800"><h2 className="text-base font-bold">Recent customer requests</h2><p className="text-xs text-slate-400 mt-1">Loaded from Supabase under the current user session.</p></div>
          {leads.length === 0 ? <div className="p-8 text-sm text-slate-400">No customer requests are visible yet. This is normal for an empty staging tenant.</div> :
            <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="text-[11px] uppercase tracking-wider text-slate-500 bg-slate-950/50"><tr><th className="p-4">Customer</th><th className="p-4">Service</th><th className="p-4">Status</th><th className="p-4 text-right">Estimated value</th></tr></thead><tbody>{leads.map(lead => <tr key={lead.id} className="border-t border-slate-800"><td className="p-4"><div className="font-semibold text-slate-200">{lead.customer_name || 'New customer'}</div><div className="text-xs text-slate-500">{lead.customer_email || 'No email listed'}</div></td><td className="p-4 text-slate-300">{lead.service_requested || 'Service request'}</td><td className="p-4"><span className="px-2 py-1 rounded-lg bg-slate-800 text-xs">{label(lead.status)}</span></td><td className="p-4 text-right font-semibold">{money(Number(lead.estimated_job_value || 0))}</td></tr>)}</tbody></table></div>}
        </section>
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-base font-bold">Latest recovery opportunities</h2>
          <div className="mt-4 space-y-3">{opportunities.slice(0,5).map(row => <div key={row.id} className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3 last:border-0 last:pb-0"><div><div className="text-sm text-slate-200">{row.reason || 'Recovery opportunity'}</div><div className="text-xs text-slate-500 mt-1">{label(row.status)} · {new Date(row.created_at).toLocaleDateString('en-US')}</div></div><div className="text-sm font-semibold text-emerald-300">{money(Number(row.recovered_value || 0))}</div></div>)}{opportunities.length===0 && <p className="text-sm text-slate-400">No recovery opportunities are visible yet.</p>}</div>
        </section>
        <p className="text-[11px] text-slate-500">Staging verification view. Payment capture and outbound messaging have not been end-to-end verified; this is not a production launch signal.</p>
      </main>
    </div>
  );
}
