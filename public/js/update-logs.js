/* ============================================================
   1. JSON を読み込む
============================================================ */
async function loadUpdatesJSON() {
  const res = await fetch("/updates/index.json");
  return await res.json();
}

/* ============================================================
   2. メイン処理
============================================================ */
document.addEventListener("DOMContentLoaded", async () => {

  /* ------------------------------
     JSON 読み込み
  ------------------------------ */
  const updates = await loadUpdatesJSON();
  console.log("Loaded updates:", updates);

  /* ------------------------------
     今日の日付と過去7日間を生成
  ------------------------------ */
  function formatDate(date) {
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return mm + dd;
  }

  const today = new Date();
  const dates = [];

  for (let i = 7; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    dates.push(formatDate(d));
  }

  const todayIndex = dates.length - 1;

  /* ------------------------------
     JSON の count を日付ごとに集計
  ------------------------------ */
  const indexCounts = dates.map(dateStr => {
    const items = updates.filter(u => u.date === dateStr);
    if (items.length === 0) return 0;
    return items.reduce((sum, item) => sum + (item.count || 0), 0);
  });

  /* ------------------------------
     日付 → 更新ログ検索
  ------------------------------ */
  function findUpdateIndexByDate(dateStr) {
    return updates.findIndex(u => u.date === dateStr);
  }

  /* ------------------------------
     波動パルス折れ線プラグイン
  ------------------------------ */
  const wavePulsePlugin = {
    id: "wavePulsePlugin",
    afterDraw(chart) {
      const ctx = chart.ctx;
      const meta = chart.getDatasetMeta(0);

      ctx.save();
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#00e5ff";
      ctx.shadowColor = "#00e5ff";
      ctx.shadowBlur = 25;

      ctx.beginPath();
      meta.data.forEach((point, index) => {
        const x = point.x;
        const y = point.y + Math.sin(index * 0.8 + performance.now() / 300) * 4;
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.restore();
    }
  };

  /* ------------------------------
     今日の日付の縦線（ネオン破線）
  ------------------------------ */
  const verticalLinePlugin = {
    id: "verticalLinePlugin",
    afterDraw(chart) {
      const x = chart.scales.x.getPixelForValue(todayIndex);

      const ctx = chart.ctx;
      ctx.save();
      ctx.strokeStyle = "#ff66cc";
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(x, chart.chartArea.top);
      ctx.lineTo(x, chart.chartArea.bottom);
      ctx.stroke();
      ctx.restore();
    }
  };

  /* ------------------------------
     今日ラベル
  ------------------------------ */
  const todayLabelPlugin = {
    id: "todayLabelPlugin",
    afterDraw(chart) {
      const x = chart.scales.x.getPixelForValue(todayIndex);
      const y = chart.chartArea.bottom + 40;

      const ctx = chart.ctx;
      ctx.save();
      ctx.fillStyle = "#ff66cc";
      ctx.font = "bold 12px Consolas";
      ctx.textAlign = "center";
      ctx.fillText("today", x, y);
      ctx.restore();
    }
  };

  /* ------------------------------
     Chart.js 初期化
  ------------------------------ */
  const ctxGraph = document.getElementById("updateGraph").getContext("2d");

  const chart = new Chart(ctxGraph, {
    type: "line",
    data: {
      labels: dates,
      datasets: [{
        label: "Total indexes",
        data: indexCounts,
        borderColor: "transparent",
        backgroundColor: "transparent",
        tension: 0.4,
        pointStyle: "circle",
        pointRadius: 5,
        pointHoverRadius: 8,
        pointBackgroundColor: "#ff66cc",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2
      }]
    },
    options: {
      layout: { padding: { bottom: 30 } },
      plugins: { legend: { display: false } },
      scales: {
        x: {
          ticks: { color: "#ffffff" },
          grid: { display: false }
        },
        y: {
          title: {
            display: true,
            text: "Total indexes",
            color: "#ffffff",
            font: { size: 14, weight: "bold" }
          },
          ticks: { color: "#ffffff" },
          grid: {
            color: "rgba(0,191,255,0.3)",
            lineWidth: 1
          }
        }
      },
      responsive: true,
      maintainAspectRatio: false
    },
    plugins: [
      wavePulsePlugin,
      verticalLinePlugin,
      todayLabelPlugin
    ]
  });

  /* ------------------------------
     サイネージ更新
  ------------------------------ */
  const signage = document.getElementById("signage-content");
  let currentIndex = todayIndex;

  function updateSignageByDate(dateStr) {
    const idx = findUpdateIndexByDate(dateStr);
    if (idx === -1) return;

    const item = updates[idx];

    signage.classList.remove("visible");
    setTimeout(() => {
      signage.innerHTML = `
        <p>更新日: ${item.date}</p>
        <p><a href="${item.link}">${item.title}</a></p>
        <p>${item.signage || "最新から過去へ一定間隔で切替表示"}</p>
      `;
      signage.classList.add("visible");
    }, 300);
  }

  /* ------------------------------
     ホバーでサイネージ更新
  ------------------------------ */
  document.getElementById("updateGraph").addEventListener("mousemove", (event) => {
    const points = chart.getElementsAtEventForMode(event, "nearest", { intersect: true }, false);
    if (points.length) {
      const index = points[0].index;
      updateSignageByDate(dates[index]);
    }
  });

  /* ------------------------------
     スクロールで日付移動
  ------------------------------ */
  document.getElementById("updateGraph").addEventListener("wheel", (event) => {
    event.preventDefault();

    if (event.deltaY < 0) {
      currentIndex = Math.max(0, currentIndex - 1);
    } else {
      currentIndex = Math.min(dates.length - 1, currentIndex + 1);
    }

    const currentDate = dates[currentIndex];
    updateSignageByDate(currentDate);

    chart.data.datasets[0].pointRadius = chart.data.datasets[0].data.map((_, i) =>
      i === currentIndex ? 10 : 5
    );

    chart.update();
  });

  /* 初期表示（今日） */
  updateSignageByDate(dates[todayIndex]);
});
