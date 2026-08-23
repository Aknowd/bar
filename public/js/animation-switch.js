document.addEventListener("DOMContentLoaded", () => {
  const boxes = document.querySelectorAll(".image-box");

  boxes.forEach(box => {
    const staticImg = box.dataset.static;
    const animatedImg = box.dataset.animated;

    // 初期状態は静止画
    box.style.backgroundImage = `url(${staticImg})`;

    // リンクを踏んでいる間だけアニメーションに切り替え
    const link = box.querySelector(".box-link");
    link.addEventListener("mousedown", () => {
      box.style.backgroundImage = `url(${animatedImg})`;
    });
    link.addEventListener("mouseup", () => {
      box.style.backgroundImage = `url(${staticImg})`;
    });
    link.addEventListener("mouseleave", () => {
      box.style.backgroundImage = `url(${staticImg})`;
    });
  });
});
