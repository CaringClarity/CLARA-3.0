import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

export async function generateVoice(text) {
  const voiceId = process.env.ELL_VOICE_ID;
  const apiKey = process.env.ELEVENLABS_API_KEY;

  try {
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: { stability: 0.5, similarity_boost: 0.75 }
      },
      {
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer'
      }
    );

    const fileName = `${uuidv4()}.mp3`;
    const filePath = path.join('/tmp', fileName);
    fs.writeFileSync(filePath, response.data);

    return `https://${process.env.BASE_URL}/api/audio?file=${fileName}`;
  } catch (err) {
    console.error('ElevenLabs error:', err.message);
    throw new Error('Voice generation failed');
  }
}
