function extractMeta(html: string, property: string): string {
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["']([^"'<>]+)["']`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"'<>]+)["'][^>]+property=["']${property}["']`, 'i'),
  ]
  for (const p of patterns) {
    const m = html.match(p)
    if (m?.[1]) return decodeEntities(m[1])
  }
  return ''
}

function extractNameMeta(html: string, name: string): string {
  const patterns = [
    new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"'<>]+)["']`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"'<>]+)["'][^>]+name=["']${name}["']`, 'i'),
  ]
  for (const p of patterns) {
    const m = html.match(p)
    if (m?.[1]) return decodeEntities(m[1])
  }
  return ''
}

function extractTitle(html: string): string {
  const m = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  return decodeEntities(m?.[1]?.trim() ?? '')
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
}

function detectPlatform(hostname: string): string {
  if (/xiaohongshu|xhslink|xhs\.cn/i.test(hostname)) return 'Xiaohongshu'
  if (/\bx\.com\b|twitter\.com/i.test(hostname)) return 'Twitter'
  if (/weibo\.(com|cn)/i.test(hostname)) return 'Weibo'
  if (/instagram\.com/i.test(hostname)) return 'Instagram'
  if (/pixiv\.net/i.test(hostname)) return 'Pixiv'
  if (/weidian\.com/i.test(hostname)) return 'Weidian'
  return 'Other'
}

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url)
  const rawUrl = searchParams.get('url')
  if (!rawUrl) return Response.json({ error: 'Missing url' }, { status: 400 })

  let targetUrl: string
  try {
    targetUrl = new URL(rawUrl).toString()
  } catch {
    return Response.json({ error: 'Invalid URL' }, { status: 400 })
  }

  let res: Response
  try {
    res = await fetch(targetUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en-US;q=0.8',
      },
      signal: AbortSignal.timeout(10_000),
    })
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : 'Fetch failed' },
      { status: 502 }
    )
  }

  if (!res.ok) {
    return Response.json({ error: `Remote returned ${res.status}` }, { status: 502 })
  }

  const html = await res.text()
  const finalHostname = new URL(res.url).hostname

  const title = extractMeta(html, 'og:title') || extractTitle(html)
  const imageUrl = extractMeta(html, 'og:image')
  const description =
    extractMeta(html, 'og:description') || extractNameMeta(html, 'description')
  const platform = detectPlatform(finalHostname)

  return Response.json({ title, imageUrl, description, platform, finalUrl: res.url })
}
