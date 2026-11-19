// Detection rules for Satark.
// Each signal is a red flag (or, with a negative weight, a reassuring sign).
// Patterns are matched case-insensitively against the original text so
// that match positions can be highlighted in the UI.
//
// Note: JavaScript's \b only understands ASCII word characters, so
// Devanagari patterns are written without \b.

const NEG = String.raw`(?<!\b(?:not|never|don'?t|do\s+not|mat|na)\s+)`;
const ASK = String.raw`(?:share|send|tell|provide|give|forward|enter|type|read\s+out|batao|bataiye|bata\s*do|bhejo|bhej\s*do|de\s*do)`;
const SECRET = String.raw`(?:otp|one[\s-]?time[\s-]?password|cvv|upi\s*pin|atm\s*pin|m-?pin|pin|password|verification\s+code)`;

export const SIGNALS = [
  {
    id: 'credentials',
    weight: 32,
    patterns: [
      new RegExp(String.raw`\b${SECRET}\b[^.\n]{0,40}?${NEG}\b${ASK}\b`, 'gi'),
      new RegExp(String.raw`${NEG}\b${ASK}\b[^.\n]{0,30}?\b${SECRET}\b`, 'gi'),
      /(?:otp|ओटीपी|पिन)[^।\n]{0,30}(?:बताएं|बताइए|बताओ|बता\s*दें|भेजें|भेजो|शेयर)/gi,
    ],
    en: 'Asks you to share an OTP, PIN, CVV or password. No bank, police officer or company will ever ask for these.',
    hi: 'OTP, PIN, CVV या पासवर्ड बताने को कहा जा रहा है। कोई भी बैंक, पुलिस या कंपनी ये कभी नहीं माँगती।',
  },
  {
    id: 'remoteAccess',
    weight: 30,
    patterns: [/\b(?:any\s?desk|team\s?viewer|quick\s?support|rust\s?desk|air\s?droid|screen\s?shar(?:e|ing)|remote\s+access)\b/gi],
    en: 'Asks you to install a screen-sharing or remote-control app. This lets the scammer see your OTPs and control your phone.',
    hi: 'स्क्रीन-शेयरिंग या रिमोट ऐप डाउनलोड करने को कहा जा रहा है। इससे ठग आपका फ़ोन कंट्रोल कर सकता है और OTP देख सकता है।',
  },
  {
    id: 'apk',
    weight: 26,
    patterns: [/\b[\w-]+\.apk\b/gi, /\b(?:download|install)\s+(?:this|the|our|below)?\s*(?:app|apk|application)\s+(?:from|using|via)\s+(?:this|the|below)?\s*link\b/gi],
    en: 'Asks you to install an app from a link instead of the Play Store / App Store. Such apps can steal SMS and banking data.',
    hi: 'लिंक से ऐप डाउनलोड करने को कहा जा रहा है, Play Store से नहीं। ऐसे ऐप आपके SMS और बैंक की जानकारी चुरा सकते हैं।',
  },
  {
    id: 'payToReceive',
    weight: 26,
    patterns: [
      /\b(?:enter|use|type)\s+(?:your\s+)?(?:upi\s+)?pin\s+to\s+(?:receive|get|claim|accept)\b/gi,
      /\bscan\s+(?:this|the|my)?\s*qr(?:\s+code)?\s+to\s+(?:receive|get|claim)\b/gi,
      /\b(?:sent|transferred|credited|paid)\s+(?:to\s+you\s+)?(?:by\s+mistake|wrongly|accidentally)\b/gi,
      /\b(?:wrongly|mistakenly|accidentally)\s+(?:sent|transferred|credited|paid)\b/gi,
      /\b(?:accept|approve)\s+(?:the\s+)?(?:collect\s+)?request\s+to\s+(?:receive|get)\b/gi,
    ],
    en: 'Claims you must pay, scan a QR code or enter your UPI PIN to RECEIVE money. You never need a PIN to receive money.',
    hi: 'पैसे पाने के लिए QR स्कैन करने या UPI PIN डालने को कहा जा रहा है। पैसे पाने के लिए कभी PIN की ज़रूरत नहीं होती।',
  },
  {
    id: 'threat',
    weight: 18,
    patterns: [
      /\b(?:account|a\/c|sim|number|connection|electricity|power|card|wallet|pan|aadhaar)\b[^.\n]{0,35}?\b(?:block(?:ed)?|suspend(?:ed)?|deactivat(?:e|ed)|disconnect(?:ed)?|freez(?:e|ed)|frozen|band\s+ho)/gi,
      /\b(?:arrest(?:ed)?|warrant|fir\b|legal\s+action|jail|prison|police\s+case|court\s+case|penalty|non-?bailable)\b/gi,
      /गिरफ्तार|गिरफ़्तार|बंद\s*(?:हो|कर)|कानूनी\s*कार्रवाई|जेल/g,
    ],
    en: 'Threatens you with arrest, legal action, or blocking your account / SIM / electricity. Fear is used to stop you from thinking.',
    hi: 'गिरफ्तारी, कानूनी कार्रवाई या खाता/सिम/बिजली बंद करने की धमकी दी जा रही है। डर से आपको सोचने का मौका नहीं दिया जाता।',
  },
  {
    id: 'authority',
    weight: 14,
    patterns: [
      /\b(?:cbi|ncb|cyber\s*cell|crime\s*branch|customs|narcotics|enforcement\s+directorate|income\s*tax\s+(?:department|officer)|rbi|trai|dot\b|telecom\s+department|supreme\s+court|high\s+court|police\s+(?:station|officer|department)|(?:mumbai|delhi)\s+police|ips\s+officer|interpol)\b/gi,
      /सीबीआई|पुलिस|कस्टम|आरबीआई|क्राइम\s*ब्रांच/g,
    ],
    en: 'Claims to be from police, CBI, customs, RBI, TRAI or a court. Government agencies never contact or "arrest" people over WhatsApp or video calls.',
    hi: 'पुलिस, CBI, कस्टम, RBI, TRAI या कोर्ट का नाम लिया जा रहा है। सरकारी एजेंसियाँ कभी WhatsApp या वीडियो कॉल पर "गिरफ्तारी" नहीं करतीं।',
  },
  {
    id: 'secrecy',
    weight: 18,
    patterns: [
      /\b(?:do\s*n[o']?t|never)\s+(?:tell|inform|share\s+this\s+with)\s+(?:anyone|anybody|your\s+family|family|bank)\b/gi,
      /\b(?:keep\s+(?:this|it)\s+(?:confidential|secret)|strictly\s+confidential|stay\s+on\s+(?:the\s+)?(?:video\s+)?call|do\s*n[o']?t\s+(?:disconnect|cut)\s+(?:the\s+)?call|digital\s+arrest)\b/gi,
      /\bkisi\s+ko\s+(?:mat|na)\s+batan[ae]\b/gi,
      /किसी\s*को\s*(?:मत|न)\s*बता|गोपनीय/g,
    ],
    en: 'Tells you to keep it secret or stay on a call. Scammers isolate victims so family or the bank cannot warn them.',
    hi: 'बात छुपाने या कॉल पर बने रहने को कहा जा रहा है। ठग आपको परिवार से अलग रखना चाहते हैं ताकि कोई आपको सावधान न कर सके।',
  },
  {
    id: 'urgency',
    weight: 12,
    patterns: [
      /\b(?:urgent(?:ly)?|immediately|right\s+now|asap|today\s+itself|last\s+(?:chance|warning|reminder|date)|final\s+(?:notice|warning)|expir(?:e|es|ed|ing)\s+(?:today|tonight|soon)|within\s+\d+\s*(?:hours?|hrs?|minutes?|mins?)|before\s+(?:\d{1,2}(?::\d{2})?\s*(?:am|pm)|midnight)|tonight)\b/gi,
      /\b(?:turant|jaldi|abhi\s+ke\s+abhi)\b/gi,
      /तुरंत|जल्दी|आज\s*ही|अभी/g,
    ],
    en: 'Creates urgency ("immediately", "within 2 hours", "last warning"). Real institutions give you time to verify.',
    hi: 'जल्दबाज़ी कराई जा रही है ("तुरंत", "2 घंटे में", "आखिरी चेतावनी")। असली संस्थाएँ आपको जाँच करने का समय देती हैं।',
  },
  {
    id: 'moneyRequest',
    weight: 15,
    patterns: [
      /\b(?:security\s+deposit|processing\s+fee|registration\s+fee|verification\s+(?:fee|amount|charge)|refundable\s+(?:fee|amount|deposit)|clearance\s+(?:fee|charge)|tax\s+to\s+(?:release|claim)|safe\s+(?:account|custody)|rbi\s+(?:account|verification))\b/gi,
      /\b(?:pay|transfer|deposit|send)\s+(?:rs\.?|inr|₹)\s?\d/gi,
      /\b(?:pay|transfer|deposit|send)\s+(?:the\s+)?(?:amount|money|funds|fee|charges)\b/gi,
      /\bpaise\s+(?:bhejo|bhej\s*do|transfer\s+karo)\b/gi,
      /भुगतान\s*करें|पैसे\s*(?:भेजें|भेजो|जमा)|जमा\s*करें/g,
    ],
    en: 'Asks you to pay a fee, deposit or "verification amount", or move money to a "safe account". This is how the money is stolen.',
    hi: 'फ़ीस, डिपॉज़िट, "वेरिफ़िकेशन अमाउंट" या "सेफ अकाउंट" में पैसे भेजने को कहा जा रहा है। इसी तरह पैसे चुराए जाते हैं।',
  },
  {
    id: 'reward',
    weight: 14,
    patterns: [
      /\b(?:you\s+(?:have\s+)?won|winner|lottery|lucky\s+draw|jackpot|kbc|kaun\s+banega\s+crorepati|claim\s+your\s+(?:prize|reward|gift)|free\s+(?:gift|iphone|recharge)|reward\s+points?\s+(?:will\s+)?expir)/gi,
      /लॉटरी|इनाम|जीत\s*(?:लिया|गए)|उपहार/g,
    ],
    en: 'Promises a prize, lottery or free gift you never entered for. If you didn\'t enter, you didn\'t win.',
    hi: 'ऐसा इनाम या लॉटरी जिसमें आपने कभी हिस्सा ही नहीं लिया। अगर आपने भाग नहीं लिया, तो आप जीत नहीं सकते।',
  },
  {
    id: 'easyMoney',
    weight: 16,
    patterns: [
      /\b(?:earn|income\s+of|salary\s+of|make)\s+(?:rs\.?|inr|₹)?\s?[\d,]+\s*(?:\/-)?\s*(?:k\s+)?(?:daily|per\s+day|a\s+day|per\s+hour|weekly|from\s+home)/gi,
      /\b(?:part[\s-]?time\s+(?:job|work)|work\s+from\s+home|daily\s+(?:income|payout|earning)|(?:like|subscribe)\s+(?:youtube\s+)?videos?|simple\s+tasks?|prepaid\s+tasks?|ghar\s+baithe)\b/gi,
      /\b(?:guaranteed\s+(?:returns?|profit|income)|double\s+(?:your\s+)?money|\d+\s*%\s+(?:daily|weekly|monthly)\s+(?:returns?|profit)|risk[\s-]?free\s+(?:returns?|profit|investment))\b/gi,
      /घर\s*बैठे|रोज़?\s*कमाएं|पार्ट\s*टाइम/g,
    ],
    en: 'Promises easy money: high daily pay for simple tasks, or "guaranteed" investment returns. Real jobs don\'t pay for liking videos; real investments are never guaranteed.',
    hi: 'आसान पैसे का वादा: छोटे-छोटे टास्क के लिए रोज़ की मोटी कमाई या "गारंटीड" रिटर्न। असली नौकरी वीडियो लाइक करने के पैसे नहीं देती।',
  },
  {
    id: 'kyc',
    weight: 14,
    patterns: [
      /\b(?:re-?kyc|e-?kyc|kyc\s+(?:update|expir\w*|pending|incomplete|verification|not\s+updated)|update\s+(?:your\s+)?kyc|(?:pan|aadhaar|aadhar)\s+(?:card\s+)?(?:update|link(?:ing)?|not\s+linked|verification))\b/gi,
      /केवाईसी|KYC\s*अपडेट/gi,
    ],
    en: 'Says your KYC / PAN / Aadhaar needs urgent updating via a link or call. Banks ask you to update KYC only in the branch, app or official website.',
    hi: 'KYC / PAN / आधार तुरंत अपडेट करने को कहा जा रहा है। बैंक KYC सिर्फ़ ब्रांच, ऑफ़िशियल ऐप या वेबसाइट पर अपडेट कराते हैं।',
  },
  {
    id: 'personalInfo',
    weight: 12,
    patterns: [
      /\b(?:send|share|upload|provide|submit)\b[^.\n]{0,30}?\b(?:aadhaar|aadhar|pan\s+card|bank\s+details|account\s+(?:number|details)|card\s+(?:number|details)|date\s+of\s+birth|selfie|photo\s+id)\b/gi,
    ],
    en: 'Asks for personal documents or bank details (Aadhaar, PAN, account or card number). These are used for identity theft and fraud.',
    hi: 'आधार, PAN, बैंक खाता या कार्ड नंबर जैसी निजी जानकारी माँगी जा रही है। इनसे पहचान चोरी और धोखाधड़ी होती है।',
  },
  {
    id: 'moveChannel',
    weight: 10,
    patterns: [
      /\b(?:telegram|t\.me\/\S+|signal\s+app|join\s+(?:our|this|the|my)\s+(?:whatsapp\s+|vip\s+|telegram\s+)?group|contact\s+(?:me\s+)?(?:on|via)\s+whatsapp|whatsapp\s+(?:me|on))\b/gi,
    ],
    en: 'Moves the conversation to Telegram or a WhatsApp group. Scam "jobs" and "investment tips" usually run in such groups.',
    hi: 'बातचीत Telegram या WhatsApp ग्रुप पर ले जाई जा रही है। नकली "जॉब" और "इन्वेस्टमेंट टिप्स" अक्सर ऐसे ग्रुप में चलते हैं।',
  },
  {
    id: 'familyEmergency',
    weight: 16,
    patterns: [
      /\b(?:hi|hello|hey)\s+(?:mom|mum|mummy|maa|dad|papa|beta)\b/gi,
      /\b(?:this\s+is\s+my\s+new\s+number|my\s+(?:old\s+)?phone\s+(?:is\s+)?(?:broken|lost)|lost\s+my\s+phone|mera\s+naya\s+number)\b/gi,
    ],
    en: 'Pretends to be a family member with a new number or an emergency. Call the person on their OLD number before sending anything.',
    hi: 'परिवार का सदस्य बनकर नया नंबर या इमरजेंसी बताई जा रही है। कुछ भी भेजने से पहले उनके पुराने नंबर पर कॉल करें।',
  },
  {
    id: 'loan',
    weight: 12,
    patterns: [/\b(?:instant\s+loan|pre-?approved\s+loan|loan\s+(?:approved|sanctioned)|no\s+cibil|without\s+(?:cibil|documents?)|zero\s+documents?)\b/gi],
    en: 'Offers an instant / pre-approved loan with no checks. Fake loan apps charge "fees" upfront, then harass and blackmail borrowers.',
    hi: 'बिना जाँच के तुरंत लोन का ऑफ़र। नकली लोन ऐप पहले "फ़ीस" लेते हैं, फिर परेशान और ब्लैकमेल करते हैं।',
  },
  {
    id: 'cryptoGiftCard',
    weight: 14,
    patterns: [/\b(?:gift\s*cards?|usdt|bitcoin|btc|crypto\s+wallet|google\s+play\s+(?:card|code)|amazon\s+pay\s+(?:card|voucher))\b/gi],
    en: 'Asks for payment in crypto (USDT/Bitcoin) or gift cards. These are untraceable, which is exactly why scammers want them.',
    hi: 'क्रिप्टो (USDT/Bitcoin) या गिफ़्ट कार्ड से भुगतान माँगा जा रहा है। इनका पता लगाना मुश्किल है, इसलिए ठग इन्हें पसंद करते हैं।',
  },
  {
    id: 'callBack',
    weight: 12,
    patterns: [
      /\b(?:call|contact|whatsapp|dial|reach)\s+(?:our|the|this|my)?\s*(?:electricity\s+|bank\s+|customs\s+|senior\s+)?(?:officer|executive|agent|helpline|customer\s+care|department|manager|number)\b/gi,
      /\b(?:call|dial)\s+(?:on|at|us\s+at)?\s*(?:\+?\d[\d\s-]{8,})/gi,
    ],
    en: 'Asks you to call or WhatsApp a number given in the message. Scammers answer these numbers. Use only the number on your card, bill or official website.',
    hi: 'मैसेज में दिए नंबर पर कॉल करने को कहा जा रहा है। ये नंबर ठग ही उठाते हैं। सिर्फ़ कार्ड, बिल या ऑफ़िशियल वेबसाइट पर दिया नंबर इस्तेमाल करें।',
  },
  {
    id: 'genericGreeting',
    weight: 5,
    patterns: [/\b(?:dear\s+(?:customer|consumer|user|sir\/madam|sir\s*\/\s*madam|valued\s+customer|account\s+holder|beneficiary|candidate))\b/gi],
    en: 'Uses a generic greeting ("Dear Customer"). Your real bank usually knows your name.',
    hi: '"प्रिय ग्राहक" जैसा आम संबोधन। आपका असली बैंक आमतौर पर आपका नाम जानता है।',
  },
  {
    id: 'safeOtpNotice',
    weight: -10,
    reassuring: true,
    patterns: [new RegExp(String.raw`\b(?:do\s+not|don'?t|never)\s+share\s+(?:it|this|the\s+otp|your\s+otp|otp)?\s*(?:with\s+anyone|with\s+anybody)?`, 'gi')],
    en: 'Warns you NOT to share the OTP. Genuine bank OTP messages do this (but still check the sender).',
    hi: 'OTP किसी से शेयर न करने की चेतावनी है। असली बैंक के OTP मैसेज में ऐसा लिखा होता है (फिर भी भेजने वाले को जाँचें)।',
  },
];

// Scam families. A message is classified as the family with the most
// distinct keyword hits (needs at least 2).
export const SCAM_TYPES = [
  {
    id: 'digitalArrest',
    keywords: [/digital\s+arrest/i, /\b(?:parcel|courier|fedex|dhl|package)\b/i, /\b(?:drugs|narcotics|mdma|contraband|illegal\s+items)\b/i, /money\s+laundering/i, /\b(?:cbi|ncb|crime\s+branch|customs|cyber\s*cell)\b/i, /video\s+call/i, /\b(?:aadhaar|aadhar)\b[^.\n]{0,30}\bmisuse/i, /\b(?:arrest|warrant)\b/i, /\b(?:police|सीबीआई|पुलिस)\b/i, /\bfir\b/i],
  },
  {
    id: 'kycBank',
    keywords: [/\bkyc\b/i, /\b(?:account|a\/c)\b[^.\n]{0,30}\b(?:block|suspend|freez|deactivat)/i, /\bpan\b[^.\n]{0,20}\b(?:update|link)/i, /\b(?:sbi|hdfc|icici|axis|kotak|pnb|bank\s+of\s+baroda|yono|net\s*banking)\b/i, /\b(?:credit\s+card|reward\s+points?)\b/i, /केवाईसी|खाता/],
  },
  {
    id: 'taskJob',
    keywords: [/part[\s-]?time/i, /work\s+from\s+home/i, /\b(?:like|subscribe)\b[^.\n]{0,20}\bvideos?\b/i, /\btasks?\b/i, /\btelegram\b/i, /\b(?:daily|per\s+day)\b/i, /\b(?:hr|hiring|recruit|job\s+offer|salary)\b/i, /\b(?:reviews?|ratings?)\b[^.\n]{0,20}\b(?:google|hotel|map)/i, /घर\s*बैठे|पार्ट\s*टाइम/],
  },
  {
    id: 'investment',
    keywords: [/\b(?:stock|share\s+market|trading|ipo|demat|nifty|sensex)\b/i, /\bguaranteed\b/i, /\b(?:returns?|profit)\b/i, /\b(?:crypto|usdt|bitcoin)\b/i, /\bvip\s+group\b/i, /\b(?:invest(?:ment)?|portfolio)\b/i, /\bsebi\b/i],
  },
  {
    id: 'lottery',
    keywords: [/\blottery\b/i, /\b(?:kbc|kaun\s+banega\s+crorepati)\b/i, /\b(?:you\s+(?:have\s+)?won|winner)\b/i, /\b(?:prize|lucky\s+draw|jackpot)\b/i, /\b(?:gift|reward)\b/i, /लॉटरी|इनाम/],
  },
  {
    id: 'upiRefund',
    keywords: [/\b(?:by\s+mistake|wrongly|accidentally|mistakenly)\b/i, /\brefund\b/i, /\bqr\b/i, /\bupi\b/i, /\bcollect\s+request\b/i, /\b(?:cashback|paytm|phonepe|google\s*pay|gpay)\b/i],
  },
  {
    id: 'utility',
    keywords: [/\belectricity\b/i, /\b(?:bijli|बिजली)\b/i, /\bpower\b[^.\n]{0,20}\b(?:cut|disconnect)/i, /\bbill\b[^.\n]{0,25}\b(?:not\s+updated|pending|unpaid)/i, /\b(?:electricity\s+officer|lineman)\b/i, /\b(?:gas\s+connection|sim\s+(?:card\s+)?(?:will\s+be\s+)?block)/i],
  },
  {
    id: 'delivery',
    keywords: [/\b(?:delivery|shipment|package)\b/i, /\b(?:india\s*post|speed\s*post|bluedart|delhivery)\b/i, /\b(?:address|pin\s*code)\b[^.\n]{0,25}\b(?:incomplete|incorrect|wrong|update)/i, /\b(?:redeliver|re-?delivery|held\s+at|warehouse)\b/i],
  },
  {
    id: 'loanApp',
    keywords: [/\bloan\b/i, /\b(?:cibil|credit\s+score)\b/i, /\b(?:instant|pre-?approved)\b/i, /\b(?:emi|disburse)/i],
  },
  {
    id: 'impersonation',
    keywords: [/\bnew\s+number\b/i, /\b(?:mom|mum|mummy|maa|dad|papa|beta|uncle|bhaiya)\b/i, /\b(?:accident|hospital|emergency)\b/i, /\b(?:phone\s+(?:is\s+)?(?:broken|lost)|lost\s+my\s+phone)\b/i, /naya\s+number/i],
  },
];

// Brands commonly impersonated in India, mapped to their official domains.
export const BRANDS = {
  sbi: ['sbi.co.in', 'onlinesbi.sbi', 'sbi.bank.in', 'sbicard.com', 'yonobusiness.sbi', 'sbi'],
  hdfc: ['hdfcbank.com', 'hdfc.com', 'hdfcbank.bank.in'],
  icici: ['icicibank.com', 'icici.bank.in', 'icicidirect.com'],
  axis: ['axisbank.com', 'axis.bank.in'],
  kotak: ['kotak.com', 'kotak.bank.in'],
  pnb: ['pnbindia.in', 'pnb.bank.in'],
  paytm: ['paytm.com', 'paytmbank.com'],
  phonepe: ['phonepe.com'],
  gpay: ['pay.google.com', 'google.com'],
  amazon: ['amazon.in', 'amazon.com', 'amzn.in', 'amzn.to'],
  flipkart: ['flipkart.com', 'fkrt.it'],
  uidai: ['uidai.gov.in'],
  aadhaar: ['uidai.gov.in', 'myaadhaar.uidai.gov.in'],
  incometax: ['incometax.gov.in'],
  irctc: ['irctc.co.in'],
  indiapost: ['indiapost.gov.in'],
  epfo: ['epfindia.gov.in', 'epfo.gov.in'],
  npci: ['npci.org.in'],
  rbi: ['rbi.org.in'],
  sebi: ['sebi.gov.in'],
  jio: ['jio.com'],
  airtel: ['airtel.in', 'airtel.com'],
  bsnl: ['bsnl.co.in'],
  fedex: ['fedex.com'],
  dhl: ['dhl.com', 'dhl.co.in'],
  bescom: ['bescom.karnataka.gov.in', 'bescom.co.in'],
  tatapower: ['tatapower.com', 'tatapower-ddl.com'],
};

export const SHORTENERS = new Set([
  'bit.ly', 'tinyurl.com', 'cutt.ly', 'is.gd', 't.ly', 'rb.gy', 'shorturl.at', 'ow.ly', 'tiny.cc',
  'goo.gl', 'rebrand.ly', 'v.gd', 'bl.ink', 'short.io', 'shorte.st', 'adf.ly', 's.id', 'qr.ae', 'surl.li',
]);

export const RISKY_TLDS = new Set([
  'xyz', 'top', 'click', 'buzz', 'icu', 'live', 'online', 'site', 'info', 'link', 'rest', 'monster',
  'cfd', 'sbs', 'lol', 'work', 'loan', 'win', 'bid', 'vip', 'cyou', 'gq', 'ml', 'cf', 'tk', 'ga', 'pw', 'mobi',
]);

// UPI handle suffixes (personal VPAs). An unknown "name@handle" in a
// message that also asks for money is a strong sign.
export const UPI_HANDLES = [
  'ybl', 'ibl', 'axl', 'okaxis', 'okhdfcbank', 'okicici', 'oksbi', 'paytm', 'upi', 'apl', 'yapl', 'ptyes',
  'ptsbi', 'pthdfc', 'ptaxis', 'axisbank', 'icici', 'sbi', 'hdfcbank', 'kotak', 'freecharge', 'airtel',
  'jio', 'fbl', 'ikwik', 'waicici', 'naviaxis', 'superyes', 'cnrb', 'barodampay', 'pnb', 'unionbank',
  'idfcbank', 'rbl', 'indus', 'federal', 'abfspay', 'yesbank', 'aubank', 'dbs', 'kbl', 'axisb', 'postbank',
];
