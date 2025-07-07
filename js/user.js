import { init } from './map.js';

// 導入共用map
fetch("./map.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById('common-map').innerHTML = html;
    // // 初始化地圖，中心點設在台北車站，縮放等級 17
    // const map = L.map('map').setView([25.0478, 121.5170], 17);
    // // 加入 OpenStreetMap 圖層
    // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //     attribution: '地圖資料 © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> 貢獻者'
    //   }).addTo(map);
    init();
  });



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

function logOut() {
  // document.getElementById("user-box-default").style.display = "block";
  // document.getElementById("user-box-login").style.display = "none";
  // 儲存 token 到 localStorage
  localStorage.setItem('token', '');
  // 導向另一個靜態頁面
  window.location.href = './index.html';
}

// 登入頁面轉註冊頁面
// function toSignIn() {
//   document.getElementById('login-box').classList.remove('show');
//   document.getElementById("signup-box").classList.add('show')
//   history.pushState({ modal: 'signup' }, '', '/signup');
//   showModal('signup');
// }


// 已登陸頁面: 新增使用者選單開關功能
document.getElementById('user-btn').addEventListener('click', () => {
  const menu = document.getElementById('user-menu');
  const setting = document.getElementById("setting");
  const dashboard = document.getElementById("dashboard");
  menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
  setting.style.display = 'none';
  dashboard.style.display = 'none';
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
  const ShowButton = document.querySelector('button.tab-button[data-tab="user_tab1"]');
  const ShowContent = document.getElementById('user_tab1');
  setting.style.display = setting.style.display === 'flex' ? 'none' : 'flex'
  dashboard.style.display = 'none';
  menu.style.display = 'none';
  ShowButton.classList.add('active');
  ShowContent.classList.add('active');
}
// 設定-店家儀錶板內容
function showDashboard() {
  const setting = document.getElementById("setting");
  const dashboard = document.getElementById("dashboard");
  const menu = document.getElementById('user-menu');
  const ShowButton = document.querySelector('button.tab-button[data-tab="owner_tab1"]');
  const ShowContent = document.getElementById('owner_tab1');
  dashboard.style.display = dashboard.style.display === 'flex' ? 'none' : 'flex'
  setting.style.display = 'none';
  menu.style.display = 'none';
  ShowButton.classList.add('active');
  ShowContent.classList.add('active');
}

async function checkAuth() {
  const token = localStorage.getItem('token');
  const UrlCheckAuth = new URL('check', baseUrl);
  try {
    const res = await fetch(UrlCheckAuth.href, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    });
    const data = await res.json();
    // console.log("checkAuth 函數成功呼叫");
    // console.log(data);
    return data;
  } catch (err) {
    // console.log(err);
    return err;
  }
}

async function awaitAuth() {
  const authResult = await checkAuth();
  // console.log(authResult);
  if (authResult.isLoggedIn !== true) {
    console.log("登入驗證失敗")
    window.location.href = './#/login';
  } else if (authResult.isLoggedIn === true) {
    console.log("登入驗證成功")
  }
}

// 取得使用者資料，並更新對應欄位文字
async function getUserData() {
  const token = localStorage.getItem('token');
  const UrlUpdateUserData = new URL('profile', baseUrl);
  const res = await fetch(UrlUpdateUserData.href, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
  });
  const data = await res.json();
  // 區分不同會員的顯示畫面
  let userRow = data['data']['user']['role']
  console.log(userRow)
  if (userRow.toLowerCase() === 'store') {
    // document.getElementById('dashboard').style.display = 'none'
    document.getElementById('menu-dashboard').style.display = 'block'
  }
  // 更新使用者欄位數據
  const userName = document.getElementsByClassName('txt-name')
  for (let i = 0; i < userName.length; i++) {
    userName[i].textContent = data['data']['user']['name']
  }
  const userEmail = document.getElementsByClassName('txt-email')
  for (let i = 0; i < userEmail.length; i++) {
    userEmail[i].textContent = data['data']['user']['email']
  }
  const userPhone = document.getElementsByClassName('txt-phone')
  for (let i = 0; i < userPhone.length; i++) {
    userPhone[i].textContent = data['data']['user']['phonenumber']
  }
  const userLanguage = document.getElementsByClassName('txt-language')
  for (let i = 0; i < userLanguage.length; i++) {
    userLanguage[i].textContent = data['data']['user']['region']
  }
}

function showFavoriteIcon() {
  document.getElementById('add-icon').style.display = 'inline';
};

// 顯示：更新資料的div
function showUpdateDiv() {
  document.getElementById('UpdateOverlay').style.display = 'flex';
}

function hideUpdateDiv() {
  document.getElementById('UpdateOverlay').style.display = 'none';
}

// 更新使用者資料
async function updateUserData() {
  const newName = document.getElementById('update-username');
  const newPhone = document.getElementById('update-phone');
  const selectedLanguage = document.querySelector('input[name="language"]:checked');

  const token = localStorage.getItem('token');
  const UrlUpdateUserData = new URL('update', baseUrl);
  const res = await fetch(UrlUpdateUserData.href, {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      }, 
      body: JSON.stringify({
        "name": newName.value,
        "region": selectedLanguage.value,
        "phonenumber": newPhone.value
      })
  })
  const data = await res.json();
  if (data.status === 'success') {
    const userName = document.getElementsByClassName('txt-name')
    for (let i = 0; i < userName.length; i++) {
      userName[i].textContent = data['data']['user']['name']
    }
    const userPhone = document.getElementsByClassName('txt-phone')
    for (let i = 0; i < userPhone.length; i++) {
      userPhone[i].textContent = data['data']['user']['phonenumber']
    }
    const userLanguage = document.getElementsByClassName('txt-language')
    for (let i = 0; i < userLanguage.length; i++) {
      userLanguage[i].textContent = data['data']['user']['region']
    }
    document.getElementById('changeInfo-alert').classList.add('show')
    hideUpdateDiv()
  }
}

function closeAlert() {
  document.getElementById('changeInfo-alert').classList.remove('show')
}

async function toggleFavorite() {
  const token = localStorage.getItem('token');
  const storeID = localStorage.getItem('storeID');
  let figSrc = document.getElementById('add-icon').src.split('/').pop();
  
  if (figSrc === 'like_notSel.png') {
    try {
      const UrladdFavorite = new URL(baseFavoriteUrl);
      UrladdFavorite.pathname += `${storeID}`;
      const res = await fetch(UrladdFavorite.href, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      document.getElementById('add-icon').src = './image/like_sel.png';
      // return data;
    } catch (err) {
      // console.log(err);
      // return err;
    }
  } else if (figSrc === 'like_sel.png') {
    try {
      const UrladdFavorite = new URL(baseFavoriteUrl);
      UrladdFavorite.pathname += `${storeID}`;
      const res = await fetch(UrladdFavorite.href, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      document.getElementById('add-icon').src = './image/like_notSel.png';
      // return data;
    } catch (err) {
      // console.log(err);
      // return err;
    }
  }
}

async function updateFavorite() {
  const token = localStorage.getItem('token');
  const favDiv = document.getElementById('favorite-card')
  const today = new Date()
  const year = today.getFullYear();      // 西元年（如 2025）
  const month = today.getMonth() + 1;    // 月份（0~11）→ 所以要 +1
  const day = today.getDate();           // 日（1~31）
  try {
    const UrladdFavorite = new URL(baseFavoriteUrl);
    const res = await fetch(UrladdFavorite.href, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    });
    const data = await res.json();
    
    favDiv.innerHTML = '<div class="section-title">喜愛店家</div>'
    for (let favData of data) {
      // console.log(favData['store']['name'])
      favDiv.innerHTML += `
        <div class="store-card">
          <div class="store-top">
            <div class="user-store-name">${favData['store']['name']}</div>
            <div class="arrow">›</div>
          </div>
          <div class="store-meta">
            <img src="./image/selection_icon.png">
            <p>台北車站</p>
            <img src="./image/love_plus.png">
            <p>${year}/${month}/${day}</p>
          </div>
          <div class="store-desc">新增註解
        </div>
      `
    }
  } catch (err) {
    // console.log(err);
    // return err;
  }
}

function initUser() {
  //// 載入頁面
  // 頁面載入時檢查是否已登入
  awaitAuth()
  getUserData();
  showFavoriteIcon();
  updateFavorite();
}

// 手動user.js的函數掛到全域
window.showModal = showModal
window.logOut = logOut
window.showSetting = showSetting
window.showDashboard = showDashboard
window.checkAuth = checkAuth
window.awaitAuth = awaitAuth
window.getUserData = getUserData
window.showFavoriteIcon = showFavoriteIcon
window.showUpdateDiv = showUpdateDiv
window.hideUpdateDiv = hideUpdateDiv
window.updateUserData = updateUserData
window.closeAlert = closeAlert
window.toggleFavorite = toggleFavorite
window.updateFavorite = updateFavorite

window.addEventListener('load', initUser); // 確保 DOM 渲染完成後才執行