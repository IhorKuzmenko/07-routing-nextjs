"use client";

import { useQuery } from "@tanstack/react-query";
import Modal from "../Modal/Modal";
import { fetchNoteById } from "@/lib/api";
import { useRouter } from "next/navigation";
import css from "./NotePreview.module.css";
import type { Note } from "@/types/note"; 

interface NotePreviewProps {
  id: string;
}

export default function NotePreview({ id }: NotePreviewProps) {
  const router = useRouter();

  const { data, isLoading, error } = useQuery<Note, Error>({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  const handleClose = () => {
    router.back();
  };

  if (isLoading) return <Modal onClose={handleClose}>Loading...</Modal>;
  if (error || !data) return <Modal onClose={handleClose}>Error loading note.</Modal>;

  return (
    <Modal onClose={handleClose}>
      <div className={css.container}>
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

          <button onClick={handleClose} className={css.backBtn}>
            Назад
          </button>
        </div>
      </div>
    </Modal>
  );
}