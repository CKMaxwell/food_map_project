// 初始化地圖，中心點設在台北車站，縮放等級 17
const map = L.map('map').setView([25.0478, 121.5170], 17);

// const清單
const baseUrl = new URL('https://north11.onrender.com/api/users/');
// const baseUrl = new URL('http://localhost:8000/api/users/');

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
  // closeModal();
  if (type === 'login') loginModal.classList.add('show');
  if (type === 'signup') signupModal.classList.add('show');
}

// 處理返回鍵 (chatGPT建議)
window.addEventListener('popstate', () => {
    if (location.pathname === '/#/login') showModal('login');
    else if (location.pathname === '/#/signup') showModal('signup');
    else closeModal();
});

// 頁面剛載入時，根據路由顯示對應 modal (chatGPT建議)
window.addEventListener('DOMContentLoaded', () => {
  if (location.pathname === '/#/login') showModal('login');
  if (location.pathname === '/#/signup') showModal('signup');
});

// 檢查登入狀態 (這是舊版本 不要用)
// function isLoggedIn() {
//   // 以有 token 為例判斷登入狀態
//   const token = localStorage.getItem('token');
//   return token && token !== '';
// }

// 登入畫面
function showLogin() {
  document.getElementById('overlay').classList.add('show');
  document.getElementById('login-box').classList.add('show');
  history.pushState({ modal: 'login' }, '', '/#/login');
  showModal('login');
}
// 處理外部路由
// window.addEventListener("hashchange", () => {
//   const route = location.hash;
//   if (route === "/#/login") {
//     showLogin();
//   } else if (route === "/#/signup") {
//     toSignIn();
//   }
// });
function handleRouteChange() {
  const route = location.hash;
  if (route === '#/login') {
    showLogin();
  }
  else if (route === '#/signup') {
    // showLogin();
    document.getElementById('overlay').classList.add('show');
    document.getElementById('login-box').classList.add('show');
    toSignIn();
  }
  else closeModal();
}
window.addEventListener('hashchange', handleRouteChange);
window.addEventListener('DOMContentLoaded', handleRouteChange);

function hideLogin() {
  document.getElementById('overlay').classList.remove('show');
  document.getElementById('login-box').classList.remove('show');
  document.getElementById("signup-box").classList.remove('show');
  if (location.pathname !== '/') {
    history.pushState({}, '', '/');
  }
}

// 登入函數
function login() {
  const user_name = document.getElementById('login-username');
  const password = document.getElementById('login-password')
  const button = document.getElementById('user-btn')
  const errorTxt = document.getElementById('error-text-login')
  // 呼叫登入api
  const UrlLogin = new URL('log-in', baseUrl);
  fetch(UrlLogin.href, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      // "email": "a1234567@gmail.com",
      // "password": "Aa123456"
      "email": user_name.value,
      "password": password.value
    })
  })
    .then(response => response.json())
    .then(data=>{
      console.log(data);
      if (data.status === 'success') {
        // button.textContent = data['data']['user']['name'];
        token = data['data']['token'];
        document.getElementById('overlay').classList.remove('show');
        document.getElementById('login-box').classList.remove('show');
        document.getElementById("signup-box").classList.remove('show');
        // document.getElementById("user-box-default").style.display = "none";
        // document.getElementById("user-box-login").style.display = "block"; 

        // 儲存 token 到 localStorage
        localStorage.setItem('token', token);
        checkAuth();
        // 導向另一個靜態頁面
        window.location.href = './shop_user.html';
      }
      else if (data.status != 'success') {
        // 這裡手動拋出錯誤，把錯誤訊息一起拋出
        throw new Error(data.message || '登入失敗');
      }
    })
    .catch(error => {
      console.error('錯誤:', error);
      errorTxt.textContent = error['message'];
      setTimeout(function(){
        errorTxt.textContent = '';
      }, 3000)
    });
}
async function checkAuth() {
  const token = localStorage.getItem('token');
  const UrlCheckAuth = new URL('check', baseUrl);
  const res = await fetch(UrlCheckAuth.href, {
      method: 'GET',
      headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    }
  });

  const data = await res.json();
  console.log("checkAuth 函數成功呼叫")
  console.log(data)
  // statusEl.textContent = res.ok ? '登入狀態：成功 ✅，使用者：' + data.user.username : '驗證失敗 ❌：' + data.message;
}

// function logOut() {
//   document.getElementById("user-box-default").style.display = "block";
//   document.getElementById("user-box-login").style.display = "none";
// }

// 登入頁面轉註冊頁面
function toSignIn() {
  document.getElementById('login-box').classList.remove('show');
  document.getElementById("signup-box").classList.add('show')
  history.pushState({ modal: 'signup' }, '', '/#/signup');
  showModal('signup');
}

// 註冊函數
function signUp() {
  const userName = document.getElementById('signup-username');
  const email = document.getElementById('signup-email');
  const password = document.getElementById('signup-password');
  const errorTxt = document.getElementById('error-text-signup');
  // 呼註冊api
  const UrlSignUp = new URL('sign-up', baseUrl);
  console.log(UrlSignUp.href)
  fetch(UrlSignUp.href, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "name": userName.value,
      "email": email.value,
      "password": password.value
    })
  })
    .then(response => response.json())
    .then(data=>{
      // console.log(data);
      if (data.status === 'success') {
        document.getElementById('overlay').classList.remove('show');
        document.getElementById("login-box").style.display = "block"; //恢復原狀
        document.getElementById("signup-box").style.display = "none";
      }
      else if (data.status != 'success') {
        throw new Error(data.message || '登入失敗');
      }
    })
    .catch(error => {
      console.error('錯誤:', error);
      errorTxt.textContent = error['message'];
      setTimeout(function(){
        errorTxt.textContent = "";
      }, 3000)
    });
}