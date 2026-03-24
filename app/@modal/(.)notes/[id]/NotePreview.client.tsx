"use client";

import { useQuery, QueryClient, QueryClientProvider, hydrate, DehydratedState } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import css from "./NotePreview.module.css";
import type { Note } from "@/types/note";
import { useRouter } from "next/navigation";

interface NotePreviewProps {
  noteId: string;
  dehydratedState: DehydratedState;
}

export default function NotePreview({ noteId, dehydratedState }: NotePreviewProps) {
  const queryClient = new QueryClient();

  // Восстанавливаем серверное состояние
  hydrate(queryClient, dehydratedState);

  return (
    <QueryClientProvider client={queryClient}>
      <NoteInner noteId={noteId} />
    </QueryClientProvider>
  );
}

function NoteInner({ noteId }: { noteId: string }) {
  const router = useRouter();
  const { data, isLoading, error } = useQuery<Note, Error>({
    queryKey: ["note", noteId],
    queryFn: () => fetchNoteById(noteId),
    refetchOnMount: false, // обязательно
  });

  const handleClose = () => router.back();

  if (isLoading) return <p>Завантаження...</p>;
  if (error || !data) return <p>Помилка завантаження</p>;

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{data.title}</h2>
          <span className={css.date}>
            {new Date(data.createdAt).toLocaleDateString()}
          </span>
        </div>
        <div className={css.content}>{data.content}</div>
        <div><span className={css.tag}>{data.tag}</span></div>
        <button onClick={handleClose} className={css.backBtn}>
          Назад
        </button>
      </div>
    </div>
  );
}