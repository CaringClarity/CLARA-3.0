import pkg from 'twilio';
const { twiml: TwiML } = pkg;

import { generateVoice } from '../lib/generateAudio.js';
import { processIntakeLogic } from '../lib/intakeLogic.js';
import { getSession, updateSession } from '../lib/sessionStore.js';
import { handleDeepgramTranscription } from '../lib/deepgramHandler.js';

export default async function handler(req, res) {
  const voiceResponse = new TwiML.VoiceResponse();
  const callSid = req.body.CallSid || 'unknown-session';
  const session = await getSession(callSid);

  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  try {
    const speechResult = await handleDeepgramTranscription(req);

    const { responseText, updatedSession, done } = await processIntakeLogic(speechResult, session);
    await updateSession(callSid, updatedSession);

    const audioUrl = await generateVoice(responseText);
    voiceResponse.play(audioUrl);

    if (done) voiceResponse.hangup();

    res.setHeader('Content-Type', 'text/xml');
    res.status(200).send(voiceResponse.toString());
  } catch (error) {
    console.error('Voice handler error:', error);
    voiceResponse.say('Sorry, something went wrong. Please try again later.');
    res.setHeader('Content-Type', 'text/xml');
    res.status(200).send(voiceResponse.toString());
  }
}
