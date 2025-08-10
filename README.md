# AI Invoice Generator (Next.js 15)

Create professional invoices fast with a chat-driven flow and a live PDF preview. Built with Next.js App Router, React 19, Zustand, and `@react-pdf/renderer`.

## Highlights

- **Chat-driven data entry**: Answer questions; fields update in real-time
- **Live PDF preview**: Two themes (Professional, Creative), responsive and fast
- **Edit fields directly**: Items, taxes, discounts, dates, currency, etc.
- **PDF export**: One-click download of the exact preview
- **State management**: Centralized with Zustand for instant sync between chat and form

## Quick start

Install dependencies and run the dev server:
```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000/dashboard`.

## Environment (optional, for AI chat)

If you want the AI assistant to parse messages and fill fields, add an API key:

1) Create a `.env.local` in the project root:
```
GEMINI_API_KEY=your_api_key
```
2) Restart the dev server after creating the file.

The API route uses the official Gemini SDK [`@google/genai`](https://github.com/googleapis/js-genai).

## Project structure

```
src/
  app/
    (dashboard)/dashboard/page.tsx      # Main UI (chat + preview)
    api/invoice/route.ts                 # AI parsing endpoint (Gemini)
  components/
    invoice/InvoiceChat.tsx              # Chat UI
    invoice/InvoicePreview.tsx           # PDF viewer + editable fields
    invoice/InvoicePDF.tsx               # PDF document
  store/
    useInvoice.ts                        # Zustand store (invoice state)
```

## Common actions

- Add an item: use the “Add Item” button or type in chat (when AI is enabled)
- Toggle theme: button on the dashboard header
- Edit signature: choose source (From/To/Custom) and optional custom name
- Download PDF: use the “Download PDF” button above the preview

## Notes

- The PDF viewer and download run only on the client (SSR is disabled for these components)
- Remote fonts for signatures require a TTF source to work in PDFs
