import Link from "next/link";
import css from "./SidebarNotes.module.css";

const tags = [
  { label: "All notes", value: "all" },
  { label: "Todo", value: "Todo" },
  { label: "Work", value: "Work" },
  { label: "Personal", value: "Personal" },
  { label: "Meeting", value: "Meeting" },
  { label: "Shopping", value: "Shopping" },
];

export default function SidebarNotes() {
  return (
    <nav className={css.sidebar}>
      <ul className={css.menuList}>
        {tags.map((tag) => (
          <li key={tag.value} className={css.menuItem}>
            <Link href={`/notes/filter/${tag.value}`} className={css.menuLink}>
              {tag.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}