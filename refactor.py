import re
import os

folder = r"c:\Users\nicholas\Desktop\School\Computer Architecture\Website"
sidebar_html = """
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
"""

def split_html(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Add link to styles.css in head
    content = content.replace("</head>", '  <link rel="stylesheet" href="styles.css">\n</head>')
    
    # Wrap body in main-content and add sidebar
    # Find <body> tag
    body_start = content.find("<body>")
    if body_start == -1:
        # try with attributes
        body_str = re.search(r'<body[^>]*>', content).group()
        body_start = content.find(body_str)
        body_end_tag = body_start + len(body_str)
    else:
        body_end_tag = body_start + 6
        
    body_end = content.rfind("</body>")
    
    pre_body = content[:body_end_tag]
    body_content = content[body_end_tag:body_end]
    post_body = content[body_end:]
    
    return pre_body, body_content, post_body

def process_topic1():
    file_path = os.path.join(folder, "topic1_computer_structure (1).html")
    pre, body, post = split_html(file_path)
    
    # Extract challenge section
    # the section starts with <div class="challenge-section">
    # and ends after its matching </div>
    # Using regex to find the block (it has specific content)
    match = re.search(r'(<div class="challenge-section">.*?</div>\s*<!-- NAV -->)', body, re.DOTALL)
    if not match:
        match = re.search(r'(<!-- CHALLENGE QUIZ -->.*?</div>\s*<!-- NAV -->)', body, re.DOTALL)
    
    if match:
        challenge_block = match.group(0)
        # remove from main body
        body = body.replace(challenge_block, """
        <div style="margin: 3rem 0; text-align: center;">
            <a href="quiz_topic1.html" style="background: var(--accent); color: #000; padding: 1rem 2rem; border-radius: 50px; font-weight: 700; text-decoration: none; font-family: 'Syne', sans-serif; display: inline-block;">Take Topic 1 Quiz →</a>
        </div>
        <!-- NAV -->
        """)
        
        # update NAV in body
        body = body.replace("alert('Great work! 🎉 Ask me to continue to Topic 2: Computer Evolution & Performance!')", "window.location.href='topic2.html'")
        
        # Create topic1.html
        topic1_html = pre + "\n" + sidebar_html + '\n<main class="main-content" style="background: var(--bg); color: var(--text);">\n' + body + '\n</main>\n' + post
        with open(os.path.join(folder, "topic1.html"), "w", encoding="utf-8") as f:
            f.write(topic1_html)
            
        # Create quiz_topic1.html
        # Extract script that manages quiz
        scripts_match = re.search(r'(<script>.*?</script>)', post, re.DOTALL)
        script_content = scripts_match.group(1) if scripts_match else ""
        
        quiz_body = f"""
        <div class="container">
            <header>
                <div class="course-tag">CSC 2111 · ASSESSMENT</div>
                <h1>Topic 1 <span>Knowledge Check</span></h1>
                <p>// test your understanding</p>
            </header>
            {challenge_block}
        </div>
        """
        quiz_html = pre + "\n" + sidebar_html + '\n<main class="main-content" style="background: var(--bg); color: var(--text);">\n' + quiz_body + '\n</main>\n' + post
        with open(os.path.join(folder, "quiz_topic1.html"), "w", encoding="utf-8") as f:
            f.write(quiz_html)

def process_topic2():
    file_path = os.path.join(folder, "topic2_evolution_performance.html")
    pre, body, post = split_html(file_path)
    
    match = re.search(r'(<!-- QUIZ -->.*?</div>\s*</div>\s*<div class="score-bar">.*?</button>\s*</div>)', body, re.DOTALL)
    
    if match:
        challenge_block = match.group(0)
        body = body.replace(challenge_block, """
        <div style="margin: 3rem 0; text-align: center;">
            <a href="quiz_topic2.html" style="background: var(--accent2); color: #fff; padding: 1rem 2rem; border-radius: 8px; font-weight: 700; text-decoration: none; font-family: 'Outfit', sans-serif; display: inline-block;">Take Topic 2 Quiz →</a>
        </div>
        """)
        
        # Create topic2.html
        topic2_html = pre + "\n" + sidebar_html + '\n<main class="main-content" style="background: var(--bg); color: var(--text);">\n' + body + '\n</main>\n' + post
        with open(os.path.join(folder, "topic2.html"), "w", encoding="utf-8") as f:
            f.write(topic2_html)
            
        # Create quiz_topic2.html
        quiz_body = f"""
        <div class="container">
            <header>
                <span class="course-tag">CSC 2111 · ASSESSMENT</span>
                <h1>Topic 2 <span>Knowledge Check</span></h1>
                <p>// check your understanding</p>
            </header>
            {challenge_block.replace("alert('Nice work! 🎉\\n\\nNext up: Topic 3 — Computer Function & Interconnection.\\nAsk me to continue when ready!')", "window.location.href='index.html'")}
        </div>
        """
        quiz_html = pre + "\n" + sidebar_html + '\n<main class="main-content" style="background: var(--bg); color: var(--text);">\n' + quiz_body + '\n</main>\n' + post
        with open(os.path.join(folder, "quiz_topic2.html"), "w", encoding="utf-8") as f:
            f.write(quiz_html)


def process_terminology():
    file_path = os.path.join(folder, "csc2111_terminology.html")
    pre, body, post = split_html(file_path)
    
    term_html = pre + "\n" + sidebar_html + '\n<main class="main-content" style="background: var(--bg); color: var(--text);">\n' + body + '\n</main>\n' + post
    with open(os.path.join(folder, "terminology.html"), "w", encoding="utf-8") as f:
        f.write(term_html)

process_topic1()
print("Processed topic 1")
process_topic2()
print("Processed topic 2")
process_terminology()
print("Processed terminology")
