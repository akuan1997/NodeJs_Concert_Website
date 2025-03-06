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
            pageInfo.textContent = `第 ${currentPage} 頁`;

            // 控制按鈕狀態
            prevButton.disabled = currentPage === 1;
            nextButton.disabled = currentPage >= data.totalPages;

        } catch (error) {
            console.error("獲取資料時發生錯誤:", error);
        }
    }

    // 初始化載入第一頁
    fetchData(currentPage);

    // 上一頁按鈕
    prevButton.addEventListener("click", () => {
        if (currentPage > 1) {
            fetchData(currentPage - 1);
        }
    });

    // 下一頁按鈕
    nextButton.addEventListener("click", () => {
        fetchData(currentPage + 1);
    });
});
