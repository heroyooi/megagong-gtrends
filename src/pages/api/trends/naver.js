export default async function handler(req, res) {
    if (req.method !== "GET") {
      return res.status(405).json({ message: "Method Not Allowed" });
    }
  
    const daysAgo = 14; // 14일로 고정
  
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - daysAgo);
  
    const formatDate = (date) => date.toISOString().split("T")[0]; // YYYY-MM-DD 형식 변환
  
    const requestBody = {
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      timeUnit: "day",
      keywordGroups: [
        { groupName: "메가공무원", keywords: ["메가공무원"] },
        { groupName: "공단기", keywords: ["공단기"] },
        { groupName: "해커스공무원", keywords: ["해커스공무원"] },
      ],
    };
  
    try {
      const response = await fetch("https://openapi.naver.com/v1/datalab/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID,
          "X-Naver-Client-Secret": process.env.NAVER_CLIENT_SECRET,
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        throw new Error("네이버 API 요청 실패");
      }
  
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: "서버 오류", error: error.message });
    }
  }
  