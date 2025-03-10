const LIFF_ID = "2006996059-NjRq5Mro";
const BACKEND_URL = "https://script.google.com/macros/s/AKfycby3AtgmX1gCDd2KUeYT8TkUBkVKoh_VH0q3oflLp6Bp3tse0SOETZgGV9wgiP8fT4FY/exec";
let userId, displayName, siteName;

async function initLIFF() {
    await liff.init({ liffId: LIFF_ID });
    if (!liff.isLoggedIn()) {
        liff.login();
        return;
    }
    const profile = await liff.getProfile();
    userId = profile.userId;
    displayName = profile.displayName;
    checkUserRegistration();
}

async function checkUserRegistration() {
    const res = await fetch(`${BACKEND_URL}?action=checkUser&userId=${userId}`);
    const result = await res.json();
    if (!result.exists) {
        window.location.href = "register.html";
    } else {
        siteName = result.siteName;
        document.getElementById("loading").style.display = "none";
        document.getElementById("reportInfo").style.display = "block";
        document.getElementById("titleText").textContent = `${siteName} ${displayName}さん、活動報告を入力してください。`;
    }
}

document.getElementById("previewBtn").addEventListener("click", () => {
    const eventDate = document.getElementById("eventDate").value;
    const eventType = document.getElementById("eventType").value;
    const adults = document.getElementById("adults").value;
    const children = document.getElementById("children").value;
    const comments = document.getElementById("comments").value;

    let amount = eventType === "子ども食堂" ? 3000 : 1500;
    document.getElementById("previewContent").innerHTML = `
        開催日: ${eventDate}<br>
        開催タイプ: ${eventType}<br>
        参加者: 大人 ${adults}名 / 子ども ${children}名<br>
        振込金額: ¥${amount}<br>
        コメント: ${comments || "なし"}
    `;

    document.getElementById("previewModal").style.display = "flex";
});

document.getElementById("confirmBtn").addEventListener("click", async () => {
    const params = new URLSearchParams({
        action: "report_submit",
        userId, siteName, displayName,
        eventDate: document.getElementById("eventDate").value,
        eventType: document.getElementById("eventType").value,
        adults: document.getElementById("adults").value,
        children: document.getElementById("children").value,
        comments: document.getElementById("comments").value
    });

    await fetch(BACKEND_URL, { method: "POST", body: params });
    closeModal();
});

function closeModal() {
    document.getElementById("previewModal").style.display = "none";
}

initLIFF();
