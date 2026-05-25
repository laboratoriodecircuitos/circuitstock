"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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

function getAuditRedirectUrl(
  status: "adjusted" | "unchanged" | "error",
  message: string,
  formData: FormData,
) {
  const params = new URLSearchParams();
  const categoryId = getString(formData, "categoryId");
  const locationId = getString(formData, "locationId");

  if (categoryId) {
    params.set("categoryId", categoryId);
  }

  if (locationId) {
    params.set("locationId", locationId);
  }

  params.set(status, status === "error" ? message : "1");

  if (status !== "error" && message) {
    params.set("message", message);
  }

  return `/auditoria?${params.toString()}`;
}

function redirectWithError(message: string, formData: FormData): never {
  redirect(getAuditRedirectUrl("error", message, formData));
}

type AuditAdjustmentResult =
  | { changed: true; componentId: string }
  | { changed: false; componentId: string }
  | { error: string };

export async function applyAuditAdjustment(formData: FormData) {
  const componentId = getString(formData, "componentId");
  const actualQuantity = getInteger(formData, "actualQuantity");
  const reason = getString(formData, "reason");

  if (!componentId) {
    redirectWithError("Informe o componente que sera ajustado.", formData);
  }

  if (actualQuantity === null) {
    redirectWithError(
      "Informe uma quantidade real inteira maior ou igual a zero.",
      formData,
    );
  }

  if (!reason) {
    redirectWithError("Informe o motivo da auditoria.", formData);
  }

  const result = await prisma.$transaction(
    async (tx): Promise<AuditAdjustmentResult> => {
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

      const delta = actualQuantity - component.quantity;

      if (delta === 0) {
        return { changed: false, componentId: component.id };
      }

      await tx.component.update({
        where: { id: component.id },
        data: {
          quantity: actualQuantity,
        },
      });

      await tx.stockMovement.create({
        data: {
          componentId: component.id,
          type: "ADJUSTMENT",
          quantity: delta,
          reason,
        },
      });

      return { changed: true, componentId: component.id };
    },
  );

  if ("error" in result) {
    redirectWithError(result.error, formData);
  }

  if (!result.changed) {
    redirect(
      getAuditRedirectUrl(
        "unchanged",
        "Nenhuma diferenca encontrada para este componente.",
        formData,
      ),
    );
  }

  revalidatePath("/auditoria");
  revalidatePath("/componentes");
  revalidatePath("/movimentacoes");
  revalidatePath("/");
  revalidatePath(`/componentes/${result.componentId}`);

  redirect(
    getAuditRedirectUrl(
      "adjusted",
      "Ajuste de auditoria aplicado com sucesso.",
      formData,
    ),
  );
}
