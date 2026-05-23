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

function getInteger(formData: FormData, field: string) {
  const value = getString(formData, field);

  if (!/^\d+$/.test(value)) {
    return null;
  }

  return Number.parseInt(value, 10);
}

function redirectWithError(message: string): never {
  redirect(`/componentes?error=${encodeURIComponent(message)}`);
}

export async function createComponent(formData: FormData) {
  const name = getString(formData, "name");
  const categoryId = getString(formData, "categoryId");
  const locationId = getString(formData, "locationId");
  const quantity = getInteger(formData, "quantity");
  const minimumQuantity = getInteger(formData, "minimumQuantity");

  if (!name) {
    redirectWithError("Informe o nome do componente.");
  }

  if (!categoryId) {
    redirectWithError("Selecione uma categoria.");
  }

  if (!locationId) {
    redirectWithError("Selecione uma localizacao.");
  }

  if (quantity === null) {
    redirectWithError("A quantidade deve ser um numero inteiro maior ou igual a zero.");
  }

  if (minimumQuantity === null) {
    redirectWithError(
      "O estoque minimo deve ser um numero inteiro maior ou igual a zero.",
    );
  }

  const [category, location] = await Promise.all([
    prisma.category.findUnique({ where: { id: categoryId } }),
    prisma.location.findUnique({ where: { id: locationId } }),
  ]);

  if (!category) {
    redirectWithError("A categoria selecionada nao foi encontrada.");
  }

  if (!location) {
    redirectWithError("A localizacao selecionada nao foi encontrada.");
  }

  await prisma.$transaction(async (tx) => {
    const component = await tx.component.create({
      data: {
        name,
        description: getOptionalString(formData, "description"),
        categoryId,
        locationId,
        value: getOptionalString(formData, "value"),
        unit: getOptionalString(formData, "unit"),
        packageType: getOptionalString(formData, "packageType"),
        quantity,
        minimumQuantity,
        notes: getOptionalString(formData, "notes"),
      },
    });

    if (quantity > 0) {
      await tx.stockMovement.create({
        data: {
          componentId: component.id,
          type: "ENTRY",
          quantity,
          reason: "Cadastro inicial do componente",
        },
      });
    }
  });

  revalidatePath("/componentes");
  revalidatePath("/");
  redirect("/componentes?created=1");
}
