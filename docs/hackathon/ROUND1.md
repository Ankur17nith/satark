# Orbix 2026, Round 1: Problem and Innovation

**Project:** Satark
**Summary:** A free scam checker for India. Paste a suspicious SMS, WhatsApp message or link and it tells you whether it is a scam, which kind, why, and what to do next, in English or Hindi. Analysis runs entirely on the user's phone.

## 1. The problem

Cyber fraud in India is growing quickly:

- ₹22,845 crore was lost to cyber fraud in 2024, up 206% from ₹7,465 crore in 2023.
- 36.37 lakh cyber-fraud complaints were filed in 2024 (NCRP and CFCFRMS).
- "Digital arrest" cases rose from 39,925 (₹91 crore) in 2022 to 1,23,672 (₹1,935 crore) in 2024. The Prime Minister warned about this scam in *Mann Ki Baat* in October 2024.

Source: Ministry of Home Affairs reply in Parliament, March 2025 (I4C / NCRP data).

Most of these scams are not technically sophisticated. They depend on pressure: fear of arrest or a blocked account, deadlines ("within 2 hours"), impersonated authorities (CBI, RBI, police), unrealistic rewards (₹3,000 a day for liking videos) and isolation ("don't tell your family"). Victims usually act alone and quickly, before anyone can warn them.

Awareness campaigns explain scams in general, but there is little help at the moment someone is looking at a specific suspicious message. Asking a relative takes time and can be embarrassing. Existing checkers mostly look up URLs or phone numbers, work only in English, require an account, or send the message to a server.

## 2. Target users

| User | Main risk |
|---|---|
| Parents and older adults (55+) | Digital arrest, KYC and electricity-disconnection scams; often more comfortable in Hindi |
| Students and young job-seekers | Part-time "task" jobs and fake investment groups |
| First-time digital-payment users, small merchants | UPI "wrong transfer", QR-code and collect-request scams |
| Family members who get asked "is this real?" | Need a quick way to check and to explain the answer |

## 3. The solution

A web app that can be installed on a phone and works offline. The user pastes a message and gets:

1. A verdict and a risk score from 0 to 100.
2. The scam type (10 families common in India) with a short explanation of how that scam works and how to respond.
3. The exact phrases that raised the score, highlighted, each with a reason (for example, "Police never arrest people over a video call").
4. A check of every link, phone number and UPI ID: look-alike bank domains, URL shorteners, `.apk` downloads, fake government sites, foreign numbers. Official domains are recognised.
5. Next steps: a WhatsApp message to warn family, a complaint draft for cybercrime.gov.in or the 1930 helpline, and a link to Sanchar Saathi (Chakshu).

## 4. What is different

- **It reads the message, not just the link.** Most tools check a URL or number against a list; Satark looks at the wording scammers use.
- **English, Hindi and Hinglish.** Detection and every explanation work in both languages.
- **Explainable.** The score is built from highlighted phrases, so the user can see why a message was flagged.
- **Private.** The message never leaves the phone. There is no server, account or tracking.
- **Specific to India.** The rules cover digital arrest, UPI collect requests, electricity disconnection and task-job scams, and point to Indian reporting channels (1930, cybercrime.gov.in, Chakshu).
- **Leads to action.** A check ends with concrete steps, not just a label.

Because it names the scam, the user learns to recognise that pattern next time without the app.

## 5. Feasibility

- **Technology:** HTML, CSS and JavaScript with no dependencies or build step. The detection engine has 19 weighted signals, 11 link checks, 5 combination rules and a scam-type classifier.
- **Cost:** static hosting on GitHub Pages; no servers or paid APIs.
- **Quality:** automated tests cover scam detection, ordinary messages that must not be flagged, negation ("do not share") and link analysis. They run on every push.
- **Scope:** the core engine, bilingual interface, link analysis and action steps fit the 48-hour build. Screenshot checking and more languages are planned next.

## 6. Impact

- Helps at the moment of decision, which is when prevention works.
- Usable by people who are most often targeted: Hindi support, no sign-up, works in any phone browser.
- Sharing a warning to a family WhatsApp group spreads awareness where these scams circulate.
- Faster reporting: the complaint draft and 1930 prompt help victims report quickly, while banks can still freeze funds.
- Can be embedded or adopted by banks, NGOs or police cyber cells at no running cost.

**Measures of success:** messages checked, share of checks flagged high-risk, warnings shared, complaint drafts copied, and returning users.
