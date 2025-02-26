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

    const dayQ = parseInt(req.query.q) || 14; // 1~14까지 가능
    const customDate = new Date();
    customDate.setDate(customDate.getDate() - dayQ);

    const result = await googleTrends.interestOverTime({
      keyword: ['메가소방', '소방단기', '소단기', '해커스소방'],
      startTime: customDate,
      geo: 'KR',
    });

    const data = JSON.parse(result);

    if (data.default && data.default.timelineData) {
      data.default.timelineData = data.default.timelineData.map((entry) => {
        const values = entry.value;
        const sumValue = values[1] + values[2];
        return {
          ...entry,
          value: [...values, sumValue],
        };
      });

      data.default.averages.push(
        data.default.averages[1] + data.default.averages[2]
      );
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trends data' });
  }
}
