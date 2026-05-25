"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

function getString(formData: FormData, field: string) {
  const value = formData.get(field);
  return typeof value === "string" ? value.trim() : "";
}

function getOptionalString(formData: FormData, field: string) {
  const value = getString(formData, field);
  return value.length > 0 ? value : undefined;
}

function redirectWithError(message: string): never {
  redirect(`/localizacoes?error=${encodeURIComponent(message)}`);
}

function redirectEditWithError(id: string, message: string): never {
  redirect(
    `/localizacoes/${encodeURIComponent(id)}/editar?error=${encodeURIComponent(
      message,
    )}`,
  );
}

function revalidateLocationViews() {
  revalidatePath("/localizacoes");
  revalidatePath("/componentes");
  revalidatePath("/");
}

export async function createLocation(formData: FormData) {
  const name = getString(formData, "name");

  if (!name) {
    redirectWithError("Informe o nome da localizacao.");
  }

  const existingLocation = await prisma.location.findUnique({
    where: { name },
    select: { id: true },
  });

  if (existingLocation) {
    redirectWithError("Ja existe uma localizacao com este nome.");
  }

  try {
    await prisma.location.create({
      data: {
        name,
        description: getOptionalString(formData, "description"),
      },
    });
  } catch {
    redirectWithError("Nao foi possivel criar a localizacao.");
  }

  revalidateLocationViews();
  redirect("/localizacoes?created=1");
}

export async function updateLocation(formData: FormData) {
  const id = getString(formData, "id");
  const name = getString(formData, "name");

  if (!id) {
    redirectWithError("Informe a localizacao que sera editada.");
  }

  if (!name) {
    redirectEditWithError(id, "Informe o nome da localizacao.");
  }

  const location = await prisma.location.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!location) {
    redirectWithError("A localizacao selecionada nao foi encontrada.");
  }

  const existingLocation = await prisma.location.findFirst({
    where: {
      name,
      NOT: {
        id,
      },
    },
    select: { id: true },
  });

  if (existingLocation) {
    redirectEditWithError(id, "Ja existe uma localizacao com este nome.");
  }

  try {
    await prisma.location.update({
      where: { id },
      data: {
        name,
        description: getOptionalString(formData, "description"),
      },
    });
  } catch {
    redirectEditWithError(id, "Nao foi possivel atualizar a localizacao.");
  }

  revalidateLocationViews();
  redirect("/localizacoes?updated=1");
}

export async function deleteLocation(formData: FormData) {
  const id = getString(formData, "id");
  const confirmed = getString(formData, "confirmed");

  if (!id) {
    redirectWithError("Informe a localizacao que sera excluida.");
  }

  if (confirmed !== "1") {
    redirectWithError("Confirme a exclusao antes de continuar.");
  }

  const location = await prisma.location.findUnique({
    where: { id },
    select: {
      id: true,
      _count: {
        select: {
          components: true,
        },
      },
    },
  });

  if (!location) {
    redirectWithError("A localizacao selecionada nao foi encontrada.");
  }

  if (location._count.components > 0) {
    redirectWithError(
      "Exclusao bloqueada: esta localizacao possui componentes vinculados. Mova os componentes para outra localizacao antes de excluir.",
    );
  }

  try {
    await prisma.location.delete({
      where: { id },
    });
  } catch {
    redirectWithError("Nao foi possivel excluir a localizacao.");
  }

  revalidateLocationViews();
  redirect("/localizacoes?deleted=1");
}
