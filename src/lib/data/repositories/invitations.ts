import type { DatabaseSync } from "node:sqlite";
import type { Invitation, InvitationStatus } from "@/types";
import { newId, now, orNull, randomToken } from "./utils";

interface InvitationRow {
  id: string;
  wedding_id: string;
  guest_id: string;
  token: string;
  status: InvitationStatus;
  sent_at: string | null;
  opened_at: string | null;
  created_at: string;
}

function mapRow(row: InvitationRow): Invitation {
  return {
    id: row.id,
    weddingId: row.wedding_id,
    guestId: row.guest_id,
    token: row.token,
    status: row.status,
    sentAt: row.sent_at,
    openedAt: row.opened_at,
    createdAt: row.created_at,
  };
}

const SELECT_COLUMNS = `
  id, wedding_id, guest_id, token, status, sent_at, opened_at, created_at
`;

export type NewInvitation = Pick<
  Invitation,
  "weddingId" | "guestId" | "token"
> &
  Partial<Omit<Invitation, "id" | "weddingId" | "guestId" | "token">>;

export function createInvitationsRepository(db: DatabaseSync) {
  const insertStmt = db.prepare(
    `INSERT INTO invitations
       (id, wedding_id, guest_id, token, status, sent_at, opened_at, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  const byIdStmt = db.prepare(
    `SELECT ${SELECT_COLUMNS} FROM invitations WHERE id = ?`,
  );
  const byGuestStmt = db.prepare(
    `SELECT ${SELECT_COLUMNS} FROM invitations WHERE guest_id = ?`,
  );
  const byWeddingStmt = db.prepare(
    `SELECT ${SELECT_COLUMNS} FROM invitations WHERE wedding_id = ? ORDER BY created_at ASC`,
  );
  const byTokenStmt = db.prepare(
    `SELECT ${SELECT_COLUMNS} FROM invitations WHERE token = ?`,
  );
  const setSentStmt = db.prepare(
    `UPDATE invitations SET status = 'SENT', sent_at = ? WHERE id = ?`,
  );
  const setOpenedStmt = db.prepare(
    `UPDATE invitations SET opened_at = ? WHERE id = ?`,
  );
  const deleteStmt = db.prepare(`DELETE FROM invitations WHERE id = ?`);

  return {
    create(input: NewInvitation): Invitation {
      const row: InvitationRow = {
        id: newId(),
        wedding_id: input.weddingId,
        guest_id: input.guestId,
        token: input.token,
        status: input.status ?? "PENDING",
        sent_at: orNull(input.sentAt),
        opened_at: orNull(input.openedAt),
        created_at: input.createdAt ?? now(),
      };
      insertStmt.run(
        row.id,
        row.wedding_id,
        row.guest_id,
        row.token,
        row.status,
        row.sent_at,
        row.opened_at,
        row.created_at,
      );
      return mapRow(row);
    },
    createWithToken(weddingId: string, guestId: string): Invitation {
      return this.create({
        weddingId,
        guestId,
        token: randomToken(),
      });
    },
    findById(id: string): Invitation | null {
      const row = byIdStmt.get(id) as unknown as InvitationRow | undefined;
      return row ? mapRow(row) : null;
    },
    findByGuestId(guestId: string): Invitation | null {
      const row = byGuestStmt.get(guestId) as unknown as InvitationRow | undefined;
      return row ? mapRow(row) : null;
    },
    findManyByWedding(weddingId: string): Invitation[] {
      return (byWeddingStmt.all(weddingId) as unknown as InvitationRow[]).map(
        mapRow,
      );
    },
    findByToken(token: string): Invitation | null {
      const row = byTokenStmt.get(token) as unknown as InvitationRow | undefined;
      return row ? mapRow(row) : null;
    },
    markSent(id: string): Invitation {
      setSentStmt.run(now(), id);
      return this.findById(id)!;
    },
    markOpened(id: string): Invitation {
      const current = this.findById(id);
      if (current && !current.openedAt) {
        setOpenedStmt.run(now(), id);
      }
      return this.findById(id)!;
    },
    delete(id: string): void {
      deleteStmt.run(id);
    },
  };
}

export type InvitationsRepository = ReturnType<
  typeof createInvitationsRepository
>;