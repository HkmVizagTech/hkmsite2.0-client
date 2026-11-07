// Inject shared partials into every page
(function() {
  const isDonate = location.pathname.includes('donate');

  const topBar = `
<div class="top-bar">
  <div class="container">
    <div class="left">
      <span class="icon-btn"><svg class="icon" viewBox="0 0 24 24" style="font-size:14px"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm16 2l-8 5-8-5"/></svg></span>
      <span class="icon-btn"><svg class="icon" viewBox="0 0 24 24" style="font-size:14px"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 13 19.79 19.79 0 0 1 1.08 4.29a2 2 0 0 1 2-2.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg></span>
      <span style="font-weight:500">+91-98765 43210</span>
    </div>
    <div class="right">
      <div class="darshan-pill"><span class="darshan-dot"></span> Darshan Open &nbsp;4:30 – 20:45</div>
      <div class="social-icons">
        <a href="#"><svg class="icon" viewBox="0 0 24 24" style="font-size:16px"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/></svg></a>
        <a href="#"><svg class="icon" viewBox="0 0 24 24" style="font-size:16px"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg></a>
        <a href="#"><svg class="icon" viewBox="0 0 24 24" style="font-size:16px"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" fill="currentColor"/></svg></a>
      </div>
    </div>
  </div>
</div>`;

  const navWhite = `
<nav class="main-nav">
  <div class="inner">
    <a href="home.html" class="logo">
      <div class="logo-mark"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 21h18M5 21V11l7-7 7 7v10M10 21v-6h4v6"/></svg></div>
      <div class="logo-text">HARE KRISHNA<br/>VAIKUNTHAM<small>VIZAG</small></div>
    </a>
    <div class="nav-links" id="navLinks"></div>
    <div class="nav-right">
      <div class="theme-toggle"><svg class="icon" viewBox="0 0 24 24" style="font-size:16px"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor"/></svg></div>
      <a href="donate-home.html" class="btn btn-pill-blue"><svg class="icon" viewBox="0 0 24 24" style="font-size:14px"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="currentColor" stroke="none"/></svg> Donate Now</a>
    </div>
  </div>
</nav>`;

  const navDark = `
<nav class="main-nav donate-nav">
  <div class="inner">
    <a href="donate-home.html" class="logo">
      <div class="logo-mark"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 21h18M5 21V11l7-7 7 7v10M10 21v-6h4v6"/></svg></div>
      <div class="logo-text">HARE KRISHNA<br/>VAIKUNTHAM<small>VIZAG · DONATIONS</small></div>
    </a>
    <div class="nav-links" id="navLinks"></div>
    <div class="nav-right">
      <a href="donate-seva.html" class="btn btn-pill-gold" style="padding:0.55rem 1.4rem;font-size:0.85rem"><svg class="icon" viewBox="0 0 24 24" style="font-size:14px;color:#1F36A0"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="currentColor" stroke="none"/></svg> Quick Donate</a>
    </div>
  </div>
</nav>`;

  const links = [
    {label: 'Home', href: 'home.html'},
    {label: 'About', href: 'about.html', arrow: true},
    {label: 'Mandir', href: 'about.html', arrow: true},
    {label: 'Prabhupada', href: 'prabhupada.html', arrow: true},
    {label: 'Activities', href: 'category.html', arrow: true},
    {label: 'Festivals', href: 'festivals.html'},
    {label: 'Blog', href: 'blog.html'},
    {label: 'Get Involved', href: 'contact.html', arrow: true},
  ];

  const footer = `
<div class="temple-footer-strip">
  <svg viewBox="0 0 800 480" preserveAspectRatio="xMidYEnd meet">
    <defs>
      <linearGradient id="bigTempleG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#1F36A0"/>
        <stop offset="0.4" stop-color="#5d4a8a"/>
        <stop offset="0.8" stop-color="#d4a35a"/>
        <stop offset="1" stop-color="#a07050"/>
      </linearGradient>
    </defs>
    <path d="M340 460 L340 180 Q400 60 460 180 L460 460 Z" fill="url(#bigTempleG)"/>
    <rect x="180" y="280" width="160" height="180" fill="#c89060"/>
    <rect x="460" y="280" width="160" height="180" fill="#c89060"/>
    <rect x="60" y="340" width="120" height="120" fill="#a07050"/>
    <rect x="620" y="340" width="120" height="120" fill="#a07050"/>
    <ellipse cx="240" cy="280" rx="60" ry="40" fill="#5a4080"/>
    <ellipse cx="560" cy="280" rx="60" ry="40" fill="#5a4080"/>
    <ellipse cx="120" cy="340" rx="40" ry="28" fill="#5a4080"/>
    <ellipse cx="680" cy="340" rx="40" ry="28" fill="#5a4080"/>
    <g fill="#7bb37b" opacity="0.85">
      <rect x="210" y="340" width="14" height="36" rx="7"/>
      <rect x="235" y="340" width="14" height="36" rx="7"/>
      <rect x="260" y="340" width="14" height="36" rx="7"/>
      <rect x="290" y="340" width="14" height="36" rx="7"/>
      <rect x="496" y="340" width="14" height="36" rx="7"/>
      <rect x="521" y="340" width="14" height="36" rx="7"/>
      <rect x="546" y="340" width="14" height="36" rx="7"/>
      <rect x="576" y="340" width="14" height="36" rx="7"/>
    </g>
    <path d="M380 460 L380 380 Q400 340 420 380 L420 460 Z" fill="#7a5040"/>
    <line x1="400" y1="180" x2="400" y2="100" stroke="#d4a35a" stroke-width="4"/>
    <circle cx="400" cy="96" r="6" fill="#f4c54e"/>
    <circle cx="400" cy="78" r="4" fill="#f4c54e"/>
  </svg>
</div>
<footer class="main-footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <div class="logo">
          <div class="logo-mark"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 21h18M5 21V11l7-7 7 7v10M10 21v-6h4v6"/></svg></div>
          <div class="logo-text">HARE KRISHNA<br/>VAIKUNTHAM<small>VIZAG</small></div>
        </div>
        <p style="margin-top:1.5rem">Hare Krishna Marg,<br/>Near Simhachalam,<br/>Visakhapatnam – 530028</p>
        <div class="footer-social">
          <a href="#"><svg class="icon" viewBox="0 0 24 24" style="font-size:16px"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/></svg></a>
          <a href="#"><svg class="icon" viewBox="0 0 24 24" style="font-size:16px"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg></a>
          <a href="#"><svg class="icon" viewBox="0 0 24 24" style="font-size:16px"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" fill="currentColor"/></svg></a>
        </div>
      </div>
      <div><h4>About</h4><div class="footer-links"><a href="about.html">About Us</a><a href="about.html">Mandir</a><a href="prabhupada.html">Srila Prabhupada</a><a href="about.html">Our Vision</a></div></div>
      <div><h4>Activities</h4><div class="footer-links"><a href="category.html">All Activities</a><a href="event-detail.html">Anna Daan</a><a href="event-detail.html">Gau Seva</a><a href="event-detail.html">Education</a></div></div>
      <div><h4>Get Involved</h4><div class="footer-links"><a href="contact.html">Volunteer</a><a href="donate-home.html">Donate</a><a href="donate-seva.html">Subhojanam</a><a href="donate-home.html">Square Feet Seva</a></div></div>
      <div><h4>Contact</h4><div class="footer-links"><a href="tel:+919876543210">+91 98765 43210</a><a href="mailto:info@harekrishnavizag.org">info@harekrishnavizag.org</a><a href="contact.html">Daily Schedule</a></div></div>
    </div>
    <div class="footer-bottom">
      <div class="copy">Copyright © 2026 <b>Hare Krishna Vaikuntham</b>. All rights Reserved.</div>
      <div class="links"><a href="#">Terms of Use</a> &nbsp;|&nbsp; <a href="#">Privacy Policy</a></div>
    </div>
  </div>
</footer>`;

  // Inject elements at known mount points
  const topBarEl = document.getElementById('top-bar');
  const navEl = document.getElementById('main-nav');
  const footerEl = document.getElementById('main-footer');

  if (topBarEl) topBarEl.outerHTML = topBar;
  if (navEl) navEl.outerHTML = isDonate ? navDark : navWhite;
  if (footerEl) footerEl.outerHTML = footer;

  // Populate nav links
  setTimeout(() => {
    const navLinksEl = document.getElementById('navLinks');
    if (navLinksEl) {
      const currentPage = location.pathname.split('/').pop();
      navLinksEl.innerHTML = links.map(l =>
        `<a href="${l.href}" class="${currentPage === l.href ? 'active' : ''} ${l.arrow ? 'has-arrow' : ''}">${l.label}</a>`
      ).join('');
    }
  }, 10);

  // Add FAB to return to preview index
  if (!location.pathname.endsWith('index.html') && location.pathname !== '/' && !location.pathname.endsWith('/preview/')) {
    const fab = document.createElement('a');
    fab.href = 'index.html';
    fab.className = 'preview-fab';
    fab.innerHTML = '◀ All pages';
    document.body.appendChild(fab);
  }
})();
