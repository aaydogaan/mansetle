import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/home/HomePage";
import { SiteShell } from "@/components/layout/SiteShell";
import { pageTitle, seoHead, site } from "@/lib/site";

export const Route = createFileRoute("/")({ head: () => seoHead({ title: pageTitle(), description: site.description, path: "/" }), component: Home });
function Home() { return <SiteShell><HomePage /></SiteShell>; }
