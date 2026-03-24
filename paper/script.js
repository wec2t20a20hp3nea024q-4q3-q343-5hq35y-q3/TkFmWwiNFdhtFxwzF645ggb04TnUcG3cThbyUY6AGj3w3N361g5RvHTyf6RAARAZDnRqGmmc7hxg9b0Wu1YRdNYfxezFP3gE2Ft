// ---------- Data Model ----------
let questions = [];
let nextId = 1;

function initDefaultQuestions() {
    return [
        { id: nextId++, section: "A", number: 1, text: "Given $f(x)=x$. Find $f'(x)$.", pages: 1, marks: 1 },
    ];
}

questions = initDefaultQuestions();

// ---------- Render editor UI ----------
function renderEditor() {
    const container = document.getElementById('questionsContainer');
    if (!container) return;
    container.innerHTML = '';
    questions.forEach((q) => {
        const card = document.createElement('div');
        card.className = 'question-card';
        card.dataset.id = q.id;

        const row1 = document.createElement('div');
        row1.className = 'q-row';
        row1.innerHTML = `
            <label>Section</label>
            <select class="q-section" data-id="${q.id}" data-field="section">
                <option value="A" ${q.section === 'A' ? 'selected' : ''}>Section A</option>
                <option value="B" ${q.section === 'B' ? 'selected' : ''}>Section B</option>
            </select>
            <label>Q.No</label>
            <input type="number" class="q-number" data-id="${q.id}" data-field="number" value="${q.number}" step="1" min="1" style="width:80px">
            <label>Pages</label>
            <input type="number" class="q-pages" data-id="${q.id}" data-field="pages" value="${q.pages}" min="1" max="8" step="1" style="width:80px">
            <label>Marks</label>
            <input type="number" class="q-marks" data-id="${q.id}" data-field="marks" value="${q.marks || 5}" step="1" min="0" style="width:80px">
            <button class="delete-btn" data-id="${q.id}">Delete</button>
        `;

        const rowText = document.createElement('div');
        rowText.style.marginTop = '8px';
        const textarea = document.createElement('textarea');
        textarea.placeholder = 'Question text with KeTeX (e.g. $\\int_{0}^{\\pi} \\sin x \\, dx$)';
        textarea.value = q.text;
        textarea.style.width = '100%';
        textarea.dataset.id = q.id;
        textarea.dataset.field = 'text';
        textarea.rows = 2;
        rowText.appendChild(textarea);

        card.appendChild(row1);
        card.appendChild(rowText);
        container.appendChild(card);

        // Attach textarea handler separately (no editor re-render)
        textarea.removeEventListener('input', handleTextInput);
        textarea.addEventListener('input', handleTextInput);
    });

    // Attach handlers for other controls (these re-render editor)
    document.querySelectorAll('.q-section, .q-number, .q-pages, .q-marks, .delete-btn').forEach(el => {
        el.removeEventListener('change', handleControlChange);
        el.removeEventListener('input', handleControlChange);
        el.removeEventListener('click', handleEditorDelete);
        if (el.classList && el.classList.contains('delete-btn')) {
            el.addEventListener('click', handleEditorDelete);
        } else {
            el.addEventListener('change', handleControlChange);
            if (el.classList && (el.classList.contains('q-number') || el.classList.contains('q-pages') || el.classList.contains('q-marks'))) {
                el.addEventListener('input', handleControlChange);
            }
        }
    });
}

// Handle textarea input (no editor re-render)
function handleTextInput(e) {
    const target = e.target;
    const id = parseInt(target.dataset.id);
    if (!id) return;
    const question = questions.find(q => q.id === id);
    if (question) {
        question.text = target.value;
        renderFullPreview();      // update preview only, keep editor unchanged
    }
}

// Handle changes to section, number, pages, marks (these re-render the editor)
function handleControlChange(e) {
    const target = e.target;
    const id = parseInt(target.dataset.id);
    const field = target.dataset.field;
    if (!id) return;
    const question = questions.find(q => q.id === id);
    if (question) {
        if (field === 'section') question.section = target.value;
        else if (field === 'number') question.number = parseInt(target.value) || 1;
        else if (field === 'pages') question.pages = parseInt(target.value) || 1;
        else if (field === 'marks') question.marks = parseInt(target.value) || 0;
        renderEditor();           // re-render editor to update the controls
        renderFullPreview();
    }
}

function handleEditorDelete(e) {
    const id = parseInt(e.target.dataset.id);
    if (!id) return;
    questions = questions.filter(q => q.id !== id);
    renderEditor();
    renderFullPreview();
}

document.getElementById('addQuestionBtn')?.addEventListener('click', () => {
    const newId = nextId++;
    questions.push({
        id: newId,
        section: "A",
        number: Math.max(1, (questions.filter(q => q.section === 'A').length + 1)),
        text: "Write your new KeTeX question here: $\\frac{d}{dx} (x^2)$",
        pages: 1,
        marks: 5
    });
    renderEditor();
    renderFullPreview();
});

// ---------- Build HTML (first page with header + table, then questions) ----------
function buildExamHTML() {
    const allQuestions = [...questions].sort((a,b) => {
        if (a.section !== b.section) return a.section.localeCompare(b.section);
        return a.number - b.number;
    });

    // Get user‑supplied header HTML
    const headerHtml = document.getElementById('headerHtmlInput')?.value || '';

    let pagesHtml = '';

    // ---- FIRST PAGE: user header + student details + instructions + marks table ----
    let firstPage = `<div class="exam-page">`;
    firstPage += `<div class="first-page-header">${headerHtml}</div>`;
    firstPage += `
        <div class="info-row">
            <div class="info-item">Name: <span class="underline" style="min-width: 180px;"></span></div>
            <div class="info-item">Class: <span class="underline" style="min-width: 80px;"></span></div>
            <div class="info-item">Class No.: <span class="underline" style="min-width: 60px;"></span></div>
        </div>
        <div style="font-size:12px; margin-bottom:20px;">INSTRUCTIONS: Attempt ALL questions. Write answers in the spaces provided. Rectangle boxes indicate answer area.</div>
    `;

    // Build marks table
    firstPage += `<table class="marks-table">
        <thead>
            <tr><th>Question No.</th><th></th><th>Marks</th></tr>
        </thead>
        <tbody>`;

    let seqNum = 1;
    for (let q of allQuestions) {
        firstPage += `
            <tr>
                <td>${seqNum}</td>
                <td></td>
                <td>${q.marks || 5}</td>
            </tr>`;
        seqNum++;
    }

    firstPage += `</tbody>
        </table>`;
    firstPage += `</div>`;
    pagesHtml += firstPage;

    // ---- Now generate question pages ----
    let currentSection = null;
    seqNum = 1;

    for (let q of allQuestions) {
        const sectionChanged = (currentSection !== q.section);
        if (sectionChanged) {
            currentSection = q.section;
        }

        // First page of this question
        let pageHtml = `<div class="exam-page">`;
        if (sectionChanged) {
            pageHtml += `<div class="section-title">SECTION ${currentSection} (50 marks)</div>`;
        }
        pageHtml += `<div class="question-stem"><span class="question-number">${seqNum}.</span> <span class="math-text">${escapeHtml(q.text)}</span></div>`;
        pageHtml += `<div class="answer-rectangle"></div>`;
        pageHtml += `</div>`;
        pagesHtml += pageHtml;
        seqNum++;

        // Extra pages (continued)
        for (let i = 1; i < q.pages; i++) {
            let continuedPage = `<div class="exam-page">`;
            continuedPage += `<div class="continued-label">◆ Question ${seqNum-1} (continued) ◆</div>`;
            continuedPage += `<div class="answer-rectangle"></div>`;
            continuedPage += `</div>`;
            pagesHtml += continuedPage;
        }
    }

    // Add formula reference page
    pagesHtml += `<div class="exam-page">
        <div class="formula-ref">
            <strong>Formulas for Reference</strong><br>
            $\\sin(A \\pm B) = \\sin A \\cos B \\pm \\cos A \\sin B$<br><br>
            $\\cos(A \\pm B) = \\cos A \\cos B \\mp \\sin A \\sin B$<br><br>
            $\\tan(A \\pm B) = \\frac{\\tan A \\pm \\tan B}{1 \\mp\\tan A\\tan B}$<br><br>
            $\\sin A + \\sin B = 2\\sin\\frac{A+B}{2}\\cos\\frac{A-B}{2}$<br><br>
            $\\sin A - \\sin B = 2\\cos\\frac{A+B}{2}\\sin\\frac{A-B}{2}$<br><br>
            $\\cos A + \\cos B = 2\\cos\\frac{A+B}{2}\\cos\\frac{A-B}{2}$<br><br>
            $\\cos A - \\cos B = -2\sin\\frac{A+B}{2}\\sin\\frac{A-B}{2}$<br><br>
            $2\\sin A \\cos B = \\sin(A+B) + \\sin(A-B)$<br><br>
            $2\\cos A \\sin B = \\sin(A+B) - \\sin(A-B)$<br><br>
            $2\\cos A \\cos B = \\cos(A+B) + \\cos(A-B)$<br><br>
            $2\\sin A \\sin B = \\cos(A-B) - \\cos(A+B)$
        </div>
    </div>`;

    return pagesHtml;
}

function escapeHtml(str) {
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

function renderFullPreview() {
    const previewDiv = document.getElementById('livePreviewArea');
    if (!previewDiv) return;
    const rawHtml = buildExamHTML();
    previewDiv.innerHTML = rawHtml;

    // Render KaTeX math inside the preview
    if (typeof renderMathInElement !== 'undefined') {
        renderMathInElement(previewDiv, {
            delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '$', right: '$', display: false},
                {left: '\\(', right: '\\)', display: false},
                {left: '\\[', right: '\\]', display: true}
            ],
            throwOnError: false
        });
    }
}

async function downloadAsPDF() {
    const previewDiv = document.getElementById('livePreviewArea');
    if (!previewDiv) {
        alert('Preview area not found.');
        return;
    }

    const originalBtn = document.getElementById('downloadPDFBtn');
    const originalText = originalBtn.innerText;
    originalBtn.innerText = 'Generating PDF...';
    originalBtn.disabled = true;

    try {
        const opt = {
            margin: 0.2,
            filename: 'M2_Mock_Exam_Paper.pdf',
            image: { type: 'jpeg', quality: 1.0 },          // maximum quality
            html2canvas: { scale: 3, letterRendering: true, useCORS: true }, // higher scale = sharper
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };
        await html2pdf().set(opt).from(previewDiv).save();
    } catch (error) {
        console.error('PDF generation error:', error);
        alert('Failed to generate PDF. Please try again.');
    } finally {
        originalBtn.innerText = originalText;
        originalBtn.disabled = false;
    }
}

// Event binding
document.getElementById('refreshPreviewBtn')?.addEventListener('click', () => {
    renderFullPreview();
});
document.getElementById('downloadPDFBtn')?.addEventListener('click', () => {
    downloadAsPDF();
});
document.getElementById('headerHtmlInput')?.addEventListener('input', () => {
    renderFullPreview();
});

// Initialize
renderEditor();
renderFullPreview();
window.addEventListener('load', () => {
    renderFullPreview();
});
