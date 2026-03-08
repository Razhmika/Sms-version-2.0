async function postJSON(url, body){
  const res = await fetch(url, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  return res.json().catch(()=>({}));
}

async function getJSON(url){
  const res = await fetch(url);
  return res.json().catch(()=>([]));
}

const loginForm = document.getElementById('login-form');
const loginMsg = document.getElementById('login-msg');
const dashboard = document.getElementById('dashboard-section');
const loginSection = document.getElementById('login-section');
const userInfo = document.getElementById('user-info');
const materialsList = document.getElementById('materials-list');
const vendorsList = document.getElementById('vendors-list');
const ordersList = document.getElementById('orders-list');

function showDashboard(user){
  loginSection.classList.add('hidden');
  dashboard.classList.remove('hidden');
  userInfo.textContent = `Logged in: ${user.username} (${user.role})`;
}

function showLogin(){
  loginSection.classList.remove('hidden');
  dashboard.classList.add('hidden');
}

loginForm.addEventListener('submit', async (e)=>{
  e.preventDefault();
  loginMsg.textContent='';
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const data = await postJSON('/auth/login', {username,password});
  if(data && data.username){
    localStorage.setItem('sms_user', JSON.stringify(data));
    showDashboard(data);
    await loadData();
  } else {
    loginMsg.textContent = data.detail || 'Login failed';
  }
});

document.getElementById('logout').addEventListener('click', ()=>{
  localStorage.removeItem('sms_user');
  showLogin();
});

async function loadData(){
  const mats = await getJSON('/materials');
  const vens = await getJSON('/vendors');
  const ords = await getJSON('/orders');
  materialsList.innerHTML = mats.map(m=>`<li>${m.id} — ${m.name} — ${m.category} — ${m.materialType? m.materialType + ' — ' : ''}qty:${m.quantity||m.raw||0} ${m.unit||'pieces'}</li>`).join('') || '<li>No materials</li>';
  vendorsList.innerHTML = vens.map(v=>`<li>${v.companyName} — ${v.vendorName} — ${v.mobile}</li>`).join('') || '<li>No vendors</li>';
  ordersList.innerHTML = ords.map(o=>`<li>#${o.id} — ${o.material_id||'-'} — ${o.quantity} — ${o.status}</li>`).join('') || '<li>No orders</li>';
}

// Try auto-login if seeded user present
const stored = localStorage.getItem('sms_user');
if(stored){
  showDashboard(JSON.parse(stored));
  loadData();
}
