# Clara 3.0 — AI Voice Intake Assistant for Caring Clarity Counseling

This is a serverless, Vercel-deployable AI intake system that uses:

- 🎙️ ElevenLabs for human-sounding voice
- 🧠 GPT-4 for natural scripted dialog
- 📞 Twilio for inbound calls
- ✍️ Deepgram for speech transcription
- ✅ Supabase for session memory
- 📋 Monday.com to post final client info

---

## 🛠️ Setup

### 1. Required Environment Variables

```env
OPENAI_API_KEY=sk-...
ELEVENLABS_API_KEY=...
ELL_VOICE_ID=...
DEEPGRAM_API_KEY=...
SUPABASE_URL=https://yourproject.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-secret
MONDAY_API_KEY=...
MONDAY_BOARD_ID=123456
BASE_URL=your-vercel-project-name.vercel.app
```

### 2. Supabase Setup

Create a table `sessions`:

```sql
create table sessions (
  id text primary key,
  data jsonb
);
```

### 3. Twilio Setup

Point your Twilio voice webhook to:

```
POST https://your-vercel-app.vercel.app/api/voice
```

---

## How it Works

Clara greets callers in a human voice, screens them gently, guides intake step-by-step using GPT, and sends the result to Monday.com — all hands-free.

