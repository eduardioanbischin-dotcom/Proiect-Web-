let listings = [];
let currentLightboxImages = [];
let lightboxIndex = 0;

const APARTMENT_API_URL = 'http://localhost:8080/api/apartments';

function normalizeListing(item) {
  const images = Array.isArray(item.images) ? item.images.filter(Boolean) : [];
  const mainImage = item.mainImage || images[0] || 'apartamen.jpg';

  return {
    id: item.id,
    title: item.title || 'Fără titlu',
    description: item.description || '',
    price: Number(item.price) || 0,
    location: item.location || '',
    type: item.type || 'apartament',
    rooms: Number(item.rooms) || 0,
    sellingType: item.sellingType || '',
    mainImage,
    images: images.length ? images : [mainImage],
    status: item.status || 'AVAILABLE'
  };
}
function loadListingJson(){
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
function loadListings() {
  return fetch(APARTMENT_API_URL)
    .then(resp => {
      if (!resp.ok) throw new Error('Could not load apartment data from API');
      return resp.json(); 
    })
    .then(data => {
      if (!Array.isArray(data)) throw new Error('API response is not an array');
      listings = data.map(normalizeListing);
      return listings;
    })
    .catch(err => {
      console.error('Error loading listings:', err);
      listings = loadListingJson();
      return listings;
    });
  
}

function formatPrice(v) { return Number(v || 0).toLocaleString('ro-RO') + ' €' }

function getListingById(id) {
  return listings.find(item => item.id == id);
}

function renderCard(item) {
  const div = document.createElement('article');
  div.className = 'card';
  div.innerHTML = `
    <a href="ProductPage.html?id=${item.id}">
      <img src="${item.mainImage || item.images?.[0] || 'apartamen.jpg'}" alt="${item.title}">
    </a>
    <div class="card-body">
      <div class="price">${formatPrice(item.price)}</div>
      <div class="meta">${item.title} • ${item.location}</div>
    </div>
  `;
  return div;
}

function renderListings(targetId, data) {
  const container = document.getElementById(targetId);
  if (!container) return;
  container.innerHTML = '';
  if (!data.length) container.innerHTML = '<p>Nu s-au găsit rezultate.</p>';
  data.forEach(item => container.appendChild(renderCard(item)));
}

function initSearch() {
  const form = document.getElementById('searchForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const location = document.getElementById('qLocation').value.toLowerCase();
    const type = document.getElementById('qType').value;
    const rooms = Number(document.getElementById('qRooms').value) || 0;
    const min = Number(document.getElementById('qMin').value) || 0;
    const max = Number(document.getElementById('qMax').value) || Infinity;
    const results = listings.filter(l => {
      const matchLoc = !location || l.location.toLowerCase().includes(location);
      const matchType = type === 'any' || l.type === type;
      const matchPrice = l.price >= min && l.price <= max;
      const matchRooms = rooms == 0 || l.rooms == rooms;
      return matchLoc && matchType && matchPrice && matchRooms;
    });
    renderListings('listingsGrid', results);
    window.location.hash = '#listings';
  });
}

function initSubscribe() {
  const f = document.getElementById('subscribeForm');
  if (!f) return;
  f.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    if (!email) return alert('Introdu o adresă de email.');
    alert('Mulțumim! Te-ai abonat cu: ' + email);
    f.reset();
  });
}

function initProductPage() {
  const titleEl = document.getElementById('productTitle');
  if (!titleEl) {
    console.log('Product title element not found'); return;
  }

  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get('id'));
  const listing = getListingById(id) || listings[0];
  if (!listing) {
    console.log('Listing not found'); return;
  }
  buildGallery(listing);
  document.getElementById('productTitle').textContent = listing.title;
  document.getElementById('productPrice').textContent = formatPrice(listing.price);
  document.getElementById('productLocation').textContent = listing.location;
  document.getElementById('productDescription').textContent = listing.description;
  document.getElementById('productRooms').textContent = `${listing.rooms} camere`;
  document.getElementById('productType').textContent = listing.type === 'casa' ? 'Casă' : 'Apartament';
  document.getElementById('productSellingType').textContent = listing.sellingType || 'N/A';
  const crumbTitle = document.getElementById('crumbTitle');
  if (crumbTitle) crumbTitle.textContent = listing.title;
  document.title = `ImobiliarePro — ${listing.title}`;
}

function buildGallery(listing) {
  const gallery = document.getElementById('productGallery');
  if (!gallery) return;
  const slidesContainer = gallery.querySelector('.gallery-slides');
  const thumbsContainer = document.getElementById('galleryThumbs');
  slidesContainer.innerHTML = '';
  thumbsContainer.innerHTML = '';

  const images = (Array.isArray(listing.images) && listing.images.length) ? listing.images : (listing.mainImage ? [listing.mainImage] : []);
  if (!images.length) return;

  images.forEach((src, i) => {
    const slide = document.createElement('div');
    slide.className = 'slide';
    const img = document.createElement('img');
    img.src = src;
    img.alt = `${listing.title} - ${i + 1}`;
    slide.appendChild(img);
    slidesContainer.appendChild(slide);

    img.addEventListener('click', () => openLightbox(i));

    const thumb = document.createElement('img');
    thumb.className = 'thumb';
    thumb.src = src;
    thumb.alt = `Thumb ${i + 1}`;
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

  let autoplay = setInterval(() => showSlide(current + 1), 4000);
  gallery.addEventListener('mouseenter', () => clearInterval(autoplay));
  gallery.addEventListener('mouseleave', () => { autoplay = setInterval(() => showSlide(current + 1), 4000); });

  showSlide(0);

  currentLightboxImages = images;
}

function openLightbox(index) {
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightboxImage');
  if (!lightbox || !lbImg) return;
  lightboxIndex = index || 0;
  lbImg.src = currentLightboxImages[lightboxIndex] || '';
  lbImg.alt = '';
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function lightboxNext() {
  if (!currentLightboxImages.length) return;
  lightboxIndex = (lightboxIndex + 1) % currentLightboxImages.length;
  document.getElementById('lightboxImage').src = currentLightboxImages[lightboxIndex];
}

function lightboxPrev() {
  if (!currentLightboxImages.length) return;
  lightboxIndex = (lightboxIndex - 1 + currentLightboxImages.length) % currentLightboxImages.length;
  document.getElementById('lightboxImage').src = currentLightboxImages[lightboxIndex];
}

document.addEventListener('click', (e) => {
  const closeBtn = e.target.closest('.lightbox-close');
  if (closeBtn) { closeLightbox(); return; }
  const nextBtn = e.target.closest('.lightbox-next');
  if (nextBtn) { lightboxNext(); return; }
  const prevBtn = e.target.closest('.lightbox-prev');
  if (prevBtn) { lightboxPrev(); return; }
});

document.addEventListener('keydown', (e) => {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox || lightbox.getAttribute('aria-hidden') === 'true') return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') lightboxNext();
  if (e.key === 'ArrowLeft') lightboxPrev();
});

document.addEventListener('DOMContentLoaded', () => {
  loadListings().then(() => {
    renderListings('featured', listings.slice(0, 3));
    renderListings('listingsGrid', listings.slice(0));
    initSearch();
    initSubscribe();
    initProductPage();
    initAddListing();
  });
});

function initAddListing() {
  const form = document.getElementById('addListingForm');
  if (!form) return;

  const imagesInput = document.getElementById('images');
  const preview = document.getElementById('imagePreview');
  let selectedFiles = [];

  imagesInput.addEventListener('change', (e) => {
    selectedFiles = Array.from(e.target.files || []);
    preview.innerHTML = '';
    selectedFiles.forEach(file => {
      const reader = new FileReader();
      const imgEl = document.createElement('img');
      imgEl.className = 'preview-thumb';
      reader.onload = () => { imgEl.src = reader.result; };
      reader.readAsDataURL(file);
      preview.appendChild(imgEl);
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const price = Number(document.getElementById('price').value) || 0;
    const location = document.getElementById('location').value.trim();
    const type = document.getElementById('type').value || 'apartament';
    const rooms = Number(document.getElementById('rooms').value) || 1;
    const sellingType = document.getElementById('selling-type').value || '';

    const images = await Promise.all(selectedFiles.map(file => new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(r.result);
      r.onerror = rej;
      r.readAsDataURL(file);
    })));

    const payload = {
      title,
      description,
      price,
      location,
      type,
      rooms,
      sellingType,
      mainImage: images.length ? images[0] : '',
      images,
      status: 'AVAILABLE'
    };

    try {
      const response = await fetch(APARTMENT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Nu s-a putut salva anunțul în baza de date.');
      }

      const created = normalizeListing(await response.json());
      listings.unshift(created);
      window.location.href = `ProductPage.html?id=${created.id}`;
    } catch (error) {
      console.error(error);
      alert('Anunțul nu a putut fi salvat în baza de date. Verifică dacă backend-ul rulează.');
    }
  });
}
