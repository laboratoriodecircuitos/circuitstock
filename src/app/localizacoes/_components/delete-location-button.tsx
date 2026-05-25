"use client";

import { useRef } from "react";
import { useFormStatus } from "react-dom";
import { deleteLocation } from "@/app/localizacoes/actions";

type DeleteLocationButtonProps = {
  locationId: string;
  locationName: string;
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

export function DeleteLocationButton({
  locationId,
  locationName,
}: DeleteLocationButtonProps) {
  const confirmedInputRef = useRef<HTMLInputElement>(null);

  return (
    <form
      action={deleteLocation}
      onSubmit={(event) => {
        const confirmed = window.confirm(
          `Excluir "${locationName}"? Esta acao nao podera ser desfeita.`,
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
      <input type="hidden" name="id" value={locationId} />
      <input ref={confirmedInputRef} type="hidden" name="confirmed" value="" />
      <SubmitButton />
    </form>
  );
}
