// Builds the WhatsApp warning and the cybercrime complaint draft.
import { UI, SCAM_INFO } from './i18n.js';

export function shareText(result, lang, appUrl) {
  const t = UI[lang];
  const type = result.scamType ? SCAM_INFO[result.scamType][lang].name : '-';
  const flags = result.signals.slice(0, 3).map((s) => `• ${s[lang]}`).join('\n');
  const preview = result.text.length > 220 ? result.text.slice(0, 220) + '…' : result.text;
  return [
    t.shareIntro,
    `${t.shareRisk}: ${result.score}/100 · ${t.verdict[result.level]}`,
    `${t.shareType}: ${type}`,
    flags ? `${t.shareFlags}:\n${flags}` : '',
    `"${preview}"`,
    t.shareAdvice,
    appUrl ? `${appUrl}` : '',
  ].filter(Boolean).join('\n\n');
}

export function whatsappUrl(text) {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

// Always in English: the national portal and helpline work in English.
export function complaintDraft(result, now = new Date()) {
  const type = result.scamType ? SCAM_INFO[result.scamType].en.name : 'Suspected online fraud';
  const lines = [
    'COMPLAINT: SUSPECTED CYBER FRAUD COMMUNICATION',
    `Date noted: ${now.toLocaleString('en-IN')}`,
    `Category: ${type}`,
    '',
    'I received the following suspicious message:',
    `"${result.text.trim()}"`,
    '',
  ];
  if (result.phones.length) lines.push(`Phone number(s) used: ${result.phones.map((p) => p.digits).join(', ')}`);
  if (result.urls.length) lines.push(`Link(s) in message: ${result.urls.map((u) => u.url.replace(/\./g, '[.]')).join(', ')}`);
  if (result.upis.length) lines.push(`UPI ID(s) mentioned: ${result.upis.map((u) => u.value).join(', ')}`);
  lines.push(
    '',
    'Fraud indicators observed:',
    ...result.signals.map((s) => `- ${s.en}`),
    '',
    'Sender: [phone number / WhatsApp / SMS header]',
    'Date & time received: [fill in]',
    'Money lost (if any): [amount, transaction ID / UTR, bank, date]',
    '',
    'Please take action against the sender and block the above numbers/links.',
  );
  return lines.join('\n');
}
