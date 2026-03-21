"use client";

import { useState, useMemo } from "react";
import { useDebouncedCallback } from "use-debounce";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  hydrate,
} from "@tanstack/react-query";
import { fetchNotes, FetchNotesResponse } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import SearchBox from "@/components/SearchBox/SearchBox";
import { Pagination } from "@/components/Pagination/Pagination";
import css from "./Notes.module.css";

import { useParams } from "next/navigation";

interface NotesClientProps {
  dehydratedState?: unknown;
  // tag?: string;  ← видаляємо, бо не використовуємо
}

export default function NotesClient({ dehydratedState }: NotesClientProps) {
  const [queryClient] = useState(() => new QueryClient());

  useMemo(() => {
    if (dehydratedState) {
      hydrate(queryClient, dehydratedState);
    }
  }, [dehydratedState, queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <NotesInner />
    </QueryClientProvider>
  );
}

function NotesInner() {
  const params = useParams();
  const slug = params.slug as string[] | undefined;
  const tagFromUrl = slug?.[0];
  const finalTag = tagFromUrl === "all" || !tagFromUrl ? undefined : tagFromUrl;

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
    queryKey: ["notes", currentPage, debouncedSearch, finalTag],
    queryFn: () =>
      fetchNotes(currentPage, perPage, debouncedSearch, finalTag),
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