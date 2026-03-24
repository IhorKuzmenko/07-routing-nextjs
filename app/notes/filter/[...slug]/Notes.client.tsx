"use client";

import { useState, useMemo } from "react";
import { useDebouncedCallback } from "use-debounce";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  hydrate,
  DehydratedState,
} from "@tanstack/react-query";
import { fetchNotes, FetchNotesResponse } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import SearchBox from "@/components/SearchBox/SearchBox";
import { Pagination } from "@/components/Pagination/Pagination";
import css from "./Notes.module.css";

interface NotesClientProps {
  dehydratedState: DehydratedState;
  tag: string | undefined;
}

export default function NotesClient({
  dehydratedState,
  tag,
}: NotesClientProps) {
  const [queryClient] = useState(() => new QueryClient());

  useMemo(() => {
    hydrate(queryClient, dehydratedState);
  }, [dehydratedState, queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <NotesInner tag={tag} />
    </QueryClientProvider>
  );
}

function NotesInner({ tag }: { tag: string | undefined }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const perPage = 12;

  const debounced = useDebouncedCallback((value: string) => {
    setDebouncedSearch(value);
    setCurrentPage(1);
  }, 500);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    debounced(value);
  };

  const { data, isLoading, isFetching, error } = useQuery<
    FetchNotesResponse,
    Error
  >({
    queryKey: ["notes", currentPage, debouncedSearch, tag],
    queryFn: () =>
      fetchNotes(currentPage, perPage, debouncedSearch, tag),
    staleTime: 60_000,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearchChange} />

        {totalPages > 1 && (
          <Pagination
            pageCount={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}

        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {isLoading && <p>Завантаження...</p>}
      {isFetching && <p>Оновлення сторінки...</p>}

      {notes.length > 0 && <NoteList notes={notes} />}

      {notes.length === 0 && !isLoading && !error && (
        <p>Нотаток за цим фільтром не знайдено</p>
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}

      {error && <p>Помилка завантаження нотаток: {error.message}</p>}
    </div>
  );
}