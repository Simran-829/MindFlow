/**
 * MindFlow Central Coordinator
 * Connects UI events, local stress sensors (keystroke metrics and vocal jitter), 
 * Socratic conversation, and Dashboard renders.
 */

// App Central State
const state = {
    userProfile: {
        name: "Aarav",
        targetExam: "jee",
        targetHours: 10,
        voiceBaseline: null
    },
    socraticStep: 0,
    stressScore: 0.15, // 0 to 1
    voiceTension: 0.10, // 0 to 1
    fatigueScore: 0.12, // 0 to 1
    currentView: "study",
    coachingEnabled: true,
    isCalmingIntercepted: false,
    examIndex: 0,
    chatHistory: [], // Saved in LocalStorage
    examQuestions: [
        {
            subject: "JEE Physics Mock",
            q: "A solid cylinder of mass M and radius R rolls without slipping down an inclined plane of angle θ. The acceleration of the center of mass of the cylinder is:",
            options: {
                a: "g sin θ",
                b: "2/3 g sin θ",
                c: "1/2 g sin θ",
                d: "3/4 g sin θ"
            },
            correct: "b"
        },
        {
            subject: "NEET Biology Mock",
            q: "Which of the following enzymes is responsible for joining the Okazaki fragments synthesized on the lagging strand during replication?",
            options: {
                a: "DNA Ligase",
                b: "DNA Polymerase III",
                c: "DNA Helicase",
                d: "RNA Primase"
            },
            correct: "a"
        },
        {
            subject: "UPSC History Mock",
            q: "The Zabti/Dahsala land revenue system introduced under Akbar was a milestone reform. Who was the primary architect of this system?",
            options: {
                a: "Abul Fazl",
                b: "Raja Man Singh",
                c: "Raja Todar Mal",
                d: "Birbal"
            },
            correct: "c"
        }
    ]
};

// Keystroke statistics for stress computation
let lastKeyTime = Date.now();
let backspaceCount = 0;
let keystrokeIntervals = [];

document.addEventListener("DOMContentLoaded", () => {
    initApp();
});

function initApp() {
    setupOnboarding();
    setupTabControls();
    setupSimulatorControls();
    setupStudyWorkspace();
    setupMockExam();
    checkExistingProfile();
    updateMindFlowStateUI();
}

// Check if profile and chat logs exist in localstorage to bypass onboarding
function checkExistingProfile() {
    const cachedProfile = localStorage.getItem("mindflow_user_profile");
    if (cachedProfile) {
        try {
            state.userProfile = JSON.parse(cachedProfile);
            document.getElementById("onboarding-modal").classList.add("hidden");
            showToast(`Welcome back, ${escapeHTML(state.userProfile.name)}! MindFlow active.`, "calm");
            loadExamPresetDoubtText();
        } catch (e) {
            console.error("Error loading cached profile", e);
        }
    }
    
    // Load persisted chat history
    const cachedChats = localStorage.getItem("mindflow_chat_history");
    const cachedStep = localStorage.getItem("mindflow_socratic_step");
    
    if (cachedChats) {
        try {
            state.chatHistory = JSON.parse(cachedChats);
            state.socraticStep = cachedStep ? parseInt(cachedStep) : 0;
            
            const box = document.getElementById("chat-box");
            const emptyState = document.getElementById("chat-empty-state");
            const samplesContainer = document.getElementById("quick-samples-container");
            
            if (state.chatHistory.length > 0) {
                if (emptyState) emptyState.remove();
                if (samplesContainer) samplesContainer.classList.add("hidden");
                
                box.innerHTML = ''; // Clear empty messages
                state.chatHistory.forEach(item => {
                    if (item.sender === 'user') {
                        renderUserBubble(item.text, item.time);
                    } else {
                        renderMindFlowBubble(item.text, item.time);
                    }
                });
                scrollToBottom(box);
            }
        } catch (e) {
            console.error("Error loading cached chat logs", e);
        }
    } else {
        // First welcome if profile exists but no chats
        if (cachedProfile) {
            appendMindFlowMessage(`Hello ${escapeHTML(state.userProfile.name)}! I am MindFlow, your Socratic Study-Flow Co-pilot. Whenever you hit a roadblock in your studies, type it here or dictate it to me. I'll help you break it down step-by-step.`);
        }
    }
}

// Save active chat state to LocalStorage
function persistChatState() {
    localStorage.setItem("mindflow_chat_history", JSON.stringify(state.chatHistory));
    localStorage.setItem("mindflow_socratic_step", state.socraticStep.toString());
}

// Onboarding Event Handlers
function setupOnboarding() {
    const modal = document.getElementById("onboarding-modal");
    const step1 = document.getElementById("onboard-step-1");
    const step2 = document.getElementById("onboard-step-2");
    
    // Exam card selections
    const cards = document.querySelectorAll(".exam-card");
    cards.forEach(card => {
        card.addEventListener("click", () => {
            cards.forEach(c => {
                c.classList.remove("selected");
                c.setAttribute("aria-checked", "false");
            });
            card.classList.add("selected");
            card.setAttribute("aria-checked", "true");
            state.userProfile.targetExam = card.dataset.exam;
        });
        card.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                card.click();
            }
        });
    });

    // Step 1 -> Step 2
    document.getElementById("onboard-next-1").addEventListener("click", () => {
        const nameInput = document.getElementById("onboard-name").value.trim();
        if (nameInput) state.userProfile.name = nameInput;
        state.userProfile.targetHours = parseInt(document.getElementById("onboard-hours").value);
        
        step1.classList.add("hidden");
        step2.classList.remove("hidden");
    });

    // Step 2 Back
    document.getElementById("onboard-back-2").addEventListener("click", () => {
        step2.classList.add("hidden");
        step1.classList.remove("hidden");
    });

    // Voice calibration
    document.getElementById("voice-calibrate-btn").addEventListener("click", () => {
        calibrateVoiceBaseline('voice-calibrate-btn', 'calibrate-wave-container', 'onboard-next-2', (val) => {
            state.userProfile.voiceBaseline = val;
            showToast("Voice baseline computed successfully.", "calm");
        });
    });

    // Finish onboarding
    document.getElementById("onboard-next-2").addEventListener("click", () => {
        localStorage.setItem("mindflow_user_profile", JSON.stringify(state.userProfile));
        modal.classList.add("hidden");
        showToast(`Setup complete! Welcome, ${escapeHTML(state.userProfile.name)}.`, "calm");
        loadExamPresetDoubtText();
        
        // Push initial greetings from MindFlow
        appendMindFlowMessage(`Hello ${escapeHTML(state.userProfile.name)}! I am MindFlow, your Socratic Study-Flow Co-pilot. Whenever you hit a roadblock in your studies, type it here or dictate it to me. I'll help you break it down step-by-step.`);
    });
}

// Tab navigation view swappers
function setupTabControls() {
    const tabs = document.querySelectorAll(".tab-btn");
    const sections = document.querySelectorAll(".view-section");
    
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            
            const view = tab.dataset.view;
            state.currentView = view;
            
            sections.forEach(sec => sec.classList.add("hidden"));
            document.getElementById(`view-${view}`).classList.remove("hidden");
            
            if (view === "dashboard") {
                initDashboardCharts();
            } else if (view === "exam") {
                renderExamQuestion();
            }
        });
    });

    // Clickable Logo to return Home
    const logoBtn = document.getElementById("logo-btn");
    if (logoBtn) {
        logoBtn.addEventListener("click", () => {
            const studyTab = document.querySelector('.tab-btn[data-view="study"]');
            if (studyTab) studyTab.click();
        });
    }
}

// Study Workspace Controllers (Chat, text trackers, mic)
function setupStudyWorkspace() {
    const doubtInput = document.getElementById("doubt-input");
    const sendBtn = document.getElementById("send-btn");
    const micBtn = document.getElementById("mic-btn");
    const attachBtn = document.getElementById("attach-btn");
    const fileInput = document.getElementById("image-input");
    const sampleBtns = document.querySelectorAll(".sample-btn");
    
    // Live Character Counter & Limit
    const limit = 1000;
    const inputPanel = document.querySelector(".input-panel");
    const counter = document.createElement("div");
    counter.id = "char-counter";
    counter.style.cssText = "font-size:0.7rem; color:var(--text-muted); text-align:right; margin-top:4px;";
    counter.textContent = `0 / ${limit}`;
    inputPanel.appendChild(counter);

    doubtInput.addEventListener("input", (e) => {
        const val = e.target.value;
        if (val.length > limit) {
            e.target.value = val.substring(0, limit);
        }
        counter.textContent = `${e.target.value.length} / ${limit}`;
    });

    // Typing Rhythm Keystroke Stress Tracker
    doubtInput.addEventListener("keydown", (e) => {
        const now = Date.now();
        const interval = now - lastKeyTime;
        lastKeyTime = now;
        
        if (interval < 2000) {
            keystrokeIntervals.push(interval);
            if (keystrokeIntervals.length > 20) keystrokeIntervals.shift();
        }
        
        if (e.key === "Backspace") {
            backspaceCount++;
        }
        
        evaluateKeystrokeStress();
    });

    // Submit Chat
    sendBtn.addEventListener("click", () => {
        submitUserDoubt();
    });

    doubtInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submitUserDoubt();
        }
    });

    // Voice Recording in chat with actual pitch/jitter estimators
    let micActive = false;
    micBtn.addEventListener("click", () => {
        if (!micActive) {
            micActive = true;
            micBtn.classList.add("active-mic");
            showToast("Listening... Describe your doubt in a clear voice.", "focus");
            startVoiceAnalysis("audio-wave-container", (audioData) => {
                if (audioData && audioData.jitter > 0) {
                    state.voiceTension = audioData.jitter;
                    updateMindFlowStateUI();
                    
                    if (state.voiceTension > 0.82) {
                        micBtn.click(); // Stop mic
                        triggerCalmingInterception();
                    }
                }
            });
        } else {
            micActive = false;
            micBtn.classList.remove("active-mic");
            stopVoiceAnalysis("audio-wave-container");
            
            const exam = state.userProfile.targetExam;
            let query = "I get confused by rotational dynamics.";
            if (exam === "neet") query = "Explain replication strands difference.";
            if (exam === "upsc") query = "What is the Dahsala revenue reform?";
            
            doubtInput.value = query;
            counter.textContent = `${query.length} / ${limit}`;
            submitUserDoubt();
        }
    });

    // Image OCR attachment simulations
    attachBtn.addEventListener("click", () => {
        fileInput.click();
    });

    fileInput.addEventListener("change", (e) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = function(evt) {
                const box = document.getElementById("image-preview-box");
                const img = document.getElementById("preview-image-src");
                const name = document.getElementById("preview-image-name");
                
                img.src = evt.target.result;
                name.textContent = e.target.files[0].name;
                box.classList.remove("hidden");
                
                showToast("Scanning equations with OCR...", "focus");
                setTimeout(() => {
                    let extracted = "Solid cylinder mass M rolling down incline.";
                    if (state.userProfile.targetExam === 'neet') extracted = "DNA replication fork leading lagging strand synthesis.";
                    if (state.userProfile.targetExam === 'upsc') extracted = "Todar Mal Dahsala system features.";
                    doubtInput.value = extracted;
                    counter.textContent = `${extracted.length} / ${limit}`;
                    showToast("OCR complete! Question loaded.", "calm");
                }, 1200);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    });

    document.getElementById("remove-preview-btn").addEventListener("click", () => {
        document.getElementById("image-preview-box").classList.add("hidden");
        fileInput.value = "";
    });

    // Sample question triggers
    sampleBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const type = btn.dataset.type;
            state.userProfile.targetExam = type;
            loadExamPresetDoubtText();
            submitUserDoubt();
        });
    });


    // Recalibrate Baseline button in header
    document.getElementById("recalibrate-header-btn").addEventListener("click", () => {
        const modal = document.getElementById("onboarding-modal");
        const step1 = document.getElementById("onboard-step-1");
        const step2 = document.getElementById("onboard-step-2");
        const txt = document.getElementById('calibrate-btn-text');
        const finishBtn = document.getElementById('onboard-next-2');
        
        step1.classList.add("hidden");
        step2.classList.remove("hidden");
        modal.classList.remove("hidden");
        txt.textContent = "Click to Record Baseline";
        finishBtn.setAttribute("disabled", "true");
    });

    // Settings Modal Controllers
    const settingsModal = document.getElementById("settings-modal");
    const settingsBtn = document.getElementById("settings-btn");
    const settingsCancelBtn = document.getElementById("settings-cancel-btn");
    const settingsSaveBtn = document.getElementById("settings-save-btn");
    const btnClearData = document.getElementById("btn-clear-data");

    settingsBtn.addEventListener("click", () => {
        document.getElementById("settings-name").value = state.userProfile.name;
        document.getElementById("settings-exam").value = state.userProfile.targetExam;
        document.getElementById("settings-hours").value = state.userProfile.targetHours;
        settingsModal.classList.remove("hidden");
    });

    // Listen to Enter key inside settings name field
    document.getElementById("settings-name").addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            settingsSaveBtn.click();
        }
    });

    settingsCancelBtn.addEventListener("click", () => {
        settingsModal.classList.add("hidden");
        settingsBtn.focus(); // Return focus for accessibility
    });

    settingsSaveBtn.addEventListener("click", () => {
        const nameInput = document.getElementById("settings-name").value.trim();
        if (nameInput) state.userProfile.name = nameInput;
        state.userProfile.targetExam = document.getElementById("settings-exam").value;
        state.userProfile.targetHours = parseInt(document.getElementById("settings-hours").value);
        
        localStorage.setItem("mindflow_user_profile", JSON.stringify(state.userProfile));
        showToast("Settings updated successfully.", "calm");
        settingsModal.classList.add("hidden");
        settingsBtn.focus(); // Return focus for accessibility
        
        loadExamPresetDoubtText();
        updateMindFlowStateUI();
    });

    btnClearData.addEventListener("click", () => {
        state.chatHistory = [];
        state.socraticStep = 0;
        localStorage.removeItem("mindflow_chat_history");
        localStorage.removeItem("mindflow_socratic_step");
        
        const box = document.getElementById("chat-box");
        box.innerHTML = `
            <div class="empty-state" id="chat-empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04334 16.4525L2 22L7.5475 20.9567C8.88837 21.6244 10.4003 22 12 22Z" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M8 12H8.01" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 12H12.01" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M16 12H16.01" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <p>Got stuck on a concept or equation?</p>
                <span>Describe your doubt in text, upload a photo, or dictate with voice.</span>
            </div>
        `;
        document.getElementById("quick-samples-container").classList.remove("hidden");
        
        showToast("Workspace history reset.", "focus");
        settingsModal.classList.add("hidden");
        settingsBtn.focus(); // Return focus for accessibility
        
        appendMindFlowMessage(`Hello ${escapeHTML(state.userProfile.name)}! Chat history has been cleared. Ask a new doubt whenever you are ready.`);
    });
}

function loadExamPresetDoubtText() {
    const input = document.getElementById("doubt-input");
    const exam = state.userProfile.targetExam;
    if (exam === "jee") {
        input.value = "How do I solve the acceleration of a rolling cylinder down an incline θ?";
    } else if (exam === "neet") {
        input.value = "Why is DNA replication semi-discontinuous with leading and lagging strands?";
    } else if (exam === "upsc") {
        input.value = "Can you explain the main points of Raja Todar Mal's Dahsala system?";
    } else if (exam === "cat") {
        input.value = "Can you explain the logic behind permutation and combination formulas?";
    } else if (exam === "gate") {
        input.value = "Explain the concept of pipelining hazard in computer organization.";
    } else if (exam === "cuet") {
        input.value = "What is the structure and features of the Indian Constitution?";
    } else if (exam === "boards") {
        input.value = "Explain the derivation of the quadratic formula step-by-step.";
    }
    const counter = document.getElementById("char-counter");
    if (counter) counter.textContent = `${input.value.length} / 1000`;
}

// Submit user message and trigger Socratic responses
function submitUserDoubt() {
    const input = document.getElementById("doubt-input");
    const query = input.value.trim();
    
    if (!query) {
        showToast("Please enter a question or speak to MindFlow.", "alert");
        return;
    }

    toggleWorkspaceInputs(false);

    document.getElementById("image-preview-box").classList.add("hidden");
    document.getElementById("image-input").value = "";

    const emptyState = document.getElementById("chat-empty-state");
    if (emptyState) emptyState.remove();
    const samplesContainer = document.getElementById("quick-samples-container");
    if (samplesContainer) samplesContainer.classList.add("hidden");

    appendUserMessage(query);
    input.value = "";
    document.getElementById("char-counter").textContent = `0 / 1000`;
    
    if (state.stressScore > 0.78) {
        setTimeout(() => {
            toggleWorkspaceInputs(true);
            triggerCalmingInterception();
        }, 800);
        return;
    }

    appendMindFlowTypingIndicator();
    
    setTimeout(() => {
        removeMindFlowTypingIndicator();
        toggleWorkspaceInputs(true);
        
        let response = null;
        if (state.coachingEnabled) {
            response = getSocraticResponse(state, query);
        } else {
            response = {
                text: "Here is the direct textbook solution: For a rolling cylinder, the moment of inertia I = 1/2 MR². The equations of motion give the linear acceleration as a = 2/3 g sin θ. This is derived from conservation of energy or torque balance.",
                options: []
            };
        }
        
        appendMindFlowMessage(response.text);
        
        if (response.options && response.options.length > 0) {
            appendSocraticOptions(response.options);
        }
        
        persistChatState();
        
        state.fatigueScore = Math.min(1.0, state.fatigueScore + 0.04);
        updateMindFlowStateUI();
        
    }, 1200);
}

// Debounce block / unblock workspace elements
function toggleWorkspaceInputs(enable) {
    const doubtInput = document.getElementById("doubt-input");
    const sendBtn = document.getElementById("send-btn");
    const micBtn = document.getElementById("mic-btn");
    const attachBtn = document.getElementById("attach-btn");
    
    if (enable) {
        doubtInput.removeAttribute("disabled");
        sendBtn.removeAttribute("disabled");
        micBtn.removeAttribute("disabled");
        attachBtn.removeAttribute("disabled");
    } else {
        doubtInput.setAttribute("disabled", "true");
        sendBtn.setAttribute("disabled", "true");
        micBtn.setAttribute("disabled", "true");
        attachBtn.setAttribute("disabled", "true");
    }
}

// Stress Assessment from Typing metrics (WPM, latency SD, backspace density)
function evaluateKeystrokeStress() {
    if (keystrokeIntervals.length < 5) return;
    
    const avgDelay = keystrokeIntervals.reduce((a, b) => a + b, 0) / keystrokeIntervals.length;
    const variance = keystrokeIntervals.reduce((a, b) => a + Math.pow(b - avgDelay, 2), 0) / keystrokeIntervals.length;
    const jitter = Math.sqrt(variance); 
    const totalKeys = keystrokeIntervals.length + backspaceCount;
    const backspaceRatio = backspaceCount / (totalKeys || 1);
    
    let stressVal = 0.15;
    if (jitter > 140) stressVal += 0.25;
    if (backspaceRatio > 0.15) stressVal += 0.35;
    if (avgDelay < 70) stressVal += 0.15;
    
    state.stressScore = Math.max(0.1, Math.min(0.95, stressVal));
    updateMindFlowStateUI();
}

// Simulator & Control adjustments
function setupSimulatorControls() {
    const typingSlider = document.getElementById("sim-typing-slider");
    const vocalSlider = document.getElementById("sim-vocal-slider");
    const btnPanic = document.getElementById("btn-trigger-panic");
    const btnReset = document.getElementById("btn-reset-state");
    
    typingSlider.addEventListener("input", (e) => {
        const val = parseInt(e.target.value);
        document.getElementById("sim-typing-txt").textContent = val > 75 ? "Panic!" : val > 45 ? "Tension" : "Low";
        state.stressScore = val / 100;
        updateMindFlowStateUI();
        
        if (state.stressScore > 0.8) {
            triggerCalmingInterception();
        }
    });

    vocalSlider.addEventListener("input", (e) => {
        const val = parseInt(e.target.value);
        document.getElementById("sim-vocal-txt").textContent = val > 75 ? "High Jitter" : val > 45 ? "Anxious" : "Low";
        state.voiceTension = val / 100;
        updateMindFlowStateUI();
    });

    btnPanic.addEventListener("click", () => {
        state.stressScore = 0.95;
        state.voiceTension = 0.90;
        typingSlider.value = 95;
        vocalSlider.value = 90;
        updateMindFlowStateUI();
        triggerCalmingInterception();
    });

    btnReset.addEventListener("click", () => {
        state.stressScore = 0.15;
        state.voiceTension = 0.10;
        state.fatigueScore = 0.12;
        typingSlider.value = 15;
        vocalSlider.value = 10;
        backspaceCount = 0;
        keystrokeIntervals = [];
        updateMindFlowStateUI();
        showToast("Cognitive wellness restored to baseline.", "calm");
    });

    // Skip breathing sequence
    document.getElementById("skip-breath-btn").addEventListener("click", () => {
        closeCalmingModal();
    });
}

// Dynamic UI updates based on Stress Scores
function updateMindFlowStateUI() {
    const root = document.documentElement;
    const stateTxt = document.getElementById("orb-state-txt");
    const stateDesc = document.getElementById("orb-state-desc");
    
    const keysFill = document.getElementById("metric-keys-fill");
    const keysVal = document.getElementById("metric-keys-val");
    const voiceFill = document.getElementById("metric-voice-fill");
    const voiceVal = document.getElementById("metric-voice-val");
    const fatigueFill = document.getElementById("metric-fatigue-fill");
    const fatigueVal = document.getElementById("metric-fatigue-val");

    // Sync gauges
    if (keysFill) {
        keysFill.style.width = `${Math.round(state.stressScore * 100)}%`;
        keysVal.textContent = `${Math.round(state.stressScore * 100)}%`;
    }
    if (voiceFill) {
        voiceFill.style.width = `${Math.round(state.voiceTension * 100)}%`;
        voiceVal.textContent = `${Math.round(state.voiceTension * 100)}%`;
    }
    if (fatigueFill) {
        fatigueFill.style.width = `${Math.round(state.fatigueScore * 100)}%`;
        fatigueVal.textContent = `${Math.round(state.fatigueScore * 100)}%`;
    }

    // Determine HSL Variable changes
    if (state.fatigueScore > 0.75) {
        root.style.setProperty('--state-color', 'hsl(var(--state-fatigue-hsl))');
        if (stateTxt) stateTxt.textContent = "Exhausted";
        if (stateDesc) stateDesc.textContent = "High cognitive saturation detected. Pacing is slow. Consider taking a rest.";
    } else if (state.stressScore > 0.8) {
        root.style.setProperty('--state-color', 'hsl(var(--state-panic-hsl))');
        root.style.setProperty('--glow-strength', '50px');
        if (stateTxt) stateTxt.textContent = "Anxiety Spike";
        if (stateDesc) stateDesc.textContent = "Severe keyboard friction. MindFlow recommends guided decompression.";
    } else if (state.stressScore > 0.5) {
        root.style.setProperty('--state-color', 'hsl(var(--state-alert-hsl))');
        root.style.setProperty('--glow-strength', '35px');
        if (stateTxt) stateTxt.textContent = "Restless Alert";
        if (stateDesc) stateDesc.textContent = "Slight typing blockages. Keep breathing calmly.";
    } else if (state.stressScore > 0.25) {
        root.style.setProperty('--state-color', 'hsl(var(--state-focus-hsl))');
        root.style.setProperty('--glow-strength', '25px');
        if (stateTxt) stateTxt.textContent = "Flow Focus";
        if (stateDesc) stateDesc.textContent = "Steady progress. Active learning metrics look healthy.";
    } else {
        root.style.setProperty('--state-color', 'hsl(var(--state-calm-hsl))');
        root.style.setProperty('--glow-strength', '20px');
        if (stateTxt) stateTxt.textContent = "Calm Alertness";
        if (stateDesc) stateDesc.textContent = "Ready to receive doubts. Baseline wellness active.";
    }

    // Sync Exam Orb state if on that tab
    const examOrbTxt = document.getElementById("exam-orb-state-txt");
    if (examOrbTxt) {
        if (state.stressScore > 0.7) {
            examOrbTxt.textContent = "Panic Warning";
            document.getElementById("metric-exam-stress-fill").style.width = "85%";
            document.getElementById("metric-exam-stress-val").textContent = "85%";
        } else {
            examOrbTxt.textContent = "Focus Guard";
            document.getElementById("metric-exam-stress-fill").style.width = "20%";
            document.getElementById("metric-exam-stress-val").textContent = "20%";
        }
    }
}

// Guided Calming Modal (Physiological Sigh box-breathing)
let breathTimer = null;
function triggerCalmingInterception() {
    if (state.isCalmingIntercepted) return;
    state.isCalmingIntercepted = true;
    
    document.getElementById("sim-typing-slider").value = 15;
    
    const modal = document.getElementById("calming-modal");
    const bubble = document.getElementById("pacing-bubble");
    const actionLbl = document.getElementById("breath-lbl-action");
    const timerLbl = document.getElementById("breath-lbl-timer");
    const reframer = document.getElementById("cbt-reframer-text");
    
    modal.classList.add("active");
    reframer.textContent = getRandomReframing();
    
    let cycle = 0;
    let step = 0; 
    let secondsLeft = 4;
    
    actionLbl.textContent = "Inhale deeply";
    bubble.style.transform = "scale(1.8)";
    bubble.style.transition = "transform 4s cubic-bezier(0.4, 0, 0.2, 1)";
    
    showToast("MindFlow Intercept: Breath requested.", "panic");
    
    breathTimer = setInterval(() => {
        secondsLeft--;
        timerLbl.textContent = `${secondsLeft}s`;
        
        if (secondsLeft <= 0) {
            step = (step + 1) % 4;
            secondsLeft = 4;
            
            if (step === 0) {
                cycle++;
                if (cycle >= 2) {
                    closeCalmingModal();
                    return;
                }
                actionLbl.textContent = "Inhale deeply";
                bubble.style.transform = "scale(1.8)";
            } else if (step === 1) {
                actionLbl.textContent = "Hold breath";
                bubble.style.boxShadow = "0 0 70px #ef4444";
            } else if (step === 2) {
                actionLbl.textContent = "Exhale slowly";
                bubble.style.transform = "scale(0.8)";
                bubble.style.boxShadow = "";
            } else if (step === 3) {
                actionLbl.textContent = "Hold";
            }
        }
    }, 1000);
}

function closeCalmingModal() {
    clearInterval(breathTimer);
    const modal = document.getElementById("calming-modal");
    modal.classList.remove("active");
    state.isCalmingIntercepted = false;
    
    state.stressScore = 0.15;
    state.voiceTension = 0.10;
    updateMindFlowStateUI();
    
    showToast("Welcome back! Cognitive stress reduced.", "calm");
    appendMindFlowMessage("I hope that helped clear the fog. Now, let's take another look at that problem. What seems to be the main point of confusion?");
}

// Mock Exam View Coordinator
function setupMockExam() {
    const prev = document.getElementById("exam-prev-btn");
    const next = document.getElementById("exam-next-btn");
    const stressTrigger = document.getElementById("btn-exam-trigger-stress");
    
    prev.addEventListener("click", () => {
        showToast("Question skipped.", "focus");
        nextExamQuestion();
    });

    next.addEventListener("click", () => {
        const selected = document.querySelector(".exam-option.selected");
        if (!selected) {
            showToast("Please select an answer first.", "alert");
            return;
        }
        
        const answer = selected.dataset.option;
        const currentQ = state.examQuestions[state.examIndex];
        
        if (answer === currentQ.correct) {
            showToast("Correct response registered!", "calm");
        } else {
            showToast("Response recorded.", "focus");
            state.stressScore = Math.min(1.0, state.stressScore + 0.18);
            updateMindFlowStateUI();
        }
        
        nextExamQuestion();
    });

    stressTrigger.addEventListener("click", () => {
        state.stressScore = 0.90;
        updateMindFlowStateUI();
        triggerCalmingInterception();
    });
}

function renderExamQuestion() {
    const currentQ = state.examQuestions[state.examIndex];
    document.getElementById("exam-subject-lbl").textContent = currentQ.subject;
    document.getElementById("exam-question-text").textContent = currentQ.q;
    
    const options = document.querySelectorAll(".exam-option");
    options.forEach(opt => {
        opt.classList.remove("selected");
        opt.setAttribute("aria-checked", "false");
        const letter = opt.dataset.option;
        opt.querySelector(".option-desc").textContent = currentQ.options[letter];
        
        opt.onclick = () => {
            options.forEach(o => {
                o.classList.remove("selected");
                o.setAttribute("aria-checked", "false");
            });
            opt.classList.add("selected");
            opt.setAttribute("aria-checked", "true");
        };

        opt.onkeydown = (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                opt.click();
            }
        };
    });
}

function nextExamQuestion() {
    state.examIndex = (state.examIndex + 1) % state.examQuestions.length;
    renderExamQuestion();
}

// Helper methods for appending chat elements
function appendUserMessage(text) {
    const box = document.getElementById("chat-box");
    const time = getCurrentTime();
    
    renderUserBubble(text, time);
    scrollToBottom(box);
    
    state.chatHistory.push({ sender: 'user', text, time });
    persistChatState();
}

function appendMindFlowMessage(text) {
    const box = document.getElementById("chat-box");
    const time = getCurrentTime();
    
    renderMindFlowBubble(text, time);
    scrollToBottom(box);
    
    state.chatHistory.push({ sender: 'mindflow', text, time });
    persistChatState();
}

// HTML rendering functions with XSS Protection
function renderUserBubble(text, time) {
    const box = document.getElementById("chat-box");
    const msg = document.createElement("div");
    msg.className = "message user";
    msg.innerHTML = `
        <div class="message-bubble">${escapeHTML(text)}</div>
        <div class="message-meta">You • ${escapeHTML(time)}</div>
    `;
    box.appendChild(msg);
}

function renderMindFlowBubble(text, time) {
    const box = document.getElementById("chat-box");
    const msg = document.createElement("div");
    msg.className = "message mindflow";
    const formatted = escapeHTML(text).replace(/&lt;br&gt;/g, '<br>').replace(/\n/g, '<br>');
    msg.innerHTML = `
        <div class="message-bubble">${formatted}</div>
        <div class="message-meta">MindFlow • ${escapeHTML(time)}</div>
    `;
    box.appendChild(msg);
}

function appendMindFlowTypingIndicator() {
    const box = document.getElementById("chat-box");
    const msg = document.createElement("div");
    msg.className = "message mindflow";
    msg.id = "mindflow-typing-indicator";
    msg.innerHTML = `
        <div class="message-bubble" style="padding: 0.5rem 1rem; display:flex; gap: 4px; align-items:center;">
            <span style="width:6px; height:6px; background:#6b7280; border-radius:50%; animation: floatOrb 1s infinite alternate;"></span>
            <span style="width:6px; height:6px; background:#6b7280; border-radius:50%; animation: floatOrb 1s infinite alternate; animation-delay:0.2s;"></span>
            <span style="width:6px; height:6px; background:#6b7280; border-radius:50%; animation: floatOrb 1s infinite alternate; animation-delay:0.4s;"></span>
        </div>
    `;
    box.appendChild(msg);
    scrollToBottom(box);
}

function removeMindFlowTypingIndicator() {
    const el = document.getElementById("mindflow-typing-indicator");
    if (el) el.remove();
}

function appendSocraticOptions(options) {
    const box = document.getElementById("chat-box");
    const wrapper = document.createElement("div");
    wrapper.className = "socratic-options";
    
    options.forEach((opt, idx) => {
        const chip = document.createElement("button");
        chip.className = "option-chip";
        chip.textContent = opt.text;
        chip.setAttribute("aria-label", `Option ${idx+1}: ${opt.text}`);
        chip.onclick = () => {
            wrapper.remove();
            submitUserOptionChoice(opt.text);
        };
        wrapper.appendChild(chip);
    });
    
    box.appendChild(wrapper);
    scrollToBottom(box);
}

function submitUserOptionChoice(text) {
    toggleWorkspaceInputs(false);
    appendUserMessage(text);
    appendMindFlowTypingIndicator();
    
    setTimeout(() => {
        removeMindFlowTypingIndicator();
        toggleWorkspaceInputs(true);
        
        const response = getSocraticResponse(state, text);
        appendMindFlowMessage(response.text);
        
        if (response.options && response.options.length > 0) {
            appendSocraticOptions(response.options);
        }
        
        persistChatState();
    }, 1000);
}

// Toast alerts helper
function showToast(text, mode) {
    const container = document.getElementById("toasts");
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("role", "alert");
    toast.setAttribute("aria-live", "polite");
    
    let color = "#00f2fe";
    if (mode === "panic") color = "#ff3b30";
    if (mode === "alert") color = "#ff9900";
    if (mode === "focus") color = "#4facfe";
    
    toast.style.borderLeftColor = color;
    toast.innerHTML = `
        <span style="width:8px; height:8px; background-color:${color}; border-radius:50%;"></span>
        <span>${escapeHTML(text)}</span>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Utility Helpers
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function scrollToBottom(el) {
    el.scrollTop = el.scrollHeight;
}
