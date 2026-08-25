async function loadUpdatesJSON() {
  const res = await fetch("/updates/index.json");
  return await res.json();
}

document.addEventListener("DOMContentLoaded", () => {

  /* ------------------------------
     1. 今日の日付と過去7日間を生成
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
     2. index.md の総数を日付ごとに取得
        ※ ここは後で Hugo 生成 JSON と連携
  ------------------------------ */
  // 仮データ（後で自動取得に変更）
  const indexCounts = [1, 2, 2, 3, 5, 5, 6, 7];


  /* ------------------------------
     3. 更新ログ（右サイネージ）
        ※ ここも後で自動生成 JSON と連携
  ------------------------------ */
  const updates = [
    { date: dates[7], title: "Scientific 02", link: "/reports/scientific02/" },
    { date: dates[6], title: "Software 03", link: "/tools/software03/" },
    { date: dates[5], title: "Immersion 01", link: "/relax/immersion01/" },
    { date: dates[4], title: "Dream Page 05", link: "/diaries/dream05/" },
    { date: dates[3], title: "Actual Page 04", link: "/diaries/actual04/" }
  ];

  function findUpdateIndexByDate(dateStr) {
    return updates.findIndex(u => u.date === dateStr);
  }


  /* ------------------------------
     4. 波動パルス折れ線プラグイン
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
     5. 今日の日付の縦線（ネオン破線）
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
     6. 今日の日付の下に (today) を表示
  ------------------------------ */
  const todayLabelPlugin = {
    id: "todayLabelPlugin",
    afterDraw(chart) {
      const x = chart.scales.x.getPixelForValue(todayIndex);
      const y = chart.chartArea.bottom + 40; // padding.bottom で確保済み

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
     7. Chart.js 初期化
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
      layout: {
        padding: {
          bottom: 30 // today ラベル用余白
        }
      },
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
     8. サイネージ（フェード切替）
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
        <p>最新から過去へ一定間隔で切替表示</p>
      `;
      signage.classList.add("visible");
    }, 300);
  }


  /* ------------------------------
     9. ホバーでサイネージ更新
  ------------------------------ */
  document.getElementById("updateGraph").addEventListener("mousemove", (event) => {
    const points = chart.getElementsAtEventForMode(event, "nearest", { intersect: true }, false);
    if (points.length) {
      const index = points[0].index;
      updateSignageByDate(dates[index]);
    }
  });


  /* ------------------------------
     10. スクロールで日付移動 → 点強調＋サイネージ同期
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
