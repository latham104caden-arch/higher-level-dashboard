import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

const DATA_FILE = path.join(process.cwd(), 'src/data/submissions.json')

async function readSubmissions() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function writeSubmissions(submissions: any[]) {
  await fs.writeFile(DATA_FILE, JSON.stringify(submissions, null, 2))
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const submissions = await readSubmissions()

    const submission = {
      id: Date.now().toString(),
      submittedAt: new Date().toISOString(),
      ...body,
    }

    submissions.unshift(submission)
    await writeSubmissions(submissions)

    return NextResponse.json({ success: true, id: submission.id })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function GET() {
  try {
    const submissions = await readSubmissions()
    return NextResponse.json(submissions)
  } catch {
    return NextResponse.json([])
  }
}
