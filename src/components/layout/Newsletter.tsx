import { useState, type FormEvent } from "react";
import { useSubscribe } from "@/store/saved";

export function Newsletter() {
  const { done, submit } = useSubscribe();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const ok = submit(value);
    if (!ok) setError("Lütfen geçerli bir e-posta adresi giriniz.");
    else setError("");
  };

  return (
    <section className="container-buletin py-10 md:py-14">
      <div className="rounded-[28px] bg-paper px-6 py-10 md:px-12 md:py-12">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-[460px]">
            <p className="text-[11px] font-semibold tracking-[0.22em] text-subtle uppercase">Bültene Katılın</p>
            <h2 className="mt-3 font-serif font-bold text-[28px] leading-tight text-ink md:text-[34px]">
              Günün en önemli gelişmelerini her sabah <span className="text-buletin">e-posta bültenimizle</span> alın.
            </h2>
          </div>

          {done ? (
            <p className="text-[15px] font-medium text-ink">Bültenimize kaydoldunuz. Önemli gelişmelerde size ulaşacağız.</p>
          ) : (
            <form onSubmit={onSubmit} className="flex w-full max-w-[460px] flex-col gap-2 sm:flex-row sm:items-center">
              <label htmlFor="newsletter-email" className="sr-only">
                E-posta adresiniz
              </label>
              <input
                id="newsletter-email"
                type="email"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="E-posta adresiniz"
                className="h-12 flex-1 rounded-lg border border-line bg-surface px-4 text-[14px] text-ink outline-none placeholder:text-subtle focus:border-ink"
              />
              <button
                type="submit"
                className="h-12 shrink-0 rounded-lg bg-buletin px-6 text-[14px] font-semibold text-white hover:bg-buletin-dark"
              >
                Abone Ol
              </button>
            </form>
          )}
        </div>
        {error ? <p className="mt-3 text-sm text-buletin lg:text-right">{error}</p> : null}
      </div>
    </section>
  );
}
