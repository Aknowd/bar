document.addEventListener("DOMContentLoaded", () => {
  const topics = document.querySelectorAll("#topics-list button");
  const titlesList = document.getElementById("titles-list");
  const materialsContent = document.getElementById("materials-content");
  const reportsContent = document.getElementById("reports-content");
  const referencesList = document.getElementById("references-list");

  let selectedTopic = null;
  let selectedTitle = null;

  // 記事データ（例）
  const articles = [
    {
      date: "2026.10.25",
      title: "Describe about famous AI influencers for 'Physical AI' fields.",
      topic: "ai",
      image: "/images/reports/ai-influencers.png",
      body: "This report explores the impact of AI influencers in the Physical AI domain...",
      refs: ["https://github.com/", "https://arxiv.org/abs/2401.12345"]
    },
    {
      date: "2026.10.13",
      title: "What I got from the 'Electric States'.",
      topic: "fiction",
      image: "/images/reports/electric-states.gif",
      body: "A reflection on the narrative and visual design of Electric States...",
      refs: ["https://example.com/electric-states"]
    },
    {
      date: "2026.10.01",
      title: "Renewal website was opened by using GitHub Pages.",
      topic: "technology",
      image: "/images/reports/github-renewal.png",
      body: "This article explains how the site was rebuilt using GitHub Pages...",
      refs: ["https://github.com/"]
    }
  ];

  // Topicsクリック
  topics.forEach(btn => {
    btn.addEventListener("click", () => {
      topics.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      selectedTopic = btn.dataset.topic;
      updateTitles();
    });
  });

  // Titles更新
  function updateTitles() {
    titlesList.innerHTML = "";
    const filtered = selectedTopic
      ? articles.filter(a => a.topic === selectedTopic)
      : articles;

    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    filtered.forEach(article => {
      const li = document.createElement("li");
      li.textContent = `${article.date} ${article.title}`;
      li.addEventListener("click", () => {
        document.querySelectorAll("#titles-list li").forEach(t => t.classList.remove("active"));
        li.classList.add("active");
        selectedTitle = article;
        showArticle(article);
      });
      titlesList.appendChild(li);
    });
  }

  // 記事表示
  function showArticle(article) {
    materialsContent.innerHTML = `<img src="${article.image}" alt="Material" style="width:100%;border-radius:8px;">`;
    reportsContent.innerHTML = `<p>${article.body}</p>`;
    referencesList.innerHTML = "";
    article.refs.forEach(ref => {
      const li = document.createElement("li");
      li.innerHTML = `<a href="${ref}" target="_blank">${ref}</a>`;
      referencesList.appendChild(li);
    });
  }

  // 初期表示
  updateTitles();
});
