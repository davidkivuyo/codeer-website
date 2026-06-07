/* ==========================================================================
   CODEER INTERACTIVE WEBSITE ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initModal();
  initEditorMockup();
  initSmoothScroll();
  initThemeToggle();
});

/**
 * 1. Header scroll effect
 */
function initHeader() {
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/**
 * 2. Download Modal handling
 */
function initModal() {
  const openButtons = document.querySelectorAll('.js-open-download');
  const closeButton = document.querySelector('.js-close-modal');
  const modalOverlay = document.querySelector('.js-modal-overlay');

  if (!modalOverlay) return;

  const openModal = (e) => {
    e.preventDefault();
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  openButtons.forEach(btn => btn.addEventListener('click', openModal));
  if (closeButton) closeButton.addEventListener('click', closeModal);

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  // Handle ESC key to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

  // Simulate mock file download when selecting an OS installer
  const downloadBtns = document.querySelectorAll('.download-option-btn');
  downloadBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const os = btn.querySelector('.option-name').textContent;
      btn.style.borderColor = '#f97316';
      
      const originalText = btn.querySelector('.option-meta').textContent;
      const metaEl = btn.querySelector('.option-meta');
      metaEl.textContent = '🚀 Preparing package...';
      metaEl.style.color = '#f97316';

      setTimeout(() => {
        metaEl.textContent = '📥 Downloading Codeer Installer...';
        metaEl.style.color = '#34d399';
        
        // Setup a mock download anchor trigger
        setTimeout(() => {
          metaEl.textContent = originalText;
          metaEl.style.color = '';
          btn.style.borderColor = '';
          closeModal();
          alert(`🌿 Starting Codeer download for ${os}!\nThank you for choosing Codeer.`);
        }, 1500);
      }, 1000);
    });
  });
}

/**
 * 3. Interactive Code Editor Mockup logic
 */
function initEditorMockup() {
  const codeArea = document.querySelector('.js-code-content');
  const lineNumbers = document.querySelector('.js-line-numbers');
  const fileItems = document.querySelectorAll('.js-file-item');
  const tabItems = document.querySelectorAll('.js-tab-item');
  const themeDropdown = document.querySelector('.js-theme-dropdown');
  const editorFrame = document.querySelector('.js-editor-frame');
  const btnRun = document.querySelector('.js-btn-run');
  const terminalBody = document.querySelector('.js-terminal-body');

  if (!codeArea) return;

  // File Code Content Store with pre-formatted syntax highlighting HTML
  const files = {
    'index.js': {
      lines: 15,
      content: `<span class="comment">// Welcome to Codeer - The Premium VS Code Fork</span>
<span class="keyword">import</span> { <span class="class">Codeer</span>, <span class="variable">Theme</span> } <span class="keyword">from</span> <span class="string">'codeer-core'</span>;

<span class="keyword">const</span> <span class="variable">editor</span> = <span class="keyword">new</span> <span class="class">Codeer</span>({
  theme: <span class="variable">Theme</span>.<span class="function">ForestDark</span>,
  extensions: [<span class="string">'copilot'</span>, <span class="string">'git-lens'</span>],
  performance: <span class="string">'blazing-fast'</span>
});

<span class="comment">// Codeer runs all your favorite VS Code extensions</span>
<span class="variable">editor</span>.<span class="function">on</span>(<span class="string">'load'</span>, () =&gt; {
  <span class="variable">console</span>.<span class="function">log</span>(<span class="string">'🌿 Codeer is ready. Happy coding!'</span>);
});

<span class="variable">editor</span>.<span class="function">run</span>();`
    },
    'styles.css': {
      lines: 12,
      content: `<span class="comment">/* Codeer Nature-inspired Theme */</span>
<span class="class">:root</span> {
  <span class="keyword">--primary</span>: <span class="string">#10b981</span>;
  <span class="keyword">--bg-editor</span>: <span class="string">#0c1512</span>;
  <span class="keyword">--text-color</span>: <span class="string">#e2e8f0</span>;
  <span class="keyword">--glow</span>: <span class="number">0</span> <span class="number">0</span> <span class="number">20px</span> <span class="function">rgba</span>(<span class="number">16</span>, <span class="number">185</span>, <span class="number">129</span>, <span class="number">0.3</span>);
}

<span class="class">.codeer-window</span> {
  <span class="keyword">border-radius</span>: <span class="number">12px</span>;
  <span class="keyword">background</span>: <span class="function">var</span>(<span class="variable">--bg-editor</span>);
  <span class="keyword">box-shadow</span>: <span class="function">var</span>(<span class="variable">--glow</span>);
}`
    },
    'features.md': {
      lines: 8,
      content: `<span class="keyword"># Codeer Features</span>

- 🌿 <span class="class">**VS Code Core**</span>: 100% compatible with VS Code APIs.
- ⚡ <span class="class">**Eco-Mode**</span>: Uses 40% less memory than standard VS Code.
- 🎨 <span class="class">**Forest Themes**</span>: Pre-installed dark nature themes.
- 📦 <span class="class">**One-Click Sync**</span>: Sync settings across devices via GitHub.`
    }
  };

  // Helper to change current open file code
  const selectFile = (fileName) => {
    if (!files[fileName]) return;

    // Update Explorer list UI
    fileItems.forEach(item => {
      if (item.dataset.file === fileName) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Update Tabs UI
    tabItems.forEach(tab => {
      if (tab.dataset.file === fileName) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    // Update Code Area HTML
    codeArea.innerHTML = files[fileName].content;

    // Generate Line Numbers
    let lineNumbersHtml = '';
    for (let i = 1; i <= files[fileName].lines; i++) {
      lineNumbersHtml += `<div>${i}</div>`;
    }
    lineNumbers.innerHTML = lineNumbersHtml;
  };

  // File explorer event listeners
  fileItems.forEach(item => {
    item.addEventListener('click', () => selectFile(item.dataset.file));
  });

  // Tab event listeners
  tabItems.forEach(tab => {
    tab.addEventListener('click', () => selectFile(tab.dataset.file));
  });

  // Theme changer dropdown
  if (themeDropdown && editorFrame) {
    themeDropdown.addEventListener('change', (e) => {
      const selectedTheme = e.target.value;
      
      // Remove all theme modifier classes
      editorFrame.classList.remove('theme-forest', 'theme-emerald', 'theme-velvet', 'theme-leaf-light');
      
      // Add selected theme class
      editorFrame.classList.add(`theme-${selectedTheme}`);
    });
  }

  // Simulated code execution (Run Code Button)
  if (btnRun && terminalBody) {
    btnRun.addEventListener('click', () => {
      // Clear terminal
      terminalBody.innerHTML = '';
      btnRun.disabled = true;
      btnRun.textContent = '⚡ Running...';

      // Simulated terminal logs
      const logLines = [
        { text: '$ node index.js', type: 'cmd' },
        { text: '[info] Booting Codeer runtime environment...', type: 'muted' },
        { text: '[info] Mounting VS Code core kernel API...', type: 'muted' },
        { text: '[info] Eco-mode check: Memory optimized (Saved 42.4MB RAM)', type: 'muted' },
        { text: '🌿 Codeer is ready. Happy coding!', type: 'success' }
      ];

      let currentLineIndex = 0;

      const printNextLine = () => {
        if (currentLineIndex < logLines.length) {
          const lineData = logLines[currentLineIndex];
          const lineDiv = document.createElement('div');
          lineDiv.className = `terminal-line ${lineData.type}`;
          lineDiv.textContent = lineData.text;
          
          terminalBody.appendChild(lineDiv);
          terminalBody.scrollTop = terminalBody.scrollHeight;
          
          currentLineIndex++;
          setTimeout(printNextLine, 350); // Speed of logs printing
        } else {
          btnRun.disabled = false;
          btnRun.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:12px;height:12px;transform:rotate(90deg);"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg> Run`;
        }
      };

      // Trigger animation after brief delay
      setTimeout(printNextLine, 200);
    });
  }
}

/**
 * 4. Nav item smooth scrolling helper
 */
function initSmoothScroll() {
  const anchors = document.querySelectorAll('a[href^="#"]');
  anchors.forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        window.scrollTo({
          top: targetEl.offsetTop - 80, // Offset for sticky header
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * 5. Theme toggle functionality (Dark/Light mode)
 */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  // Check saved theme or system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Set default theme state
  const currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', currentTheme);

  toggleBtn.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
}


// OS-detect funtionality
let osFile = document.getElementById("os");
if(navigator.userAgent.indexOf("Linux")!==-1){
  osFile.innerHTML= "Download for Linux";
  osFile.href = "https://github.com/davidkivuyo/codeer/releases/download/v1.0.1/Codeer-v1.0.1-linux-x64.tar.gz";

}else if(navigator.userAgent.indexOf("Win")!==-1){
  osFile.innerHTML= "Download for Windows";
  osFile.href = "https://github.com/davidkivuyo/codeer/releases/download/v1.0.1/Codeer-v1.0.1-linux-x64.tar.gz";
  
}else{
   osFile.innerHTML= "Requires windows or linux OS";
}