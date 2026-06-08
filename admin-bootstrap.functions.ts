import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const schema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(128),
});

/**
 * One-time bootstrap: creates the first admin user.
 * Refuses to run if any admin already exists.
 * Safe to expose because it is a no-op once an admin exists.
 */
export const bootstrapAdmin = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => schema.parse(input))
  .handler(async ({ data }) => {
    // Refuse if an admin already exists
    const { count, error: countErr } = await supabaseAdmin
      .from("user_roles")
      .select("*", { count: "exact", head: true })
      .eq("role", "admin");

    if (countErr) {
      return { ok: false as const, error: countErr.message };
    }
    if ((count ?? 0) > 0) {
      return {
        ok: false as const,
        error: "تم إنشاء المدير سابقاً. استخدم صفحة تسجيل الدخول.",
      };
    }

    // Create the auth user (auto-confirm is enabled globally)
    const { data: created, error: createErr } =
      await supabaseAdmin.auth.admin.createUser({
        email: data.email,
        password: data.password,
        email_confirm: true,
      });
    if (createErr || !created.user) {
      return {
        ok: false as const,
        error: createErr?.message ?? "تعذّر إنشاء المستخدم",
      };
    }

    // Grant admin role
    const { error: roleErr } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: created.user.id, role: "admin" });

    if (roleErr) {
      // Roll back the user if role assignment fails
      await supabaseAdmin.auth.admin.deleteUser(created.user.id);
      return { ok: false as const, error: roleErr.message };
    }

    return { ok: true as const, email: data.email };
  });

/** Reports whether an admin exists (used by setup page) */
export const adminExists = createServerFn({ method: "GET" }).handler(
  async () => {
    const { count, error } = await supabaseAdmin
      .from("user_roles")
      .select("*", { count: "exact", head: true })
      .eq("role", "admin");
    if (error) return { exists: false, error: error.message };
    return { exists: (count ?? 0) > 0 };
  },
);
