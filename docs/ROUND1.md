# Round 1 submission: Problem & Innovation

**Project:** Satark: Is this message a scam?
**One-liner:** A private, bilingual (English + Hindi) scam checker. Paste any SMS, WhatsApp message or link and in one second learn whether it's a scam, which scam, why, and exactly what to do next.

---

## 1. The problem

India's digital payments boom has created a fraud epidemic.

- **₹22,845 crore** lost to cyber fraud in 2024, up **206%** from ₹7,465 crore in 2023.
- **36.37 lakh** cyber-fraud complaints in 2024 (NCRP + CFCFRMS).
- **"Digital arrest" scams** grew from 39,925 cases (₹91 crore) in 2022 to **1,23,672 cases (₹1,935 crore)** in 2024. The Prime Minister warned the nation about them in *Mann Ki Baat* (Oct 2024).

*Source: Ministry of Home Affairs reply in Parliament (March 2025), I4C / NCRP data.*

The scams are not technically sophisticated. They are **psychological**: fear (arrest, account block), urgency ("within 2 hours"), authority (CBI, RBI, police), greed (₹3,000/day for liking videos) and isolation ("don't tell your family"). Victims act in the moment, alone, before anyone can warn them.

**The gap:** awareness campaigns tell people *in general* to be careful, but nothing helps them **at the moment they're holding a specific suspicious message**. Asking a relative is slow and embarrassing. Existing tools are English-only, built for URLs not conversational messages, need logins, or upload your private messages to a server.

## 2. Who it's for

| User | Pain |
|---|---|
| **Parents & elderly (55+)** | Most targeted by digital arrest, KYC and electricity scams. Less familiar with tech, often more comfortable in Hindi |
| **Students & young job-seekers** | Main targets of part-time "task" job and fake investment scams |
| **First-time digital-payment users** (tier-2/3 cities, small merchants) | UPI "wrong transfer", QR and collect-request scams |
| **Families** | The "tech-savvy child" who gets forwarded every suspicious message and needs a fast way to check and explain |

## 3. The solution

A web app (installable, works offline) with one job: **paste → understand → act.**

1. **Verdict and risk score (0–100):** *No obvious signs / Suspicious / Very likely a SCAM*.
2. **Names the scam type** (10 families common in India) and explains in plain language how that scam works and how to protect yourself.
3. **Highlights the exact red-flag phrases** in the message, with a reason for each ("Police never arrest people over video call").
4. **Inspects every link, phone number and UPI ID:** look-alike bank domains, shortened links, `.apk` downloads, fake government sites, foreign numbers, UPI handles. It recognises official domains.
5. **Act immediately:** warn family on WhatsApp in one tap, copy a ready complaint draft for **cybercrime.gov.in / 1930**, report to **Sanchar Saathi (Chakshu)**, and a prominent *"Lost money? Call 1930 now"* button.

## 4. What makes it unique

| | Satark | Typical scam checkers |
|---|---|---|
| Understands **conversational scam language**, not just URLs | ✅ | ❌ mostly URL/number lookup |
| **Hindi + Hinglish + English** detection *and* explanations | ✅ | ❌ English only |
| **Explainable:** every point of the score is traced to a highlighted phrase | ✅ | ❌ black-box "safe/unsafe" |
| **100% on-device:** private messages never leave the phone | ✅ | ❌ upload to server / AI API |
| **India-specific playbook:** digital arrest, UPI collect, electricity, task jobs, Chakshu/1930 | ✅ | ❌ generic |
| **Turns detection into action:** family warning + complaint draft | ✅ | ❌ |
| Free, no login, no app store, works offline, loads on cheap phones | ✅ | varies |

It also tells you *which* scam you're facing, so it **teaches**. A user who has seen "this is the digital-arrest scam" once will recognise it next time without the app.

## 5. Feasibility

- **Technology:** pure HTML/CSS/JavaScript (ES modules). A rule-based, explainable detection engine (19 weighted signal detectors, 11 URL checks, scam-family classifier, combination rules). No servers, no paid APIs, so it costs ₹0 to run at any scale.
- **Deployment:** a static site (GitHub Pages / Netlify), plus a PWA for install, offline use and *Share → Satark* from WhatsApp on Android.
- **Quality:** an automated test suite covers scam detection, false-positive checks on everyday messages, negation handling and URL analysis.
- **Scope for 48 hours:** core engine + bilingual UI + link analysis + action flow. Stretch goals: screenshot OCR, more languages.

## 6. Potential impact

- **Prevents losses at the decision moment,** the only point where prevention really works.
- **Reaches the most vulnerable:** Hindi-first, no sign-up, works on any phone browser.
- **Network effect through families:** every check can become a WhatsApp warning to a family group, spreading awareness exactly where scams spread.
- **Faster reporting:** complaint drafts plus 1930 nudges help victims report within the "golden hour", when banks can still freeze stolen funds.
- **Scales freely:** no server cost. NGOs, banks, police cyber cells or Sanchar Saathi could embed it.

**Success metrics:** messages checked; percentage flagged high-risk; WhatsApp warnings shared; complaint drafts copied; returning users who recognise scams without help.
