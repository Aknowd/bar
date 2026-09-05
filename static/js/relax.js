document.addEventListener("DOMContentLoaded", () => {
  const bg = document.getElementById("relax-bg");
  const windowBox = document.getElementById("relax-window");
  const textBox = document.getElementById("relax-text");
  const musicIcon = document.getElementById("music-icon");

  const topics = {
    levitation: {
      images: ["/images/relax/levitation1.png", "/images/relax/levitation2.png"],
      texts: [
        "You may have visited this site before you were born in the world.",
        "Location: Arconerim\nDate: 2045.04.02\nDescription: Cool and sheer winds are transporting the white ash of migratory birds."
      ]
    },
    immersion: {
      images: ["/images/relax/immersion1.jpg", "/images/relax/immersion2.jpg"],
      texts: [
        "Immersion begins when consciousness dissolves into the ocean of memory.",
        "Every wave carries a fragment of forgotten dreams."
      ]
    }
    // 他の項目も同様に追加
  };

  let currentTopic = null;
  let currentIndex = 0;
  let musicPlaying = false;
  let audio = new Audio("/music/relax-theme.mp3");

  // メニュークリック
  document.querySelectorAll(".menu-item").forEach(btn => {
    btn.addEventListener("click", () => {
        // すべてのメニューから active を除去
        document.querySelectorAll(".menu-item").forEach(b => b.classList.remove("active"));
        // クリックしたメニューに active を付与
        btn.classList.add("active");

        currentTopic = btn.dataset.topic;
        currentIndex = 0;
        windowBox.classList.remove("hidden");
        updateContent();
    });
  });


  // スクロールで背景とテキストを切り替え
  document.addEventListener("click", () => {
    if (!currentTopic) return;

    currentIndex = (currentIndex + 1) % topics[currentTopic].images.length;
    updateContent();
  });

  document.addEventListener("keydown", (e) => {
    if (!currentTopic) return;

    if (e.key === "ArrowRight") {
        currentIndex = (currentIndex + 1) % topics[currentTopic].images.length;
        updateContent();
    }

    if (e.key === "ArrowLeft") {
        currentIndex = (currentIndex - 1 + topics[currentTopic].images.length) %
                    topics[currentTopic].images.length;
        updateContent();
    }
  });

  function updateContent() {
    const topic = topics[currentTopic];

    // フェードアウト
    bg.style.opacity = 0;

    setTimeout(() => {
        // 背景切り替え
        bg.style.backgroundImage = `url(${topic.images[currentIndex]})`;

        // テキスト切り替え（瞬時）
        textBox.textContent = topic.texts[currentIndex];

        // フェードイン
        bg.style.opacity = 1;
    }, 150);
  }


  // 音楽アイコン
  musicIcon.addEventListener("click", () => {
    if (!musicPlaying) {
      const confirmBox = confirm("音声が再生されます。よろしいですか？");
      if (confirmBox) {
        audio.play();
        musicPlaying = true;
        musicIcon.textContent = "⏸";
      }
    } else {
      audio.pause();
      musicPlaying = false;
      musicIcon.textContent = "▶";
    }
  });
});
