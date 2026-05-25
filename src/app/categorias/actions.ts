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
  redirect(`/categorias?error=${encodeURIComponent(message)}`);
}

function redirectEditWithError(id: string, message: string): never {
  redirect(
    `/categorias/${encodeURIComponent(id)}/editar?error=${encodeURIComponent(
      message,
    )}`,
  );
}

function revalidateCategoryViews() {
  revalidatePath("/categorias");
  revalidatePath("/componentes");
  revalidatePath("/");
}

export async function createCategory(formData: FormData) {
  const name = getString(formData, "name");

  if (!name) {
    redirectWithError("Informe o nome da categoria.");
  }

  const existingCategory = await prisma.category.findUnique({
    where: { name },
    select: { id: true },
  });

  if (existingCategory) {
    redirectWithError("Ja existe uma categoria com este nome.");
  }

  try {
    await prisma.category.create({
      data: {
        name,
        description: getOptionalString(formData, "description"),
      },
    });
  } catch {
    redirectWithError("Nao foi possivel criar a categoria.");
  }

  revalidateCategoryViews();
  redirect("/categorias?created=1");
}

export async function updateCategory(formData: FormData) {
  const id = getString(formData, "id");
  const name = getString(formData, "name");

  if (!id) {
    redirectWithError("Informe a categoria que sera editada.");
  }

  if (!name) {
    redirectEditWithError(id, "Informe o nome da categoria.");
  }

  const category = await prisma.category.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!category) {
    redirectWithError("A categoria selecionada nao foi encontrada.");
  }

  const existingCategory = await prisma.category.findFirst({
    where: {
      name,
      NOT: {
        id,
      },
    },
    select: { id: true },
  });

  if (existingCategory) {
    redirectEditWithError(id, "Ja existe uma categoria com este nome.");
  }

  try {
    await prisma.category.update({
      where: { id },
      data: {
        name,
        description: getOptionalString(formData, "description"),
      },
    });
  } catch {
    redirectEditWithError(id, "Nao foi possivel atualizar a categoria.");
  }

  revalidateCategoryViews();
  redirect("/categorias?updated=1");
}

export async function deleteCategory(formData: FormData) {
  const id = getString(formData, "id");
  const confirmed = getString(formData, "confirmed");

  if (!id) {
    redirectWithError("Informe a categoria que sera excluida.");
  }

  if (confirmed !== "1") {
    redirectWithError("Confirme a exclusao antes de continuar.");
  }

  const category = await prisma.category.findUnique({
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

  if (!category) {
    redirectWithError("A categoria selecionada nao foi encontrada.");
  }

  if (category._count.components > 0) {
    redirectWithError(
      "Exclusao bloqueada: esta categoria possui componentes vinculados. Mova os componentes para outra categoria antes de excluir.",
    );
  }

  try {
    await prisma.category.delete({
      where: { id },
    });
  } catch {
    redirectWithError("Nao foi possivel excluir a categoria.");
  }

  revalidateCategoryViews();
  redirect("/categorias?deleted=1");
}
