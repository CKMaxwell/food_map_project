// 初始化地圖，中心點設在台北車站，縮放等級 17
const map = L.map('map').setView([25.0478, 121.5170], 17);

// 加入 OpenStreetMap 圖層
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '地圖資料 © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> 貢獻者'
  }).addTo(map);

// 
const selectedTags = new Set();

document.querySelectorAll('.tag').forEach(tag => {
  tag.addEventListener('click', () => {
    const value = tag.textContent;

    if (tag.classList.contains('selected')) {
      tag.classList.remove('selected');
      selectedTags.delete(value);
    } else {
      tag.classList.add('selected');
      selectedTags.add(value);
    }
    // console.log([...selectedTags]); // 可用於API參數
  });
});
  
// 登入畫面
function showLogin() {
  document.getElementById('overlay').classList.add('show');
}

function hideLogin() {
  document.getElementById('overlay').classList.remove('show');
}


function login() {
  const user_name = document.getElementById('test-username');
  const button = document.getElementById('user-btn')
  button.textContent = user_name.value;
  document.getElementById('overlay').classList.remove('show');
  document.getElementById("user-box-default").style.display = "none";
  document.getElementById("user-box-login").style.display = "block";
}

function logOut() {
  document.getElementById("user-box-default").style.display = "block";
  document.getElementById("user-box-login").style.display = "none";
}

// 已登陸頁面: 新增使用者選單開關功能
document.getElementById('user-btn').addEventListener('click', () => {
  const menu = document.getElementById('user-menu');
  menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
});
