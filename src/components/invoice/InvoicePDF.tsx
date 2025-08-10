'use client'

import React, { useMemo } from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { InvoiceData, InvoiceTheme } from '@/store/useInvoice'

// To enhance the design and ensure readability, we define a design system.
// This centralizes colors and styles, making the invoice look more professional
// and easier to maintain. The dark mode is designed for high contrast and comfort.

const designSystem = {
  colors: {
    light: {
      bg: '#FFFFFF',
      text: '#111827', // Gray 900
      muted: '#6B7280', // Gray 500
      accent: '#2563EB', // Blue 600
      border: '#E5E7EB', // Gray 200
      box: '#F9FAFB',   // Gray 50
      altRow: '#F3F4F6', // Gray 100
    },
    dark: {
      bg: '#0A0F1E',
      text: '#E2E8F0', // Slate 200
      muted: '#9CA3AF', // Gray 400
      accent: '#60A5FA', // Blue 400
      border: '#374151', // Gray 700
      box: '#111827',   // Gray 900
      altRow: '#1F2937', // Gray 800
    },
  },
  typography: {
    fontFamily: 'Helvetica', // Using a standard, safe font for PDF compatibility
    baseSize: 12,
    titleSize: 42,
    labelSize: 9,
    valueSize: 13,
  },
};
interface Props {
  data: InvoiceData
  theme: InvoiceTheme
}

// ---------- Base Styles ----------
const stylesBase = StyleSheet.create({
  page: { padding: 48, fontSize: 12, fontFamily: 'Helvetica' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 },
  section: { marginBottom: 24 },
  title: { fontSize: 42, fontWeight: 700, letterSpacing: -1 },
  label: { fontSize: 9, opacity: 0.6, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4 },
  value: { fontSize: 13, lineHeight: 1.4 },
  tableHeader: { flexDirection: 'row', borderBottomWidth: 2, paddingBottom: 8, marginBottom: 12 },
  tableRow: { flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 1 },
  colDesc: { flex: 5, paddingRight: 16 },
  colQty: { flex: 1, textAlign: 'right' },
  colPrice: { flex: 2, textAlign: 'right', paddingHorizontal: 16 },
  colTotal: { flex: 2, textAlign: 'right' },
})

// ---------- Component ----------
export function InvoicePDF({ data, theme }: Props) {
  const themeStyles = useMemo(() => {
    if (theme === 'creative') {
      return StyleSheet.create({
        page: { ...stylesBase.page, backgroundColor: '#0A0F1E', color: '#E2E8F0' },
        accent: { color: '#60A5FA' },
        box: { backgroundColor: '#111827', padding: 24, borderRadius: 12, borderWidth: 1, borderColor: '#1F2937' },
        totalBox: { 
          backgroundColor: '#2563EB',
          color: '#ffffff',
          padding: '12 20',
          borderRadius: 8,
          fontWeight: 700,
          fontSize: 16
        },
        altRow: { backgroundColor: '#1F2937' },
        border: { borderColor: '#374151' },
        muted: { color: '#9CA3AF' }
      })
    }
    return StyleSheet.create({
      page: { ...stylesBase.page, backgroundColor: '#FFFFFF', color: '#1F2937' },
      accent: { color: '#2563EB' },
      box: { 
        backgroundColor: '#F8FAFC',
        padding: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      },
      totalBox: { 
        backgroundColor: '#2563EB',
        color: '#ffffff',
        padding: '12 20',
        borderRadius: 8,
        fontWeight: 700,
        fontSize: 16
      },
      altRow: { backgroundColor: '#F1F5F9' },
      border: { borderColor: '#E2E8F0' },
      muted: { color: '#64748B' }
    })
  }, [theme])

  const currency = data.currency || 'USD'
  const format = (n: number) => new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(n)

  const subtotal = data.items.reduce((s, it) => s + it.quantity * it.unitPrice, 0)
  const discountAmount = (data.discount / 100) * subtotal
  const taxable = Math.max(0, subtotal - discountAmount)
  const taxAmount = (data.taxRate / 100) * taxable
  const total = taxable + taxAmount

  const signature = `${data.from.name.split(' ')[0]} ${data.from.name.split(' ')[1] || ''}`.trim()

  return (
    <Document>
      <Page size="A4" style={themeStyles.page}>
        
        {/* HEADER */}
        <View style={stylesBase.headerRow}>
          <Text style={[stylesBase.title, themeStyles.accent]}>Invoice</Text>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={[stylesBase.label, themeStyles.muted]}>Invoice #</Text>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{data.invoiceNumber}</Text>
          </View>
        </View>

        {/* FROM / TO SECTION */}
        <View style={[stylesBase.section, themeStyles.box]}>
          <View style={[stylesBase.headerRow, { marginBottom: 24 }]}>
            <View style={{ flex: 1 }}>
              <Text style={[stylesBase.label, themeStyles.muted]}>From</Text>
              <Text style={[stylesBase.value, { fontSize: 16, fontWeight: 'bold', marginBottom: 8 }]}>{data.from.name}</Text>
              <Text style={[stylesBase.value, themeStyles.muted]}>{data.from.address}</Text>
              <Text style={[stylesBase.value, themeStyles.muted]}>{data.from.email}</Text>
              <Text style={[stylesBase.value, themeStyles.muted]}>{data.from.phone}</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <Text style={[stylesBase.label, themeStyles.muted]}>Bill To</Text>
              <Text style={[stylesBase.value, { fontSize: 16, fontWeight: 'bold', marginBottom: 8 }]}>{data.to.name}</Text>
              <Text style={[stylesBase.value, themeStyles.muted]}>{data.to.address}</Text>
              <Text style={[stylesBase.value, themeStyles.muted]}>{data.to.email}</Text>
              <Text style={[stylesBase.value, themeStyles.muted]}>{data.to.phone}</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: themeStyles.border.borderColor, paddingTop: 16 }}>
            <View style={{ flex: 1 }}>
              <Text style={[stylesBase.label, themeStyles.muted]}>Issue Date</Text>
              <Text style={stylesBase.value}>{data.issueDate}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[stylesBase.label, themeStyles.muted]}>Due Date</Text>
              <Text style={stylesBase.value}>{data.dueDate}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[stylesBase.label, themeStyles.muted]}>Currency</Text>
              <Text style={stylesBase.value}>{data.currency}</Text>
            </View>
          </View>
        </View>

        {/* ITEM TABLE */}
        <View style={[stylesBase.section, themeStyles.box]}>
          <View style={[stylesBase.tableHeader, { borderColor: themeStyles.border.borderColor }]}>
            <Text style={[stylesBase.colDesc, stylesBase.label, themeStyles.muted]}>Description</Text>
            <Text style={[stylesBase.colQty, stylesBase.label, themeStyles.muted]}>Qty</Text>
            <Text style={[stylesBase.colPrice, stylesBase.label, themeStyles.muted]}>Unit</Text>
            <Text style={[stylesBase.colTotal, stylesBase.label, themeStyles.muted]}>Total</Text>
          </View>
          {data.items.map((it, index) => (
            <View
              key={it.id}
              style={[
                stylesBase.tableRow,
                { borderColor: themeStyles.border.borderColor },
                index % 2 ? themeStyles.altRow : {}
              ]}
            >
              <Text style={[stylesBase.colDesc, { fontWeight: 500 }]}>{it.description}</Text>
              <Text style={stylesBase.colQty}>{it.quantity}</Text>
              <Text style={stylesBase.colPrice}>{format(it.unitPrice)}</Text>
              <Text style={[stylesBase.colTotal, { fontWeight: 500 }]}>{format(it.quantity * it.unitPrice)}</Text>
            </View>
          ))}
          
          {/* Add empty rows when there are few items to maintain consistent spacing */}
          {data.items.length < 4 && Array.from({ length: 4 - data.items.length }).map((_, index) => (
            <View
              key={`empty-${index}`}
              style={[
                stylesBase.tableRow,
                { borderColor: themeStyles.border.borderColor, minHeight: 30 },
                (data.items.length + index) % 2 ? themeStyles.altRow : {}
              ]}
            >
              <Text style={stylesBase.colDesc}></Text>
              <Text style={stylesBase.colQty}></Text>
              <Text style={stylesBase.colPrice}></Text>
              <Text style={stylesBase.colTotal}></Text>
            </View>
          ))}
        </View>

        {/* TOTALS */}
        <View style={[stylesBase.section, { alignItems: 'flex-end', gap: 8 }]}>
          <View style={{ flexDirection: 'row', gap: 32, marginBottom: 4 }}>
            <Text style={[stylesBase.label, themeStyles.muted]}>Subtotal</Text>
            <Text style={{ fontSize: 14 }}>{format(subtotal)}</Text>
          </View>
          {data.discount > 0 && (
            <View style={{ flexDirection: 'row', gap: 32, marginBottom: 4 }}>
              <Text style={[stylesBase.label, themeStyles.muted]}>Discount ({data.discount}%)</Text>
              <Text style={{ fontSize: 14, color: '#EF4444' }}>-{format(discountAmount)}</Text>
            </View>
          )}
          {data.taxRate > 0 && (
            <View style={{ flexDirection: 'row', gap: 32, marginBottom: 4 }}>
              <Text style={[stylesBase.label, themeStyles.muted]}>Tax ({data.taxRate}%)</Text>
              <Text style={{ fontSize: 14 }}>{format(taxAmount)}</Text>
            </View>
          )}
          <View style={{ flexDirection: 'row', gap: 32, marginTop: 8 }}>
            <Text style={[themeStyles.totalBox]}>{`Total Due: ${format(total)}`}</Text>
          </View>
        </View>

        {/* NOTES & TERMS */}
        {(data.notes || data.terms) && (
          <View style={[stylesBase.section, themeStyles.box]}>
            {data.notes && (
              <View style={{ marginBottom: 16 }}>
                <Text style={[stylesBase.label, themeStyles.muted]}>Notes</Text>
                <Text style={[stylesBase.value, { lineHeight: 1.6 }]}>{data.notes}</Text>
              </View>
            )}
            {data.terms && (
              <View>
                <Text style={[stylesBase.label, themeStyles.muted]}>Terms & Conditions</Text>
                <Text style={[stylesBase.value, { lineHeight: 1.6 }]}>{data.terms}</Text>
              </View>
            )}
          </View>
        )}

        {/* SIGNATURE */}
        <View style={{ marginTop: 48, alignItems: 'flex-end' }}>
          <Text style={[stylesBase.label, themeStyles.muted]}>Authorized Signature</Text>
          <Text style={{ fontFamily: 'Courier', fontSize: 18, marginTop: 8, color: themeStyles.accent.color }}>{`/${signature}/`}</Text>
        </View>

      </Page>
    </Document>
  )
}

export default InvoicePDF
