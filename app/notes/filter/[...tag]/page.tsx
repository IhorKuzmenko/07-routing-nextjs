import { fetchNotes } from "@/lib/api";
import NotesClient from "../../Notes.client";
import { QueryClient, dehydrate } from "@tanstack/react-query";

type Props = {
  params: Promise<{ tag?: string[] }>; 
};

export default async function FilterPage({ params }: Props) {
  const { tag } = await params; 

  const finalTag = tag?.[0] === "all" ? undefined : tag?.[0];

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, "", finalTag],
    queryFn: () => fetchNotes(1, 12, "", finalTag),
  });

  return <NotesClient dehydratedState={dehydrate(queryClient)} />;
}