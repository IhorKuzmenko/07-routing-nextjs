"use client";

import { useRouter } from "next/navigation";
import * as React from "react";              
import Modal from "@/components/Modal/Modal";
import NoteDetailsClient from "@/app/notes/[id]/NoteDetails.client"; 

export default function NoteModalPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);   
  const id = resolvedParams.id;               

  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  return (
    <Modal onClose={handleClose}>
      <NoteDetailsClient noteId={id} />
    </Modal>
  );
}