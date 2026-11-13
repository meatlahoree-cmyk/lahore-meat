/* ===== Lahore Meat – script.js ===== */
const WA = '923280446790';          // WhatsApp number (international format)
const PHONE = '0328 0446790';
const DELIVERY = 350;               // Mutton / Beef / Frozen Chicken delivery charges
const INSTA = 'https://www.instagram.com/lahoremeat/';
const FB = 'https://www.facebook.com/lahoremeat1/';
const LINKEDIN = 'https://www.linkedin.com/company/lahore-meat/home/';
const TIKTOK = 'https://www.tiktok.com/@lahoremeat?lang=en';
const PINTEREST = 'https://www.pinterest.com/meatlahoree/';
const YOUTUBE = 'https://www.youtube.com/@meatlahore';
const SHOPS = [
  'Shop 1: Al Latif Center, 40 Main Boulevard Gulberg, Block D1, Gulberg III',
  'Shop 2: DHA Phase 3',
  'Shop 3: Shadbagh'
];

/* ---------- Products ---------- */
const PRODUCTS = [
  // Mutton – Rs. 3200 / kg
  { id: 'm1', cat: 'mutton', name: 'Regular Mutton', price: 3200, img: 'mutton-regular.jpg' },
  { id: 'm2', cat: 'mutton', name: 'Mutton Mince (Qeema)', price: 3200, img: 'mutton-minceqeema.jpg' },
  { id: 'm3', cat: 'mutton', name: 'Mutton Raan (Leg)', price: 3200, img: 'mutton-raan-leg.jpg' },
  { id: 'm4', cat: 'mutton', name: 'Mutton Seena (Chest)', price: 3200, img: 'mutton-seena-chest.jpg' },
  { id: 'm5', cat: 'mutton', name: 'Mutton Neck', price: 3200, img: 'mutton-neck.jpg' },
  { id: 'm6', cat: 'mutton', name: 'Mutton Chaamp (Ribs)', price: 3200, img: 'mutton-chaamp-ribs.jpg' },
  { id: 'm7', cat: 'mutton', name: 'Mutton Back Chop (Puth)', price: 3200, img: 'mutton-backchopputh.jpg' },
  { id: 'm8', cat: 'mutton', name: 'Mutton Dasti (Shoulder)', price: 3200, img: 'mutton-dastishoulder.jpg' },
  // Beef
  { id: 'b1', cat: 'beef', name: 'Beef With Bone', price: 1500, img: 'beef-withbone.jpg' },
  { id: 'b2', cat: 'beef', name: 'Beef Boneless', price: 1850, img: 'beef-boneless.jpg' },
  { id: 'b3', cat: 'beef', name: 'Beef Raan (Leg)', price: 1500, img: 'beef-raanleg.jpg' },
  { id: 'b4', cat: 'beef', name: 'Beef Seena (Chest)', price: 1500, img: 'beef-seenachest.jpg' },
  { id: 'b5', cat: 'beef', name: 'Beef Neck', price: 1500, img: 'beef-neck.jpeg' },
  { id: 'b6', cat: 'beef', name: 'Beef Chaamp (Ribs)', price: 1500, img: 'beef-chaampribs.jpg' },
  { id: 'b7', cat: 'beef', name: 'Beef Back Chop (Puth)', price: 1500, img: 'beef-backchopputh.jpg' },
  { id: 'b8', cat: 'beef', name: 'Beef Dasti (Shoulder)', price: 1500, img: 'beef-dastishoulder.jpg' },
  // Frozen chicken
  { id: 'c1', cat: 'chicken', name: 'Chicken Burger Patty', price: 650, img: 'chicken-bargar-petty.jpg', unit: 'pack', note: '6 pieces (1 patty = 80–100 g)' },
  { id: 'c2', cat: 'chicken', name: 'Chicken Nuggets', price: 650, img: 'chicken-nuggets.jpg', unit: 'pack', note: 'Half kg pack' },
  // Aqiqah
  { id: 'a1', cat: 'aqiqah', name: 'Aqiqah Bakra 12–14 kg', price: 55000, img: 'aqiqah-bakra12-14kg.png', unit: 'bakra', note: 'Weight: 12–14 kg' },
  { id: 'a2', cat: 'aqiqah', name: 'Aqiqah Bakra 14–15 kg', price: 60000, img: 'aqiqah-bakra14-15kg.png', unit: 'bakra', note: 'Weight: 14–15 kg' },
  { id: 'a3', cat: 'aqiqah', name: 'Aqiqah Bakra 15–16 kg', price: 65000, img: 'aqiqah-bakra15-16kg.png', unit: 'bakra', note: 'Weight: 15–16 kg' }
];
const byId = id => PRODUCTS.find(p => p.id === id);
const isKg = p => !p.unit;
const step = p => (isKg(p) ? 0.5 : 1);
const fmt = n => 'Rs. ' + Number(n).toLocaleString('en-PK');
const qtyLabel = (p, q) => (isKg(p) ? q + ' kg' : q + ' ' + p.unit + (q > 1 ? 's' : ''));

/* ---------- Cart (saved in browser) ---------- */
let cart = {};
try { cart = JSON.parse(localStorage.getItem('lm_cart')) || {}; } catch (e) { cart = {}; }
const saveCart = () => { try { localStorage.setItem('lm_cart', JSON.stringify(cart)); } catch (e) {} updateCart(); };

function cartTotals() {
  let sub = 0, needDelivery = false;
  Object.entries(cart).forEach(([id, q]) => {
    const p = byId(id); if (!p) return;
    sub += p.price * q;
    if (p.cat !== 'aqiqah') needDelivery = true;
  });
  const delivery = needDelivery ? DELIVERY : 0;
  return { sub, delivery, total: sub + delivery };
}

function updateCart() {
  const count = document.getElementById('cartCount');
  const box = document.getElementById('cartItems');
  const ids = Object.keys(cart).filter(id => byId(id));
  if (count) count.textContent = ids.length;
  if (!box) return;
  box.innerHTML = ids.length ? ids.map(id => {
    const p = byId(id);
    return `<div class="ci"><div>${p.name}<small>${qtyLabel(p, cart[id])} × ${fmt(p.price)}</small></div>
      <div style="text-align:right">${fmt(p.price * cart[id])}<br><button onclick="removeItem('${id}')">Remove</button></div></div>`;
  }).join('') : '<p class="empty">Aap ka cart khali hai.</p>';
  const t = cartTotals();
  document.getElementById('cSub').textContent = fmt(t.sub);
  document.getElementById('cDel').textContent = t.delivery ? fmt(t.delivery) : 'Free';
  document.getElementById('cTotal').textContent = fmt(t.total);
}
window.removeItem = id => { delete cart[id]; saveCart(); };
const toggleCart = open => {
  document.getElementById('drawer').classList.toggle('open', open);
  document.getElementById('overlay').classList.toggle('open', open);
};

function sendOrder() {
  const ids = Object.keys(cart).filter(id => byId(id));
  if (!ids.length) { alert('Pehle koi product cart mein add karein.'); return; }
  const name = document.getElementById('cName').value.trim();
  const addr = document.getElementById('cAddr').value.trim();
  if (!name || !addr) { alert('Barah-e-karam apna naam aur address likhein.'); return; }
  const t = cartTotals();
  let msg = '*NEW ORDER – LAHORE MEAT*\n\n';
  msg += `*Name:* ${name}\n*Address:* ${addr}\n\n*Order Details:*\n`;
  ids.forEach((id, i) => {
    const p = byId(id);
    msg += `${i + 1}. ${p.name} – ${qtyLabel(p, cart[id])} × ${fmt(p.price)} = ${fmt(p.price * cart[id])}\n`;
  });
  msg += `\nSubtotal: ${fmt(t.sub)}\nDelivery: ${t.delivery ? fmt(t.delivery) : 'Free'}\n*Total: ${fmt(t.total)}*\n\nShukriya!`;
  window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`, '_blank');
}

/* ---------- Product cards ---------- */
function renderProducts() {
  document.querySelectorAll('[data-cat]').forEach(box => {
    const list = PRODUCTS.filter(p => p.cat === box.dataset.cat);
    box.innerHTML = list.map(p => `
      <article class="prod" data-id="${p.id}">
        <img src="${p.img}" alt="${p.name} Lahore – Lahore Meat" loading="lazy">
        <div class="prod-body">
          <h3>${p.name}</h3>
          ${p.note ? `<small>${p.note}</small>` : ''}
          <div class="price">${fmt(p.price)} <span>/ ${isKg(p) ? '1 kg (1000 g)' : p.unit}</span></div>
          <div class="qty">
            <button type="button" data-d="-1" aria-label="Kam karein">−</button>
            <output>${isKg(p) ? '1 kg' : '1 ' + p.unit}</output>
            <button type="button" data-d="1" aria-label="Zyada karein">+</button>
          </div>
          <button class="btn btn-gold" type="button" data-add>Add to Cart</button>
        </div>
      </article>`).join('');
    box.querySelectorAll('.prod').forEach(card => {
      const p = byId(card.dataset.id); let q = 1;
      const out = card.querySelector('output');
      card.querySelectorAll('[data-d]').forEach(b => b.onclick = () => {
        q = Math.max(step(p), +(q + step(p) * b.dataset.d).toFixed(1));
        out.textContent = qtyLabel(p, q).replace(/s$/, q > 1 ? 's' : '');
      });
      card.querySelector('[data-add]').onclick = e => {
        cart[p.id] = +((cart[p.id] || 0) + q).toFixed(1);
        saveCart();
        toggleCart(true);
        e.target.textContent = '✓ Added';
        setTimeout(() => (e.target.textContent = 'Add to Cart'), 1200);
      };
    });
  });
}

/* ---------- Header & Footer ---------- */
const icons = {
  li: '<svg viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z"/></svg>',
  tt: '<svg viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>',
  pi: '<svg viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026z"/></svg>',
  yt: '<svg viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>',
  wa: '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm5.8 14.2c-.2.7-1.4 1.3-2 1.4-.5.1-1.2.1-1.9-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5-4.5-.2-.2-1.2-1.6-1.2-3s.8-2.1 1-2.4c.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .600l-.4.6-.4.5c-.1.2-.3.4-.1.7.2.3.8 1.3 1.7 2.1 1.2 1 2.2 1.4 2.5 1.5.3.1.5.1.7-.1l.9-1.1c.2-.3.4-.2.7-.1l2 .9c.3.1.5.2.5.3.1.2.1.8-.1 1.5z"/></svg>',
  ig: '<svg viewBox="0 0 24 24"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5zm0 2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5zM17.5 5.5a1 1 0 1 1-1 1 1 1 0 0 1 1-1z"/></svg>',
  fb: '<svg viewBox="0 0 24 24"><path d="M14 8V6.5c0-.7.2-1 1.2-1H17V2h-2.7C11.2 2 10 3.8 10 6v2H7.5v3.5H10V22h4v-10.5h2.7L17 8h-3z"/></svg>'
};
const pages = [['index.html', 'Home'], ['mutton.html', 'Mutton'], ['beef.html', 'Beef'], ['frozen-chicken.html', 'Frozen Chicken'],
  ['aqiqah.html', 'Aqiqah'], ['blog.html', 'Blog'], ['contact.html', 'Contact Us']];

function renderLayout() {
  const cur = location.pathname.split('/').pop() || 'index.html';
  document.getElementById('site-header').innerHTML = `
    <div class="topbar"><span>📞 Call karein: Lahore Meat ${PHONE} &nbsp;•&nbsp; Fresh Mutton, Beef, Frozen Chicken &amp; Aqiqah Services in Lahore &nbsp;•&nbsp; WhatsApp par order karein: +92 328 0446790 &nbsp;•&nbsp; 📞 Call karein: Lahore Meat ${PHONE}</span></div>
    <header class="header"><div class="container">
      <a class="brand" href="index.html"><img src="logo.png" alt="Lahore Meat logo"><span>Lahore Meat</span></a>
      <nav class="nav" id="nav">${pages.map(([h, n]) => `<a href="${h}" class="${h === cur ? 'active' : ''}">${n}</a>`).join('')}
        <button class="cart-btn" id="cartOpen" type="button">🛒 Cart <b id="cartCount">0</b></button></nav>
      <button class="burger" id="burger" aria-label="Menu">☰</button>
    </div></header>`;
  document.getElementById('site-footer').innerHTML = `
    <footer class="footer"><div class="container"><div class="cols">
      <div><h4>Lahore Meat</h4><p>Premium quality mutton, beef, frozen chicken aur aqiqah services – Lahore mein ghar tak delivery.</p>
        <div class="social"><a href="${FB}" target="_blank" rel="noopener" aria-label="Facebook">${icons.fb}</a>
        <a href="${INSTA}" target="_blank" rel="noopener" aria-label="Instagram">${icons.ig}</a>
        <a href="${LINKEDIN}" target="_blank" rel="noopener" aria-label="LinkedIn">${icons.li}</a>
        <a href="${TIKTOK}" target="_blank" rel="noopener" aria-label="TikTok">${icons.tt}</a>
        <a href="${PINTEREST}" target="_blank" rel="noopener" aria-label="Pinterest">${icons.pi}</a>
        <a href="${YOUTUBE}" target="_blank" rel="noopener" aria-label="YouTube">${icons.yt}</a></div></div>
      <div><h4>Quick Links</h4><ul>${pages.map(([h, n]) => `<li><a href="${h}">${n}</a></li>`).join('')}</ul></div>
      <div><h4>Categories</h4><ul><li><a href="mutton.html">Fresh Mutton Lahore</a></li><li><a href="beef.html">Beef Lahore</a></li>
        <li><a href="frozen-chicken.html">Frozen Chicken</a></li><li><a href="aqiqah.html">Aqiqah Bakra Lahore</a></li></ul></div>
      <div><h4>Contact</h4><ul><li>📞 <a href="tel:+923280446790">+92 328 0446790</a></li><li>💬 <a href="https://wa.me/${WA}" target="_blank" rel="noopener">WhatsApp Order</a></li></ul></div>
      <div><h4>Our Shops</h4><ul>${SHOPS.map(a => `<li>📍 ${a}</li>`).join('')}</ul></div>
    </div></div><div class="copy">© ${new Date().getFullYear()} Lahore Meat. All rights reserved.</div></footer>
    <a class="wa-float" href="https://wa.me/${WA}" target="_blank" rel="noopener" aria-label="WhatsApp">${icons.wa}</a>
    <div class="overlay" id="overlay"></div>
    <aside class="drawer" id="drawer"><header><h3>Aap ka Order</h3><div class="dh-actions"><a class="dh-wa" href="https://wa.me/${WA}" target="_blank" rel="noopener" aria-label="WhatsApp Chat">${icons.wa}</a><button id="cartClose" aria-label="Close">×</button></div></header>
      <div class="cart-items" id="cartItems"></div>
      <div class="cart-foot">
        <label class="fld" for="cName">Enter Full Name</label><input id="cName" type="text" placeholder="Enter Full Name" autocomplete="name"><label class="fld" for="cAddr">Enter Your Delivery Address</label><textarea id="cAddr" rows="2" placeholder="Enter Your Delivery Address" autocomplete="street-address"></textarea>
        <div class="row"><span>Subtotal</span><span id="cSub"></span></div>
        <div class="row"><span>Delivery (Mutton/Beef/Chicken Rs. ${DELIVERY})</span><span id="cDel"></span></div>
        <div class="row total"><span>Total</span><span id="cTotal"></span></div>
        <button class="btn btn-wa" id="sendOrder" type="button">Order on WhatsApp</button>
      </div></aside>`;
  document.getElementById('burger').onclick = () => document.getElementById('nav').classList.toggle('open');
  document.getElementById('cartOpen').onclick = () => toggleCart(true);
  document.getElementById('cartClose').onclick = () => toggleCart(false);
  document.getElementById('overlay').onclick = () => toggleCart(false);
  document.getElementById('sendOrder').onclick = sendOrder;
}

document.addEventListener('DOMContentLoaded', () => { renderLayout(); renderProducts(); updateCart(); });
