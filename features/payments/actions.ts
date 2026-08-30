"use server";

import { revalidatePath } from "next/cache";
import { requireCurrentUser } from "@/lib/auth/session";
import { paymentFormSchema } from "./schemas";
import { recordPayment } from "@/lib/mock-data/payments";
import type { ActionResult } from "@/features/clients/actions";

export async function recordPaymentAction(input: unknown): Promise<ActionResult<{ id: string; receiptNumber: string }>> {
  const user = await requireCurrentUser();
  const parsed = paymentFormSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const payment = await recordPayment({
    workshopId: user.workshopId,
    ...parsed.data,
    recordedByUserId: user.id,
  });

  revalidatePath(`/commandes/${parsed.data.orderId}`);
  revalidatePath("/paiements");
  return { success: true, data: { id: payment.id, receiptNumber: payment.receiptNumber } };
}
