import NotePreview from "./NotePreview.client";
import { fetchNoteById } from "@/lib/api";
import { QueryClient, dehydrate } from "@tanstack/react-query";

export default async function Page({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return <NotePreview noteId={id} dehydratedState={dehydrate(queryClient)} />;
}