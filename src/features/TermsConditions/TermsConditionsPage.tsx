'use client';

import React, { useState } from 'react';
import HeroControls from '../Hero/components/HeroControls';
import MenuOverlay from '../Hero/components/MenuOverlay';

export default function TermsConditionsPage({
  projectPages = [],
}: {
  projectPages?: { title: string; slug: string }[];
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <section
        className="flex flex-col items-center justify-center px-6 pt-24 pb-16 text-center sm:pt-32 sm:pb-20"
        style={{
          background:
            'linear-gradient(to bottom, rgba(20, 18, 16, 0.8) 0%, rgba(50, 45, 40, 0.5) 40%, #e8e4de 85%, #e8e4de 100%)',
        }}
      >
        <div className="mb-4 w-16 sm:w-20">
          <img
            loading="lazy"
            decoding="async"
            src="/images/home_logo.avif"
            alt="Silver Storey logo"
            className="h-auto w-full object-contain"
          />
        </div>
        <p className="mb-3 text-sm font-light tracking-[0.25em] text-black/80 sm:text-base">
          Silver Storey&apos;s
        </p>
        <h1 className="mb-5 text-4xl leading-tight font-bold tracking-tight text-black sm:text-5xl md:text-6xl lg:text-7xl">
          Terms &amp; Conditions
        </h1>
        <p className="mx-auto max-w-2xl text-sm leading-relaxed text-black/60 sm:text-base">
          Please read our warranty and service terms carefully before engaging
          with our interior design services.
        </p>
      </section>

      {/* ── Content ── */}
      <div style={{ background: '#e8e4de' }}>
        <section className="mx-auto max-w-4xl px-6 pb-24 sm:px-10 sm:pb-32 lg:px-8">
          {/* ══ Modular Systems ══ */}
          <div className="mb-12 sm:mb-16">
            <h2 className="mb-4 text-base font-bold text-black sm:text-lg">
              Modular Systems
            </h2>
            <p className="mb-5 text-sm leading-relaxed text-black sm:text-base">
              Flat 10-year warranty on modular and semi-modular kitchens,
              wardrobes, storage, hardware, and accessories.
            </p>

            {/* Warranty table */}
            <div className="mb-6 overflow-x-auto">
              <table className="w-full text-sm text-black sm:text-base">
                <thead>
                  <tr className="border-b border-black/20">
                    <th className="py-2 pr-6 text-left font-semibold">
                      Product Terms
                    </th>
                    <th className="py-2 pr-6 text-left font-semibold">
                      No. of Years
                    </th>
                    <th className="py-2 text-left font-semibold">Claim</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-black/10">
                    <td className="py-2 pr-6">
                      Cabinets, shutters, drawers, panels
                    </td>
                    <td className="py-2 pr-6">10 years</td>
                    <td className="py-2">100% replacement - free of cost</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-6">Hardware and Accessories</td>
                    <td className="py-2 pr-6">10 years</td>
                    <td className="py-2">100% replacement - free of cost</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <ol className="space-y-4">
              <li className="text-sm text-black sm:text-base">
                <span>1. Silver Storey will honor its warranty when:</span>
                <ul className="mt-2 ml-5 list-none space-y-1.5">
                  {[
                    'The product supplied and installed is properly maintained and used for normal domestic use.',
                    'The product is still owned by the original purchaser.',
                    'The product is still at its original installed position and location.',
                    'The warranty has not expired, subject to limitations set forth through Silver Storey terms & conditions.',
                  ].map((item, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full border border-black/70" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </li>

              <li className="text-sm text-black sm:text-base">
                <span>2. Silver Storey warranty does not include:</span>
                <ul className="mt-2 ml-5 list-none space-y-1.5">
                  {[
                    'Any labor, installation, or transportation costs, or any responsibility for damage that Silver Storey considers as natural wear and tear of finishes and surfaces.',
                    'Any products used or installed in conjunction with Silver Storey kitchen/wardrobe/modular storage such as electrical & plumbing fixtures, countertops, and appliances. Any use of Silver Storey cabinetry or component parts which are contrary to instructions furnished by Silver Storey will void this warranty.',
                    'Any cabinetry or component parts that Silver Storey considers to have been subject to alteration, modification, accident, abnormal use, extreme temperatures, continuous contact with water, high moisture levels, or use of harsh and/or abrasive cleaning chemicals.',
                    'Normal incidental deterioration like nicks, cuts, scratches, and abrasions resulting from normal use during the standard life of the product.',
                  ].map((item, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full border border-black/70" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </li>

              {[
                '3. Silver Storey will not be held responsible for any claims arising out of defects due to material or workmanship of products not listed under claim terms.',
                '4. Silver Storey warranty does not cover natural wear and tear or damage caused by rough handling or using the product beyond its intended use.',
                '5. Silver Storey reserves the right to alter specifications in keeping with its policy of continuous product evaluation and improvement.',
                '6. The scope of Silver Storey warranty cannot be changed or broadened by any authorized representative of Silver Storey.',
                '7. Repair(s) and/or replacement(s) are subject to the current product offerings of styles and construction options within the Silver Storey product line, at the time of the claim. If a claim is filed after a Silver Storey product becomes obsolete or discontinued, Silver Storey will replace the affected component with a replacement component of a similar style based on availability at the time of the claim.',
                '8. Notify Silver Storey via phone at 8336917221 or email at info@silverstorey.com within 7 days of a defect that comes to notice, such as visual damage or malfunctioning component. Notification post this time will void the Silver Storey warranty.',
                '9. Any decision regarding repair of the said component (in part or whole) solely lies with the authorized Silver Storey representative. The decision will be made following an inspection by the representative whether to repair on-site or return the product to the factory for refurbishing/replacement.',
                '10. Liability: Silver Storey will make all efforts to replace/repair the said defect within a reasonable period of time. Silver Storey will not be liable for any direct/indirect loss to the user due to the defect or delay in providing the service, or any fault arising due to design, application, or installation. In no event shall the liability of Silver Storey, under this warranty, exceed the purchase price of the product or its replacement.',
                '11. The warranty is not renewed in cases where the Silver Storey modular cabinets or components are replaced in part or whole during the said warranty period. The replaced parts will continue to be covered under our warranty only till the remainder of the period as indicated in its respective table. Barring components which carry a lifetime warranty, the warranty for any product under any circumstances will not exceed a period of 10 years (for modular wardrobes & storage) and 10 years (for kitchens) from the date of possession.',
                '12. The terms and conditions are governed by the laws of India. Kolkata courts shall have exclusive jurisdiction to settle any claim or dispute which might arise out of or in connection with these terms and conditions.',
              ].map((item, i) => (
                <li
                  key={i}
                  className="text-sm leading-relaxed text-black sm:text-base"
                >
                  {item}
                </li>
              ))}
            </ol>
          </div>

          {/* ══ On-site Services ══ */}
          <div className="mb-12 sm:mb-16">
            <h2 className="mb-4 text-base font-bold text-black sm:text-lg">
              On-site Services
            </h2>
            <ol className="space-y-4">
              <li className="text-sm text-black sm:text-base">
                <span>
                  1. Warranty Commencement: This warranty shall begin on
                  &ldquo;the commence date&rdquo; that the consumer
                  telephonically lodges their warranty policy with Silver Storey
                  by contacting us at 8336917221 and furnishing all the purchase
                  and personal details requested by Silver Storey. In order for
                  this warranty policy to be valid, the registration needs to be
                  done within 7 (seven) days from the day of handover of the
                  project or the day the customer moves in, whichever is
                  earlier.
                </span>
              </li>
              <li className="text-sm text-black sm:text-base">
                2. Claim Settlement: After settlement of any claim, the warranty
                period will not start afresh.
              </li>
              <li className="text-sm text-black sm:text-base">
                3. Quality Standards: This warranty is governed by the clauses
                mentioned in Silver Storey&apos;s quality standards.
              </li>
              <li className="text-sm text-black sm:text-base">
                4. Inspection: Silver Storey shall provide replacement only
                after inspection.
              </li>
              <li className="text-sm text-black sm:text-base">
                5. Liability for Loss or Damages: Silver Storey shall not be
                liable for any indirect or consequential loss or damages to the
                customer. The customer&apos;s exclusive and sole remedy under
                this warranty policy shall be as mentioned in this clause.
              </li>
              <li className="text-sm text-black sm:text-base">
                6. Accommodation During Repairs: Silver Storey is not liable to
                provide any alternative accommodation during any repair work.
                Customers shall make their own arrangements, if required.
              </li>
              <li className="text-sm text-black sm:text-base">
                <span>
                  7. Exclusions: The warranty policy shall not cover any defects
                  arising out of factors out of control of Silver Storey,
                  including but not limited to:
                </span>
                <ul className="mt-2 ml-5 list-none space-y-1.5">
                  {[
                    'Natural calamities such as earthquakes, cyclones',
                    'Vandalism',
                    'Acts of God',
                    'Abuse or negligence by the customer',
                    'Normal wear and tear',
                    'Surface with contaminants',
                    'Failure or defects in the structure or previous coating',
                    'Any other external factors',
                  ].map((item, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full border border-black/70" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </li>
              {[
                '8. Claim Timing: Any claim made in terms of this warranty policy shall be made within 30 days of the consumer discovering any defect, damage, or failure which gives rise to a claim.',
                '9. Inspections and Tests: Silver Storey reserves the right to carry out inspections and to perform any tests, and may do so either itself or by means of any person nominated by it. Prior to such inspection or testing, the customer shall not be entitled to perform any repairs or remove or tamper with any part of the product/service.',
                '10. Repair Work Timeliness: Silver Storey shall use its best endeavors to ensure that the repair work is completed as soon as possible, but does not assume liability for delay in this respect.',
              ].map((item, i) => (
                <li
                  key={i}
                  className="text-sm leading-relaxed text-black sm:text-base"
                >
                  {item}
                </li>
              ))}
              <li className="text-sm text-black sm:text-base">
                <span>
                  11. Repair Control: Silver Storey, in its sole discretion, is
                  entitled to:
                </span>
                <ul className="mt-2 ml-5 list-none space-y-1.5">
                  {[
                    'Control/monitor repair which is to be carried out in accordance with all its specifications and instructions.',
                    'Appoint a contractor and/or approve the contractor appointed by the customer.',
                  ].map((item, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full border border-black/70" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </li>
              {[
                '12. Repair or Replacement Requests: Silver Storey is liable to process and execute any genuine repair or replacement request made by the customer within the warranty timeline in coordination with the respective brand.',
                '13. Additional Charges: Any additional charges including work done over and above fixing the identified defect will be chargeable by the brand. The cost of these additional charges is to be borne by the customer.',
                '14. No Extended Warranties: There are no warranties expressed or implied under law, which extend beyond the terms set out in this warranty document.',
                '15. Legal Proceedings: Neither party shall commence any court or arbitration proceedings related to the above warranty policy before completing the entire evaluation process. Under such circumstances, the warranty policy will be considered null and void as the issue would be sub judice.',
                '16. Jurisdiction: In case of any disputes, the same is subject to the exclusive jurisdiction of the courts of the respective cities.',
                '17. Confidentiality: The facts and all matters concerning any dispute will be kept confidential by both the customer and Silver Storey at all times.',
                "18. Customer's Responsibilities: The customer is expected to provide the painter(s) with basic necessities such as a stool/ladder, bucket, and water (to mix the paint) at the site.",
                '19. Authorized Representative Decisions: Any decision regarding repair of the said component (in part or whole) solely lies with the authorized Silver Storey representative. The decision will be made following an inspection by the representative.',
                '20. Cost of Dismantling, Reassembly & Relocation: The cost of dismantling, reassembly, and relocation of the product, wherever required, will be borne by the customer. As a standard practice, Silver Storey will cover the product with protective covering, wherever required.',
                '21. Product Offerings: Repair(s) are subject to the current product offerings of styles and construction options within the Silver Storey product line, at the time of the claim. If a claim is filed after a Silver Storey product becomes obsolete or discontinued, Silver Storey will replace the affected component with a replacement component of a similar style/make based on availability at the time of the claim.',
              ].map((item, i) => (
                <li
                  key={i}
                  className="text-sm leading-relaxed text-black sm:text-base"
                >
                  {item}
                </li>
              ))}
            </ol>
          </div>

          {/* ══ Painting ══ */}
          <div className="mb-12 sm:mb-16">
            <h2 className="mb-4 text-base font-bold text-black sm:text-lg">
              Painting
            </h2>
            <ol className="space-y-4">
              {[
                '1. Inspection and Rectification: If a defect is found upon inspection by a company authorized representative, the defect will be rectified in accordance with the claim terms below.',
                "2. Surface Area Requirement: The warranty policy shall apply where the overall paint surface area exceeds 500 sq ft, subject to satisfactory inspection of the surface painted by Silver Storey's representative.",
                '3. Replacement Paint: Silver Storey shall provide replacement paint, as long as the particular paint code (paint code is necessary) is not discontinued by the manufacturer.',
              ].map((item, i) => (
                <li
                  key={i}
                  className="text-sm leading-relaxed text-black sm:text-base"
                >
                  {item}
                </li>
              ))}
              <li className="text-sm text-black sm:text-base">
                <span>
                  4. Paint Failure: Paint failure shall mean any of the
                  following occurrences:
                </span>
                <ul className="mt-2 ml-5 list-none space-y-1.5">
                  {[
                    'Film integrity, flaking and peeling of the paint, caused by one coat of paint coming off from another or the paint film coming off from the substrate.',
                    'Fading of the color shade.',
                    'Growth of fungus and algae on wall surfaces (spread over a minimum area of 10 sq. feet).',
                  ].map((item, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full border border-black/70" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </li>
              {[
                '5. Paint System: The customer has used the entire paint system recommended by Silver Storey. An undercoat of primer along with two coats of putty and 2-3 coats of the paint on all surfaces.',
              ].map((item, i) => (
                <li
                  key={i}
                  className="text-sm leading-relaxed text-black sm:text-base"
                >
                  {item}
                </li>
              ))}
              <li className="text-sm text-black sm:text-base">
                <span>
                  6. Void Warranty: The warranty policy shall be void in the
                  following events:
                </span>
                <ul className="mt-2 ml-5 list-none space-y-1.5">
                  {[
                    'Intermittent dripping of water due to proximity of vegetation or air-conditioning units or any other sources of water leakage like plant pots.',
                    'Water penetration due to capillary rise from the ground level, water leakage, seeping, and continuous dampness of the surface.',
                    'Defects arising due to contamination of surface and failure/defects in the structure.',
                  ].map((item, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full border border-black/70" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </li>
              {[
                '7. Replacement Cost: The replacement cost includes the cost of paint and labor required to set right the area of paint failure, at the time of claim lodged.',
                '8. Coastal Areas: In coastal areas, fading and chalking occur with all surfaces. Within normal limits, this is not considered as a failure.',
                '9. Surface Damage: Damage caused to the painted surface due to fire, excessive heat exposure, corrosive agents, abrasive materials, or by the customer including without limitation due to rework/fitting work done by the customer after handover.',
              ].map((item, i) => (
                <li
                  key={i}
                  className="text-sm leading-relaxed text-black sm:text-base"
                >
                  {item}
                </li>
              ))}
            </ol>
          </div>

          {/* ══ Gypsum False Ceiling ══ */}
          <div className="mb-12 sm:mb-16">
            <h2 className="mb-4 text-base font-bold text-black sm:text-lg">
              Gypsum False Ceiling
            </h2>
            <ol className="space-y-4">
              {[
                '1. Inspection and Rectification: If a defect is found upon inspection by a company authorized representative, the defect will be rectified in accordance with the claim terms below.',
                "2. Surface Area Requirement: The warranty policy shall apply where the overall false ceiling surface area exceeds 150 sq ft, subject to satisfactory inspection of the surface by Silver Storey's representative.",
                '3. Repair and Re-application: Silver Storey shall repair and provide labor for re-application of the paint coat, as may be necessary to set right the false ceiling failure in the affected portion only.',
              ].map((item, i) => (
                <li
                  key={i}
                  className="text-sm leading-relaxed text-black sm:text-base"
                >
                  {item}
                </li>
              ))}
              <li className="text-sm text-black sm:text-base">
                <span>
                  4. False Ceiling Failure: False ceiling failure shall mean any
                  of the following occurrences:
                </span>
                <ul className="mt-2 ml-5 list-none space-y-1.5">
                  {[
                    'Board integrity, flaking, and peeling of the joint compound or coming off from the substrate.',
                    'Cracks on the surface.',
                    'Growth of fungus and algae on ceiling surfaces (spread over a minimum area of 5 sq feet).',
                  ].map((item, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full border border-black/70" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="text-sm leading-relaxed text-black sm:text-base">
                5. False Ceiling System: The customer has used the entire false
                ceiling system recommended and executed by Silver Storey. The
                false ceiling should have been done with the usage of Silver
                Storey approved brands and all materials utilized shall be of
                the same manufacturer. Any mix-use of other brands shall make
                the warranty null and void.
              </li>
              <li className="text-sm text-black sm:text-base">
                <span>
                  6. Void Warranty: The warranty policy shall be void in the
                  following events:
                </span>
                <ul className="mt-2 ml-5 list-none space-y-1.5">
                  {[
                    'Intermittent dripping of water due to proximity of vegetation or air-conditioning units or any other sources of water leakage or dampness.',
                    'Water penetration due to capillary rise from the ground level, water leakage, seeping, and continuous dampness of the surface.',
                    'Physical damage to the surface with an external force or entity.',
                    'Defects arising due to failure or defects in the structure to which the ceiling is anchored.',
                  ].map((item, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full border border-black/70" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </li>
              {[
                '7. Gypsum Ceiling Warranty: The warranty will be applicable for standard quality Gypsum ceiling for a period of 6 months only.',
                '8. Coastal Areas: In coastal areas, fading and chalking occur with all surfaces. Within normal limits, this is not considered as a failure.',
              ].map((item, i) => (
                <li
                  key={i}
                  className="text-sm leading-relaxed text-black sm:text-base"
                >
                  {item}
                </li>
              ))}
            </ol>
          </div>

          {/* ══ Electrical ══ */}
          <div className="mb-12 sm:mb-16">
            <h2 className="mb-4 text-base font-bold text-black sm:text-lg">
              Electrical
            </h2>
            <ol className="space-y-4">
              {[
                '1. Inspection and Rectification: If a defect is found upon inspection by a company authorized representative, the defect will be rectified in accordance with the claim terms below.',
                "2. Value Requirement: The warranty policy shall apply where the overall electrical work carried out exceeds a value of INR 50,000 subject to no voltage fluctuation or no input power source issue checked by Silver Storey's representative.",
                '3. Replacement and Labor: Silver Storey will provide replacement, as long as the particular material is not discontinued by the manufacturer, and labor for re-application, as may be necessary to set right the electrical failure.',
              ].map((item, i) => (
                <li
                  key={i}
                  className="text-sm leading-relaxed text-black sm:text-base"
                >
                  {item}
                </li>
              ))}
              <li className="text-sm text-black sm:text-base">
                <span>
                  4. Electrical Failure: Throughout this warranty policy
                  document the words &ldquo;electrical failure&rdquo; shall mean
                  any of the following occurring, subject to the other
                  conditions stated in this document:
                </span>
                <ul className="mt-2 ml-5 list-none space-y-1.5">
                  {[
                    'Electrical short circuit/tripping.',
                    'Loose contacts in the plugs/switches.',
                  ].map((item, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full border border-black/70" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="text-sm leading-relaxed text-black sm:text-base">
                5. Electrical System: The customer has used the entire
                electrical wiring recommended and laid by Silver Storey provided
                the customer had used appropriate appliances in the usage
                ports/points.
              </li>
              <li className="text-sm text-black sm:text-base">
                <span>
                  6. Void Warranty: The warranty will not cover any defects
                  arising out of factors out of control of Silver Storey,
                  including but not limited to:
                </span>
                <ul className="mt-2 ml-5 list-none space-y-1.5">
                  {[
                    'Improper power input to the mains.',
                    'Water penetration due to capillary rise from the ground level, water leakage, seeping, and continuous dampness of the surface.',
                    'Electrical failures due to physical damage of conduits, wires, switches, and plates.',
                    'Issues in the power input source.',
                    'Electrical works been repaired by any other representative other than a company representative.',
                    'Inappropriate usage of the electrical points and appliances.',
                  ].map((item, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full border border-black/70" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="text-sm leading-relaxed text-black sm:text-base">
                7. Replacement Cost: The replacement cost will include the cost
                of electrical items including wiring, switches, conduits (if
                any), and labor required to set right the concerned failure
                only, at the time of lodgement of claim.
              </li>
            </ol>
          </div>

          {/* ══ Plumbing ══ */}
          <div className="mb-12 sm:mb-16">
            <h2 className="mb-4 text-base font-bold text-black sm:text-lg">
              Plumbing
            </h2>
            <ol className="space-y-4">
              {[
                '1. Inspection and Rectification: If a defect is found upon inspection by a company authorized representative, the defect will be rectified without charge, in accordance with the claim terms below.',
                "2. Value Requirement: The warranty policy shall apply where the overall plumbing work carried out exceeds a value of INR 50,000 subject to satisfactory inspection by Silver Storey's representative.",
                '3. Replacement and Rectification: Silver Storey will provide replacement/rectification, as long as the particular plumbing material is not discontinued by the manufacturer.',
              ].map((item, i) => (
                <li
                  key={i}
                  className="text-sm leading-relaxed text-black sm:text-base"
                >
                  {item}
                </li>
              ))}
              <li className="text-sm text-black sm:text-base">
                <span>
                  4. Plumbing Failure: Plumbing failure shall mean any of the
                  following occurring:
                </span>
                <ul className="mt-2 ml-5 list-none space-y-1.5">
                  {[
                    'Leakage in plumbing or sanitary pipes.',
                    'Plumbing and sanitary pipe manufacturing defect.',
                    'Plumbing failure shall not deal with the plumbing fixtures including taps, faucets, nozzles, water closets, showers, angle valves, etc.',
                  ].map((item, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full border border-black/70" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </li>
              {[
                '5. Plumbing System: The customer has used the entire plumbing system installed by Silver Storey.',
                '6. Void Warranty: The warranty will not cover any defects arising out of factors out of control of Silver Storey, including but not limited to:',
                '7. Improper quality of water supply to the property.',
                '8. Water penetration due to capillary rise from the ground level, water leakage, seeping, and continuous dampness of the surface.',
                '9. Plumbing failures due to physical damage or mishandling.',
                '10. Plumbing works been repaired by any other representative other than a company representative.',
                '11. Surface with contaminants.',
                '12. Replacement Cost: The replacement cost includes the cost of plumbing pipes/accessories and labor required to set right the concerned failure only, at the time of lodgement of claim.',
              ].map((item, i) => (
                <li
                  key={i}
                  className="text-sm leading-relaxed text-black sm:text-base"
                >
                  {item}
                </li>
              ))}
            </ol>
          </div>

          {/* ══ Home Improvement Solutions ══ */}
          <div className="mb-12 sm:mb-16">
            <h2 className="mb-4 text-base font-bold text-black sm:text-lg">
              Home Improvement Solutions
            </h2>
            <ol className="space-y-4">
              {[
                '1. Decor and Home Improvement Products: Decor and home improvement products include but are not limited to furnishings, wallpapers, paneling, cladding, lighting, fittings, and appliances.',
                "2. Manufacturer's Warranty: Warranty is at the sole discretion of the manufacturer/brand. Silver Storey will not be held liable for any dispute arising between the manufacturer and the buyer.",
                '3. Defect Notification: Notify Silver Storey within 10 days of detecting any defect via phone or email.',
              ].map((item, i) => (
                <li
                  key={i}
                  className="text-sm leading-relaxed text-black sm:text-base"
                >
                  {item}
                </li>
              ))}
            </ol>
          </div>

          {/* ══ Contact Info ══ */}
          <div className="text-sm leading-relaxed text-black sm:text-base">
            <p className="mb-1">
              For any queries or claims, please contact us at:
            </p>
            <p className="font-semibold">Silver Storey</p>
            <p>58, Harish Mukherjee Road, Kolkata - 700025</p>
            <p>Phone: 8336917221</p>
            <p>Email: care@silverstorey.com</p>
          </div>
        </section>
      </div>

      <HeroControls onMenuClick={() => setIsMenuOpen(true)} />
      <MenuOverlay
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        projectPages={projectPages}
      />
    </div>
  );
}
