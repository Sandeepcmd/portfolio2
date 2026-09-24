import { sound } from './sound.js';
import confetti from 'canvas-confetti';

export function initTerminal() {
  const terminalBody = document.getElementById('terminal-body');
  const terminalInput = document.getElementById('terminal-input');
  const quickButtons = document.querySelectorAll('.quick-cmd-btn');
  const clearBtn = document.getElementById('terminal-clear-btn');

  if (!terminalBody || !terminalInput) return;

  const COMMANDS = {
    help: () => `
Available system commands:
  <span class="res-highlight">about</span>      - Print engineer profile & core focus
  <span class="res-highlight">skills</span>     - List tech stack & frameworks
  <span class="res-highlight">projects</span>   - Display flagship architectures & demos
  <span class="res-highlight">stats</span>      - View algorithmic & production telemetry
  <span class="res-highlight">contact</span>    - Direct communication channels
  <span class="res-highlight">hire</span>       - Recruiter fast-track package ✨
  <span class="res-highlight">clear</span>      - Clear terminal screen
`,

    about: () => `
<span class="res-highlight">[ENGINEER PROFILE]</span>
Name:       Sandeep
Role:       Software Engineer
Education:  B.E. Computer Science & Engineering (Chandigarh University)
Focus:      High-throughput Microservices, Sub-second RAG, Real-Time Telemetry & Distributed Systems
Location:   Ghaziabad / Bangalore, India
Status:     <span class="res-success">● Open to High-Impact Engineering Roles</span>
`,

    skills: () => `
<span class="res-highlight">[TECH STACK & CAPABILITIES]</span>
Backend:    NestJS, Node.js, Express.js, Spring Boot, FastAPI, REST, GraphQL, WebSockets, Microservices
AI / ML:    RAG Pipelines, OpenAI API, Pinecone Vector DB, Whisper STT, Groq Llama-3.3, LangChain
Frontend:   React.js, Next.js, TypeScript, JavaScript, HTML5, CSS3, Tailwind CSS
Databases:  PostgreSQL, MySQL, MongoDB, Redis, Pinecone
DevOps:     Docker, AWS (S3, EC2), CI/CD GitHub Actions, Grafana, Linux, Shell Scripting
Messaging:  RabbitMQ, Socket.io, CPaaS Telemetry (50K+ daily SMS/WhatsApp)
`,

    projects: () => `
<span class="res-highlight">[FLAGSHIP ARCHITECTURES & LIVE SYSTEMS]</span>
1. <span class="res-highlight">MobiRoute Omnichannel CPaaS</span> (Live in Production)
   - Host: <a href="https://omni.mobiroute.in" target="_blank" style="color:#38bdf8; text-decoration:underline;">https://omni.mobiroute.in</a>
   - 50,000+ daily SMS/WhatsApp communications (99.2% delivery success)
   - Token-bucket rate limiting (20-60 req/min) & DLT regulatory compliance

2. <span class="res-highlight">SmartSchool Cloud</span> (Live in Production)
   - Host: <a href="https://smartschool.webarya.com" target="_blank" style="color:#38bdf8; text-decoration:underline;">https://smartschool.webarya.com</a>
   - Live GPS telemetry for 500+ active bus sessions (<2s latency) via Redis/Socket.io
   - Multi-tenant educational SaaS with 5-tier RBAC across 10+ modules

3. <span class="res-highlight">Company Brain</span>: Enterprise RAG Engine
   - Vector Search with Pinecone + OpenAI embeddings
   - Cut doc search latency by 40% across 1,000+ docs
   - Sub-second Whisper STT + GPT-4 summarization

4. <span class="res-highlight">Dracula</span>: Real-Time Multimodal Voice Assistant
   - Groq LLM (Llama 3.3 70B & Vision) with 35+ device/system tools
   - Sub-800ms end-to-end voice latency (OpenWakeWord + Faster-Whisper + Piper)
   - Android ADB bridge for WhatsApp, calls, & SMS dispatch
`,

    stats: () => `
<span class="res-highlight">[ENGINEERING TELEMETRY & STATS]</span>
- LeetCode Problems:   <span class="res-success">800+ solved</span> (DP, Graphs, System Design)
- Active Streak:       <span class="res-success">365 consecutive days</span> (Top 2% globally)
- CPaaS Daily Volume:  <span class="res-success">50,000+</span> messages delivered at 99.2% rate
- Bus Telemetry:       <span class="res-success">500+ concurrent sessions</span> with sub-2s alerts
- Voice Assistant:     <span class="res-success">&lt;800ms</span> end-to-end pipeline latency
- NPTEL IIT Kharagpur: <span class="res-success">Top 1% Elite + Topper</span> (Cloud Computing)
`,

    contact: () => `
<span class="res-highlight">[COMMUNICATION CHANNELS]</span>
Email:     <a href="mailto:sandeep22bcs11548@gmail.com" style="color:#38bdf8;">sandeep22bcs11548@gmail.com</a>
Phone:     <a href="tel:+919027445379" style="color:#38bdf8;">+91 9027445379</a>
GitHub:    <a href="https://github.com/Sandeepcmd" target="_blank" style="color:#38bdf8;">github.com/Sandeepcmd</a>
LinkedIn:  <a href="https://www.linkedin.com/in/sandeep-584682373" target="_blank" style="color:#38bdf8;">linkedin.com/in/sandeep-584682373</a>
LeetCode:  <a href="https://leetcode.com/u/sandeep1590/" target="_blank" style="color:#38bdf8;">leetcode.com/u/sandeep1590</a>
`,

    hire: () => {
      triggerRecruiterConfetti();
      sound.playChime();
      return `
<span class="res-success">🎉 RECRUITER FAST-TRACK ACTIVATED!</span>
Thank you for your interest! Sandeep brings:
- Production-tested distributed systems background (NestJS, Docker, Redis, PostgreSQL)
- Real-world AI/RAG deployment expertise (Groq, OpenAI, Pinecone, Whisper)
- Relentless algorithmic problem-solving grit (800+ LeetCode, 365-day streak)

👉 Direct Email: <span class="res-highlight">sandeep22bcs11548@gmail.com</span>
👉 Direct Call:  <span class="res-highlight">+91 9027445379</span>

Ready to schedule an interview? Let's connect!
`;
    }
  };

  function triggerRecruiterConfetti() {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  }

  function appendOutput(cmd, outputHtml) {
    const row = document.createElement('div');
    row.className = 'terminal-output';
    row.innerHTML = `<div><span class="prompt-prefix">sandeep@engineer:~$</span> <span class="cmd-text">${cmd}</span></div>${outputHtml}`;
    terminalBody.appendChild(row);
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  function executeCommand(rawCmd) {
    const cleanCmd = rawCmd.trim().toLowerCase();
    sound.playClick();

    if (!cleanCmd) return;

    if (cleanCmd === 'clear') {
      terminalBody.innerHTML = '';
      return;
    }

    if (COMMANDS[cleanCmd]) {
      const result = COMMANDS[cleanCmd]();
      appendOutput(cleanCmd, result);
    } else {
      appendOutput(cleanCmd, `<div class="res-dim">Command not found: "${cleanCmd}". Type <span class="res-highlight">help</span> for available commands.</div>`);
    }
  }

  terminalInput.addEventListener('keydown', (e) => {
    sound.playClick();
    if (e.key === 'Enter') {
      const val = terminalInput.value;
      terminalInput.value = '';
      executeCommand(val);
    }
  });

  quickButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      if (cmd) {
        executeCommand(cmd);
      }
    });
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      terminalBody.innerHTML = '';
      sound.playClick();
    });
  }
}
