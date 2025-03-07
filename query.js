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

    if (!startDate || !endDate) {
        gridContainer.innerHTML = "<p>錯誤：未提供日期範圍</p>";
        return;
    }

    dateRangeInfo.innerHTML = `<p>搜尋時間範圍：${startDate} 至 ${endDate}</p>`;

    try {
        const response = await fetch("http://localhost:3000/api/data");
        const result = await response.json();

        if (!result.data || !Array.isArray(result.data)) {
            gridContainer.innerHTML = "<p>獲取的資料格式不正確</p>";
            return;
        }

        const startDateObj = new Date(startDate);
        const endDateObj = new Date(endDate);

        filteredData = result.data.filter(item =>
            item.pdt.some(dateStr => {
                const parts = dateStr.split(' ')[0].split('/');
                if (parts.length < 3) return false;
                const itemDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
                return itemDate >= startDateObj && itemDate <= endDateObj;
            })
        );

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
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = end >= filteredData.length;
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