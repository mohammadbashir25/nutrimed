"use client";
export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-white p-8 text-center">
    <p className="text-xs font-extrabold uppercase tracking-[.18em] text-red-600">Dashboard error</p>
    <h1 className="mt-3 text-xl font-black text-[#062f5e]">This section could not be loaded</h1>
    <p className="mt-2 text-sm leading-6 text-[#66778a]">Check the database connection and try again. If the problem continues, review the server logs.</p>
    <button onClick={reset} className="mt-6 rounded-xl bg-[#02488f] px-5 py-3 text-sm font-bold text-white hover:bg-[#062f5e]">Try again</button>
  </main>;
}
