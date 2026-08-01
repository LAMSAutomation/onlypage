import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { getSiteKit } from "../components/site-kits";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.PRIME_STRIKES_EMAIL;
const password = process.env.PRIME_STRIKES_PASSWORD;

if (!supabaseUrl || !anonKey) {
  throw new Error("Supabase URL and anon key are required in .env.local.");
}
if (!email || !password) {
  throw new Error("Set PRIME_STRIKES_EMAIL and PRIME_STRIKES_PASSWORD for this one-time seed.");
}
if (password.length < 12) {
  throw new Error("Use a test password with at least 12 characters.");
}

const hasAdminKey = Boolean(
  serviceRoleKey &&
    serviceRoleKey.length >= 40 &&
    !serviceRoleKey.includes("..."),
);
const admin = hasAdminKey
  ? createClient(supabaseUrl, serviceRoleKey!, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  : null;
const loginClient = createClient(supabaseUrl, anonKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const kit = getSiteKit("prime-strikes");
if (!kit) throw new Error("Prime Strikes site kit is not registered.");

async function findUserByEmail(targetEmail: string) {
  if (!admin) return null;
  let page = 1;
  while (page <= 20) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 100 });
    if (error) throw error;
    const match = data.users.find(
      (candidate: any) => candidate.email?.toLowerCase() === targetEmail.toLowerCase(),
    );
    if (match) return match;
    if (data.users.length < 100) return null;
    page += 1;
  }
  return null;
}

async function availableSubdomain(client: any, ownerId: string) {
  const base = "prime-strikes-demo";
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const candidate = attempt === 0 ? base : `${base}-${attempt + 1}`;
    const { data, error } = await client
      .from("sites")
      .select("id, owner_id")
      .eq("subdomain", candidate)
      .maybeSingle();
    if (error) throw error;
    if (!data || (data as any).owner_id === ownerId) return candidate;
  }
  throw new Error("Could not allocate a Prime Strikes demo subdomain.");
}

async function run() {
  const { data: login, error: loginError } = await loginClient.auth.signInWithPassword({
    email,
    password,
  });
  if (loginError || !login.user || !login.session) {
    throw loginError || new Error("Existing demo account login failed.");
  }

  let user = admin ? await findUserByEmail(email) : login.user;
  if (admin && !user) {
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: "Prime Strikes Demo" },
    });
    if (error || !data.user) throw error || new Error("User creation failed.");
    user = data.user;
  } else if (admin && user) {
    const { error } = await admin.auth.admin.updateUserById(user.id, {
      password,
      email_confirm: true,
      user_metadata: { ...user.user_metadata, full_name: "Prime Strikes Demo" },
    });
    if (error) throw error;
  }
  if (!user) throw new Error("Could not resolve the Prime Strike demo user.");

  const db = admin || loginClient;

  const subdomain = await availableSubdomain(db, user.id);
  const built = kit.build("Prime Strike");
  const theme = {
    mode: "business",
    activeSiteKit: kit.id,
    globalHeader: built.header,
    globalFooter: built.footer,
    header: built.header,
    footer: built.footer,
    phone: "+91 95002 98631",
    email: "contact@primestrike.co.in",
    address: "No 519 MKN Road, Alandur, Chennai 600016",
  };

  const { data: existingSite, error: existingSiteError } = await db
    .from("sites")
    .select("id")
    .eq("owner_id", user.id)
    .maybeSingle();
  if (existingSiteError) throw existingSiteError;

  const siteQuery = existingSite
    ? db
        .from("sites")
        .update({ business_name: "Prime Strike", subdomain, published: true, theme })
        .eq("id", existingSite.id)
        .select()
        .single()
    : db
        .from("sites")
        .insert({
          owner_id: user.id,
          business_name: "Prime Strike",
          subdomain,
          published: true,
          theme,
        })
        .select()
        .single();
  const { data: site, error: siteError } = await siteQuery;
  if (siteError || !site) throw siteError || new Error("Site creation failed.");

  const { error: pagesDeleteError } = await db
    .from("pages")
    .delete()
    .eq("site_id", site.id);
  if (pagesDeleteError) throw pagesDeleteError;

  for (let position = 0; position < built.pages.length; position += 1) {
    const page = built.pages[position];
    const { data: savedPage, error: pageError } = await db
      .from("pages")
      .insert({
        site_id: site.id,
        name: page.name,
        slug: page.slug,
        seo_title: page.seoTitle,
        seo_desc: page.seoDesc,
        position,
      })
      .select()
      .single();
    if (pageError || !savedPage) throw pageError || new Error(`Could not create ${page.name}.`);

    const { error: blockError } = await db.from("blocks").insert(
      page.blocks.map((pageBlock, blockPosition) => ({
        id: pageBlock.id,
        page_id: savedPage.id,
        type: pageBlock.type,
        position: blockPosition,
        config: { ...pageBlock, id: undefined },
      })),
    );
    if (blockError) throw blockError;
  }

  const { error: productDeleteError } = await db
    .from("ecom_products")
    .delete()
    .eq("site_id", site.id);
  if (productDeleteError) throw productDeleteError;
  if (built.products?.length) {
    const { error: productError } = await db.from("ecom_products").insert(
      built.products.map((product) => ({
        site_id: site.id,
        title: product.title,
        description: product.description,
        price: product.price,
        compare_at_price: product.compareAtPrice || null,
        images: [{ url: product.image, alt: product.title }],
        stock: 50,
        category: product.category,
        status: "active",
      })),
    );
    if (productError) throw productError;
  }

  const { error: storeError } = await db.from("ecom_stores").upsert(
    {
      site_id: site.id,
      store_name: "Prime Strike Programs",
      currency: "INR",
      currency_symbol: "₹",
      tax_rate: 18,
      shipping_fee: 0,
    },
    { onConflict: "site_id" },
  );
  if (storeError) throw storeError;

  const { data: ownedSite, error: ownedSiteError } = await loginClient
    .from("sites")
    .select("id, business_name, subdomain, published")
    .eq("id", site.id)
    .single();
  if (ownedSiteError || !ownedSite) {
    throw ownedSiteError || new Error("Authenticated site access verification failed.");
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        userId: user.id,
        siteId: site.id,
        email,
        subdomain,
        pageCount: built.pages.length,
        productCount: built.products?.length || 0,
        loginVerified: true,
        published: ownedSite.published,
      },
      null,
      2,
    ),
  );
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
