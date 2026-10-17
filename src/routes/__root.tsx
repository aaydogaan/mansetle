import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { TopProgressBar } from "@/components/layout/TopProgressBar";
import { pageTitle, site } from "@/lib/site";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "referrer", content: "no-referrer-when-downgrade" },
      { title: pageTitle() },
      { name: "description", content: site.description },
      { name: "application-name", content: site.name },
      { name: "author", content: site.name },
      { name: "theme-color", content: "#F0152F" },
    ],
    links: [
      { rel: "icon", type: "image/png", href: "/mansetle-fav.png" },
      { rel: "apple-touch-icon", href: "/mansetle-fav.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
    ],
  }),
  component: RootComponent,
});

const themeScript = `(function(){try{var t=localStorage.getItem("mansetle-theme-v2");document.documentElement.classList.toggle("dark",t==="dark");}catch(e){}})();`;
const fontScript = `(function(){var l=document.createElement('link');l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;0,800;1,600&display=swap';document.head.appendChild(l);})();`;

function RootComponent() {
  return (
    <html lang="tr" className="antialiased" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: fontScript }} />
        <noscript>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;0,800;1,600&display=swap"
          />
        </noscript>
        <HeadContent />
      </head>
      <body>
        <TopProgressBar />
        <PreviewHostBridge />
        <AuthProvider>
          <Outlet />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}
