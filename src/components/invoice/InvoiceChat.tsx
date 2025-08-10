'use client'

import React, { useMemo, useRef, useState } from 'react'
import { useInvoiceStore } from '@/store/useInvoice'
import { Button } from '@/components/ui/button'
import { AnimatePresence, motion } from 'motion/react'

export default function InvoiceChat() {
  const { chat, addChat, applyUpdates } = useInvoiceStore()
  const [input, setInput] = useState('')
  const listRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(false)

  // Removed local question mapping; Gemini now returns structured updates.

  const handleSend = async () => {
    if (!input.trim()) return
    addChat({ role: 'user', content: input.trim() })
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userMessage: input, current: useInvoiceStore.getState().data }),
      })
      const data = await res.json()
      if (data?.updates) applyUpdates(data.updates)
      if (data?.aiMessage) addChat({ role: 'ai', content: String(data.aiMessage) })
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
      setTimeout(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' }), 50)
    }
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      <div ref={listRef} className="flex-1 overflow-y-auto rounded-xl border p-4 space-y-2 min-h-0 bg-background/40 backdrop-blur">
        <AnimatePresence initial={false}>
          {chat.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className={m.role === 'ai' ? 'text-left' : 'text-right'}
            >
              <div className={`inline-block px-3 py-2 rounded-lg shadow-sm ${m.role === 'ai' ? 'bg-accent/60' : 'bg-primary text-primary-foreground'}`}>
                {m.content}
              </div>
            </motion.div>
          ))}
          {loading && (
            <motion.div
              key="typing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-left"
            >
              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-accent/60">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className="text-xs text-muted-foreground">Thinking…</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <input
          className="flex-1 input"
          placeholder="Answer the question here"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' ? handleSend() : null}
        />
        <Button onClick={handleSend} disabled={loading}>{loading ? 'Thinking…' : 'Send'}</Button>
      </div>
      <style jsx>{`
        .input { border: 1px solid var(--border); padding: 10px 12px; border-radius: 10px; background: transparent }
      `}</style>
    </div>
  )
}


