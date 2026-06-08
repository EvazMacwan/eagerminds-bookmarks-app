"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { normalizeHandle, validateHandle } from "@/lib/handles";

export type ProfileActionState = {
  error?: string;
  success?: string;
};

async function getAuthenticatedSupabase() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  return { supabase, user };
}

export async function setHandle(
  _prevState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const rawHandle = String(formData.get("handle") ?? "");
  const handle = normalizeHandle(rawHandle);

  const validationError = validateHandle(rawHandle);
  if (validationError) {
    return { error: validationError };
  }

  try {
    const { supabase, user } = await getAuthenticatedSupabase();
    const { error } = await supabase
      .from("profiles")
      .update({ handle })
      .eq("id", user.id);

    if (error) {
      if (error.code === "23505") {
        return { error: "This handle is already taken." };
      }

      if (error.code === "23514") {
        return { error: "This handle is not allowed." };
      }

      return { error: error.message };
    }

    revalidatePath("/dashboard");
    revalidatePath(`/${handle}`);
    return { success: "Your public handle is set." };
  } catch {
    return { error: "You must be logged in to set a handle." };
  }
}
