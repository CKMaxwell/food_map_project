const contentArea = document.getElementById('content-area');

document.getElementById('profile-btn').addEventListener('click', () => {
    contentArea.innerHTML = `
      <h2 class="main-title">個人資訊</h2>
      <h4 class="sub-title">您的個人資訊和偏好設定</h4>
      <div class="info-card">
        <h3>個人資料</h3>
        <div class="info-row">
          <div class="info-label">用戶名稱：</div>
          <div class="info-value">王小明</div>
        </div>
        <hr>
        <div class="info-row">
          <div class="info-label">電子信箱：</div>
          <div class="info-value">example@example.com</div>
        </div>
        <hr>
        <div class="info-row">
          <div class="info-label">電話：</div>
          <div class="info-value">0912-345-678</div>
        </div>
        <br>
        <h3>偏好設定</h3>
        <div class="info-row">
          <div class="info-label">語言：</div>
          <div class="info-value">中文</div>
        </div>
      </div>
    `;
  });

document.getElementById('store-btn').addEventListener('click', () => {
  contentArea.innerHTML = `
    <h2 class="main-title">儲存店家</h2>
    <h4 class="sub-title">您收藏的店家列表</h4>
    <div class="info-card">
      <p>這裡會列出您儲存的餐廳～（目前無資料）</p>
    </div>
  `;
});

document.getElementById('back-map-btn').addEventListener('click', () => {
  window.location.href = 'index.html';
});
