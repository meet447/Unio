import { Link } from "react-router-dom";
import { Shield, Lock, Eye, Server, AlertTriangle, CheckCircle } from "lucide-react";

const Security = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-black dark:bg-white rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-white dark:text-black" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-medium text-black dark:text-white mb-4">
            Security at Unio
          </h1>
          <p className="text-gray-600 dark:text-gray-400 font-light max-w-2xl mx-auto">
            Your API keys and data security are our top priority. Learn about the measures we take to protect your information.
          </p>
        </div>

        <div className="space-y-12">
          {/* Security Overview */}
          <section className="grid md:grid-cols-2 gap-8">
            <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-2xl">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-medium text-black dark:text-white mb-2">
                End-to-End Encryption
              </h3>
              <p className="text-gray-600 dark:text-gray-400 font-light">
                All API keys are encrypted using AES-256 encryption before storage and during transmission.
              </p>
            </div>

            <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-2xl">
              <div className="w-12 h-12 bg-gray-800 dark:bg-gray-900 rounded-full flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-white dark:text-gray-300" />
              </div>
              <h3 className="text-lg font-medium text-black dark:text-white mb-2">
                Zero-Knowledge Architecture
              </h3>
              <p className="text-gray-600 dark:text-gray-400 font-light">
                We never store or log the content of your API responses, only usage metadata.
              </p>
            </div>

            <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-2xl">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mb-4">
                <Server className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-medium text-black dark:text-white mb-2">
                Secure Infrastructure
              </h3>
              <p className="text-gray-600 dark:text-gray-400 font-light">
                Our infrastructure follows industry best practices with regular security audits and monitoring.
              </p>
            </div>

            <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-2xl">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-lg font-medium text-black dark:text-white mb-2">
                Compliance Ready
              </h3>
              <p className="text-gray-600 dark:text-gray-400 font-light">
                Built with GDPR, CCPA, and SOC 2 compliance requirements in mind.
              </p>
            </div>
          </section>

          {/* Detailed Security Measures */}
          <section>
            <h2 className="text-2xl font-medium text-black dark:text-white mb-8">
              Security Measures
            </h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-medium text-black dark:text-white mb-4">
                  Data Encryption
                </h3>
                <div className="text-gray-600 dark:text-gray-400 font-light space-y-4">
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Encryption at Rest:</strong> All API keys are encrypted using AES-256 encryption before being stored in our database</li>
                    <li><strong>Encryption in Transit:</strong> All communications use TLS 1.3 for secure data transmission</li>
                    <li><strong>Key Management:</strong> Encryption keys are managed separately from data and rotated regularly</li>
                    <li><strong>Database Security:</strong> Database connections are encrypted and access is strictly controlled</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-medium text-black dark:text-white mb-4">
                  Access Controls
                </h3>
                <div className="text-gray-600 dark:text-gray-400 font-light space-y-4">
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Multi-Factor Authentication:</strong> Optional MFA for enhanced account security</li>
                    <li><strong>Role-Based Access:</strong> Strict access controls based on user roles and permissions</li>
                    <li><strong>Session Management:</strong> Secure session handling with automatic timeout</li>
                    <li><strong>API Authentication:</strong> Robust API key authentication and authorization</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-medium text-black dark:text-white mb-4">
                  Infrastructure Security
                </h3>
                <div className="text-gray-600 dark:text-gray-400 font-light space-y-4">
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Network Security:</strong> Firewalls, DDoS protection, and network segmentation</li>
                    <li><strong>Server Hardening:</strong> Regular security updates and configuration management</li>
                    <li><strong>Monitoring:</strong> 24/7 security monitoring and intrusion detection</li>
                    <li><strong>Backup Security:</strong> Encrypted backups with secure retention policies</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-medium text-black dark:text-white mb-4">
                  Privacy Protection
                </h3>
                <div className="text-gray-600 dark:text-gray-400 font-light space-y-4">
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Data Minimization:</strong> We only collect and store data necessary for service operation</li>
                    <li><strong>Response Privacy:</strong> API responses are never logged or stored by Unio</li>
                    <li><strong>User Control:</strong> You can delete your data and API keys at any time</li>
                    <li><strong>Anonymization:</strong> Usage analytics are anonymized and aggregated</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Compliance */}
          <section>
            <h2 className="text-2xl font-medium text-black dark:text-white mb-8">
              Compliance & Certifications
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-2xl">
                <h3 className="text-lg font-medium text-black dark:text-white mb-3">
                  GDPR Compliance
                </h3>
                <p className="text-gray-600 dark:text-gray-400 font-light mb-4">
                  Full compliance with European data protection regulations, including data subject rights and lawful basis for processing.
                </p>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-green-600 dark:text-green-400">Compliant</span>
                </div>
              </div>

              <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-2xl">
                <h3 className="text-lg font-medium text-black dark:text-white mb-3">
                  CCPA Compliance
                </h3>
                <p className="text-gray-600 dark:text-gray-400 font-light mb-4">
                  Adherence to California Consumer Privacy Act requirements for transparency and user rights.
                </p>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-green-600 dark:text-green-400">Compliant</span>
                </div>
              </div>

              <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-2xl">
                <h3 className="text-lg font-medium text-black dark:text-white mb-3">
                  SOC 2 Type II
                </h3>
                <p className="text-gray-600 dark:text-gray-400 font-light mb-4">
                  Security, availability, and confidentiality controls audited by independent third parties.
                </p>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm text-yellow-600 dark:text-yellow-400">In Progress</span>
                </div>
              </div>

              <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-2xl">
                <h3 className="text-lg font-medium text-black dark:text-white mb-3">
                  ISO 27001
                </h3>
                <p className="text-gray-600 dark:text-gray-400 font-light mb-4">
                  International standard for information security management systems and practices.
                </p>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm text-yellow-600 dark:text-yellow-400">Planned</span>
                </div>
              </div>
            </div>
          </section>

          {/* Security Best Practices */}
          <section>
            <h2 className="text-2xl font-medium text-black dark:text-white mb-8">
              Security Best Practices for Users
            </h2>
            
            <div className="space-y-6">
              <div className="p-6 bg-gray-900 dark:bg-gray-950 border border-gray-800 dark:border-gray-800 rounded-2xl">
                <h3 className="text-lg font-medium text-black dark:text-white mb-3">
                  Protect Your Account
                </h3>
                <ul className="text-gray-600 dark:text-gray-400 font-light list-disc pl-6 space-y-2">
                  <li>Use a strong, unique password for your Unio account</li>
                  <li>Enable multi-factor authentication when available</li>
                  <li>Log out from shared or public devices</li>
                  <li>Monitor your account activity regularly</li>
                </ul>
              </div>

              <div className="p-6 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-2xl">
                <h3 className="text-lg font-medium text-black dark:text-white mb-3">
                  API Key Management
                </h3>
                <ul className="text-gray-600 dark:text-gray-400 font-light list-disc pl-6 space-y-2">
                  <li>Regularly rotate your API keys with AI providers</li>
                  <li>Use descriptive names to identify your keys</li>
                  <li>Remove unused or expired keys promptly</li>
                  <li>Monitor usage patterns for unusual activity</li>
                </ul>
              </div>

              <div className="p-6 bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800 rounded-2xl">
                <h3 className="text-lg font-medium text-black dark:text-white mb-3">
                  Integration Security
                </h3>
                <ul className="text-gray-600 dark:text-gray-400 font-light list-disc pl-6 space-y-2">
                  <li>Use HTTPS for all API requests to Unio</li>
                  <li>Implement proper error handling in your applications</li>
                  <li>Don't log sensitive data in your application logs</li>
                  <li>Follow your organization's security policies</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Incident Response */}
          <section>
            <h2 className="text-2xl font-medium text-black dark:text-white mb-8">
              Security Incident Response
            </h2>
            
            <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-2xl">
              <p className="text-gray-600 dark:text-gray-400 font-light mb-4">
                In the unlikely event of a security incident, we are committed to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-400 font-light">
                <li>Immediate investigation and containment of the incident</li>
                <li>Prompt notification of affected users within 72 hours</li>
                <li>Transparent communication about the nature and scope of the incident</li>
                <li>Remediation actions and steps to prevent future occurrences</li>
                <li>Cooperation with law enforcement and regulatory authorities as required</li>
              </ul>
              
              <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl">
                <h4 className="text-black dark:text-white font-medium mb-2">
                  Report Security Issues
                </h4>
                <p className="text-gray-600 dark:text-gray-400 font-light">
                  If you discover a security vulnerability, please report it to us immediately at <strong>security""</strong>. 
                  We appreciate responsible disclosure and will work with you to address any issues promptly.
                </p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section>
            <div className="text-center p-8 border border-gray-200 dark:border-gray-800 rounded-2xl">
              <h2 className="text-2xl font-medium text-black dark:text-white mb-4">
                Questions About Security?
              </h2>
              <p className="text-gray-600 dark:text-gray-400 font-light mb-6">
                Our security team is here to help. Contact us for security inquiries, compliance questions, or to report issues.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/help" 
                  className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-full font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Security;