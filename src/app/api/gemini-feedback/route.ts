import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return NextResponse.json(
      { error: 'GEMINI_API_KEY가 설정되지 않았습니다. .env.local 파일을 확인해주세요.' },
      { status: 500 }
    )
  }

  let body: {
    projectTitle: string
    description: string
    techStack: string
    status: string
    studentName: string
  }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: '요청 형식이 올바르지 않습니다.' }, { status: 400 })
  }

  const { projectTitle, description, techStack, status, studentName } = body

  const prompt = `
당신은 직업계 고등학교의 전문 IT 교육 멘토입니다.
아래 학생의 프로젝트 제출 과제를 검토하고 건설적인 피드백을 제공해주세요.

[학생 정보]
- 이름: ${studentName}

[프로젝트 정보]
- 프로젝트명: ${projectTitle}
- 설명: ${description || '(설명 없음)'}
- 기술스택: ${techStack || '(미입력)'}
- 진행 상태: ${status}

다음 기준으로 피드백을 작성해 주세요:
1. **잘한 점**: 프로젝트의 긍정적인 측면
2. **개선할 점**: 구체적인 개선 방향과 제안
3. **다음 단계**: 발전을 위해 도전해볼 만한 추가 과제나 방향

피드백은 학생이 이해하기 쉽도록 친절하고 격려적인 어조로 작성해주세요.
전체 분량은 200~350자 내외로 작성해주세요.
`.trim()

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          },
        }),
      }
    )

    if (!response.ok) {
      // Try fallback model if 2.5 flash is unavailable
      const fallbackResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1024,
            },
          }),
        }
      )

      if (!fallbackResponse.ok) {
        const errText = await fallbackResponse.text()
        return NextResponse.json({ error: `Gemini API 오류: ${errText}` }, { status: 500 })
      }

      const fallbackData = await fallbackResponse.json()
      const feedback = fallbackData.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
      return NextResponse.json({ feedback })
    }

    const data = await response.json()
    const feedback = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
    return NextResponse.json({ feedback })
  } catch (err) {
    return NextResponse.json(
      { error: `API 호출 중 오류가 발생했습니다: ${String(err)}` },
      { status: 500 }
    )
  }
}
