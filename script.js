var img_urls= "C:\\Users\\nelut\\OneDrive\\Documents\\Proiect-Web-\\apartamen.jpg";
const listings = [
  {id:1,title:'Apartament modern, 3 cam',price:72000,location:'București - Floreasca',type:'apartament',rooms:3,img:'${img_urls}'},
  {id:2,title:'Casă cu grădină',price:125000,location:'Cluj-Napoca - Gheorgheni',type:'casa',rooms:4,img:'${img_urls}'},
  {id:3,title:'Garsonieră centrală',price:38000,location:'Iași - Copou',type:'apartament',rooms:1,img:'${img_urls}'},
  {id:4,title:'Vilă spațioasă',price:245000,location:'Timișoara - Giroc',type:'casa',rooms:5,img:'${img_urls}'},
  {id:5,title:'Apartament în bloc nou',price:98000,location:'Brașov - Tractorul',type:'apartament',rooms:2,img:'${img_urls}'},
  {id:6,title:'Casă la periferie',price:67000,location:'Constanța - Agigea',type:'casa',rooms:3,img:'${img_urls}'}
];

function formatPrice(v){return v.toLocaleString('ro-RO') + ' €'}

  function renderCard(item){
  const div = document.createElement('article');
  div.className = 'card';
  div.innerHTML = `
    <img src="${img_urls}" alt="${item.title}">
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
  f.addEventListener('submit', e=>{
    e.preventDefault();
    const email = document.getElementById('email').value;
    if(!email) return alert('Introdu o adresă de email.');
    alert('Mulțumim! Te-ai abonat cu: ' + email);
    f.reset();
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  // featured = first 3
  renderListings('featured', listings.slice(0,3));
  renderListings('listingsGrid', listings.slice(0));
  initSearch();
  initSubscribe();
});
