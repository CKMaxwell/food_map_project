// 導入共用map
fetch("./map.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById('common-map').innerHTML = html;
    // 初始化地圖，中心點設在台北車站，縮放等級 17
    const map = L.map('map').setView([25.0478, 121.5170], 17);
    // 加入 OpenStreetMap 圖層
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '地圖資料 © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> 貢獻者'
      }).addTo(map);
  });

// 登入畫面
function showLogin() {
  document.getElementById('overlay').classList.add('show');
  document.getElementById('login-box').classList.add('show');
  history.pushState({ modal: 'login' }, '', '/#/login');
  showModal('login');
}

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
  // 呼叫註冊api
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
      "password": password.value,
      "role": 'store'
    })
  })
    .then(response => response.json())
    .then(data=>{
      // console.log(data);
      if (data.status === 'success') {
        document.getElementById('overlay').classList.remove('show');
        document.getElementById("login-box").style.display = "block"; //恢復原狀
        document.getElementById("signup-box").style.display = "none";
        document.getElementById('signup-alert').classList.add('show')
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

function closeAlert() {
  document.getElementById('signup-alert').classList.remove('show')
}

function checkSignupWidth() {
  const parentWidth = document.getElementById('signup-box').parentElement.offsetWidth;
  const signupFig = document.getElementById('signup-fig');
  const signupInput = document.getElementById('signup-input');
  // 父元素overlay小於指定px 就把signupFig隱藏
  if (parentWidth < 900) {
    signupFig.style.display = 'none';
    signupInput.style.width = '100%'
  } else {
    signupFig.style.display = 'flex'
    signupInput.style.width = '40%'
  }
}

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
window.addEventListener('resize', checkSignupWidth);
