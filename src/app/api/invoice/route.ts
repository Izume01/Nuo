import { NextRequest } from 'next/server'
import { GoogleGenAI } from '@google/genai'

const MODEL = 'gemini-2.0-flash-001'

function buildSystemPrompt() {
  return `You are an AI assistant collecting invoice details in a step-by-step conversation. You MUST return STRICT JSON with two top-level fields:
{"updates": PartialInvoice, "aiMessage": string, "done": boolean}

Where PartialInvoice matches this TypeScript shape (any subset allowed):
{
  "from": {"name": string, "email": string, "phone": string, "address": string},
  "to": {"name": string, "email": string, "phone": string, "address": string},
  "invoiceNumber": string,
  "issueDate": string, // YYYY-MM-DD
  "dueDate": string,   // YYYY-MM-DD
  "currency": string,
  "taxRate": number,
  "discount": number,
  "items": Array<{"description": string, "quantity": number, "unitPrice": number, "action"?: "add" | "update", "id"?: string}>,
  "notes": string,
  "terms": string
}

Rules:
- Respond with STRICT JSON only, no markdown, no extra text.
- "updates" should contain only fields inferred from the latest user message.
- When user provides an item, return it in items with {action: "add"}.
- Dates must be YYYY-MM-DD.
- Currency should be a code like USD, EUR, etc.
- Always set "aiMessage" to the NEXT question to ask based on remaining missing fields.
- Set "done": true only when all required fields have been provided.

Required fields checklist (must be present before done = true):
- from: name, email, phone, address
- to: name, email, phone, address
- invoiceNumber, issueDate, dueDate, currency
- At least one item with description, quantity, unitPrice (quantity > 0)
- ask for user to create a note and terms and also for a due date
- taxRate and discount are recommended but not required; if missing, MUST ask for them before concluding, unless user explicitly says no tax/discount (then set to 0).

Generation on request:
- If the user explicitly asks you to fill or generate missing details, you may generate for: notes, terms, invoiceNumber, issueDate (today), dueDate (issueDate + 14d). Never generate personal contact details.
- If user gives price but not quantity, default quantity=1.

Questioning rule: Greet once, then ONLY ask for fields that are still missing from the provided current JSON and user message. If the user’s message contains multiple facts (e.g., client name, item description, price), parse them all and include everything in "updates" in one response. If there are no items yet, immediately ask for item description, quantity, and price in one message. If some item fields are missing (e.g., price), ask specifically for those. Always ask for tax and discount if not set. If the user asked to generate remaining info, generate allowed fields and confirm briefly.

When asking next question (aiMessage), combine the next few missing fields in a single concise message to reduce turns, e.g.: "Please provide Kimmy's email, phone, and address. Also share item price and quantity if available."`
}

export async function POST(req: NextRequest) {
  try {
    const { userMessage, current } = await req.json()
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Missing GEMINI_API_KEY' }), { status: 500 })
    }

    const ai = new GoogleGenAI({ apiKey })
    const res = await ai.models.generateContent({
      model: MODEL,
      contents: [
        { role: 'user', parts: [{ text: buildSystemPrompt() }] },
        { role: 'user', parts: [{ text: `Current known invoice JSON (may be partial):\n${JSON.stringify(current ?? {}, null, 2)}` }] },
        { role: 'user', parts: [{ text: String(userMessage || '') }] },
      ],
    })

    const text = (res as any).text ?? ''
    let json: any
    try {
      json = JSON.parse(text)
    } catch {
      // try to extract first JSON object
      const match = text.match(/\{[\s\S]*\}/)
      json = match ? JSON.parse(match[0]) : {}
    }

    // Ensure shape
    const payload = {
      updates: json?.updates ?? json ?? {},
      aiMessage: json?.aiMessage ?? 'Please continue.',
      done: Boolean(json?.done),
    }
    return Response.json(payload)
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || 'Unknown error' }), { status: 500 })
  }
}