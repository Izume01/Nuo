'use client'

import React, { useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { useInvoiceStore } from '@/store/useInvoice'
import InvoicePDF from './InvoicePDF'
import { Button } from '@/components/ui/button'

// Dynamically load PDFViewer on the client to ensure the web build is used
const PDFViewer = dynamic(() => import('@react-pdf/renderer').then((m) => m.PDFViewer as any), {
  ssr: false,
}) as unknown as React.ComponentType<React.ComponentProps<'div'> & { showToolbar?: boolean }>

// Dynamically load PDFDownloadLink for client-only use
const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((m) => m.PDFDownloadLink as any),
  { ssr: false }
) as any

export default function InvoicePreview() {
  const { data, theme, setField, addItem, updateItem, removeItem, version, setTheme } = useInvoiceStore()
  const [scale, setScale] = useState(1)
  const toggle = () => setTheme(theme === 'professional' ? 'creative' : 'professional')

  const viewerStyle: React.CSSProperties = useMemo(() => ({
    width: '100%',
    height: 'min(72vh, calc(100vh - 220px))',
    borderRadius: 14,
    border: '1px solid var(--border)',
    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
    background: 'var(--color-card)'
  }), [])

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={() => setScale((s) => Math.max(0.6, s - 0.1))}>-</Button>
        <div className="text-sm w-16 text-center">{Math.round(scale * 100)}%</div>
        <Button variant="outline" onClick={() => setScale((s) => Math.min(2, s + 0.1))}>+</Button>
        <div style={{ marginLeft: 'auto' }}>
          <PDFDownloadLink
            document={<InvoicePDF data={data} theme={theme} />}
            fileName={`${data.invoiceNumber || 'invoice'}.pdf`}
          >
            {({ loading }: any) => (
              <Button variant="secondary" disabled={loading}>
                {loading ? 'Preparing…' : 'Download PDF'}
              </Button>
            )}
          </PDFDownloadLink>
          <Button variant="outline" onClick={toggle}>Theme: {theme === 'professional' ? 'Professional' : 'Creative'}</Button>
        </div>
      </div>
      <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: '100%' }}>
        <PDFViewer style={viewerStyle} showToolbar={false} key={version}>
          <InvoicePDF data={data} theme={theme} />
        </PDFViewer>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <input className="input" placeholder="From name" value={data.from.name} onChange={(e) => setField('from.name', e.target.value)} />
          <input className="input" placeholder="Bill to name" value={data.to.name} onChange={(e) => setField('to.name', e.target.value)} />
          <input className="input" placeholder="From email" value={data.from.email} onChange={(e) => setField('from.email', e.target.value)} />
          <input className="input" placeholder="Bill to email" value={data.to.email} onChange={(e) => setField('to.email', e.target.value)} />
          <input className="input" placeholder="From phone" value={data.from.phone} onChange={(e) => setField('from.phone', e.target.value)} />
          <input className="input" placeholder="Bill to phone" value={data.to.phone} onChange={(e) => setField('to.phone', e.target.value)} />
          <input className="input" placeholder="From address" value={data.from.address} onChange={(e) => setField('from.address', e.target.value)} />
          <input className="input" placeholder="Bill to address" value={data.to.address} onChange={(e) => setField('to.address', e.target.value)} />
        </div>
        <div className="grid grid-cols-4 gap-3">
          <input className="input" placeholder="Invoice #" value={data.invoiceNumber} onChange={(e) => setField('invoiceNumber', e.target.value)} />
          <input className="input" type="date" value={data.issueDate} onChange={(e) => setField('issueDate', e.target.value)} />
          <input className="input" type="date" value={data.dueDate} onChange={(e) => setField('dueDate', e.target.value)} />
          <input className="input" placeholder="Currency" value={data.currency} onChange={(e) => setField('currency', e.target.value)} />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <label className="label">Tax %<input className="input" type="number" value={data.taxRate} onChange={(e) => setField('taxRate', Number(e.target.value))} /></label>
          <label className="label">Discount %<input className="input" type="number" value={data.discount} onChange={(e) => setField('discount', Number(e.target.value))} /></label>
          <label className="label">Signature
            <select className="input" value={data.signatureSource || 'from'} onChange={(e) => setField('signatureSource', e.target.value)}>
              <option value="from">From (Company)</option>
              <option value="to">To (Client)</option>
              <option value="custom">Custom</option>
            </select>
          </label>
        </div>
        {data.signatureSource === 'custom' && (
          <div className="grid grid-cols-1 gap-3">
            <input className="input" placeholder="Signature name" value={data.signatureName || ''} onChange={(e) => setField('signatureName', e.target.value)} />
            <label className="label">Enable signature <input type="checkbox" checked={!!data.signatureEnabled} onChange={(e) => setField('signatureEnabled', e.target.checked)} /></label>
          </div>
        )}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="font-medium">Items</div>
            <Button variant="secondary" onClick={() => addItem({})}>Add Item</Button>
          </div>
          {data.items.map((it) => (
            <div key={it.id} className="grid grid-cols-12 gap-2 items-center">
              <input className="input col-span-6" placeholder="Description" value={it.description} onChange={(e) => updateItem(it.id, { description: e.target.value })} />
              <input className="input col-span-2" type="number" placeholder="Qty" value={it.quantity} onChange={(e) => updateItem(it.id, { quantity: Number(e.target.value) })} />
              <input className="input col-span-2" type="number" placeholder="Unit Price" value={it.unitPrice} onChange={(e) => updateItem(it.id, { unitPrice: Number(e.target.value) })} />
              <Button variant="ghost" className="col-span-2" onClick={() => removeItem(it.id)}>Remove</Button>
            </div>
          ))}
        </div>
        <div className="grid gap-2">
          <textarea className="input min-h-24" placeholder="Notes" value={data.notes} onChange={(e) => setField('notes', e.target.value)} />
          <textarea className="input min-h-24" placeholder="Terms" value={data.terms} onChange={(e) => setField('terms', e.target.value)} />
        </div>
      </div>
      <style jsx>{`
        .input { border: 1px solid var(--border); padding: 8px 10px; border-radius: 8px; background: transparent }
        .label { display: flex; align-items: center; gap: 8px }
      `}</style>
    </div>
  )
}


