// 初始化地圖，中心點設在台北車站，縮放等級 17
const map = L.map('map').setView([25.0478, 121.5170], 17);

// const清單
const baseUrl = new URL('https://north11.onrender.com/api/users/');
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
  
// 登入畫面
function showLogin() {
  document.getElementById('overlay').classList.add('show');
}

function hideLogin() {
  document.getElementById('overlay').classList.remove('show');
  document.getElementById("login-box").style.display = "block"; //恢復原狀
  document.getElementById("signup-box").style.display = "none";
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
        button.textContent = data['data']['user']['name'];
        token = data['data']['token'];
        document.getElementById('overlay').classList.remove('show');
        document.getElementById("user-box-default").style.display = "none";
        document.getElementById("user-box-login").style.display = "block";
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

function logOut() {
  document.getElementById("user-box-default").style.display = "block";
  document.getElementById("user-box-login").style.display = "none";
}

// 登入頁面轉註冊頁面
function toSignIn() {
  document.getElementById("login-box").style.display = "none";
  document.getElementById("signup-box").style.display = "flex";
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

// 已登陸頁面: 新增使用者選單開關功能
document.getElementById('user-btn').addEventListener('click', () => {
  const menu = document.getElementById('user-menu');
  menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
});
