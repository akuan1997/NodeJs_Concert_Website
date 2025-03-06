document.addEventListener("DOMContentLoaded", async () => {
    const gridContainer = document.getElementById("grid-container");

    try {
        const response = await fetch("http://localhost:3000/api/data"); // 向後端請求資料
        const data = await response.json();
        console.log('data', data); // 確認回傳的資料

        // 確保 data.data 是陣列
        if (!data.data || !Array.isArray(data.data)) {
            console.error("獲取的資料格式不正確:", data);
            return;
        }

        gridContainer.innerHTML = ""; // 清空原始內容

        data.data.forEach(item => {
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

    } catch (error) {
        console.error("獲取資料時發生錯誤:", error);
    }
});


