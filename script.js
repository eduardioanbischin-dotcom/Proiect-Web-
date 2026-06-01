let listings = [];

function loadListings() {
  return fetch('apartamente.json')
    .then(resp => {
      if (!resp.ok) throw new Error('Could not load apartamente.json');
      return resp.json();
    })
    .then(data => {
      if (!Array.isArray(data)) throw new Error('JSON is not an array');
      listings = data;
      return listings;
    })
    .catch(err => {
      console.error('Error loading listings:', err);
      listings = [];
      return listings;
    });
}

function formatPrice(v){return v.toLocaleString('ro-RO') + ' €'}

function getListingById(id) {
  return listings.find(item => item.id === id);
}

  function renderCard(item){
  const div = document.createElement('article');
  div.className = 'card';
  div.innerHTML = `
    <a href="ProductPage.html?id=${item.id}">
      <img src="${item.img}" alt="${item.title}">
    </a>
    <div class="card-body">
      <div class="price">${formatPrice(item.price)}</div>
      <div class="meta">${item.title} • ${item.location}</div>
    </div>
  `;
  return div;
}

function renderListings(targetId, data){
  const container = document.getElementById(targetId);
  container.innerHTML = '';
  if(!data.length) container.innerHTML = '<p>Nu s-au găsit rezultate.</p>';
  data.forEach(item => container.appendChild(renderCard(item)));
}

function initSearch(){
  const form = document.getElementById('searchForm');
  form.addEventListener('submit', e=>{
    e.preventDefault();
    const location = document.getElementById('qLocation').value.toLowerCase();
    const type = document.getElementById('qType').value;
    const rooms = Number(document.getElementById('qRooms').value) || 0;
    const min = Number(document.getElementById('qMin').value) || 0;
    const max = Number(document.getElementById('qMax').value) || Infinity;
    const results = listings.filter(l=>{
      const matchLoc = !location || l.location.toLowerCase().includes(location);
      const matchType = type === 'any' || l.type === type;
      const matchPrice = l.price >= min && l.price <= max;
      const matchRooms = rooms == 0 || l.rooms ==rooms;
      return matchLoc && matchType && matchPrice&& matchRooms;
    });
    renderListings('listingsGrid', results);
    window.location.hash = '#listings';
  });
}

function initSubscribe(){
  const f = document.getElementById('subscribeForm');
  if (!f) return;
  f.addEventListener('submit', e=>{
    e.preventDefault();
    const email = document.getElementById('email').value;
    if(!email) return alert('Introdu o adresă de email.');
    alert('Mulțumim! Te-ai abonat cu: ' + email);
    f.reset();
  });
}

function initProductPage() {
  const titleEl = document.getElementById('productTitle');
  if (!titleEl) return;

  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get('id'));
  const listing = getListingById(id) || listings[0];
  buildGallery(listing);
  document.getElementById('productTitle').textContent = listing.title;
  document.getElementById('productPrice').textContent = formatPrice(listing.price);
  document.getElementById('productLocation').textContent = listing.location;
  document.getElementById('productDescription').textContent = listing.description;
  document.getElementById('productRooms').textContent = `${listing.rooms} camere`;
  document.getElementById('productType').textContent = listing.type === 'casa' ? 'Casă' : 'Apartament';
  document.title = `ImobiliarePro — ${listing.title}`;
}

function buildGallery(listing) {
  const gallery = document.getElementById('productGallery');
  if (!gallery) return;
  const slidesContainer = gallery.querySelector('.gallery-slides');
  const thumbsContainer = document.getElementById('galleryThumbs');
  slidesContainer.innerHTML = '';
  thumbsContainer.innerHTML = '';

  const images = (Array.isArray(listing.images) && listing.images.length) ? listing.images : (listing.img ? [listing.img] : []);
  if (!images.length) return;

  images.forEach((src, i) => {
    const slide = document.createElement('div');
    slide.className = 'slide';
    const img = document.createElement('img');
    img.src = src;
    img.alt = `${listing.title} - ${i+1}`;
    slide.appendChild(img);
    slidesContainer.appendChild(slide);

    const thumb = document.createElement('img');
    thumb.className = 'thumb';
    thumb.src = src;
    thumb.alt = `Thumb ${i+1}`;
    thumb.dataset.index = i;
    thumb.addEventListener('click', () => showSlide(i));
    thumbsContainer.appendChild(thumb);
  });

  let current = 0;
  const slides = () => slidesContainer.querySelectorAll('.slide');
  const thumbs = () => thumbsContainer.querySelectorAll('.thumb');

  function showSlide(n) {
    const s = slides();
    const t = thumbs();
    if (!s.length) return;
    current = ((n % s.length) + s.length) % s.length;
    s.forEach((el, idx) => el.classList.toggle('active', idx === current));
    t.forEach((el, idx) => el.classList.toggle('active', idx === current));
  }

  const prevBtn = gallery.querySelector('.gallery-btn.prev');
  const nextBtn = gallery.querySelector('.gallery-btn.next');
  prevBtn.onclick = () => showSlide(current - 1);
  nextBtn.onclick = () => showSlide(current + 1);

  // autoplay
  let autoplay = setInterval(() => showSlide(current + 1), 4000);
  gallery.addEventListener('mouseenter', () => clearInterval(autoplay));
  gallery.addEventListener('mouseleave', () => { autoplay = setInterval(() => showSlide(current + 1), 4000); });

  showSlide(0);
}

document.addEventListener('DOMContentLoaded', ()=>{
  // load data then initialize UI
  loadListings().then(() => {
    // featured = first 3
    renderListings('featured', listings.slice(0,3));
    renderListings('listingsGrid', listings.slice(0));
    initSearch();
    initSubscribe();
    initProductPage();
  });
});
