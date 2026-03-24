"use client";

import { useQuery, HydrationBoundary, DehydratedState } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import css from "./NotePreview.module.css";
import type { Note } from "@/types/note";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal/Modal";

interface NotePreviewProps {
  noteId: string;
  dehydratedState?: DehydratedState;
}

export default function NotePreview({ noteId, dehydratedState }: NotePreviewProps) {
  const router = useRouter();

  return (
    <HydrationBoundary state={dehydratedState}>
      <ModalWrapper noteId={noteId} onClose={() => router.back()} />
    </HydrationBoundary>
  );
}

function ModalWrapper({ noteId, onClose }: { noteId: string; onClose: () => void }) {
  const { data, isLoading, error } = useQuery<Note, Error>({
    queryKey: ["note", noteId],
    queryFn: () => fetchNoteById(noteId),
    enabled: !!noteId, 
    refetchOnMount: false,
  });

  return (
    <Modal onClose={onClose}>
      {isLoading && <p>Loading...</p>}
      {(error || !data) && <p>Upload error</p>}

      {data && (
        <div className={css.item}>
          <div className={css.header}>
            <h2>{data.title}</h2>
            <span className={css.date}>
              {new Date(data.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className={css.content}>{data.content}</div>

          <div>
            <span className={css.tag}>{data.tag}</span>
          </div>

          <button onClick={onClose} className={css.backBtn}>
            Назад
          </button>
        </div>
      )}
    </Modal>
  );
}