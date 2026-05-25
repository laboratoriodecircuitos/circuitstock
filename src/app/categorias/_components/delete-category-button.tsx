"use client";

import { useRef } from "react";
import { useFormStatus } from "react-dom";
import { deleteCategory } from "@/app/categorias/actions";

type DeleteCategoryButtonProps = {
  categoryId: string;
  categoryName: string;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex rounded-md border border-red-200 bg-white px-3 py-2 text-xs font-medium text-red-700 transition hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
    >
      {pending ? "Excluindo..." : "Excluir"}
    </button>
  );
}

export function DeleteCategoryButton({
  categoryId,
  categoryName,
}: DeleteCategoryButtonProps) {
  const confirmedInputRef = useRef<HTMLInputElement>(null);

  return (
    <form
      action={deleteCategory}
      onSubmit={(event) => {
        const confirmed = window.confirm(
          `Excluir "${categoryName}"? Esta acao nao podera ser desfeita.`,
        );

        if (!confirmed) {
          event.preventDefault();
          return;
        }

        if (confirmedInputRef.current) {
          confirmedInputRef.current.value = "1";
        }
      }}
    >
      <input type="hidden" name="id" value={categoryId} />
      <input ref={confirmedInputRef} type="hidden" name="confirmed" value="" />
      <SubmitButton />
    </form>
  );
}
