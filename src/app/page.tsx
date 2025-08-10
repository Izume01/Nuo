import AutoResizeTextarea from "@/lib/AutoResizeTextarea";

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

      <section className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-4xl font-bold text-white text-center">
            Welcome to our website
            <br />
            <span className="text-sm text-gray-400">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
            </span>
          </h1>
        </div>
      </section>
    </main>
  );
}
