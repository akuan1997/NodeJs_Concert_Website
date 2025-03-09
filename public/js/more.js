document.addEventListener("DOMContentLoaded", async () => {
    const gridContainer = document.getElementById("grid-container");
    const prevButton = document.getElementById("prev-page");
    const nextButton = document.getElementById("next-page");
    const pageInfo = document.getElementById("page-info");

    let currentPage = 1; // 當前頁數
    const limit = 21; // 每頁顯示 21 筆

    async function fetchData(page) {
        try {
            const response = await fetch(`http://localhost:3000/api/more-data?page=${page}&limit=${limit}`);
            const data = await response.json();

            if (!data.data || !Array.isArray(data.data)) {
                console.error("獲取的資料格式不正確:", data);
                return;
            }

            gridContainer.innerHTML = ""; // 清空舊內容

            data.data.forEach(item => {
                const box = document.createElement("div");
                box.classList.add("box");
                box.innerHTML = `
                    <h1>${item.tit}</h1>
                    <h2>${item.cit}</h2>
                    <p><strong>日期：</strong> ${item.pdt}</p>
                    <p><strong>售票時間：</strong>${item.sdt ? item.sdt : '-'}</p>
                    <p><strong>票價：</strong> ${item.prc.join(", ")}</p>
                    <a href="${item.url}" target="_blank">購票連結</a>
                `;
                gridContainer.appendChild(box);
            });

            // 更新分頁資訊
            currentPage = data.page;
            console.log("當前頁數:", currentPage);
            console.log("總頁數:", data.totalPages);
            pageInfo.textContent = `第 ${currentPage} 頁`;

            if (currentPage === 1) {
                prevButton.style.visibility = "hidden";
                prevButton.disabled = true
            } else {
                prevButton.style.visibility = "visible";
                prevButton.disabled = false
            }
            if (currentPage >= data.totalPages) {
                nextButton.style.visibility = "hidden";
                nextButton.disabled = true
            } else {
                nextButton.style.visibility = "visible";
                nextButton.disabled = false
            }

            // 捲動到頁面頂部
            window.scrollTo({top: 0, behavior: "smooth"});

        } catch (error) {
            console.error("獲取資料時發生錯誤:", error);
        }
    }

    // 初始化載入第一頁
    fetchData(currentPage);

    // 上一頁按鈕
    prevButton.addEventListener("click", () => {
        console.log('點擊上一頁')
        if (currentPage > 1) {
            fetchData(currentPage - 1);
        }
    });

    // 下一頁按鈕
    nextButton.addEventListener("click", () => {
        console.log('點擊上一頁')
        fetchData(currentPage + 1);
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
        city = city.replace(/臺/g, '台');
    }

    // 輸出選擇的值到控制台（保留原有功能）
    console.log(`789 搜尋城市：${city}, 開始日期：${startDate}, 結束日期：${endDate}`);

    // 執行頁面跳轉，帶上所有參數
    window.location.href = `query.html?city=${encodeURIComponent(city)}&startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;
});