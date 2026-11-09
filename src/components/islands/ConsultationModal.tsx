import { useCallback, useEffect, useRef } from 'react';
import ConsultationForm from './ConsultationForm';

/**
 * Opens on any click of an element with the `.consultation-trigger` class —
 * the bridge that lets static Astro buttons open this React-rendered dialog.
 */
export default function ConsultationModal() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  useEffect(() => {
    const onTriggerClick = (event: MouseEvent) => {
      const trigger = (event.target as HTMLElement).closest<HTMLElement>('.consultation-trigger');
      if (!trigger) return;
      event.preventDefault();
      lastTrigger.current = trigger;
      const dialog = dialogRef.current;
      if (dialog && !dialog.open) {
        dialog.showModal();
        document.documentElement.classList.add('modal-open');
        window.dispatchEvent(new CustomEvent('ignis:dialog', { detail: { open: true } }));
      }
    };
    document.addEventListener('click', onTriggerClick);
    return () => document.removeEventListener('click', onTriggerClick);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => {
      document.documentElement.classList.remove('modal-open');
      window.dispatchEvent(new CustomEvent('ignis:dialog', { detail: { open: false } }));
      lastTrigger.current?.focus();
    };
    const onClick = (event: MouseEvent) => {
      // a click on the backdrop targets the dialog element itself
      if (event.target === dialog) dialog.close();
    };
    dialog.addEventListener('close', onClose);
    dialog.addEventListener('click', onClick);
    return () => {
      dialog.removeEventListener('close', onClose);
      dialog.removeEventListener('click', onClick);
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="consultation-title"
      className="consultation-dialog m-auto w-[min(720px,calc(100vw-2rem))] bg-transparent p-0 backdrop:bg-void/70 backdrop:backdrop-blur-[8px]"
    >
      <div className="dialog-frame relative overflow-hidden rounded-lg bg-surface-2">
        {/* molten top filament */}
        <span aria-hidden="true" className="absolute inset-x-0 top-0 z-10 h-[2px] animate-molten-slide bg-gradient-to-r from-ember-red via-ember-core to-ember-amber bg-[length:200%_100%]" />
        {/* grain */}
        <span aria-hidden="true" className="grain pointer-events-none absolute inset-0 opacity-[0.05]" />

        <div className="relative grid grid-cols-1 md:grid-cols-[64px_1fr]">
          {/* left instrumentation rail */}
          <div className="hidden border-r border-hairline md:flex md:flex-col md:items-center md:justify-between md:py-6">
            <svg aria-hidden="true" viewBox="0 0 36 36" className="h-5 w-5 text-[#6F3FFF]">
              <path
                d="M18.02 5.72a.55.55 0 0 0-.21.26l-.28.69a5.6 5.6 0 0 1-2.54 2.61l-.8.36a.55.55 0 0 0 0 1.09l.85.38a5.6 5.6 0 0 1 2.5 2.53l.28.64a.55.55 0 0 0 1.05 0l.28-.64a5.6 5.6 0 0 1 2.5-2.53l.85-.38a.55.55 0 0 0 0-1.09l-.8-.36a5.6 5.6 0 0 1-2.54-2.61l-.28-.69a.55.55 0 0 0-.86-.26Z"
                fill="currentColor"
              />
              <rect x="16.09" y="16.88" width="4.5" height="14" rx=".4" fill="currentColor" />
            </svg>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ember-amber/50 [writing-mode:vertical-rl]">
              CALLBACK / 1538°C
            </p>
          </div>

          <div className="max-h-[85svh] overflow-y-auto p-6 sm:p-10">
            <div className="mb-8 flex items-start justify-between gap-6">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ember-amber/70">
                  07 / IGNITION
                </p>
                <h2 id="consultation-title" className="mt-3 font-display text-[clamp(1.5rem,3.5vw,2.25rem)] leading-tight tracking-tight text-ivory">
                  Request a <em className="font-display italic text-gradient-molten">callback</em>.
                </h2>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close dialog"
                className="group -mr-1 -mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-hairline transition-colors hover:border-hairline-hot"
              >
                <svg viewBox="0 0 14 14" className="h-3.5 w-3.5 text-ivory/60 transition-colors group-hover:text-ember-amber" aria-hidden="true">
                  <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </button>
            </div>

            <ConsultationForm onClose={close} />
          </div>
        </div>
      </div>
    </dialog>
  );
}
