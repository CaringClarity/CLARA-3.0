import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const knowledgeBase = `
Caring Clarity Counseling is a telehealth-only practice.
We do not accept Medicaid or Medicare.
We see children ages 10 and older.
We provide services for individuals, couples, and children.
Accepted insurance plans include Aetna, Cigna, Horizon BCBS, UHC, Optum, Evernorth MHC, Carebridge EAP.
Out-of-pocket fee is $125. No in-person sessions. No court-ordered services.
Matching takes about 24 hours, sometimes same-day.
Clients can switch therapists by emailing info@caringclaritycounseling.com.
Contact: 855-968-7862 | www.caringclaritycounseling.com
`;

export async function getGPTResponse(input, fields) {
  const messages = [
    {
      role: 'system',
      content: `You are Clara—a warm, emotionally intelligent virtual intake assistant. Speak like a human, not a robot. Use light, natural language (e.g., "Got it, thanks. And your email?"). Only ask one question at a time, and only from this approved list:

- What brings you in?
- What type of counseling are you seeking (individual, couples, child)?
- What's your name?
- What's your partner's name (if applicable)?
- What’s your child’s name (if applicable)?
- What's the best phone number to reach you?
- What's your email?
- What state do you live in?
- Will you be using insurance? Which provider?
- When are you generally available for sessions?

NEVER go off-script or provide advice. Do not ask questions not listed. Stay warm, clear, and reassuring.`
    },
    {
      role: 'user',
      content: `Caller said: "${input}"

Collected so far: ${JSON.stringify(fields)}

What should Clara say next?`
    }
  ];

  const chat = await openai.chat.completions.create({
    model: 'gpt-4',
    messages
  });

  return chat.choices[0].message.content;
}
