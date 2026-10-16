import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/kaydedilenler")({ component: SavedPage });

function SavedPage() {
  return <Navigate to="/" replace />;
}
