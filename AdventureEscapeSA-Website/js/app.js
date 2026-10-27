/*
 * Adventure Escape SA / XHAW5112 — vanilla JavaScript demonstration.
 * No framework, backend, real bookings or payment gateway are required.
 * Booking selections are stored locally on this browser. Contact details are not sent.
 */
(() => {
  'use strict';
  const DATA = window.ADVENTURE_DATA;
  const PRODUCTS = [...DATA.packages, ...DATA.activities];
  const STORAGE_KEY = 'adventureEscapeSA-demo-cart-v1';
  const VAT_RATE = 0.15;
  const CURRENCY = new Intl.NumberFormat('en-ZA', {minimumFractionDigits: 2, maximumFractionDigits: 2});
  const app = document.getElementById('app');
  const menu = document.getElementById('mobile-menu');
  const toggle = document.getElementById('menu-toggle');
  let activeFilter = 'all';
  let searchTerm = '';
  let customerDraft = {name:'', email:'', phone:'', message:''};
  let lastQuote = null;
  let toastTimer;
  
  const safe = (v) => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const money = n => `R${CURRENCY.format(Number(n) || 0)}`;
  const findProduct = id => PRODUCTS.find(p => p.id === id);
  
  function loadCart() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if (!Array.isArray(saved)) return [];
      return saved.filter(item => item && findProduct(item.id) && Number.isInteger(item.quantity) && item.quantity > 0)
                  .map(item => ({id:item.id, quantity:Math.min(25, item.quantity)}));
    } catch (_) { return []; }
  }
  let cart = loadCart();
  function saveCart() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch (_) {}
    document.querySelectorAll('[data-cart-count]').forEach(el => el.textContent = cart.reduce((sum,item)=>sum+item.quantity, 0));
  }
  function changeQuantity(id, delta) {
    if (!findProduct(id)) return;
    const existing = cart.find(item => item.id === id);
    if (existing) {
      existing.quantity = Math.max(0, Math.min(25, existing.quantity + delta));
      cart = cart.filter(item => item.quantity > 0);
    } else if (delta > 0) {
      cart.push({id, quantity:1});
    }
    lastQuote = null;
    saveCart();
  }
  function totals() {
    const lines = cart.map(item => ({product:findProduct(item.id), quantity:item.quantity})).filter(x=>x.product);
    const subtotal = lines.reduce((sum, row) => sum + row.product.price * row.quantity, 0);
    const count = lines.reduce((sum, row) => sum + row.quantity, 0);
    const discountRate = count >= 4 ? .15 : count === 3 ? .10 : count === 2 ? .05 : 0;
    const discount = subtotal * discountRate;
    const beforeVat = subtotal - discount;
    const vat = beforeVat * VAT_RATE;
    return {lines, subtotal, count, discountRate, discount, beforeVat, vat, total:beforeVat + vat};
  }
  function toast(message) {
    const container = document.getElementById('toast-region');
    container.innerHTML = `<div class="toast">✓ ${safe(message)}</div>`;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { container.innerHTML = ''; }, 3400);
  }
  function breadcrumbs(crumbs) {
    return `<div class="breadcrumbs"><a href="#/home">Home</a>${crumbs.map(x => `<span>/</span>${safe(x)}`).join('')}</div>`;
  }
  function pageHero(kicker, title, description, trail) {
    return `<section class="page-hero"><div class="container">${breadcrumbs(trail || [title])}<div class="eyebrow eyebrow-light" style="margin-top:24px">${safe(kicker)}</div><h1>${title}</h1><p>${description}</p></div></section>`;
  }
  function card(product, options={}) {
    const headline = options.tag || product.eyebrow;
    return `<article class="adventure-card" data-card-category="${safe(product.category)}" data-card-name="${safe(product.name.toLowerCase())}">
      <a class="card-image-link" href="#/experience/${safe(product.id)}" aria-label="View ${safe(product.name)} details"><img class="card-image" src="${product.image}" alt="${safe(product.name)} outdoor scenery" loading="lazy"/><span class="card-image-shade"></span><span class="card-badge">${safe(headline)}</span></a>
      <div class="card-content"><h3><a href="#/experience/${safe(product.id)}">${safe(product.name)}</a></h3><p>${safe(product.subtitle)}</p>
        <div class="card-meta"><span>◉ ${safe(product.duration)}</span><span>✓ Guided</span></div><div class="card-divider"></div>
        <div class="card-bottom"><span class="price"><small>From</small> ${money(product.price)}</span><button class="mini-add" type="button" data-add="${safe(product.id)}" aria-label="Add ${safe(product.name)} to booking" title="Add to booking">+</button></div>
      </div></article>`;
  }
  function renderHome() {
    return `<section class="hero"><div class="hero-photo"></div><div class="container hero-content">
        <div class="eyebrow eyebrow-light">✦ THE OUTDOORS ARE CALLING</div>
        <h1>Find your next<br/><span class="highlight">great adventure.</span></h1>
        <p>From mountain trails to scenic waters, unforgettable moments begin right here. Discover guided experiences for families, visitors, schools and teams in the Western Cape.</p>
        <div class="hero-actions"><a href="#/packages" class="button button-gold">Explore our packages <span class="inline-arrow">↗</span></a><a href="#/about" class="button hero-outline">Our story <span class="inline-arrow">→</span></a></div>
        <div class="hero-tags"><span><b>✓</b> Guided experiences</span><span><b>✓</b> Beautiful destinations</span><span><b>✓</b> All kinds of groups</span></div>
      </div><div class="hero-floating"><span class="floating-icon">✦</span><span><strong>Explore the Western Cape</strong><small>Made for beautiful memories</small></span></div></section>
      <div class="stats-strip"><div class="container stats-inner"><div class="stat"><span class="stat-icon">◈</span><span><strong>7 adventures</strong><small>Packages &amp; activities</small></span></div><div class="stat"><span class="stat-icon">♧</span><span><strong>Nature focused</strong><small>Western Cape scenery</small></span></div><div class="stat"><span class="stat-icon">✓</span><span><strong>Professionally guided</strong><small>Briefing &amp; equipment</small></span></div><div class="stat"><span class="stat-icon">✦</span><span><strong>Save up to 15%</strong><small>When booking more</small></span></div></div></div>
      <section class="section" id="featured"><div class="container"><div class="section-header"><div><div class="section-kicker">OUR MOST-LOVED EXPERIENCES</div><h2>Choose your kind of <span style="color:var(--pine)">adventure.</span></h2><p>Explore full packages designed to bring the best of the outdoors together.</p></div><a href="#/packages" class="text-link">View all packages <span class="inline-arrow">↗</span></a></div><div class="card-grid">${DATA.packages.map(p=>card(p)).join('')}</div></div></section>
      <section class="section section-light"><div class="container"><div class="section-header"><div><div class="section-kicker">LITTLE MOMENTS, BIG MEMORIES</div><h2>Individual adventures</h2><p>Pick one experience or combine a few to build your day, your way.</p></div><a href="#/activities" class="text-link">Discover all activities <span class="inline-arrow">↗</span></a></div><div class="card-grid three">${DATA.activities.map(p=>card(p)).join('')}</div></div></section>
      <section class="savings"><div class="container savings-inner"><div class="savings-head"><span class="save-number">15%</span><div><div class="eyebrow eyebrow-light">ADVENTURE MORE, SAVE MORE</div><h2>Better together. Better value.</h2><p>Book two experiences and save 5%, three and save 10%, or four or more and save 15%. VAT is included in your final estimated quote.</p></div></div><a class="button button-gold" href="#/booking">Calculate my fees <span>↗</span></a></div></section>
      <section class="section"><div class="container panel-two"><div class="image-stack"><img src="assets/about-landscape.jpg" alt="Green mountain landscapes from the Adventure Escape SA presentation" loading="lazy"/><div class="stack-note"><b>✦</b><span><strong>Rooted in adventure</strong><small>Western Cape · Since 2024</small></span></div></div><div><div class="section-kicker">A LITTLE ABOUT US</div><h2>Beyond the ordinary. <span style="color:var(--pine)">Into the outdoors.</span></h2><p class="lead">Founded by Liam Daniels in 2024, Adventure Escape SA brings guided outdoor experiences together in one simple place.</p><p>We believe remarkable adventures are for families, tourists, schools and teams alike. Compare experiences, explore what is included, and request an estimate with confidence.</p><div class="feature-list"><span class="feature-item"><b>✓</b>Nature-inspired journeys</span><span class="feature-item"><b>✓</b>Easy booking estimates</span><span class="feature-item"><b>✓</b>Experiences for groups</span><span class="feature-item"><b>✓</b>Trusted guide support</span></div><a href="#/about" class="button button-forest">Discover our story <span>↗</span></a></div></div></section>
      <section class="section section-light"><div class="container"><div class="section-header"><div><div class="section-kicker">THE EASY WAY TO EXPLORE</div><h2>Your adventure in <span style="color:var(--pine)">three steps.</span></h2></div></div><div class="steps-grid"><div class="step-card"><div class="step-number">01</div><div class="step-icon">◈</div><h3>Find your experience</h3><p>Browse our complete collection of packages and individual activities, all in one place.</p></div><div class="step-card"><div class="step-number">02</div><div class="step-icon">▦</div><h3>Build your booking</h3><p>Select experiences and quantities. The discount and VAT are calculated automatically.</p></div><div class="step-card"><div class="step-number">03</div><div class="step-icon">✦</div><h3>View your quote</h3><p>Get an instant, downloadable estimate. This student prototype does not send real bookings.</p></div></div></div></section>
      <section class="section"><div class="container"><div class="bottom-banner"><div><span class="eyebrow eyebrow-light">YOUR NEXT STORY STARTS HERE</span><h2>It's a big world.<br/>Go and explore it.</h2><p>See all the experiences in the Adventure Escape SA demo catalogue.</p></div><a href="#/packages" class="button button-gold">See the adventures ↗</a></div></div></section>`;
  }
  function renderAbout() {
    return `${pageHero('WHO WE ARE', 'A little wild. A lot of heart.', 'Discover the inspiration behind Adventure Escape SA and the people who want to bring outdoor experiences together.', ['About us'])}
      <section class="section"><div class="container panel-two"><div><div class="section-kicker">OUR STORY</div><h2>Created for the love of <span style="color:var(--pine)">the outdoors.</span></h2><p class="lead">Adventure Escape SA was founded in 2024 by Liam Daniels, an outdoor adventure and eco-tourism enthusiast.</p><p>He noticed how difficult it could be for families, travellers, schools and corporate groups to compare outdoor experiences in one place. Adventure Escape SA is designed to make discovering packages, selecting activities and calculating estimated booking fees easier.</p><p>The business concept focuses on professionally guided outings and the natural beauty of the Western Cape, South Africa.</p><div class="story-labels"><div class="story-label"><strong>2024</strong><span>Founded</span></div><div class="story-label"><strong>7</strong><span>Experiences</span></div><div class="story-label"><strong>WC</strong><span>Home region</span></div></div></div><div class="image-stack"><img src="assets/ultimate-adventure.jpg" alt="Hikers enjoying a mountain viewpoint"/><div class="stack-note"><b>♧</b><span><strong>Explore with purpose</strong><small>Nature · People · Adventure</small></span></div></div></div></section>
      <section class="section section-light"><div class="container"><div class="section-header"><div><div class="section-kicker">WHAT DRIVES US</div><h2>More than a day out.</h2><p>Our concept is shaped by three simple ideas.</p></div></div><div class="values-grid"><article class="value-card"><div class="value-icon">♧</div><h3>Our vision</h3><p>Make outdoor exploration welcoming and easy to discover for visitors from many different backgrounds.</p></article><article class="value-card"><div class="value-icon">✦</div><h3>Our mission</h3><p>Bring together engaging, professionally guided packages with clear information and simple fee estimates.</p></article><article class="value-card"><div class="value-icon">◈</div><h3>Our goals</h3><p>Help families, tourists, schools and teams compare experiences and plan memorable time outdoors.</p></article></div></div></section>
      <section class="section"><div class="container panel-two"><div class="image-stack"><img src="assets/kayaking.jpg" alt="Kayaking in a scenic mountain setting" loading="lazy"/></div><div><div class="section-kicker">HOW WE WORK</div><h2>Good adventures begin with <span style="color:var(--pine)">good planning.</span></h2><div class="timeline"><div class="timeline-item"><strong>Discover what inspires you</strong><p>Choose from packages or individual experiences using clear descriptions and sample fees.</p></div><div class="timeline-item"><strong>Make your selection</strong><p>Add one or more activities to your booking estimate and see discounts applied.</p></div><div class="timeline-item"><strong>Plan with the right information</strong><p>A real operator would confirm venue details, availability and final invoicing before a booking.</p></div></div><a href="#/packages" class="button button-forest" style="margin-top:30px">Explore our packages ↗</a></div></div></section>`;
  }
  function renderCatalogue(which) {
    activeFilter = 'all'; searchTerm = '';
    const isPackages = which === 'packages';
    const list = isPackages ? DATA.packages : DATA.activities;
    const filters = isPackages ? [['all','All packages'],['family','Family'],['adventure','Adventure'],['mountain','Mountain'],['corporate','Corporate']] : [['all','All activities'],['water','Water'],['air','Ziplining'],['mountain','Climbing']];
    return `${pageHero(isPackages ? 'EXPLORE OUR PACKAGES' : 'PICK YOUR OWN EXPERIENCE', isPackages ? 'Every great story starts outside.' : 'Little adventures. Lasting memories.', isPackages ? 'From shared family discoveries to corporate team days, find the guided adventure that suits your group.' : 'Choose one guided activity or combine several for an experience that suits your plans.', [isPackages ? 'Packages' : 'Activities'])}
      <section class="section"><div class="container"><div class="filter-bar"><div class="filter-buttons" aria-label="Filter adventures">${filters.map(([filter,label])=>`<button type="button" class="filter-button${filter==='all'?' active':''}" data-filter="${filter}" aria-pressed="${filter==='all'}">${label}</button>`).join('')}</div><label class="search-field"><span aria-hidden="true">⌕</span><input type="search" data-search placeholder="Search experiences" aria-label="Search experiences" /></label></div><div class="results-count" id="results-count">Showing ${list.length} ${isPackages?'packages':'activities'}</div><div class="card-grid ${isPackages?'':'three'}" id="catalogue-cards">${list.map(p=>card(p)).join('')}</div><div class="empty-results" id="empty-results" hidden><h3>No experiences found</h3><p>Try a different search or filter.</p><button type="button" class="button button-forest" data-reset-filter>Show everything</button></div></div></section>
      <section class="section section-light"><div class="container"><div class="bottom-banner"><div><div class="eyebrow eyebrow-light">BOOK TOGETHER, SAVE TOGETHER</div><h2>Mix, match and save<br/>up to 15%.</h2><p>Your estimated total includes the applicable discount and 15% VAT.</p></div><a href="#/booking" class="button button-gold">Calculate total ↗</a></div></div></section>`;
  }
  function filterCatalogue() {
    const cards = [...document.querySelectorAll('#catalogue-cards .adventure-card')];
    let shown = 0;
    cards.forEach(el=>{
      const matches = (activeFilter==='all' || el.dataset.cardCategory===activeFilter) && el.dataset.cardName.includes(searchTerm);
      el.hidden = !matches;
      if(matches) shown++;
    });
    const count = document.getElementById('results-count');
    if (count) count.textContent = `Showing ${shown} of ${cards.length} experiences`;
    const empty = document.getElementById('empty-results');
    if (empty) empty.hidden = shown!==0;
    document.querySelectorAll('[data-filter]').forEach(btn=>{ const selected=btn.dataset.filter===activeFilter; btn.classList.toggle('active',selected);btn.setAttribute('aria-pressed',String(selected)); });
  }
  function renderExperience(id) {
    const product = findProduct(id);
    if (!product) return renderNotFound();
    const related = (product.type === 'package' ? DATA.packages : DATA.activities).filter(item=>item.id!==id).slice(0,3);
    return `<div class="detail-image"><img src="${product.image}" alt="${safe(product.name)} scenic imagery" /><span class="detail-photo-label">EXPLORE MORE. EXPERIENCE MORE.</span></div>
      <section class="detail-container"><div class="container">${breadcrumbs([product.type==='package'?'Packages':'Activities',product.name])}<div class="detail-grid" style="margin-top:30px"><div class="detail-heading"><div class="eyebrow">${safe(product.eyebrow)}</div><h1>${safe(product.name)}</h1><div class="detail-tags"><span class="pill">✓ Professionally guided</span><span class="pill">◷ ${safe(product.duration)}</span><span class="pill">♧ Western Cape</span></div><p class="detail-description">${safe(product.description)}</p><h2 class="detail-subheading">What's included</h2><ul class="included-list">${product.included.map(item=>`<li>${safe(item)}</li>`).join('')}</ul><div class="info-note"><strong>Important:</strong> This is a classroom demonstration of an adventure website. The fee shown is illustrative; real availability, participation requirements, venue arrangements and final fees would need confirmation from a real operator.</div></div>
      <aside class="booking-aside"><p class="aside-label">${product.type==='package'?'Package fee':'Individual activity fee'}</p><div class="aside-price">${money(product.price)}</div><div class="aside-line"></div><div class="aside-item"><span>✓</span> Guided outdoor experience</div><div class="aside-item"><span>✓</span> ${safe(product.level)}</div><div class="aside-item"><span>✓</span> Equipment and safety briefing</div><div class="aside-line"></div><button type="button" data-add="${safe(product.id)}" data-goto-booking class="button button-gold button-wide">Add to my booking <span>↗</span></button><p>Combine two or more selections for discounts of 5%, 10% or 15%.</p></aside></div></div></section>
      <section class="section section-light"><div class="container"><div class="section-header"><div><div class="section-kicker">KEEP EXPLORING</div><h2>You might also love</h2></div><a href="#/${product.type==='package'?'packages':'activities'}" class="text-link">View all <span>↗</span></a></div><div class="card-grid three">${related.map(p=>card(p)).join('')}</div></div></section>`;
  }
  function renderBooking() {
    const t = totals();
    return `${pageHero('INSTANT FEE ESTIMATOR', 'Your next adventure, all added up.', 'Select your experiences, see how the discounts work, and generate a sample quote with VAT included.', ['Calculate fees'])}
      <section class="section"><div class="container"><div class="demo-banner"><span aria-hidden="true">ⓘ</span><span><strong>Student project demo:</strong> Estimates are calculated in your browser. This is not a real reservation, payment or enquiry service, and your contact information is not transmitted.</span></div>
      <div class="quote-grid"><div><section class="quote-section"><h2>01. Your selected experiences</h2><p class="muted">Change quantities or remove items whenever you like.</p>${t.lines.length ? t.lines.map(row => `<div class="cart-row"><img src="${row.product.image}" alt=""/><div class="cart-row-main"><h3>${safe(row.product.name)}</h3><small>${money(row.product.price)} per selection</small><div><div class="qty-widget" aria-label="Quantity controls for ${safe(row.product.name)}"><button type="button" data-qty="${row.product.id}" data-delta="-1" aria-label="Decrease ${safe(row.product.name)} quantity">−</button><output>${row.quantity}</output><button type="button" data-qty="${row.product.id}" data-delta="1" aria-label="Increase ${safe(row.product.name)} quantity">+</button></div><button class="remove-item" type="button" data-remove="${row.product.id}">Remove</button></div></div><span class="cart-row-total">${money(row.product.price*row.quantity)}</span></div>`).join('') : `<div class="booking-empty"><div class="icon-big">♧</div><h3>Your adventure list is empty</h3><p>Browse our packages and add something to see your fee estimate.</p><a class="button button-forest button-small" href="#/packages">Explore packages ↗</a></div>`}</section>
      <section class="quote-section"><h2>02. Customer details</h2><p class="muted">These form fields demonstrate the information a real business would collect. Nothing is sent to a server.</p><form id="quote-form"><div class="field-grid"><div class="field"><label for="name">Full name *</label><input id="name" name="name" placeholder="Your name" autocomplete="name" maxlength="80" value="${safe(customerDraft.name)}" required /></div><div class="field"><label for="phone">Phone number *</label><input id="phone" name="phone" type="tel" placeholder="e.g. 071 000 0000" autocomplete="tel" minlength="7" maxlength="25" value="${safe(customerDraft.phone)}" required /></div><div class="field full"><label for="email">Email address *</label><input id="email" name="email" type="email" placeholder="yourname@example.com" autocomplete="email" maxlength="120" value="${safe(customerDraft.email)}" required /></div><div class="field full"><label for="message">Additional notes (optional)</label><textarea id="message" name="message" maxlength="400" placeholder="Let us know your group type or other preferences...">${safe(customerDraft.message)}</textarea></div></div><p class="field-help">* Required fields. In this demo, these details are used only to display the local quotation preview.</p></form></section>
      </div><aside class="quote-summary"><h2>Your fee estimate</h2><p class="muted" style="font-size:.82rem">All amounts are in South African rand (ZAR).</p><div class="totals-list"><div class="total-line"><span>Selected bookings</span><strong>${t.count}</strong></div><div class="total-line"><span>Subtotal</span><strong>${money(t.subtotal)}</strong></div><div class="total-line discount-line"><span>Discount (${Math.round(t.discountRate*100)}%)</span><strong>−${money(t.discount)}</strong></div><div class="total-line"><span>After discount</span><strong>${money(t.beforeVat)}</strong></div><div class="total-line"><span>VAT (15%)</span><strong>${money(t.vat)}</strong></div><div class="total-line grand"><span>Estimated total</span><strong>${money(t.total)}</strong></div></div><div class="discount-tip"><b>✦</b><span>${t.count===0?'Add two or more selections to unlock a discount.':t.discountRate===0?'Add one more selection to get 5% off.':t.discountRate===.05?'Nice! You unlocked 5% off. Add one more for 10%.':t.discountRate===.10?'Great! You unlocked 10% off. Add one more for 15%.':'You unlocked the maximum 15% discount!'}</span></div><button class="button button-gold button-wide" type="submit" form="quote-form" ${t.count===0?'disabled':''}>Generate sample quote ↗</button><p class="small-print">Quote only, not a final invoice. No real booking, transaction, data transmission or email is performed.</p><div id="quote-output" aria-live="polite"></div></aside></div></div></section>`;
  }
  function renderContact() {
    return `${pageHero('LET’S TALK ADVENTURE', 'Great experiences start with a conversation.', 'Have questions about the project, packages, or booking ideas? Explore the contact page designed for Adventure Escape SA.', ['Contact us'])}
      <section class="section"><div class="container contact-grid"><div class="contact-info-grid"><div class="contact-card"><div class="section-kicker">GET IN TOUCH</div><h2 style="font-size:2.05rem;margin:10px 0 21px">Come find your next story.</h2><div class="contact-line"><span class="contact-line-icon">⌖</span><div><strong>Operating area</strong><p>Western Cape, South Africa. Exact venues and meeting locations are not provided in the project presentation.</p></div></div><div class="contact-line"><span class="contact-line-icon">✉</span><div><strong>Enquiries</strong><p>Use the demonstration contact form. No verified company email address was supplied.</p></div></div><div class="contact-line"><span class="contact-line-icon">◷</span><div><strong>Bookings</strong><p>Available dates, times and final confirmations are not connected in this student website.</p></div></div></div><div class="map-card" role="img" aria-label="Illustrative location graphic labelled Western Cape, South Africa; not a venue map"><div class="map-pin"><div class="pin-circle">⌖</div><strong>Western Cape</strong><span>South Africa · General operating region</span></div></div><p class="muted" style="font-size:.77rem;margin:0 5px">A region illustration is used here because the provided presentation does not specify venue street addresses. Real venue maps can be added when verified addresses are available.</p></div>
      <div class="contact-card"><div class="section-kicker">SEND US A MESSAGE</div><h2 style="font-size:2rem;margin:10px 0 24px">Tell us what you have in mind.</h2><form id="contact-form"><div class="field-grid"><div class="field"><label for="contact-name">Your name *</label><input id="contact-name" name="contactName" placeholder="Full name" autocomplete="name" required maxlength="80" /></div><div class="field"><label for="contact-email">Email *</label><input id="contact-email" name="contactEmail" type="email" placeholder="yourname@example.com" autocomplete="email" required maxlength="120" /></div><div class="field full"><label for="contact-topic">I'm interested in *</label><select id="contact-topic" name="contactTopic" required><option value="">Choose a topic</option><option>Adventure packages</option><option>Individual activities</option><option>Family or school outing</option><option>Corporate group experience</option><option>General enquiry</option></select></div><div class="field full"><label for="contact-message">Message *</label><textarea id="contact-message" name="contactMessage" placeholder="Share your question or idea..." required minlength="10" maxlength="700"></textarea></div></div><button class="button button-gold button-wide" type="submit" style="margin-top:23px">Preview message ↗</button><p class="field-help">Demo only. This form displays an on-page confirmation without sending your details.</p></form><div id="contact-output" aria-live="polite"></div></div></div></section>`;
  }
  function renderNotFound() {
    return `<section class="section" style="min-height:65vh;display:grid;place-items:center"><div class="container" style="text-align:center"><div class="section-kicker">PAGE NOT FOUND</div><h1>Off the beaten track?</h1><p>We couldn't find that page in this demo site.</p><a href="#/home" class="button button-forest">Back to home ↗</a></div></section>`;
  }
  function route() {
    const hash = decodeURIComponent(location.hash.slice(1) || '/home').split('?')[0];
    const segments = hash.replace(/^\/+/, '').split('/');
    const page = segments[0] || 'home';
    if (page==='home') app.innerHTML = renderHome();
    else if (page==='about') app.innerHTML = renderAbout();
    else if (page==='packages' || page==='activities') app.innerHTML = renderCatalogue(page);
    else if (page==='experience') app.innerHTML = renderExperience(segments[1]);
    else if (page==='booking') app.innerHTML = renderBooking();
    else if (page==='contact') app.innerHTML = renderContact();
    else app.innerHTML = renderNotFound();
    document.querySelectorAll('[data-nav]').forEach(a => a.classList.toggle('active',a.dataset.nav===page || (page==='experience' && a.dataset.nav===(findProduct(segments[1])?.type==='package'?'packages':'activities'))));
    document.title = `${({home:'Find Your Next Adventure',about:'About Us',packages:'Adventure Packages',activities:'Individual Activities',booking:'Calculate Fees',contact:'Contact Us',experience:findProduct(segments[1])?.name||'Experience'}[page]||'Adventure Escape SA')} | Adventure Escape SA`;
    menu.hidden = true; toggle.setAttribute('aria-expanded','false');
    window.scrollTo({top:0,behavior:'instant'});
    saveCart();
  }
  function quoteContent(quote) {
    const t=quote.totals;
    return `<div class="quote-output"><h3>✓ Your sample quote is ready</h3><p><strong>Demo reference:</strong> ${safe(quote.reference)}</p><p><strong>Prepared for:</strong> ${safe(quote.name)}</p><p><strong>Selected:</strong> ${t.count} experience${t.count===1?'':'s'} · ${Math.round(t.discountRate*100)}% discount</p><p><strong>Estimated total (incl. VAT):</strong> ${money(t.total)}</p><button class="button button-forest button-small" type="button" data-download>Download estimate (.txt) ↓</button><p style="margin-top:13px;font-size:.73rem">This preview is generated locally. It has not been emailed or submitted.</p></div>`;
  }
  function createQuote(e) {
    e.preventDefault();
    const form = e.target;
    if (!form.reportValidity()) return;
    const t = totals();
    if (!t.count) return toast('Select an experience before generating a quote.');
    lastQuote = {name:customerDraft.name.trim(),reference:`AES-DEMO-${String(Date.now()).slice(-6)}`,totals:t,date:new Date().toLocaleDateString('en-ZA')};
    document.getElementById('quote-output').innerHTML=quoteContent(lastQuote);
    toast('Your sample quotation is ready.');
    document.getElementById('quote-output').scrollIntoView({behavior:'smooth',block:'nearest'});
  }
  function downloadQuote() {
    if (!lastQuote) return;
    const t=lastQuote.totals;
    const lines=[
      'ADVENTURE ESCAPE SA — CLASSROOM DEMO ESTIMATE',
      `Reference: ${lastQuote.reference}`,
      `Date: ${lastQuote.date}`,
      `Prepared for: ${lastQuote.name}`,
      '----------------------------------------',
      ...t.lines.map(row=>`${row.product.name} | Quantity ${row.quantity} | ${money(row.product.price*row.quantity)}`),
      '----------------------------------------',
      `Subtotal: ${money(t.subtotal)}`,
      `Discount (${Math.round(t.discountRate*100)}%): -${money(t.discount)}`,
      `After discount: ${money(t.beforeVat)}`,
      `VAT (15%): ${money(t.vat)}`,
      `ESTIMATED TOTAL: ${money(t.total)}`,
      '',
      'NOT A FINAL INVOICE OR CONFIRMED RESERVATION.',
      'This is a student project demonstration. No booking is transmitted or placed.'
    ];
    const blob = new Blob([lines.join('\n')],{type:'text/plain;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href=url;link.download=`Adventure-Escape-SA-${lastQuote.reference}.txt`;
    document.body.appendChild(link);link.click();link.remove();
    setTimeout(()=>URL.revokeObjectURL(url), 1000);
    toast('Estimate downloaded to your device.');
  }
  function previewContact(e) {
    e.preventDefault();
    if(!e.target.reportValidity()) return;
    const data = new FormData(e.target);
    document.getElementById('contact-output').innerHTML=`<div class="quote-output"><h3>✓ Message preview created</h3><p>Thank you, <strong>${safe(data.get('contactName'))}</strong>.</p><p>Your message about <strong>${safe(data.get('contactTopic'))}</strong> is displayed as a demonstration only.</p><p><strong>No email was sent.</strong> A real website would need a secure server or form provider to deliver enquiries.</p></div>`;
    toast('Message preview created (not sent).');
  }
  document.addEventListener('click', e=>{
    const addBtn=e.target.closest('[data-add]');
    if(addBtn){
      const id=addBtn.dataset.add;
      changeQuantity(id,1);
      toast(`${findProduct(id).name} added to your booking.`);
      if(addBtn.hasAttribute('data-goto-booking'))location.hash='#/booking';
      return;
    }
    const qty=e.target.closest('[data-qty]');
    if(qty){changeQuantity(qty.dataset.qty,Number(qty.dataset.delta));route();return;}
    const remove=e.target.closest('[data-remove]');
    if(remove){cart=cart.filter(item=>item.id!==remove.dataset.remove);lastQuote=null;saveCart();route();return;}
    const filter=e.target.closest('[data-filter]');
    if(filter){activeFilter=filter.dataset.filter;filterCatalogue();return;}
    const reset=e.target.closest('[data-reset-filter]');
    if(reset){activeFilter='all';searchTerm='';const el=document.querySelector('[data-search]');if(el)el.value='';filterCatalogue();return;}
    if(e.target.closest('[data-download]')){downloadQuote();return;}
    if(e.target.closest('a[href^="#/"]')){menu.hidden=true;toggle.setAttribute('aria-expanded','false');}
  });
  document.addEventListener('input',e=>{
    if(e.target.matches('[data-search]')){searchTerm=e.target.value.toLowerCase().trim();filterCatalogue();}
    if(e.target.form?.id==='quote-form' && e.target.name in customerDraft){customerDraft[e.target.name]=e.target.value;}
  });
  document.addEventListener('submit',e=>{
    if(e.target.id==='quote-form')createQuote(e);
    if(e.target.id==='contact-form')previewContact(e);
  });
  toggle.addEventListener('click',()=>{
    const opening=menu.hidden;
    menu.hidden=!opening;
    toggle.setAttribute('aria-expanded',String(opening));
    toggle.setAttribute('aria-label',opening?'Close menu':'Open menu');
  });
  window.addEventListener('hashchange',route);
  document.getElementById('year').textContent=new Date().getFullYear();
  if(!location.hash)location.hash='#/home';
  route();
})();
