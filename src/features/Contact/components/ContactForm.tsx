'use client';

import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';

// ── Country data ──────────────────────────────────────────────────────────────
interface Country {
  name: string;
  flag: string;
  code: string;
}

const COUNTRIES: Country[] = [
  { name: 'Afghanistan', flag: '🇦🇫', code: '+93' },
  { name: 'Aland Islands', flag: '🇦🇽', code: '+358' },
  { name: 'Albania', flag: '🇦🇱', code: '+355' },
  { name: 'Algeria', flag: '🇩🇿', code: '+213' },
  { name: 'American Samoa', flag: '🇦🇸', code: '+1684' },
  { name: 'Andorra', flag: '🇦🇩', code: '+376' },
  { name: 'Angola', flag: '🇦🇴', code: '+244' },
  { name: 'Argentina', flag: '🇦🇷', code: '+54' },
  { name: 'Armenia', flag: '🇦🇲', code: '+374' },
  { name: 'Australia', flag: '🇦🇺', code: '+61' },
  { name: 'Austria', flag: '🇦🇹', code: '+43' },
  { name: 'Azerbaijan', flag: '🇦🇿', code: '+994' },
  { name: 'Bahrain', flag: '🇧🇭', code: '+973' },
  { name: 'Bangladesh', flag: '🇧🇩', code: '+880' },
  { name: 'Belgium', flag: '🇧🇪', code: '+32' },
  { name: 'Brazil', flag: '🇧🇷', code: '+55' },
  { name: 'Canada', flag: '🇨🇦', code: '+1' },
  { name: 'China', flag: '🇨🇳', code: '+86' },
  { name: 'Denmark', flag: '🇩🇰', code: '+45' },
  { name: 'Egypt', flag: '🇪🇬', code: '+20' },
  { name: 'Finland', flag: '🇫🇮', code: '+358' },
  { name: 'France', flag: '🇫🇷', code: '+33' },
  { name: 'Germany', flag: '🇩🇪', code: '+49' },
  { name: 'Ghana', flag: '🇬🇭', code: '+233' },
  { name: 'Greece', flag: '🇬🇷', code: '+30' },
  { name: 'Hong Kong', flag: '🇭🇰', code: '+852' },
  { name: 'India', flag: '🇮🇳', code: '+91' },
  { name: 'Indonesia', flag: '🇮🇩', code: '+62' },
  { name: 'Iran', flag: '🇮🇷', code: '+98' },
  { name: 'Iraq', flag: '🇮🇶', code: '+964' },
  { name: 'Ireland', flag: '🇮🇪', code: '+353' },
  { name: 'Israel', flag: '🇮🇱', code: '+972' },
  { name: 'Italy', flag: '🇮🇹', code: '+39' },
  { name: 'Japan', flag: '🇯🇵', code: '+81' },
  { name: 'Jordan', flag: '🇯🇴', code: '+962' },
  { name: 'Kenya', flag: '🇰🇪', code: '+254' },
  { name: 'Kuwait', flag: '🇰🇼', code: '+965' },
  { name: 'Lebanon', flag: '🇱🇧', code: '+961' },
  { name: 'Malaysia', flag: '🇲🇾', code: '+60' },
  { name: 'Maldives', flag: '🇲🇻', code: '+960' },
  { name: 'Mexico', flag: '🇲🇽', code: '+52' },
  { name: 'Morocco', flag: '🇲🇦', code: '+212' },
  { name: 'Myanmar', flag: '🇲🇲', code: '+95' },
  { name: 'Nepal', flag: '🇳🇵', code: '+977' },
  { name: 'Netherlands', flag: '🇳🇱', code: '+31' },
  { name: 'New Zealand', flag: '🇳🇿', code: '+64' },
  { name: 'Nigeria', flag: '🇳🇬', code: '+234' },
  { name: 'Norway', flag: '🇳🇴', code: '+47' },
  { name: 'Oman', flag: '🇴🇲', code: '+968' },
  { name: 'Pakistan', flag: '🇵🇰', code: '+92' },
  { name: 'Philippines', flag: '🇵🇭', code: '+63' },
  { name: 'Poland', flag: '🇵🇱', code: '+48' },
  { name: 'Portugal', flag: '🇵🇹', code: '+351' },
  { name: 'Qatar', flag: '🇶🇦', code: '+974' },
  { name: 'Russia', flag: '🇷🇺', code: '+7' },
  { name: 'Saudi Arabia', flag: '🇸🇦', code: '+966' },
  { name: 'Singapore', flag: '🇸🇬', code: '+65' },
  { name: 'South Africa', flag: '🇿🇦', code: '+27' },
  { name: 'South Korea', flag: '🇰🇷', code: '+82' },
  { name: 'Spain', flag: '🇪🇸', code: '+34' },
  { name: 'Sri Lanka', flag: '🇱🇰', code: '+94' },
  { name: 'Sweden', flag: '🇸🇪', code: '+46' },
  { name: 'Switzerland', flag: '🇨🇭', code: '+41' },
  { name: 'Taiwan', flag: '🇹🇼', code: '+886' },
  { name: 'Thailand', flag: '🇹🇭', code: '+66' },
  { name: 'Turkey', flag: '🇹🇷', code: '+90' },
  { name: 'UAE', flag: '🇦🇪', code: '+971' },
  { name: 'Uganda', flag: '🇺🇬', code: '+256' },
  { name: 'Ukraine', flag: '🇺🇦', code: '+380' },
  { name: 'United Kingdom', flag: '🇬🇧', code: '+44' },
  { name: 'United States', flag: '🇺🇸', code: '+1' },
  { name: 'Vietnam', flag: '🇻🇳', code: '+84' },
];

const DEFAULT_COUNTRY = COUNTRIES.find((c) => c.name === 'India')!;

// ── Country dropdown ──────────────────────────────────────────────────────────
function CountryDropdown({
  selected,
  onSelect,
}: {
  selected: Country;
  onSelect: (c: Country) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const filtered = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.includes(search),
  );

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 pr-2 text-sm"
      >
        <span className="text-base leading-none">{selected.flag}</span>
        <span className="text-black/70">{selected.code}</span>
        <span className="text-[10px] text-black/40">{open ? '▲' : '▾'}</span>
      </button>

      {open && (
        <div className="absolute top-full left-0 z-50 mt-2 w-64 overflow-hidden rounded-lg border border-black/15 bg-white shadow-xl">
          {/* Search */}
          <div className="border-b border-black/10 p-2">
            <div className="flex items-center gap-2 rounded-md bg-black/5 px-3 py-2">
              <svg
                className="h-3.5 w-3.5 shrink-0 text-black/40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <circle cx="11" cy="11" r="8" />
                <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
              </svg>
              <input
                autoFocus
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-black/40"
              />
            </div>
          </div>

          {/* List */}
          <div className="max-h-52 overflow-y-auto">
            {filtered.length > 0 ? (
              filtered.map((c) => (
                <button
                  key={`${c.name}-${c.code}`}
                  type="button"
                  onClick={() => {
                    onSelect(c);
                    setOpen(false);
                    setSearch('');
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-black/5"
                >
                  <span className="text-base">{c.flag}</span>
                  <span className="flex-1 text-black">{c.name}</span>
                  <span className="text-black/45">{c.code}</span>
                </button>
              ))
            ) : (
              <p className="px-4 py-3 text-sm text-black/40">No results</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Shared box input classes ──────────────────────────────────────────────────
const boxInput =
  'w-full rounded-md border border-black/20 bg-transparent px-4 py-3 text-sm outline-none transition focus:border-black/60';

type ProjectType = 'Residential' | 'Commercial' | '';

export default function ContactForm() {
  const [projectType, setProjectType] = useState<ProjectType>('');
  const [selectedCountry, setSelectedCountry] =
    useState<Country>(DEFAULT_COUNTRY);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [budget, setBudget] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [loading, setLoading] = useState(false);

  const numbersOnly = (e: React.FormEvent<HTMLInputElement>) => {
    e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '');
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      toast.error('Name and phone are required.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: `${selectedCountry.code} ${phone.trim()}`,
          address: address.trim(),
          projectType,
          budget: budget.trim(),
          company_website: honeypot,
        }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? 'Something went wrong.');
      }
      toast.success("We'll be in touch soon!", {
        description: 'Your consultation request was sent successfully.',
      });
      setName('');
      setPhone('');
      setAddress('');
      setBudget('');
      setProjectType('');
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to send. Try again.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Calendly modal removed in favor of direct Calendly links */}

      <div
        id="contact-form"
        className="cursor-default bg-[#f0efec] px-6 py-20 sm:py-28"
      >
        {/* Header */}
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-4 text-4xl font-semibold tracking-wide sm:text-5xl lg:text-6xl">
            Book your free Consultation
          </h1>
          <p className="mb-8 text-sm font-medium text-black/70 sm:text-base">
            It&apos;s time to live your dreams!
          </p>
          <a
            href="https://calendly.com/silverstorey/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="mb-16 animate-bounce rounded-full border border-black bg-transparent px-8 py-2.5 text-sm font-medium transition-colors [animation-duration:1.8s] [animation-timing-function:ease-in-out] hover:bg-black hover:text-white"
          >
            Book Now
          </a>
        </div>

        {/* Form */}
        <div className="mx-auto max-w-4xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Honeypot — hidden from people, filled in by bots */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: '-10000px',
                top: 'auto',
                width: 1,
                height: 1,
                overflow: 'hidden',
              }}
            >
              <label>
                Company website
                <input
                  type="text"
                  name="company_website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </label>
            </div>
            {/* Name + Phone */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="First name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={boxInput}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  Phone
                </label>
                <div className="flex items-center gap-2 rounded-md border border-black/20 px-4 py-3 transition focus-within:border-black/60">
                  <CountryDropdown
                    selected={selectedCountry}
                    onSelect={setSelectedCountry}
                  />
                  <div className="h-4 w-px shrink-0 bg-black/20" />
                  <input
                    type="tel"
                    inputMode="numeric"
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onInput={numbersOnly}
                    className="flex-1 bg-transparent text-sm outline-none placeholder:text-black/35"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="mb-2 block text-sm font-medium text-black">
                Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={boxInput}
              />
            </div>

            {/* Single choice + Budget */}
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
              <div>
                <label className="mb-3 block text-sm font-medium text-black">
                  Single choice
                </label>
                <div className="space-y-3">
                  {(['Residential', 'Commercial'] as const).map((type) => (
                    <label
                      key={type}
                      className="flex cursor-pointer items-center gap-3"
                    >
                      <input
                        type="radio"
                        name="projectType"
                        value={type}
                        checked={projectType === type}
                        onChange={() => setProjectType(type)}
                        className="h-4 w-4 accent-black"
                      />
                      <span className="text-sm font-medium">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  Budget
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="e.g. 500000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  onInput={numbersOnly}
                  className={boxInput}
                />
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-center pt-8">
              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-black px-12 py-3 text-sm font-medium text-white transition-transform hover:scale-105 disabled:opacity-60 disabled:hover:scale-100"
              >
                {loading ? 'Sending…' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
