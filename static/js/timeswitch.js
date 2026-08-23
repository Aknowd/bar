// JST の現在時刻を取得
function getJSTHour() {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const jst = new Date(utc + (9 * 60 * 60 * 1000));
  return jst.getHours();
}

// 時間帯に応じて画像を選択
function selectImageByTime() {
  const hour = getJSTHour();

  if (hour >= 6 && hour < 12) {
    return "/images/whoq1.gif";   // AM6:00-AM11:59
  } else if (hour >= 12 && hour < 18) {
    return "/images/whoq2.gif"; // PM12:00-PM5:59
  } else if (hour >= 18 && hour < 24) {
    return "/images/whoq3.gif";   // PM6:00-PM11:59
  } else {
    return "/images/whoq4.gif";  // AM00:00-AM5:59
  }
}

// 現在の背景画像を記録
let currentImage = null;

// 背景画像をフェード付きで更新（時間帯が変わった時だけ）
function updateBackground() {
  const bg = document.querySelector(".bg");
  const newImage = selectImageByTime();

  // 画像が変わらないなら何もしない（フェードしない）
  if (newImage === currentImage) {
    return;
  }

  // フェードアウト（5秒）
  bg.style.opacity = 0;

  setTimeout(() => {
    bg.style.backgroundImage = `url(${newImage})`;

    // フェードイン（5秒）
    bg.style.opacity = 1;

    // 現在の画像を更新
    currentImage = newImage;
  }, 5000);
}

// 初回読み込み
currentImage = selectImageByTime();
document.querySelector(".bg").style.backgroundImage = `url(${currentImage})`;

// 10秒ごとにチェック（フェードは時間帯が変わった時だけ）
setInterval(updateBackground, 10000);