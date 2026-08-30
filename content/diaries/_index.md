<div class="home-content">
    <section class="diaries-container">
        <!-- 左右のエピソードリスト -->
        <div class="diary-box dream-box">
            <h3 class="subheading">Dream diaries</h3>
            <ul class="episode-list">
            <li><button class="ep-btn" data-folder="dream" data-file="ep0001" data-bg="/images/diaries/dream/ep0001.png">EP0001: Journey</button></li>
            <li><button class="ep-btn" data-folder="dream" data-file="ep0002" data-bg="/images/bg_dream2.jpg">EP0002</button></li>
            <li><button class="ep-btn" data-folder="dream" data-file="ep0003" data-bg="/images/bg_dream3.jpg">EP0003</button></li>
            <li><button class="ep-btn" data-folder="dream" data-file="ep0004" data-bg="/images/bg_dream4.jpg">EP0004</button></li>
            </ul>
        </div>
        <div class="diary-box actual-box">
            <h3 class="subheading">Actual diaries</h3>
            <ul class="episode-list">
            <li><button class="ep-btn" data-folder="actual" data-file="ep0001" data-bg="/images/bg_actual1.jpg">EP0001: Croud vs Claude</button></li>
            <li><button class="ep-btn" data-folder="actual" data-file="ep0002" data-bg="/images/bg_actual2.jpg">EP0002</button></li>
            <li><button class="ep-btn" data-folder="actual" data-file="ep0003" data-bg="/images/bg_actual3.jpg">EP0003</button></li>
            </ul>
        </div>
    </section>
    <!-- 本文表示エリア -->
    <div id="diary-content" class="diary-content-box">
    <p>Click an episode to view its content.</p>
    </div>
    <div class="bg-toggle-box">
        <label class="switch">
            <input type="checkbox" id="bg-toggle-checkbox" checked>
            <span class="slider"></span>
        </label>
        <span class="switch-label">Background Change</span>
    </div>
</div>