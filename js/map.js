async function updateInputStyle() {
  const elements = document.getElementsByClassName('search-result');
  // 用於在搜尋過程中，持續關閉店家資訊
  const storeInfo = document.getElementById('store-info');
  const mainInputBox = document.getElementById("main-search")
  if (mainInputBox.value.trim() !== '') {
    mainInputBox.classList.add('input-filled');
    let searchKeyWord = mainInputBox.value.trim();
    // 只有在search api success時，才顯示結果
    try {
      storeInfo.classList.remove('show')
      const result = await search(searchKeyWord)
      const eachResult = document.getElementsByClassName('store-name');
      for (let i = 0; i <= 4; i++) {
        eachResult[i].textContent = result[i].name;
      }
      for (let el of elements) {
        el.classList.add('show');
      }
    } catch (err) {
      // 用於處理沒有搜尋到結果
      // console.log(err);
      mainInputBox.classList.remove('input-filled');
      for (let el of elements) {
        el.classList.remove('show');
      }
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
  const mainInputBox = document.getElementById("main-search")
  let searchKeyWord = mainInputBox.value.trim();
  const result = await search(searchKeyWord)
  
  const storeInfo = document.getElementById('store-info');
  const storeName = document.getElementById('info-name');
  const storeAddress = document.getElementById('info-address');
  const storePhone = document.getElementById('info-phone');
  const storeEmail = document.getElementById('info-email');
  storeName.textContent = result[index]['name']
  storeAddress.textContent = result[index]['location']['address']
  storePhone.textContent = result[index]['phone']
  storeEmail.textContent = result[index]['email']
  // console.log(result[index]['location']['lat'])
  const longitude = result[index]['location']['lat']
  const latitude = result[index]['location']['lng']
  // console.log(longitude, latitude)
  showMapInfoIcon(storeName, longitude, latitude)
  if (state.storeShowIndex !== index) {
    storeInfo.classList.add('show');
    state.storeShowIndex = index;
  } else if (state.storeShowIndex === index) {
    storeInfo.classList.toggle('show');
  }
}

// 顯示店家詳細資料的index物件
const state = {
  storeShowIndex: 0
};

// 移動地圖位置&顯示icon
function showMapInfoIcon(name, longitude, latitude) {
  //建立自訂 icon
  var myIcon = L.icon({
    iconUrl: './image/map_loc.png', // 你也可以用自己的圖片
    iconSize: [40, 40],  // 圖示大小
    iconAnchor: [16, 32],  // 對齊座標點的圖示位置（左上角為0,0）
    popupAnchor: [0, -32]  // 提示窗位置
  });
  // 先移除舊maker
  if (marker) {
    marker.remove()
  }
  //加入 icon 到指定位置
  marker = L.marker([longitude, latitude], { icon: myIcon })
    .addTo(map)
    .bindPopup(name);
  map.setView([longitude+0.001, latitude-0.002], 17);
};

// 搜尋函數
async function search(keyword) {
  // 呼叫搜尋api
  const UrlSearch = new URL('search', baseStoreUrl);
  UrlSearch.searchParams.append('q', keyword);  // 加上 ?q=xxx
  try {
    const res = await fetch(UrlSearch.href, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const data = await res.json();
    // console.log(data);
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
  // 用於在進階搜尋時，關閉店家資訊的顯示
  const storeInfo = document.getElementById('store-info');
  // 用於在進階搜尋時，關閉搜尋的顯示
  const elements = document.getElementsByClassName('search-result');
  if (item == 1) {
    settingBoxPrice.classList.toggle("show")
    settingBoxTime.classList.remove("show")
    settingBoxDistance.classList.remove("show")
    settingBoxType.classList.remove("show")
    storeInfo.classList.remove('show');
    for (let el of elements) {
      el.classList.remove('show')
    }
  } else if (item == 2) {
    settingBoxTime.classList.toggle("show")
    settingBoxPrice.classList.remove("show")
    settingBoxDistance.classList.remove("show")
    settingBoxType.classList.remove("show")
    storeInfo.classList.remove('show');
    for (let el of elements) {
      el.classList.remove('show')
    }
  } else if (item == 3) {
    settingBoxDistance.classList.toggle("show")
    settingBoxPrice.classList.remove("show")
    settingBoxTime.classList.remove("show")
    settingBoxType.classList.remove("show")
    storeInfo.classList.remove('show');
    for (let el of elements) {
      el.classList.remove('show')
    }
  } else if (item == 4) {
    settingBoxType.classList.toggle("show")
    settingBoxPrice.classList.remove("show")
    settingBoxTime.classList.remove("show")
    settingBoxDistance.classList.remove("show")
    storeInfo.classList.remove('show');
    for (let el of elements) {
      el.classList.remove('show')
    }
  }
}

// 呼叫區
function init() {
  state.storeShowIndex = 0;
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
  const mainInputBox = document.getElementById("main-search")
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

  function checkSearchWidth() {
    const parentWidth = document.getElementById('search-box').parentElement.offsetWidth;
    const searchTxt = document.getElementById('search-mainTxt');
    const customSelect = document.getElementById('custom-select');
    // 父元素overlay小於指定px 就把signupFig隱藏
    if (parentWidth < 900) {
      searchTxt.style.display = 'none';
      customSelect.style.width = '80%';
    } else {
      searchTxt.style.display = 'block';
      customSelect.style.width = '40%';
    }
  }

  // 初始設定元件位置
  updatePosition();
  checkSearchWidth();

  // 監聽視窗大小改變或滾動
  window.addEventListener('resize', updatePosition);
  window.addEventListener('scroll', updatePosition);
  window.addEventListener('resize', checkSearchWidth);

  // 監聽 searchBox 自身大小改變
  const observer = new ResizeObserver(updatePosition);
  observer.observe(searchBox);

  // 初始化地圖，中心點設在台北車站，縮放等級 17
  map = L.map('map').setView([25.0478, 121.5170], 17);
  // 加入 OpenStreetMap 圖層
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '地圖資料 © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> 貢獻者'
    }).addTo(map);
}

let map;
let marker;
window.addEventListener('load', init); // 確保 DOM 渲染完成後才執行