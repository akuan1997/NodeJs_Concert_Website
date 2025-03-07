document.addEventListener("DOMContentLoaded", async () => {
        const gridContainer = document.getElementById("grid-container");
        const sdtContent = document.getElementById("sdt-container");

        try {
            const response = await fetch("http://localhost:3000/api/data"); // 向後端請求資料
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
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const nextWeek = new Date();
            nextWeek.setDate(nextWeek.getDate() + 7);
            const sdtData = data.data.filter(item => {
                return item.sdt.some(dateStr => {
                    const parts = dateStr.split(' ')[0].split('/');
                    const itemDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
                    return itemDate >= tomorrow && itemDate <= nextWeek;
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

document.querySelector(".pdt-button").addEventListener("click", function () {
    const startDate = document.getElementById("start-date").value;
    const endDate = document.getElementById("end-date").value;
    if (!startDate || !endDate) {
        alert("請選擇開始和結束日期！");
        return;
    } // 跳轉到query.html頁面，並帶上日期參數
    window.location.href = `query.html?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;
});

