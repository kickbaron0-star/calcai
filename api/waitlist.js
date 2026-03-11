export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Ongeldig e-mailadres' });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  try {
    // Branded bevestiging via Resend template
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'CalcAI <hallo@calcai.nl>',
        to: email,
        template_id: '1569af0f-1229-4c13-bf6b-eb086490a248',
        variables: { email: email },
      }),
    });

    // Notificatie naar kickbaron0@gmail.com
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'CalcAI Waitlist <hallo@calcai.nl>',
        to: 'kickbaron0@gmail.com',
        subject: `🚀 Nieuwe aanmelding: ${email}`,
        html: `<p style="font-family:monospace;background:#080808;color:#f0ece4;padding:24px;">Nieuwe early access aanmelding:<br><br><strong style="color:#f97316;">${email}</strong></p>`,
      }),
    });

    return res.status(200).json({ success: true });

  } catch (error) {
    return res.status(500).json({ error: 'Er ging iets mis' });
  }
}
