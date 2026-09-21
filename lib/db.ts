import { neon } from "@neondatabase/serverless";

export interface UserRecord {
  id: string;
  email: string;
  passwordHash: string;
  name?: string;
  phone?: string;
  createdAt: string;
}

export interface SiteRecord {
  id: string;
  userId: string;
  name: string;
  subdomain: string;
  customDomain?: string;
  domainVerified?: boolean;
  metaPixelId?: string;
  googleAnalyticsId?: string;
  faviconUrl?: string;
  layoutData: string;
  isPublished: boolean;
  subscriptionPlan?: "free" | "monthly" | "annual";
  subscriptionStatus?: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionRecord {
  id: string;
  userId: string;
  siteId: string;
  reference: string;
  plan: "monthly" | "annual";
  amount: number;
  currency: string;
  status: "success" | "pending" | "failed";
  createdAt: string;
}

export interface LeadRecord {
  id: string;
  siteId: string;
  name: string;
  phone: string;
  email?: string;
  message: string;
  createdAt: string;
}

function getSql() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is missing in .env.local");
  }
  return neon(connectionString);
}

let tablesInitialized = false;
async function ensureTables() {
  if (tablesInitialized) return;
  const sql = getSql();

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT,
      phone TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  // Migration: safely add phone column if the table already existed
  await sql`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT;
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS sites (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      subdomain TEXT UNIQUE NOT NULL,
      custom_domain TEXT UNIQUE,
      domain_verified BOOLEAN DEFAULT FALSE,
      meta_pixel_id TEXT,
      google_analytics_id TEXT,
      favicon_url TEXT,
      layout_data TEXT NOT NULL,
      is_published BOOLEAN DEFAULT TRUE,
      subscription_plan TEXT DEFAULT 'free',
      subscription_status TEXT DEFAULT 'inactive',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      site_id TEXT NOT NULL,
      reference TEXT UNIQUE NOT NULL,
      plan TEXT NOT NULL,
      amount NUMERIC NOT NULL,
      currency TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      site_id TEXT NOT NULL,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      message TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS password_resets (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token TEXT UNIQUE NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS subscribers (
      id TEXT PRIMARY KEY,
      site_id TEXT NOT NULL,
      email TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  tablesInitialized = true;
}

export const db = {
  async findUserByEmail(email: string): Promise<UserRecord | null> {
    await ensureTables();
    const sql = getSql();
    const rows = await sql`
      SELECT id, email, password_hash as "passwordHash", name, phone, created_at as "createdAt"
      FROM users
      WHERE LOWER(email) = LOWER(${email.trim()})
      LIMIT 1;
    `;
    return (rows[0] as UserRecord) || null;
  },

  async findUserById(id: string): Promise<UserRecord | null> {
    await ensureTables();
    const sql = getSql();
    const rows = await sql`
      SELECT id, email, password_hash as "passwordHash", name, phone, created_at as "createdAt"
      FROM users
      WHERE id = ${id}
      LIMIT 1;
    `;
    return (rows[0] as UserRecord) || null;
  },

  async createUser(user: Omit<UserRecord, "id" | "createdAt">): Promise<UserRecord> {
    await ensureTables();
    const sql = getSql();
    const id = "usr_" + Math.random().toString(36).substring(2, 11);
    const rows = await sql`
      INSERT INTO users (id, email, password_hash, name, phone)
      VALUES (${id}, ${user.email.toLowerCase().trim()}, ${user.passwordHash}, ${user.name || null}, ${user.phone || null})
      RETURNING id, email, password_hash as "passwordHash", name, phone, created_at as "createdAt";
    `;
    return rows[0] as UserRecord;
  },

  async findSiteById(siteId: string, userId: string): Promise<SiteRecord | null> {
    await ensureTables();
    const sql = getSql();
    const rows = await sql`
      SELECT 
        id, user_id as "userId", name, subdomain, custom_domain as "customDomain",
        domain_verified as "domainVerified", meta_pixel_id as "metaPixelId",
        google_analytics_id as "googleAnalyticsId", favicon_url as "faviconUrl",
        layout_data as "layoutData", is_published as "isPublished",
        subscription_plan as "subscriptionPlan", subscription_status as "subscriptionStatus",
        created_at as "createdAt", updated_at as "updatedAt"
      FROM sites
      WHERE id = ${siteId} AND user_id = ${userId}
      LIMIT 1;
    `;
    return (rows[0] as SiteRecord) || null;
  },

  async findSitesByUserId(userId: string): Promise<SiteRecord[]> {
    await ensureTables();
    const sql = getSql();
    const rows = await sql`
      SELECT 
        id, user_id as "userId", name, subdomain, custom_domain as "customDomain",
        domain_verified as "domainVerified", meta_pixel_id as "metaPixelId",
        google_analytics_id as "googleAnalyticsId", favicon_url as "faviconUrl",
        layout_data as "layoutData", is_published as "isPublished",
        subscription_plan as "subscriptionPlan", subscription_status as "subscriptionStatus",
        created_at as "createdAt", updated_at as "updatedAt"
      FROM sites
      WHERE user_id = ${userId}
      ORDER BY updated_at DESC;
    `;
    return rows as SiteRecord[];
  },

  async findSiteByHost(host: string): Promise<SiteRecord | null> {
    await ensureTables();
    const sql = getSql();
    const clean = host.toLowerCase().trim();
    const rows = await sql`
      SELECT 
        id, user_id as "userId", name, subdomain, custom_domain as "customDomain",
        domain_verified as "domainVerified", meta_pixel_id as "metaPixelId",
        google_analytics_id as "googleAnalyticsId", favicon_url as "faviconUrl",
        layout_data as "layoutData", is_published as "isPublished",
        subscription_plan as "subscriptionPlan", subscription_status as "subscriptionStatus",
        created_at as "createdAt", updated_at as "updatedAt"
      FROM sites
      WHERE LOWER(subdomain) = ${clean} OR LOWER(custom_domain) = ${clean}
      LIMIT 1;
    `;
    return (rows[0] as SiteRecord) || null;
  },

  async findSiteByIdentifier(identifier: string): Promise<SiteRecord | null> {
    await ensureTables();
    const sql = getSql();
    const clean = identifier.toLowerCase().trim();
    const rows = await sql`
      SELECT 
        id, user_id as "userId", name, subdomain, custom_domain as "customDomain",
        domain_verified as "domainVerified", meta_pixel_id as "metaPixelId",
        google_analytics_id as "googleAnalyticsId", favicon_url as "faviconUrl",
        layout_data as "layoutData", is_published as "isPublished",
        subscription_plan as "subscriptionPlan", subscription_status as "subscriptionStatus",
        created_at as "createdAt", updated_at as "updatedAt"
      FROM sites
      WHERE id = ${identifier} OR LOWER(subdomain) = ${clean} OR LOWER(custom_domain) = ${clean}
      LIMIT 1;
    `;
    return (rows[0] as SiteRecord) || null;
  },

  async findLatestSite(): Promise<SiteRecord | null> {
    await ensureTables();
    const sql = getSql();
    const rows = await sql`
      SELECT 
        id, user_id as "userId", name, subdomain, custom_domain as "customDomain",
        domain_verified as "domainVerified", meta_pixel_id as "metaPixelId",
        google_analytics_id as "googleAnalyticsId", favicon_url as "faviconUrl",
        layout_data as "layoutData", is_published as "isPublished",
        subscription_plan as "subscriptionPlan", subscription_status as "subscriptionStatus",
        created_at as "createdAt", updated_at as "updatedAt"
      FROM sites
      ORDER BY updated_at DESC
      LIMIT 1;
    `;
    return (rows[0] as SiteRecord) || null;
  },

  async setCustomDomain(
    siteId: string,
    userId: string,
    customDomain: string
  ): Promise<SiteRecord | null> {
    await ensureTables();
    const sql = getSql();
    const clean = customDomain.toLowerCase().trim();
    const rows = await sql`
      UPDATE sites
      SET custom_domain = ${clean}, domain_verified = FALSE, updated_at = NOW()
      WHERE id = ${siteId} AND user_id = ${userId}
      RETURNING 
        id, user_id as "userId", name, subdomain, custom_domain as "customDomain",
        domain_verified as "domainVerified", meta_pixel_id as "metaPixelId",
        google_analytics_id as "googleAnalyticsId", favicon_url as "faviconUrl",
        layout_data as "layoutData", is_published as "isPublished",
        subscription_plan as "subscriptionPlan", subscription_status as "subscriptionStatus",
        created_at as "createdAt", updated_at as "updatedAt";
    `;
    return (rows[0] as SiteRecord) || null;
  },

  async updateDomainVerification(
    siteId: string,
    userId: string,
    verified: boolean
  ): Promise<SiteRecord | null> {
    await ensureTables();
    const sql = getSql();
    const rows = await sql`
      UPDATE sites
      SET domain_verified = ${verified}, updated_at = NOW()
      WHERE id = ${siteId} AND user_id = ${userId}
      RETURNING 
        id, user_id as "userId", name, subdomain, custom_domain as "customDomain",
        domain_verified as "domainVerified", meta_pixel_id as "metaPixelId",
        google_analytics_id as "googleAnalyticsId", favicon_url as "faviconUrl",
        layout_data as "layoutData", is_published as "isPublished",
        subscription_plan as "subscriptionPlan", subscription_status as "subscriptionStatus",
        created_at as "createdAt", updated_at as "updatedAt";
    `;
    return (rows[0] as SiteRecord) || null;
  },

  async updateSiteSettings(
    siteId: string,
    userId: string,
    settings: {
      name?: string;
      metaPixelId?: string;
      googleAnalyticsId?: string;
      faviconUrl?: string;
    }
  ): Promise<SiteRecord | null> {
    await ensureTables();
    const sql = getSql();
    const rows = await sql`
      UPDATE sites
      SET 
        name = COALESCE(${settings.name || null}, name),
        meta_pixel_id = COALESCE(${settings.metaPixelId || null}, meta_pixel_id),
        google_analytics_id = COALESCE(${settings.googleAnalyticsId || null}, google_analytics_id),
        favicon_url = COALESCE(${settings.faviconUrl || null}, favicon_url),
        updated_at = NOW()
      WHERE id = ${siteId} AND user_id = ${userId}
      RETURNING 
        id, user_id as "userId", name, subdomain, custom_domain as "customDomain",
        domain_verified as "domainVerified", meta_pixel_id as "metaPixelId",
        google_analytics_id as "googleAnalyticsId", favicon_url as "faviconUrl",
        layout_data as "layoutData", is_published as "isPublished",
        subscription_plan as "subscriptionPlan", subscription_status as "subscriptionStatus",
        created_at as "createdAt", updated_at as "updatedAt";
    `;
    return (rows[0] as SiteRecord) || null;
  },

  async saveSite(userId: string, name: string, layoutData: string, siteId?: string): Promise<SiteRecord> {
    await ensureTables();
    const sql = getSql();

    if (siteId) {
      const rows = await sql`
        UPDATE sites
        SET layout_data = ${layoutData}, name = ${name}, updated_at = NOW()
        WHERE id = ${siteId} AND user_id = ${userId}
        RETURNING 
          id, user_id as "userId", name, subdomain, custom_domain as "customDomain",
          domain_verified as "domainVerified", meta_pixel_id as "metaPixelId",
          google_analytics_id as "googleAnalyticsId", favicon_url as "faviconUrl",
          layout_data as "layoutData", is_published as "isPublished",
          subscription_plan as "subscriptionPlan", subscription_status as "subscriptionStatus",
          created_at as "createdAt", updated_at as "updatedAt";
      `;
      if (rows.length > 0) return rows[0] as SiteRecord;
    }

    const id = "site_" + Math.random().toString(36).substring(2, 11);

    const cleanSubdomain = name
      .toLowerCase()
      .replace(/^welcome\s+to\s+/i, "")
      .replace(/^the\s+/i, "")
      .replace(/[^a-z0-9]/g, "")
      .slice(0, 20);

    const finalSubdomain = `${cleanSubdomain || "site"}-${Date.now().toString().slice(-4)}`;

    const rows = await sql`
      INSERT INTO sites (id, user_id, name, subdomain, layout_data, is_published)
      VALUES (${id}, ${userId}, ${name}, ${finalSubdomain}, ${layoutData}, TRUE)
      RETURNING 
        id, user_id as "userId", name, subdomain, custom_domain as "customDomain",
        domain_verified as "domainVerified", meta_pixel_id as "metaPixelId",
        google_analytics_id as "googleAnalyticsId", favicon_url as "faviconUrl",
        layout_data as "layoutData", is_published as "isPublished",
        subscription_plan as "subscriptionPlan", subscription_status as "subscriptionStatus",
        created_at as "createdAt", updated_at as "updatedAt";
    `;
    return rows[0] as SiteRecord;
  },

  async recordSubscription(record: Omit<SubscriptionRecord, "id" | "createdAt">): Promise<SubscriptionRecord> {
    await ensureTables();
    const sql = getSql();
    const id = "sub_" + Math.random().toString(36).substring(2, 11);

    const rows = await sql`
      INSERT INTO subscriptions (id, user_id, site_id, reference, plan, amount, currency, status)
      VALUES (${id}, ${record.userId}, ${record.siteId}, ${record.reference}, ${record.plan}, ${record.amount}, ${record.currency}, ${record.status})
      RETURNING id, user_id as "userId", site_id as "siteId", reference, plan, amount, currency, status, created_at as "createdAt";
    `;

    if (record.status === "success") {
      await sql`
        UPDATE sites
        SET subscription_plan = ${record.plan}, subscription_status = 'active', updated_at = NOW()
        WHERE id = ${record.siteId};
      `;
    }

    return rows[0] as SubscriptionRecord;
  },

  async createLead(lead: Omit<LeadRecord, "id" | "createdAt">): Promise<LeadRecord> {
    await ensureTables();
    const sql = getSql();
    const id = "lead_" + Math.random().toString(36).substring(2, 11);

    const rows = await sql`
      INSERT INTO leads (id, site_id, name, phone, email, message)
      VALUES (${id}, ${lead.siteId}, ${lead.name}, ${lead.phone}, ${lead.email || null}, ${lead.message || null})
      RETURNING id, site_id as "siteId", name, phone, email, message, created_at as "createdAt";
    `;
    return rows[0] as LeadRecord;
  },

  async findLeadsByUserId(userId: string): Promise<LeadRecord[]> {
    await ensureTables();
    const sql = getSql();
    const rows = await sql`
      SELECT 
        l.id, l.site_id as "siteId", l.name, l.phone, l.email, l.message, l.created_at as "createdAt"
      FROM leads l
      JOIN sites s ON s.id = l.site_id
      WHERE s.user_id = ${userId}
      ORDER BY l.created_at DESC;
    `;
    return rows as LeadRecord[];
  },

  async countMonthlyLeadsBySiteId(siteId: string): Promise<number> {
    await ensureTables();
    const sql = getSql();
    const rows = await sql`
      SELECT COUNT(*)::int as count
      FROM leads
      WHERE site_id = ${siteId}
        AND created_at >= date_trunc('month', NOW());
    `;
    return rows[0]?.count || 0;
  },

  async createPasswordResetToken(userId: string): Promise<string> {
    await ensureTables();
    const sql = getSql();
    const id = "rst_" + Math.random().toString(36).substring(2, 11);
    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

    await sql`
      INSERT INTO password_resets (id, user_id, token, expires_at)
      VALUES (${id}, ${userId}, ${token}, ${expiresAt.toISOString()});
    `;
    return token;
  },

  async verifyAndConsumeResetToken(token: string, newPasswordHash: string): Promise<boolean> {
    await ensureTables();
    const sql = getSql();
    
    const rows = await sql`
      SELECT user_id as "userId", expires_at as "expiresAt"
      FROM password_resets
      WHERE token = ${token} AND expires_at > NOW()
      LIMIT 1;
    `;

    if (rows.length === 0) return false;
    const userId = rows[0].userId;

    await sql`
      UPDATE users SET password_hash = ${newPasswordHash} WHERE id = ${userId};
    `;
    await sql`
      DELETE FROM password_resets WHERE token = ${token};
    `;
    return true;
  },

  async addSubscriber(siteId: string, email: string): Promise<boolean> {
    await ensureTables();
    const sql = getSql();
    const id = "sub_" + Math.random().toString(36).substring(2, 11);

    await sql`
      INSERT INTO subscribers (id, site_id, email)
      VALUES (${id}, ${siteId}, ${email.toLowerCase().trim()});
    `;
    return true;
  },

  async getSubscribersByUserId(userId: string): Promise<any[]> {
    await ensureTables();
    const sql = getSql();
    return await sql`
      SELECT sub.id, sub.email, sub.created_at as "createdAt", s.name as "siteName"
      FROM subscribers sub
      JOIN sites s ON s.id = sub.site_id
      WHERE s.user_id = ${userId}
      ORDER BY sub.created_at DESC;
    `;
  },
};