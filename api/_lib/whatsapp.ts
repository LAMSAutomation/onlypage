import { createClient } from '@supabase/supabase-js';

type EvolutionConfig = {
  baseUrl: string;
  apiKey: string;
  instanceName: string;
};

type FollowUpInput = {
  siteId?: unknown;
  leadId?: unknown;
  message?: unknown;
  locale?: unknown;
};

const response = (status: number, body: Record<string, unknown>) => ({ status, body });

const getServiceClient = () => {
  const url = process.env.VITE_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRole) return null;
  return createClient(url, serviceRole, { auth: { persistSession: false, autoRefreshToken: false } });
};

const getBearerToken = (authorization?: string) => {
  const match = authorization?.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || null;
};

export const normaliseIndianWhatsAppNumber = (value: unknown) => {
  const digits = typeof value === 'string' ? value.replace(/\D/g, '') : '';
  if (/^[6-9]\d{9}$/.test(digits)) return `91${digits}`;
  if (/^91[6-9]\d{9}$/.test(digits)) return digits;
  return null;
};

export const getEvolutionConfig = (): EvolutionConfig | null => {
  const baseUrl = process.env.EVOLUTION_API_URL?.replace(/\/$/, '');
  const apiKey = process.env.EVOLUTION_API_KEY;
  const instanceName = process.env.EVOLUTION_INSTANCE_NAME;
  if (!baseUrl || !apiKey || !instanceName || process.env.EVOLUTION_AUTOMATION_ENABLED !== 'true') return null;
  if (process.env.NODE_ENV === 'production' && !baseUrl.startsWith('https://')) return null;
  return { baseUrl, apiKey, instanceName };
};

const requireSiteOwner = async (siteId: string, authorization?: string) => {
  const token = getBearerToken(authorization);
  const url = process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
  const service = getServiceClient();
  if (!token || !url || !anonKey || !service) return { error: 'Authentication or server configuration is unavailable.' as const };

  const authClient = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: userData, error: userError } = await authClient.auth.getUser(token);
  if (userError || !userData.user) return { error: 'Sign in again to manage WhatsApp follow-ups.' as const };

  const { data: site, error: siteError } = await service
    .from('sites')
    .select('id, owner_id, business_name')
    .eq('id', siteId)
    .maybeSingle();
  if (siteError || !site || site.owner_id !== userData.user.id) return { error: 'You do not have access to this business.' as const };
  return { service, site };
};

export async function sendEvolutionText(config: EvolutionConfig, number: string, text: string) {
  const result = await fetch(`${config.baseUrl}/message/sendText/${encodeURIComponent(config.instanceName)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: config.apiKey },
    body: JSON.stringify({ number, text, linkPreview: false }),
  });
  const payload = await result.json().catch(() => ({}));
  if (!result.ok) {
    const detail = typeof payload?.message === 'string' ? payload.message : `Evolution API returned ${result.status}.`;
    throw new Error(detail.slice(0, 500));
  }
  return payload;
}

export async function sendLeadFollowUp(input: FollowUpInput, authorization?: string) {
  const siteId = typeof input.siteId === 'string' ? input.siteId : '';
  const leadId = typeof input.leadId === 'string' ? input.leadId : '';
  const message = typeof input.message === 'string' ? input.message.trim() : '';
  const locale = typeof input.locale === 'string' ? input.locale.slice(0, 40) : 'English';
  if (!siteId || !leadId || !message || message.length > 4096) {
    return response(400, { error: 'Choose a lead and provide a follow-up message of up to 4,096 characters.' });
  }

  const access = await requireSiteOwner(siteId, authorization);
  if ('error' in access) return response(401, { error: access.error });

  const { data: lead, error: leadError } = await access.service
    .from('leads')
    .select('id, site_id, name, phone')
    .eq('id', leadId)
    .eq('site_id', siteId)
    .maybeSingle();
  if (leadError || !lead) return response(404, { error: 'That lead was not found for this business.' });

  const phone = normaliseIndianWhatsAppNumber(lead.phone);
  if (!phone) return response(400, { error: 'This lead needs a valid Indian WhatsApp number before a message can be sent.' });

  const recentlySentSince = new Date(Date.now() - 60_000).toISOString();
  const { count } = await access.service
    .from('whatsapp_deliveries')
    .select('id', { count: 'exact', head: true })
    .eq('lead_id', leadId)
    .eq('status', 'sent')
    .gte('created_at', recentlySentSince);
  if ((count || 0) > 0) return response(429, { error: 'A follow-up was already sent to this lead in the last minute. Please avoid duplicate messages.' });

  const config = getEvolutionConfig();
  const { data: delivery, error: deliveryError } = await access.service
    .from('whatsapp_deliveries')
    .insert({
      site_id: siteId,
      lead_id: leadId,
      phone,
      message,
      locale,
      trigger: 'manual_follow_up',
      status: config ? 'sending' : 'needs_configuration',
      error_message: config ? null : 'Evolution API is not configured on this deployment.',
    })
    .select('id, status')
    .single();
  if (deliveryError || !delivery) return response(500, { error: 'Could not save the WhatsApp delivery record.' });

  if (!config) {
    await access.service.from('lead_events').insert({ lead_id: leadId, event: 'WhatsApp follow-up prepared; Evolution API needs configuration.' });
    return response(503, { error: 'Evolution API is not configured on this deployment.', delivery_id: delivery.id, status: delivery.status });
  }

  try {
    const providerResponse = await sendEvolutionText(config, phone, message);
    const providerMessageId = providerResponse?.key?.id || providerResponse?.message?.key?.id || null;
    await access.service
      .from('whatsapp_deliveries')
      .update({ status: 'sent', provider_message_id: providerMessageId, provider_response: providerResponse, sent_at: new Date().toISOString(), error_message: null })
      .eq('id', delivery.id);
    await access.service.from('lead_events').insert({ lead_id: leadId, event: 'WhatsApp follow-up sent via Evolution API.' });
    return response(200, { success: true, delivery_id: delivery.id, status: 'sent', provider_message_id: providerMessageId });
  } catch (error) {
    const messageText = error instanceof Error ? error.message : 'Evolution API could not send this message.';
    await access.service.from('whatsapp_deliveries').update({ status: 'failed', error_message: messageText }).eq('id', delivery.id);
    await access.service.from('lead_events').insert({ lead_id: leadId, event: 'WhatsApp follow-up failed to send. Review the delivery log.' });
    return response(502, { error: 'Evolution API could not send this message.', delivery_id: delivery.id, status: 'failed' });
  }
}

export async function getWhatsAppConnection(siteId: string, authorization?: string) {
  if (!siteId) return response(400, { error: 'site_id is required.' });
  const access = await requireSiteOwner(siteId, authorization);
  if ('error' in access) return response(401, { error: access.error });

  const config = getEvolutionConfig();
  if (!config) return response(200, { configured: false, connected: false, status: 'not_configured' });

  try {
    const provider = await fetch(`${config.baseUrl}/instance/connectionState/${encodeURIComponent(config.instanceName)}`, { headers: { apikey: config.apiKey } });
    const payload = await provider.json().catch(() => ({}));
    const state = payload?.instance?.state || payload?.state || 'unknown';
    return response(200, { configured: true, connected: String(state).toLowerCase() === 'open', status: state });
  } catch {
    return response(200, { configured: true, connected: false, status: 'unreachable' });
  }
}

export const isValidAutomationSecret = (provided?: string) => {
  const expected = process.env.EVOLUTION_AUTOMATION_SECRET;
  return Boolean(expected && provided && expected.length === provided.length && expected === provided);
};

// Called by a trusted scheduler, never by the browser. The tight time window
// makes first launch safe: existing leads are not bulk-messaged when this is enabled.
export async function runNewLeadFollowUps() {
  if (process.env.EVOLUTION_AUTOMATION_AUTO_FOLLOW_UP !== 'true') {
    return response(409, { error: 'Automatic new-lead follow-ups are disabled.' });
  }
  const config = getEvolutionConfig();
  const service = getServiceClient();
  if (!config || !service) return response(503, { error: 'Evolution API is not configured on this deployment.' });

  const newest = new Date(Date.now() - 60_000).toISOString();
  const oldest = new Date(Date.now() - 15 * 60_000).toISOString();
  const { data: leads, error } = await service
    .from('leads')
    .select('id, site_id, name, phone, status, created_at')
    .in('status', ['New', 'new', 'Open', 'open', 'Unread', 'unread'])
    .gte('created_at', oldest)
    .lte('created_at', newest)
    .order('created_at', { ascending: true })
    .limit(20);
  if (error) return response(500, { error: 'Could not load recent leads for follow-up.' });

  let sent = 0;
  let skipped = 0;
  let failed = 0;
  for (const lead of leads || []) {
    const phone = normaliseIndianWhatsAppNumber(lead.phone);
    if (!phone) { skipped += 1; continue; }
    const { data: site } = await service.from('sites').select('business_name, theme').eq('id', lead.site_id).maybeSingle();
    const businessName = site?.business_name || 'our business';
    const locale = (site?.theme as any)?.launchKit?.locale || 'English';
    const message = (followUpForLocale(locale) || followUpForLocale('English')).replace('{{name}}', lead.name || 'there').replace('{{business}}', businessName);
    const { data: delivery, error: insertError } = await service
      .from('whatsapp_deliveries')
      .insert({ site_id: lead.site_id, lead_id: lead.id, phone, message, locale, trigger: 'new_lead_follow_up', status: 'sending' })
      .select('id')
      .single();
    if (insertError || !delivery) { skipped += 1; continue; }
    try {
      const providerResponse = await sendEvolutionText(config, phone, message);
      const providerMessageId = providerResponse?.key?.id || providerResponse?.message?.key?.id || null;
      await service.from('whatsapp_deliveries').update({ status: 'sent', provider_message_id: providerMessageId, provider_response: providerResponse, sent_at: new Date().toISOString() }).eq('id', delivery.id);
      await service.from('lead_events').insert({ lead_id: lead.id, event: 'Automatic WhatsApp follow-up sent via Evolution API.' });
      sent += 1;
    } catch (sendError) {
      const detail = sendError instanceof Error ? sendError.message : 'Evolution API could not send this message.';
      await service.from('whatsapp_deliveries').update({ status: 'failed', error_message: detail }).eq('id', delivery.id);
      await service.from('lead_events').insert({ lead_id: lead.id, event: 'Automatic WhatsApp follow-up failed to send.' });
      failed += 1;
    }
  }
  return response(200, { processed: (leads || []).length, sent, skipped, failed });
}

const followUpForLocale = (locale: string) => ({
  English: 'Hi {{name}}, thank you for contacting {{business}}. How can we help you today?',
  Hindi: 'नमस्ते {{name}}, {{business}} से संपर्क करने के लिए धन्यवाद। हम आपकी कैसे मदद कर सकते हैं?',
  Tamil: 'வணக்கம் {{name}}, {{business}}-ஐ தொடர்புகொண்டதற்கு நன்றி. இன்று உங்களுக்கு எவ்வாறு உதவலாம்?',
  Kannada: 'ನಮಸ್ಕಾರ {{name}}, {{business}} ಅನ್ನು ಸಂಪರ್ಕಿಸಿದ್ದಕ್ಕಾಗಿ ಧನ್ಯವಾದಗಳು. ಇಂದು ನಾವು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?',
  Telugu: 'నమస్కారం {{name}}, {{business}}ను సంప్రదించినందుకు ధన్యవాదాలు. మేము మీకు ఎలా సహాయం చేయగలం?',
  Malayalam: 'നമസ്കാരം {{name}}, {{business}}-നെ ബന്ധപ്പെട്ടതിന് നന്ദി. ഇന്ന് ഞങ്ങൾ നിങ്ങളെ എങ്ങനെ സഹായിക്കാം?',
} as Record<string, string>)[locale];
