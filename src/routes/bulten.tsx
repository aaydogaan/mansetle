import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/SiteShell";
import { useSubscribe } from "@/store/saved";

export const Route = createFileRoute("/bulten")({ component: SubscribePage });

function SubscribePage() {
  const { done, submit, email } = useSubscribe();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!submit(value)) setError("Lütfen geçerli bir e-posta adresi giriniz.");
    else setError("");
  };

  return (
    <SiteShell showNewsletter={false}>
      <div className="container-buletin py-16 md:py-24">
        <div className="mx-auto max-w-[640px] rounded-[28px] bg-paper px-6 py-12 text-center md:px-12">
          <p className="text-[11px] font-semibold tracking-[0.22em] text-subtle uppercase">Bültene Katılın</p>
          <h1 className="mt-3 font-serif font-bold text-[34px] leading-tight md:text-[42px]">
            Günün en önemli gelişmelerini her sabah <span className="text-buletin">e-posta bültenimizle</span> alın.
          </h1>
          <p className="mx-auto mt-4 max-w-md text-[15px] text-muted">
            Tek bir bülten. Takip etmeye değer tüm haberler — spor, kültür, ekonomi ve günün özeti.
          </p>
          {done ? (
            <p className="mt-8 text-[15px] font-medium">
              {email} listemize eklendi. Önemli gelişmelerde size ulaşacağız.
            </p>
          ) : (
            <form onSubmit={onSubmit} className="mx-auto mt-8 flex max-w-[460px] flex-col gap-2 sm:flex-row">
              <input
                type="email"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="E-posta adresiniz"
                className="h-12 flex-1 rounded-lg border border-line bg-surface px-4 text-[14px] outline-none"
              />
              <button type="submit" className="h-12 rounded-lg bg-buletin px-6 text-[14px] font-semibold text-white hover:bg-buletin-dark">
                Abone Ol
              </button>
            </form>
          )}
          {error ? <p className="mt-3 text-sm text-buletin">{error}</p> : null}
        </div>
      </div>
    </SiteShell>
  );
}
