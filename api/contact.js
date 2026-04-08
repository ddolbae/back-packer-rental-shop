import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', 'https://backpackerrentalshop.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { name, phone, email, interest } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const interestMap = {
      backpacking: '백패킹 세트',
      camping: '캠핑 세트',
      cooking: '취사 장비',
      all: '전부 다 궁금해요'
    };

    await resend.emails.send({
      from: 'BACK PACKER <noreply@backpackerrentalshop.com>',
      to: 'admin@backpackerrentalshop.com', // TODO: 실제 알림 수신 이메일로 변경
      subject: `[사전등록] ${name}님이 등록했습니다`,
      html: `
        <h2 style="color:#C4922A;">새 사전등록이 접수되었습니다</h2>
        <table style="border-collapse:collapse;width:100%;max-width:480px;">
          <tr>
            <td style="padding:8px 12px;border-bottom:1px solid #D4C4A8;font-weight:bold;width:100px;">이름</td>
            <td style="padding:8px 12px;border-bottom:1px solid #D4C4A8;">${name}</td>
          </tr>
          <tr>
            <td style="padding:8px 12px;border-bottom:1px solid #D4C4A8;font-weight:bold;">연락처</td>
            <td style="padding:8px 12px;border-bottom:1px solid #D4C4A8;">${phone || '-'}</td>
          </tr>
          <tr>
            <td style="padding:8px 12px;border-bottom:1px solid #D4C4A8;font-weight:bold;">이메일</td>
            <td style="padding:8px 12px;border-bottom:1px solid #D4C4A8;">${email}</td>
          </tr>
          <tr>
            <td style="padding:8px 12px;border-bottom:1px solid #D4C4A8;font-weight:bold;">관심 장비</td>
            <td style="padding:8px 12px;border-bottom:1px solid #D4C4A8;">${interestMap[interest] || '미선택'}</td>
          </tr>
        </table>
        <p style="color:#6B5744;margin-top:16px;font-size:14px;">
          접수 시각: ${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}
        </p>
      `
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Email send error:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
