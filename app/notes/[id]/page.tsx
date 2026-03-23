"use client";

import { useRouter, useParams } from "next/navigation";
import Modal from "../../../components/Modal/Modal";
import NoteDetailsClient from "./NoteDetails.client";

export default function NoteModalPage() {
  const router = useRouter();
  const params = useParams();

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const handleClose = () => router.back();

  if (!id) return null;

  return (
    <Modal onClose={handleClose}>
      <NoteDetailsClient noteId={id} />
    </Modal>
  );
}