// 內建後備課文（若 lesson.js 未正確載入則使用此數據）
const FALLBACK_LESSONS = [
    {
        id: 1,
        title: "【範例】論語·學而篇",
        content: `子曰：「學而時習之，{{學::學習}}而時習之，不亦說乎？有朋自遠方來，{{朋::朋友}}，不亦樂乎？人不知而不慍，{{慍::生氣、怨恨}}，不亦君子乎？」`
    },
    {
        id: 2,
        title: "【範例】魚我所欲也",
        content: `魚，我所欲也；熊掌，{{熊掌::熊的腳掌}}，亦我所欲也。二者不可得兼，{{兼::同時得到}}，舍魚而取熊掌者也。`
    }
];

let lessonsData = null;
let currentLessonId = null;
let activeTooltip = null;  // 當前顯示的對話框元素

// 字體控制邏輯
const fontSlider = document.getElementById('fontSlider');
const fontValue = document.getElementById('fontValue');

// 【改動1】擴大範圍：最小0.5，最大2.5
fontSlider.min = 0.5;
fontSlider.max = 2.5;

function updateFontScale(value) {
    const scale = parseFloat(value);
    document.documentElement.style.setProperty('--text-scale', scale);
    fontValue.innerText = scale.toFixed(2);
    // 【改動2】儲存到 localStorage
    localStorage.setItem('fontScale', scale);
    if (activeTooltip) {
        removeTooltip();
    }
}

// 【改動3】從 localStorage 讀取並設定初始值
const savedFontScale = localStorage.getItem('fontScale');
if (savedFontScale !== null) {
    const scale = parseFloat(savedFontScale);
    if (!isNaN(scale) && scale >= fontSlider.min && scale <= fontSlider.max) {
        fontSlider.value = scale;
        updateFontScale(scale);
    } else {
        // 無效值則使用預設1.2
        fontSlider.value = 1.2;
        updateFontScale(1.2);
    }
} else {
    fontSlider.value = 1.2;
    updateFontScale(1.2);
}

fontSlider.addEventListener('input', (e) => {
    updateFontScale(e.target.value);
});

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

function parseContentToHTML(rawContent) {
    let escaped = escapeHtml(rawContent);
    const regex = /\{([^=]+)=([^}]+)\}/g;
    return escaped.replace(regex, function(match, word, translation) {
        return `<span class="clickable-word" data-translation="${escapeHtml(translation)}">${escapeHtml(word)}</span>`;
    });
}

// 移除當前的對話框
function removeTooltip() {
    if (activeTooltip) {
        activeTooltip.remove();
        activeTooltip = null;
    }
}

// 顯示對話框在目標元素附近，箭頭指向目標
function showTooltip(targetElement, text) {
    removeTooltip();

    const rect = targetElement.getBoundingClientRect();
    const tooltip = document.createElement('div');
    tooltip.className = 'word-tooltip';
    tooltip.textContent = text;
    document.body.appendChild(tooltip);

    const tooltipRect = tooltip.getBoundingClientRect();
    const viewportWidth = window.innerWidth;

    let top = rect.top - tooltipRect.height - 10;
    let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
    let placement = 'above';

    if (top < 10) {
        top = rect.bottom + 10;
        placement = 'below';
    }

    if (left < 10) left = 10;
    if (left + tooltipRect.width > viewportWidth - 10) {
        left = viewportWidth - tooltipRect.width - 10;
    }

    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;

    const targetCenterX = rect.left + rect.width / 2;
    const tooltipLeft = left;
    let arrowLeft = targetCenterX - tooltipLeft;
    const minArrowLeft = 12;
    const maxArrowLeft = tooltipRect.width - 12;
    arrowLeft = Math.min(maxArrowLeft, Math.max(minArrowLeft, arrowLeft));
    tooltip.style.setProperty('--arrow-left', `${arrowLeft}px`);

    if (placement === 'above') {
        tooltip.classList.add('above');
    }

    activeTooltip = tooltip;

    setTimeout(() => {
        const closeHandler = (e) => {
            if (!activeTooltip) return;
            if (e.target === activeTooltip || activeTooltip.contains(e.target)) return;
            if (e.target.closest('.clickable-word')) return;
            removeTooltip();
            document.removeEventListener('click', closeHandler);
            document.removeEventListener('scroll', scrollHandler);
        };
        const scrollHandler = () => removeTooltip();
        document.addEventListener('click', closeHandler);
        document.addEventListener('scroll', scrollHandler, { once: true });
        tooltip._closeHandler = closeHandler;
        tooltip._scrollHandler = scrollHandler;
    }, 0);
}

// 根據當前課文 ID 或標題，從 analysisData 中提取分析內容
function getAnalysisContent(lesson) {
    // 檢查 analysisData 是否存在且為陣列
    if (typeof analysisData !== 'undefined' && Array.isArray(analysisData)) {
        // 優先根據 id 匹配
        let analysisItem = analysisData.find(item => item.id === lesson.id);
        if (analysisItem && analysisItem.analysis) {
            return analysisItem.analysis;
        }
        // 其次根據標題匹配（去除前綴【範例】等干擾，但建議使用 id）
        analysisItem = analysisData.find(item => item.title === lesson.title);
        if (analysisItem && analysisItem.analysis) {
            return analysisItem.analysis;
        }
        return '📝 目前無此課文的分析資料，可編輯 analysis.js 新增。';
    } else {
        return '📝 尚未載入 analysis.js 或格式不正確。請建立 analysis.js 並定義 analysisData 陣列（範例格式見說明）。';
    }
}

function renderLessonById(lessonId) {
    const lesson = lessonsData.find(l => l.id === lessonId);
    if (!lesson) return;
    document.getElementById('lessonTitle').innerText = lesson.title;
    const contentHTML = parseContentToHTML(lesson.content);
    document.getElementById('textContent').innerHTML = contentHTML;
    
    // 更新分析區塊：從 analysis.js 提取分析內容
    const analysisDiv = document.getElementById('analysisContent');
    const analysisText = getAnalysisContent(lesson);
    analysisDiv.innerHTML = escapeHtml(analysisText).replace(/\n/g, '<br>'); // 保留換行
    
    removeTooltip();
}

function renderSidebar() {
    const container = document.getElementById('lessonList');
    container.innerHTML = '';
    lessonsData.forEach(lesson => {
        const btn = document.createElement('button');
        btn.className = 'lesson-btn';
        if (currentLessonId === lesson.id) btn.classList.add('active');
        btn.textContent = lesson.title;
        btn.addEventListener('click', () => {
            currentLessonId = lesson.id;
            localStorage.setItem('lastLessonId', currentLessonId);
            document.querySelectorAll('.lesson-btn').forEach(btnEl => btnEl.classList.remove('active'));
            btn.classList.add('active');
            renderLessonById(currentLessonId);
        });
        container.appendChild(btn);
    });
}

function initApp(lessonsArray) {
    lessonsData = lessonsArray;
    if (!lessonsData || lessonsData.length === 0) {
        document.getElementById('textContent').innerHTML = '<p>暫無課文，請檢查 lesson.js 檔案內容。</p>';
        document.getElementById('analysisContent').innerHTML = '<p>無課文資料</p>';
        return;
    }

    const savedId = localStorage.getItem('lastLessonId');
    if (savedId !== null) {
        const savedIdNum = parseInt(savedId, 10);
        const exists = lessonsData.some(l => l.id === savedIdNum);
        if (exists) {
            currentLessonId = savedIdNum;
        } else {
            currentLessonId = lessonsData[0].id;
            localStorage.removeItem('lastLessonId');
        }
    } else {
        currentLessonId = lessonsData[0].id;
    }

    renderSidebar();
    renderLessonById(currentLessonId);
}

function loadLessons() {
    if (typeof lessons !== 'undefined' && Array.isArray(lessons) && lessons.length > 0) {
        initApp(lessons);
    } else {
        const errorDiv = document.getElementById('errorMsg');
        errorDiv.style.display = 'block';
        errorDiv.className = 'error-banner';
        errorDiv.innerHTML = '⚠️ 無法載入 lesson.js 或 lessons 資料有誤，目前顯示內建範例課文。請確認 lesson.js 檔案存在且正確定義了 lessons 陣列。';
        initApp(FALLBACK_LESSONS);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadLessons);
} else {
    loadLessons();
}

document.getElementById('textContent').addEventListener('click', (e) => {
    const targetWord = e.target.closest('.clickable-word');
    if (targetWord) {
        e.stopPropagation();
        const translation = targetWord.getAttribute('data-translation');
        if (translation && translation.trim()) {
            showTooltip(targetWord, translation);
        } else {
            showTooltip(targetWord, '（無語譯資料）');
        }
    }
});
