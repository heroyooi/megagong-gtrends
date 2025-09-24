export default async function handler(req, res) {
  try {
    // CORS 허용 설정
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      res.status(200).end();
      return;
    }

    if (req.method !== "GET") {
      return res.status(405).json({ message: "Method Not Allowed" });
    }

    const dayQ = parseInt(req.query.q) || 14;

    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - dayQ); // 최근 14일 데이터 가져오기

    const formatDate = (date) => date.toISOString().split("T")[0]; // YYYY-MM-DD 형식 변환

    const requestBody = {
      startDate: formatDate(startDate),
      endDate: formatDate(today),
      timeUnit: "date", // ✅ "date"로 수정
      keywordGroups: [
        { groupName: "넥스트소방", keywords: ["넥스트소방"] },
        { groupName: "소방단기", keywords: ["소방단기", "소단기"] },
        { groupName: "해커스소방", keywords: ["해커스소방"] },
      ],
    };

    console.log("🔵 [네이버 API 요청 데이터]:", requestBody);

    const response = await fetch("https://openapi.naver.com/v1/datalab/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID,
        "X-Naver-Client-Secret": process.env.NAVER_CLIENT_SECRET,
      },
      body: JSON.stringify(requestBody),
    });

    console.log("🟢 [네이버 API 응답 상태]:", response.status);

    if (!response.ok) {
      const errorText = await response.text(); // 응답 본문을 가져와서 로그 출력
      console.error("🔴 [네이버 API 요청 실패]:", errorText);
      throw new Error(`네이버 API 요청 실패: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("🔴 [서버 오류 발생]:", error);
    res.status(500).json({ error: "Failed to fetch trends data", details: error.message });
  }
}
