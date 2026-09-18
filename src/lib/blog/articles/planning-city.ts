import type { Article } from '../types';

const AUTHOR = 'Silver Storey Editorial Team';

export const PLANNING_CITY_ARTICLES: Article[] = [
  {
    slug: 'how-to-choose-an-interior-designer-in-india',
    title: 'How to Choose an Interior Designer in India: A 10-Point Checklist',
    description:
      'The questions to ask, the red flags to avoid and the documents to insist on before hiring an interior designer or design-build firm in India.',
    category: 'planning-process',
    tags: [
      'how to choose interior designer',
      'hiring interior designer',
      'interior designer checklist',
      'best interior designer',
    ],
    publishedAt: '2026-01-28',
    updatedAt: '2026-07-12',
    author: AUTHOR,
    keyTakeaways: [
      'Insist on seeing a 3D design and an itemised quote before paying anything beyond a small token.',
      'Ask who manufactures the modular units and who supervises the site — a designer without an execution team leaves you coordinating vendors.',
      'A written warranty, a payment schedule tied to milestones and a fixed timeline are the three documents that protect you.',
    ],
    sections: [
      {
        paragraphs: [
          'Search “best interior designer near me” and you will find hundreds of options: freelancers, boutique studios, large platforms, contractors who “also do design”. Choosing between them is hard because the work is invisible until it is done. This checklist is what we would tell a friend to ask — including the questions that are uncomfortable for us to answer.',
        ],
      },
      {
        heading: 'The 10-point checklist',
        numbered: [
          'Will I see a 3D design before I commit? If the answer is “after the advance”, ask how much the advance is and whether it is refundable.',
          'Is the quote itemised? Every unit should list dimensions, board grade, finish, hardware brand and price. A lump sum is not a quote.',
          'Who builds the modular units? A designer with their own workshop controls quality and timelines; one who outsources to “our carpenter” often cannot.',
          'Who is on site every day? Ask for the name of the project manager and how often you will get progress reports.',
          'What is the warranty, in writing? Look for years, what is covered (modular components, workmanship, hardware) and the claim process.',
          'What is the payment schedule? Milestone-based (token → design approval → material → handover) protects both sides.',
          'What is the timeline, and what happens if it slips? A fixed delivery commitment with penalties or credits is a sign of confidence.',
          'Can I visit a completed project or a live site? Photographs can be borrowed; a client walking you through their home cannot.',
          'Which brands do you use? Greenply, Century, Hettich, Ebco, Asian Paints, Kohler are verifiable; “imported” and “premium” are not.',
          'What is excluded? Civil work, electrical, plumbing, countertops, appliances and loose furniture are common exclusions — know which apply.',
        ],
      },
      {
        heading: 'Red flags',
        bullets: [
          'A large advance before any design is shown.',
          'A per-square-foot price with no material specification.',
          'No written warranty, or a warranty “on request”.',
          'Reluctance to name the board grade or hardware brand.',
          'Reviews that all read the same, or a portfolio with stock imagery.',
          'No project manager — “the carpenter will handle it”.',
        ],
      },
      {
        heading: 'Freelancer vs studio vs platform: an honest comparison',
        table: {
          headers: ['Option', 'Strengths', 'Watch out for'],
          rows: [
            [
              'Freelance designer',
              'Personal attention, creative, often lower design fee',
              'You coordinate contractors; no warranty on execution',
            ],
            [
              'Design-build studio (like Silver Storey)',
              'Single point of responsibility, own workshop, warranty, 3D + itemised quote',
              'Fewer, more curated options than a marketplace',
            ],
            [
              'Large online platform',
              'Scale, showrooms, financing',
              'Templated designs, subcontracted execution, variable site supervision',
            ],
            [
              'Contractor who “also designs”',
              'Cheap',
              'No real design process; materials unspecified',
            ],
          ],
        },
        callout:
          'Silver Storey answers all ten questions the same way for every client: free 3D design, itemised quote, own workshop, dedicated project manager, 10-year written warranty, milestone payments and delivery within 45 days of approval.',
      },
    ],
    faqs: [
      {
        question: 'How much does an interior designer charge in India?',
        answer:
          'Freelancers typically charge ₹50–150 per sq ft or 8–12% of project cost as a design fee; design-build firms like Silver Storey often include design free and charge only for execution.',
      },
      {
        question: 'Should I hire an interior designer or a contractor?',
        answer:
          'For a complete home, a design-build studio gives you both in one accountable team. A contractor alone will execute but cannot plan layouts, lighting and material combinations; a designer alone leaves you managing execution.',
      },
    ],
    related: [
      'how-to-read-an-interior-design-quote',
      'interior-design-cost-in-india',
      'interior-designers-in-kolkata-guide',
    ],
  },
  {
    slug: 'how-to-read-an-interior-design-quote',
    title: 'How to Read an Interior Design Quote (and Compare Two Fairly)',
    description:
      'A line-by-line guide to interior design quotes in India: what each section means, the specifications that must be present, common hidden costs and a template for comparing quotes.',
    category: 'planning-process',
    tags: [
      'interior design quote',
      'interior design estimate',
      'compare quotes',
      'hidden costs',
    ],
    publishedAt: '2026-04-20',
    author: AUTHOR,
    sections: [
      {
        paragraphs: [
          'Two quotes for the “same” 3BHK can differ by ₹4 lakh and both be honest — because they are not for the same thing. Learning to read a quote is the single most useful skill before you sign. Here is how a good quote is structured and what to check in each part.',
        ],
      },
      {
        heading: 'Section 1: Modular units',
        paragraphs: [
          'Each wardrobe, kitchen run, TV unit and vanity should have its own line with width × height × depth, carcass material and grade (e.g., “18 mm BWP plywood, Greenply”), shutter finish (e.g., “1 mm laminate, Merino”), hardware brand (“Hettich soft-close hinges, Ebco channels”), internal fittings and price. If a line says only “wardrobe – ₹85,000”, ask for the specification.',
        ],
      },
      {
        heading: 'Section 2: Civil and services',
        paragraphs: [
          'Electrical (points, wiring brand, switch brand), plumbing (pipes, fittings, sanitaryware brand), tiling (tile rate per sq ft, area, laying charges), false ceiling (type, area, rate) and painting (brand and grade, number of coats, area). These are often the difference between two quotes.',
        ],
      },
      {
        heading: 'Section 3: Loose furniture, soft furnishings and décor',
        paragraphs: [
          'Sofas, dining sets, curtains, rugs, art. Frequently excluded or listed as “allowance”. Make sure you know which.',
        ],
      },
      {
        heading: 'Section 4: Exclusions, terms and warranty',
        paragraphs: [
          'Read this section first. Look for: GST inclusion, transport and lift charges, society deposits, debris removal, countertop and appliance exclusions, payment schedule, timeline, and the warranty in years with coverage.',
        ],
      },
      {
        heading: 'Common hidden costs',
        bullets: [
          'GST added at the end (18% on services).',
          'Countertop, backsplash and sink “not included”.',
          'Electrical points beyond a fixed number.',
          'Loft covers, skirting, edge banding on lofts.',
          'Transport, lift charges and society deposits.',
          'Design changes after approval, priced at undisclosed rates.',
        ],
      },
      {
        heading: 'A simple comparison template',
        table: {
          headers: ['Check', 'Quote A', 'Quote B'],
          rows: [
            ['Board grade named for every unit?', '', ''],
            ['Hardware brand named?', '', ''],
            ['Finish and brand named?', '', ''],
            ['Countertop / appliances included?', '', ''],
            ['GST included?', '', ''],
            ['Warranty in years and coverage?', '', ''],
            ['Timeline and delay policy?', '', ''],
            ['Payment milestones?', '', ''],
            ['Total for identical scope', '', ''],
          ],
        },
        callout:
          'Every Silver Storey quote is itemised with board grade, finish and hardware brand per unit, GST-inclusive, with exclusions listed plainly and a 10-year warranty in writing.',
      },
    ],
    faqs: [
      {
        question: 'Should GST be included in an interior design quote?',
        answer:
          'It should be clearly stated either way. Silver Storey quotes are GST-inclusive so the number you see is the number you pay.',
      },
      {
        question: 'Why do two quotes for the same house differ so much?',
        answer:
          'Usually because of board grade (MR vs BWP), hardware (local vs branded), finish (laminate vs acrylic), and what is excluded. Compare specifications, not totals.',
      },
    ],
    related: [
      'how-to-choose-an-interior-designer-in-india',
      'interior-design-cost-in-india',
      'plywood-vs-hdhmr-vs-mdf',
    ],
  },
  {
    slug: 'vastu-tips-for-home-interiors',
    title:
      'Vastu Tips for Home Interiors: A Practical, Non-Superstitious Guide',
    description:
      'Room-by-room vastu guidance — entrance, kitchen, bedroom, pooja room, living room — explained in terms of light, ventilation and layout, and how designers integrate it without compromising design.',
    category: 'vastu-wellbeing',
    tags: [
      'vastu tips',
      'vastu for home',
      'vastu kitchen',
      'vastu bedroom',
      'pooja room vastu',
    ],
    publishedAt: '2026-06-02',
    author: AUTHOR,
    sections: [
      {
        paragraphs: [
          'Most of our clients ask about vastu, and most of them also want a modern home. The two are not in conflict. Vastu shastra is, at heart, a set of orientation rules developed for sunlight, wind and heat in the Indian subcontinent — and many of its recommendations are simply good environmental design. Here is how we apply it.',
        ],
      },
      {
        heading: 'Entrance and foyer',
        paragraphs: [
          'Vastu favours a north, east or north-east entrance, clear of obstruction and well-lit. Practically: a bright, uncluttered foyer with a console for keys and shoes, a mirror on a side wall (not facing the door) and a threshold that feels welcoming.',
        ],
      },
      {
        heading: 'Living room',
        paragraphs: [
          'Preferred in the north or east, with heavy furniture toward the south and west walls. This keeps the morning-light side open — exactly what a designer would recommend for a bright living room. Seating should face north or east where possible.',
        ],
      },
      {
        heading: 'Kitchen',
        paragraphs: [
          'The south-east corner (Agni) is the traditional kitchen position; the hob should let the cook face east. If your flat’s kitchen is elsewhere, the fix is orientation within the room: hob on the east or south-east wall, sink to the north-east, and never hob and sink side by side without a gap. The fridge goes west or south-west.',
        ],
      },
      {
        heading: 'Master bedroom',
        paragraphs: [
          'South-west is preferred, with the bed head to the south or east (not north). Wardrobes on the south or west walls; mirrors not facing the bed. Avoid a bed directly under a beam — build a false ceiling or shift the bed.',
        ],
      },
      {
        heading: 'Kids’ and guest rooms',
        paragraphs: [
          'West or north-west for children, north-west for guests. Study desks facing east or north.',
        ],
      },
      {
        heading: 'Pooja room',
        paragraphs: [
          'North-east corner, deity facing west (so you face east) or east. Keep it elevated, uncluttered and naturally lit. In apartments, a wall-mounted mandir on the north-east wall of the living room works well.',
        ],
      },
      {
        heading: 'Bathrooms and utility',
        paragraphs: [
          'North-west or west; never in the north-east. Keep doors closed and ventilation strong — again, simple hygiene.',
        ],
      },
      {
        heading: 'Colours and materials',
        paragraphs: [
          'Light, warm tones in the north and east; deeper tones in the south and west. Natural materials — wood, stone, cotton, lime — over synthetics. This aligns with our material palette anyway.',
        ],
        callout:
          'Tell your Silver Storey designer at the first meeting if vastu compliance matters to you; we build it into the layout from day one and show the orientation logic in your 3D walkthrough.',
      },
    ],
    faqs: [
      {
        question: 'Can a modern apartment be vastu compliant?',
        answer:
          'Largely yes. You cannot move the kitchen or bathrooms, but you can orient the hob, bed, wardrobes, pooja unit and seating to follow vastu principles within each room.',
      },
      {
        question: 'Which direction should the bed face as per vastu?',
        answer:
          'Head to the south (first preference) or east; avoid the head pointing north.',
      },
    ],
    related: [
      'modular-kitchen-layouts-guide',
      'living-room-design-ideas',
      'false-ceiling-design-guide',
    ],
  },
  {
    slug: 'interior-design-for-humid-coastal-cities',
    title:
      'Interior Design for Humid and Coastal Cities: Kolkata, Mumbai, Chennai, Kochi and Goa',
    description:
      'Why interiors fail in humid Indian cities and how to specify them right — boards, hardware, finishes, ventilation and paint — with city-specific notes for Kolkata, Mumbai, Chennai, Kochi, Goa and Vizag.',
    category: 'city-guides',
    tags: [
      'humid climate interiors',
      'coastal home interior',
      'Kolkata interior design',
      'Mumbai interior design',
      'Chennai interior design',
    ],
    publishedAt: '2026-07-08',
    author: AUTHOR,
    keyTakeaways: [
      'Moisture is the number one cause of interior failure in coastal India — swollen boards, rusted hinges, peeling laminates and fungal growth.',
      'BWP plywood, SS-304 hardware, sealed edges and ventilated cabinetry are non-negotiable in these cities.',
      'Paint and plaster should breathe: lime-based or breathable emulsions on external walls, anti-fungal primers behind wardrobes.',
    ],
    sections: [
      {
        paragraphs: [
          'Half of Silver Storey’s projects are in humid cities — our home base of Kolkata, and Mumbai, Chennai, Kochi, Goa, Vizag and Guwahati. The failures we are called to fix are always the same, and always avoidable. Here is how we specify interiors that still look new after ten monsoons.',
        ],
      },
      {
        heading: 'What humidity does to an interior',
        bullets: [
          'MR plywood and MDF absorb moisture and swell, especially at cut edges and under sinks.',
          'Mild-steel hinges and channels rust, stiffen and stain the board.',
          'Laminate edges lift when the adhesive fails in damp.',
          'Wardrobe backs on external walls grow fungus behind clothes.',
          'Paint on external walls blisters where moisture migrates through the wall.',
          'Solid wood doors and frames swell in monsoon and shrink in winter.',
        ],
      },
      {
        heading: 'The specification that works',
        numbered: [
          'BWP (IS:710) plywood for every carcass; HDHMR or BWP for shutters.',
          'All edges sealed with PVC or PU edge banding; no raw board exposed anywhere.',
          'SS-304 hinges, channels, baskets and handles; brass or SS-304 in bathrooms.',
          'Ventilation gaps or louvres in wardrobe backs and kitchen plinths.',
          'Anti-fungal primer and a 10 mm gap behind wardrobes on external walls.',
          'Vitrified tiles, terrazzo or sealed stone floors; engineered wood only in air-conditioned rooms.',
          'Breathable or lime-based paints externally; washable emulsions internally.',
          'Fabric over leather for sofas in non-AC rooms; leather breathes poorly in humidity.',
        ],
      },
      {
        heading: 'City notes',
        bullets: [
          'Kolkata: long monsoon plus salt from the Hooghly estuary. Old south-Kolkata flats have damp walls — treat before building wardrobes. Our head office is in Tangra; we have seen every version of this problem.',
          'Mumbai and Thane: salt air year-round in coastal wards; redevelopment flats are compact, so ventilated full-height storage matters even more.',
          'Chennai: heat plus humidity; light palettes and BWP boards, with extra attention to sea-facing balconies on ECR.',
          'Kochi and Kerala: 3,000 mm of rain. Lime plaster, terracotta, teak and ventilated cabinetry are the tradition for a reason.',
          'Goa: monsoon and salt; Indo-Portuguese houses use laterite and lime that breathe — do not seal them with cement plaster.',
          'Visakhapatnam and Kakinada: cyclone exposure; corrosion-resistant hardware and secure fixings.',
        ],
        callout:
          'Silver Storey specifications for humid cities default to BWP plywood, sealed edges and SS-304 hardware — and are backed by a 10-year warranty precisely because we are confident they last.',
      },
    ],
    faqs: [
      {
        question: 'Which plywood is best for coastal areas?',
        answer:
          'BWP (boiling water proof, IS:710) plywood — sometimes called marine plywood — from a branded manufacturer. Check the ISI stamp.',
      },
      {
        question: 'How do I stop fungus behind wardrobes?',
        answer:
          'Treat any damp before installation, apply an anti-fungal primer, leave a 10 mm gap behind the wardrobe on external walls and add ventilation slots in the back panel.',
      },
    ],
    related: [
      'plywood-vs-hdhmr-vs-mdf',
      'interior-designers-in-kolkata-guide',
      'laminate-vs-acrylic-vs-pu-vs-veneer',
    ],
  },
  {
    slug: 'interior-designers-in-kolkata-guide',
    title:
      'Interior Designers in Kolkata: Costs, Neighbourhood Notes and What to Expect (2026)',
    description:
      'A local guide to interior design in Kolkata — price ranges for 2BHK/3BHK flats, notes on Ballygunge, Salt Lake, New Town, Rajarhat and Behala, monsoon-proof materials and how to hire well.',
    category: 'city-guides',
    tags: [
      'interior designers in Kolkata',
      'Kolkata interior cost',
      'New Town interior design',
      'Salt Lake interior design',
    ],
    publishedAt: '2026-08-12',
    author: AUTHOR,
    keyTakeaways: [
      'A complete 2BHK interior in Kolkata costs ₹5.5–12 lakh; a 3BHK ₹8–18 lakh; modular kitchens start at ₹1.4 lakh.',
      'Kolkata’s humidity makes BWP plywood and SS-304 hardware essential; older south-Kolkata flats need damp treatment first.',
      'New Town, Rajarhat and EM Bypass towers have standard 2/3BHK plates; heritage homes in Ballygunge and Bhowanipore need conservation-aware design.',
    ],
    sections: [
      {
        paragraphs: [
          'Kolkata is where Silver Storey was founded and where our workshop sits, so this is the city we know best. The interior market here is unusual: a dense stock of heritage homes and 1970s cooperative flats in the south and centre, and a booming high-rise belt along EM Bypass, New Town and Rajarhat. Each needs a different approach.',
        ],
      },
      {
        heading: 'What interior design costs in Kolkata',
        table: {
          headers: ['Scope', 'Kolkata range'],
          rows: [
            ['Modular kitchen', '₹1.4 – 4.5 lakh'],
            ['Bedroom (wardrobe, bed, ceiling)', '₹2.1 – 5 lakh'],
            ['Living room', '₹2.4 – 6 lakh'],
            ['2BHK full home', '₹5.5 – 12 lakh'],
            ['3BHK full home', '₹8 – 18 lakh'],
            ['4BHK / duplex', '₹14 – 35 lakh'],
          ],
        },
        paragraphs: [
          'Kolkata is our pricing baseline; most other metros run 5–20% higher for the same specification because of labour and logistics.',
        ],
      },
      {
        heading: 'Neighbourhood notes',
        bullets: [
          'Ballygunge, Alipore, Bhowanipore: heritage houses and boutique redevelopments with 11–13 ft ceilings — tall wardrobes, mezzanine storage and cove lighting look spectacular here; damp treatment and lime plaster repair often come first.',
          'Salt Lake (Bidhannagar): 1980s–2000s plotted houses and cooperative flats; renovation projects with layout changes are common.',
          'New Town and Rajarhat: modern towers with standard 2BHK/3BHK plans; we have optimised modular kits for the most common plates.',
          'EM Bypass, Tangra, Topsia: luxury towers with large 3BHK/4BHK units; our workshop is minutes away.',
          'Behala, Joka, Garia, Tollygunge: compact flats where space-efficient storage and light palettes matter most.',
          'Howrah and the northern suburbs (Barrackpore, Sodepur, Barasat): independent homes and mid-rise flats; robust, practical interiors.',
        ],
      },
      {
        heading: 'Materials for Kolkata’s climate',
        paragraphs: [
          'June to September humidity is relentless. We specify BWP plywood for every carcass, sealed edges, SS-304 hardware, ventilated wardrobe backs and anti-fungal primers on external walls as standard. Bengal’s craft base — teak and sheesham joinery, cane, terracotta — lets us make bespoke pieces locally at good prices.',
        ],
      },
      {
        heading: 'How to hire an interior designer in Kolkata',
        paragraphs: [
          'Ask the ten questions in our hiring checklist: free 3D design before commitment, itemised quote naming board grade and hardware, own workshop, named project manager, written warranty, milestone payments and a fixed timeline. Visit the workshop if you can — ours in Tangra is open to clients by appointment.',
        ],
        callout:
          'Silver Storey’s head office is at Premises 117, Pragati Maidan, Sector A, Metropolitan Co-Operative Housing Society, Tangra, Kolkata 700105. Call +91 83369 17221 for a free consultation.',
      },
    ],
    faqs: [
      {
        question: 'Who are the best interior designers in Kolkata?',
        answer:
          'Look for a studio that shows you 3D designs before you commit, quotes itemised with material grades, manufactures in its own workshop and offers a written warranty. Silver Storey, founded and headquartered in Kolkata, works this way on every project.',
      },
      {
        question: 'How much does a 3BHK interior cost in Kolkata?',
        answer:
          'Between ₹8 and 18 lakh for a complete home, with most mid-range projects landing around ₹11 lakh.',
      },
    ],
    related: [
      'interior-design-for-humid-coastal-cities',
      'how-to-choose-an-interior-designer-in-india',
      '3bhk-interior-design-cost',
    ],
  },
  {
    slug: 'office-interior-design-guide',
    title:
      'Office Interior Design in India: Layouts, Costs per Sq Ft and a Fit-Out Timeline',
    description:
      'A practical guide to office fit-outs — space planning ratios, workstation density, cabins and meeting rooms, acoustics, cost per sq ft and a realistic 6–10 week timeline.',
    category: 'commercial',
    tags: [
      'office interior design',
      'office fit out cost',
      'commercial interior design',
      'coworking design',
    ],
    publishedAt: '2026-08-26',
    author: AUTHOR,
    keyTakeaways: [
      'Office fit-outs in India cost ₹1,200–3,500 per sq ft depending on density, finish and MEP scope.',
      'Plan 60–80 sq ft per workstation in open areas, 100–150 sq ft for cabins, and 10–15% of area for meeting rooms.',
      'A 2,000–5,000 sq ft office takes 6–10 weeks from design approval when the schedule is planned around IT and lease dates.',
    ],
    sections: [
      {
        paragraphs: [
          'An office is a productivity tool and a recruiting message. It also has a hard deadline — the lease starts whether or not the furniture has arrived. This guide covers how we plan, price and schedule office interiors so opening day is not a scramble.',
        ],
      },
      {
        heading: 'Space planning ratios',
        bullets: [
          'Open workstations: 60–80 sq ft per person including circulation.',
          'Cabins: 100–150 sq ft each; keep them on the perimeter to share daylight.',
          'Meeting rooms: one 6–8 seat room per 20–25 staff; 10–15% of area overall.',
          'Reception and brand wall: 5–8% of area.',
          'Cafeteria / breakout: 8–12% of area — the most used room after workstations.',
          'Phone booths and focus pods: one per 10–15 staff in open-plan offices.',
        ],
      },
      {
        heading: 'Cost per square foot',
        table: {
          headers: ['Grade', 'Cost / sq ft', 'What it includes'],
          rows: [
            [
              'Economy',
              '₹1,200–1,800',
              'Grid ceiling, vinyl or carpet tiles, modular workstations, basic cabins, standard lighting',
            ],
            [
              'Mid-range',
              '₹1,800–2,600',
              'Designer ceilings in key zones, glass partitions, brand wall, acoustic panels, LED lighting design',
            ],
            [
              'Premium',
              '₹2,600–3,500+',
              'Custom joinery, feature lighting, acoustic ceilings, high-spec meeting AV, café build-out',
            ],
          ],
        },
        paragraphs: [
          'Add HVAC, fire and IT cabling if the landlord has not provided them — often ₹300–600 per sq ft.',
        ],
      },
      {
        heading: 'A realistic fit-out timeline',
        numbered: [
          'Week 0–2: brief, site survey, space plan, 3D concept, itemised quote.',
          'Week 2–3: design approval, landlord and society NOCs, material ordering.',
          'Week 3–6: civil, electrical, HVAC ducting, false ceiling framing.',
          'Week 5–8: partitions, flooring, ceiling closure, painting.',
          'Week 7–9: workstations, cabins, joinery, lighting, signage.',
          'Week 9–10: IT commissioning, snagging, deep clean, handover.',
        ],
        callout:
          'Silver Storey commercial fit-outs are scheduled backwards from your lease and IT commissioning dates, with a single project manager and fixed pricing per sq ft.',
      },
    ],
    faqs: [
      {
        question: 'How much does it cost to design a 2,000 sq ft office?',
        answer:
          'Typically ₹30–50 lakh for a mid-range fit-out with cabins, a meeting room, reception and workstations, excluding HVAC and IT if not provided by the landlord.',
      },
      {
        question: 'How long does an office interior take?',
        answer:
          '6–10 weeks from design approval for a 2,000–5,000 sq ft office.',
      },
    ],
    related: [
      'how-to-read-an-interior-design-quote',
      'interior-design-cost-in-india',
      'false-ceiling-design-guide',
    ],
  },
];
