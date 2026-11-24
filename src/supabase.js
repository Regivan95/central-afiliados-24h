import { createClient } from '@supabase/supabase-js';
export const supabase = createClient(import.meta.env.VITE_SUPABASE_URL || 'https://iencxcfdalhvcdbfkuyi.supabase.co', import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_5_A8COCirFnV2gN7FW6zgQ_nPnp5ytM');
