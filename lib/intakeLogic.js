import { getGPTResponse } from './gptController.js';
import axios from 'axios';

export async function processIntakeLogic(input, session = {}) {
  session.fields = session.fields || {};
  session.step = session.step || 'greeting';
  const f = session.fields;

  if (session.step === 'greeting') {
    session.step = 'qualify';
    return {
      responseText: `Hello, I'm Clara, the virtual intake assistant. I’m happy to help you get started today. I just need to ask a few questions to better understand your needs and preferences. Before we begin, I want to mention that we do not accept Medicaid or Medicare, and we offer telehealth services only — no in-person sessions. Also, if you are seeking services for a child, we only work with children ages ten and older. Would you like to get started? Please say yes or no.`,
      updatedSession: session
    };
  }

  if (session.step === 'qualify') {
    const lowered = input.toLowerCase();
    if (lowered.includes('no') || lowered.includes('medicaid') || lowered.includes('medicare') || lowered.includes('under 10')) {
      return {
        responseText: `I'm sorry we aren't the right fit at this time. But we thank you for your interest in our services. Please give us a call back if we can help further. Take care.`,
        updatedSession: session,
        done: true
      };
    }
    session.step = 'service_type';
  }

  const stepOrder = [
    'service_type', 'first_name', 'last_name', 'phone', 'email', 'state', 'insurance', 'availability'
  ];
  const nextStep = stepOrder.find(step => !f[step]);

  if (nextStep) {
    f[nextStep] = input;
    const gptText = await getGPTResponse(input, f);
    session.step = nextStep;
    return { responseText: gptText, updatedSession: session };
  }

  try {
    await axios.post(`${process.env.BASE_URL}/api/send-to-monday`, f);
  } catch (e) {
    console.error('Failed to send to Monday:', e);
  }

  return {
    responseText: `Thanks so much. We’ll review your information and reach out shortly to get you matched with the right therapist. Take care.`,
    updatedSession: session,
    done: true
  };
}
