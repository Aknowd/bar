// ===============================
// インジケーターの DOM 要素生成
// ===============================

// 1. 左側ネオン流動バー
const neonFlowBar = document.createElement("div");
neonFlowBar.id = "neon-flow-bar";
document.body.appendChild(neonFlowBar);

// 2. 右側ネオンドット
const neonDots = document.createElement("div");
neonDots.id = "neon-dots";
document.body.appendChild(neonDots);

// 3. 上部プログレスバー
const topProgress = document.createElement("div");
topProgress.id = "top-progress";
document.body.appendChild(topProgress);

// 4. 左側ネオンリング
const neonRing = document.createElement("div");
neonRing.id = "neon-ring";
document.body.appendChild(neonRing);

// 5. 背景ネオンライン
const neonLines = document.createElement("div");
neonLines.id = "neon-lines";
document.body.appendChild(neonLines);


// ===============================
// スクロール量計測
// ===============================
function getScrollRatio() {
  const content = document.querySelector(".home-content");
  return content.scrollTop / (content.scrollHeight - content.clientHeight);
}


// ===============================
// インジケーターの描画処理
// ===============================
function updateIndicators() {
  const ratio = getScrollRatio();

  // 1. ネオン流動バー
  neonFlowBar.style.height = `${ratio * 100}%`;

  // 2. ネオンドット
  neonDots.style.backgroundPositionY = `${ratio * 200}%`;

  // 3. 上部プログレスバー
  topProgress.style.width = `${ratio * 100}%`;

  // 4. ネオンリング回転
  neonRing.style.transform = `rotate(${ratio * 360}deg)`;

  // 5. 背景ネオンライン移動
  neonLines.style.backgroundPositionY = `${ratio * 300}%`;
}


// ===============================
// インジケーター切り替え
// ===============================
function setIndicator(id) {
  neonFlowBar.style.display = "none";
  neonDots.style.display = "none";
  topProgress.style.display = "none";
  neonRing.style.display = "none";
  neonLines.style.display = "none";

  if (id === 1) neonFlowBar.style.display = "block";
  if (id === 2) neonDots.style.display = "block";
  if (id === 3) topProgress.style.display = "block";
  if (id === 4) neonRing.style.display = "block";
  if (id === 5) neonLines.style.display = "block";
}


// ===============================
// メニュー操作
// ===============================
document.getElementById("custom-button").onclick = () => {
  document.getElementById("indicator-menu").classList.toggle("hidden");
};

document.querySelectorAll(".indicator-option").forEach(opt => {
  opt.onclick = () => {
    const id = Number(opt.dataset.id);
    setIndicator(id);
  };
});


// ===============================
// 初期設定（標準：ネオン流動バー）
setIndicator(1);

// スクロール監視
document.querySelector(".home-content").addEventListener("scroll", updateIndicators);
