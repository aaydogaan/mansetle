import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/home/HomePage";
import { SiteShell } from "@/components/layout/SiteShell";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <SiteShell>
      <HomePage />
    </SiteShell>
  );
}
