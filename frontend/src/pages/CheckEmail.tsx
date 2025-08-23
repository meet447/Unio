import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";
import { Link } from "react-router-dom";

const CheckEmail = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center space-y-1">
          <div className="w-10 h-10 bg-primary rounded flex items-center justify-center mx-auto mb-2">
            <Mail className="w-5 h-5 text-primary-foreground" />
          </div>
          <CardTitle className="text-xl">Check your email</CardTitle>
          <p className="text-sm text-muted-foreground">We've sent a verification link to your email address.</p>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Please check your inbox and follow the link to activate your account.
          </p>
          <Button asChild>
            <Link to="/login">Back to Login</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckEmail;
