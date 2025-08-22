from config import supabase

user_id = "34a53877-1751-4a64-b934-4502bd88558e"
provider = "5c696eb8-43ce-4d2b-8f4a-46a29a577104"

# Fetch keys
response = (
    supabase.table("api_keys")
    .select("*")
    .eq("user_id", user_id)
    .eq("provider_id", provider)
    .execute()
)

data = response.data
print("Fetched rows:", data)

for item in data:
    update_res = (
        supabase.table("api_keys")
        .update({"usage_count": item["usage_count"] + 1})
        .eq("id", item["id"])     # target exact row
        .execute()
    )
    print("Updated row:", update_res.data)