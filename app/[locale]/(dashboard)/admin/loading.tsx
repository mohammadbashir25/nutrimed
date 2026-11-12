export default function AdminLoading() {
  return <div className="space-y-6" aria-label="Loading dashboard">
    <div className="h-8 w-56 animate-pulse rounded-lg bg-slate-200" />
    <div className="h-4 w-96 max-w-full animate-pulse rounded bg-slate-200" />
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <div key={index} className="h-32 animate-pulse rounded-2xl border border-slate-200 bg-white" />)}</div>
    <div className="h-72 animate-pulse rounded-2xl border border-slate-200 bg-white" />
  </div>;
}
