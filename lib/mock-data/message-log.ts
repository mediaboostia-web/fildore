import { getDb, wait } from "./store";
import { generateId } from "./ids";
import type { MessageLogEntry, MessageTemplateKey } from "@/features/messaging/types";

export async function getMessageLog(clientId?: string): Promise<MessageLogEntry[]> {
  await wait();
  const log = getDb().messageLog;
  return clientId ? log.filter((m) => m.clientId === clientId) : log;
}

export interface LogMessageInput {
  workshopId: string;
  clientId: string;
  orderId?: string;
  templateKey: MessageTemplateKey;
  resolvedBody: string;
  sentByUserId: string;
}

export async function logMessage(input: LogMessageInput): Promise<MessageLogEntry> {
  await wait();
  const db = getDb();
  const entry: MessageLogEntry = {
    id: generateId("message"),
    workshopId: input.workshopId,
    clientId: input.clientId,
    orderId: input.orderId,
    templateKey: input.templateKey,
    resolvedBody: input.resolvedBody,
    sentByUserId: input.sentByUserId,
    sentAt: new Date().toISOString(),
  };
  db.messageLog.push(entry);
  return entry;
}
