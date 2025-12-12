import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/kibo-ui/dialog";
import { Button } from "@/components/kibo-ui/button";
import { Input } from "@/components/kibo-ui/input";
import { Label } from "@/components/kibo-ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/kibo-ui/select";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/kibo-ui/use-toast";

interface Provider {
  id: string;
  name: string;
  description: string;
  base_url?: string;
  user_id?: string;
}

interface AddApiKeyDialogProps {
  onApiKeyAdded: () => void;
  children?: React.ReactNode;
}

export const AddApiKeyDialog = ({ onApiKeyAdded, children }: AddApiKeyDialogProps) => {
  const [open, setOpen] = useState(false);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [name, setName] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Custom provider state
  const [newProviderName, setNewProviderName] = useState("");
  const [newProviderBaseUrl, setNewProviderBaseUrl] = useState("");
  
  const { toast } = useToast();

  const fetchProviders = async () => {
    const { data } = await supabase.from('providers').select('*').order('name');
    if (data) {
      setProviders(data);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      let providerId = selectedProvider;

      // Handle creation of new provider
      if (selectedProvider === "new_custom_provider") {
        if (!newProviderName) throw new Error("Provider name is required");
        
        const { data: newProvider, error: providerError } = await supabase
          .from('providers')
          .insert({
            name: newProviderName.toLowerCase().replace(/\s/g, ''),
            base_url: newProviderBaseUrl || null,
            user_id: user.id, // Associate with current user
            description: "Custom user provider"
          })
          .select()
          .single();
          
        if (providerError) throw providerError;
        providerId = newProvider.id;
      }

      const { error } = await supabase.from('api_keys').insert({
        user_id: user.id,
        provider_id: providerId,
        name,
        encrypted_key: apiKey, // In production, this should be properly encrypted
      });

      if (error) throw error;

      toast({
        title: "API key added",
        description: "Your API key has been securely stored.",
      });

      // Reset form
      setName("");
      setSelectedProvider("");
      setApiKey("");
      setNewProviderName("");
      setNewProviderBaseUrl("");
      setOpen(false);
      onApiKeyAdded();
      
      // Refresh providers list
      fetchProviders();
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to add API key",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add API Key
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add API Key</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="name">Key Name</Label>
            <Input
              id="name"
              placeholder="e.g., Production Key"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="provider">Provider</Label>
            <Select value={selectedProvider} onValueChange={setSelectedProvider} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a provider" />
              </SelectTrigger>
              <SelectContent>
                {providers.map((provider) => (
                  <SelectItem key={provider.id} value={provider.id}>
                    {provider.name}
                  </SelectItem>
                ))}
                <SelectItem value="new_custom_provider">
                  + Create New Provider
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedProvider === "new_custom_provider" && (
            <>
              <div className="space-y-1">
                <Label htmlFor="newProviderName">Provider Name</Label>
                <Input
                  id="newProviderName"
                  placeholder="e.g., LocalAI"
                  value={newProviderName}
                  onChange={(e) => setNewProviderName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="newProviderBaseUrl">Base URL (Optional)</Label>
                <Input
                  id="newProviderBaseUrl"
                  placeholder="e.g., http://localhost:8080/v1"
                  value={newProviderBaseUrl}
                  onChange={(e) => setNewProviderBaseUrl(e.target.value)}
                />
              </div>
            </>
          )}
          
          <div className="space-y-1">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="Enter your API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              required
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Key"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
