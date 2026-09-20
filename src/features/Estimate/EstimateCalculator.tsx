'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ADD_ONS,
  DEFAULT_EMI_RATE,
  EMI_TENURES,
  FINISHES,
  SCOPES,
  computeEstimate,
  emi,
  formatIndian,
  type FinishKey,
} from '@/lib/estimate';

export interface CityOption {
  slug: string;
  name: string;
  state: string;
  priceIndex: number;
}

const card = 'rounded-2xl bg-white p-6 shadow-sm sm:p-8';
const stepTitle = 'mb-1 text-lg font-bold text-black';
const stepHint = 'mb-5 text-sm text-black/55';
const chip = (on: boolean) =>
  `rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
    on
      ? 'border-black bg-black text-white'
      : 'border-black/15 bg-white text-black hover:border-black/40'
  }`;
const input =
  'w-full rounded-lg border border-black/15 bg-white px-3.5 py-2.5 text-sm text-black outline-none transition-colors focus:border-black/60';

export default function EstimateCalculator({
  cities,
  defaultCity = 'kolkata',
}: {
  cities: CityOption[];
  defaultCity?: string;
}) {
  const [citySlug, setCitySlug] = useState(defaultCity);
  const [scope, setScope] = useState('2bhk');
  const [finish, setFinish] = useState<FinishKey>('premium');
  const [addOns, setAddOns] = useState<string[]>([]);
  const [tenure, setTenure] = useState(36);
  const [rate, setRate] = useState(DEFAULT_EMI_RATE);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    company_website: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>(
    'idle',
  );
  const [message, setMessage] = useState('');

  const city = cities.find((c) => c.slug === citySlug);
  const scopeDef = SCOPES.find((s) => s.key === scope);
  const result = useMemo(
    () =>
      computeEstimate({
        scope,
        finish,
        addOns,
        priceIndex: city?.priceIndex ?? 1,
      }),
    [scope, finish, addOns, city],
  );
  const monthly = result ? emi(result.mid, rate, tenure) : 0;
  const availableAddOns = ADD_ONS.filter((a) =>
    scopeDef ? a.groups.includes(scopeDef.group) : true,
  );

  const toggleAddOn = (key: string) =>
    setAddOns((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!result) return;
    setStatus('sending');
    setMessage('');
    try {
      const res = await fetch('/api/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          city: citySlug,
          scope,
          finish,
          addOns,
        }),
      });
      const data = (await res.json()) as { error?: string; emailed?: boolean };
      if (!res.ok) throw new Error(data.error || 'Could not send.');
      setStatus('sent');
      setMessage(
        data.emailed
          ? 'Sent. Check your inbox — a designer will call to refine it.'
          : 'Saved. A designer will call you to refine this estimate.',
      );
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Could not send.');
    }
  }

  const grouped = useMemo(() => {
    const byState = new Map<string, CityOption[]>();
    for (const c of cities) {
      const list = byState.get(c.state) ?? [];
      list.push(c);
      byState.set(c.state, list);
    }
    return [...byState.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [cities]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
      <div className="space-y-6">
        {/* 1. City */}
        <section className={card} aria-labelledby="est-city">
          <h2 id="est-city" className={stepTitle}>
            1. Where is the home?
          </h2>
          <p className={stepHint}>
            Labour, logistics and material rates differ by city; we price every
            city against our Kolkata baseline.
          </p>
          <label className="block">
            <span className="sr-only">City</span>
            <select
              value={citySlug}
              onChange={(e) => setCitySlug(e.target.value)}
              className={input}
            >
              {grouped.map(([state, list]) => (
                <optgroup key={state} label={state}>
                  {list.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>
        </section>

        {/* 2. Scope */}
        <section className={card} aria-labelledby="est-scope">
          <h2 id="est-scope" className={stepTitle}>
            2. What are we designing?
          </h2>
          <p className={stepHint}>
            A full home includes modular units, false ceiling, lighting and wall
            finishes in every room. Pick a single room if you only need one
            space done.
          </p>
          <p className="mb-2 text-xs font-semibold tracking-wide text-black/50 uppercase">
            Full home
          </p>
          <div className="mb-5 flex flex-wrap gap-2">
            {SCOPES.filter((s) => s.group === 'home').map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => setScope(s.key)}
                className={chip(scope === s.key)}
                aria-pressed={scope === s.key}
              >
                {s.label}
              </button>
            ))}
          </div>
          <p className="mb-2 text-xs font-semibold tracking-wide text-black/50 uppercase">
            Single room
          </p>
          <div className="flex flex-wrap gap-2">
            {SCOPES.filter((s) => s.group === 'room').map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => setScope(s.key)}
                className={chip(scope === s.key)}
                aria-pressed={scope === s.key}
              >
                {s.label}
              </button>
            ))}
          </div>
        </section>

        {/* 3. Finish */}
        <section className={card} aria-labelledby="est-finish">
          <h2 id="est-finish" className={stepTitle}>
            3. Choose a finish level
          </h2>
          <p className={stepHint}>
            The biggest lever on cost. All three use BWP plywood carcasses and
            carry the same 10-year warranty.
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {FINISHES.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFinish(f.key)}
                aria-pressed={finish === f.key}
                className={`rounded-xl border p-4 text-left transition-colors ${
                  finish === f.key
                    ? 'border-black bg-black text-white'
                    : 'border-black/15 bg-white text-black hover:border-black/40'
                }`}
              >
                <span className="block text-base font-bold">{f.label}</span>
                <span
                  className={`mt-1 block text-xs leading-relaxed ${
                    finish === f.key ? 'text-white/70' : 'text-black/55'
                  }`}
                >
                  {f.blurb}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* 4. Add-ons */}
        <section className={card} aria-labelledby="est-addons">
          <h2 id="est-addons" className={stepTitle}>
            4. Anything extra?
          </h2>
          <p className={stepHint}>
            Optional work that is quoted separately on every itemised estimate.
          </p>
          <div className="flex flex-wrap gap-2">
            {availableAddOns.map((a) => (
              <button
                key={a.key}
                type="button"
                onClick={() => toggleAddOn(a.key)}
                className={chip(addOns.includes(a.key))}
                aria-pressed={addOns.includes(a.key)}
              >
                {a.label}
              </button>
            ))}
          </div>
        </section>

        {/* EMI */}
        <section className={card} aria-labelledby="est-emi">
          <h2 id="est-emi" className={stepTitle}>
            Spread the cost with EMI
          </h2>
          <p className={stepHint}>
            An illustration only — your bank or NBFC sets the rate, and we can
            introduce partner lenders during your consultation.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-black">
                Tenure
              </span>
              <div className="flex flex-wrap gap-2">
                {EMI_TENURES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTenure(t)}
                    className={chip(tenure === t)}
                    aria-pressed={tenure === t}
                  >
                    {t} months
                  </button>
                ))}
              </div>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-black">
                Annual interest rate: {rate}%
              </span>
              <input
                type="range"
                min={8}
                max={20}
                step={0.5}
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full accent-black"
              />
            </label>
          </div>
          {result && (
            <p className="mt-5 text-sm text-black/70">
              On the mid-point estimate of{' '}
              <strong className="text-black">
                ₹{formatIndian(result.mid)}
              </strong>{' '}
              you would pay about{' '}
              <strong className="text-black">₹{formatIndian(monthly)}</strong>{' '}
              per month for {tenure} months (total ₹
              {formatIndian(monthly * tenure)}).
            </p>
          )}
        </section>
      </div>

      {/* Sticky result */}
      <aside className="lg:sticky lg:top-6">
        <div className="rounded-2xl bg-black p-6 text-white shadow-lg sm:p-8">
          <p className="mb-2 text-xs font-semibold tracking-[0.25em] text-white/60 uppercase">
            Your estimate{city ? ` · ${city.name}` : ''}
          </p>
          {result ? (
            <>
              <p className="text-3xl font-bold tracking-tight sm:text-4xl">
                ₹{formatIndian(result.low)}
                <span className="text-white/50"> – </span>₹
                {formatIndian(result.high)}
              </p>
              <p className="mt-1 text-sm text-white/60">
                ≈ ₹{formatIndian(monthly)}/month on EMI
              </p>
              <dl className="mt-5 space-y-2 border-t border-white/15 pt-4 text-sm">
                {result.breakdown.map((b) => (
                  <div key={b.label} className="flex justify-between gap-3">
                    <dt className="text-white/70">{b.label}</dt>
                    <dd className="text-right whitespace-nowrap">
                      ₹{formatIndian(b.low)} – ₹{formatIndian(b.high)}
                    </dd>
                  </div>
                ))}
              </dl>
            </>
          ) : (
            <p className="text-sm text-white/70">Pick a scope to begin.</p>
          )}

          <form onSubmit={submit} className="mt-6 space-y-3">
            <p className="text-sm font-semibold">Email me this estimate</p>
            <input
              required
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-lg border border-white/20 bg-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-white/60 focus:outline-none"
            />
            <input
              required
              type="tel"
              placeholder="Phone / WhatsApp"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full rounded-lg border border-white/20 bg-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-white/60 focus:outline-none"
            />
            <input
              required
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-lg border border-white/20 bg-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-white/60 focus:outline-none"
            />
            <input
              type="text"
              name="company_website"
              value={form.company_website}
              onChange={(e) =>
                setForm({ ...form, company_website: e.target.value })
              }
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute -left-[9999px] h-0 w-0 opacity-0"
            />
            <button
              type="submit"
              disabled={status === 'sending' || status === 'sent' || !result}
              className="btn-bump flex w-full items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-medium text-black disabled:opacity-60"
            >
              {status === 'sending'
                ? 'Sending…'
                : status === 'sent'
                  ? 'Sent ✓'
                  : 'Send my estimate'}
            </button>
            {message && (
              <p
                role="status"
                className={`text-xs ${status === 'error' ? 'text-red-300' : 'text-white/70'}`}
              >
                {message}
              </p>
            )}
            <p className="text-[11px] leading-relaxed text-white/45">
              Indicative range, not a quote. Consultation, measurement and 3D
              design are free.{' '}
              <Link href="/pricing-structure" className="underline">
                How we price
              </Link>
            </p>
          </form>
        </div>
      </aside>
    </div>
  );
}
