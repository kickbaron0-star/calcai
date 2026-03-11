export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Ongeldig e-mailadres' });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  const confirmationHtml = `
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CalcAI — Je staat op de lijst</title>
</head>
<body style="margin:0;padding:0;background:#080808;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#080808;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="padding:40px 40px 32px;background:#0e0e0e;border:1px solid #1e1e1e;border-bottom:none;border-radius:8px 8px 0 0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <div style="display:inline-block;background:linear-gradient(135deg,#f97316,#ea580c);width:36px;height:36px;border-radius:6px;text-align:center;line-height:36px;font-size:18px;vertical-align:middle;">⚡</div>
                    <span style="font-size:22px;font-weight:900;letter-spacing:2px;color:#f0ece4;vertical-align:middle;margin-left:10px;font-family:Arial,sans-serif;">CALC<span style="color:#f97316;">AI</span></span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Orange bar -->
          <tr>
            <td style="background:linear-gradient(90deg,#f97316,#ea580c);height:3px;"></td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;background:#0e0e0e;border:1px solid #1e1e1e;border-top:none;border-bottom:none;">

              <p style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#f97316;font-family:monospace;margin:0 0 20px;">Early Access bevestiging</p>

              <h1 style="font-size:36px;font-weight:900;color:#f0ece4;margin:0 0 16px;line-height:1.1;font-family:Arial,sans-serif;">
                Je staat op<br>de lijst. <span style="color:#f97316;">✓</span>
              </h1>

              <p style="font-size:15px;color:#888;line-height:1.8;margin:0 0 32px;">
                Welkom bij CalcAI early access. Je bent een van de eersten die toegang krijgt tot AI-calculaties voor bouw en installatie — zodra we lanceren, ben jij de eerste die het weet.
              </p>

              <!-- What to expect -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#141414;border:1px solid #1e1e1e;border-radius:6px;margin-bottom:32px;">
                <tr>
                  <td style="padding:24px;">
                    <p style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#555;font-family:monospace;margin:0 0 16px;">Wat je krijgt</p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #1e1e1e;">
                          <span style="color:#f97316;margin-right:10px;">→</span>
                          <span style="color:#ccc;font-size:14px;">3 maanden Pro gratis bij lancering</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #1e1e1e;">
                          <span style="color:#f97316;margin-right:10px;">→</span>
                          <span style="color:#ccc;font-size:14px;">Vroege toegang vóór publieke lancering</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;">
                          <span style="color:#f97316;margin-right:10px;">→</span>
                          <span style="color:#ccc;font-size:14px;">Directe invloed op de roadmap</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:linear-gradient(135deg,#f97316,#ea580c);border-radius:4px;">
                    <a href="https://app.calcai.nl" style="display:inline-block;padding:14px 28px;color:white;text-decoration:none;font-size:14px;font-weight:700;letter-spacing:1px;font-family:Arial,sans-serif;text-transform:uppercase;">
                      Bekijk de app →
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;background:#080808;border:1px solid #1e1e1e;border-top:none;border-radius:0 0 8px 8px;">
              <p style="font-size:11px;color:#444;margin:0;font-family:monospace;letter-spacing:0.5px;">
                © 2025 CalcAI · calcai.nl · Je ontvangt deze e-mail omdat je je aangemeld hebt voor early access.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  try {
    // Send confirmation to subscriber
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'CalcAI <onboarding@resend.dev>',
        to: email,
        subject: '✓ Je staat op de CalcAI early access lijst',
        html: confirmationHtml,
      }),
    });

    // Notify yourself
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'CalcAI Waitlist <onboarding@resend.dev>',
        to: 'kickbaron0@gmail.com',
        subject: `🚀 Nieuwe aanmelding: ${email}`,
        html: `<p style="font-family:monospace;">Nieuwe early access aanmelding:<br><br><strong>${email}</strong></p>`,
      }),
    });

    return res.status(200).json({ success: true });

  } catch (error) {
    return res.status(500).json({ error: 'Er ging iets mis' });
  }
}
