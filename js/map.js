async function updateInputStyle() {
  const elements = document.getElementsByClassName('search-result');

  if (mainInputBox.value.trim() !== '') {
    mainInputBox.classList.add('input-filled');
    const result = await search()
    const eachResult = document.getElementsByClassName('store-name');
    for (let i = 0; i <= 4; i++) {
      eachResult[i].textContent = result[i].name;
    }
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

// 顯示店家詳細圖卡
async function showInfo(index) {
  const result = await search()
  
  const storeInfo = document.getElementById('store-info');
  const storeName = document.getElementById('info-name');
  const storeAddress = document.getElementById('info-address');
  const storePhone = document.getElementById('info-phone');
  const storeEmail = document.getElementById('info-email');
  storeName.textContent = result[index]['name']
  storeAddress.textContent = result[index]['location']
  storePhone.textContent = result[index]['phone']
  storeEmail.textContent = result[index]['email']  
  storeInfo.classList.toggle('show');
}

// 搜尋函數
async function search() {
  // 呼叫搜尋api
  const UrlSearch = new URL('restaurants', baseUrl);
  try {
    const res = await fetch(UrlSearch.href, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const data = await res.json();
    return data.data;
  } catch(err) {
    return err;
  }
}


// 顯示進階搜尋
function showSelectSetting(item) {
  settingBoxPrice = document.getElementById("select-price")
  settingBoxTime = document.getElementById("select-time")
  settingBoxDistance = document.getElementById("select-distance")
  settingBoxType = document.getElementById("select-type")
  if (item == 1) {
    settingBoxPrice.classList.toggle("show")
    settingBoxTime.classList.remove("show")
    settingBoxDistance.classList.remove("show")
    settingBoxType.classList.remove("show")
  } else if (item == 2) {
    settingBoxTime.classList.toggle("show")
    settingBoxPrice.classList.remove("show")
    settingBoxDistance.classList.remove("show")
    settingBoxType.classList.remove("show")
  } else if (item == 3) {
    settingBoxDistance.classList.toggle("show")
    settingBoxPrice.classList.remove("show")
    settingBoxTime.classList.remove("show")
    settingBoxType.classList.remove("show")
  } else if (item == 4) {
    settingBoxType.classList.toggle("show")
    settingBoxPrice.classList.remove("show")
    settingBoxTime.classList.remove("show")
    settingBoxDistance.classList.remove("show")
  }
}


// 呼叫區
function init() {
  // 進階搜尋的篩選標籤(建議改成toggle)
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

  //// 搜尋欄相關函數
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

  // 抓取位置
  const searchBox = document.getElementById('search-box');
  const storeInfo = document.getElementById('store-info');
  function updatePosition() {
    const bottomY = searchBox.getBoundingClientRect().bottom + window.scrollY;
    storeInfo.style.top = (bottomY + 5) + 'px';
  }

  // 初始設定元件位置
  updatePosition();

  // 監聽視窗大小改變或滾動
  window.addEventListener('resize', updatePosition);
  window.addEventListener('scroll', updatePosition);

  // 監聽 searchBox 自身大小改變
  const observer = new ResizeObserver(updatePosition);
  observer.observe(searchBox);
}

window.addEventListener('load', init); // 確保 DOM 渲染完成後才執行