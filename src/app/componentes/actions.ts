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

function getOptionalUrl(formData: FormData, field: string) {
  const value = getOptionalString(formData, field);

  if (!value) {
    return undefined;
  }

  try {
    const url = new URL(value);

    if (url.protocol === "http:" || url.protocol === "https:") {
      return url.toString();
    }
  } catch {
    return null;
  }

  return null;
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

function redirectEditWithError(id: string, message: string): never {
  redirect(
    `/componentes/${encodeURIComponent(id)}/editar?error=${encodeURIComponent(message)}`,
  );
}

export async function createComponent(formData: FormData) {
  const name = getString(formData, "name");
  const categoryId = getString(formData, "categoryId");
  const locationId = getString(formData, "locationId");
  const quantity = getInteger(formData, "quantity");
  const minimumQuantity = getInteger(formData, "minimumQuantity");
  const datasheetUrl = getOptionalUrl(formData, "datasheetUrl");
  const purchaseUrl = getOptionalUrl(formData, "purchaseUrl");

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

  if (datasheetUrl === null) {
    redirectWithError("Informe um link de datasheet valido.");
  }

  if (purchaseUrl === null) {
    redirectWithError("Informe um link de compra valido.");
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
        manufacturer: getOptionalString(formData, "manufacturer"),
        partNumber: getOptionalString(formData, "partNumber"),
        datasheetUrl,
        purchaseUrl,
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

export async function updateComponent(formData: FormData) {
  const id = getString(formData, "id");
  const name = getString(formData, "name");
  const categoryId = getString(formData, "categoryId");
  const locationId = getString(formData, "locationId");
  const minimumQuantity = getInteger(formData, "minimumQuantity");
  const datasheetUrl = getOptionalUrl(formData, "datasheetUrl");
  const purchaseUrl = getOptionalUrl(formData, "purchaseUrl");

  if (!id) {
    redirectWithError("Informe o componente que sera editado.");
  }

  if (!name) {
    redirectEditWithError(id, "Informe o nome do componente.");
  }

  if (!categoryId) {
    redirectEditWithError(id, "Selecione uma categoria.");
  }

  if (!locationId) {
    redirectEditWithError(id, "Selecione uma localizacao.");
  }

  if (minimumQuantity === null) {
    redirectEditWithError(
      id,
      "O estoque minimo deve ser um numero inteiro maior ou igual a zero.",
    );
  }

  if (datasheetUrl === null) {
    redirectEditWithError(id, "Informe um link de datasheet valido.");
  }

  if (purchaseUrl === null) {
    redirectEditWithError(id, "Informe um link de compra valido.");
  }

  const [component, category, location] = await Promise.all([
    prisma.component.findUnique({ where: { id } }),
    prisma.category.findUnique({ where: { id: categoryId } }),
    prisma.location.findUnique({ where: { id: locationId } }),
  ]);

  if (!component) {
    redirectWithError("O componente selecionado nao foi encontrado.");
  }

  if (!category) {
    redirectEditWithError(id, "A categoria selecionada nao foi encontrada.");
  }

  if (!location) {
    redirectEditWithError(id, "A localizacao selecionada nao foi encontrada.");
  }

  await prisma.component.update({
    where: { id },
    data: {
      name,
      description: getOptionalString(formData, "description"),
      categoryId,
      locationId,
      value: getOptionalString(formData, "value"),
      unit: getOptionalString(formData, "unit"),
      packageType: getOptionalString(formData, "packageType"),
      minimumQuantity,
      manufacturer: getOptionalString(formData, "manufacturer"),
      partNumber: getOptionalString(formData, "partNumber"),
      datasheetUrl,
      purchaseUrl,
      notes: getOptionalString(formData, "notes"),
    },
  });

  revalidatePath("/componentes");
  revalidatePath("/");
  redirect("/componentes?updated=1");
}
