#!/usr/bin/env python3
"""Generates the static pages for the Hadley Wood Jewish Community site."""
import os, html, hashlib

OUT = "/home/user/party"
def _v(rel):
    try: return hashlib.md5(open(os.path.join(OUT, rel), "rb").read()).hexdigest()[:8]
    except OSError: return "0"
ASSET_V = {}
SITE = "https://hwjc.uk"  # live domain; set-domain.sh can change it
NAME = "Hadley Wood Jewish Community"
PHONE = "020 8143 2580"
PHONE_TEL = "+442081432580"
EMAIL = "office@hwjc.org.uk"
ADDRESS = "8 Lancaster Avenue, Hadley Wood, Barnet, Hertfordshire, EN4 0EX"
MAPS = "https://www.google.com/maps/search/?api=1&query=8+Lancaster+Avenue+Hadley+Wood+Barnet+EN4+0EX"

# ---- Icons (inline SVG, stroke based) ----
def icon(name):
    paths = {
        "arrow": '<path d="M5 12h14M13 5l7 7-7 7"/>',
        "chevron": '<path d="M6 9l6 6 6-6"/>',
        "menu": '<path d="M4 7h16M4 12h16M4 17h16"/>',
        "star": '<path d="M12 3l2.7 5.6 6.2.9-4.5 4.3 1.1 6.2L12 17l-5.5 3 1.1-6.2L3.1 9.5l6.2-.9z"/>',
        "book": '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5V5.5M8 7h8M8 11h6"/>',
        "home": '<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
        "people": '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><circle cx="17" cy="9" r="2.5"/><path d="M15.5 14.5a5 5 0 0 1 6 5"/>',
        "calendar": '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
        "cup": '<path d="M8 3h8l-1 6a3 3 0 0 1-6 0z"/><path d="M12 12v6M8 21h8M12 12a3 3 0 0 0 3-3"/>',
        "scroll": '<path d="M6 4h11a3 3 0 0 1 3 3v1H8"/><path d="M6 4a2 2 0 0 0-2 2v11a3 3 0 0 0 3 3h11a2 2 0 0 0 2-2v-1H9"/><path d="M9 9v9M9 12h6M9 15h6"/>',
        "heart": '<path d="M12 21s-7.5-4.6-9.5-9.1C1 8 3.5 4.5 7 4.5c2 0 3.5 1 5 3 1.5-2 3-3 5-3 3.5 0 6 3.5 4.5 7.4C19.5 16.4 12 21 12 21z"/>',
        "cross": '<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M12 7v10M7 12h10"/>',
        "phone": '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
        "mail": '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
        "pin": '<path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>',
        "info": '<circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v4h1"/>',
        "external": '<path d="M14 4h6v6M20 4l-9 9M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/>',
        "train": '<rect x="5" y="3" width="14" height="14" rx="3"/><path d="M5 11h14M9 21l1.5-4M15 21l-1.5-4M8.5 14h.01M15.5 14h.01"/>',
        "tree": '<path d="M12 2l6 8h-3l4 6h-5v6h-4v-6H5l4-6H6z"/>',
        "school": '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5M22 9v6"/>',
    }
    return ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" '
            'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + paths[name] + '</svg>')


def head(title, description, path, extra_ld=""):
    url = SITE + path
    ld_org = {
        "@context": "https://schema.org",
        "@type": ["Synagogue", "Organization"],
        "name": NAME,
        "alternateName": ["Hadley Wood Shul", "Hadley Wood Synagogue", "HWJC"],
        "url": SITE + "/",
        "logo": SITE + "/assets/img/hwjc-logo.png",
        "image": SITE + "/assets/img/og-image.jpg",
        "telephone": "+44 20 8143 2580",
        "email": EMAIL,
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "8 Lancaster Avenue",
            "addressLocality": "Hadley Wood, Barnet",
            "addressRegion": "Hertfordshire",
            "postalCode": "EN4 0EX",
            "addressCountry": "GB",
        },
        "areaServed": ["Hadley Wood", "Barnet", "Cockfosters", "Enfield", "North London"],
        "parentOrganization": {"@type": "Organization", "name": "United Synagogue", "url": "https://www.theus.org.uk/"},
        "sameAs": ["https://www.instagram.com/hadleywoodshul", "https://www.facebook.com/hadleywoodjewishcommunity/"],
    }
    import json
    ld = json.dumps(ld_org, ensure_ascii=False)
    return f"""<!DOCTYPE html>
<html lang="en-GB" data-palette="stone" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{html.escape(title)}</title>
<meta name="description" content="{html.escape(description)}">
<meta name="keywords" content="Hadley Wood Shul, Hadley Wood Jewish Community, Hadley Wood Synagogue, HWJC, synagogue Barnet, shul Barnet, United Synagogue Hadley Wood, Jewish community North London, cheder Hadley Wood, hall hire Hadley Wood, Rabbi Toby Weiniger, Rebbetzen Bracha Weiniger">
<link rel="canonical" href="{url}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="theme-color" content="#f6f4ef">
<meta property="og:type" content="website">
<meta property="og:site_name" content="{NAME}">
<meta property="og:title" content="{html.escape(title)}">
<meta property="og:description" content="{html.escape(description)}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{SITE}/assets/img/og-image.jpg">
<meta property="og:locale" content="en_GB">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{html.escape(title)}">
<meta name="twitter:description" content="{html.escape(description)}">
<meta name="twitter:image" content="{SITE}/assets/img/og-image.jpg">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/img/favicon-32.png">
<link rel="icon" type="image/png" sizes="64x64" href="/assets/img/favicon-64.png">
<link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Manrope:wght@500;600;700;800&display=swap">
<link rel="stylesheet" href="/css/styles.css?v={_v("css/styles.css")}">
<script type="application/ld+json">{ld}</script>
{extra_ld}
<script>document.documentElement.classList.remove('no-js');</script>
</head>
<body>
<a class="skip-link" href="#main">Skip to main content</a>
"""


NAV = [
    ("/", "Welcome"),
    ("/rabbi.html", "Rabbi &amp; Rebbetzen"),
    ("/cheder.html", "Cheder"),
    ("/hall-hire.html", "Hire the Venue"),
    ("/book-my-kiddush.html", "Book my Kiddush"),
    ("/community.html", "Community"),
]


def header(current):
    items = ""
    for href, label in NAV:
        cur = ' aria-current="page"' if href == current else ""
        items += f'<li><a href="{href}"{cur}>{label}</a></li>\n'
    items += '<li class="nav-cta"><a href="/#join">Join us</a></li>'
    return f"""<header class="site-header">
  <div class="container header-inner">
    <a class="brand" href="/" aria-label="{NAME} home">
      <img src="/assets/img/hwjc-tree.png" alt="" width="48" height="49">
      <span><span class="brand__name">Hadley Wood Jewish Community</span><span class="brand__sub">Hadley Wood Shul &middot; United Synagogue</span></span>
    </a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">{icon('menu')}<span class="nav-toggle__label">Menu</span></button>
    <nav class="site-nav" id="site-nav" aria-label="Main navigation">
      <ul>
{items}
      </ul>
    </nav>
  </div>
</header>
<main id="main">
"""


FOOTER = f"""</main>
<footer class="site-footer">
  <div class="container">
    <div class="footer-row">
      <a class="brand brand--footer" href="/"><img src="/assets/img/hwjc-tree.png" alt="" width="40" height="41"><span class="brand__name">Hadley Wood Jewish Community</span></a>
      <ul class="footer-links">
        <li><a href="/">Welcome</a></li>
        <li><a href="/rabbi.html">Rabbi &amp; Rebbetzen</a></li>
        <li><a href="/cheder.html">Cheder</a></li>
        <li><a href="/hall-hire.html">Hire the Venue</a></li>
        <li><a href="/book-my-kiddush.html">Book my Kiddush</a></li>
        <li><a href="/community.html">Community</a></li>
        <li><a href="https://theus.org.uk/donate/?project=My%20Community&amp;synagogue=130" rel="noopener" target="_blank">Donate</a></li>
      </ul>
    </div>
    <p class="footer-contact"><a href="{MAPS}" rel="noopener" target="_blank">8 Lancaster Avenue, Hadley Wood, Barnet EN4 0EX</a> <span class="sep">&middot;</span> <a href="tel:{PHONE_TEL}">{PHONE}</a> <span class="sep">&middot;</span> <a href="mailto:{EMAIL}">{EMAIL}</a> <span class="sep">&middot;</span> <a href="https://www.instagram.com/hadleywoodshul" rel="noopener" target="_blank">@hadleywoodshul</a></p>
    <p class="footer-bottom">&copy; <span data-year>2026</span> Hadley Wood Jewish Community &middot; Hadley Wood Shul &middot; Hadley Wood Synagogue &middot; <a href="https://www.theus.org.uk/" rel="noopener" target="_blank">United Synagogue</a> charity no. 242552 &middot; <a href="https://www.theus.org.uk/sites/default/files/United%20Synagogue%20Complaints%20Policy_0.pdf" rel="noopener" target="_blank">Complaints policy</a></p>
  </div>
</footer>
<script src="/js/main.js?v={_v("js/main.js")}" defer></script>
</body>
</html>
"""


def page(filename, path, title, description, current, body, extra_ld=""):
    doc = head(title, description, path, extra_ld) + header(current) + body + FOOTER
    doc = doc.replace('href="/#', 'href="index.html#').replace('href="/"', 'href="index.html"')
    doc = doc.replace('href="/', 'href="').replace('src="/', 'src="')
    doc = doc.replace('srcset="/', 'srcset="').replace(', /assets/', ', assets/')
    doc = doc.replace('poster="/', 'poster="')
    with open(os.path.join(OUT, filename), "w", encoding="utf-8") as f:
        f.write(doc)
    print("wrote", filename, len(doc))


# =====================================================================
# WELCOME
# =====================================================================
welcome = f"""
<section class="hero" aria-labelledby="welcome-title">
  <div class="container hero__grid">
    <div>
      <span class="eyebrow reveal">Hadley Wood Shul &middot; Barnet, North London</span>
      <h1 id="welcome-title" class="reveal" data-delay="1">Welcome to Hadley Wood Jewish Community</h1>
      <p class="lead reveal" data-delay="2">A warm, modern United Synagogue shul with over 350 members, a thriving Cheder and a famously good Kiddush. Everyone is welcome.</p>
      <div class="btn-row reveal" data-delay="3">
        <a class="btn btn--primary" href="#join">Join us {icon('arrow')}</a>
        <a class="btn btn--outline" href="/community.html">What&rsquo;s on</a>
      </div>
    </div>
    <div class="hero__logo reveal" data-delay="2">
      <img src="/assets/img/hwjc-logo.png" alt="Hadley Wood Jewish Community logo" width="700" height="665" fetchpriority="high">
    </div>
  </div>
</section>

<section class="section" aria-label="Explore the site">
  <div class="container">
    <div class="card-grid reveal-stagger">
      <a class="card card--link" href="/rabbi.html">
        <div class="card__icon">{icon('star')}</div>
        <h3>Rabbi &amp; Rebbetzen</h3>
        <p>Meet Rabbi Toby and Rebbetzen Bracha Weiniger.</p>
      </a>
      <a class="card card--link" href="/cheder.html">
        <div class="card__icon">{icon('school')}</div>
        <h3>Cheder</h3>
        <p>Jewish learning for years 1 to 6, Wednesdays.</p>
      </a>
      <a class="card card--link" href="/hall-hire.html">
        <div class="card__icon">{icon('home')}</div>
        <h3>Hire the Venue</h3>
        <p>Weddings, simchas and events in our hall and garden.</p>
      </a>
      <a class="card card--link" href="/community.html">
        <div class="card__icon">{icon('calendar')}</div>
        <h3>Community</h3>
        <p>Events, Kiddush, Haftorah, Bar &amp; Bat Mitzvah, Hatzola.</p>
      </a>
    </div>
  </div>
</section>

<section class="section" id="join" aria-labelledby="join-title">
  <div class="container">
    <h2 id="join-title" class="reveal">Join us</h2>
    <p class="lead reveal" style="margin-bottom:1.25rem">To become a member, contact the office at <a href="mailto:{EMAIL}">{EMAIL}</a> or call <a href="tel:{PHONE_TEL}">{PHONE}</a>.</p>
    <div class="contact-grid reveal-stagger">
      <div class="contact-item">
        <h3>Address</h3>
        <address><a href="{MAPS}" rel="noopener" target="_blank">8 Lancaster Avenue, Hadley Wood, Barnet, EN4 0EX</a></address>
      </div>
      <div class="contact-item">
        <h3>Telephone</h3>
        <a href="tel:{PHONE_TEL}">{PHONE}</a>
      </div>
      <div class="contact-item">
        <h3>Email</h3>
        <a href="mailto:{EMAIL}">{EMAIL}</a>
      </div>
    </div>
  </div>
</section>
"""

page("index.html", "/",
     "Hadley Wood Jewish Community | Hadley Wood Shul & Synagogue, Barnet",
     "Hadley Wood Jewish Community (Hadley Wood Shul) is a warm, modern United Synagogue community in Hadley Wood, Barnet, North London. Services, Cheder, hall hire and events.",
     "/", welcome)

# =====================================================================
# RABBI & REBBETZEN
# =====================================================================
rabbi_ld = """<script type="application/ld+json">{"@context":"https://schema.org","@graph":[
{"@type":"Person","name":"Rabbi Toby Weiniger","jobTitle":"Rabbi","worksFor":{"@type":"Organization","name":"Hadley Wood Jewish Community"},"email":"rabbitoby@hwjc.org.uk"},
{"@type":"Person","name":"Rebbetzen Bracha Weiniger","jobTitle":"Rebbetzen","worksFor":{"@type":"Organization","name":"Hadley Wood Jewish Community"},"email":"bracha@hwjc.org.uk"}
]}</script>"""

rabbi = f"""
<section class="hero hero--simple" aria-labelledby="rabbi-title">
  <div class="container">
    <span class="eyebrow reveal">Our rabbinic couple</span>
    <h1 id="rabbi-title" class="reveal" data-delay="1">Rabbi Toby &amp; Rebbetzen Bracha Weiniger</h1>
    <p class="lead reveal" data-delay="2">Leading Hadley Wood Shul since January 2026.</p>
  </div>
</section>

<section class="section" aria-label="Biographies">
  <div class="container split split--top">
    <div class="frame frame--portrait reveal">
      <img src="/assets/img/rabbi-toby-and-rebbetzen-bracha-weiniger-1200.jpg"
           srcset="/assets/img/rabbi-toby-and-rebbetzen-bracha-weiniger-600.jpg 600w, /assets/img/rabbi-toby-and-rebbetzen-bracha-weiniger-1200.jpg 1200w"
           sizes="(max-width: 860px) 100vw, 50vw"
           alt="Rabbi Toby Weiniger and Rebbetzen Bracha Weiniger of Hadley Wood Jewish Community" width="1200" height="900">
    </div>
    <div class="reveal" data-delay="1">
      <h2>Rabbi Toby Weiniger</h2>
      <p>Studied at Yeshivat Har Etzion, received semicha from Rabbi S. F. Zimmerman, lectures at the JLE and holds a first-class law degree from LSE. Halachic Advisor to Hatzola HBS.</p>
      <p><a href="mailto:rabbitoby@hwjc.org.uk">rabbitoby@hwjc.org.uk</a></p>
      <h2 style="margin-top:1.5rem">Rebbetzen Bracha Weiniger</h2>
      <p>Studied at MMY Seminary in Jerusalem, a certified Kallah and Bat Mitzvah teacher, and a Chemistry PhD candidate at Imperial College London. Leads our Cheder with Rabbi Toby.</p>
      <p><a href="mailto:bracha@hwjc.org.uk">bracha@hwjc.org.uk</a></p>
    </div>
  </div>
</section>
"""

page("rabbi.html", "/rabbi.html",
     "Rabbi Toby & Rebbetzen Bracha Weiniger | Hadley Wood Shul",
     "Meet Rabbi Toby Weiniger and Rebbetzen Bracha Weiniger, the rabbinic couple of Hadley Wood Jewish Community (Hadley Wood Synagogue), Barnet.",
     "/rabbi.html", rabbi, rabbi_ld)

# =====================================================================
# CHEDER
# =====================================================================
cheder_ld = """<script type="application/ld+json">{"@context":"https://schema.org","@type":"Course","name":"Hadley Wood Jewish Community Cheder","description":"Weekly Cheder (Hebrew school) for children in school years 1 to 6 at Hadley Wood Shul, Barnet. Wednesdays 4.45pm to 6.30pm, £160 per term.","provider":{"@type":"Organization","name":"Hadley Wood Jewish Community","sameAs":"SITEURL/"},"offers":{"@type":"Offer","price":"160","priceCurrency":"GBP"}}</script>""".replace("SITEURL/", SITE + "/")

cheder = f"""
<section class="hero hero--simple" aria-labelledby="cheder-title">
  <div class="container">
    <span class="eyebrow reveal">Cheder &middot; Hebrew school</span>
    <h1 id="cheder-title" class="reveal" data-delay="1">Hadley Wood Cheder</h1>
    <p class="lead reveal" data-delay="2">Warm, creative and fun Jewish learning with small classes and a strong focus on Hebrew reading. Open to members and non-members.</p>
  </div>
</section>

<section class="section" aria-label="Cheder details">
  <div class="container split split--top">
    <ul class="facts reveal">
      <li><span>Who</span><span>School years 1 to 6</span></li>
      <li><span>When</span><span>Wednesdays, 4.45pm to 6.30pm, term time</span></li>
      <li><span>Where</span><span>8 Lancaster Avenue, Hadley Wood, EN4 0EX</span></li>
      <li><span>Fees</span><span>&pound;160 per term</span></li>
    </ul>
    <div class="reveal" data-delay="1">
      <blockquote class="quote">
        <p>My son loves going to this Cheder. The smaller classes make it easier to participate and the teachers are warm, nurturing and encouraging.</p>
        <cite>Tanya, parent</cite>
      </blockquote>
      <div class="btn-row">
        <a class="btn btn--primary" href="mailto:bracha@hwjc.org.uk?subject=Cheder%20enquiry">{icon('mail')} Enquire or enrol</a>
      </div>
    </div>
  </div>
</section>
"""

page("cheder.html", "/cheder.html",
     "Cheder (Hebrew School) | Hadley Wood Jewish Community, Barnet",
     "Hadley Wood Shul Cheder: warm, creative Jewish learning for children in school years 1 to 6. Wednesdays 4.45pm to 6.30pm at Hadley Wood Synagogue, Barnet. £160 per term.",
     "/cheder.html", cheder, cheder_ld)

# =====================================================================
# HALL HIRE
# =====================================================================
hall_ld = """<script type="application/ld+json">{"@context":"https://schema.org","@type":"EventVenue","name":"Hadley Wood Jewish Community venue","description":"Wedding garden, modern function hall, marquee and kosher kitchen for hire at Hadley Wood Shul, Barnet.","address":{"@type":"PostalAddress","streetAddress":"8 Lancaster Avenue","addressLocality":"Hadley Wood, Barnet","postalCode":"EN4 0EX","addressCountry":"GB"},"telephone":"+44 20 8143 2580","email":"office@hwjc.org.uk"}</script>"""

hall = f"""
<section class="hero hero--simple" aria-labelledby="hall-title">
  <div class="container">
    <span class="eyebrow reveal">Hire the venue &middot; Hadley Wood, Barnet</span>
    <h1 id="hall-title" class="reveal" data-delay="1">A beautiful space for your celebration</h1>
    <p class="lead reveal" data-delay="2">Weddings, simchas, parties, kiddushim and community events in our modern hall, garden and marquee, with a fully fitted kosher kitchen.</p>
    <div class="btn-row reveal" data-delay="3">
      <a class="btn btn--primary" href="mailto:{EMAIL}?subject=Venue%20hire%20enquiry">{icon('mail')} Enquire now</a>
      <a class="btn btn--outline" href="tel:{PHONE_TEL}">{icon('phone')} {PHONE}</a>
    </div>
  </div>
</section>

<section class="section" aria-label="Photos">
  <div class="container">
    <div class="gallery gallery--four reveal-stagger">
      <figure>
        <img src="/assets/img/venue-wedding-800.jpg" srcset="/assets/img/venue-wedding-800.jpg 800w, /assets/img/venue-wedding-1600.jpg 1600w" sizes="(max-width: 860px) 100vw, 50vw"
             alt="A chuppah decorated with purple flowers set up for a wedding in the garden at Hadley Wood Shul, with rows of blue chairs on the lawn" width="800" height="600">
        <figcaption><strong>Weddings</strong></figcaption>
      </figure>
      <figure>
        <img src="/assets/img/venue-hall-800.jpg" srcset="/assets/img/venue-hall-800.jpg 800w, /assets/img/venue-hall-1600.jpg 1600w" sizes="(max-width: 860px) 50vw, 25vw"
             alt="The hall at Hadley Wood Shul being set up for an event, with long tables, stacked blue chairs and the garden marquee beyond" width="800" height="600">
        <figcaption><strong>The Hall</strong></figcaption>
      </figure>
      <figure>
        <img src="/assets/img/hall-marquee-800.jpg" srcset="/assets/img/hall-marquee-800.jpg 800w, /assets/img/hall-marquee-1600.jpg 1600w" sizes="(max-width: 860px) 100vw, 33vw"
             alt="The garden marquee at Hadley Wood Shul" width="800" height="600" loading="lazy">
        <figcaption><strong>The Garden Marquee</strong></figcaption>
      </figure>
      <figure>
        <img src="/assets/img/hall-kitchen-800.jpg" srcset="/assets/img/hall-kitchen-800.jpg 800w, /assets/img/hall-kitchen-1600.jpg 1600w" sizes="(max-width: 860px) 100vw, 33vw"
             alt="The kosher kitchen at Hadley Wood Synagogue" width="800" height="600" loading="lazy">
        <figcaption><strong>The Kosher Kitchen</strong></figcaption>
      </figure>
    </div>
    <div class="notice reveal">
      {icon('info')}
      <p>Email or call the office with your date, event and numbers. <strong>Bar and Bat Mitzvahs are arranged separately</strong> with <a href="/community.html#bar-bat-mitzvah">Rabbi Toby</a>.</p>
    </div>
  </div>
</section>
"""

page("hall-hire.html", "/hall-hire.html",
     "Hire the Venue in Hadley Wood, Barnet | Hadley Wood Jewish Community",
     "Hire our venue at Hadley Wood Shul, Barnet: wedding garden, modern hall, marquee and kosher kitchen for weddings, simchas, parties, kiddushim and community events.",
     "/hall-hire.html", hall, hall_ld)

# =====================================================================
# COMMUNITY
# =====================================================================
community = f"""
<section class="hero hero--simple" aria-labelledby="community-title">
  <div class="container">
    <span class="eyebrow reveal">Community</span>
    <h1 id="community-title" class="reveal" data-delay="1">Get involved</h1>
  </div>
</section>

<section class="section section--tight" id="news" aria-labelledby="news-title">
  <div class="container">
    <h2 id="news-title" class="reveal">Community News</h2>
    <ul class="news__list news__list--row reveal-stagger">
      <li>
        <span class="eyebrow">Latest</span>
        <h3>The new Kehilla Magazine is out</h3>
        <p>If your copy hasn&rsquo;t been delivered yet, you can pick one up in shul.</p>
      </li>
      <li>
        <h3>Challah baking with the Rebbetzen</h3>
        <p>The latest challah baking session with Rebbetzen Bracha was a great success.</p>
      </li>
      <li>
        <h3>Lulav and etrog</h3>
        <p>Text Rabbi Toby to order your lulav and etrog for Sukkot. <a href="mailto:rabbitoby@hwjc.org.uk?subject=Lulav%20and%20etrog">Email Rabbi Toby</a></p>
      </li>
    </ul>
  </div>
</section>

<section class="section" id="read-my-haftorah" aria-labelledby="haftorah-title">
  <div class="container">
    <h2 id="haftorah-title" class="reveal">Read my Haftorah</h2>
    <p class="lead reveal" data-delay="1" style="margin-bottom:1.25rem">Reserve a Shabbat or festival to read the Haftorah at Hadley Wood Shul. Pick a date below and we&rsquo;ll tell you which Haftorah it is.</p>

    <div class="split split--top split--cal reveal" data-delay="1">
      <div class="cal">
        <p id="hfLoading" class="cal__loading">Loading calendar&hellip;</p>
        <div class="cal__head">
          <button id="hfPrev" type="button" class="cal__nav" aria-label="Previous month">&larr; Prev</button>
          <h3 id="hfMonthLabel" aria-live="polite"></h3>
          <button id="hfNext" type="button" class="cal__nav" aria-label="Next month">Next &rarr;</button>
        </div>
        <div class="cal__weekdays" aria-hidden="true">
          <div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div><div>Sun</div>
        </div>
        <div id="hfGrid" class="cal__grid" role="group" aria-label="Calendar dates"></div>
        <p class="cal__key"><span><span class="chip chip--free">Available</span> tap to reserve</span><span><span class="chip chip--festival">Festival</span> festival date</span><span><span class="chip chip--booked">Reserved</span> tap to see who</span></p>
      </div>
      <div id="hfFormBox" class="form-card" aria-live="polite">
        <p class="form-intro">Select an available date on the calendar to reserve the Haftorah at <strong>Hadley Wood Shul</strong>.</p>
      </div>
    </div>

    <div class="split split--top reveal" data-delay="2" style="margin-top:1.25rem">
      <div class="form-card">
        <h3 style="font-size:1.2rem">Find your Haftorah date</h3>
        <p class="muted" style="font-size:0.95rem">Type the Parasha or Haftorah name (minor spelling mistakes are fine). Covers now through 2035.</p>
        <div class="lookup">
          <input id="hfLookupInput" placeholder="e.g. Ki Tavo, Noach, Yitro" aria-label="Parasha or Haftorah name">
          <button id="hfLookupBtn" type="button" class="btn btn--primary">Find dates</button>
        </div>
        <div id="hfLookupResults" class="lookup__results"></div>
      </div>
      <div class="form-card">
        <h3 style="font-size:1.2rem">Who&rsquo;s booked</h3>
        <input id="hfWhoBookedSearch" class="who-search" placeholder="Search by name or date, e.g. Steve or March" aria-label="Search bookings">
        <div id="hfWhoBookedList" class="who-box"></div>
      </div>
    </div>

    <p class="haftorah-note">Festival dates are only updated through the end of 2026. For questions or changes, please use the Haftorah List WhatsApp group.</p>
    <p class="credit">This reservation system was built by <a href="https://webcoreuk.com" rel="noopener" target="_blank">Webcore</a> (Ethan Ross) with help and inspiration from David Allen.</p>
  </div>
</section>

<section class="section" aria-label="Community links">
  <div class="container">
    <div class="card-grid card-grid--wide reveal-stagger">
      <article class="card" id="events">
        <div class="card__icon">{icon('calendar')}</div>
        <h3>Events</h3>
        <p>Services, dinners, speakers and socials, listed on the United Synagogue site.</p>
        <a class="btn btn--primary" href="https://myus.theus.org.uk/events" rel="noopener" target="_blank">See events {icon('external')}</a>
      </article>
      <article class="card" id="kiddush">
        <div class="card__icon">{icon('cup')}</div>
        <h3>Book a Kiddush</h3>
        <p>Sponsor the Shabbat morning Kiddush for a simcha or in memory of a loved one. Pick your date online.</p>
        <a class="btn btn--secondary" href="/book-my-kiddush.html">Book my Kiddush {icon('arrow')}</a>
      </article>
      <article class="card" id="bar-bat-mitzvah">
        <div class="card__icon">{icon('star')}</div>
        <h3>Bar &amp; Bat Mitzvah</h3>
        <p>Arranged with the Rabbi, separately from venue hire.</p>
        <a class="btn btn--primary" href="mailto:rabbitoby@hwjc.org.uk?subject=Bar%20or%20Bat%20Mitzvah">{icon('mail')} Contact Rabbi Toby</a>
      </article>
      <article class="card card--secondary" id="hatzola">
        <div class="card__icon">{icon('cross')}</div>
        <h3>Hatzola HBS</h3>
        <p>Volunteer emergency ambulance service for Hadley Wood, Barnet and Southgate, open to everyone. In a life-threatening emergency call 999.</p>
        <p><a class="emergency-number" href="tel:+442033256998">0203 325 6998</a><br><span class="muted" style="font-size:0.9rem">Non-emergency line</span></p>
        <a class="btn btn--primary" href="https://www.hatzolahbs.com" rel="noopener" target="_blank">hatzolahbs.com {icon('external')}</a>
      </article>
    </div>
  </div>
</section>
"""

community += f"""
<div id="faqChatRoot" class="chat-root">
  <div id="faqChatPanel" class="chat-panel" hidden>
    <div class="chat-head">
      <span>Haftorah FAQ</span>
      <button id="faqChatClose" type="button" class="chat-close" aria-label="Close">&times;</button>
    </div>
    <div id="faqChatMessages" class="chat-messages">
      <div class="chat-hint">Tap a question below to see the answer.</div>
    </div>
    <div id="faqChatQuestions" class="chat-questions"></div>
  </div>
  <button id="faqChatToggle" type="button" class="btn btn--primary" aria-expanded="false" aria-controls="faqChatPanel">Questions?</button>
</div>
<script src="/js/haftorah.js?v={_v("js/haftorah.js")}" defer></script>
"""

page("community.html", "/community.html",
     "Community: Events, Kiddush, Haftorah, Bar & Bat Mitzvah, Hatzola | Hadley Wood Shul",
     "Get involved at Hadley Wood Jewish Community: events, sponsor a Kiddush, read a Haftorah, plan a Bar or Bat Mitzvah, and support Hatzola HBS in Hadley Wood, Barnet and Southgate.",
     "/community.html", community)

# =====================================================================
# BOOK MY KIDDUSH
# =====================================================================
kiddush = f"""
<section class="hero hero--simple" aria-labelledby="kiddush-title">
  <div class="container">
    <span class="eyebrow reveal">Book my Kiddush &middot; Hadley Wood Shul</span>
    <h1 id="kiddush-title" class="reveal" data-delay="1">Reserve your Kiddush date</h1>
    <p class="lead reveal" data-delay="2">Choose an available Shabbat or festival date to sponsor the Kiddush, pick a package, and you&rsquo;ll get a confirmation by email.</p>
    <div class="btn-row reveal" data-delay="3">
      <a class="btn btn--primary" href="#calendar">Open the calendar {icon('arrow')}</a>
      <a class="btn btn--outline" href="#faq">Key information</a>
    </div>
  </div>
</section>

<section class="section" id="calendar" aria-labelledby="calendar-title">
  <div class="container">
    <h2 id="calendar-title" class="reveal">Choose your date</h2>
    <p class="muted reveal" style="margin-top:-0.4rem">Only Saturdays and set festival dates can be booked.</p>
    <div class="split split--top split--cal reveal" data-delay="1">
      <div class="cal">
        <p id="loading" class="cal__loading">Loading calendar&hellip;</p>
        <div class="cal__head">
          <button id="prevBtn" type="button" class="cal__nav" aria-label="Previous month">&larr; Prev</button>
          <h3 id="monthLabel" aria-live="polite"></h3>
          <button id="nextBtn" type="button" class="cal__nav" aria-label="Next month">Next &rarr;</button>
        </div>
        <div class="cal__weekdays" aria-hidden="true">
          <div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div><div>Sun</div>
        </div>
        <div id="grid" class="cal__grid" role="group" aria-label="Calendar dates"></div>
        <p class="cal__key"><span><span class="chip chip--free">Available</span> tap to book</span><span><span class="chip chip--booked">Booked</span> already taken</span></p>
      </div>
      <div id="formBox" class="form-card" aria-live="polite">
        <p class="form-intro">Select an available date on the calendar to sponsor the Kiddush at <strong>Hadley Wood Shul</strong>.</p>
      </div>
    </div>
  </div>
</section>

<section class="section" id="faq" aria-labelledby="faq-title">
  <div class="container">
    <h2 id="faq-title" class="reveal">Key information</h2>
    <div class="faq reveal" data-delay="1">
      <details>
        <summary>How do I book a Kiddush?</summary>
        <p>Choose an available date on the calendar, select your preferred sponsorship package, and complete the booking form.</p>
      </details>
      <details>
        <summary>What about Bar and Bat Mitzvahs?</summary>
        <p>By all means book your Kiddush, but please be aware there is a separate process for booking Bar and Bat Mitzvah celebrations through the office.</p>
      </details>
      <details>
        <summary>Can I cancel or change my booking?</summary>
        <p>Yes. Please contact the office at <a href="mailto:{EMAIL}">{EMAIL}</a> for help with cancellations or changes.</p>
      </details>
      <details>
        <summary>Who can see the amount I&rsquo;ve sponsored?</summary>
        <p>Only the Shul office.</p>
      </details>
      <details>
        <summary>What if a date says &ldquo;Booked&rdquo;?</summary>
        <p>That means it&rsquo;s already taken. Please select another available Shabbat or festival date.</p>
      </details>
    </div>
    <p style="margin-top:1.5rem">Questions? Email <a href="mailto:{EMAIL}">{EMAIL}</a>.</p>
    <p class="credit">This booking system was built by <a href="https://webcoreuk.com" rel="noopener" target="_blank">Webcore</a> (Ethan Ross) with help from Craig Greene.</p>
  </div>
</section>

<div id="faqChatRoot" class="chat-root">
  <div id="faqChatPanel" class="chat-panel" hidden>
    <div class="chat-head">
      <span>Kiddush FAQ</span>
      <button id="faqChatClose" type="button" class="chat-close" aria-label="Close">&times;</button>
    </div>
    <div id="faqChatMessages" class="chat-messages">
      <div class="chat-hint">Tap a question below to see the answer.</div>
    </div>
    <div id="faqChatQuestions" class="chat-questions"></div>
  </div>
  <button id="faqChatToggle" type="button" class="btn btn--primary" aria-expanded="false" aria-controls="faqChatPanel">Questions?</button>
</div>
<script src="/js/kiddush.js?v={_v("js/kiddush.js")}" defer></script>
"""

page("book-my-kiddush.html", "/book-my-kiddush.html",
     "Book my Kiddush | Sponsor a Shabbat Kiddush at Hadley Wood Shul",
     "Reserve a Shabbat or festival date to sponsor the Kiddush at Hadley Wood Jewish Community, Barnet. Choose a date, pick a package and get an email confirmation.",
     "/book-my-kiddush.html", kiddush)

# =====================================================================
# 404
# =====================================================================
notfound = f"""
<section class="hero hero--simple">
  <div class="container container--narrow" style="text-align:center">
    <h1>Page not found</h1>
    <p class="lead">That page has moved or never existed.</p>
    <div class="btn-row" style="justify-content:center">
      <a class="btn btn--primary" href="/">Back to Welcome</a>
    </div>
  </div>
</section>
"""
page("404.html", "/404.html", "Page not found | Hadley Wood Jewish Community",
     "The page you were looking for could not be found.", "", notfound)

# ---- sitemap / robots ----
pages = ["/", "/rabbi.html", "/cheder.html", "/hall-hire.html", "/book-my-kiddush.html", "/community.html"]
sm = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
for p in pages:
    prio = "1.0" if p == "/" else "0.8"
    sm += f"  <url><loc>{SITE}{p}</loc><changefreq>monthly</changefreq><priority>{prio}</priority></url>\n"
sm += "</urlset>\n"
open(os.path.join(OUT, "sitemap.xml"), "w").write(sm)
open(os.path.join(OUT, "robots.txt"), "w").write(f"User-agent: *\nAllow: /\n\nSitemap: {SITE}/sitemap.xml\n")
open(os.path.join(OUT, ".nojekyll"), "w").write("")
print("done")
