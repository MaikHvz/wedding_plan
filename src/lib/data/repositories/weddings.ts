import type { DatabaseSync } from "node:sqlite";
import type { Wedding, WeddingStatus } from "@/types";
import { newId, now } from "./utils";

interface WeddingRow {
  id: string;
  user_id: string;
  title: string;
  partner_1: string;
  partner_2: string;
  event_date: string | null;
  event_time: string | null;
  location_name: string | null;
  location_address: string | null;
  maps_url: string | null;
  drive_url: string | null;
  slug: string;
  status: WeddingStatus;
  template_id: string;
  template_version: number;
  theme_json: string | null;
  max_guests: number;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  expires_at: string | null;
}

function mapRow(row: WeddingRow): Wedding {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    partner1: row.partner_1,
    partner2: row.partner_2,
    eventDate: row.event_date,
    eventTime: row.event_time,
    locationName: row.location_name,
    locationAddress: row.location_address,
    mapsUrl: row.maps_url,
    driveUrl: row.drive_url,
    slug: row.slug,
    status: row.status,
    templateId: row.template_id,
    templateVersion: row.template_version,
    themeJson: row.theme_json,
    maxGuests: Number(row.max_guests) || 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    publishedAt: row.published_at,
    expiresAt: row.expires_at,
  };
}

const SELECT_COLUMNS = `
  id, user_id, title, partner_1, partner_2, event_date, event_time,
  location_name, location_address, maps_url, drive_url, slug, status,
  template_id, template_version, theme_json, max_guests, created_at, updated_at,
  published_at, expires_at
`;

function toRow(wedding: Wedding): WeddingRow {
  return {
    id: wedding.id,
    user_id: wedding.userId,
    title: wedding.title,
    partner_1: wedding.partner1,
    partner_2: wedding.partner2,
    event_date: wedding.eventDate,
    event_time: wedding.eventTime,
    location_name: wedding.locationName,
    location_address: wedding.locationAddress,
    maps_url: wedding.mapsUrl,
    drive_url: wedding.driveUrl,
    slug: wedding.slug,
    status: wedding.status,
    template_id: wedding.templateId,
    template_version: wedding.templateVersion,
    theme_json: wedding.themeJson,
    max_guests: wedding.maxGuests ?? 0,
    created_at: wedding.createdAt,
    updated_at: wedding.updatedAt,
    published_at: wedding.publishedAt,
    expires_at: wedding.expiresAt,
  };
}

const UPDATE_COLUMNS = [
  "title",
  "partner_1",
  "partner_2",
  "event_date",
  "event_time",
  "location_name",
  "location_address",
  "maps_url",
  "drive_url",
  "slug",
  "status",
  "template_id",
  "template_version",
  "theme_json",
  "max_guests",
  "published_at",
  "expires_at",
] as const;

export type NewWedding = Pick<
  Wedding,
  "userId" | "title" | "slug" | "templateId"
> &
  Partial<Omit<Wedding, "id" | "userId" | "title" | "slug" | "templateId">>;

export type WeddingUpdate = Partial<
  Omit<Wedding, "id" | "userId" | "createdAt">
>;

export function createWeddingsRepository(db: DatabaseSync) {
  const insertStmt = db.prepare(
    `INSERT INTO weddings (
       id, user_id, title, partner_1, partner_2, event_date, event_time,
       location_name, location_address, maps_url, drive_url, slug, status,
       template_id, template_version, theme_json, max_guests, created_at, updated_at,
       published_at, expires_at
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  const byIdStmt = db.prepare(`SELECT ${SELECT_COLUMNS} FROM weddings WHERE id = ?`);
  const bySlugStmt = db.prepare(`SELECT ${SELECT_COLUMNS} FROM weddings WHERE slug = ?`);
  const byUserStmt = db.prepare(
    `SELECT ${SELECT_COLUMNS} FROM weddings WHERE user_id = ? ORDER BY updated_at DESC`,
  );
  const deleteStmt = db.prepare(`DELETE FROM weddings WHERE id = ?`);
  const updateStmt = db.prepare(
    `UPDATE weddings SET ${UPDATE_COLUMNS.map((c) => `${c} = ?`).join(", ")},
     updated_at = ? WHERE id = ?`,
  );

  return {
    create(input: NewWedding): Wedding {
      const id = newId();
      const timestamp = now();
      const wedding: Wedding = {
        id,
        userId: input.userId,
        title: input.title,
        partner1: input.partner1 ?? "",
        partner2: input.partner2 ?? "",
        eventDate: input.eventDate ?? null,
        eventTime: input.eventTime ?? null,
        locationName: input.locationName ?? null,
        locationAddress: input.locationAddress ?? null,
        mapsUrl: input.mapsUrl ?? null,
        driveUrl: input.driveUrl ?? null,
        slug: input.slug,
        status: input.status ?? "DRAFT",
        templateId: input.templateId,
        templateVersion: input.templateVersion ?? 1,
        themeJson: input.themeJson ?? null,
        maxGuests: input.maxGuests ?? 0,
        createdAt: timestamp,
        updatedAt: timestamp,
        publishedAt: input.publishedAt ?? null,
        expiresAt: input.expiresAt ?? null,
      };
      this.insert(wedding);
      return wedding;
    },
    insert(wedding: Wedding): void {
      const row = toRow(wedding);
      insertStmt.run(
        row.id,
        row.user_id,
        row.title,
        row.partner_1,
        row.partner_2,
        row.event_date,
        row.event_time,
        row.location_name,
        row.location_address,
        row.maps_url,
        row.drive_url,
        row.slug,
        row.status,
        row.template_id,
        row.template_version,
        row.theme_json,
        row.max_guests,
        wedding.createdAt,
        wedding.updatedAt,
        row.published_at,
        row.expires_at,
      );
    },
    findById(id: string): Wedding | null {
      const row = byIdStmt.get(id) as unknown as WeddingRow | undefined;
      return row ? mapRow(row) : null;
    },
    findBySlug(slug: string): Wedding | null {
      const row = bySlugStmt.get(slug) as unknown as WeddingRow | undefined;
      return row ? mapRow(row) : null;
    },
    findManyByUser(userId: string): Wedding[] {
      return (byUserStmt.all(userId) as unknown as WeddingRow[]).map(mapRow);
    },
    update(id: string, input: WeddingUpdate): Wedding {
      const current = this.findById(id);
      if (!current) {
        throw new Error(`Wedding not found: ${id}`);
      }
      const merged: Wedding = { ...current, ...input, updatedAt: now() };
      const row = toRow(merged);
      updateStmt.run(
        ...UPDATE_COLUMNS.map((column) => row[column]),
        merged.updatedAt,
        id,
      );
      return this.findById(id)!;
    },
    setStatus(id: string, status: WeddingStatus): Wedding {
      return this.update(id, { status });
    },
    delete(id: string): void {
      deleteStmt.run(id);
    },
  };
}

export type WeddingsRepository = ReturnType<typeof createWeddingsRepository>;