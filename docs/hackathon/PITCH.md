# Round 3: Demo video script, LinkedIn post, checklist

## 2½-minute video script

The finished video (`docs/media/satark-demo.mp4`) follows this script as a narrated pitch: a voiceover (synthetic voice, Kokoro) speaks each line over the matching scene, with music ducked under it. Captions for LinkedIn are in `docs/media/satark-demo.en.srt`.

| Time | On screen | Say |
|---|---|---|
| 0:00–0:20 | A WhatsApp video-call screenshot / the digital-arrest sample | "Last year Indians lost **₹22,845 crore** to cyber fraud, three times more than the year before. One scam, 'digital arrest', took ₹1,935 crore. Victims are told they're under arrest, kept on a video call for hours, and told not to tell anyone." |
| 0:20–0:35 | Satark home screen | "The problem isn't that people don't care. It's that at the moment they're holding the message, they're scared, rushed, and alone. So we built **Satark**." |
| 0:35–1:15 | Tap *Digital arrest* → result | "Paste the message. In one second: **95, very likely a scam**. It names it as the digital-arrest scam, explains how it works, and highlights the exact red flags: police claims, 'don't tell anyone', 'transfer to RBI account', a foreign (+92) number. Every point of the score is explained. No black box." |
| 1:15–1:35 | Tap *KYC / bank block*, scroll to link card | "Links are inspected too. This one pretends to be SBI, but it's a cheap `.xyz` domain, not secure, with bait words. The real `onlinesbi.sbi` is marked official." |
| 1:35–1:50 | Switch to हिं, tap *Hindi message* | "Most victims are more comfortable in Hindi, so Satark understands Hindi and Hinglish scam language and explains everything in Hindi." |
| 1:50–2:05 | Tap *Genuine OTP* → green 0 | "It doesn't cry wolf. A real bank OTP saying 'do not share' scores zero." |
| 2:05–2:20 | Tap *Warn family on WhatsApp*, *Copy complaint draft*, 1930 banner | "And it turns detection into action: warn your family group in one tap, a ready complaint for cybercrime.gov.in, and 1930 if money is gone." |
| 2:20–2:35 | End card / your photo | "It's 100% private: everything runs on your phone. Free, no login, works offline. I built Satark end to end: research, the detection engine, the bilingual UI and this video. Satark: stay alert, stay safe." |

**Recording tips:** use a phone-sized browser window (or real phone screen-record), turn on Do Not Disturb, zoom to 125%, keep the cursor still, add captions (many people watch muted on LinkedIn), and put background music low.

## LinkedIn post template

```
Indians lost ₹22,845 crore to cyber fraud in 2024. For #Orbix by Makers Need More (MnM), I built Satark to help people check a suspicious message before they act on it.

Paste an SMS, WhatsApp message or link, and Satark tells you:
- whether it is likely a scam (risk score 0–100)
- which scam it is: digital arrest, fake KYC, part-time task job, UPI refund, electricity cut-off and more
- why: every red-flag phrase is highlighted and explained
- what to do next: warn family on WhatsApp, a complaint draft for cybercrime.gov.in, the 1930 helpline

It works in English and Hindi, runs entirely on your phone (nothing is uploaded), and can be installed and used offline.

Try it: https://ankur17nith.github.io/satark/
Code: https://github.com/Ankur17nith/satark
Demo: video attached

I built it solo: research, the detection engine and scam rules, link analysis, the bilingual interface, tests and the demo video.

Thanks to Makers Need More (MnM) for organising Orbix.
#Hackathon #CyberSecurity #DigitalIndia #ScamAwareness #Orbix #MnM
```

Attach: the demo video, plus 3–4 screenshots from the build journey (whiteboard/idea, first ugly version, test results passing, final app).

## Checklist before 22 Nov 7 PM

- [ ] Live link https://ankur17nith.github.io/satark/ works on a phone (open in an incognito window)
- [ ] GitHub repo https://github.com/Ankur17nith/satark is public, README has screenshots + live link
- [x] Demo video ≤ 3 min with on-screen captions (`docs/media/satark-demo.mp4`)
- [ ] LinkedIn post tags **Makers Need More (MnM)**, includes live link + repo + video + your contribution
- [ ] Journey photos and screenshots attached
- [ ] Submit the post link on Unstop
