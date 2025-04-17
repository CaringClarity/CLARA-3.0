import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const TABLE = 'sessions';

export async function getSession(id) {
  const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).single();
  if (error && error.code !== 'PGRST116') console.error('getSession error:', error);
  return data?.data || { step: 'greeting', fields: {} };
}

export async function updateSession(id, data) {
  const existing = await getSession(id);
  const payload = { id, data: { ...existing, ...data } };
  const { error } = await supabase.from(TABLE).upsert(payload);
  if (error) console.error('updateSession error:', error);
}
