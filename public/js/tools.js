document.addEventListener("DOMContentLoaded", () => {
  const mainTools = document.querySelectorAll("#main-tool-list li");
  const subToolList = document.getElementById("sub-tool-list");
  const imageArea = document.getElementById("tool-image-area");
  const instructionText = document.getElementById("instruction-text");

  let selectedMain = null;
  let selectedSub = null;

  // Main Tool → Sub Tool Sets
  const subToolSets = {
    audio: ["Optical", "Liquid", "Flame", "Voltage", "Forest", "Echo", "Macro space", "Micro space"],
    converter: ["Music", "Sound Effects", "FX"],
    tracker: ["Eyes", "Faces", "Cells", "Spheres", "Strings", "Cubes"],
    tracer: ["Fashion", "Brand", "Languages", "Fevers", "Coffees", "Alcohols"],
    hack: ["NIDAQ", "Picoammeter", "Oscilloscope", "Smartphone"],
    database: ["Game", "Books", "Shops", "Humans", "AI"]
  };

  // フェードアウト → 内容更新 → フェードイン
  function fadeUpdate(element, updateFunc) {
    element.classList.remove("show");
    setTimeout(() => {
      updateFunc();
      element.classList.add("show");
    }, 300); // ← フェード時間と同期（CSS変数と合わせてもOK）
  }

  // Main Tool 選択
  mainTools.forEach(tool => {
    tool.addEventListener("click", () => {
      mainTools.forEach(t => t.classList.remove("active"));
      tool.classList.add("active");
      selectedMain = tool.dataset.tool;
      selectedSub = null;

      fadeUpdate(subToolList, () => updateSubTools(selectedMain));
      fadeUpdate(imageArea, () => imageArea.innerHTML = `<p>Select both Main and Sub Tool.</p>`);
      fadeUpdate(instructionText, () => instructionText.innerHTML = "");
    });
  });

  // Sub Tool リスト更新
  function updateSubTools(mainKey) {
    subToolList.innerHTML = "";
    const subs = subToolSets[mainKey];
    subs.forEach(sub => {
      const li = document.createElement("li");
      li.textContent = sub;
      li.dataset.sub = sub.toLowerCase().replace(/\s+/g, "-");
      li.addEventListener("click", () => {
        document.querySelectorAll("#sub-tool-list li").forEach(s => s.classList.remove("active"));
        li.classList.add("active");
        selectedSub = li.dataset.sub;
        updateView();
      });
      subToolList.appendChild(li);
    });
  }

  // Main + Sub が選択されたときのみ表示
  function updateView() {
    if (selectedMain && selectedSub) {

      fadeUpdate(imageArea, () => {
        imageArea.innerHTML = `
          <img src="/images/tools/${selectedMain}-${selectedSub}.png"
               style="width:100%;border-radius:8px;">
        `;
      });

      fadeUpdate(instructionText, () => {
        loadInstruction(selectedMain, selectedSub);
      });

    } else {
      fadeUpdate(imageArea, () => imageArea.innerHTML = `<p>Select both Main and Sub Tool.</p>`);
      fadeUpdate(instructionText, () => instructionText.innerHTML = "");
    }
  }

  // Instruction 読み込み（md）
  async function loadInstruction(main, sub) {
    const filePath = `/tools/${main}/${sub}.md`;

    try {
      const res = await fetch(filePath);
      const md = await res.text();
      instructionText.innerHTML = convertMarkdown(md);
    } catch (err) {
      instructionText.innerHTML = `<p>Instruction file not found: ${filePath}</p>`;
    }
  }

  // Markdown → HTML
  function convertMarkdown(md) {
    return md
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank">$1</a>')
      .replace(/\n/g, "<br>");
  }
});
