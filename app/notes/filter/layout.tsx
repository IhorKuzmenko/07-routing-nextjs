import { ReactNode } from "react";
import DefaultSidebar from "./@sidebar/default";

export default function FilterLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: "flex", gap: "2rem" }}>
      <aside style={{ width: "220px", flexShrink: 0 }}>
        <DefaultSidebar />
      </aside>
      <main style={{ flex: 1 }}>{children}</main>
    </div>
  );
}