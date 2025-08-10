"use client"
import React from 'react'
import InvoiceChat from '@/components/invoice/InvoiceChat'
import InvoicePreview from '@/components/invoice/InvoicePreview'


export default function DashboardPage() {
  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 min-h-screen flex flex-col">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-24 sm:gap-6 flex-1 min-h-0">
        <div className="h-[calc(95vh-100px)] ">
          <h1 className="text-2xl font-semibold mb-4 pl-4">Chat</h1>
          <InvoiceChat />
        </div>
        <div className="h-full min-h-0 overflow-y-auto">
          <h1 className="text-2xl font-semibold mb-4 pl-4">Preview</h1>
          <InvoicePreview />
        </div>
      </div>
    </div>
  )
}
