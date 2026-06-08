"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { normalizeUrl, validateBookmarkInput } from "@/lib/bookmarks";

export type BookmarkActionState = {
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

export async function createBookmark(
  _prevState: BookmarkActionState,
  formData: FormData,
): Promise<BookmarkActionState> {
  const title = String(formData.get("title") ?? "");
  const url = String(formData.get("url") ?? "");
  const isPublic = formData.get("is_public") === "on";

  const validationError = validateBookmarkInput(title, url);
  if (validationError) {
    return { error: validationError };
  }

  try {
    const { supabase, user } = await getAuthenticatedSupabase();
    const { error } = await supabase.from("bookmarks").insert({
      user_id: user.id,
      title: title.trim(),
      url: normalizeUrl(url),
      is_public: isPublic,
    });

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/dashboard");
    return { success: "Bookmark added." };
  } catch {
    return { error: "You must be logged in to add bookmarks." };
  }
}

export async function updateBookmark(
  _prevState: BookmarkActionState,
  formData: FormData,
): Promise<BookmarkActionState> {
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "");
  const url = String(formData.get("url") ?? "");
  const isPublic = formData.get("is_public") === "on";

  if (!id) {
    return { error: "Bookmark not found." };
  }

  const validationError = validateBookmarkInput(title, url);
  if (validationError) {
    return { error: validationError };
  }

  try {
    const { supabase } = await getAuthenticatedSupabase();
    const { error } = await supabase
      .from("bookmarks")
      .update({
        title: title.trim(),
        url: normalizeUrl(url),
        is_public: isPublic,
      })
      .eq("id", id);

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/dashboard");
    return { success: "Bookmark updated." };
  } catch {
    return { error: "You must be logged in to edit bookmarks." };
  }
}

export async function deleteBookmark(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  if (!id) {
    return;
  }

  try {
    const { supabase } = await getAuthenticatedSupabase();
    await supabase.from("bookmarks").delete().eq("id", id);
    revalidatePath("/dashboard");
  } catch {
    // RLS blocks deletes for bookmarks the user does not own.
  }
}
