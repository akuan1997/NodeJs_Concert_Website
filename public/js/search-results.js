document.addEventListener("DOMContentLoaded", async () => {
    const gridContainer = document.getElementById("grid-container");
    const prevButton = document.getElementById("prev-page");
    const nextButton = document.getElementById("next-page");
    const pageInfo = document.getElementById("page-info");

    let currentPage = 1;
    const limit = 21;

    // 取得 URL 參數中的 text
    const urlParams = new URLSearchParams(window.location.search);
    const searchText = urlParams.get("text") ? decodeURIComponent(urlParams.get("text")) : "";
    console.log("searchText - ", searchText);

    async function fetchData(page) {
        try {
            // **讓後端直接搜尋，而不是前端篩選**
            const response = await fetch(`http://localhost:3000/api/search?page=${page}&limit=${limit}&text=${encodeURIComponent(searchText)}`);
            const data = await response.json();
            console.log('data - ', data)
            if (!data.data || !Array.isArray(data.data)) {
                console.error("獲取的資料格式不正確:", data);
                return;
            }

            gridContainer.innerHTML = "";

            if (data.data.length === 0) {
                gridContainer.innerHTML = "<p>找不到符合的結果。</p>";
                return;
            }

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

            prevButton.style.visibility = currentPage === 1 ? "hidden" : "visible";
            prevButton.disabled = currentPage === 1;
            nextButton.style.visibility = currentPage >= data.totalPages ? "hidden" : "visible";
            nextButton.disabled = currentPage >= data.totalPages;

            // 捲動到頁面頂部
            window.scrollTo({ top: 0, behavior: "smooth" });

        } catch (error) {
            console.error("獲取資料時發生錯誤:", error);
        }
    }

    fetchData(currentPage);

    prevButton.addEventListener("click", () => {
        if (currentPage > 1) {
            fetchData(currentPage - 1);
        }
    });

    nextButton.addEventListener("click", () => {
        fetchData(currentPage + 1);
    });
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