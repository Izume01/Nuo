'use client'

import { create } from 'zustand'

export type InvoiceTheme = 'professional' | 'creative'

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
}

export interface PartyInfo {
  name: string
  address: string
  email: string
  phone: string
}

export interface InvoiceData {
  from: PartyInfo
  to: PartyInfo
  invoiceNumber: string
  issueDate: string
  dueDate: string
  currency: string
  taxRate: number
  discount: number
  items: InvoiceItem[]
  notes: string
  terms: string
  signatureEnabled?: boolean
  signatureName?: string
  signatureSource?: 'from' | 'to' | 'custom'
}

export interface ChatMessage {
  id: string
  role: 'ai' | 'user'
  content: string
  timestamp: number
}

interface InvoiceState {
  theme: InvoiceTheme
  data: InvoiceData
  chat: ChatMessage[]
  currentQuestionIndex: number
  version: number
  // derived
  subtotal: number
  taxAmount: number
  discountAmount: number
  total: number
  // actions
  setTheme: (theme: InvoiceTheme) => void
  setField: (path: string, value: string | number | boolean) => void
  addItem: (item: Partial<InvoiceItem>) => void
  updateItem: (id: string, updates: Partial<InvoiceItem>) => void
  removeItem: (id: string) => void
  addChat: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void
  askNextQuestion: () => void
  reset: () => void
  applyUpdates: (updates: Partial<InvoiceData> & { items?: Array<Partial<InvoiceItem> & { action?: 'add' | 'update', id?: string }> }) => void
}

function calculateTotals(data: InvoiceData) {
  const subtotal = data.items.reduce((sum, it) => sum + it.quantity * it.unitPrice, 0)
  const discountAmount = (data.discount / 100) * subtotal
  const taxable = Math.max(0, subtotal - discountAmount)
  const taxAmount = (data.taxRate / 100) * taxable
  const total = taxable + taxAmount
  return { subtotal, taxAmount, discountAmount, total }
}

const initialState: Omit<InvoiceState, 'setTheme' | 'setField' | 'addItem' | 'updateItem' | 'removeItem' | 'addChat' | 'askNextQuestion' | 'reset' | 'applyUpdates'> = {
  theme: 'professional',
  data: {
    from: { name: 'Your Company', address: '', email: '', phone: '' },
    to: { name: '', address: '', email: '', phone: '' },
    invoiceNumber: 'INV-0001',
    issueDate: new Date().toISOString().slice(0, 10),
    dueDate: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().slice(0, 10),
    currency: 'USD',
    taxRate: 0,
    discount: 0,
    items: [],
    notes: '',
    terms: 'Payment due within 7 days.',
    signatureEnabled: true,
    signatureName: 'Authorized Signatory',
    signatureSource: 'from',
  },
  chat: [
    { id: crypto.randomUUID(), role: 'ai', content: 'Hi! Let’s create your invoice.', timestamp: Date.now() },
  ],
  currentQuestionIndex: 0,
  version: 0,
  subtotal: 0,
  taxAmount: 0,
  discountAmount: 0,
  total: 0,
}

export const useInvoiceStore = create<InvoiceState>((set, get) => ({
  ...initialState,
  setTheme: (theme) => set({ theme }),
  setField: (path, value) => {
    const keys = path.split('.')
    const state = get()
    const dataCopy: InvoiceData = JSON.parse(JSON.stringify(state.data))
    let target: any = dataCopy
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i]
      if (!(key in target)) target[key] = {}
      target = target[key]
    }
    target[keys[keys.length - 1]] = value as any
    const totals = calculateTotals(dataCopy)
    set({ data: dataCopy, ...totals, version: get().version + 1 })
  },
  addItem: (item) => {
    const state = get()
    const newItem: InvoiceItem = {
      id: crypto.randomUUID(),
      description: item.description ?? 'Item',
      quantity: item.quantity ?? 1,
      unitPrice: item.unitPrice ?? 0,
    }
    const dataCopy = { ...state.data, items: [...state.data.items, newItem] }
    const totals = calculateTotals(dataCopy)
    set({ data: dataCopy, ...totals, version: get().version + 1 })
  },
  updateItem: (id, updates) => {
    const state = get()
    const dataCopy = {
      ...state.data,
      items: state.data.items.map((it) => (it.id === id ? { ...it, ...updates } : it)),
    }
    const totals = calculateTotals(dataCopy)
    set({ data: dataCopy, ...totals, version: get().version + 1 })
  },
  removeItem: (id) => {
    const state = get()
    const dataCopy = {
      ...state.data,
      items: state.data.items.filter((it) => it.id !== id),
    }
    const totals = calculateTotals(dataCopy)
    set({ data: dataCopy, ...totals, version: get().version + 1 })
  },
  addChat: (msg) => {
    const newMsg: ChatMessage = { id: crypto.randomUUID(), timestamp: Date.now(), ...msg }
    set({ chat: [...get().chat, newMsg] })
  },
  applyUpdates: (updates) => {
    const state = get()
    const dataCopy: InvoiceData = JSON.parse(JSON.stringify(state.data))
    if (updates.from) dataCopy.from = { ...dataCopy.from, ...updates.from }
    if (updates.to) dataCopy.to = { ...dataCopy.to, ...updates.to }
    if (updates.invoiceNumber !== undefined) dataCopy.invoiceNumber = String(updates.invoiceNumber)
    if (updates.issueDate !== undefined) dataCopy.issueDate = String(updates.issueDate)
    if (updates.dueDate !== undefined) dataCopy.dueDate = String(updates.dueDate)
    if (updates.currency !== undefined) dataCopy.currency = String(updates.currency)
    if (updates.taxRate !== undefined) dataCopy.taxRate = Number(updates.taxRate)
    if (updates.discount !== undefined) dataCopy.discount = Number(updates.discount)
    if (updates.notes !== undefined) dataCopy.notes = String(updates.notes)
    if (updates.terms !== undefined) dataCopy.terms = String(updates.terms)
    if (updates.items && updates.items.length) {
      for (const upd of updates.items) {
        const action = upd.action ?? 'add'
        if (action === 'add') {
          dataCopy.items.push({
            id: crypto.randomUUID(),
            description: upd.description ?? 'Item',
            quantity: upd.quantity ?? 1,
            unitPrice: upd.unitPrice ?? 0,
          })
        } else {
          const idx = upd.id ? dataCopy.items.findIndex(i => i.id === upd.id) : dataCopy.items.length - 1
          if (idx >= 0) {
            dataCopy.items[idx] = {
              ...dataCopy.items[idx],
              ...(upd.description !== undefined ? { description: String(upd.description) } : {}),
              ...(upd.quantity !== undefined ? { quantity: Number(upd.quantity) } : {}),
              ...(upd.unitPrice !== undefined ? { unitPrice: Number(upd.unitPrice) } : {}),
            }
          }
        }
      }
    }
    const totals = calculateTotals(dataCopy)
    set({ data: dataCopy, ...totals, version: state.version + 1 })
  },
  askNextQuestion: () => {
    const questions = [
      'Who is the client (name)?',
      'What is the client address?',
      'Add an item: what is the description?',
      'What quantity?',
      'What unit price?',
      'Any notes for the invoice?',
      'Set a tax rate (%) if any.',
      'Set a discount (%) if any.',
      'What is the due date (YYYY-MM-DD)?',
    ]
    const idx = get().currentQuestionIndex + 1
    if (idx < questions.length) {
      set({
        currentQuestionIndex: idx,
        chat: [
          ...get().chat,
          { id: crypto.randomUUID(), role: 'ai', content: questions[idx], timestamp: Date.now() },
        ],
      })
    }
  },
  reset: () => set(() => ({ ...initialState })),
}))

export type { InvoiceState }


