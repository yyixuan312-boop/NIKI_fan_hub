const REPO = 'yyixuan312-boop/NIKI_fan_hub'
const FILE_PATH = 'data/fan-creatives.json'
const API_BASE = `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`

export async function POST(request: Request): Promise<Response> {
  const token = process.env.GITHUB_TOKEN
  if (!token) return Response.json({ error: 'GITHUB_TOKEN not configured' }, { status: 500 })

  let entry: unknown
  try {
    const body = (await request.json()) as { entry?: unknown }
    entry = body.entry
    if (!entry) return Response.json({ error: 'Missing entry' }, { status: 400 })
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json',
  }

  // 1. Read current file + SHA
  const getRes = await fetch(API_BASE, { headers })
  if (!getRes.ok) {
    return Response.json({ error: `GitHub read failed: ${getRes.status}` }, { status: 502 })
  }
  const fileData = (await getRes.json()) as { content: string; sha: string }
  const current = JSON.parse(Buffer.from(fileData.content, 'base64').toString('utf-8')) as unknown[]

  // 2. Prepend new entry (shows at top)
  const updated = [entry, ...current]
  const newContent = Buffer.from(JSON.stringify(updated, null, 2) + '\n').toString('base64')

  // 3. Commit back
  const putRes = await fetch(API_BASE, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      message: `feat: add fan creative via admin panel`,
      content: newContent,
      sha: fileData.sha,
    }),
  })

  if (!putRes.ok) {
    const err = await putRes.text()
    return Response.json({ error: `GitHub write failed: ${putRes.status} ${err}` }, { status: 502 })
  }

  return Response.json({ ok: true })
}
