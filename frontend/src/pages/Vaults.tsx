import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/kibo-ui/button";
import { Input } from "@/components/kibo-ui/input";
import { Label } from "@/components/kibo-ui/label";
import { Textarea } from "@/components/kibo-ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/kibo-ui/dialog";
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/kibo-ui/card";
import { Loader2, Plus, Trash2, Upload, Database, FileText } from "lucide-react";

// Using local backend for development, configurable via env
const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/v1";

interface Vault {
    id: string;
    name: string;
    description: string;
    created_at: string;
}

export default function Vaults() {
    const { user } = useAuth();
    const [vaults, setVaults] = useState<Vault[]>([]);
    const [loading, setLoading] = useState(false);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newVaultName, setNewVaultName] = useState("");
    const [newVaultDesc, setNewVaultDesc] = useState("");
    const [creating, setCreating] = useState(false);

    const [selectedVault, setSelectedVault] = useState<Vault | null>(null);
    const [documents, setDocuments] = useState<any[]>([]);
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (selectedVault && user) {
            fetchDocuments(selectedVault.id);
        } else {
            setDocuments([]);
        }
    }, [selectedVault, user]);

    const fetchDocuments = async (vaultId: string) => {
        try {
            const res = await fetch(`${API_BASE}/vaults/${vaultId}/documents?user_id=${user?.id}`);
            if (res.ok) {
                const json = await res.json();
                setDocuments(json.data || []);
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        if (user) fetchVaults();
    }, [user]);

    const fetchVaults = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/vaults?user_id=${user?.id}`);
            if (!res.ok) throw new Error("Failed to fetch vaults");
            const json = await res.json();
            setVaults(json.data || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!newVaultName.trim() || !user) return;
        setCreating(true);
        try {
            const res = await fetch(`${API_BASE}/vaults`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: user.id,
                    name: newVaultName,
                    description: newVaultDesc
                })
            });
            if (!res.ok) throw new Error("Failed to create vault");
            await fetchVaults();
            setIsCreateOpen(false);
            setNewVaultName("");
            setNewVaultDesc("");
        } catch (e) {
            console.error(e);
            alert("Failed to create vault");
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (e: React.MouseEvent, vaultId: string) => {
        e.stopPropagation();
        if (!confirm("Are you sure? This will delete all documents in the vault.")) return;
        try {
            const res = await fetch(`${API_BASE}/vaults/${vaultId}?user_id=${user?.id}`, {
                method: "DELETE"
            });
            if (!res.ok) throw new Error("Failed to delete");
            await fetchVaults();
            if (selectedVault?.id === vaultId) setSelectedVault(null);
        } catch (e) {
            console.error(e);
            alert("Failed to delete vault");
        }
    };

    const handleUpload = async () => {
        if (!uploadFile || !selectedVault || !user) return;
        setUploading(true);
        const formData = new FormData();
        formData.append("user_id", user.id);
        formData.append("file", uploadFile);

        try {
            const res = await fetch(`${API_BASE}/vaults/${selectedVault.id}/upload`, {
                method: "POST",
                body: formData
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.detail || "Upload failed");
            }
            alert("Document uploaded successfully!");
            setUploadFile(null);
            if (selectedVault) fetchDocuments(selectedVault.id);
        } catch (e: any) {
            console.error(e);
            alert(e.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="p-6 lg:p-10 text-white min-h-screen">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Knowledge Vaults</h1>
                        <p className="text-[#9d9d9d] mt-2">Manage your Retrieval-Augmented Generation (RAG) contexts.</p>
                    </div>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-white text-black hover:bg-gray-200">
                                <Plus className="w-4 h-4 mr-2" />
                                New Vault
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-[#0a0a0a] border-[#1b1b1b] text-white">
                            <DialogHeader>
                                <DialogTitle>Create Knowledge Vault</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Name</Label>
                                    <Input
                                        value={newVaultName}
                                        onChange={e => setNewVaultName(e.target.value)}
                                        placeholder="e.g. Company Policies"
                                        className="bg-[#151515] border-[#2a2a2a] text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Textarea
                                        value={newVaultDesc}
                                        onChange={e => setNewVaultDesc(e.target.value)}
                                        placeholder="Optional description..."
                                        className="bg-[#151515] border-[#2a2a2a] text-white"
                                    />
                                </div>
                                <Button
                                    className="w-full bg-white text-black hover:bg-gray-200"
                                    onClick={handleCreate}
                                    disabled={creating || !newVaultName}
                                >
                                    {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Vault"}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-gray-500" /></div>
                ) : vaults.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-[#2a2a2a] rounded-xl text-gray-500">
                        <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No vaults created yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {vaults.map(vault => (
                            <Card
                                key={vault.id}
                                className={`bg-[#0a0a0a]/50 border-[#1b1b1b] hover:border-[#333] transition-colors cursor-pointer text-white ${selectedVault?.id === vault.id ? 'ring-2 ring-blue-500' : ''}`}
                                onClick={() => setSelectedVault(vault)}
                            >
                                <CardHeader>
                                    <CardTitle className="flex justify-between items-start">
                                        <span>{vault.name}</span>
                                        <Button variant="ghost" size="icon" className="text-red-500/50 hover:text-red-500 -mt-2 -mr-2" onClick={(e) => handleDelete(e, vault.id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </CardTitle>
                                    <CardDescription className="line-clamp-2 text-gray-400">{vault.description || "No description"}</CardDescription>
                                </CardHeader>
                                <CardFooter className="text-xs text-gray-500">
                                    Created {new Date(vault.created_at).toLocaleDateString()}
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}

                {selectedVault && (
                    <Dialog open={!!selectedVault} onOpenChange={(open) => !open && setSelectedVault(null)}>
                        <DialogContent className="bg-[#0a0a0a] border-[#1b1b1b] text-white max-w-2xl">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-3">
                                    {selectedVault.name}
                                    <div className="flex items-center gap-2">
                                        <div className="text-xs font-normal text-gray-500 bg-[#151515] px-2 py-1 rounded border border-[#2a2a2a] max-w-[150px] truncate">
                                            {selectedVault.id}
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 text-xs text-gray-400 hover:text-white"
                                            onClick={() => {
                                                navigator.clipboard.writeText(selectedVault.id);
                                                alert("Vault ID copied!");
                                            }}
                                        >
                                            Copy ID
                                        </Button>
                                    </div>
                                </DialogTitle>
                            </DialogHeader>

                            <div className="space-y-6 pt-4">
                                <div className="bg-[#151515] p-4 rounded-lg border border-[#2a2a2a]">
                                    <h3 className="font-medium mb-3 flex items-center gap-2">
                                        <Upload className="w-4 h-4" />
                                        Upload Documents
                                    </h3>
                                    <div className="flex gap-2 items-center">
                                        <Input
                                            type="file"
                                            className="bg-[#0a0a0a] border-[#2a2a2a] text-white"
                                            onChange={e => setUploadFile(e.target.files?.[0] || null)}
                                            accept=".pdf,.docx,.txt"
                                        />
                                        <Button
                                            onClick={handleUpload}
                                            disabled={!uploadFile || uploading}
                                            className="bg-white text-black shrink-0"
                                        >
                                            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Upload"}
                                        </Button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Supports PDF, DOCX, TXT. Files are automatically processed and embedded.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-medium mb-3">Documents</h3>
                                    {documents.length === 0 ? (
                                        <div className="text-sm text-gray-500 italic">No documents yet.</div>
                                    ) : (
                                        <div className="space-y-2 max-h-60 overflow-y-auto">
                                            {documents.map((doc: any) => (
                                                <div key={doc.id} className="flex justify-between items-center p-3 bg-[#151515] rounded border border-[#2a2a2a] text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="w-4 h-4 text-blue-400" />
                                                        <span className="truncate max-w-[200px]">{doc.filename}</span>
                                                    </div>
                                                    <span className="text-xs text-gray-500">{new Date(doc.created_at).toLocaleDateString()}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </div>
    );
}
