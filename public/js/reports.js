document.addEventListener("DOMContentLoaded", () => {

  /* ============================
     DOM Elements
  ============================ */
  const topics = document.querySelectorAll("#topics-list button");
  const titlesList = document.getElementById("titles-list");
  const materialsContent = document.getElementById("materials-content");
  const reportsContent = document.getElementById("reports-content");
  const referencesList = document.getElementById("references-list");

  let selectedTopic = null;
  let selectedArticle = null;

  /* ============================
     記事一覧（mdファイルのパス）
     ※ Hugo の static/reports/ に配置
  ============================ */
  const articleFiles = [
    "/reports/topic_261025.md",
    "/reports/topic_261013.md",
    "/reports/topic_261001.md"
  ];

  let articles = []; // md 読み込み後にここへ格納


  /* ============================
     Markdown → FrontMatter + Body 分離
  ============================ */
  function parseFrontMatter(mdText) {
    const fmMatch = mdText.match(/^---([\s\S]*?)---/);
    if (!fmMatch) return { front: {}, body: mdText };

    const fmText = fmMatch[1].trim();
    const body = mdText.replace(fmMatch[0], "").trim();

    const front = {};
    const lines = fmText.split("\n");

    let currentKey = null;
    let arrayMode = false;
    let arrayBuffer = [];

    lines.forEach(line => {
      const trimmed = line.trim();

      // references: の開始
      if (trimmed.endsWith(":") && !trimmed.startsWith("-")) {
        currentKey = trimmed.replace(":", "");
        arrayMode = true;
        arrayBuffer = [];
        return;
      }

      // 配列要素（- label: ...）
      if (arrayMode && trimmed.startsWith("-")) {
        const labelMatch = trimmed.match(/label:\s*"?([^"]+)"?/);
        const urlMatch = trimmed.match(/url:\s*"?([^"]+)"?/);

        arrayBuffer.push({
          label: labelMatch ? labelMatch[1] : "",
          url: urlMatch ? urlMatch[1] : ""
        });
        return;
      }

      // 通常キー（配列終了はここで自動的に起こる）
      if (!arrayMode && trimmed.includes(":")) {
        const [key, ...rest] = trimmed.split(":");
        front[key.trim()] = rest.join(":").trim().replace(/^"|"$/g, "");
      }
    });

    // 最後の配列を保存
    if (arrayMode && arrayBuffer.length > 0) {
      front[currentKey] = arrayBuffer;
    }

    return { front, body };
  }


  /* ============================
     Markdown → HTML（簡易変換）
  ============================ */
  function convertMarkdown(md) {
    let html = md;

    // 見出し
    html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
    html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
    html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");

    // 太字・斜体
    html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

    // 箇条書き
    html = html.replace(/^- (.+)$/gm, "<li>$1</li>");
    html = html.replace(/(<li>[\s\S]+<\/li>)/gm, "<ul>$1</ul>");

    // 番号付きリスト
    html = html.replace(/^\d+\.\s(.+)$/gm, "<li>$1</li>");
    html = html.replace(/(<li>[\s\S]+<\/li>)/gm, "<ol>$1</ol>");

    // 引用
    html = html.replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>");

    // コードブロック
    html = html.replace(/```([\s\S]+?)```/gm, "<pre><code>$1</code></pre>");

    // 改行
    html = html.replace(/\n/g, "<br>");

    return html;
  }

  /* ============================
     mdファイル読み込み
  ============================ */
  async function loadArticleMD(path) {
    const res = await fetch(path);
    const md = await res.text();
    const { front, body } = parseFrontMatter(md);

    console.log("=== Loaded FrontMatter ===");
    console.log(front.references);   // ← ここに入れる
    console.log("==========================");

    return {
      mdPath: path,
      title: front.title || "Untitled",
      date: front.date || "Unknown",
      topic: front.topic || "others",
      image: front.image || "",
      references: front.references || [],
      body: body
    };
  }

  /* ============================
     全 md を読み込む
  ============================ */
  async function loadAllArticles() {
    const loaded = [];
    for (const file of articleFiles) {
      const article = await loadArticleMD(file);
      loaded.push(article);
    }
    articles = loaded;
    updateTitles(); // 初期表示
  }


  /* ============================
     Topicsクリック
  ============================ */
  topics.forEach(btn => {
    btn.addEventListener("click", () => {
      topics.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      selectedTopic = btn.dataset.topic;
      updateTitles();
    });
  });


  /* ============================
     Titles更新
  ============================ */
  function updateTitles() {
    titlesList.innerHTML = "";

    const filtered = selectedTopic
      ? articles.filter(a => a.topic === selectedTopic)
      : articles;

    // 日付で降順ソート
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    filtered.forEach(article => {
      const li = document.createElement("li");
      li.textContent = `${article.date} ${article.title}`;

      li.addEventListener("click", () => {
        document.querySelectorAll("#titles-list li").forEach(t => t.classList.remove("active"));
        li.classList.add("active");

        selectedArticle = article;
        showArticle(article);
      });

      titlesList.appendChild(li);
    });
  }


  /* ============================
     記事表示
  ============================ */
  function showArticle(article) {

    /* Materials */
    materialsContent.innerHTML = `
      <img src="${article.image}" 
           alt="Material" 
           style="width:100%;border-radius:8px;">
    `;

    /* Reports */
    reportsContent.innerHTML = convertMarkdown(article.body);

    /* References */
    /* ============================
    References 表示
    ============================ */
    referencesList.innerHTML = "";
    article.references.forEach((ref, index) => {
      const li = document.createElement("li");
      li.innerHTML = `[${index + 1}] <a href="${ref.url}" target="_blank">${ref.label}</a>`;
      referencesList.appendChild(li);
    });
  }


  /* ============================
     初期化
  ============================ */
  loadAllArticles();

});
