import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

type Props = {
  title: string;
  href?: string;
  to?: string;
  params?: Record<string, string>;
  seeAll?: string;
};

export function SectionHeader({ title, href, to, params, seeAll = "Tümünü Gör" }: Props) {
  const destination = to || href || "/";
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <h2 className="font-serif font-bold text-[28px] leading-none text-ink md:text-[32px]">{title}</h2>
      <Link
        to={destination as any}
        params={params as any}
        className="inline-flex items-center gap-1 text-sm font-medium text-buletin hover:text-buletin-dark"
      >
        {seeAll}
        <ArrowRight className="size-4" strokeWidth={2.2} />
      </Link>
    </div>
  );
}
