# ToolNest — Free Online Tools

A clean, fast, SEO-optimized multi-tool website built with Next.js 14, TypeScript, and Tailwind CSS.

## Tools included

| Tool | Route | Description |
|------|-------|-------------|
| JSON Formatter | `/tools/json-formatter` | Beautify, validate & minify JSON |
| Password Generator | `/tools/password-generator` | Secure passwords with custom options |
| QR Code Generator | `/tools/qr-code-generator` | QR codes for URLs, text, Wi-Fi, email |
| Base64 Encoder | `/tools/base64-encoder` | Encode/decode Base64 with URL-safe mode |
| Word Counter | `/tools/word-counter` | Words, chars, sentences, reading time |
| Color Picker | `/tools/color-picker` | Pick colors, get HEX/RGB/HSL/CSS values |

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for production

```bash
npm run build
npm start
```

## Deploy to Vercel (recommended — free)

1. Push this project to a GitHub repo
2. Go to [vercel.com](https://vercel.com) and click "New Project"
3. Import your GitHub repo
4. Click Deploy — that's it!

Vercel auto-detects Next.js and deploys with zero config.

## Adding a new tool

1. Add the tool metadata to `src/lib/tools.ts`
2. Create a folder: `src/app/tools/your-tool-name/`
3. Add `page.tsx` (metadata export) and `client.tsx` (the actual tool UI)
4. Use `<ToolLayout>` to wrap your tool — it handles breadcrumbs, related tools, and layout automatically

## Project structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout (Navbar + Footer)
│   ├── page.tsx            # Homepage
│   ├── globals.css         # Global styles
│   └── tools/
│       ├── json-formatter/
│       ├── password-generator/
│       ├── qr-code-generator/
│       ├── base64-encoder/
│       ├── word-counter/
│       └── color-picker/
├── components/
│   ├── Navbar.tsx          # Sticky nav with live search
│   ├── Footer.tsx          # Footer with email signup
│   ├── ToolCard.tsx        # Tool card for homepage grid
│   └── ToolLayout.tsx      # Shared layout for all tool pages
└── lib/
    └── tools.ts            # Central tool registry (add tools here)
```

## Monetization roadmap

- **Premium plan**: Add Stripe + a `/api/create-checkout` route. Gate features like batch processing behind a session check.
- **Email list**: Wire the "Notify me" forms to Mailchimp, Resend, or ConvertKit via a `/api/subscribe` route.
- **More tools**: AI image generator (Replicate API), PDF tools (pdf-lib), Regex tester, Markdown editor.

## Tech stack

- [Next.js 14](https://nextjs.org/) — App Router, SSR, file-based routing
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [qrcode](https://www.npmjs.com/package/qrcode) — QR code generation
- [Vercel](https://vercel.com/) — Hosting
