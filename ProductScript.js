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
function renderCard(item) {
  const div = document.createElement('product-layout');
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
    img.alt = `${listing.title} - ${i + 1}`;
    slide.appendChild(img);
    slidesContainer.appendChild(slide);

    // open lightbox when clicking a slide image
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

  // autoplay
  let autoplay = setInterval(() => showSlide(current + 1), 4000);
  gallery.addEventListener('mouseenter', () => clearInterval(autoplay));
  gallery.addEventListener('mouseleave', () => { autoplay = setInterval(() => showSlide(current + 1), 4000); });

  showSlide(0);

  // store images for lightbox
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

// attach lightbox controls and keyboard navigation
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
  // load data then initialize UI
  loadListings().then(() => {
    // featured = first 3
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

    // convert selected files to data URLs
    const images = await Promise.all(selectedFiles.map(file => new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(r.result);
      r.onerror = rej;
      r.readAsDataURL(file);
    })));

    // generate new id
    const maxId = listings.reduce((m, it) => Math.max(m, it.id || 0), 0);
    const newId = maxId + 1;

    const newListing = {
      id: newId,
      title,
      price,
      location,
      type,
      rooms,
      img: images.length ? images[0] : '',
      images: images,
      description
    };

    // save to localStorage (userListings)
    const user = JSON.parse(localStorage.getItem('userListings') || '[]');
    user.push(newListing);
    localStorage.setItem('userListings', JSON.stringify(user));

    // update in-memory listings so UI refreshes if needed
    listings.push(newListing);

    // redirect to product page
    window.location.href = `ProductPage.html?id=${newId}`;
  });
}
function getListingById(id) {
  return listings.find(item => item.id === id);
}