# Techno Electromechs UI/UX Audit

Audit date: 18 July 2026  
Scope: `index.html`, four commercial service/product pages, privacy page, shared CSS/JavaScript, public assets, robots, sitemap, schema, and enquiry behavior.

## What already works

- Distinct industrial-editorial identity with red, charcoal, warm paper, technical grids, square geometry, and strong machinery presentation.
- Clear authorized-dealer, location, service-area, product-range, installation, AMF, and AMC claims.
- Search foundations are strong: unique titles/descriptions, canonicals, Open Graph data, JSON-LD, breadcrumbs, sitemap, robots, semantic headings, and crawlable service pages.
- The homepage already provides primary assessment and WhatsApp actions, visible form labels, a skip link, keyboard focus styling, image dimensions, lazy loading, menu focus trapping, and reduced-motion handling.
- The enquiry form prepares a user-reviewed WhatsApp message without storing the form data.

## Ten highest-impact improvements

| Rank | Improvement | Baseline issue | Intended result |
|---:|---|---|---|
| 1 | Unify conversion access on mobile | The homepage has a two-action dock, while service pages lose their header CTA below 700px and have no persistent call/WhatsApp route. | A consistent Call / WhatsApp / Assessment dock on every commercial page. |
| 2 | Add early requirement routing | Detailed DG, installation, AMF, and AMC guides appear late on the homepage after several long sections. | A compact “What are you planning?” path immediately after hero proof. |
| 3 | Correct contrast and microcopy | Existing red on paper is about 4.28:1; several 8-9px and translucent footer/dark-surface labels fall below comfortable AA reading. | Darker brand red, solid on-dark tokens, and larger metadata without changing the palette identity. |
| 4 | Improve first-screen type balance | Very large condensed headings and tight line-height can dominate the mobile fold and reduce breathing room around conversion actions. | Responsive type caps and safer line-height while preserving the bold industrial voice. |
| 5 | Strengthen focus, touch, and state feedback | Some text links, footer links, utility actions, and form controls have small targets or rely mainly on hover; form inputs suppress their own outline. | At least 44px touch targets where needed, explicit focus states, and stable pressed/hover treatment. |
| 6 | Improve enquiry feedback | Native validation is present, but helper text is not programmatically tied to the submit action and invalid submission feedback is easy to miss. | Associated privacy/helper text, polite status feedback, and focus on the first invalid field, with the WhatsApp payload unchanged. |
| 7 | Clarify mobile navigation semantics | The full-screen mobile menu traps focus and supports Escape, but is not identified as a modal dialog and does not isolate background regions. | Dialog semantics, background inert state, reliable focus return, and resize-safe closing. |
| 8 | Improve long-form scanning | Subpage headings, section gaps, and technical cards can feel oversized on mid-size and small screens. | More controlled measures, spacing, card hierarchy, and sticky TOC behavior without changing copy or URLs. |
| 9 | Harden motion and layout stability | Reduced motion is implemented well, but interaction rules are spread across components and some hover movement is decorative. | Centralized 160-240ms state motion, no layout-affecting animation, immediate content under reduced motion. |
| 10 | Remove platform-dependent control glyphs | Checkmarks and arrows are mostly text glyphs; they are not emoji in source, but can vary by font/platform when used as UI decoration. | CSS geometry or text labels for structural cues; no emoji icons introduced. |

## Preservation boundary

The refresh must not alter:

- Public filenames, internal URL targets, anchors, sitemap entries, robots rules, or Google verification file.
- Page titles, descriptions, canonicals, Open Graph metadata, JSON-LD, dealer status, contact details, address, territory, product/service scope, kVA statements, or technical caveats.
- Enquiry field names, required fields, message lines, telephone number, WhatsApp destination, or user-review-before-send behavior.
- Manufacturer image meaning, alt text, or declared image dimensions.

## Implementation map

- Pass 1: shared tokens, contrast, type, focus, touch, and motion in `assets/styles.css`.
- Pass 2: homepage requirement paths and conversion dock in `index.html`.
- Pass 3: consistent mobile docks across commercial subpages and privacy page.
- Pass 4: mobile-menu semantics, active navigation state, and form feedback in `assets/site.js`.
- Pass 5: static integrity, link/schema checks, desktop/mobile browser validation, keyboard, contrast, and reduced motion.

## Final implementation status

All ten improvements were implemented while retaining the static HTML/CSS/JavaScript architecture. No public filename, canonical, schema block, sitemap entry, robots rule, business claim, enquiry field, telephone number, WhatsApp destination, or user-review-before-send behavior was intentionally changed.

## Validation record

- Browser-tested every public page at 375 x 812 and 1440 x 900; also checked the homepage at 320, 768, and 1024 pixel widths. No horizontal overflow was detected.
- Parsed every JSON-LD block successfully and confirmed one H1 and no duplicate IDs on each public page.
- Verified the three-way mobile Call / WhatsApp / Assessment dock and zero browser console warnings or errors.
- Verified mobile-menu dialog semantics, background isolation, Escape-to-close, focus return, and a visible focus ring.
- Verified invalid enquiry submission focuses the first invalid field and announces clear feedback; the established WhatsApp payload remains unchanged.
- Verified representative contrast ratios: red on warm paper 4.87:1, red on white 5.51:1, steel on warm paper 5.81:1, and muted footer text on charcoal 7.00:1.
- Confirmed the CSS and JavaScript honor `prefers-reduced-motion`; both shared JavaScript files pass `node --check`.
