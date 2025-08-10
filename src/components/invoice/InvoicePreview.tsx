'use client'

import React, { useMemo } from 'react'
import dynamic from 'next/dynamic'
import { useInvoiceStore } from '@/store/useInvoice'
import InvoicePDF from './InvoicePDF'
import { Button } from '@/components/ui/button'

// Dynamically load PDFViewer on the client to ensure the web build is used
const PDFViewer = dynamic(() => import('@react-pdf/renderer').then((m) => m.PDFViewer as any), {
  ssr: false,
}) as unknown as React.ComponentType<React.ComponentProps<'div'> & { showToolbar?: boolean }>

// We will generate the PDF on click using the `pdf()` API to avoid SSR/globals issues

export default function InvoicePreview() {
  const { data, theme, setField, addItem, updateItem, removeItem, version, setTheme } = useInvoiceStore()
  const toggle = () => setTheme(theme === 'professional' ? 'creative' : 'professional')

  const viewerStyle: React.CSSProperties = useMemo(() => ({
    width: '100%',
    height: '72vh',
    borderRadius: 14,
    border: '1px solid var(--border)',
    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
    background: 'var(--color-card)'
  }), [])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <div style={{ marginLeft: 'auto' }}>
          <Button
            variant="secondary"
            onClick={async () => {
              const { pdf } = await import('@react-pdf/renderer')
              const blob = await pdf(<InvoicePDF data={data} theme={theme} />).toBlob()
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `${data.invoiceNumber || 'invoice'}.pdf`
              document.body.appendChild(a)
              a.click()
              a.remove()
              URL.revokeObjectURL(url)
            }}
          >
            Download PDF
          </Button>
          <Button variant="outline" onClick={toggle}>Theme: {theme === 'professional' ? 'Professional' : 'Creative'}</Button>
        </div>
      </div>
      <div className="w-full overflow-auto">
        <PDFViewer style={viewerStyle} showToolbar={false} key={version}>
          <InvoicePDF data={data} theme={theme} />
        </PDFViewer>
      </div>

      <div className="space-y-8">
        {/* From/To Information */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">From</h3>
            <input className="input w-full" placeholder="Company name" value={data.from.name} onChange={(e) => setField('from.name', e.target.value)} />
            <input className="input w-full" placeholder="Email address" value={data.from.email} onChange={(e) => setField('from.email', e.target.value)} />
            <input className="input w-full" placeholder="Phone number" value={data.from.phone} onChange={(e) => setField('from.phone', e.target.value)} />
            <input className="input w-full" placeholder="Address" value={data.from.address} onChange={(e) => setField('from.address', e.target.value)} />
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Bill To</h3>
            <input className="input w-full" placeholder="Client name" value={data.to.name} onChange={(e) => setField('to.name', e.target.value)} />
            <input className="input w-full" placeholder="Email address" value={data.to.email} onChange={(e) => setField('to.email', e.target.value)} />
            <input className="input w-full" placeholder="Phone number" value={data.to.phone} onChange={(e) => setField('to.phone', e.target.value)} />
            <input className="input w-full" placeholder="Address" value={data.to.address} onChange={(e) => setField('to.address', e.target.value)} />
          </div>
        </div>

        {/* Invoice Details */}
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Invoice Number</label>
            <input className="input w-full" placeholder="INV-001" value={data.invoiceNumber} onChange={(e) => setField('invoiceNumber', e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Issue Date</label>
            <input className="input w-full" type="date" value={data.issueDate} onChange={(e) => setField('issueDate', e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Due Date</label>
            <input className="input w-full" type="date" value={data.dueDate} onChange={(e) => setField('dueDate', e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Currency</label>
            <input className="input w-full" placeholder="USD" value={data.currency} onChange={(e) => setField('currency', e.target.value)} />
          </div>
        </div>

        {/* Tax, Discount, Signature */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Tax Rate (%)</label>
            <input className="input w-full" type="number" value={data.taxRate} onChange={(e) => setField('taxRate', Number(e.target.value))} />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Discount (%)</label>
            <input className="input w-full" type="number" value={data.discount} onChange={(e) => setField('discount', Number(e.target.value))} />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Signature</label>
            <select className="input w-full" value={data.signatureSource || 'from'} onChange={(e) => setField('signatureSource', e.target.value)}>
              <option value="from">From (Company)</option>
              <option value="to">To (Client)</option>
              <option value="custom">Custom</option>
            </select>
          </div>
        </div>

        {/* Custom Signature Options */}
        {data.signatureSource === 'custom' && (
          <div className="grid grid-cols-2 gap-4 items-center">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Custom Signature Name</label>
              <input className="input w-full" placeholder="Signature name" value={data.signatureName || ''} onChange={(e) => setField('signatureName', e.target.value)} />
            </div>
            <div className="flex items-center h-full pt-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  checked={!!data.signatureEnabled} 
                  onChange={(e) => setField('signatureEnabled', e.target.checked)} 
                />
                <span className="text-sm">Enable signature</span>
              </label>
            </div>
          </div>
        )}

        {/* Items Section */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Line Items</h3>
            <Button variant="secondary" size="sm" onClick={() => addItem({})}>
              Add Item
            </Button>
          </div>
          
          {data.items.length > 0 && (
            <div className="grid grid-cols-12 gap-2 text-xs font-medium text-muted-foreground px-2 mb-1">
              <div className="col-span-6">Description</div>
              <div className="col-span-2">Quantity</div>
              <div className="col-span-2">Unit Price</div>
              <div className="col-span-2"></div>
            </div>
          )}
          
          {data.items.map((it) => (
            <div key={it.id} className="grid grid-cols-12 gap-2 items-center">
              <input className="input col-span-6" placeholder="Item description" value={it.description} onChange={(e) => updateItem(it.id, { description: e.target.value })} />
              <input className="input col-span-2" type="number" placeholder="Qty" value={it.quantity} onChange={(e) => updateItem(it.id, { quantity: Number(e.target.value) })} />
              <input className="input col-span-2" type="number" placeholder="Price" value={it.unitPrice} onChange={(e) => updateItem(it.id, { unitPrice: Number(e.target.value) })} />
              <Button
                variant="destructive"
                size="sm"
                className="col-span-2 text-destructive border-destructive/40 hover:text-red-500"
                onClick={() => removeItem(it.id)}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>

        {/* Notes and Terms */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Notes</label>
            <textarea 
              className="input w-full min-h-24 resize-none" 
              placeholder="Additional notes for the client" 
              value={data.notes} 
              onChange={(e) => setField('notes', e.target.value)} 
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Terms & Conditions</label>
            <textarea 
              className="input w-full min-h-24 resize-none" 
              placeholder="Payment terms and conditions" 
              value={data.terms} 
              onChange={(e) => setField('terms', e.target.value)} 
            />
          </div>
        </div>
      </div>
      <style jsx>{`
        .input {
          border: 1px solid var(--border);
          padding: 0.5rem 0.75rem;
          border-radius: 0.375rem;
          background: transparent;
          font-size: 0.875rem;
          transition: border-color 0.15s ease;
        }
        .input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 1px var(--primary-light);
        }
        .input::placeholder {
          color: var(--muted-foreground);
        }
      `}</style>
    </div>
  )
}


