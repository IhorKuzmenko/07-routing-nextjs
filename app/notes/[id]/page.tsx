import { QueryClient, dehydrate, HydrationBoundary  } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import NotePreview from "../../@modal/(.)notes/[id]/NotePreview.client";

interface PageProps {
  params: { id?: string };
}

export default async function Page({ params }: PageProps) {
  const { id } = params;

  if (!id) return <p>Note ID not found</p>;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary  state={dehydratedState}>
      <NotePreview noteId={id} />
    </HydrationBoundary>
  );
}