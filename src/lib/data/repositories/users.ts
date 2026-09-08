import type { DatabaseSync } from "node:sqlite";
import type { Profile, UserRole } from "@/types";
import { newId, now } from "./utils";

interface ProfileRow {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

function mapRow(row: ProfileRow): Profile {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    passwordHash: row.password_hash,
    role: row.role,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

type NewProfile = Pick<Profile, "email" | "name" | "passwordHash"> & {
  role?: UserRole;
};

interface UserWithCount extends Profile {
  weddingCount: number;
}

export function createUsersRepository(db: DatabaseSync) {
  const insertStmt = db.prepare(
    `INSERT INTO profiles (id, email, name, password_hash, role, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  );
  const byIdStmt = db.prepare(
    `SELECT id, email, name, password_hash, role, created_at, updated_at
     FROM profiles WHERE id = ?`,
  );
  const byEmailStmt = db.prepare(
    `SELECT id, email, name, password_hash, role, created_at, updated_at
     FROM profiles WHERE email = ?`,
  );
  const updateStmt = db.prepare(
    `UPDATE profiles SET name = ?, updated_at = ? WHERE id = ?`,
  );
  const updateRoleStmt = db.prepare(
    `UPDATE profiles SET role = ?, updated_at = ? WHERE id = ?`,
  );
  const updatePasswordStmt = db.prepare(
    `UPDATE profiles SET password_hash = ?, updated_at = ? WHERE id = ?`,
  );
  const deleteStmt = db.prepare(`DELETE FROM profiles WHERE id = ?`);
  const listStmt = db.prepare(
    `SELECT id, email, name, password_hash, role, created_at, updated_at
     FROM profiles ORDER BY created_at DESC`,
  );
  const listWithCountStmt = db.prepare(
    `SELECT p.id AS id, p.email AS email, p.name AS name,
            p.password_hash AS password_hash, p.role AS role,
            p.created_at AS created_at, p.updated_at AS updated_at,
            (SELECT COUNT(*) FROM weddings w WHERE w.user_id = p.id) AS weddingCount
     FROM profiles p ORDER BY p.created_at DESC`,
  );

  return {
    create(input: NewProfile): Profile {
      const id = newId();
      const timestamp = now();
      insertStmt.run(
        id,
        input.email,
        input.name,
        input.passwordHash,
        input.role ?? "user",
        timestamp,
        timestamp,
      );
      return mapRow(byIdStmt.get(id) as unknown as ProfileRow);
    },
    findById(id: string): Profile | null {
      const row = byIdStmt.get(id) as unknown as ProfileRow | undefined;
      return row ? mapRow(row) : null;
    },
    findByEmail(email: string): Profile | null {
      const row = byEmailStmt.get(email) as unknown as ProfileRow | undefined;
      return row ? mapRow(row) : null;
    },
    findAll(): Profile[] {
      return (listStmt.all() as unknown as ProfileRow[]).map(mapRow);
    },
    findAllWithCount(): Array<{
      id: string;
      email: string;
      name: string;
      role: UserRole;
      createdAt: string;
      weddingCount: number;
    }> {
      const rows = listWithCountStmt.all() as unknown as Array<
        ProfileRow & { weddingCount: number }
      >;
      return rows.map((row) => ({
        id: row.id,
        email: row.email,
        name: row.name,
        role: row.role,
        createdAt: row.created_at,
        weddingCount: Number(row.weddingCount),
      }));
    },
    update(id: string, input: Partial<Pick<Profile, "name">>): Profile {
      const current = this.findById(id);
      if (!current) {
        throw new Error(`Profile not found: ${id}`);
      }
      updateStmt.run(input.name ?? current.name, now(), id);
      return this.findById(id)!;
    },
    updateRole(id: string, role: UserRole): Profile {
      updateRoleStmt.run(role, now(), id);
      return this.findById(id)!;
    },
    updatePassword(id: string, passwordHash: string): Profile {
      updatePasswordStmt.run(passwordHash, now(), id);
      return this.findById(id)!;
    },
    delete(id: string): void {
      deleteStmt.run(id);
    },
  };
}

export type { UserWithCount };

export type UsersRepository = ReturnType<typeof createUsersRepository>;