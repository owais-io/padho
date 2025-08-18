import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { title = 'Padho.net - India\'s Premier News Platform', category = '' } = req.query

  // Simple SVG-based OG image generator
  const svg = `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#ff7700;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#ffffff;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#138808;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- Background -->
      <rect width="1200" height="630" fill="url(#bg)"/>
      
      <!-- Content Background -->
      <rect x="60" y="120" width="1080" height="390" fill="rgba(255,255,255,0.95)" rx="20"/>
      
      <!-- Logo Area -->
      <rect x="100" y="60" width="40" height="50" fill="url(#bg)" rx="8"/>
      <text x="160" y="95" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="#333">
        <tspan fill="#ff7700">padho</tspan><tspan fill="#666">.net</tspan>
      </text>
      
      <!-- Category -->
      ${category ? `<text x="100" y="180" font-family="Arial, sans-serif" font-size="24" font-weight="500" fill="#ff7700">${category}</text>` : ''}
      
      <!-- Title -->
      <foreignObject x="100" y="${category ? '220' : '180'}" width="1000" height="250">
        <div xmlns="http://www.w3.org/1999/xhtml" style="
          font-family: Arial, sans-serif;
          font-size: 42px;
          font-weight: bold;
          line-height: 1.2;
          color: #333;
          word-wrap: break-word;
          overflow: hidden;
          height: 250px;
        ">
          ${String(title).substring(0, 120)}${String(title).length > 120 ? '...' : ''}
        </div>
      </foreignObject>
      
      <!-- Bottom Text -->
      <text x="100" y="570" font-family="Arial, sans-serif" font-size="20" fill="#666">
        Simplified AI-powered news summaries for India
      </text>
    </svg>
  `

  res.setHeader('Content-Type', 'image/svg+xml')
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
  res.send(svg)
}