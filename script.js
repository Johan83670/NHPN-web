const chips = document.querySelectorAll('.chip');
const grid = document.getElementById('productGrid');
const cards = Array.from(grid.querySelectorAll('.card'));
const search = document.getElementById('search');
const sort = document.getElementById('sort');


let state = { filter: 'all', query: '', sort: 'default' };


function apply(){
let list = cards.slice();
if(state.filter !== 'all'){
list = list.filter(c => c.dataset.category === state.filter);
}
if(state.query){
const q = state.query.toLowerCase();
list = list.filter(c => c.dataset.name.toLowerCase().includes(q));
}
switch(state.sort){
case 'price-asc': list.sort((a,b)=>parseFloat(a.dataset.price)-parseFloat(b.dataset.price)); break;
case 'price-desc': list.sort((a,b)=>parseFloat(b.dataset.price)-parseFloat(a.dataset.price)); break;
case 'name-asc': list.sort((a,b)=>a.dataset.name.localeCompare(b.dataset.name,'fr')); break;
case 'name-desc': list.sort((a,b)=>b.dataset.name.localeCompare(a.dataset.name,'fr')); break;
}
grid.innerHTML = '';
list.forEach(el=>grid.appendChild(el));
}


chips.forEach(btn=>{
btn.addEventListener('click',()=>{
chips.forEach(c=>c.classList.remove('active'));
btn.classList.add('active');
state.filter = btn.dataset.filter;
apply();
})
})
search.addEventListener('input', e=>{ state.query = e.target.value.trim(); apply(); });
sort.addEventListener('change', e=>{ state.sort = e.target.value; apply(); });


apply();
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.card .btn.outline').forEach(btn => {
    btn.addEventListener('click', function() {
      const card = btn.closest('.card');
      const img = card.querySelector('img').src;
      const title = card.querySelector('.title').textContent;
      const badge = card.querySelector('.badge').textContent;
      const price = card.querySelector('.price').textContent;
      const meta = card.querySelector('.meta') ? card.querySelector('.meta').innerHTML : '';
      const desc = card.querySelector('.desc') ? card.querySelector('.desc').innerHTML : '';
      document.getElementById('modalBody').innerHTML = `
        <img src="${img}" alt="${title}" style="max-width:120px; margin-bottom:16px; border-radius:8px;">
        <div style="font-size:1.3rem; font-weight:700; margin-bottom:8px;">${title}</div>
        <div style="color:#bbb; margin-bottom:8px;">${badge}</div>
        <div style="margin-bottom:8px;">${meta}</div>
        <div style="font-size:1.1rem; color:#fff; margin-bottom:12px;">${price}</div>
        <div style="color:#ccc; margin-bottom:8px;">${desc}</div>
      `;
      document.getElementById('productModal').style.display = 'flex';
    });
  });

  document.getElementById('modalClose').onclick = function() {
    document.getElementById('productModal').style.display = 'none';
  };
  document.getElementById('productModal').onclick = function(e) {
    if (e.target === this) this.style.display = 'none';
  };
});