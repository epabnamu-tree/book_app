import { GoogleGenAI } from "@google/genai";

// Ensure API Key is available
const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

export const generateBookAnswer = async (userQuestion: string): Promise<string> => {
  if (!apiKey) {
    return "API 키가 설정되지 않았습니다. 환경 변수를 확인해주세요.";
  }

  try {
    const model = "gemini-2.5-flash";
    const systemInstruction = `
      당신은 '연구그룹 이팝나무'의 공식 AI 어시스턴트입니다.
      연구그룹 이팝나무는 사회적 경제, 기본소득, AI 윤리, 그리고 협동조합에 대해 연구하고 글을 쓰는 전문가 집단입니다.
      
      주요 저서:
      1. <Insight: 미래를 읽는 통찰>: AI와 노동의 종말, 기본소득의 필요성.
      2. <모두를 위한 경제>: 협동조합과 대안 경제 시스템.

      당신의 역할은 독자들의 질문에 대해 연구그룹의 페르소나를 반영하여 지적이고 친절하게 답변하는 것입니다.
      - 특정 책에 대한 질문이 들어오면 해당 책의 내용을 바탕으로 답변하세요.
      - 연구그룹에 대한 질문(강연, 연구 철학 등)에도 정중히 응대하세요.
      - 답변은 한국어로 300자 이내로 요약하여 제공하세요.
      - 책에 없는 내용이라도 연구그룹의 주 관심사(사회 정의, 기술과 인간의 공존)와 연결지어 설명하세요.
      - '저' 대신 '저희'라는 표현을 사용하여 연구그룹임을 드러내세요.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: userQuestion,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "죄송합니다. 답변을 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
};