import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Key, Copy, Trash2, Eye, EyeOff, Plus, Pencil, Check, X } from "lucide-react";

interface ApiToken {
  id: string;
  name: string;
  last_used_at: string | null;
  created_at: string;
  is_active: boolean;
}

const Profile = () => {
  const [tokens, setTokens] = useState<ApiToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [newToken, setNewToken] = useState<string | null>(null);
  const [showToken, setShowToken] = useState(false);
  const [editingTokenId, setEditingTokenId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>("");
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchTokens();
    }
  }, [user]);

  const fetchTokens = async () => {
    try {
      const { data, error } = await supabase
        .from('user_api_tokens')
        .select('id, name, last_used_at, created_at, is_active')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        // If table doesn't exist yet, show empty state
        if (error.code === 'PGRST116' || error.message.includes('relation "public.user_api_tokens" does not exist')) {
          setTokens([]);
          setLoading(false);
          return;
        }
        throw error;
      }
      setTokens(data || []);
    } catch (error: any) {
      console.error('Error fetching tokens:', error);
      setTokens([]);
    } finally {
      setLoading(false);
    }
  };

  const generateToken = async () => {
    if (!user) return;
    
    setGenerating(true);
    try {
      // Generate token client-side
      const tokenBytes = new Uint8Array(32);
      crypto.getRandomValues(tokenBytes);
      const token = 'rk_' + Array.from(tokenBytes, byte => byte.toString(16).padStart(2, '0')).join('');
      
      // Store the token directly in the database
      const { error } = await supabase
        .from('user_api_tokens')
        .insert({
          user_id: user.id,
          token_hash: token, // store the raw token instead of hash
          name: 'Personal Access Token',
          is_active: true
        });
  
      if (error) throw error;
      
      setNewToken(token);
      setShowToken(true);
      await fetchTokens();
      toast({
        title: "Success",
        description: "New API token generated successfully",
      });
    } catch (error: any) {
      console.error('Error generating token:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate API token: " + error.message,
      });
    } finally {
      setGenerating(false);
    }
  };
  
  const copyToken = async (token: string) => {
    try {
      await navigator.clipboard.writeText(token);
      toast({
        title: "Copied",
        description: "Token copied to clipboard",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy token",
      });
    }
  };

  const deleteToken = async (tokenId: string) => {
    if (!confirm('Are you sure you want to delete this API token? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('user_api_tokens')
        .delete()
        .eq('id', tokenId);

      if (error) throw error;
      
      await fetchTokens();
      toast({
        title: "Success",
        description: "Token deleted successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete token",
      });
    }
  };

  const startEditing = (tokenId: string, currentName: string) => {
    setEditingTokenId(tokenId);
    setEditingName(currentName);
  };

  const cancelEditing = () => {
    setEditingTokenId(null);
    setEditingName("");
  };

  const saveTokenName = async (tokenId: string) => {
    if (!editingName.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Token name cannot be empty",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('user_api_tokens')
        .update({ name: editingName.trim() })
        .eq('id', tokenId);

      if (error) throw error;
      
      await fetchTokens();
      setEditingTokenId(null);
      setEditingName("");
      toast({
        title: "Success",
        description: "Token name updated successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update token name",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-medium text-black dark:text-white mb-2">
            API Access
          </h1>
          <p className="text-gray-600 dark:text-gray-400 font-light">
            Manage your personal access tokens for API authentication
          </p>
        </div>

        {/* Generate New Token Section */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h2 className="text-2xl font-medium text-black dark:text-white mb-2">
                Generate New Token
              </h2>
              <p className="text-gray-600 dark:text-gray-400 font-light">
                Create a new personal access token to authenticate with the Unio API
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button 
                onClick={generateToken} 
                disabled={generating}
                className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 rounded-full px-6 py-3 font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                {generating ? "Generating..." : "Generate Token"}
              </Button>
            </div>
          </div>

          {newToken && (
            <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-200 dark:border-green-800 mb-8">
              <h3 className="text-lg font-medium text-green-800 dark:text-green-200 mb-2">
                New Token Generated
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300 mb-4">
                Copy this token now - you won't be able to see it again!
              </p>
              <div className="flex gap-2">
                <Input 
                  value={showToken ? newToken : "rk_" + "•".repeat(64)}
                  readOnly 
                  className="font-mono text-sm bg-white dark:bg-gray-800 border-green-300 dark:border-green-700"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowToken(!showToken)}
                  className="border-green-300 dark:border-green-700"
                >
                  {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToken(newToken)}
                  className="border-green-300 dark:border-green-700"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Existing Tokens */}
        <div className="mb-12">
          <h2 className="text-2xl font-medium text-black dark:text-white mb-6">
            Your API Tokens
          </h2>
          
          {tokens.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <Key className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-black dark:text-white mb-2">
                No API tokens yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 font-light">
                Generate your first token to get started
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {tokens.map((token) => (
                <div key={token.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border border-gray-200 dark:border-gray-800 rounded-2xl hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {editingTokenId === token.id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="text-lg font-medium text-black dark:text-white"
                            placeholder="Token name"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                saveTokenName(token.id);
                              } else if (e.key === 'Escape') {
                                cancelEditing();
                              }
                            }}
                            autoFocus
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => saveTokenName(token.id)}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={cancelEditing}
                            className="text-gray-600 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/20"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-medium text-black dark:text-white">
                            {token.name}
                          </h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEditing(token.id, token.name)}
                            className="text-gray-600 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/20"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                      <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        Active
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Created: </span>
                        <span className="text-black dark:text-white font-medium">{formatDate(token.created_at)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Last used: </span>
                        <span className="text-black dark:text-white font-medium">
                          {token.last_used_at ? formatDate(token.last_used_at) : 'Never'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-4 sm:mt-0 sm:ml-6">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteToken(token.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>       
      </div>
    </div>
  );
};

export default Profile;