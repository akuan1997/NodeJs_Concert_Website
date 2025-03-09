document.addEventListener("DOMContentLoaded", async () => {
        const gridContainer = document.getElementById("grid-container");
        const sdtContent = document.getElementById("sdt-container");

        try {
            const response = await fetch(`${window.location.origin}/api/data`);
            const data = await response.json();
            console.log('data', data); // 確認回傳的資料

            // 確保 data.data 是陣列
            if (!data.data || !Array.isArray(data.data)) {
                console.error("獲取的資料格式不正確:", data);
                return;
            }

            const sortedData = data.data.sort((a, b) => new Date(b.tim) - new Date(a.tim)); // 按照 tim 降序排列
            gridContainer.innerHTML = ""; // 清空原始內容

            // 只使用前6筆資料
            const limitedData = sortedData.slice(0, 6);

            limitedData.forEach(item => {
                const box = document.createElement("div");
                box.classList.add("box");
                box.innerHTML = `
                <h1>${item.tit}</h1>
                <h2>${item.cit}</h2>
                <p><strong>日期：</strong> ${item.pdt}</p>
                <p><strong>售票時間：</strong>${item.sdt !== undefined && item.sdt !== null && item.sdt !== '' ? item.sdt : '-'}</p>
                <p><strong>票價：</strong> ${item.prc.join(", ")}</p>
                <a href="${item.url}" target="_blank">購票連結</a>
            `;
                gridContainer.appendChild(box);
            });

            // 額外內容區塊
            const today = new Date();
            today.setDate(today.getDate());
            const nextWeek = new Date();
            nextWeek.setDate(nextWeek.getDate() + 7);
            const sdtData = data.data.filter(item => {
                return item.sdt.some(dateStr => {
                    const parts = dateStr.split(' ')[0].split('/');
                    const itemDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
                    return itemDate >= today && itemDate <= nextWeek;
                });
            });

            sdtData.sort((a, b) => {
                const getEarliestDate = (item) => {
                    return new Date(Math.min(...item.sdt.map(dateStr => {
                        const parts = dateStr.split(' ')[0].split('/');
                        return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
                    })));
                };
                return getEarliestDate(a) - getEarliestDate(b);
            });
            console.log(sdtData.length);

            sdtData.forEach(item => {
                const box = document.createElement("div");
                box.classList.add("box");
                box.innerHTML = `
                <h1>${item.tit}</h1>
                <h2>${item.cit}</h2>
                <p><strong>日期：</strong> ${item.pdt}</p>
                <p><strong>售票時間：</strong>${item.sdt !== undefined && item.sdt !== null && item.sdt !== '' ? item.sdt : '-'}</p>
                <p><strong>票價：</strong> ${item.prc.join(", ")}</p>
                <a href="${item.url}" target="_blank">購票連結</a>
            `;
                sdtContent.appendChild(box);
            });

        } catch
            (error) {
            console.error("獲取資料時發生錯誤:", error);
        }
    }
)
;

document.querySelector(".more-button").addEventListener("click", () => {
    window.location.href = "more.html";
});

const citySelect = document.getElementById('city');
const customCityInput = document.getElementById('custom-city');

citySelect.addEventListener('change', () => {
    if (citySelect.value === 'others') {
        customCityInput.style.display = 'block'; // 顯示輸入框
    } else {
        customCityInput.style.display = 'none'; // 隱藏輸入框
        customCityInput.value = ''; // 清空輸入框內容
    }
});

document.querySelector('.city_date_button').addEventListener('click', () => {
    // 獲取日期值
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;

    // 處理城市選擇邏輯
    const citySelect = document.getElementById('city'); // 假設這是您的select元素ID
    const customCityInput = document.getElementById('custom-city'); // 假設這是您的自定義輸入框ID
    let city = '';

    if (citySelect.value === 'others') {
        city = customCityInput.value.trim(); // 獲取輸入框內容
        if (city === '') {
            alert('請輸入城市名稱！');
            return;
        }
        city = city.replace(/臺/g, '台');
    } else if (citySelect.value === "city_empty") {
        // 檢查是否至少有一個日期被選擇
        if (!startDate && !endDate) {
            alert("請選擇開始、開始日期或是結束日期任一欄位！");
            return;
        }
        // 如果沒有選城市但有選日期，使用空值繼續
    } else {
        city = citySelect.options[citySelect.selectedIndex].text; // 獲取下拉選單的選項文字
    }

    // 輸出選擇的值到控制台（保留原有功能）
    console.log(`123 搜尋城市：${city}, 開始日期：${startDate}, 結束日期：${endDate}`);

    // 執行頁面跳轉，帶上所有參數
    window.location.href = `query.html?city=${encodeURIComponent(city)}&startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;
});

// 獲取搜尋按鈕和輸入框的元素
const searchInput = document.getElementById('search-input')
document.querySelector('#search-icon').addEventListener('click', () => {
    const inputValue = searchInput.value; // 獲取用戶輸入的值
    if (inputValue.trim() === '') {
        alert('請輸入關鍵字');
    } else {
        console.log('搜尋關鍵字:', inputValue);
        window.location.href = `search.html?text=${encodeURIComponent(inputValue)}`;
    }
})

document.querySelector('.site-name').addEventListener('click', () => {
    window.location.href = 'index.html'
})