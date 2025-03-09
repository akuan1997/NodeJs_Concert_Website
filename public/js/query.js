document.addEventListener("DOMContentLoaded", async () => {
    const gridContainer = document.getElementById("grid-container");
    const dateRangeInfo = document.getElementById("date-range-info");
    const prevButton = document.getElementById("prev-page");
    const nextButton = document.getElementById("next-page");
    const pageInfo = document.getElementById("page-info");

    if (!prevButton || !nextButton || !pageInfo || !dateRangeInfo) {
        console.error("分頁按鈕或頁數資訊缺失，請確認 HTML 結構是否正確");
        return;
    }

    let currentPage = 1;
    const limit = 21;
    let filteredData = [];

    const urlParams = new URLSearchParams(window.location.search);
    const startDate = urlParams.get('startDate');
    const endDate = urlParams.get('endDate');
    const city = urlParams.get('city'); // 獲取 city 參數

    // 檢查城市參數是否為空字符串或null
    const hasCity = city && city.trim() !== '';

    // 檢查日期參數
    const hasStartDate = startDate && startDate.trim() !== '';
    const hasEndDate = endDate && endDate.trim() !== '';
    const hasDateFilter = hasStartDate || hasEndDate;

    // 顯示搜尋條件
    let searchInfo = '';
    if (hasCity) {
        searchInfo += `搜尋城市：${city}`;
    }

    if (hasDateFilter) {
        if (hasCity) searchInfo += ', ';
        searchInfo += `搜尋時間範圍：${hasStartDate ? startDate : '不限'} 至 ${hasEndDate ? endDate : '不限'}`;
    }

    if (searchInfo) {
        dateRangeInfo.innerHTML = `<p>${searchInfo}</p>`;
    } else {
        dateRangeInfo.innerHTML = '<p>未指定搜尋條件，顯示所有資料</p>';
        // 如果沒有任何搜尋條件，可能要考慮是否要顯示全部資料
    }

    try {
        const response = await fetch("http://localhost:3000/api/data");
        const result = await response.json();

        if (!result.data || !Array.isArray(result.data)) {
            gridContainer.innerHTML = "<p>獲取的資料格式不正確</p>";
            return;
        }

        // 先將日期字符串解析為日期對象
        const startDateObj = hasStartDate ? new Date(startDate) : null;
        const endDateObj = hasEndDate ? new Date(endDate) : null;

        // 過濾資料
        filteredData = result.data.filter(item => {
            // 城市過濾
            const matchesCity = !hasCity || item.cit === city;

            // 如果不符合城市條件，直接返回 false
            if (hasCity && !matchesCity) return false;

            // 如果沒有日期過濾條件，只檢查城市
            if (!hasDateFilter) return true;

            // 日期過濾
            return item.pdt.some(dateStr => {
                const parts = dateStr.split(' ')[0].split('/');
                if (parts.length < 3) return false;

                const itemDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));

                if (startDateObj && endDateObj) {
                    return itemDate >= startDateObj && itemDate <= endDateObj;
                } else if (startDateObj) {
                    return itemDate >= startDateObj;
                } else if (endDateObj) {
                    return itemDate <= endDateObj;
                }

                // 這一行不應該被執行到，因為我們前面檢查了 hasDateFilter
                return false;
            });
        });

        // 沒有搜尋結果時的處理
        if (filteredData.length === 0) {
            gridContainer.innerHTML = "<p>沒有符合條件的結果</p>";
            pageInfo.textContent = "第 0 頁";
            prevButton.style.visibility = "hidden";
            nextButton.style.visibility = "hidden";
            return;
        }

        // 按日期排序
        filteredData.sort((a, b) => {
            const getEarliestDate = (dates) =>
                dates.map(dateStr => {
                    const parts = dateStr.split(' ')[0].split('/');
                    return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
                }).sort((d1, d2) => d1 - d2)[0];

            return getEarliestDate(a.pdt) - getEarliestDate(b.pdt);
        });

        renderPage(currentPage);
    } catch (error) {
        console.error("獲取資料時發生錯誤:", error);
        gridContainer.innerHTML = `<p>獲取資料時發生錯誤: ${error.message}</p>`;
    }

    function renderPage(page) {
        gridContainer.innerHTML = "";
        const start = (page - 1) * limit;
        const end = start + limit;
        const pageData = filteredData.slice(start, end);

        pageData.forEach(item => {
            const box = document.createElement("div");
            box.classList.add("box");
            box.innerHTML = `
                <h1>${item.tit}</h1>
                <h2>${item.cit}</h2>
                <p><strong>日期：</strong> ${item.pdt.join(", ")}</p>
                <p><strong>售票時間：</strong>${item.sdt ? item.sdt.join(", ") : '-'}</p>
                <p><strong>票價：</strong> ${item.prc.join(", ")}</p>
                <a href="${item.url}" target="_blank">購票連結</a>
            `;
            gridContainer.appendChild(box);
        });

        pageInfo.textContent = `第 ${currentPage} 頁`;
        prevButton.style.visibility = currentPage > 1 ? "visible" : "hidden";
        prevButton.disabled = currentPage <= 1;

        nextButton.style.visibility = end < filteredData.length ? "visible" : "hidden";
        nextButton.disabled = end >= filteredData.length;

        // 捲動到頁面頂部
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    prevButton.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderPage(currentPage);
        }
    });

    nextButton.addEventListener("click", () => {
        if ((currentPage * limit) < filteredData.length) {
            currentPage++;
            renderPage(currentPage);
        }
    });
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
    const citySelect = document.getElementById('city');
    const customCityInput = document.getElementById('custom-city');
    let city = '';

    if (citySelect.value === 'others') {
        city = customCityInput.value.trim(); // 獲取輸入框內容
        if (city === '') {
            alert('請輸入城市名稱！');
            return;
        }
        city = city.replace(/臺/g, '台');
    } else if (citySelect.value === "city_empty") {
        // 如果選擇"不限城市"，則設置city為空字符串
        city = '';

        // 檢查是否至少有一個日期被選擇
        if (!startDate && !endDate) {
            alert("請選擇開始日期或是結束日期至少一項！");
            return;
        }
    } else {
        city = citySelect.options[citySelect.selectedIndex].text; // 獲取下拉選單的選項文字
    }

    // 輸出選擇的值到控制台
    console.log(`搜尋城市：${city || '不限'}, 開始日期：${startDate || '不限'}, 結束日期：${endDate || '不限'}`);

    // 執行頁面跳轉，帶上所有參數
    window.location.href = `query.html?city=${encodeURIComponent(city)}&startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;
});