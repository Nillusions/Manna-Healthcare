# Manna Home Care: Website

Static, mobile-first website for **Manna Home Care**, a home healthcare provider in Delhi NCR.
Built with plain **HTML5, CSS3, vanilla JavaScript and GSAP** (loaded from cdnjs). No build step,
no framework, no backend. WhatsApp is the main enquiry channel.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home: hero, about, services overview, why choose us, how it works, testimonials, coverage, final CTA |
| `services.html` | All five service categories, each with offerings and a service-specific WhatsApp button |
| `contact.html` | Contact details and an enquiry form that opens WhatsApp with a pre-filled message |

## Project structure

```
manna-home-care/
├── favicon.ico         16/32/48 px browser icon (logo on a white disc)
├── index.html
├── services.html
├── contact.html
├── css/
│   ├── style.css         base styles and design tokens (mobile first)
│   └── responsive.css    min-width breakpoints: 600, 768, 1024, 1280, 1440
├── js/
│   ├── main.js           WhatsApp link helper, contact form validation and WhatsApp hand-off
│   ├── navigation.js     mobile menu, header scroll state, services jump-nav highlighting
│   └── animations.js     GSAP + ScrollTrigger animations (respects reduced motion)
├── assets/
│   ├── logo/             supplied logo: original + transparent PNGs (48, 96, 192, 512)
│   ├── icons/            favicons (16, 32, 48, 192, 512), apple-touch-icon, maskable icon
│   ├── og/               1200x630 share images for link previews
│   └── images/           self-hosted WebP photos, 4 sizes each (see Photography)
├── robots.txt
├── sitemap.xml
├── site.webmanifest
└── README.md
```

## Run locally

Any static file server works, for example:

```bash
npx serve .
```

Opening the HTML files directly also works. Fonts, GSAP and photos load from their CDNs.

## Deploy

**GitHub Pages:** push this folder to a repository, then go to *Settings → Pages → Deploy from branch*
and pick the branch with `/ (root)`.

**Cloudflare Pages:** create a project, connect the repository, leave the build command empty and
set the output directory to `/` (the repository root).

## Editing content

- **WhatsApp number and messages.** Every WhatsApp button already has a complete
  `https://wa.me/918157087549?text=…` link in the HTML, so it works even without JavaScript.
  Buttons also carry `data-wa="nursing"` and similar keys, and `js/main.js` (the `MESSAGES`
  object and `WHATSAPP_NUMBER`) rewrites them on load. To change a message or the number,
  edit `main.js`. The HTML fallbacks only matter when JavaScript is off.
- **Contact form.** Validates name, phone (Indian or international format), service and location,
  then opens WhatsApp with a formatted message. Nothing is stored or sent to a server.
  Links such as `contact.html?service=nursing` pre-select the service
  (`nursing`, `gda`, `doctor`, `physio`, `baby`, `equipment`).
- **Colours, type and spacing** are CSS custom properties at the top of `css/style.css`.
  The palette comes from the logo: deep teal `#0E5F78`, bright teal `#0AA6C6` and leaf green
  `#7AC420`, with soft ivory backgrounds.
- **Font:** Plus Jakarta Sans (Google Fonts).

## Before going live

1. **Testimonials are samples.** The three reviews on the home page are illustrative and carry a
   small "Sample review" label. Replace them with genuine, approved reviews (search `index.html` for
   "SAMPLE reviews") and remove the label. Publishing invented reviews
   as real ones can breach consumer-protection rules on fake reviews.
2. **Service coverage.** The home page lists Delhi, Gurugram, Noida, Ghaziabad and Faridabad as the
   Delhi NCR region. Confirm these match the areas you actually serve.
3. **Operating hours** are not shown. Add a row to the contact list in `contact.html` if needed.

## SEO and link previews

- **Titles and descriptions:** each page has a unique title (under 60 characters) and meta
  description (under 160) built around the main searches: home nursing, 24-hour care, home ICU
  setup, elderly care attendants, physiotherapy at home and equipment on rent, in Noida,
  Greater Noida and Delhi NCR.
- **Canonical URLs, Open Graph and Twitter tags** on every page, using **https://mannahomecare.org/**
  (set by the `CNAME` file).
- **Share images** (1200x630) in `assets/og/`: `og-home.png`, `og-services.png`, `og-contact.png`.
- **Structured data (JSON-LD)** on every page:
  - `MedicalBusiness`: address, both phone numbers, email, areas served (Noida, Greater Noida, Delhi,
    Gurugram, Ghaziabad, Faridabad) and an offer catalogue of all eight services.
  - `WebPage` (Home, Services) or `ContactPage` (Contact), with a `dateModified` date.
  - Services page: an `ItemList` describing each service individually.
  - Home page: `WebSite` and an `FAQPage` that mirrors the 11 visible FAQ questions.
  - `BreadcrumbList` on Services and Contact, and an `ItemList` of all site pages.
- **`sitemap.xml`** lists all three pages with their images; every page links to it.
- **`robots.txt`** allows all crawlers, keeps `README.md` out of search, and points to the sitemap.
- If the domain changes, find and replace `https://mannahomecare.org/` in the three HTML files,
  `sitemap.xml` and `robots.txt`. When content changes, update the `<lastmod>` dates in the sitemap.

**After launch:** add the site to Google Search Console (verify with a DNS record at your domain
provider), submit `https://mannahomecare.org/sitemap.xml`, and use "Request indexing" on each page.
Test the structured data with Google's Rich Results Test.

## Photography

Photos are free-to-use images from [Unsplash](https://unsplash.com), **self-hosted** in
`assets/images/` as WebP. Each photo has four widths (`-480`, `-800`, `-1200`, `-1600`) and the
pages pick the right one with `srcset`, so phones download small files. Every photo has descriptive
alt text, and the file names describe the image (good for Google Images).

| File name (`assets/images/`) | Used for | Unsplash photo ID |
| --- | --- | --- |
| `home-care-attendant-with-elderly-man` | Home hero, share previews | `1596450514537-fae68a81346b` |
| `elderly-woman-namaste-home-care` | About (main) | `1639996262614-04fe2edd0648` |
| `elderly-women-smiling-together` | About (small) | `1680759291255-f009988333cf` |
| `nurse-nursing-care-at-home` | Nursing | `1741707039536-113e200f9e0d` |
| `elderly-care-attendant-grooming` | GDA staffing | `1680759290608-c6dda7570b1c` |
| `doctor-home-visit-examination` | Doctor & physiotherapy | `1648964388258-e71b58683ed0` |
| `baby-care-at-home-newborn` | Baby care | `1768657891765-2c5619ba1914` |
| `hospital-bed-on-rent-at-home` | Medical equipment | `1512678080530-7760d81faba6` |
| `elderly-woman-reading-at-home` | Final call-to-action background | `1642502073674-793aa61af8ce` |

To replace a photo, add four WebP files with the same naming pattern and update the matching
`src`/`srcset` in the HTML (and the image entry in `sitemap.xml`).

## Accessibility and performance notes

- Skip link, semantic landmarks, one `h1` per page, labelled form fields with inline error messages.
- Mobile menu: `aria-expanded`, focus moves into the menu, focus is trapped while open, and Escape closes it.
- Touch targets are at least 44px. No horizontal scrolling from 320px to 1440px.
- Animations only change opacity and position, never hide content from keyboard users, and are
  switched off entirely for `prefers-reduced-motion`. If GSAP fails to load, all content stays visible.
- Photos are self-hosted WebP, lazy-loaded (except the hero) and served at the right size for each screen.

## Tested

Layouts were checked at 320, 360, 375, 390, 430, 768, 1024, 1280 and 1440px on all three pages.
Checks covered horizontal overflow, off-screen elements, tap-target size, animation reveal completion,
internal links and anchors, WhatsApp link format and messages, form validation and message encoding,
and the mobile menu (open, focus, Escape).
