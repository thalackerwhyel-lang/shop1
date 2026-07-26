// ================================================================
// VELURO — JS PARTAGÉ (veluro-shared.js)
// ================================================================

// ── MENU HAMBURGER ──
function initHamburger() {
  const btn = document.getElementById('hamburger-btn');
  const overlay = document.getElementById('mobile-nav-overlay');
  const nav = document.getElementById('mobile-nav');
  const closeBtn = document.getElementById('mobile-nav-close');
  if (!btn) return;
  const open = () => { nav.classList.add('open'); overlay.classList.add('open'); document.body.style.overflow='hidden'; };
  const close = () => { nav.classList.remove('open'); overlay.classList.remove('open'); document.body.style.overflow=''; };
  btn.addEventListener('click', open);
  overlay.addEventListener('click', close);
  if (closeBtn) closeBtn.addEventListener('click', close);
}

// ── CART PARTAGÉ (cross-pages via localStorage) ──
function getCart() { try { return JSON.parse(localStorage.getItem('veluro_cart') || '[]'); } catch { return []; } }
function saveCart(c) { localStorage.setItem('veluro_cart', JSON.stringify(c)); }
function getCartTotal() { return getCart().reduce((s,i)=>s+i.price*i.qty,0); }

function pushToCart(name, color, price, img) {
  const cart = getCart();
  const key = name+'|'+color;
  const ex = cart.find(i=>i.key===key);
  if (ex) ex.qty++; else cart.push({key,name,color,price,qty:1,img});
  saveCart(cart);
  updateAllCartCounts();
}

function updateAllCartCounts() {
  const n = getCart().reduce((s,i)=>s+i.qty,0);
  document.querySelectorAll('.cart-count-badge').forEach(el=>el.textContent=n);
}

function renderCart() {
  const cart = getCart();
  const empty=document.getElementById('cart-empty');
  const items=document.getElementById('cart-items');
  const ft=document.getElementById('cart-ft');
  if(!cart.length){if(empty)empty.style.display='flex';if(items)items.style.display='none';if(ft)ft.style.display='none';return;}
  if(empty)empty.style.display='none';
  if(items)items.style.display='block';
  if(ft)ft.style.display='block';
  items.innerHTML=cart.map((it,i)=>`
    <div class="cart-li">
      <div class="cart-li-img"><img src="${it.img}" alt="${it.name}"></div>
      <div class="cart-li-info">
        <div class="cart-li-name">${it.name}</div>
        <div class="cart-li-variant">Coloris : ${it.color}</div>
        <div class="cart-li-qty">
          <button class="qty-btn" onclick="updateQty(${i},-1)">−</button>
          <span class="qty-v">${it.qty}</span>
          <button class="qty-btn" onclick="updateQty(${i},1)">+</button>
        </div>
      </div>
      <div class="cart-li-price">${(it.price*it.qty).toFixed(2).replace('.',',')}€</div>
    </div>`).join('');
  document.getElementById('cart-total').textContent=getCartTotal().toFixed(2).replace('.',',')+'€';
}

function updateQty(idx,d){
  const cart=getCart();
  cart[idx].qty+=d;
  if(cart[idx].qty<=0)cart.splice(idx,1);
  saveCart(cart);renderCart();updateAllCartCounts();
}

function openCart(){
  document.getElementById('cart-overlay').classList.add('open');
  document.getElementById('cart-drawer').classList.add('open');
  document.body.style.overflow='hidden';
  renderCart();
}
function closeCart(){
  document.getElementById('cart-overlay').classList.remove('open');
  document.getElementById('cart-drawer').classList.remove('open');
  document.body.style.overflow='';
}

function handleCheckout(){
  // Remplacez par votre script checkout externe
  // window.ShopiGate && window.ShopiGate.redirectToCheckout({ cart: getCart() });
  alert('Checkout externe — branchez votre script ici.\nTotal : '+getCartTotal().toFixed(2).replace('.',',')+'€');
}

// ── COUNTDOWN MINUIT ──
function initCountdown(hId,mId,sId,cartCdId){
  function getMidnight(){ const n=new Date(),m=new Date(n); m.setHours(24,0,0,0); return m.getTime(); }
  const end=getMidnight();
  function tick(){
    const d=Math.max(0,end-Date.now());
    const h=String(Math.floor(d/3600000)).padStart(2,'0');
    const m=String(Math.floor((d%3600000)/60000)).padStart(2,'0');
    const s=String(Math.floor((d%60000)/1000)).padStart(2,'0');
    if(document.getElementById(hId))document.getElementById(hId).textContent=h;
    if(document.getElementById(mId))document.getElementById(mId).textContent=m;
    if(document.getElementById(sId))document.getElementById(sId).textContent=s;
    if(cartCdId&&document.getElementById(cartCdId))document.getElementById(cartCdId).textContent=h+':'+m+':'+s;
    if(d>0)setTimeout(tick,1000);
  }
  tick();
}

// ── FAQ ──
function toggleFaq(btn){
  const item=btn.closest('.faq-item');
  const open=item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i=>i.classList.remove('open'));
  if(!open)item.classList.add('open');
}

// ── TOAST ──
function showToast(msg){
  const t=document.getElementById('toast');
  document.getElementById('toast-msg').textContent=msg;
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),3000);
}

// ── GALLERY ──
function renderThumbs(images, activeIdx, mainImgId, thumbsContainerId){
  const c=document.getElementById(thumbsContainerId||'gallery-thumbs');
  const mainImg=document.getElementById(mainImgId||'main-img');
  c.innerHTML='';
  images.forEach((src,i)=>{
    const div=document.createElement('div');
    div.className='thumb'+(i===activeIdx?' active':'');
    div.onclick=()=>{ mainImg.src=src; c.querySelectorAll('.thumb').forEach(t=>t.classList.remove('active')); div.classList.add('active'); };
    const img=document.createElement('img'); img.src=src; img.alt=''; img.loading='lazy';
    div.appendChild(img); c.appendChild(div);
  });
}

// Initialisation commune
document.addEventListener('DOMContentLoaded',()=>{
  initHamburger();
  updateAllCartCounts();
});
