console.log('main.js loaded');
const llmInput = document.getElementById('llm-chat-input');
const llmSend = document.getElementById('llm-chat-send');
const llmMessages = document.getElementById('llm-chat-messages');

// Sidebar logic

document.addEventListener('DOMContentLoaded', function()  {
    const menuOpenIcon = document.querySelector('.menu-bar-icon.menu-open');
    const menuCloseIcon = document.querySelector('.menu-bar-icon.menu-close');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    if (sidebarOverlay) {
        sidebarOverlay.style.display = 'none';
        sidebarOverlay.classList.remove('active');
    }
    // Sidebar open handler
    if (menuOpenIcon && sidebar) {
        menuOpenIcon.addEventListener('click', function() {
            sidebar.classList.add('sidebar-open');
            sidebar.classList.remove('sidebar-closed');
            sidebar.style.right = '0';
            sidebar.style.left = '';
            if (sidebarOverlay) sidebarOverlay.style.display = 'block';
            menuOpenIcon.style.display = 'none';
            menuCloseIcon.style.display = 'inline-block';
        });
    }
    // Sidebar close handler
    if (menuCloseIcon && sidebar) {
        menuCloseIcon.addEventListener('click', function() {
            sidebar.classList.remove('sidebar-open');
            sidebar.classList.add('sidebar-closed');
            sidebar.style.right = '';
            if (sidebarOverlay) sidebarOverlay.style.display = 'none';
            menuOpenIcon.style.display = 'inline-block';
            menuCloseIcon.style.display = 'none';
        });
    }
    // Sidebar Sign Up button logic
    const sidebarSignupBtn = document.querySelector('.sidebar-btn .sidebar-link');
    if (sidebarSignupBtn) {
        sidebarSignupBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Hide all main sections
            document.querySelector('.home-main').style.display = 'none';
            document.getElementById('try-now-page').style.display = 'none';
            document.getElementById('sochat-info-page').style.display = 'none';
            document.getElementById('api-platform-page').style.display = 'none';
            document.getElementById('business-page').style.display = 'none';
            document.getElementById('models-page').style.display = 'none';
            document.getElementById('llm-chat-page').style.display = 'none';
            document.getElementById('signup-page').style.display = 'block';
            document.getElementById('try-searchbar-container').style.display = 'none';
            document.querySelector('.main-footer').style.display = 'none';
            // Close sidebar if open
            if (typeof closeSidebar === 'function') closeSidebar();
        });
    }
    // Login/Signup form toggle logic
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const loginBtn = document.getElementById('login-btn');
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    const formSignupBtn = document.getElementById('signup-btn');
    const signupEmail = document.getElementById('signup-email');
    const signupPassword = document.getElementById('signup-password');
    const signupConfirm = document.getElementById('signup-confirm-password');
    // Add a message div for feedback
    let msgDiv = document.getElementById('login-msg');
    if (!msgDiv) {
        msgDiv = document.createElement('div');
        msgDiv.id = 'login-msg';
        msgDiv.style = 'margin-top:1rem; text-align:center; font-size:1.03rem;';
        loginForm.parentNode.insertBefore(msgDiv, loginForm.nextSibling);
    }
    function showMsg(text, color) {
        msgDiv.textContent = text;
        msgDiv.style.color = color;
    }
    // Toggle between login and signup forms
    function showLoginForm() {
        loginForm.style.display = 'flex';
        signupForm.style.display = 'none';
        showMsg('', '');
        const heading = document.getElementById('signup-login-heading');
        if (heading) heading.textContent = 'Login';
        if (sidebarOverlay) {
            sidebarOverlay.style.display = 'none';
            sidebarOverlay.classList.remove('active');
        }
        // Also ensure signup-page section is above overlay
        document.getElementById('signup-page').style.zIndex = 1050;
    }
    function showSignupForm() {
        loginForm.style.display = 'none';
        signupForm.style.display = 'flex';
        showMsg('', '');
        const heading = document.getElementById('signup-login-heading');
        if (heading) heading.textContent = 'Sign Up';
        if (sidebarOverlay) {
            sidebarOverlay.style.display = 'none';
            sidebarOverlay.classList.remove('active');
        }
        // Also ensure signup-page section is above overlay
        document.getElementById('signup-page').style.zIndex = 1050;
    }
    document.getElementById('show-signup-form').addEventListener('click', function(e) {
        if (sidebarOverlay) {
            sidebarOverlay.style.display = 'none';
            sidebarOverlay.classList.remove('active');
            sidebarOverlay.style.pointerEvents = 'none'; 
            sidebarOverlay.style.zIndex = '-1'; 
        }
        e.preventDefault();
        showSignupForm();
    });
    document.getElementById('show-login-form').addEventListener('click', function(e) {
        if (sidebarOverlay) {
            sidebarOverlay.style.display = 'none';
            sidebarOverlay.classList.remove('active');
            sidebarOverlay.style.pointerEvents = 'none'; 
            sidebarOverlay.style.zIndex = '-1'; 
        }
        e.preventDefault();
        showLoginForm();
    });
    showLoginForm(); // default
    // Login form logic
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (!emailInput.value || !passwordInput.value) {
                showMsg('Please enter email and password.', '#b71c1c');
                return;
            }
            fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailInput.value, password: passwordInput.value })
            })
            .then(res => res.json().then(data => ({status: res.status, ...data})))
            .then(data => {
                if (data.success) {
                    // Hide signup/login, show chat page
                    document.getElementById('signup-page').style.display = 'none';
                    document.getElementById('llm-chat-page').style.display = 'block';
                    // Hide footer after login
                    const mainFooter = document.querySelector('.main-footer');
                    if (mainFooter) mainFooter.style.display = 'none';
                    // Hide header after login
                    const mainHeader = document.querySelector('.main-header');
                    if (mainHeader) mainHeader.style.display = 'none';
                    // Hide sidebar overlay after login
                    const sidebarOverlay = document.getElementById('sidebar-overlay');
                    if (sidebarOverlay) {
                        sidebarOverlay.style.display = 'none';
                        sidebarOverlay.classList.remove('active');
                        sidebarOverlay.style.pointerEvents = 'none';
                        sidebarOverlay.style.zIndex = '-1';
                    }
                    // Hide the search bar after login
                    const trySearchbarContainer = document.getElementById('try-searchbar-container');
                    if (trySearchbarContainer) trySearchbarContainer.style.display = 'none';
                    // Show logout button after login
                    const logoutBtnShow = document.getElementById('llm-logout-btn');
                    if (logoutBtnShow) logoutBtnShow.style.display = 'inline-block';
                    setTimeout(() => {
                        document.getElementById('llm-chat-input').focus();
                    }, 100);
                    document.getElementById('sidebar').style.display = 'none';
                    // Focus chat input
                    setTimeout(() => {
                        const chatInput = document.getElementById('llm-chat-input');
                        if (chatInput) chatInput.focus();
                    }, 100);
                    // Add log out button handlers
                    const logoutBtn = document.getElementById('llm-logout-btn');
                    if (logoutBtn) {
                        logoutBtn.onclick = function() {
    document.getElementById('llm-chat-page').style.display = 'none';
    showHomePage();
    window.location.hash = '#home';
    // Restore footer and menu icon (redundant, but ensures visibility)
    const mainFooter = document.querySelector('.main-footer');
    if (mainFooter) mainFooter.style.display = '';
    const menuOpenIcon = document.querySelector('.menu-bar-icon.menu-open');
    if (menuOpenIcon) menuOpenIcon.style.display = 'inline-block';
};

                } else {
                    showMsg(data.message || 'Error', '#b71c1c');
                }
            }
            })
            .catch(() => showMsg('Network error.', '#b71c1c'));
        });
    }
    // Signup form logic
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (!signupEmail.value || !signupPassword.value || !signupConfirm.value) {
                showMsg('Please fill in all fields.', '#b71c1c');
                return;
            }
            if (signupPassword.value !== signupConfirm.value) {
                showMsg('Passwords do not match.', '#b71c1c');
                return;
            }
            fetch('/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: signupEmail.value, password: signupPassword.value })
            })
            .then(res => res.json().then(data => ({status: res.status, ...data})))
            .then(data => {
                if (data.success) {
                    showMsg(data.message + ' Please login.', '#1976d2');
                    showLoginForm();
                } else {
                    showMsg(data.message || 'Error', '#b71c1c');
                }
            })
            .catch(() => showMsg('Network error.', '#b71c1c'));
        });
    }


    
    // Chat send button logic
    const llmSend = document.getElementById('llm-chat-send');
    const llmInput = document.getElementById('llm-chat-input');
    const llmMessages = document.getElementById('llm-chat-messages');
    if (llmSend && llmInput && llmMessages) {
    llmSend.onclick = async function() {
        const text = llmInput.value.trim();
        if (!text) return;
        // Create message pair container styled like Try Now
        const pairDiv = document.createElement('div');
        pairDiv.className = 'try-msg-pair';
        // User message
        const userDiv = document.createElement('div');
        userDiv.className = 'try-msg-container user';
        userDiv.innerHTML = `
          <div class="try-msg-label user-label">You</div>
          <div class="try-msg-bubble user"><span>${escapeHTML(text)}</span></div>
          <button class="try-copy-btn" title="Copy">📄</button>
        `;
        userDiv.querySelector('.try-copy-btn').onclick = () => {
            navigator.clipboard.writeText(text);
        };
        // AI message
        const aiDiv = document.createElement('div');
        aiDiv.className = 'try-msg-container ai';
        aiDiv.innerHTML = `
          <div class="try-msg-label ai-label">SoChat</div>
          <div class="try-msg-bubble ai"><em>Thinking...</em></div>
          <button class="try-copy-btn" title="Copy">📄</button>
        `;
        aiDiv.querySelector('.try-copy-btn').onclick = () => {
            navigator.clipboard.writeText('Thinking...');
        };
        pairDiv.appendChild(userDiv);
        pairDiv.appendChild(aiDiv);
        llmMessages.appendChild(pairDiv);
        llmInput.value = '';
        llmMessages.scrollTop = llmMessages.scrollHeight;
        // Send to backend
        const res = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });
        const data = await res.json();
        // Update AI message with markdown
        aiDiv.querySelector('.try-msg-bubble').innerHTML = marked.parse(data.reply);
        aiDiv.querySelector('.try-copy-btn').onclick = () => {
            // Copy plain text only
            const temp = document.createElement('div');
            temp.innerHTML = marked.parse(data.reply);
            navigator.clipboard.writeText(temp.textContent || temp.innerText || '');
        };
        llmMessages.scrollTop = llmMessages.scrollHeight;
    };
    llmInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') llmSend.onclick();
    });
    // Centered search bar send logic
    llmSend.onclick = function() {
    // Hide center search, show chat messages (footer stays hidden)
    const centerBar = document.getElementById('llm-searchbar-center');
    if (centerBar) centerBar.style.display = 'display';
    llmMessages.style.display = '';
    // Ensure footer stays hidden during chat
    const mainFooter = document.querySelector('.main-footer');
    if (mainFooter) mainFooter.style.display = 'none';
    sendLLMMessage();
    setTimeout(() => { llmInput && llmInput.focus(); }, 100);
};
    llmInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') llmSend.onclick();
    });
}
        function sendLLMMessage() {
    const text = llmInput.value.trim();
    if (!text) return;
    // Save to history (localStorage)
    let history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    history.push({ text, timestamp: Date.now() });
    localStorage.setItem('searchHistory', JSON.stringify(history));
    // Display user message
    const userDiv = document.createElement('div');
    userDiv.className = 'llm-msg user';
    userDiv.textContent = text;
    llmMessages.appendChild(userDiv);
    llmInput.value = '';
    // Display placeholder AI response while waiting for backend
    const aiDiv = document.createElement('div');
    aiDiv.className = 'llm-msg ai';
    aiDiv.innerHTML = '<em>Thinking...</em>';
    llmMessages.appendChild(aiDiv);
    llmMessages.scrollTop = llmMessages.scrollHeight;
    // Send to backend for real response
    fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
    })
    .then(res => res.json())
    .then(data => {
        aiDiv.innerHTML = `<span>${data.reply}</span>`;
        // Add copy-to-clipboard for AI message
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-btn';
        copyBtn.title = 'Copy';
        copyBtn.textContent = '📄';
        copyBtn.onclick = () => {
            const temp = document.createElement('div');
            temp.innerHTML = data.reply;
            navigator.clipboard.writeText(temp.textContent || temp.innerText || '');
        };
        aiDiv.appendChild(copyBtn);
    })
    .catch(err => {
        aiDiv.innerHTML = '<span style="color:#b71c1c">Error: Failed to get AI response.</span>';
    });
}
        llmSend.addEventListener('click', sendLLMMessage);
        llmInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') sendLLMMessage();
        });

document.addEventListener("DOMContentLoaded", function() {
  const groqLink = document.getElementById("groq-api-key-link");
  if (groqLink) {
    groqLink.addEventListener("click", function(e) {
      console.log('Groq API Key link clicked');
      e.stopPropagation();
      window.open("https://console.groq.com/keys", "_blank");
    });
  }
});


// Try Now button logic
const tryNowBtn = document.querySelector('.try-now-btn');
const inputRow = document.getElementById('input-row');
const chatbox = document.querySelector('.chatbox');
if (tryNowBtn) {
    const showTryNowPage = function() {
        document.querySelector('.home-main').style.display = 'none';
        document.getElementById('try-now-page').style.display = 'block';
        document.getElementById('try-searchbar-container').style.display = 'flex';
        document.getElementById('sochat-info-page').style.display = 'none';
        document.querySelector('.main-footer').style.display = 'none';
        // Hide sidebar overlay
        const sidebarOverlay = document.getElementById('sidebar-overlay');
        if (sidebarOverlay) sidebarOverlay.classList.remove('active');

        setTimeout(() => {
            document.getElementById('try-searchbar').focus();
        }, 100);
    };
    tryNowBtn.addEventListener('click', showTryNowPage);
    // Sidebar 'New Chat' link
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    if (sidebarLinks.length > 0) {
        // New Chat (first link)
        sidebarLinks[0].addEventListener('click', function(e) {
            e.preventDefault();
            showTryNowPage();

            history.pushState({page: 'home'}, '', '#home');
            closeSidebar();
        });
        // SoChat info (second link)
        sidebarLinks[1].addEventListener('click', function(e) {
            e.preventDefault();
            // Hide all main sections
            document.querySelector('.home-main').style.display = 'none';
            document.getElementById('try-now-page').style.display = 'none';
            document.getElementById('sochat-info-page').style.display = 'block';
            document.getElementById('api-platform-page').style.display = 'none';
            document.getElementById('business-page').style.display = 'none';
            document.getElementById('models-page').style.display = 'none';
            document.getElementById('try-searchbar-container').style.display = 'none';
            document.querySelector('.main-footer').style.display = 'none';
            history.pushState({page: 'about'}, '', '#about');
            closeSidebar();
        });
        // API Platform (third link)
        sidebarLinks[2].addEventListener('click', function(e) {
            e.preventDefault();
            // Hide all main sections
            document.querySelector('.home-main').style.display = 'none';
            document.getElementById('try-now-page').style.display = 'none';
            document.getElementById('sochat-info-page').style.display = 'none';
            document.getElementById('api-platform-page').style.display = 'block';
            document.getElementById('business-page').style.display = 'none';
            document.getElementById('models-page').style.display = 'none';
            document.getElementById('try-searchbar-container').style.display = 'none';
            document.querySelector('.main-footer').style.display = 'none';
            history.pushState({page: 'api'}, '', '#api');
            closeSidebar();
        });
        // For Business (fourth link)
        sidebarLinks[3].addEventListener('click', function(e) {
            e.preventDefault();
            // Hide all main sections
            document.querySelector('.home-main').style.display = 'none';
            document.getElementById('try-now-page').style.display = 'none';
            document.getElementById('sochat-info-page').style.display = 'none';
            document.getElementById('api-platform-page').style.display = 'none';
            document.getElementById('business-page').style.display = 'block';
            document.getElementById('models-page').style.display = 'none';
            document.getElementById('try-searchbar-container').style.display = 'none';
            document.querySelector('.main-footer').style.display = 'none';
            history.pushState({page: 'business'}, '', '#business');
            closeSidebar();
        });
        // Select Models (fifth link)
        sidebarLinks[4].addEventListener('click', function(e) {
            e.preventDefault();
            // Hide all main sections
            document.querySelector('.home-main').style.display = 'none';
            document.getElementById('try-now-page').style.display = 'none';
            document.getElementById('sochat-info-page').style.display = 'none';
            document.getElementById('api-platform-page').style.display = 'none';
            document.getElementById('business-page').style.display = 'none';
            document.getElementById('models-page').style.display = 'block';
            document.getElementById('try-searchbar-container').style.display = 'none';
            document.querySelector('.main-footer').style.display = 'none';
            history.pushState({page: 'models'}, '', '#models');
            closeSidebar();
        });
        // Utility to close sidebar
        function closeSidebar() {
            const sidebar = document.getElementById('sidebar');
            if (sidebar) {
                sidebar.classList.remove('sidebar-open');
                sidebar.classList.add('sidebar-closed');
                sidebar.style.left = '';
            }
        }
    }
}
// If you add a way to return to home, show the footer again:
// document.querySelector('.main-footer').style.display = '';
// document.querySelector('.home-main').style.display = '';
// document.getElementById('try-now-page').style.display = 'none';
// document.getElementById('sochat-info-page').style.display = 'none';
// document.getElementById('try-searchbar-container').style.display = 'none';

// Home navigation logic
function showHomePage() {
    // Hide back arrow on home
    const backArrowBtn = document.getElementById('back-arrow-btn');
    if (backArrowBtn) backArrowBtn.style.display = 'none';
    document.querySelector('.home-main').style.display = '';
    document.getElementById('try-now-page').style.display = 'none';
    document.getElementById('sochat-info-page').style.display = 'none';
    document.getElementById('api-platform-page').style.display = 'none';
    document.getElementById('business-page').style.display = 'none';
    document.getElementById('models-page').style.display = 'none';
    document.getElementById('try-searchbar-container').style.display = 'none';
    document.querySelector('.main-footer').style.display = '';
    // Header: show logo, name, and menu icon only
    const mainHeader = document.querySelector('.main-header');
    if (mainHeader) {
        Array.from(mainHeader.children).forEach(child => {
            if (
                (child.classList.contains('menu-bar-icon') && child.classList.contains('menu-open')) ||
                child.classList.contains('header-icon') ||
                child.classList.contains('header-title')
            ) {
                child.style.display = '';
            } else {
                child.style.display = 'none';
            }
        });
    }
    // Hide and clear chat containers to prevent chat content from showing on home
    const llmChatPage = document.getElementById('llm-chat-page');
    if (llmChatPage) llmChatPage.style.display = 'none';
    const llmChatMessages = document.getElementById('llm-chat-messages');
    if (llmChatMessages) llmChatMessages.innerHTML = '';
    const tryMessages = document.getElementById('try-messages');
    if (tryMessages) tryMessages.innerHTML = '';
}

// Handle browser back/forward navigation
window.addEventListener('popstate', function(event) {
    const hash = window.location.hash;
    if (hash === '#home' || hash === '') {
        showHomePage();
    } else if (hash === '#about') {
        document.querySelector('.home-main').style.display = 'none';
        document.getElementById('try-now-page').style.display = 'none';
        document.getElementById('sochat-info-page').style.display = 'block';
        document.getElementById('api-platform-page').style.display = 'none';
        document.getElementById('business-page').style.display = 'none';
        document.getElementById('models-page').style.display = 'none';
        document.getElementById('try-searchbar-container').style.display = 'none';
        document.querySelector('.main-footer').style.display = 'none';
    } else if (hash === '#api') {
        document.querySelector('.home-main').style.display = 'none';
        document.getElementById('try-now-page').style.display = 'none';
        document.getElementById('sochat-info-page').style.display = 'none';
        document.getElementById('api-platform-page').style.display = 'block';
        document.getElementById('business-page').style.display = 'none';
        document.getElementById('models-page').style.display = 'none';
        document.getElementById('try-searchbar-container').style.display = 'none';
        document.querySelector('.main-footer').style.display = 'none';
    } else if (hash === '#business') {
        document.querySelector('.home-main').style.display = 'none';
        document.getElementById('try-now-page').style.display = 'none';
        document.getElementById('sochat-info-page').style.display = 'none';
        document.getElementById('api-platform-page').style.display = 'none';
        document.getElementById('business-page').style.display = 'block';
        document.getElementById('models-page').style.display = 'none';
        document.getElementById('try-searchbar-container').style.display = 'none';
        document.querySelector('.main-footer').style.display = 'none';
    } else if (hash === '#models') {
        document.querySelector('.home-main').style.display = 'none';
        document.getElementById('try-now-page').style.display = 'none';
        document.getElementById('sochat-info-page').style.display = 'none';
        document.getElementById('api-platform-page').style.display = 'none';
        document.getElementById('business-page').style.display = 'none';
        document.getElementById('models-page').style.display = 'block';
        document.getElementById('try-searchbar-container').style.display = 'none';
        document.querySelector('.main-footer').style.display = 'none';
    }
});

// On initial load, show the correct section based on hash
window.addEventListener('DOMContentLoaded', function() {
    const hash = window.location.hash;
    if (hash === '#about') {
        document.querySelector('.home-main').style.display = 'none';
        document.getElementById('try-now-page').style.display = 'none';
        document.getElementById('sochat-info-page').style.display = 'block';
        document.getElementById('api-platform-page').style.display = 'none';
        document.getElementById('business-page').style.display = 'none';
        document.getElementById('models-page').style.display = 'none';
        document.getElementById('try-searchbar-container').style.display = 'none';
        document.querySelector('.main-footer').style.display = 'none';
    } else if (hash === '#api') {
        document.querySelector('.home-main').style.display = 'none';
        document.getElementById('try-now-page').style.display = 'none';
        document.getElementById('sochat-info-page').style.display = 'none';
        document.getElementById('api-platform-page').style.display = 'block';
        document.getElementById('business-page').style.display = 'none';
        document.getElementById('models-page').style.display = 'none';
        document.getElementById('try-searchbar-container').style.display = 'none';
        document.querySelector('.main-footer').style.display = 'none';
    } else if (hash === '#business') {
        document.querySelector('.home-main').style.display = 'none';
        document.getElementById('try-now-page').style.display = 'none';
        document.getElementById('sochat-info-page').style.display = 'none';
        document.getElementById('api-platform-page').style.display = 'none';
        document.getElementById('business-page').style.display = 'block';
        document.getElementById('models-page').style.display = 'none';
        document.getElementById('try-searchbar-container').style.display = 'none';
        document.querySelector('.main-footer').style.display = 'none';
    } else if (hash === '#models') {
        document.querySelector('.home-main').style.display = 'none';
        document.getElementById('try-now-page').style.display = 'none';
        document.getElementById('sochat-info-page').style.display = 'none';
        document.getElementById('api-platform-page').style.display = 'none';
        document.getElementById('business-page').style.display = 'none';
        document.getElementById('models-page').style.display = 'block';
        document.getElementById('try-searchbar-container').style.display = 'none';
        document.querySelector('.main-footer').style.display = 'none';
    } else {
        showHomePage();
    }
});
// Example: attach to a home button or logo if present
const homeLogo = document.querySelector('.header-title');
if (homeLogo) {
    homeLogo.addEventListener('click', function() {
        showHomePage();
        history.pushState({page: 'home'}, '', '#home');
    });
}

// Back arrow click handler
const backArrowBtn = document.getElementById('back-arrow-btn');
if (backArrowBtn) {
    backArrowBtn.addEventListener('click', function() {
        showHomePage();
        history.pushState({page: 'home'}, '', '#home');
    });
}

const trySearchbar = document.getElementById('try-searchbar');
const trySearchBtn = document.getElementById('try-search-btn');

if (trySearchbar && trySearchBtn) {
    const tryMessages = document.getElementById('try-messages');
    async function addTryMessagePair(userContent) {
        // Create pair container
        const pairDiv = document.createElement('div');
        pairDiv.className = 'try-msg-pair';
        // User message
        const userDiv = document.createElement('div');
        userDiv.className = 'try-msg-container user';
        userDiv.innerHTML = `
          <div class="try-msg-label user-label">You</div>
          <div class="try-msg-bubble user"><span>${escapeHTML(userContent)}</span></div>
          <button class="try-copy-btn" title="Copy">📄</button>
        `;
        userDiv.querySelector('.try-copy-btn').onclick = () => {
            navigator.clipboard.writeText(userContent);
        };
        // AI message (initially 'Thinking...')
        const aiDiv = document.createElement('div');
        aiDiv.className = 'try-msg-container ai';
        aiDiv.innerHTML = `
          <div class="try-msg-label ai-label">SoChat</div>
          <div class="try-msg-bubble ai"><em>Thinking...</em></div>
          <button class="try-copy-btn" title="Copy">📄</button>
        `;
        aiDiv.querySelector('.try-copy-btn').onclick = () => {
            navigator.clipboard.writeText('Thinking...');
        };
        // Append both
        pairDiv.appendChild(userDiv);
        pairDiv.appendChild(aiDiv);
        tryMessages.appendChild(pairDiv);
        tryMessages.scrollTop = tryMessages.scrollHeight;
        // Fetch AI response
        const res = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userContent })
        });
        const data = await res.json();
        // Update AI message
        aiDiv.querySelector('.try-msg-bubble').innerHTML = marked.parse(data.reply);
        aiDiv.querySelector('.try-copy-btn').onclick = () => {
            // Remove HTML tags for copy
            const temp = document.createElement('div');
            temp.innerHTML = marked.parse(data.reply);
            navigator.clipboard.writeText(temp.textContent || temp.innerText || '');
        };
        // Scroll to top after AI response
        tryMessages.scrollTop = 0;
    }
    trySearchBtn.addEventListener('click', async function() {
        const query = trySearchbar.value.trim();
        if (query) {
            trySearchbar.value = '';
            await addTryMessagePair(query);
        }
    });
    trySearchbar.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') trySearchBtn.click();
    });
}



function openSidebar() {
    sidebar.classList.add('active');
    sidebarOverlay.classList.add('active');
    document.body.classList.add('sidebar-active');
    menuOpenIcon.style.display = 'none';
    menuCloseIcon.style.display = 'flex';
}
function closeSidebar() {
    sidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
    sidebar.classList.remove('sidebar-open');
    sidebar.classList.add('sidebar-closed');
    sidebar.style.left = '';
    sidebar.style.right = '';
    sidebarOverlay.style.display = 'none';
    document.body.classList.remove('sidebar-active');
    menuOpenIcon.style.display = 'flex';
    menuCloseIcon.style.display = 'none';
}

menuOpenIcon.onclick = openSidebar;
menuCloseIcon.onclick = closeSidebar;

sidebarOverlay.onclick = closeSidebar;

const sidebarClose = document.querySelector('.sidebar-close');
if (sidebarClose) {
    sidebarClose.onclick = closeSidebar;
}

function formatTimestamp() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function escapeHTML(str) {
    return str.replace(/[&<>"']/g, function(tag) {
        const charsToReplace = {
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        };
        return charsToReplace[tag] || tag;
    });
}

function addMessage(content, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'msg ' + sender;
    // Markdown rendering for AI, escape for user
    let rendered;
    if (sender === 'ai') {
        rendered = marked.parse(content);
    } else {
        rendered = '<span>' + escapeHTML(content) + '</span>';
    }
    msgDiv.innerHTML = `
        <div class="msg-content">${rendered}</div>
        <div class="msg-meta">
            <button class="copy-btn" title="Copy">📄</button>
        </div>
    `;
    messages.appendChild(msgDiv);
    // Copy-to-clipboard
    msgDiv.querySelector('.copy-btn').onclick = () => {
        navigator.clipboard.writeText(content);
    };
    // Auto-scroll
    messages.scrollTop = messages.scrollHeight;
}

const send = document.getElementById('send-btn');
const input = document.getElementById('searchbar-input');
if (send && input) {
    send.onclick = async () => {
        const text = input.value.trim();
        if (!text) return;
        // Save to history (localStorage)
        let history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        history.push({ text, timestamp: Date.now() });
        localStorage.setItem('searchHistory', JSON.stringify(history));
        addMessage(text, 'user');
        input.value = '';
        addMessage('<em>Thinking...</em>', 'ai');
        const res = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });
        const data = await res.json();
        // Remove the 'Thinking...' message
        const aiMsgs = messages.querySelectorAll('.msg.ai');
        if (aiMsgs.length > 0) aiMsgs[aiMsgs.length - 1].remove();
        addMessage(data.reply, 'ai');
    };
}

if (input) {
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && send) send.onclick();
    });
}
});
