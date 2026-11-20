# Detection rules

Satark's engine is deliberately rule-based and transparent: every point of the score comes from something the user can see highlighted, with a plain-language reason. This page explains how it works and how to extend it.

## Signals

A **signal** is a red flag with a weight, one or more regex patterns (English, Hinglish and Devanagari), and an explanation in English and Hindi. Each signal counts **once**, however many times it matches. All matches are highlighted.

| Signal | Weight | What it catches |
|---|---|---|
| `credentials` | 32 | Requests to share an OTP, PIN, CVV or password (ignores "do **not** share") |
| `remoteAccess` | 30 | AnyDesk, TeamViewer, QuickSupport, screen sharing |
| `apk` | 26 | `.apk` files, "install the app from this link" |
| `payToReceive` | 26 | "Enter UPI PIN / scan QR to *receive*", "sent by mistake" |
| `threat` | 18 | Arrest, warrant, FIR, account/SIM/electricity "will be blocked" |
| `secrecy` | 18 | "Don't tell anyone", "stay on the video call", "digital arrest" |
| `easyMoney` | 16 | "Earn ₹3000 daily", task jobs, "guaranteed returns" |
| `familyEmergency` | 16 | "Hi mom, this is my new number" |
| `moneyRequest` | 15 | Processing fees, deposits, "RBI verification account" |
| `authority` | 14 | CBI, police, customs, RBI, TRAI, courts |
| `reward` | 14 | Lottery, KBC, "you have won" |
| `kyc` | 14 | KYC/PAN/Aadhaar "update" pressure |
| `cryptoGiftCard` | 14 | USDT, Bitcoin, gift-card payments |
| `urgency` | 12 | "Immediately", "within 2 hours", "tonight", "last warning" |
| `personalInfo` | 12 | Requests for Aadhaar, PAN, account or card numbers |
| `loan` | 12 | "Instant loan", "no CIBIL" |
| `callBack` | 12 | "Call our officer on …" |
| `moveChannel` | 10 | Telegram, "join our WhatsApp group" |
| `genericGreeting` | 5 | "Dear Customer" |
| `safeOtpNotice` | **−10** | Reassuring: "Do not share it with anyone" (as in genuine OTP SMS) |

## Links, phone numbers and UPI IDs

`links.js` extracts these and adds their risk to the score.

| Link check | Weight |
|---|---|
| Brand look-alike (e.g. `sbi-kyc-update.xyz`) | 30 |
| Raw IP address host | 25 |
| Punycode (look-alike characters) | 25 |
| Direct `.apk` download | 25 |
| Fake government domain (not `.gov.in` / `.nic.in`) | 25 |
| URL shortener | 15 |
| `@` userinfo trick | 15 |
| Risky TLD (`.xyz`, `.top`, `.click`, …) | 12 |
| Plain `http://` | 8 |
| Many hyphens or subdomains | 8 |
| Bait words (`kyc`, `verify`, `refund`, …) in the address | 8 |

- **Official domains** for 27 commonly impersonated brands (banks, UPI apps, Amazon, Flipkart, UIDAI, Income Tax, IRCTC, couriers, telecoms…) plus any `*.gov.in` / `*.nic.in` host are trusted. They get a small negative weight and a green "Official domain" label.
- The riskiest link counts fully; additional links count at half weight.
- **Foreign phone numbers** (not +91) add 15.
- **UPI IDs** add 8, or 18 when the message also asks for money or a PIN.

## Combination rules

Some tactics are far more dangerous together than apart:

| Combo | Bonus |
|---|---|
| authority + threat (the digital-arrest shape) | +15 |
| authority + secrecy | +15 |
| urgency + credentials | +10 |
| kyc + threat | +10 |
| unofficial link + (urgency / threat / kyc / reward) | +10 |

## Scoring

```
raw   = Σ signal weights + link/phone/UPI weights + combo bonuses
score = round(100 × (1 − e^(−raw / 45)))      capped at 99, floored at 0
level = high (≥ 55) · suspicious (≥ 20) · low (< 20)
```

The curve saturates, so one strong sign alone gives about 50 ("Suspicious"), and two or three independent signs push it to "Very likely a SCAM". A score of 0 never means "safe": the UI always says "no obvious signs" and asks the user to verify the sender.

## Scam-type classification

When the level isn't low, each of the 10 families in `SCAM_TYPES` counts how many of its keyword patterns appear. The family with the most hits (at least 2) is shown with its explanation and tips from `SCAM_INFO` in `i18n.js`.

## Known limits

- Rules detect *language patterns*. A scam phrased in a completely new way, or in a language other than English or Hindi, can score low. Report misses with the **Report a scam pattern** issue template.
- Screenshots (images) aren't analysed. Users must paste text.
- Satark doesn't look up live reputation databases, by design, so nothing leaves the device.

## Extending

See [CONTRIBUTING.md](../CONTRIBUTING.md#adding-or-improving-a-detection-rule). Every new rule needs a test for a message it catches *and* a genuine message it must not flag.
