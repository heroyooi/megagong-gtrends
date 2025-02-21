const googleTrends = require('google-trends-api');

export default async function handler(req, res) {
  try {
    // CORS 허용
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // 오늘 자정 시간 설정

    const result = await googleTrends.interestOverTime({
      keyword: ['메가공무원', '공단기', '해커스공무원'],
      startTime: today,
      geo: 'KR',
    });

    const data = JSON.parse(result);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trends data' });
  }
}
