import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  BarChart3, 
  Shield, 
  Zap,
  Clock,
  AlertTriangle 
} from "lucide-react";

const FeatureShowcase = () => {
  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      {/* API Logs Demo */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold">Real-time API Logs</h3>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between p-2 bg-white/50 dark:bg-gray-800/50 rounded">
            <span className="font-mono text-xs">POST /v1/chat/completions</span>
            <Badge variant="secondary" className="text-xs">200ms</Badge>
          </div>
          <div className="flex items-center justify-between p-2 bg-white/50 dark:bg-gray-800/50 rounded">
            <span className="font-mono text-xs">POST /v1/embeddings</span>
            <Badge variant="secondary" className="text-xs">150ms</Badge>
          </div>
          <div className="flex items-center justify-between p-2 bg-white/50 dark:bg-gray-800/50 rounded">
            <span className="font-mono text-xs">POST /v1/completions</span>
            <Badge variant="destructive" className="text-xs">Rate Limited</Badge>
          </div>
        </div>
      </Card>

      {/* Rate Limiting Demo */}
      <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-green-600" />
          <h3 className="font-semibold">Smart Rate Limiting</h3>
        </div>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>OpenAI Key #1</span>
              <span>85%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{width: '85%'}}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>OpenAI Key #2</span>
              <span>23%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{width: '23%'}}></div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            Auto-switching to Key #2 when Key #1 hits limit
          </div>
        </div>
      </Card>

      {/* Analytics Demo */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 border-purple-200 dark:border-purple-800">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold">Usage Analytics</h3>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">Requests Today</span>
            <span className="font-semibold">2,847</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Avg Response Time</span>
            <span className="font-semibold">180ms</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Cost This Month</span>
            <span className="font-semibold">$24.50</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Success Rate</span>
            <span className="font-semibold text-green-600">99.8%</span>
          </div>
        </div>
      </Card>

      {/* Fallback Demo */}
      <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-orange-200 dark:border-orange-800">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-orange-600" />
          <h3 className="font-semibold">Auto Fallback</h3>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-2 bg-white/50 dark:bg-gray-800/50 rounded">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-sm">OpenAI - Down</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-white/50 dark:bg-gray-800/50 rounded">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm">Anthropic - Active</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-white/50 dark:bg-gray-800/50 rounded">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm">Google AI - Standby</span>
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            <Clock className="w-3 h-3 inline mr-1" />
            Switched to Anthropic in 50ms
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FeatureShowcase;