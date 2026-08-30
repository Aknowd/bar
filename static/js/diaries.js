document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".ep-btn");
  const contentBox = document.getElementById("diary-content");
  const bgDiv = document.querySelector(".bg");

  // 背景切り替え機能 ON/OFF
  let bgChangeEnabled = true;

  // 現在の背景がデフォルトかどうか
  let isDefaultBackground = true;

  // 時間帯に応じたデフォルト背景を返す
  function getDefaultBackground() {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const jst = new Date(utc + (9 * 60 * 60 * 1000));
    const hour = jst.getHours();

    if (hour >= 6 && hour < 12) {
      return "/images/whoq1.gif";
    } else if (hour >= 12 && hour < 18) {
      return "/images/whoq2.gif";
    } else if (hour >= 18 && hour < 24) {
      return "/images/whoq3.gif";
    } else {
      return "/images/whoq4.gif";
    }
  }

  let defaultBg = getDefaultBackground();

  // HTMLエスケープ
  function escapeHTML(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  // 背景切り替え ON/OFF トグルスイッチ
  const bgToggleCheckbox = document.getElementById("bg-toggle-checkbox");
  bgToggleCheckbox.addEventListener("change", () => {
    bgChangeEnabled = bgToggleCheckbox.checked;

    if (!bgChangeEnabled) {
      bgDiv.style.backgroundImage = `url(${defaultBg})`;
      isDefaultBackground = true;
    }
  });

  // EPボタンのクリック処理
  buttons.forEach(btn => {
    btn.addEventListener("click", async () => {

      const isActive = btn.classList.contains("active");

      // すべてのボタンを非アクティブ化
      buttons.forEach(b => b.classList.remove("active"));

      if (isActive) {
        // 2回目のクリック → 元に戻す
        if (bgChangeEnabled) {
          defaultBg = getDefaultBackground(); // 時間帯背景を再計算
          bgDiv.style.backgroundImage = `url(${defaultBg})`;
        }
        isDefaultBackground = true;
        return;
      }

      // 1回目のクリック → アクティブ化
      btn.classList.add("active");

      // 背景切り替え（ON の場合のみ）
      if (bgChangeEnabled) {
        const bgPath = btn.dataset.bg;
        bgDiv.style.backgroundImage = `url(${bgPath})`;
        isDefaultBackground = false;
      }

      // 本文読み込み
      const folder = btn.dataset.folder;
      const file = btn.dataset.file;
      const epFile = `/diaries/${folder}/${file}.txt`;

      try {
        const res = await fetch(epFile);
        const text = await res.text();
        contentBox.innerHTML = `<pre>${escapeHTML(text)}</pre>`;
      } catch (err) {
        contentBox.innerHTML = `<p>Failed to load ${epFile}</p>`;
      }
    });
  });

  // 初期背景（時間帯に応じて設定）
  bgDiv.style.backgroundImage = `url(${defaultBg})`;
});
