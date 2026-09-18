import type { FAQ } from '@/lib/seo/schema';

export type ServiceCategory =
  | 'package'
  | 'room'
  | 'bhk'
  | 'commercial'
  | 'specialty';

export interface ServiceData {
  slug: string;
  name: string;
  shortName: string;
  category: ServiceCategory;
  /** Meta description / summary (≤160 chars ideally). */
  description: string;
  intro: string[];
  startingPriceINR?: number;
  typicalRangeINR?: [number, number];
  priceNote?: string;
  includes: string[];
  materials: string[];
  faqs: FAQ[];
  keywords: string[];
  related: string[];
  /** Whether to generate /services/[service]/[city] pages. */
  cityPages: boolean;
}

export const SERVICES: ServiceData[] = [
  {
    slug: 'full-home-interiors',
    name: 'Full Home Interior Design',
    shortName: 'Full Home Interiors',
    category: 'package',
    description:
      'Turnkey full home interior design — space planning, modular kitchen, wardrobes, false ceiling, lighting, painting and furnishing — delivered in 45 days with a 10-year warranty.',
    intro: [
      'A full home interior package is the simplest way to move into a finished, cohesive home. Instead of coordinating a carpenter, an electrician, a painter and a dozen vendors yourself, Silver Storey takes single-point responsibility for the entire scope: layout planning, modular kitchen and wardrobes, false ceilings and lighting, wall finishes, loose furniture, soft furnishings and décor styling.',
      'We start with a free consultation and site measurement, follow it with an itemised estimate and complimentary 3D visualisations of every room, and only begin execution once you have approved the design down to the last handle. Our in-house workshop manufactures the modular units while site work proceeds in parallel, which is how we deliver most homes within 45 days of design sign-off.',
      'Every full home project is covered by our 10-year warranty on modular components and workmanship, uses branded materials (Greenply, Hettich, Ebco, Asian Paints, Havells, Kohler) and is priced transparently — the quote you sign is the amount you pay.',
    ],
    startingPriceINR: 550000,
    typicalRangeINR: [550000, 2500000],
    priceNote:
      'Indicative range for a 2BHK to a large 4BHK; the final quote depends on carpet area, scope and finish grade.',
    includes: [
      'Space planning and 2D layouts',
      'Complimentary 3D visualisation of every room',
      'Modular kitchen with branded hardware',
      'Wardrobes, lofts and storage units',
      'False ceiling and lighting design',
      'TV unit, crockery unit, study and pooja unit',
      'Painting, wallpaper and wall panelling',
      'Loose furniture, curtains and décor styling',
      'Electrical and plumbing coordination',
      'Dedicated project manager and weekly progress reports',
    ],
    materials: [
      'BWP / MR-grade plywood and HDHMR',
      'Laminate, acrylic, PU and veneer finishes',
      'Hettich / Ebco hardware',
      'Asian Paints Royale and Apex',
      'Havells wiring and Philips lighting',
      'Kohler sanitaryware',
    ],
    faqs: [
      {
        question: 'What does a full home interior package include?',
        answer:
          'Everything needed to hand you a finished home: layout planning, modular kitchen, wardrobes and storage, false ceiling and lighting, wall finishes, loose furniture, soft furnishings and styling, plus coordination of electrical and plumbing work. You get a single itemised quote and one project manager.',
      },
      {
        question: 'How much does full home interior design cost in India?',
        answer:
          'Silver Storey full home packages start around ₹5.5 lakh for a compact 2BHK and typically range up to ₹25 lakh for a large 4BHK with premium finishes. Cost depends on carpet area, the number of modular units, finish grade (laminate vs. acrylic vs. veneer) and loose furniture. We share an itemised estimate before you commit.',
      },
      {
        question: 'How long does a full home interior take?',
        answer:
          'Most homes are delivered within 45 days of final design approval. Design and 3D visualisation typically take 2–3 weeks before that. Larger villas or projects with civil changes can take longer, and we agree the timeline in writing.',
      },
      {
        question: 'Is the 3D design really free?',
        answer:
          'Yes. After the free consultation and estimate, we create 3D visualisations of every room so you can see exactly what you are approving. There is no separate design fee for standard residential projects.',
      },
      {
        question: 'Do you offer a warranty on full home interiors?',
        answer:
          'Yes — Silver Storey provides a 10-year warranty covering modular components and workmanship. Terms are detailed on our Terms & Conditions page.',
      },
      {
        question: 'Can I get only part of my home done?',
        answer:
          'Absolutely. Many clients start with a modular kitchen or wardrobes and add rooms later. Our room-wise packages are priced individually.',
      },
    ],
    keywords: [
      'full home interior design',
      'turnkey home interiors',
      'complete home interiors',
      'home interior package',
      'end to end interior design',
    ],
    related: [
      'modular-kitchen',
      '3bhk-interior-design',
      'living-room-interiors',
      'bedroom-interiors',
      'false-ceiling-design',
    ],
    cityPages: true,
  },
  {
    slug: 'modular-kitchen',
    name: 'Modular Kitchen Design',
    shortName: 'Modular Kitchen',
    category: 'room',
    description:
      'Custom modular kitchens — L-shaped, U-shaped, parallel, island and straight — with BWP plywood, Hettich/Ebco hardware and a 10-year warranty. Starting ₹1.4 lakh.',
    intro: [
      'The kitchen is the hardest-working room in an Indian home, and a modular kitchen is the most valuable interior investment you can make. Silver Storey designs kitchens around how you actually cook — the work triangle between hob, sink and fridge, tall units for pantry storage, corner solutions that don’t waste space, and a chimney and hob layout that keeps the room smoke-free.',
      'We manufacture cabinets in our own workshop from BWP (boiling water proof) plywood or HDHMR, with Hettich or Ebco soft-close hinges and channels, and offer finishes from durable laminates to high-gloss acrylic, PU and natural veneer. Countertops are specified for Indian cooking: quartz, granite or Dekton, with a full-height backsplash for easy cleaning.',
      'Our kitchens start at ₹1.4 lakh for a compact straight or L-shaped layout and are delivered installed within 45 days of design approval, backed by our 10-year warranty.',
    ],
    startingPriceINR: 140000,
    typicalRangeINR: [140000, 600000],
    priceNote:
      'Starting price is for an 8–10 ft L-shaped kitchen in laminate; acrylic, PU and island kitchens cost more.',
    includes: [
      'Layout planning (L, U, parallel, island, straight)',
      'Base, wall and tall units',
      'Soft-close hinges and drawer channels',
      'Pull-out pantry, corner carousel and cutlery organisers',
      'Countertop and backsplash',
      'Chimney, hob and sink placement',
      'Under-cabinet and task lighting',
      'Installation and 10-year warranty',
    ],
    materials: [
      'BWP plywood / HDHMR carcass',
      'Laminate, acrylic, PU or veneer shutters',
      'Hettich / Ebco hardware',
      'Quartz, granite or Dekton counters',
      'SS-304 baskets and accessories',
    ],
    faqs: [
      {
        question: 'How much does a modular kitchen cost?',
        answer:
          'Silver Storey modular kitchens start at ₹1.4 lakh for a compact straight or L-shaped kitchen in laminate finish. Mid-range kitchens with acrylic shutters, tall units and premium accessories run ₹2.5–4 lakh; large U-shaped or island kitchens in PU or veneer can go beyond ₹6 lakh. We quote itemised, so you can see exactly what each unit costs.',
      },
      {
        question: 'Which is better for a kitchen: plywood, HDHMR or MDF?',
        answer:
          'For Indian kitchens we recommend BWP (boiling water proof) plywood for the carcass because it resists moisture and holds screws well, or HDHMR for shutters and wet-area cabinets. We avoid plain MDF and particle board in kitchens because they swell with moisture.',
      },
      {
        question: 'Which modular kitchen layout is best?',
        answer:
          'It depends on the room. L-shaped works for most 8–12 ft kitchens; parallel (galley) suits narrow spaces; U-shaped gives maximum storage in a larger room; an island needs at least 10 × 12 ft. We recommend the layout after measuring your kitchen and understanding how you cook.',
      },
      {
        question: 'How long does modular kitchen installation take?',
        answer:
          'Manufacturing takes 3–4 weeks in our workshop and installation 3–5 days on site, so most kitchens are complete within 30–45 days of design approval.',
      },
      {
        question: 'Do you provide a warranty on modular kitchens?',
        answer:
          'Yes. Every Silver Storey kitchen carries a 10-year warranty on modular components and workmanship, and hardware is from Hettich or Ebco, which carry their own manufacturer warranties.',
      },
    ],
    keywords: [
      'modular kitchen design',
      'modular kitchen cost',
      'L shaped modular kitchen',
      'modular kitchen near me',
      'kitchen interior design',
    ],
    related: [
      'full-home-interiors',
      'dining-room-interiors',
      'wardrobe-design',
      '2bhk-interior-design',
    ],
    cityPages: true,
  },
  {
    slug: 'living-room-interiors',
    name: 'Living Room Interior Design',
    shortName: 'Living Room',
    category: 'room',
    description:
      'Living room interior design with TV units, wall panelling, false ceiling, lighting and furniture — designed in 3D, delivered in 45 days. Starting ₹2.4 lakh.',
    intro: [
      'The living room sets the tone for the whole home. Silver Storey designs living rooms that balance a statement — a fluted wood panel, a stone-clad TV wall, a layered cove-lit ceiling — with everyday comfort and enough hidden storage to keep the space calm.',
      'We plan seating for how you live: a sectional facing the TV for family evenings, a formal arrangement for guests, or both in an open-plan living-dining layout. Lighting is designed in three layers (ambient, task, accent) and we coordinate curtains, rugs and décor so the room feels complete on handover day.',
    ],
    startingPriceINR: 240000,
    typicalRangeINR: [240000, 800000],
    includes: [
      'TV unit and feature wall',
      'False ceiling with cove and spot lighting',
      'Wall panelling, wallpaper or textured paint',
      'Sofa, centre table and accent chairs',
      'Display and storage units',
      'Curtains, rugs and décor styling',
    ],
    materials: [
      'Fluted and flat wood panelling',
      'Veneer, laminate and PU finishes',
      'Gypsum and POP false ceilings',
      'Marble, quartz and stone cladding',
      'Philips / Havells lighting',
    ],
    faqs: [
      {
        question: 'How much does living room interior design cost?',
        answer:
          'Silver Storey living room packages start at ₹2.4 lakh, covering a TV unit, false ceiling, lighting and wall finish. Adding loose furniture, panelling and premium stone cladding typically brings the total to ₹4–8 lakh.',
      },
      {
        question: 'What is trending in living room design in India?',
        answer:
          'Fluted wood panels, warm neutral palettes, curved sofas, cove-lit ceilings, large-format stone TV walls and indoor greenery are dominant. We adapt trends to your home’s light and proportions rather than copying a catalogue.',
      },
      {
        question: 'Can you design an open-plan living and dining room?',
        answer:
          'Yes — most new apartments have a combined living-dining space. We zone it with ceiling design, flooring changes, partial partitions or furniture placement so each area feels defined but connected.',
      },
    ],
    keywords: [
      'living room interior design',
      'living room design ideas',
      'TV unit design',
      'hall interior design',
      'drawing room design',
    ],
    related: [
      'false-ceiling-design',
      'dining-room-interiors',
      'full-home-interiors',
      'luxury-interior-design',
    ],
    cityPages: true,
  },
  {
    slug: 'bedroom-interiors',
    name: 'Bedroom Interior Design',
    shortName: 'Bedroom',
    category: 'room',
    description:
      'Master, guest and kids’ bedroom interiors — wardrobes, headboard walls, false ceilings, dressers and study units — with 3D visualisation and a 10-year warranty. Starting ₹2.1 lakh.',
    intro: [
      'A bedroom should do two things well: help you rest and hide clutter. Silver Storey bedroom packages centre on a well-planned wardrobe (sliding or hinged, with loft), a headboard wall that gives the room its character, and layered lighting that lets you dim down at night.',
      'For master bedrooms we add dressers, walk-in wardrobes where space allows, and reading nooks; for kids’ rooms, study desks and flexible storage that grows with them; for guest rooms, compact multi-use furniture.',
    ],
    startingPriceINR: 210000,
    typicalRangeINR: [210000, 700000],
    includes: [
      'Hinged or sliding wardrobe with loft',
      'Bed with hydraulic or box storage',
      'Headboard wall and panelling',
      'False ceiling and bedside lighting',
      'Dresser, study or TV unit',
      'Curtains and soft furnishings',
    ],
    materials: [
      'BWP / MR plywood wardrobes',
      'Laminate, acrylic, veneer and glass shutters',
      'Upholstered and wooden headboards',
      'Blackout and sheer drapery',
    ],
    faqs: [
      {
        question: 'How much does bedroom interior design cost?',
        answer:
          'Silver Storey bedroom packages start at ₹2.1 lakh including a wardrobe, bed, headboard wall and false ceiling. Master suites with walk-in wardrobes, dressers and premium finishes range ₹4–7 lakh.',
      },
      {
        question: 'Sliding or hinged wardrobe — which is better?',
        answer:
          'Hinged wardrobes give full access and more internal fittings; sliding wardrobes save floor space in compact rooms. We usually recommend hinged for rooms wider than 11 ft and sliding for narrower bedrooms or where the bed sits close to the wardrobe.',
      },
      {
        question: 'Can you design a bedroom as per vastu?',
        answer:
          'Yes. We can orient the bed, wardrobe and mirror placement in line with vastu guidelines while keeping the design modern and practical.',
      },
    ],
    keywords: [
      'bedroom interior design',
      'master bedroom design',
      'wardrobe design for bedroom',
      'kids bedroom design',
      'bedroom false ceiling',
    ],
    related: [
      'wardrobe-design',
      'kids-room-interiors',
      'full-home-interiors',
      'false-ceiling-design',
    ],
    cityPages: true,
  },
  {
    slug: 'bathroom-interiors',
    name: 'Bathroom Interior Design',
    shortName: 'Bathroom',
    category: 'room',
    description:
      'Bathroom interior design and renovation — vanity units, wall-hung sanitaryware, glass partitions, tiling and lighting with Kohler fittings. Starting ₹1.8 lakh.',
    intro: [
      'Bathrooms are the most technically demanding rooms to get right — waterproofing, slopes, plumbing points and ventilation all have to be perfect before the beautiful finishes go on. Silver Storey designs bathrooms that feel like a hotel: wall-hung WCs, frameless glass showers, floating vanities with drawer storage, and warm, layered lighting.',
      'We specify moisture-proof materials throughout — WPC or marine-grade vanities, large-format vitrified tiles, SS-304 fittings — and work with Kohler and equivalent brands for sanitaryware and faucets.',
    ],
    startingPriceINR: 180000,
    typicalRangeINR: [180000, 500000],
    includes: [
      'Layout with wet and dry zones',
      'Vanity with storage',
      'Wall-hung WC and concealed cistern',
      'Glass shower partition',
      'Wall and floor tiling',
      'Mirror, lighting and ventilation',
      'Waterproofing and plumbing',
    ],
    materials: [
      'WPC / marine ply vanities',
      'Vitrified and large-format tiles',
      'Kohler sanitaryware and faucets',
      'Toughened glass partitions',
      'SS-304 accessories',
    ],
    faqs: [
      {
        question: 'How much does a bathroom renovation cost?',
        answer:
          'Silver Storey bathroom packages start at ₹1.8 lakh for a standard 5 × 8 ft bathroom including tiling, vanity, sanitaryware and a glass partition. Larger master bathrooms with premium tiles and fittings run ₹3–5 lakh.',
      },
      {
        question: 'How long does a bathroom renovation take?',
        answer:
          'A complete strip-out and refit typically takes 12–18 working days including waterproofing cure time.',
      },
      {
        question: 'What vanity material is best for Indian bathrooms?',
        answer:
          'WPC (wood-plastic composite) or marine-grade plywood with a laminate or PU finish. We avoid MDF and particle board, which swell with moisture.',
      },
    ],
    keywords: [
      'bathroom interior design',
      'bathroom renovation',
      'bathroom vanity design',
      'modern bathroom design India',
      'bathroom remodeling cost',
    ],
    related: [
      'full-home-interiors',
      'bedroom-interiors',
      'renovation-remodeling',
    ],
    cityPages: false,
  },
  {
    slug: 'dining-room-interiors',
    name: 'Dining Room Interior Design',
    shortName: 'Dining Room',
    category: 'room',
    description:
      'Dining room interiors — dining tables, crockery units, bar counters, feature walls and pendant lighting designed for Indian family living. Starting ₹1 lakh.',
    intro: [
      'The dining area is where Indian families actually gather, so we design it to work for daily meals and festival crowds alike. Silver Storey dining packages include a crockery unit sized for your collection, a table and chairs proportioned to the room, a feature wall or mirror to add depth, and pendant lighting that sets the mood.',
      'In open-plan homes we design the dining zone as a bridge between kitchen and living room, often with a breakfast counter or bar unit doing double duty as a partition.',
    ],
    startingPriceINR: 100000,
    typicalRangeINR: [100000, 350000],
    includes: [
      'Dining table and chairs',
      'Crockery unit or sideboard',
      'Feature wall, mirror or panelling',
      'Pendant or chandelier lighting',
      'Bar or breakfast counter (optional)',
    ],
    materials: [
      'Solid wood, veneer and marble table tops',
      'Laminate / veneer crockery units',
      'Fluted glass and mirror panels',
    ],
    faqs: [
      {
        question: 'How much does dining room interior design cost?',
        answer:
          'Silver Storey dining packages start at ₹1 lakh including a crockery unit, feature wall and lighting; a full set with a solid wood table, chairs and bar unit runs ₹2–3.5 lakh.',
      },
      {
        question: 'What size dining table fits my room?',
        answer:
          'Allow at least 36 inches (3 ft) of clearance around the table. A 6-seater needs roughly 10 × 8 ft; a 4-seater fits in 8 × 7 ft. We measure and recommend the right size during the site visit.',
      },
    ],
    keywords: [
      'dining room interior design',
      'dining room design ideas',
      'crockery unit design',
      'dining area design',
    ],
    related: [
      'living-room-interiors',
      'modular-kitchen',
      'full-home-interiors',
    ],
    cityPages: false,
  },
  {
    slug: 'home-office-interiors',
    name: 'Home Office Interior Design',
    shortName: 'Home Office',
    category: 'room',
    description:
      'Home office and study room interiors — ergonomic desks, storage walls, acoustic panelling, lighting and video-call-ready backdrops. Starting ₹2 lakh.',
    intro: [
      'Hybrid work has made the home office a permanent room. Silver Storey designs workspaces that are ergonomic (correct desk height, monitor placement and chair), well-lit (daylight plus 4000K task lighting), quiet (acoustic panels and solid doors) and camera-ready — with a backdrop you are happy to show on video calls.',
      'For compact flats we build fold-away desks and study nooks inside wardrobes or under lofts; for larger homes, full library walls and dual-workstation rooms.',
    ],
    startingPriceINR: 200000,
    typicalRangeINR: [200000, 500000],
    includes: [
      'Ergonomic desk and chair',
      'Storage wall and open shelving',
      'Acoustic panelling',
      'Task and ambient lighting',
      'Cable management and power points',
      'Video-call backdrop design',
    ],
    materials: [
      'Veneer and laminate desks',
      'Fabric acoustic panels',
      'Fluted wood backdrops',
      'LED task lighting',
    ],
    faqs: [
      {
        question: 'How much does a home office interior cost?',
        answer:
          'Silver Storey home office packages start at ₹2 lakh for a desk, storage wall, lighting and backdrop; larger library-style rooms with acoustic treatment range ₹3–5 lakh.',
      },
      {
        question: 'Can you fit a home office into a 2BHK?',
        answer:
          'Yes. We design study nooks within bedrooms, convert balconies (where permitted), or build fold-down desks in living rooms so a 2BHK can support full-time remote work.',
      },
    ],
    keywords: [
      'home office interior design',
      'study room design',
      'work from home office design',
      'office room interior',
    ],
    related: [
      'bedroom-interiors',
      'commercial-office-interiors',
      'full-home-interiors',
    ],
    cityPages: false,
  },
  {
    slug: 'wardrobe-design',
    name: 'Wardrobe Design',
    shortName: 'Wardrobes',
    category: 'specialty',
    description:
      'Custom wardrobes — sliding, hinged, walk-in and loft — with internal organisers, mirrors and soft-close hardware, built from BWP plywood with a 10-year warranty.',
    intro: [
      'A wardrobe is the biggest piece of furniture in most bedrooms, and the one that determines whether the room stays tidy. Silver Storey designs wardrobes around your actual wardrobe contents — hanging length for sarees and suits, drawer stacks for folded clothes, dedicated space for luggage, and lofts that use the full ceiling height.',
      'Choose from hinged, sliding, walk-in and L-shaped configurations with laminate, acrylic, veneer, glass or mirror shutters, all built from BWP plywood with Hettich or Ebco hardware.',
    ],
    startingPriceINR: 65000,
    typicalRangeINR: [65000, 350000],
    includes: [
      'Hinged / sliding / walk-in configuration',
      'Internal organisers, drawers and trouser racks',
      'Loft storage',
      'Mirror and dressing unit',
      'Soft-close hardware and lighting',
    ],
    materials: [
      'BWP / MR plywood',
      'Laminate, acrylic, veneer, glass, mirror shutters',
      'Hettich / Ebco hinges and channels',
    ],
    faqs: [
      {
        question: 'How much does a custom wardrobe cost?',
        answer:
          'A 6 × 7 ft hinged laminate wardrobe with loft starts around ₹65,000; 8–10 ft sliding wardrobes in acrylic or glass run ₹1.2–2 lakh; walk-in wardrobes ₹2–3.5 lakh depending on size and fittings.',
      },
      {
        question: 'What is the standard wardrobe depth?',
        answer:
          'For hinged wardrobes, 22–24 inches; for sliding wardrobes, 26–28 inches to allow for the track. Loft depth matches the wardrobe.',
      },
    ],
    keywords: [
      'wardrobe design',
      'sliding wardrobe design',
      'walk in wardrobe',
      'wardrobe design for bedroom',
      'modular wardrobe',
    ],
    related: [
      'bedroom-interiors',
      'full-home-interiors',
      'kids-room-interiors',
    ],
    cityPages: true,
  },
  {
    slug: 'false-ceiling-design',
    name: 'False Ceiling Design',
    shortName: 'False Ceiling',
    category: 'specialty',
    description:
      'Gypsum, POP and wooden false ceiling design with cove lighting, profile lights and AC integration for living rooms, bedrooms and offices.',
    intro: [
      'A false ceiling transforms a flat, harshly lit room into a layered, warm space. Silver Storey designs gypsum, POP and wooden false ceilings that conceal wiring and AC ducting, add indirect cove lighting and profile lights, and frame the room with clean, modern geometry.',
      'We coordinate ceiling design with the lighting plan, fan and AC positions and curtain pelmets so every element sits exactly where it should.',
    ],
    startingPriceINR: 45000,
    typicalRangeINR: [45000, 250000],
    includes: [
      'Gypsum / POP / wooden ceiling design',
      'Cove and profile lighting',
      'Spot and pendant provisions',
      'AC, fan and curtain pelmet integration',
      'Painting and finishing',
    ],
    materials: [
      'Gypsum board (Saint-Gobain / USG)',
      'POP',
      'Wood and PVC panels',
      'LED strip and profile lights',
    ],
    faqs: [
      {
        question: 'How much does a false ceiling cost per sq ft?',
        answer:
          'Gypsum false ceilings typically cost ₹90–160 per sq ft including framing and paint; POP ₹80–140; wooden and designer ceilings ₹250–600 per sq ft. A living room ceiling with cove lighting usually totals ₹45,000–1.2 lakh.',
      },
      {
        question: 'Gypsum or POP — which is better?',
        answer:
          'Gypsum boards are faster, cleaner and give a smoother finish; POP allows more sculptural shapes and is easier to repair. We use gypsum for most modern ceilings and POP for curved or ornate designs.',
      },
    ],
    keywords: [
      'false ceiling design',
      'false ceiling cost',
      'gypsum false ceiling',
      'POP ceiling design',
      'living room false ceiling',
    ],
    related: [
      'living-room-interiors',
      'bedroom-interiors',
      'full-home-interiors',
    ],
    cityPages: true,
  },
  {
    slug: '1bhk-interior-design',
    name: '1BHK Interior Design',
    shortName: '1BHK Interiors',
    category: 'bhk',
    description:
      '1BHK interior design packages that make compact homes feel spacious — smart storage, modular kitchen, wardrobe and multifunctional furniture. Starting ₹3.5 lakh.',
    intro: [
      'A 1BHK rewards clever design more than any other home. Silver Storey 1BHK packages focus on storage that disappears into walls and ceilings, a compact but complete modular kitchen, a wardrobe with loft, and multifunctional furniture — sofa-cum-beds, fold-down desks, storage ottomans — that lets one room do three jobs.',
      'Light palettes, mirrors and continuous flooring make 400–550 sq ft feel airy, and we keep the budget honest with an itemised estimate.',
    ],
    startingPriceINR: 350000,
    typicalRangeINR: [350000, 700000],
    includes: [
      'Compact modular kitchen',
      'Wardrobe with loft',
      'TV unit and storage',
      'Bed with storage',
      'False ceiling and lighting',
      'Multifunctional furniture',
    ],
    materials: [
      'BWP plywood',
      'Laminate and acrylic finishes',
      'Space-saving hardware',
    ],
    faqs: [
      {
        question: 'How much does 1BHK interior design cost?',
        answer:
          'Silver Storey 1BHK packages start at ₹3.5 lakh including a modular kitchen, wardrobe, TV unit, bed and false ceiling; premium finishes take it to ₹5–7 lakh.',
      },
      {
        question: 'How do you make a 1BHK look bigger?',
        answer:
          'Full-height storage, light colours, mirrors, continuous flooring, sliding doors and furniture raised on legs all make the space read larger. We plan sight lines so the eye travels the full length of the flat.',
      },
    ],
    keywords: [
      '1BHK interior design',
      '1BHK interior cost',
      'small flat interior design',
      'compact home interiors',
    ],
    related: ['2bhk-interior-design', 'modular-kitchen', 'wardrobe-design'],
    cityPages: true,
  },
  {
    slug: '2bhk-interior-design',
    name: '2BHK Interior Design',
    shortName: '2BHK Interiors',
    category: 'bhk',
    description:
      '2BHK interior design packages — modular kitchen, two wardrobes, living room TV unit, false ceilings and lighting — delivered in 45 days. Starting ₹5.5 lakh.',
    intro: [
      'The 2BHK is India’s most common home, and Silver Storey has refined a package that covers everything a family needs: a modular kitchen, wardrobes in both bedrooms, a living room TV unit and feature wall, false ceilings with lighting, and finishing touches like curtains and décor.',
      'We have optimised layouts for the standard 2BHK floor plates in major townships, so design moves quickly and pricing is predictable. Every package comes with complimentary 3D visualisation and our 10-year warranty.',
    ],
    startingPriceINR: 550000,
    typicalRangeINR: [550000, 1200000],
    includes: [
      'Modular kitchen',
      'Two wardrobes with lofts',
      'TV unit and living room feature wall',
      'Beds with storage',
      'False ceilings and lighting',
      'Painting, curtains and styling',
    ],
    materials: [
      'BWP plywood',
      'Laminate / acrylic / veneer finishes',
      'Hettich / Ebco hardware',
      'Asian Paints',
    ],
    faqs: [
      {
        question: 'How much does 2BHK interior design cost?',
        answer:
          'Silver Storey 2BHK packages start at ₹5.5 lakh for a complete home in laminate finishes and typically range to ₹12 lakh with acrylic or veneer, premium lighting and loose furniture.',
      },
      {
        question: 'How long does a 2BHK interior take?',
        answer:
          'Design and 3D approval takes 2–3 weeks; execution is completed within 45 days of approval.',
      },
    ],
    keywords: [
      '2BHK interior design',
      '2BHK interior cost',
      '2BHK flat interior',
      '2BHK home interiors package',
    ],
    related: [
      '3bhk-interior-design',
      '1bhk-interior-design',
      'modular-kitchen',
      'full-home-interiors',
    ],
    cityPages: true,
  },
  {
    slug: '3bhk-interior-design',
    name: '3BHK Interior Design',
    shortName: '3BHK Interiors',
    category: 'bhk',
    description:
      '3BHK interior design packages — modular kitchen, three wardrobes, living-dining design, pooja unit, false ceilings and lighting. Starting ₹8 lakh, delivered in 45 days.',
    intro: [
      'A 3BHK gives room for a master suite, a kids’ room and a guest or study room, plus a proper living-dining zone. Silver Storey 3BHK packages plan each bedroom for its purpose, design an open living-dining with a feature wall and crockery unit, and add a pooja unit, foyer storage and utility-area cabinets that most families forget until they move in.',
      'Our itemised quote lets you choose finish grades room by room — acrylic in the kitchen, veneer in the living room, laminate in the guest room — to hit your budget without compromising where it matters.',
    ],
    startingPriceINR: 800000,
    typicalRangeINR: [800000, 1800000],
    includes: [
      'Modular kitchen with tall units',
      'Three wardrobes with lofts',
      'Master bedroom dresser and headboard wall',
      'Living-dining feature wall, TV and crockery units',
      'Pooja unit and foyer console',
      'False ceilings and lighting throughout',
      'Painting, curtains and styling',
    ],
    materials: [
      'BWP plywood',
      'Laminate / acrylic / veneer / PU',
      'Hettich / Ebco',
      'Asian Paints',
      'Philips lighting',
    ],
    faqs: [
      {
        question: 'How much does 3BHK interior design cost?',
        answer:
          'Silver Storey 3BHK packages start at ₹8 lakh and typically range to ₹18 lakh depending on carpet area (1,100–1,800 sq ft), finish grade and loose furniture.',
      },
      {
        question: 'What is included in a 3BHK interior package?',
        answer:
          'Modular kitchen, three wardrobes, beds, TV and crockery units, pooja unit, false ceilings, lighting, painting and soft furnishings — a complete, move-in-ready home.',
      },
    ],
    keywords: [
      '3BHK interior design',
      '3BHK interior cost',
      '3BHK flat interior design',
      '3BHK home interiors',
    ],
    related: [
      '4bhk-interior-design',
      '2bhk-interior-design',
      'full-home-interiors',
      'modular-kitchen',
    ],
    cityPages: true,
  },
  {
    slug: '4bhk-interior-design',
    name: '4BHK & Duplex Interior Design',
    shortName: '4BHK Interiors',
    category: 'bhk',
    description:
      'Luxury 4BHK, duplex and penthouse interior design — bespoke joinery, home theatre, walk-in wardrobes, staircase design and automation. Starting ₹14 lakh.',
    intro: [
      'Large homes need a designer who can hold a single vision across many rooms. Silver Storey 4BHK, duplex and penthouse projects are led by a principal designer who develops a material and colour story for the whole home, then details each space — a double-height living room, a home theatre, a walk-in master wardrobe, a staircase with integrated lighting — so it all reads as one.',
      'We integrate smart-home automation, custom furniture and art curation, and manage the longer construction sequence with a dedicated project manager and weekly reports.',
    ],
    startingPriceINR: 1400000,
    typicalRangeINR: [1400000, 4000000],
    includes: [
      'Whole-home concept and material story',
      'Modular kitchen with island',
      'Four bedrooms with walk-in or large wardrobes',
      'Formal and family living areas',
      'Home theatre or den',
      'Staircase and double-height design',
      'Smart-home automation',
      'Custom furniture and art curation',
    ],
    materials: [
      'Veneer, PU and natural stone',
      'Italian marble and engineered wood floors',
      'Designer lighting',
      'Automation (lighting, curtains, AC)',
    ],
    faqs: [
      {
        question: 'How much does 4BHK interior design cost?',
        answer:
          'Silver Storey 4BHK and duplex projects start at ₹14 lakh and typically range from ₹20 to 40 lakh for luxury finishes, automation and custom furniture.',
      },
      {
        question: 'How long does a 4BHK or duplex interior take?',
        answer:
          'Design development usually takes 4–6 weeks; execution 45–75 days depending on civil work and custom furniture.',
      },
    ],
    keywords: [
      '4BHK interior design',
      'duplex interior design',
      'penthouse interior design',
      'luxury home interiors',
    ],
    related: [
      'villa-interior-design',
      'luxury-interior-design',
      '3bhk-interior-design',
      'full-home-interiors',
    ],
    cityPages: true,
  },
  {
    slug: 'villa-interior-design',
    name: 'Villa & Bungalow Interior Design',
    shortName: 'Villa Interiors',
    category: 'package',
    description:
      'Villa, bungalow and independent house interior design — landscape-to-living continuity, double-height spaces, staircases, home theatres and bespoke furniture.',
    intro: [
      'Villas and independent houses give the freedom that apartments cannot: double-height volumes, indoor–outdoor living, a proper foyer and staircase, and rooms that can be planned around views and light. Silver Storey designs villas as a complete narrative — from the entrance gate to the master bath — with a single material palette and lighting concept.',
      'We handle the complexity that comes with size: multiple contractors, landscape coordination, home automation and custom-made furniture, with one project manager and a fixed, itemised budget.',
    ],
    startingPriceINR: 1800000,
    typicalRangeINR: [1800000, 8000000],
    includes: [
      'Whole-villa concept design',
      'Foyer, staircase and double-height living',
      'Modular kitchen and pantry',
      'All bedrooms with walk-in wardrobes',
      'Home theatre, gym or study',
      'Terrace, deck and balcony design',
      'Automation and security integration',
      'Custom furniture and art',
    ],
    materials: [
      'Natural stone and marble',
      'Solid wood and veneer',
      'Engineered flooring',
      'Architectural lighting',
    ],
    faqs: [
      {
        question: 'How much does villa interior design cost?',
        answer:
          'Silver Storey villa projects start around ₹18 lakh for a compact 3-bedroom villa and range to ₹80 lakh or more for large luxury bungalows with custom furniture and automation. We provide a detailed itemised estimate after the site visit.',
      },
      {
        question: 'Do you handle villa projects outside Kolkata?',
        answer:
          'Yes. We run villa projects across India with on-site supervision, a dedicated project manager and weekly video walkthroughs for clients who live elsewhere or abroad.',
      },
    ],
    keywords: [
      'villa interior design',
      'bungalow interior design',
      'independent house interior',
      'luxury villa interiors',
    ],
    related: [
      '4bhk-interior-design',
      'luxury-interior-design',
      'full-home-interiors',
    ],
    cityPages: true,
  },
  {
    slug: 'commercial-office-interiors',
    name: 'Commercial & Office Interior Design',
    shortName: 'Office Interiors',
    category: 'commercial',
    description:
      'Corporate office, co-working and commercial interior design — workstations, cabins, meeting rooms, reception, acoustics and branding — delivered on schedule.',
    intro: [
      'A well-designed office is a recruiting and productivity tool. Silver Storey designs commercial interiors that balance open collaboration zones with focused cabins and quiet rooms, express your brand at reception and in meeting spaces, and meet the practical requirements of acoustics, HVAC, data cabling and fire compliance.',
      'We work with startups, professional firms, clinics and corporates on fit-outs from 1,000 to 50,000 sq ft, with fixed timelines that respect your lease commencement date.',
    ],
    startingPriceINR: 1200,
    typicalRangeINR: [1200, 3500],
    priceNote:
      'Indicative cost per sq ft of carpet area; depends on density, finish grade and MEP scope.',
    includes: [
      'Space planning and workstation layouts',
      'Reception and brand wall',
      'Cabins, meeting and conference rooms',
      'Cafeteria and breakout zones',
      'Acoustic and ceiling design',
      'Electrical, data and HVAC coordination',
      'Furniture and signage',
    ],
    materials: [
      'Modular workstations',
      'Glass partitions',
      'Acoustic panels and carpets',
      'Commercial-grade laminates and vinyl',
    ],
    faqs: [
      {
        question: 'How much does office interior design cost per sq ft?',
        answer:
          'Commercial fit-outs typically cost ₹1,200–3,500 per sq ft depending on workstation density, finish grade and MEP scope. A 2,000 sq ft office with cabins, meeting room and reception usually totals ₹30–50 lakh.',
      },
      {
        question: 'How long does an office fit-out take?',
        answer:
          'Most 2,000–5,000 sq ft offices are completed within 6–10 weeks of design approval. We align the schedule with your lease and IT commissioning dates.',
      },
    ],
    keywords: [
      'office interior design',
      'commercial interior design',
      'corporate office interiors',
      'office fit out',
      'coworking interior design',
    ],
    related: [
      'retail-store-interiors',
      'restaurant-cafe-interiors',
      'home-office-interiors',
    ],
    cityPages: true,
  },
  {
    slug: 'retail-store-interiors',
    name: 'Retail Store & Showroom Interior Design',
    shortName: 'Retail Interiors',
    category: 'commercial',
    description:
      'Retail store, showroom and boutique interior design — customer journey planning, display systems, lighting, branding and fast fit-outs.',
    intro: [
      'Retail design is about how people move and what they notice. Silver Storey designs stores and showrooms around the customer journey — entrance impact, sight lines to hero products, easy browsing, and a checkout that encourages one more purchase — with lighting that makes merchandise look its best.',
      'We deliver fast, durable fit-outs for jewellery, fashion, electronics, furniture and automobile showrooms, coordinating brand guidelines, signage and display systems.',
    ],
    startingPriceINR: 1500,
    typicalRangeINR: [1500, 5000],
    priceNote:
      'Indicative cost per sq ft; jewellery and luxury showrooms sit at the upper end.',
    includes: [
      'Customer journey and layout planning',
      'Façade and signage',
      'Display systems and shelving',
      'Trial rooms and counters',
      'Accent and ambient lighting',
      'Storage and back office',
    ],
    materials: [
      'Custom display units',
      'Glass and acrylic',
      'Track and accent lighting',
      'Durable commercial flooring',
    ],
    faqs: [
      {
        question: 'How much does retail store interior design cost?',
        answer:
          'Store fit-outs range from ₹1,500 to 5,000 per sq ft depending on category — apparel and electronics at the lower end, jewellery and luxury at the top.',
      },
    ],
    keywords: [
      'retail store interior design',
      'showroom interior design',
      'shop interior design',
      'boutique interior design',
    ],
    related: ['commercial-office-interiors', 'restaurant-cafe-interiors'],
    cityPages: false,
  },
  {
    slug: 'restaurant-cafe-interiors',
    name: 'Restaurant, Café & Hospitality Interior Design',
    shortName: 'Restaurant & Café',
    category: 'commercial',
    description:
      'Restaurant, café, bar and boutique hotel interior design — seating layouts, kitchen coordination, lighting, acoustics and Instagram-worthy concepts.',
    intro: [
      'Hospitality interiors have to earn revenue per square foot and photographs per table. Silver Storey designs restaurants, cafés, bars and boutique stays with seating plans that maximise covers without crowding, lighting that flatters food and faces, acoustics that keep conversation comfortable, and a concept strong enough to be shared.',
      'We coordinate the commercial kitchen, exhaust, fire and licensing requirements with the design so opening day is not delayed.',
    ],
    startingPriceINR: 1800,
    typicalRangeINR: [1800, 6000],
    priceNote:
      'Indicative cost per sq ft of front-of-house area, excluding kitchen equipment.',
    includes: [
      'Concept and theme development',
      'Seating layout and cover optimisation',
      'Bar and counter design',
      'Lighting and acoustics',
      'Kitchen and service coordination',
      'Façade, signage and styling',
    ],
    materials: [
      'Durable, easy-clean surfaces',
      'Custom seating and upholstery',
      'Feature lighting',
      'Terrazzo, tile and wood flooring',
    ],
    faqs: [
      {
        question: 'How much does restaurant interior design cost?',
        answer:
          'Restaurant and café interiors typically cost ₹1,800–6,000 per sq ft for the front-of-house, excluding kitchen equipment. A 1,500 sq ft café usually totals ₹30–60 lakh.',
      },
    ],
    keywords: [
      'restaurant interior design',
      'cafe interior design',
      'hotel interior design',
      'bar interior design',
      'hospitality interiors',
    ],
    related: ['retail-store-interiors', 'commercial-office-interiors'],
    cityPages: false,
  },
  {
    slug: 'kids-room-interiors',
    name: 'Kids’ Room Interior Design',
    shortName: 'Kids’ Room',
    category: 'room',
    description:
      'Kids’ bedroom and study room interiors — bunk beds, study desks, themed walls, safe materials and storage that grows with your child.',
    intro: [
      'Children’s rooms need to be safe, flexible and fun. Silver Storey designs kids’ rooms with rounded edges, low-VOC paints and finishes, bunk or trundle beds for shared rooms, study desks with proper lighting, and storage that adapts as toys give way to books and gadgets.',
      'Themes are applied in changeable layers — wall colour, decals, bedding — so the room can grow up without a full redo.',
    ],
    startingPriceINR: 180000,
    typicalRangeINR: [180000, 450000],
    includes: [
      'Bunk, trundle or single beds with storage',
      'Study desk and shelving',
      'Wardrobe with adjustable shelves',
      'Themed feature wall',
      'Safe, low-VOC finishes and lighting',
    ],
    materials: [
      'Low-VOC Asian Paints',
      'BWP plywood with rounded edges',
      'Soft-close hardware',
      'Washable laminates',
    ],
    faqs: [
      {
        question: 'How much does a kids’ room interior cost?',
        answer:
          'Silver Storey kids’ room packages start at ₹1.8 lakh including a bed, study desk, wardrobe and feature wall.',
      },
    ],
    keywords: [
      'kids room interior design',
      'children bedroom design',
      'kids study room design',
      'bunk bed room design',
    ],
    related: ['bedroom-interiors', 'wardrobe-design', 'full-home-interiors'],
    cityPages: false,
  },
  {
    slug: 'pooja-room-design',
    name: 'Pooja Room & Mandir Design',
    shortName: 'Pooja Room',
    category: 'specialty',
    description:
      'Pooja room and wall-mounted mandir design — vastu-compliant placement, carved wood, marble, brass, jaali doors and backlit temple units.',
    intro: [
      'A pooja space is the spiritual heart of an Indian home, and Silver Storey designs it with the same care as any other room — whether it is a dedicated pooja room in a villa or a wall-mounted mandir unit in a 2BHK. We follow vastu guidelines for orientation, use materials like teak, marble and brass, and add jaali doors, backlighting and storage for pooja essentials.',
    ],
    startingPriceINR: 45000,
    typicalRangeINR: [45000, 300000],
    includes: [
      'Vastu-compliant placement',
      'Mandir unit or full pooja room',
      'Jaali doors and panels',
      'Backlit temple backdrop',
      'Storage for pooja items',
      'Bell, diya and incense provisions',
    ],
    materials: [
      'Teak and carved wood',
      'Marble and Corian',
      'Brass fittings',
      'CNC-cut jaali panels',
    ],
    faqs: [
      {
        question: 'How much does a pooja room design cost?',
        answer:
          'Wall-mounted mandir units start at ₹45,000; a full pooja room with marble, carved doors and backlighting ranges ₹1.5–3 lakh.',
      },
      {
        question: 'Which direction should a pooja room face?',
        answer:
          'Vastu recommends the north-east corner with the deity facing west or east. Where the plan does not allow it, we find the next-best orientation and keep the space clean, elevated and well-lit.',
      },
    ],
    keywords: [
      'pooja room design',
      'mandir design for home',
      'pooja unit design',
      'temple design for home',
    ],
    related: [
      'living-room-interiors',
      'full-home-interiors',
      '3bhk-interior-design',
    ],
    cityPages: false,
  },
  {
    slug: 'luxury-interior-design',
    name: 'Luxury Interior Design',
    shortName: 'Luxury Interiors',
    category: 'package',
    description:
      'Luxury interior design for premium apartments, penthouses and villas — bespoke joinery, natural stone, designer lighting, automation and curated art.',
    intro: [
      'Luxury is precision, proportion and restraint. Silver Storey’s luxury studio designs homes where every junction is detailed, every material is chosen for how it ages, and every room is lit like a gallery. We work with natural stone, book-matched veneers, hand-finished metals, custom-made furniture and designer lighting, and integrate automation so the technology disappears.',
      'Projects are led by a principal designer with a dedicated site team, and we manage sourcing from India’s best craft clusters — Jaipur stone, Saharanpur carving, Kashmir walnut, Bengal cane — to give your home a genuinely Indian luxury signature.',
    ],
    startingPriceINR: 2500000,
    typicalRangeINR: [2500000, 15000000],
    includes: [
      'Principal-designer-led concept',
      'Bespoke joinery and furniture',
      'Natural stone and premium veneers',
      'Designer and architectural lighting',
      'Home automation',
      'Art and accessory curation',
      'White-glove project management',
    ],
    materials: [
      'Italian and Indian marble',
      'Book-matched veneers',
      'Brass, bronze and blackened steel',
      'Silk, linen and leather',
    ],
    faqs: [
      {
        question: 'What makes an interior "luxury"?',
        answer:
          'Not the price tag — the detailing. Aligned joints, consistent shadow gaps, hand-finished materials, layered lighting and furniture proportioned to the room. Our luxury projects are defined by this level of precision.',
      },
      {
        question: 'How much does luxury interior design cost?',
        answer:
          'Silver Storey luxury projects begin around ₹25 lakh for a premium apartment and range to ₹1.5 crore or more for large villas with custom furniture and automation.',
      },
    ],
    keywords: [
      'luxury interior design',
      'luxury interior designer',
      'high end interior design',
      'premium home interiors',
      'best luxury interior designers in India',
    ],
    related: [
      'villa-interior-design',
      '4bhk-interior-design',
      'full-home-interiors',
    ],
    cityPages: true,
  },
  {
    slug: 'renovation-remodeling',
    name: 'Home Renovation & Remodelling',
    shortName: 'Renovation',
    category: 'package',
    description:
      'Home renovation and remodelling — kitchen and bathroom refits, layout changes, flooring, painting, electrical rewiring and complete makeovers of older flats and houses.',
    intro: [
      'Renovating an older home is different from fitting out a new one: there are surprises behind the walls, existing plumbing and wiring to work around, and often a family living in the house during the work. Silver Storey has renovated 1970s cooperative flats, 1990s builder floors and heritage homes, and we plan every project with a proper survey, a phased schedule and dust control.',
      'Scope can range from a kitchen and bathroom refit to a complete gut renovation with new flooring, false ceilings, rewiring and a modern layout.',
    ],
    startingPriceINR: 300000,
    typicalRangeINR: [300000, 3000000],
    includes: [
      'Condition survey and scope planning',
      'Demolition and civil changes',
      'Plumbing and electrical rewiring',
      'Flooring and tiling',
      'Kitchen and bathroom refits',
      'Painting, ceilings and joinery',
      'Phased execution for occupied homes',
    ],
    materials: [
      'Vitrified, wooden and marble flooring',
      'BWP plywood joinery',
      'Havells wiring',
      'Asian Paints',
    ],
    faqs: [
      {
        question: 'How much does home renovation cost in India?',
        answer:
          'Partial renovations (kitchen + bathrooms + paint) typically cost ₹3–8 lakh; full renovations with flooring, rewiring and new interiors ₹10–30 lakh depending on size.',
      },
      {
        question: 'Can I stay in my home during renovation?',
        answer:
          'For partial renovations, yes — we phase the work room by room with dust barriers. For full renovations we recommend moving out for 4–8 weeks.',
      },
    ],
    keywords: [
      'home renovation',
      'house remodeling',
      'flat renovation cost',
      'old house renovation',
      'interior renovation',
    ],
    related: ['modular-kitchen', 'bathroom-interiors', 'full-home-interiors'],
    cityPages: false,
  },
];

export const SERVICE_BY_SLUG: Record<string, ServiceData> = Object.fromEntries(
  SERVICES.map((s) => [s.slug, s]),
);

export function getService(slug: string) {
  return SERVICE_BY_SLUG[slug];
}

export function servicePath(service: ServiceData | string) {
  const slug = typeof service === 'string' ? service : service.slug;
  return `/services/${slug}`;
}

export function serviceCityPath(
  service: ServiceData | string,
  citySlug: string,
) {
  return `${servicePath(service)}/${citySlug}`;
}

export const SERVICES_WITH_CITY_PAGES = SERVICES.filter((s) => s.cityPages);

export const SERVICE_CATEGORIES: { key: ServiceCategory; label: string }[] = [
  { key: 'package', label: 'Complete Home Packages' },
  { key: 'bhk', label: 'By Home Size' },
  { key: 'room', label: 'Room-wise Design' },
  { key: 'specialty', label: 'Specialised Services' },
  { key: 'commercial', label: 'Commercial Interiors' },
];
