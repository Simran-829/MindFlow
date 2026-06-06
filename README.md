# 🧠 MindFlow: Socratic Study-Flow & Mental Resilience Co-Pilot

> **Deployed Version:** [mind-flow-ochre.vercel.app](https://mind-flow-ochre.vercel.app/)

**MindFlow** is a premium, client-side web application designed to help students preparing for high-stakes examinations (**JEE, NEET, UPSC, GATE, CAT, CUET, and Board Exams**) monitor and improve their mental well-being while resolving academic roadblocks.

By coupling a **dynamic Socratic doubt-solving console** with **real-time biometric stress telemetry**, MindFlow intercepts academic burnout at the exact moment of struggle, offering guided physiological sigh recovery and personalized cognitive-behavioral reframing.

---

## 🚀 Key Features & Capabilities

### 1. Dynamic Socratic Dialogue Engine
* **Topic Extractor & Subject Classifier:** MindFlow parses any custom academic query typed or spoken by the student. It cleans query starters, extracts the core concept, and automatically classifies the subject under **Physics, Biology, History/Polity, Chemistry, or Math**.
* **Step-by-Step Active Recall:** Rather than giving copy-paste textbook answers, it constructs a **4-step Socratic tree** on the fly:
  1. *Step 1: Fundamental Recall* (foundational formulas and axioms)
  2. *Step 2: Relationship Mapping* (linking variables and constraints)
  3. *Step 3: Logic/Math Calculation* (resolving equation systems)
  4. *Step 4: Verification Check* (checking boundary cases and dimensions)
* **Custom Interactive Cards:** Options and feedback are generated contextually to ensure active recall and deeper conceptual learning.

### 2. Ambient Vocal Tension Sensor (Web Audio API)
* **Real-time Autocorrelation DSP:** Captures the microphone input stream to run a time-domain autocorrelation algorithm, calculating fundamental pitch frequencies ($F_0$) 60 times per second.
* **Vocal Jitter Heuristics:** Evaluates pitch variance (micro-tremors) against the student's calibrated baseline. Spikes in vocal tension (>82%) indicate somatic anxiety and automatically trigger calm-down interventions.

### 3. Keyboard Cadence Telemetry
* **WPM & Delays:** Measures keystroke speed and calculates latency standard deviation (rhythm irregularity).
* **Backspace Density:** Analyzes the ratio of backspaces to characters typed. High backspace density combined with irregular cadence indicates frustration and cognitive overload.

### 4. Interactive Calming Interceptor (Stress Sigher)
* **Automatic Interception:** If the integrated stress index exceeds critical thresholds, the workspace locks and prompts a breathing break.
* **Physiological Sigh Pacing:** Guides the student through the scientifically backed *physiological sigh* (two quick inhales, one slow exhale) with a pulsing glassmorphic breathing visualizer.
* **CBT Reframing:** Offers random Cognitive Behavioral Therapy (CBT) prompts to combat self-doubt, exam pressure, and parental expectations.

### 5. Canvas Analytics Dashboard
* **Dynamic Visualization:** Uses the HTML5 Canvas API to render real-time stress trends, target study hours completion, fatigue progression, and a composite Burnout Risk index.
* **Refresh Resilience:** Persists the entire chat log, Socratic steps, and calibration data in LocalStorage.

---

## 🛠️ Technology Stack
* **Frontend:** Vanilla HTML5 (semantic structures), CSS3 (glassmorphic layout, theme variables, and keyframe animations), ES6 JavaScript.
* **DSP & Graphics:** Web Audio API, Canvas API.
* **Testing Infrastructure:** Vitest, JSDOM, Playwright, Node.js.

---

## 🧪 Automated Testing Suite
MindFlow includes a robust, cross-browser automated testing suite achieving **95%+ statement and branch coverage** on core business logic.

### 1. Unit & Integration Tests (Vitest + JSDOM)
Validates mathematical calculations, telemetric heuristics, state transitions, and DOM events:
* **`tests/unit/socraticEngine.test.js`:** Custom query parsing, subject classification, and dialogue transitions.
* **`tests/unit/voice.test.js`:** Autocorrelation pitch tracking and vocal jitter calculations.
* **`tests/unit/app.test.js`:** Typing telemetry, WPM, and stress index calculations.
* **`tests/integration/flows.test.js`:** Onboarding setup, local storage persistence, and view routing.

### 2. End-to-End Tests (Playwright)
Simulates real student usage across 5 browser configurations (Chromium, Firefox, WebKit, Mobile Chrome, and Mobile Safari):
* **`tests/e2e/student.spec.js`:** Complete onboarding flow, mock exam interaction, telemetry triggers, and breathing breaks.

---

## ⚙️ Running Locally & Testing

### 1. Run the Web App
Simply open [index.html](./index.html) in any modern web browser. It is fully client-side and requires zero server configuration.

### 2. Install Testing Dependencies
```bash
npm install
```

### 3. Run Vitest Suite
```bash
npm run test
```

### 4. Run Playwright E2E Suite
```bash
npx playwright install
npm run test:e2e
```
