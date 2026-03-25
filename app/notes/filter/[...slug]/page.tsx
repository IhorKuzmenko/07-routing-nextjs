import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";

export default async function FilteredNotesPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;

  const tagFromUrl = slug[0];
  const finalTag = tagFromUrl === "all" ? undefined : tagFromUrl;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, "", finalTag],
    queryFn: () => fetchNotes(1, 12, "", finalTag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={finalTag} />
    </HydrationBoundary>
  );
}