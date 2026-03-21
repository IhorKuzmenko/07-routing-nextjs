import { ReactNode } from "react";
import SidebarNotes from "../notes/filter/@sidebar/page";

export default function NotesLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: "flex", gap: "20px" }}>
      <aside style={{ width: "200px" }}>
        <SidebarNotes />
      </aside>
      <main style={{ flex: 1 }}>{children}</main>
    </div>
  );
}