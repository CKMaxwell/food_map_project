// 初始化地圖，中心點設在台北車站，縮放等級 17
const map = L.map('map').setView([25.0478, 121.5170], 17);

// const清單
const baseUrl = new URL('https://north11.onrender.com/api/users');
// const baseUrl = new URL('http://localhost:8000/api/users/');
let token = "";

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

// 搜尋-彈出搜尋結果
mainInputBox = document.getElementById("main-search")
let isComposing = false;

// 搜尋-彈出搜尋結果:開始組字（中文輸入中）
mainInputBox.addEventListener('compositionstart', () => {
  isComposing = true;
});

// 搜尋-彈出搜尋結果:組字結束（輸入確定，例如選字或按空白）
mainInputBox.addEventListener('compositionend', () => {
  isComposing = false;
  updateInputStyle();
});

// 搜尋-彈出搜尋結果:一般輸入
mainInputBox.addEventListener('input', () => {
  if (!isComposing) {
    updateInputStyle();
  }
});

function updateInputStyle() {
  const elements = document.getElementsByClassName('search-result');

  if (mainInputBox.value.trim() !== '') {
    mainInputBox.classList.add('input-filled');
    for (let el of elements) {
      el.classList.add('show');
    }
  } else {
    mainInputBox.classList.remove('input-filled');
    for (let el of elements) {
      el.classList.remove('show');
    }
  }
}

// 抓取位置
const searchBox = document.getElementById('search-box');
const storeInfo = document.getElementById('store-info');
function updatePosition() {
  const bottomY = searchBox.getBoundingClientRect().bottom + window.scrollY;
  storeInfo.style.top = (bottomY + 5) + 'px';
}

// 顯示
function showInfo() {
  const storeInfo = document.getElementById('store-info');
  storeInfo.classList.toggle('show');
}

// 初始設定一次
updatePosition();

// 監聽視窗大小改變或滾動
window.addEventListener('resize', updatePosition);
window.addEventListener('scroll', updatePosition);

// 監聽 searchBox 自身大小改變
const observer = new ResizeObserver(updatePosition);
observer.observe(searchBox);


// 路由設定
function showModal(type) {
  closeModal();
  if (type === 'login') loginModal.classList.add('show');
  if (type === 'signup') signupModal.classList.add('show');
}
// 處理返回鍵 (chatGPT建議)
  window.addEventListener('popstate', () => {
    if (location.pathname === '/login') showModal('login');
    else if (location.pathname === '/signup') showModal('signup');
    else closeModal();
  });

// 頁面剛載入時，根據路由顯示對應 modal (chatGPT建議)
window.addEventListener('DOMContentLoaded', () => {
  if (location.pathname === '/login') showModal('login');
  if (location.pathname === '/signup') showModal('signup');
});

// 檢查登入狀態
function isLoggedIn() {
  // 以有 token 為例判斷登入狀態
  const token = localStorage.getItem('token');
  return token && token !== '';
}

function logOut() {
  // document.getElementById("user-box-default").style.display = "block";
  // document.getElementById("user-box-login").style.display = "none";
  // 儲存 token 到 localStorage
  localStorage.setItem('token', '');
  // 導向另一個靜態頁面
  window.location.href = './index.html';
}

// 登入頁面轉註冊頁面
function toSignIn() {
  document.getElementById('login-box').classList.remove('show');
  document.getElementById("signup-box").classList.add('show')
  history.pushState({ modal: 'signup' }, '', '/signup');
  showModal('signup');
}


// 已登陸頁面: 新增使用者選單開關功能
document.getElementById('user-btn').addEventListener('click', () => {
  const menu = document.getElementById('user-menu');
  menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
});

// 控制分頁切換
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    // 移除所有 active
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    // 加入目前這一個 active
    button.classList.add('active');
    const targetId = button.getAttribute('data-tab');
    document.getElementById(targetId).classList.add('active');
  });
});


// 設定-顯示內容
function showSetting() {
  const setting = document.getElementById("setting");
  const dashboard = document.getElementById("dashboard");
  const menu = document.getElementById('user-menu');
  setting.style.display = setting.style.display === 'flex' ? 'none' : 'flex'
  dashboard.style.display = 'none';
  menu.style.display = 'none';
}
// 設定-店家儀錶板內容
function showDasboard() {
  const setting = document.getElementById("setting");
  const dashboard = document.getElementById("dashboard");
  const menu = document.getElementById('user-menu');
  dashboard.style.display = dashboard.style.display === 'flex' ? 'none' : 'flex'
  setting.style.display = 'none';
  menu.style.display = 'none';
}