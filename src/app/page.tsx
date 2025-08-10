import AutoResizeTextarea from "@/lib/AutoResizeTextarea";
import { ArrowRightIcon, MessageSquare, FileText, Wand2, Sparkles, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <main className="w-full bg-black">
      <section
        className="relative h-screen w-full overflow-hidden p-6 flex items-center justify-center"
      >
        <div
          className="absolute inset-0 bg-center bg-cover bg-no-repeat opacity-100"
          style={{
            backgroundImage: `url(/Hero_Image.jpg)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/20 to-black/0" />

        <div className="z-10 relative flex flex-col items-center justify-center h-full w-full max-w-6xl mx-auto gap-10">
          <div className="text-center px-6">
            <div>
              <p className="mb-3 text-xs sm:text-lg uppercase tracking-[0.2em] text-white/90 font-display ">
                Smart • Fast • Accurate
              </p>
            </div>
            <h1 className="font-display mb-4 text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight leading-[0.95] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
              AI‑Powered Invoice Generation
            </h1>
            <p className="mx-auto max-w-2xl text-base sm:text-lg md:text-xl text-white/85">
              Paste your invoice details and get a polished document in seconds.
            </p>
          </div>
          <AutoResizeTextarea />
        </div>
      </section>

      {/* Big value proposition */}
      <section className="container mx-auto px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl text-center space-y-4 animate-in fade-in-50">
          <h2 className="text-4xl sm:text-5xl font-display font-bold tracking-tight text-foreground">
            Invoices that look like they took hours made in minutes
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground">
            Let the assistant collect details while you focus on the work. Edit anything, watch totals update instantly,
            and export a pixel‑perfect PDF your clients will love.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10 sm:py-12">
        <div className="relative mx-auto max-w-5xl">
          <div className="pointer-events-none absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(60%_60%_at_50%_40%,black,transparent)] bg-[radial-gradient(50%_50%_at_20%_20%,theme(colors.primary/20),transparent),radial-gradient(40%_40%_at_80%_30%,theme(colors.ring/25),transparent)]" />
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4">
            {[
              'Turn scattered notes into client‑ready invoices in seconds',
              'Math you never have to check twice',
              'Your brand, every time',
              'One chat, one click, one perfect PDF',
              'Edit with confidence — everything updates instantly',
              'Clean, modern themes that impress at first glance',
              'Your time is money — keep more of both',
              'No learning curve — if you can type, you can invoice',
            ].map((text, i) => (
              <li
                key={text}
                className="group rounded-2xl border bg-card/70 backdrop-blur-sm p-4 sm:p-5 shadow-sm animate-in fade-in-50 slide-in-from-bottom-2 transition hover:-translate-y-0.5 hover:shadow-md"
                style={{ animationDelay: `${70 * i}ms` }}
              >
                <div className="flex items-start gap-4">
                  <span className="relative inline-flex size-7 items-center justify-center rounded-full ring-4 ring-primary/15 bg-gradient-to-br from-primary/90 to-primary text-primary-foreground">
                    <CheckCircle2 className="size-3.5" />
                  </span>
                  <p className="text-sm leading-relaxed text-muted-foreground group-hover:text-foreground transition-colors">
                    {text}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>



      {/* Features (shadcn-themed) */}
      <section className="container mx-auto px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {[{Icon:MessageSquare,title:'Chat your invoice',desc:'Answer a few questions or paste details. We structure everything for you.'},{Icon:FileText,title:'Live PDF preview',desc:'Two elegant themes. Edit fields inline and see totals update instantly.'},{Icon:Wand2,title:'One‑click export',desc:'Download a crisp PDF that matches the preview exactly. Ready to send.'}].map(({Icon,title,desc},i)=> (
            <div key={title} className="group rounded-xl border bg-card text-foreground p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 animate-in fade-in-50" style={{animationDelay:`${100*i}ms`}}>
              <div className="mb-4 inline-flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-110">
                <Icon className="size-5" />
              </div>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-5xl bg-card border rounded-xl p-6 sm:p-8 shadow-sm animate-in fade-in-50">
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <Sparkles className="size-4" /> <span className="text-sm">How it works</span>
          </div>
          <ol className="space-y-4 text-foreground">
            <li className="flex gap-3"><CheckCircle2 className="mt-1 size-5 text-primary" />
              <span><strong>Start a chat</strong> on the dashboard and answer only what’s missing.</span>
            </li>
            <li className="flex gap-3"><CheckCircle2 className="mt-1 size-5 text-primary" />
              <span><strong>Edit the preview</strong>—items, taxes, discounts and due dates update totals in real time.</span>
            </li>
            <li className="flex gap-3"><CheckCircle2 className="mt-1 size-5 text-primary" />
              <span><strong>Download the PDF</strong> with one click. It’s identical to what you see.</span>
            </li>
          </ol>
          <div className="mt-6">
            <Link href="/dashboard">
              <Button>Open Dashboard</Button>
            </Link>
          </div>
        </div>
      </section>


      {/* Footer */}
      <div className="bg-black text-white py-8">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-white/50">
            &copy; {new Date().getFullYear()} Invoice Generator. All rights reserved.
          </p>
        </div>
      </div>
      
    </main>
  );
}
