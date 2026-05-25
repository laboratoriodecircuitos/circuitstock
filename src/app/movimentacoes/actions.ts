"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { StockMovementType } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

function getString(formData: FormData, field: string) {
  const value = formData.get(field);
  return typeof value === "string" ? value.trim() : "";
}

function getInteger(formData: FormData, field: string) {
  const value = getString(formData, field);

  if (!/^\d+$/.test(value)) {
    return null;
  }

  return Number.parseInt(value, 10);
}

function getMovementType(value: string): StockMovementType | null {
  if (value === "ENTRY" || value === "EXIT" || value === "ADJUSTMENT") {
    return value;
  }

  return null;
}

function redirectWithError(message: string): never {
  redirect(`/movimentacoes?error=${encodeURIComponent(message)}`);
}

function revalidateStockViews() {
  revalidatePath("/movimentacoes");
  revalidatePath("/componentes");
  revalidatePath("/");
}

type MovementResult =
  | { changed: true }
  | { changed: false }
  | { error: string };

export async function createStockMovement(formData: FormData) {
  const componentId = getString(formData, "componentId");
  const type = getMovementType(getString(formData, "type"));
  const quantity = getInteger(formData, "quantity");
  const reason = getString(formData, "reason");

  if (!componentId) {
    redirectWithError("Selecione um componente.");
  }

  if (!type) {
    redirectWithError("Selecione um tipo de movimentacao valido.");
  }

  if (quantity === null) {
    redirectWithError("Informe uma quantidade inteira maior ou igual a zero.");
  }

  if (!reason) {
    redirectWithError("Informe o motivo da movimentacao manual.");
  }

  if (type !== "ADJUSTMENT" && quantity <= 0) {
    redirectWithError("Entradas e saidas exigem quantidade maior que zero.");
  }

  const result = await prisma.$transaction(async (tx): Promise<MovementResult> => {
    const component = await tx.component.findUnique({
      where: { id: componentId },
      select: {
        id: true,
        quantity: true,
      },
    });

    if (!component) {
      return { error: "O componente selecionado nao foi encontrado." };
    }

    if (type === "ENTRY") {
      await tx.component.update({
        where: { id: component.id },
        data: {
          quantity: {
            increment: quantity,
          },
        },
      });

      await tx.stockMovement.create({
        data: {
          componentId: component.id,
          type,
          quantity,
          reason,
        },
      });

      return { changed: true };
    }

    if (type === "EXIT") {
      if (quantity > component.quantity) {
        return {
          error:
            "Saida bloqueada: a quantidade informada e maior que o estoque disponivel.",
        };
      }

      await tx.component.update({
        where: { id: component.id },
        data: {
          quantity: {
            decrement: quantity,
          },
        },
      });

      await tx.stockMovement.create({
        data: {
          componentId: component.id,
          type,
          quantity: -quantity,
          reason,
        },
      });

      return { changed: true };
    }

    const delta = quantity - component.quantity;

    if (delta === 0) {
      return { changed: false };
    }

    await tx.component.update({
      where: { id: component.id },
      data: {
        quantity,
      },
    });

    await tx.stockMovement.create({
      data: {
        componentId: component.id,
        type,
        quantity: delta,
        reason,
      },
    });

    return { changed: true };
  });

  if ("error" in result) {
    redirectWithError(result.error);
  }

  if (!result.changed) {
    redirect("/movimentacoes?unchanged=1");
  }

  revalidateStockViews();
  redirect("/movimentacoes?created=1");
}
