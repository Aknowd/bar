document.addEventListener("DOMContentLoaded", () => {
  const boxes = document.querySelectorAll(".image-box");

  boxes.forEach(box => {
    const staticImg = box.dataset.static;
    const animatedImg = box.dataset.animated;

    // 初期状態は静止画
    box.style.backgroundImage = `url('${staticImg}')`;

    // ホバー時に GIF に切り替え
    box.addEventListener("mouseenter", () => {
      box.style.backgroundImage = `url('${animatedImg}')`;
    });

    box.addEventListener("mouseleave", () => {
      box.style.backgroundImage = `url('${staticImg}')`;
    });
  });
});
