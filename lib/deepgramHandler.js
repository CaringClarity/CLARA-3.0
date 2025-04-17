import { createClient } from '@deepgram/sdk';

const dg = createClient(process.env.DEEPGRAM_API_KEY);

export async function handleDeepgramTranscription(req) {
  const audio = req.body.RecordingUrl;

  if (!audio) throw new Error('No RecordingUrl found in request');

  const response = await dg.listen.prerecorded.transcribeUrl(
    {
      url: `${audio}.mp3`
    },
    {
      model: 'nova',
      smart_format: true,
      punctuate: true,
      language: 'en'
    }
  );

  const transcript = response.results.channels[0].alternatives[0].transcript;
  if (!transcript) throw new Error('No transcript returned');

  return transcript.toLowerCase();
}
