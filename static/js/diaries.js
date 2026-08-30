document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".ep-btn");
  const contentBox = document.getElementById("diary-content");

  buttons.forEach(btn => {
    btn.addEventListener("click", async () => {

      // アクティブ切り替え
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      // 背景変更
      const bgPath = btn.dataset.bg;
      document.body.style.backgroundImage = `url(${bgPath})`;

      // 正しいパスで本文読み込み
      const folder = btn.dataset.folder;
      const file = btn.dataset.file;
      const epFile = `/diaries/${folder}/${file}.txt`;

      try {
        const res = await fetch(epFile);
        const text = await res.text();
        contentBox.innerHTML = `<pre>${text}</pre>`;
      } catch (err) {
        contentBox.innerHTML = `<p>Failed to load ${epFile}</p>`;
      }
    });
  });

  // デフォルト背景
  document.body.style.backgroundImage = 'url("/images/bg_default.jpg")';
});
