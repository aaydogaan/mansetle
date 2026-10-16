import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { pageTitle, site } from "@/lib/site";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({ meta: [{ charSet: "utf-8" }, { name: "viewport", content: "width=device-width, initial-scale=1" }, { title: pageTitle() }, { name: "description", content: site.description }, { name: "application-name", content: site.name }, { name: "author", content: site.name }, { name: "theme-color", content: "#F0152F" }], links: [{ rel: "icon", type: "image/svg+xml", href: "/mansetle-fav.svg" }, { rel: "preconnect", href: "https://fonts.googleapis.com" }, { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" }, { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Source+Serif+4:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600;1,700&display=swap" }, { rel: "stylesheet", href: appCss }, { rel: "manifest", href: "/__grok/manifest.webmanifest" }, { rel: "apple-touch-icon", href: "/__grok/icon-180.png" }] }),
  component: RootComponent,
});

const themeScript = `(function(){try{var t=localStorage.getItem("mansetle-theme-v2");document.documentElement.classList.toggle("dark",t==="dark");}catch(e){}})();`;
function RootComponent() { return <html lang="tr" className="antialiased" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: themeScript }} /><HeadContent /></head><body><PreviewHostBridge /><AuthProvider><Outlet /></AuthProvider><Scripts /></body></html>; }
