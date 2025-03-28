import AccountForm from "./account-form";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function Account() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <AccountForm user={user} />;
}
