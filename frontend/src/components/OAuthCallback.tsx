import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Handle the OAuth callback
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('OAuth callback error:', error);
          toast({
            variant: "destructive",
            title: "Authentication failed",
            description: error.message,
          });
          navigate('/login');
          return;
        }

        if (data.session) {
          // Successfully authenticated
          toast({
            title: "Welcome!",
            description: "You have been successfully signed in.",
          });
          navigate('/dashboard');
        } else {
          // No session found, redirect to login
          navigate('/login');
        }
      } catch (error: any) {
        console.error('OAuth processing error:', error);
        toast({
          variant: "destructive",
          title: "Authentication failed",
          description: "An error occurred during sign-in. Please try again.",
        });
        navigate('/login');
      }
    };

    handleOAuthCallback();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
        <p className="text-gray-600">Completing sign-in...</p>
      </div>
    </div>
  );
};

export default OAuthCallback;