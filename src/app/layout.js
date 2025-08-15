
export const metadata = {
  title: "Revuu Anime",
  description: "AniList-powered anime browser with AI recs",
};

import "./globals.css";
import Shell from "@/components/Shell";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
