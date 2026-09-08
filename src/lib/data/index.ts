import { getDb } from "./db";
import { initSchema } from "./schema";
import { createUsersRepository } from "./repositories/users";
import { createSessionsRepository } from "./repositories/sessions";
import { createWeddingsRepository } from "./repositories/weddings";
import { createWeddingSectionsRepository } from "./repositories/sections";
import { createTemplatesRepository } from "./repositories/templates";
import { createProductsRepository } from "./repositories/products";
import { createOrdersRepository } from "./repositories/orders";
import { createPublicationsRepository } from "./repositories/publications";
import { createWeddingMediaRepository } from "./repositories/media";
import { createGuestsRepository } from "./repositories/guests";
import { createInvitationsRepository } from "./repositories/invitations";
import { createRsvpsRepository } from "./repositories/rsvps";
import { ADMIN_EMAIL, ADMIN_NAME, ADMIN_PASSWORD, DEFAULT_PRODUCTS } from "@/config/app";
import { syncTemplatesToDb } from "@/lib/templates";
import { hashPassword, verifyPassword } from "@/lib/auth/password";

export const db = getDb();

initSchema(db);

export const usersRepo = createUsersRepository(db);
export const sessionsRepo = createSessionsRepository(db);
export const weddingsRepo = createWeddingsRepository(db);
export const weddingSectionsRepo = createWeddingSectionsRepository(db);
export const templatesRepo = createTemplatesRepository(db);
export const productsRepo = createProductsRepository(db);
export const ordersRepo = createOrdersRepository(db);
export const publicationsRepo = createPublicationsRepository(db);
export const weddingMediaRepo = createWeddingMediaRepository(db);
export const guestsRepo = createGuestsRepository(db);
export const invitationsRepo = createInvitationsRepository(db);
export const rsvpsRepo = createRsvpsRepository(db);

export async function seedBaseData(): Promise<void> {
  for (const product of DEFAULT_PRODUCTS) {
    productsRepo.upsert(product);
  }
  syncProductsToDefault();
  syncTemplatesToDb(templatesRepo);
  await seedAdminUser();
}

/**
 * Garantiza que el catálogo de producto coincida con el definido por defecto:
 * desactiva cualquier producto que ya no exista en `DEFAULT_PRODUCTS` (p. ej.
 * planes antiguos) para que no aparezcan en el checkout, sin borrarlos (las
 * órdenes históricas pueden referenciarlos).
 */
function syncProductsToDefault(): void {
  const defaultNames = new Set(DEFAULT_PRODUCTS.map((p) => p.name));
  for (const product of productsRepo.findAll()) {
    if (!defaultNames.has(product.name) && product.active) {
      productsRepo.update(product.id, { active: false });
    }
  }
}

/**
 * Garantiza que el usuario administrador exista y esté correcto (seed + fix).
 * El email y password pueden sobreescribirse con env vars. Si la fila ya
 * existe pero quedó con rol o contraseña desactualizados (ej: BD anterior a
 * F-010, o ADMIN_PASSWORD cambiado), la auto-corrige. El email es reservado
 * del platform admin, así que sobreescribirlo es intencional.
 */
async function seedAdminUser(): Promise<void> {
  const existing = usersRepo.findByEmail(ADMIN_EMAIL);
  if (existing) {
    const passwordOk = await verifyPassword(
      ADMIN_PASSWORD,
      existing.passwordHash,
    );
    if (existing.role !== "admin") {
      usersRepo.updateRole(existing.id, "admin");
    }
    if (!passwordOk) {
      usersRepo.updatePassword(existing.id, await hashPassword(ADMIN_PASSWORD));
    }
    return;
  }
  const passwordHash = await hashPassword(ADMIN_PASSWORD);
  usersRepo.create({
    email: ADMIN_EMAIL,
    name: ADMIN_NAME,
    passwordHash,
    role: "admin",
  });
}

export { getDb, initSchema };

export type { UsersRepository } from "./repositories/users";
export type { SessionsRepository } from "./repositories/sessions";
export type { WeddingsRepository } from "./repositories/weddings";
export type { WeddingSectionsRepository } from "./repositories/sections";
export type { TemplatesRepository } from "./repositories/templates";
export type { ProductsRepository } from "./repositories/products";
export type { OrdersRepository } from "./repositories/orders";
export type { PublicationsRepository } from "./repositories/publications";
export type { WeddingMediaRepository } from "./repositories/media";
export type { GuestsRepository } from "./repositories/guests";
export type { InvitationsRepository } from "./repositories/invitations";
export type { RsvpsRepository } from "./repositories/rsvps";