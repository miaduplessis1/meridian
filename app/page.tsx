const workflowSteps = [
  { label: 'Meeting notes', active: true },
  { label: 'Structured data', active: false },
  { label: 'Proposal preview', active: false },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f7f8fa] text-[#172033]">
      <header className="border-b border-[#e4e7ec] bg-white">
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-6 lg:px-12">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-[#14233d] text-sm font-semibold tracking-[-0.04em] text-white">PA</div>
            <div>
              <p className="text-[15px] font-semibold tracking-[-0.01em]">Proposal Agent</p>
              <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#8992a3]">Internal workspace</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-[12px] text-[#7d8798]">
            <span className="hidden sm:inline">Draft workspace</span>
            <span className="size-1.5 rounded-full bg-[#c4cad4]" aria-hidden="true" />
            <span>v0.1</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-6 py-10 lg:px-12 lg:py-14">
        <div className="mb-10 flex flex-col justify-between gap-8 border-b border-[#e1e5eb] pb-9 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#657895]">New proposal</p>
            <h1 className="text-3xl font-semibold tracking-[-0.035em] text-[#14233d] sm:text-[38px]">Turn meeting notes into a proposal.</h1>
            <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[#6e788b]">Paste the adviser&apos;s notes or a voice-note transcript below. Proposal Agent will organize the conversation into a client-ready starting point.</p>
          </div>
          <div className="flex shrink-0 items-center gap-6 text-[12px] text-[#8992a3]">
            {workflowSteps.map((step, index) => (
              <div key={step.label} className="flex items-center gap-2.5">
                <span className={`flex size-6 items-center justify-center rounded-full border text-[11px] font-semibold ${step.active ? 'border-[#3c6fa8] bg-[#3c6fa8] text-white' : 'border-[#d5dae2] bg-white text-[#9aa3b2]'}`}>{index + 1}</span>
                <span className={step.active ? 'font-medium text-[#44536a]' : ''}>{step.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
          <section aria-labelledby="notes-heading" className="rounded-xl border border-[#e1e5eb] bg-white shadow-[0_2px_8px_rgba(20,35,61,0.03)]">
            <div className="flex items-start justify-between border-b border-[#edf0f3] px-6 py-5 sm:px-8">
              <div>
                <h2 id="notes-heading" className="text-[15px] font-semibold text-[#1b2940]">Meeting notes</h2>
                <p className="mt-1 text-[13px] text-[#8a93a2]">Add everything that might inform the recommendation.</p>
              </div>
              <span className="rounded-md bg-[#f3f6fa] px-2.5 py-1 text-[11px] font-medium text-[#748197]">Required</span>
            </div>
            <div className="p-6 sm:p-8">
              <label htmlFor="meeting-notes" className="sr-only">Meeting notes or voice-note transcript</label>
              <textarea id="meeting-notes" placeholder="Paste notes or a transcript here…" className="min-h-[280px] w-full resize-y rounded-lg border border-[#dfe4eb] bg-[#fcfdfe] px-4 py-4 text-[14px] leading-7 text-[#26344b] outline-none transition placeholder:text-[#aab2bf] focus:border-[#5d86b2] focus:ring-4 focus:ring-[#5d86b2]/10" />
              <div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <p className="text-[12px] text-[#9aa3b2]">Your notes stay in this workspace.</p>
                <button type="button" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#173052] px-5 text-[13px] font-semibold text-white shadow-[0_2px_4px_rgba(23,48,82,0.18)] transition hover:bg-[#224267] focus:outline-none focus:ring-4 focus:ring-[#5d86b2]/25">
                  Generate Proposal
                  <span aria-hidden="true" className="text-base leading-none">→</span>
                </button>
              </div>
            </div>
          </section>

          <aside className="space-y-5">
            <section aria-labelledby="status-heading" className="rounded-xl border border-[#e1e5eb] bg-white p-6">
              <div className="flex items-center gap-3">
                <span className="flex size-8 items-center justify-center rounded-full bg-[#f0f4f8] text-[#70849d]" aria-hidden="true">↗</span>
                <div>
                  <h2 id="status-heading" className="text-[14px] font-semibold text-[#1b2940]">Status</h2>
                  <p className="text-[12px] text-[#96a0ae]">Ready when you are</p>
                </div>
              </div>
              <div className="mt-5 flex items-center gap-2.5 rounded-lg border border-dashed border-[#dfe4eb] bg-[#fbfcfd] px-3.5 py-3 text-[12px] text-[#8a93a2]">
                <span className="size-2 rounded-full bg-[#c3cbd5]" aria-hidden="true" />
                <span>Waiting for meeting notes</span>
              </div>
            </section>

            <section aria-labelledby="confirm-heading" className="rounded-xl border border-[#e1e5eb] bg-white p-6">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-[#b18443]" aria-hidden="true">△</span>
                <div>
                  <h2 id="confirm-heading" className="text-[14px] font-semibold text-[#1b2940]">Items to confirm with client</h2>
                  <p className="mt-1 text-[12px] leading-5 text-[#96a0ae]">Potential gaps and follow-ups will appear here.</p>
                </div>
              </div>
              <div className="mt-5 border-t border-[#edf0f3] pt-4 text-[12px] italic text-[#b0b7c2]">No items yet</div>
            </section>
          </aside>
        </div>

        <details className="group mt-6 rounded-xl border border-[#e1e5eb] bg-white">
          <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-5 text-[14px] font-semibold text-[#536176] marker:hidden sm:px-8">
            <span>Generated data <span className="ml-1 font-normal text-[#a4acb8]">(debug)</span></span>
            <span className="text-lg font-normal text-[#9aa3b2] transition group-open:rotate-45">+</span>
          </summary>
          <div className="min-h-20 border-t border-[#edf0f3] px-6 py-5 text-[12px] text-[#a4acb8] sm:px-8"> </div>
        </details>

        <section aria-labelledby="preview-heading" className="mt-10">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8994a5]">Output</p>
              <h2 id="preview-heading" className="text-[20px] font-semibold tracking-[-0.02em] text-[#1b2940]">Proposal preview</h2>
            </div>
            <span className="hidden text-[12px] text-[#9aa3b2] sm:block">Preview will appear here</span>
          </div>
          <div className="flex min-h-[800px] items-center justify-center rounded-xl border border-dashed border-[#cfd6e0] bg-white shadow-[0_2px_8px_rgba(20,35,61,0.02)]">
            <div className="text-center">
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl border border-[#e4e8ee] bg-[#fafbfd] text-[#a3adba]" aria-hidden="true">▤</div>
              <p className="text-[14px] font-medium text-[#768296]">Proposal preview</p>
              <p className="mt-1 text-[12px] text-[#a4acb8]">The generated proposal will be embedded here.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
