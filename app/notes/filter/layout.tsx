import { ReactNode } from "react";

interface FilterLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
}

export default function FilterLayout({ children, sidebar }: FilterLayoutProps) {
  return (
    <div style={{ display: "flex", gap: "2rem" }}>
      <aside style={{ width: "220px", flexShrink: 0 }}>
        {sidebar}
      </aside>
      <main style={{ flex: 1 }}>{children}</main>
    </div>
  );
}