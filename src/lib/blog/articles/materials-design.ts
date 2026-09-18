import type { Article } from '../types';

const AUTHOR = 'Silver Storey Editorial Team';

export const MATERIALS_DESIGN_ARTICLES: Article[] = [
  {
    slug: 'plywood-vs-hdhmr-vs-mdf',
    title:
      'Plywood vs HDHMR vs MDF vs Particle Board: Which Is Best for Indian Homes?',
    description:
      'An honest comparison of plywood (MR, BWR, BWP), HDHMR, MDF and particle board for kitchens, wardrobes and humid Indian cities — with costs, strengths, weaknesses and our recommendations.',
    category: 'materials-finishes',
    tags: [
      'plywood vs MDF',
      'HDHMR',
      'BWP plywood',
      'modular kitchen material',
      'wardrobe material',
    ],
    publishedAt: '2026-02-18',
    updatedAt: '2026-07-30',
    author: AUTHOR,
    keyTakeaways: [
      'Use BWP (boiling water proof) plywood for kitchens, bathrooms and any home in a humid or coastal city.',
      'HDHMR is an excellent, cost-effective choice for shutters and dry-area cabinets, and holds a painted or laminate finish beautifully.',
      'MR plywood is fine for wardrobes and lofts in dry climates; particle board should be avoided in Indian conditions.',
      'The grade stamp on the board (IS:303 MR, IS:303 BWR, IS:710 BWP) tells you what you are actually buying — ask to see it.',
    ],
    sections: [
      {
        paragraphs: [
          'Interior boards are the skeleton of every modular unit, and they are also where the most misleading claims are made. “Waterproof ply”, “marine ply”, “imported HDF” — the labels are confusing and often wrong. This guide explains what each board actually is, what it costs, and where we use it in Silver Storey projects.',
        ],
      },
      {
        heading: 'Plywood: MR, BWR and BWP explained',
        paragraphs: [
          'Plywood is made of thin wood veneers glued in alternating grain directions, which gives it strength and screw-holding ability. The grade depends on the glue. MR (moisture resistant, IS:303) uses urea-formaldehyde glue and tolerates humidity but not water; it costs ₹55–85 per sq ft for 18 mm. BWR (boiling water resistant) uses a melamine-fortified glue and handles occasional wetting — ₹75–100. BWP (boiling water proof, IS:710, often called marine ply) uses phenol-formaldehyde glue and can survive prolonged water exposure — ₹95–140 per sq ft for a branded 18 mm sheet from Greenply, Century or Kitply.',
          'Beware the term “marine ply”: true IS:710 marine grade is BWP; many sellers use the phrase loosely. Ask for the ISI stamp on the sheet.',
        ],
      },
      {
        heading: 'HDHMR: the modern middle ground',
        paragraphs: [
          'HDHMR (High Density High Moisture Resistant) is an engineered board made from wood fibres compressed at high pressure with moisture-resistant resin. It is denser and more uniform than MDF, does not have plywood’s occasional core gaps, and takes paint, PU and laminate exceptionally well because its surface is perfectly smooth. Price is ₹65–95 per sq ft for 18 mm. We use HDHMR extensively for shutters, especially where a PU or lacquered finish is specified, and for cabinets in dry areas.',
          'Its limitation is screw-holding on repeated stress and behaviour under direct, prolonged water — so we still prefer BWP plywood for kitchen sink units and bathroom vanities.',
        ],
      },
      {
        heading: 'MDF and particle board',
        paragraphs: [
          'Plain MDF is a fibreboard with lower density than HDHMR and standard resin; it is fine for decorative panels, wall mouldings and CNC-cut jaalis but swells badly when wet and does not hold screws well over time. Particle board (chipboard) is compressed wood chips — the cheapest option at ₹30–50 per sq ft and the reason so many “factory” kitchens sag within a few years. We do not use particle board in any Silver Storey project.',
        ],
      },
      {
        heading: 'Comparison at a glance',
        table: {
          headers: [
            'Board',
            'Water resistance',
            'Screw holding',
            'Finish quality',
            'Cost (18 mm)',
            'Best use',
          ],
          rows: [
            [
              'BWP plywood',
              'Excellent',
              'Excellent',
              'Good (needs edge banding)',
              '₹95–140/sq ft',
              'Kitchens, bathrooms, humid cities',
            ],
            [
              'BWR plywood',
              'Good',
              'Excellent',
              'Good',
              '₹75–100/sq ft',
              'Wardrobes near wet walls',
            ],
            [
              'MR plywood',
              'Fair',
              'Excellent',
              'Good',
              '₹55–85/sq ft',
              'Wardrobes, lofts in dry climates',
            ],
            [
              'HDHMR',
              'Good',
              'Good',
              'Excellent (paint/PU)',
              '₹65–95/sq ft',
              'Shutters, dry-area cabinets, panelling',
            ],
            [
              'MDF',
              'Poor',
              'Fair',
              'Excellent',
              '₹45–70/sq ft',
              'Decorative panels, mouldings',
            ],
            [
              'Particle board',
              'Very poor',
              'Poor',
              'Fair',
              '₹30–50/sq ft',
              'Not recommended',
            ],
          ],
        },
      },
      {
        heading: 'What we specify, city by city',
        bullets: [
          'Kolkata, Mumbai, Chennai, Kochi, Goa, Guwahati (humid / coastal): BWP plywood carcasses everywhere; HDHMR or BWP shutters; SS-304 hardware.',
          'Bengaluru, Pune, Hyderabad (moderate / composite): BWP in kitchen and bathrooms, MR or BWR plywood elsewhere, HDHMR shutters.',
          'Delhi NCR, Jaipur, Ahmedabad, Indore (hot / dry): BWP in kitchen, MR plywood or HDHMR elsewhere; heat-stable PU or acrylic finishes.',
          'Shimla, Dehradun, Gangtok (cold hill): kiln-dried plywood or HDHMR to avoid seasonal movement; solid deodar or pine for feature elements.',
        ],
        callout:
          'Every Silver Storey quote names the board grade for each unit. If a quote you receive elsewhere just says “plywood”, ask which grade — the price difference between MR and BWP is real, and so is the difference in lifespan.',
      },
    ],
    faqs: [
      {
        question: 'Is HDHMR better than plywood?',
        answer:
          'For shutters and dry-area cabinets, HDHMR is as good or better — smoother finish, no core gaps, lower cost. For sink units, bathroom vanities and any area with direct water exposure, BWP plywood remains the safer choice.',
      },
      {
        question: 'Which plywood is best for a modular kitchen?',
        answer:
          'BWP (IS:710) plywood from a branded manufacturer such as Greenply or Century. It is the only grade rated for prolonged water exposure.',
      },
      {
        question: 'Is MDF good for wardrobes?',
        answer:
          'Plain MDF is not ideal for wardrobe carcasses because it swells with humidity and holds screws poorly. HDHMR or MR/BWR plywood are better choices for wardrobes.',
      },
    ],
    related: [
      'laminate-vs-acrylic-vs-pu-vs-veneer',
      'modular-kitchen-cost-guide',
      'interior-design-for-humid-coastal-cities',
    ],
  },
  {
    slug: 'laminate-vs-acrylic-vs-pu-vs-veneer',
    title:
      'Laminate vs Acrylic vs PU vs Veneer: Choosing Finishes for Kitchens and Wardrobes',
    description:
      'Compare laminate, acrylic, PU paint, natural veneer, membrane and glass finishes on cost, durability, maintenance and look — and learn where each belongs in an Indian home.',
    category: 'materials-finishes',
    tags: [
      'laminate vs acrylic',
      'PU finish',
      'veneer finish',
      'kitchen finish',
      'wardrobe finish',
    ],
    publishedAt: '2026-03-24',
    author: AUTHOR,
    keyTakeaways: [
      'Laminate is the most durable and economical finish for daily-use units; acrylic gives high gloss; PU gives seamless colour; veneer gives real wood.',
      'Gloss finishes show fingerprints and scratches more than matte — choose by how you live, not just by the showroom.',
      'Mixing finishes (laminate base units, acrylic wall units, veneer feature panel) usually gives the best value.',
    ],
    sections: [
      {
        paragraphs: [
          'Once the board is chosen, the finish is what you will actually see and touch for the next decade. There is no single “best” finish — each has a place — but there are clearly wrong choices for certain rooms. Here is how we think about it.',
        ],
      },
      {
        heading: 'Laminate',
        paragraphs: [
          'A decorative sheet (HPL) pressed onto the board. Available in thousands of colours, wood grains, textures and matte or gloss. Highly scratch- and stain-resistant, easy to clean, and the most economical at ₹120–220 per sq ft finished. Its weaknesses are visible edges (needs matching edge banding) and a slightly “flat” look in cheaper grades. Best for: kitchen base units, wardrobe interiors and shutters, lofts, kids’ rooms, rental properties.',
        ],
      },
      {
        heading: 'Acrylic',
        paragraphs: [
          'A thick acrylic sheet laminated to the board, giving a deep, mirror-like gloss. Costs ₹250–400 per sq ft. UV-stable and does not yellow like older gloss laminates. Shows fingerprints and fine scratches, so it suits wall units and wardrobes more than heavily used base units. Best for: kitchen wall units, sliding wardrobe shutters, TV units in modern homes.',
        ],
      },
      {
        heading: 'PU (polyurethane) paint',
        paragraphs: [
          'A sprayed, multi-coat paint finish applied to HDHMR or plywood, available in matte, satin or gloss and any colour. Gives a seamless, edge-less look because the paint wraps around edges — the most “designer” finish. Costs ₹350–550 per sq ft. Chips can be touched up but the finish is less scratch-resistant than laminate. Best for: living room panelling, statement kitchens, fluted panels, wardrobes in premium homes.',
        ],
      },
      {
        heading: 'Natural veneer',
        paragraphs: [
          'A thin slice of real wood (teak, walnut, oak, ash) pressed onto the board and sealed with PU or melamine. Every sheet is unique; book-matched veneer is the hallmark of luxury interiors. Costs ₹400–700 per sq ft finished, more for exotic species. Needs sealing and is sensitive to prolonged moisture. Best for: living room feature walls, headboards, dining crockery units, study libraries.',
        ],
      },
      {
        heading: 'Membrane, glass and other finishes',
        paragraphs: [
          'PVC membrane (thermofoil) wraps a moulded shutter and gives grooved “shaker” profiles cheaply, but can peel in heat — avoid it in kitchens. Back-painted or fluted glass adds lightness to wall units and wardrobes. Lacquered glass on wardrobe shutters is popular in Delhi NCR and Punjab. Solid wood (teak, sheesham) is beautiful but expensive and prone to movement; we use it for frames and feature pieces, not full carcasses.',
        ],
      },
      {
        heading: 'Comparison',
        table: {
          headers: [
            'Finish',
            'Cost / sq ft',
            'Scratch resistance',
            'Fingerprints',
            'Look',
            'Recommended for',
          ],
          rows: [
            [
              'Laminate (matte)',
              '₹120–220',
              'Excellent',
              'Low',
              'Versatile',
              'Base units, wardrobes, kids’ rooms',
            ],
            [
              'Acrylic (gloss)',
              '₹250–400',
              'Fair',
              'High',
              'Modern, glossy',
              'Wall units, sliding wardrobes',
            ],
            [
              'PU paint',
              '₹350–550',
              'Fair–good',
              'Medium',
              'Seamless, premium',
              'Panelling, statement kitchens',
            ],
            [
              'Natural veneer',
              '₹400–700',
              'Good (sealed)',
              'Low',
              'Warm, luxurious',
              'Feature walls, headboards',
            ],
            [
              'Membrane',
              '₹150–250',
              'Fair',
              'Low',
              'Profiled',
              'Dry-area wardrobes only',
            ],
          ],
        },
      },
      {
        heading: 'Our mix-and-match rule',
        paragraphs: [
          'Spend on what you see and touch most. In a typical Silver Storey 3BHK: laminate for wardrobe interiors, lofts and kitchen base units; acrylic or PU for kitchen wall units and the master wardrobe; veneer or PU for the living room feature wall. This keeps the budget honest without the home looking “budget”.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Which finish is best for a modular kitchen in India?',
        answer:
          'Laminate for base units (durability, easy cleaning) with acrylic or PU wall units for visual impact. Avoid membrane in kitchens because heat from the hob can cause peeling.',
      },
      {
        question: 'Does acrylic yellow over time?',
        answer:
          'Modern acrylic sheets are UV-stabilised and do not yellow. Older high-gloss laminates and some PU finishes in direct sunlight can, which is why we specify UV-stable grades on sun-facing units.',
      },
    ],
    related: [
      'plywood-vs-hdhmr-vs-mdf',
      'modular-kitchen-cost-guide',
      'living-room-design-ideas',
    ],
  },
  {
    slug: 'living-room-design-ideas',
    title: '12 Living Room Design Ideas for Indian Homes That Actually Work',
    description:
      'Twelve living room ideas we use in real projects — fluted panelling, stone TV walls, cove ceilings, open-plan zoning, curved sofas and more — with practical notes on cost and execution.',
    category: 'design-ideas',
    tags: [
      'living room design',
      'living room ideas',
      'TV unit design',
      'hall design',
      'false ceiling ideas',
    ],
    publishedAt: '2026-05-06',
    author: AUTHOR,
    sections: [
      {
        paragraphs: [
          'A living room has to do many things: host guests, hold the television, absorb the family’s daily life and photograph well. These twelve ideas come straight from Silver Storey project files — each with a note on when it works and roughly what it costs.',
        ],
      },
      {
        heading: '1. Fluted wood panelling behind the TV',
        paragraphs: [
          'Vertical fluted panels in PU or veneer add texture and rhythm without clutter. Works best on the longest wall, run floor to ceiling. ₹450–900 per sq ft depending on finish.',
        ],
      },
      {
        heading: '2. Large-format stone or marble-look TV wall',
        paragraphs: [
          'A single 8 × 4 ft sintered stone or Italian marble slab makes a quiet, monumental backdrop. Pair with a floating ledge for the soundbar. ₹40,000–1.5 lakh for the slab and installation.',
        ],
      },
      {
        heading: '3. Layered cove ceiling',
        paragraphs: [
          'A simple peripheral cove with warm 3000K LED strip plus a few adjustable spots gives three lighting scenes from one design. Avoid heavy multi-tier ceilings in rooms under 10 ft height. ₹45,000–1 lakh.',
        ],
      },
      {
        heading: '4. Zoning an open-plan living-dining',
        paragraphs: [
          'Use a change of ceiling design, a rug and a pendant to define the dining zone; keep flooring continuous so the space still reads as one. A slim crockery unit or a fluted partial partition can act as the divider.',
        ],
      },
      {
        heading: '5. A curved or modular sofa',
        paragraphs: [
          'Curves soften rectilinear apartments and encourage conversation. Modular pieces let you reconfigure for parties. Budget ₹60,000–2 lakh for a quality 3-seater plus chaise.',
        ],
      },
      {
        heading: '6. Warm neutrals with one deep accent',
        paragraphs: [
          'Off-white, sand and greige walls with a single deep tone — terracotta, olive, oxblood — on the TV wall or in upholstery. Timeless and forgiving of dust.',
        ],
      },
      {
        heading: '7. Hidden storage everywhere',
        paragraphs: [
          'A TV unit with closed drawers, a window seat with lift-up storage, a console with doors: the living room stays calm when clutter has a home.',
        ],
      },
      {
        heading: '8. Statement lighting',
        paragraphs: [
          'One sculptural pendant or a cluster over the coffee table does more than a dozen downlights. Keep the rest of the lighting layered and dimmable.',
        ],
      },
      {
        heading: '9. Indoor greenery as architecture',
        paragraphs: [
          'A tall fiddle-leaf fig or a planter wall by the window brings life and hides awkward corners. Choose low-maintenance species and self-watering planters.',
        ],
      },
      {
        heading: '10. Sheer plus blackout curtains',
        paragraphs: [
          'Double-track curtains give privacy by day and darkness for movie nights; a ceiling-mounted pelmet integrated into the false ceiling hides the hardware.',
        ],
      },
      {
        heading: '11. A gallery ledge instead of hung frames',
        paragraphs: [
          'A 4-inch picture ledge lets you swap art and photographs without new holes in the wall — practical for Indian homes where families change their mind often.',
        ],
      },
      {
        heading: '12. Regional craft, used sparingly',
        paragraphs: [
          'One Madhubani panel, a Pattachitra scroll, a Channapatna lamp or a block-printed cushion set grounds the room in place. One or two pieces; not a theme park.',
        ],
        callout:
          'Silver Storey living room packages start at ₹2.4 lakh — TV unit, false ceiling, lighting and wall finish — with complimentary 3D visualisation so you can see every idea before it is built.',
      },
    ],
    faqs: [
      {
        question: 'What colours are trending for living rooms in India?',
        answer:
          'Warm neutrals — sand, greige, off-white — with one deep accent such as terracotta, olive green or oxblood. Wood tones in walnut and oak are replacing the darker wenge of previous years.',
      },
      {
        question: 'How much does a living room false ceiling cost?',
        answer:
          'A gypsum cove ceiling for a 12 × 15 ft living room typically costs ₹45,000–1 lakh including lighting provisions and paint.',
      },
    ],
    related: [
      'false-ceiling-design-guide',
      'laminate-vs-acrylic-vs-pu-vs-veneer',
      'interior-design-cost-in-india',
    ],
  },
  {
    slug: 'false-ceiling-design-guide',
    title: 'False Ceiling Design Guide: Types, Costs and Ideas for Every Room',
    description:
      'Gypsum vs POP vs wooden false ceilings, cost per sq ft, lighting integration, minimum ceiling heights and room-by-room design ideas for living rooms, bedrooms and kitchens.',
    category: 'design-ideas',
    tags: [
      'false ceiling',
      'false ceiling design',
      'false ceiling cost',
      'gypsum ceiling',
      'POP ceiling',
    ],
    publishedAt: '2026-05-28',
    author: AUTHOR,
    keyTakeaways: [
      'Gypsum board ceilings cost ₹90–160 per sq ft, POP ₹80–140, wooden and designer ceilings ₹250–600.',
      'Keep at least 9 ft clear height after the false ceiling; below that, use a peripheral cove only.',
      'Plan lighting, fan, AC and curtain pelmets before the ceiling is framed — moving them later is expensive.',
    ],
    sections: [
      {
        paragraphs: [
          'A false ceiling is the fastest way to make a room feel designed: it hides wiring and AC ducts, adds indirect light and gives the space a clear geometry. It is also the item most often over-done. This guide covers the types, the costs and the rules we follow.',
        ],
      },
      {
        heading: 'Types of false ceiling',
        bullets: [
          'Gypsum board: fast, clean, smooth finish; ideal for straight lines and coves. Saint-Gobain or USG boards on a GI frame.',
          'POP (plaster of Paris): hand-applied, allows curves and ornate mouldings; slower and messier but easy to repair.',
          'Wooden / veneer slats: warm, acoustic and architectural; expensive and needs a dry climate or proper sealing.',
          'PVC panels: budget, moisture-proof option for bathrooms and utility areas.',
          'Grid / mineral fibre: commercial offices; accessible for services.',
        ],
      },
      {
        heading: 'Cost per square foot',
        table: {
          headers: ['Type', 'Material + labour', 'Notes'],
          rows: [
            [
              'Gypsum (plain)',
              '₹90–130/sq ft',
              'Includes frame, board, jointing, paint',
            ],
            ['Gypsum with cove', '₹110–160/sq ft', 'Adds LED strip channel'],
            ['POP', '₹80–140/sq ft', 'Curves and mouldings cost more'],
            ['Wooden slat', '₹250–600/sq ft', 'Veneer or solid; sealed'],
            ['PVC', '₹60–100/sq ft', 'Wet areas'],
          ],
        },
      },
      {
        heading: 'Rules we follow',
        numbered: [
          'Never drop below 9 ft clear height in living rooms; in bedrooms, 8 ft 9 in is the floor. If the slab is lower, do a peripheral cove only.',
          'Decide fan, AC (split indoor unit or cassette), spotlights and pendant positions on the drawing before framing.',
          'Integrate a curtain pelmet on window walls so tracks disappear.',
          'Use warm 3000K LED strips in coves; 4000K only in kitchens and studies.',
          'Leave an access hatch near concealed AC drains and junction boxes.',
        ],
      },
      {
        heading: 'Room-by-room ideas',
        bullets: [
          'Living room: peripheral cove with a central flat panel; one pendant over the coffee table; 4–6 adjustable spots for art.',
          'Master bedroom: cove on three sides with a soft bedhead wash; no downlights directly over the pillow.',
          'Kids’ room: simple cove; skip suspended designs that collect dust.',
          'Dining: a dropped rectangular panel echoing the table with a pendant cluster.',
          'Kitchen: flat gypsum ceiling with 4000K spots aligned to the counter; no coves near the hob.',
          'Bathroom: PVC or moisture-resistant gypsum with an exhaust integrated.',
        ],
        callout:
          'Silver Storey false ceilings start at ₹45,000 per room including lighting design, and are coordinated with the electrical and AC plan in your 3D visualisation.',
      },
    ],
    faqs: [
      {
        question: 'Is a false ceiling necessary?',
        answer:
          'Not always. If your slab height is under 9 ft 6 in or you have exposed beams you like, a peripheral cove or track lighting can do the job. It is most valuable when you need to hide AC ducting and wiring or want layered lighting.',
      },
      {
        question: 'Gypsum or POP — which lasts longer?',
        answer:
          'Both last 15+ years if the frame is GI and the room stays dry. Gypsum gives a smoother finish and is faster; POP is easier to repair locally.',
      },
    ],
    related: [
      'living-room-design-ideas',
      'interior-design-cost-in-india',
      'vastu-tips-for-home-interiors',
    ],
  },
  {
    slug: 'modular-kitchen-layouts-guide',
    title:
      'Modular Kitchen Layouts Explained: L-Shaped, U-Shaped, Parallel, Island and Straight',
    description:
      'Which modular kitchen layout suits your room? Minimum sizes, pros and cons, storage capacity and the work-triangle logic behind L, U, parallel, island and straight kitchens.',
    category: 'modular-kitchen',
    tags: [
      'kitchen layout',
      'L shaped kitchen',
      'U shaped kitchen',
      'parallel kitchen',
      'island kitchen',
    ],
    publishedAt: '2026-06-15',
    author: AUTHOR,
    sections: [
      {
        paragraphs: [
          'The layout decides how a kitchen works long before finishes are chosen. It determines the walking distance between hob, sink and fridge (the work triangle), how many people can cook at once, and how much storage fits. Here is how to choose.',
        ],
      },
      {
        heading: 'Straight (single-wall) kitchen',
        paragraphs: [
          'Everything on one wall. Minimum 8 ft length. Best for studio apartments, 1BHKs and open-plan homes where the kitchen is part of the living space. Limited counter space; a tall unit at one end compensates. ₹1.2–1.8 lakh in laminate.',
        ],
      },
      {
        heading: 'L-shaped kitchen',
        paragraphs: [
          'Two adjacent walls. The most common Indian layout — works from 8 × 8 ft upward, gives a natural work triangle and leaves room for a small dining table or breakfast counter. The corner is the challenge: use a carousel or magic corner. ₹1.4–2.4 lakh in laminate.',
        ],
      },
      {
        heading: 'Parallel (galley) kitchen',
        paragraphs: [
          'Two facing walls with a 4–5 ft aisle. Extremely efficient for serious cooks — hob on one side, sink and prep on the other. Common in Mumbai and older Kolkata flats. Needs at least 8 ft width including the aisle. ₹1.8–2.8 lakh.',
        ],
      },
      {
        heading: 'U-shaped kitchen',
        paragraphs: [
          'Three walls, maximum storage and counter space. Needs a room at least 10 × 10 ft so the aisle stays 4 ft wide. Two corners to solve. Ideal for large families and closed kitchens. ₹2.4–3.6 lakh.',
        ],
      },
      {
        heading: 'Island kitchen',
        paragraphs: [
          'An L or straight run plus a freestanding island. Needs 12 × 12 ft or more with 3.5–4 ft clearance all round. The island can hold the hob (needs an island chimney), the sink (needs plumbing under the floor) or just prep and seating. ₹3.2–4.5 lakh and up.',
        ],
      },
      {
        heading: 'Quick chooser',
        table: {
          headers: ['Room size', 'Recommended layout'],
          rows: [
            ['Under 8 × 8 ft', 'Straight or compact L'],
            ['8 × 8 to 10 × 10 ft', 'L-shaped or parallel'],
            ['10 × 10 to 12 × 12 ft', 'U-shaped or L with breakfast counter'],
            ['Over 12 × 12 ft', 'Island or U with island'],
          ],
        },
        callout:
          'Silver Storey designs every kitchen layout in 3D from your actual measurements — free — before we quote.',
      },
    ],
    faqs: [
      {
        question: 'Which kitchen layout is most efficient?',
        answer:
          'For a single cook, an L-shaped or parallel layout gives the tightest work triangle. For two cooks, parallel or U-shaped layouts allow separate zones.',
      },
      {
        question: 'What is the minimum size for an island kitchen?',
        answer:
          'Roughly 12 × 12 ft, to keep at least 3.5 ft of clearance on all sides of the island.',
      },
    ],
    related: [
      'modular-kitchen-cost-guide',
      'plywood-vs-hdhmr-vs-mdf',
      'vastu-tips-for-home-interiors',
    ],
  },
];
