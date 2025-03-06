document.addEventListener("DOMContentLoaded", async () => {
    const gridContainer = document.getElementById("grid-container");
    const dateRangeInfo = document.getElementById("date-range-info");

    // 從URL獲取日期參數
    const urlParams = new URLSearchParams(window.location.search);
    const startDate = urlParams.get('startDate');
    const endDate = urlParams.get('endDate');

    if (!startDate || !endDate) {
        gridContainer.innerHTML = "<p>錯誤：未提供日期範圍</p>";
        return;
    }

    // 顯示搜尋的日期範圍
    dateRangeInfo.innerHTML = `<p>搜尋時間範圍：${startDate} 至 ${endDate}</p>`;

    try {
        // 從原有API獲取所有數據
        const response = await fetch("http://localhost:3000/api/data");
        const result = await response.json();

        if (!result.data || !Array.isArray(result.data)) {
            gridContainer.innerHTML = "<p>獲取的資料格式不正確</p>";
            return;
        }

        // 在前端進行日期篩選
        const startDateObj = new Date(startDate);
        const endDateObj = new Date(endDate);

        // 篩選符合日期範圍的數據
        let filteredData = result.data.filter(item => {
            return item.pdt.some(dateStr => {
                // 解析日期
                const parts = dateStr.split(' ')[0].split('/');
                if (parts.length < 3) return false;

                const year = parseInt(parts[0]);
                const month = parseInt(parts[1]) - 1; // JavaScript月份從0開始
                const day = parseInt(parts[2]);

                const itemDate = new Date(year, month, day);

                // 檢查是否在範圍內
                return itemDate >= startDateObj && itemDate <= endDateObj;
            });
        });

        if (filteredData.length === 0) {
            gridContainer.innerHTML = "<p>沒有找到符合日期範圍的資料</p>";
            return;
        }

        // 將 `filteredData` 按 `pdt` 中最早的日期排序
        filteredData.sort((a, b) => {
            const getEarliestDate = (dates) => {
                return dates
                    .map(dateStr => {
                        const parts = dateStr.split(' ')[0].split('/');
                        return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
                    })
                    .sort((d1, d2) => d1 - d2)[0]; // 取得最早的日期
            };

            return getEarliestDate(a.pdt) - getEarliestDate(b.pdt);
        });

        console.log('排序後的資料:', filteredData);

        // 顯示篩選結果
        filteredData.forEach(item => {
            const box = document.createElement("div");
            box.classList.add("box");
            box.innerHTML = `
                <h1>${item.tit}</h1>
                <h2>${item.cit}</h2>
                <p><strong>日期：</strong> ${item.pdt.join(", ")}</p>
                <p><strong>售票時間：</strong>${item.sdt !== undefined && item.sdt !== null && item.sdt !== '' ? item.sdt.join(", ") : '-'}</p>
                <p><strong>票價：</strong> ${item.prc.join(", ")}</p>
                <a href="${item.url}" target="_blank">購票連結</a>
            `;
            gridContainer.appendChild(box);
        });

    } catch (error) {
        console.error("獲取資料時發生錯誤:", error);
        gridContainer.innerHTML = `<p>獲取資料時發生錯誤: ${error.message}</p>`;
    }
});
