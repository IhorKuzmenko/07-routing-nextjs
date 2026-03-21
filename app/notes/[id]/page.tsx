"use client";

import NoteDetailsClient from "./NoteDetails.client";
import Modal from "../../../components/Modal/Modal";
import { useRouter } from "next/navigation";

interface NoteModalPageProps {
  params: { id: string };
}

export default function NoteModalPage({ params }: NoteModalPageProps) {
  const router = useRouter();
  const handleClose = () => router.back();

  if (!params?.id) return null;

  return (
    <Modal onClose={handleClose}>
      <NoteDetailsClient noteId={params.id} />
    </Modal>
  );
}