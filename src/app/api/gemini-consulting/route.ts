import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return NextResponse.json(
      { error: 'GEMINI_API_KEY가 설정되지 않았습니다. .env.local 파일을 확인해주세요.' },
      { status: 500 }
    )
  }

  let body: { systemPrompt: string; context: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: '요청 형식이 올바르지 않습니다.' }, { status: 400 })
  }

  const { systemPrompt, context } = body
  if (!systemPrompt || !context) {
    return NextResponse.json({ error: '시스템 프롬프트와 컨텍스트가 필요합니다.' }, { status: 400 })
  }

  const fullPrompt = `${systemPrompt}\n\n---\n\n${context}`

  // 컨텍스트 길이 제한 (Gemini 토큰 초과 방지)
  const trimmed = fullPrompt.length > 60000 ? fullPrompt.slice(0, 60000) : fullPrompt

  const callGemini = async (model: string) =>
    fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: trimmed }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 4096 },
        }),
      }
    )

  try {
    let response = await callGemini('gemini-2.5-flash')

    if (!response.ok) {
      response = await callGemini('gemini-2.0-flash')
      if (!response.ok) {
        const errText = await response.text()
        return NextResponse.json({ error: `Gemini API 오류: ${errText}` }, { status: 500 })
      }
    }

    const data = await response.json()
    const output = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
    return NextResponse.json({ output })
  } catch (err) {
    return NextResponse.json(
      { error: `API 호출 중 오류가 발생했습니다: ${String(err)}` },
      { status: 500 }
    )
  }
}
