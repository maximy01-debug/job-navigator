import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'PDF 파일이 필요합니다.' }, { status: 400 })
    }

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json({ error: 'PDF 형식만 지원합니다.' }, { status: 400 })
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: '파일 크기는 10MB 이하여야 합니다.' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    // pdf-parse: 동적 import
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const pdfParse = require('pdf-parse')
    const data = await pdfParse(buffer)

    const text = (data.text as string).trim()

    if (!text) {
      return NextResponse.json({ error: 'PDF에서 텍스트를 추출할 수 없습니다. 스캔된 이미지 PDF일 수 있습니다.' }, { status: 400 })
    }

    // 50,000자 제한 (localStorage 용량 고려)
    const truncated = text.length > 50000 ? text.slice(0, 50000) + '\n\n... (텍스트가 50,000자를 초과하여 잘렸습니다)' : text

    return NextResponse.json({ text: truncated })
  } catch (err) {
    return NextResponse.json(
      { error: `PDF 텍스트 추출 중 오류: ${String(err)}` },
      { status: 500 }
    )
  }
}
