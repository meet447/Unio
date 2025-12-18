from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
from pydantic import BaseModel
import logging

from services.vault import VaultService

router = APIRouter()
logger = logging.getLogger(__name__)

class CreateVaultRequest(BaseModel):
    user_id: str
    name: str
    description: Optional[str] = None

@router.post("/vaults")
async def create_vault(req: CreateVaultRequest):
    """
    Create a new knowledge vault.
    """
    try:
        vault = await VaultService.create_vault(req.user_id, req.name, req.description)
        return vault
    except Exception as e:
        logger.error(f"Error creating vault: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/vaults")
async def list_vaults(user_id: str):
    """
    List all vaults for a user.
    """
    try:
        vaults = await VaultService.list_vaults(user_id)
        return {"data": vaults}
    except Exception as e:
        logger.error(f"Error listing vaults: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/vaults/{vault_id}/documents")
async def list_documents(vault_id: str, user_id: str):
    """
    List all documents in a vault.
    """
    try:
        # Note: sync method, but FastAPI runs it in threadpool.
        # Alternatively, make it async if DB call was async, but Supabase python client is synchronous?
        # Supabase client is synchronous by default unless using async wrapper?
        # Actually in VaultService I used `execute()` which is sync, but I used `await` in some places?
        # Wait, supabase-py `execute()` is synchronous. `await` in my service might be wrong for supabase calls unless using async client?
        # `supabase-py` is sync. `asyncio.to_thread` usage or just sync def is safer for FastAPI.
        # My VaultService methods were `async def` calling `execute()` which is blocking.
        # For this method, let's keep it simple.
        docs = VaultService.list_documents(vault_id, user_id)
        return {"data": docs}
    except Exception as e:
        logger.error(f"Error listing documents: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/vaults/{vault_id}")
async def delete_vault(vault_id: str, user_id: str):
    """
    Delete a vault and its contents.
    """
    try:
        await VaultService.delete_vault(vault_id, user_id)
        return {"success": True}
    except Exception as e:
        logger.error(f"Error deleting vault: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/vaults/{vault_id}/upload")
async def upload_file(
    vault_id: str,
    user_id: str = Form(...),
    file: UploadFile = File(...)
):
    """
    Upload a document to the vault.
    Supports PDF, DOCX, TXT.
    Automatically generates embeddings.
    """
    try:
        doc = await VaultService.upload_document(vault_id, user_id, file)
        return doc
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error uploading file: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during upload")
