from config import supabase
from datetime import datetime, timezone

async def log_request(
    user_id: str,
    api_key: str,
    provider: str,
    model: str,
    status: int,
    request_payload: dict,
    response_payload: dict,
    prompt_tokens: int = 0,
    completion_tokens: int = 0,
    total_tokens: int = 0,
    estimated_cost: float = 0.0,
    response_time_ms: float = 0.0,
    key_name: str = ""
):
    """
    Insert a log into the request_logs table.
    """
    # Split provider and model if combined
    provider_name, model_name = model.split(":", 1) if ":" in model else (provider, model)

    # Current timestamp as ISO string
    timestamp = datetime.now(timezone.utc).isoformat()

    log_data = {
        "user_id": user_id,
        "api_key": api_key,
        "provider": provider_name,
        "model": model_name,
        "status": status,
        "request_payload": request_payload,
        "response_payload": response_payload,
        "prompt_tokens": prompt_tokens,
        "completion_tokens": completion_tokens,
        "total_tokens": total_tokens,
        "estimated_cost": estimated_cost,
        "response_time_ms": response_time_ms,
        "time_stamp": timestamp,  # now JSON-serializable
        "key_name": key_name
    }

    try:
        supabase.table("request_logs").insert(log_data).execute()
    except Exception as e:
        print(f"Failed to log request: {e}")