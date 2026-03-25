const fs = require('fs');
const path = require('path');

const folder = __dirname;
const sidebarHTML = `
    <!-- Sidebar Navigation -->
    <aside class="sidebar">
        <div class="sidebar-header">
            <h2>Architecture Hub</h2>
            <span class="course-code">CSC 2111</span>
        </div>
        
        <nav class="nav-menu">
            <div class="nav-group-title">Overview</div>
            <ul>
                <li class="nav-item"><a href="index.html" class="nav-link"><span class="nav-icon">🏠</span> Dashboard</a></li>
                <li class="nav-item"><a href="terminology.html" class="nav-link"><span class="nav-icon">📖</span> Terminology</a></li>
            </ul>

            <div class="nav-group-title">Topics</div>
            <ul>
                <li class="nav-item"><a href="topic1.html" class="nav-link"><span class="nav-icon">01</span> Structure & Function</a></li>
                <li class="nav-item"><a href="topic2.html" class="nav-link"><span class="nav-icon">02</span> Evolution</a></li>
            </ul>

            <div class="nav-group-title">Assessments</div>
            <ul>
                <li class="nav-item"><a href="quiz_topic1.html" class="nav-link"><span class="nav-icon">🧠</span> Topic 1 Quiz</a></li>
                <li class="nav-item"><a href="quiz_topic2.html" class="nav-link"><span class="nav-icon">🧠</span> Topic 2 Quiz</a></li>
            </ul>
        </nav>
    </aside>
`;

function processHtmlFile(filename, newName, processor) {
    const filePath = path.join(folder, filename);
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // add link to styles.css
    content = content.replace('</head>', '  <link rel="stylesheet" href="styles.css">\n</head>');
    
    const bodyStart = content.indexOf('<body>') !== -1 ? content.indexOf('<body>') + 6 : content.match(/<body[^>]*>/).index + content.match(/<body[^>]*>/)[0].length;
    const bodyEnd = content.lastIndexOf('</body>');
    
    const pre = content.substring(0, bodyStart);
    const body = content.substring(bodyStart, bodyEnd);
    const post = content.substring(bodyEnd);
    
    processor(pre, body, post, newName);
}

// Topic 1
processHtmlFile('topic1_computer_structure (1).html', 'topic1.html', (pre, body, post, newName) => {
    // Extract Challenge Quiz
    const quizMatch = body.match(/(<!--\s*CHALLENGE QUIZ\s*-->[\s\S]*?)<!--\s*NAV\s*-->/i) || body.match(/(<div class="challenge-section">[\s\S]*?<\/div>\s*)<!--\s*NAV\s*-->/i);
    
    if (quizMatch) {
        const challengeBlock = quizMatch[1];
        let newBody = body.replace(challengeBlock, `
        <div style="margin: 3rem 0; text-align: center;">
            <a href="quiz_topic1.html" style="background: var(--accent); color: #000; padding: 1rem 2rem; border-radius: 50px; font-weight: 700; text-decoration: none; font-family: 'Syne', sans-serif; display: inline-block;">Take Topic 1 Quiz →</a>
        </div>
        `);
        
        newBody = newBody.replace(/alert\('Great work!.*?Next Topic →.*?<\/button>/s, "window.location.href='topic2.html'\">Next Topic →</button>");
        
        const topic1Html = `${pre}\n${sidebarHTML}\n<main class="main-content" style="background: var(--bg); color: var(--text); padding-top: 1rem;">\n${newBody}\n</main>\n${post}`;
        fs.writeFileSync(path.join(folder, newName), topic1Html);
        
        const quizBody = `
        <div class="container" style="padding-top: 1rem;">
            <header>
                <div class="course-tag" style="display:inline-block; font-family:'Space Mono'; color:var(--accent); border:1px solid var(--accent); padding:4px 14px; border-radius:20px; font-size:0.75rem; letter-spacing:2px; margin-bottom:1rem; background:rgba(0,245,196,0.1);">CSC 2111 · ASSESSMENT</div>
                <h1>Topic 1 <br><span>Knowledge Check</span></h1>
                <p style="font-family:'Space Mono'; color:var(--muted); font-size:1rem; margin-top:0.5rem;">// test your understanding</p>
            </header>
            ${challengeBlock}
        </div>
        `;
        const quizHtml = `${pre}\n${sidebarHTML}\n<main class="main-content" style="background: var(--bg); color: var(--text); padding-top: 1rem;">\n${quizBody}\n</main>\n${post}`;
        fs.writeFileSync(path.join(folder, 'quiz_topic1.html'), quizHtml);
    }
});

// Topic 2
processHtmlFile('topic2_evolution_performance.html', 'topic2.html', (pre, body, post, newName) => {
    const quizMatch = body.match(/(<!--\s*QUIZ\s*-->[\s\S]*?<\/div>)\s*<hr>/) || body.match(/(<div class="quiz-section">[\s\S]*?<\/div>\s*<\/div>\s*)<div class="score-bar">/);
    
    if (quizMatch) {
        const challengeBlock = quizMatch[1];
        let newBody = body.replace(challengeBlock, `
        <div style="margin: 3rem 0; text-align: center;">
            <a href="quiz_topic2.html" style="background: var(--accent2); color: #fff; padding: 1rem 2rem; border-radius: 8px; font-weight: 700; text-decoration: none; font-family: 'Outfit', sans-serif; display: inline-block; box-shadow: 3px 3px 0 #1a252f; transition: all 0.2s;">Take Topic 2 Quiz →</a>
        </div>
        `);
        
        newBody = newBody.replace(/alert\('Nice work!.*?Topic 3 →.*?<\/button>/s, "window.location.href='index.html'\">Complete Module →</button>");
        
        const topic2Html = `${pre}\n${sidebarHTML}\n<main class="main-content" style="background: var(--bg); color: var(--text); padding-top: 1rem;">\n${newBody}\n</main>\n${post}`;
        fs.writeFileSync(path.join(folder, newName), topic2Html);
        
        const quizBody = `
        <div class="container" style="padding-top: 1rem;">
            <header>
                <div class="course-tag" style="display:inline-block; font-family:'IBM Plex Mono'; color:var(--accent); font-size:0.75rem; letter-spacing:3px; text-transform:uppercase; margin-bottom:0.8rem;">CSC 2111 · ASSESSMENT</div>
                <h1>Topic 2 <span>Knowledge Check</span></h1>
                <p style="font-family:'IBM Plex Mono'; color:var(--muted); font-size:0.8rem; margin-top:0.5rem;">// verify your understanding of Moore's law and CPI</p>
            </header>
            ${challengeBlock}
            <div class="score-bar" style="display:flex; justify-content:space-between; align-items:center; background:var(--surface); border-radius:10px; padding:1rem 1.5rem; margin:2rem 0; border:1px solid var(--border);">
                <span style="font-family:'IBM Plex Mono'; font-size:0.85rem; color:var(--muted);">Assessment Complete</span>
                <strong id="scoreDisplay" style="color:var(--accent2); font-size:1.1rem;">Score: 0 / 4</strong>
                <button class="next-btn" style="background:var(--accent2); color:#fff; font-family:'Outfit'; font-weight:700; font-size:1rem; padding:0.9rem 2.2rem; border:none; border-radius:8px; cursor:pointer; box-shadow:3px 3px 0 #1a252f;" onclick="window.location.href='index.html'">Finish</button>
            </div>
        </div>
        `;
        const quizHtml = `${pre}\n${sidebarHTML}\n<main class="main-content" style="background: var(--bg); color: var(--text); padding-top: 1rem;">\n${quizBody}\n</main>\n${post}`;
        fs.writeFileSync(path.join(folder, 'quiz_topic2.html'), quizHtml);
    }
});

// Terminology
processHtmlFile('csc2111_terminology.html', 'terminology.html', (pre, body, post, newName) => {
    // just wrap
    const termHtml = `${pre}\n${sidebarHTML}\n<main class="main-content" style="background: var(--bg); color: var(--text); padding-top: 1rem;">\n${body}\n</main>\n${post}`;
    fs.writeFileSync(path.join(folder, newName), termHtml);
});

console.log("Files processed successfully");
