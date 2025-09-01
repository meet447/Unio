import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-medium text-black dark:text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-600 dark:text-gray-400 font-light">
            Last updated: January 1, 2025
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-medium text-black dark:text-white mb-4">
                1. Information We Collect
              </h2>
              <div className="text-gray-600 dark:text-gray-400 font-light space-y-4">
                <p>
                  At Unio, we collect information to provide you with the best AI provider integration experience. The information we collect includes:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Account Information:</strong> Email address, username, and encrypted password when you create an account</li>
                  <li><strong>API Keys:</strong> Encrypted API keys for AI providers that you choose to store with us</li>
                  <li><strong>Usage Data:</strong> Request counts, response times, and error rates to provide analytics and improve our service</li>
                  <li><strong>Technical Information:</strong> IP addresses, browser type, and device information for security and optimization</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-black dark:text-white mb-4">
                2. How We Use Your Information
              </h2>
              <div className="text-gray-600 dark:text-gray-400 font-light space-y-4">
                <p>We use the collected information to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide and maintain the Unio platform services</li>
                  <li>Route your requests to appropriate AI providers using your stored API keys</li>
                  <li>Generate usage analytics and performance metrics</li>
                  <li>Improve our service reliability and performance</li>
                  <li>Communicate with you about service updates and support</li>
                  <li>Ensure the security and integrity of our platform</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-black dark:text-white mb-4">
                3. Data Security and Encryption
              </h2>
              <div className="text-gray-600 dark:text-gray-400 font-light space-y-4">
                <p>
                  Security is fundamental to our service. We implement enterprise-grade security measures:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Encryption:</strong> All API keys are encrypted using AES-256 encryption before storage</li>
                  <li><strong>Transport Security:</strong> All data transmission uses HTTPS/TLS encryption</li>
                  <li><strong>Access Control:</strong> Strict role-based access controls and authentication mechanisms</li>
                  <li><strong>Data Isolation:</strong> Your API keys and data are isolated from other users</li>
                  <li><strong>No Response Storage:</strong> We never store the content of API responses from AI providers</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-black dark:text-white mb-4">
                4. Information Sharing and Disclosure
              </h2>
              <div className="text-gray-600 dark:text-gray-400 font-light space-y-4">
                <p>
                  We do not sell, trade, or rent your personal information to third parties. We may share information only in the following circumstances:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>AI Providers:</strong> Your encrypted API keys are used to authenticate with AI providers you've configured</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                  <li><strong>Service Providers:</strong> With trusted third-party services that help us operate our platform (under strict confidentiality)</li>
                  <li><strong>Business Transfers:</strong> In the event of a merger or acquisition (with user notification)</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-black dark:text-white mb-4">
                5. Data Retention
              </h2>
              <div className="text-gray-600 dark:text-gray-400 font-light space-y-4">
                <p>
                  We retain your information as follows:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Account Data:</strong> Retained while your account is active</li>
                  <li><strong>API Keys:</strong> Stored until you delete them or close your account</li>
                  <li><strong>Usage Analytics:</strong> Aggregated usage data retained for up to 24 months</li>
                  <li><strong>Logs:</strong> Security and system logs retained for up to 90 days</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-black dark:text-white mb-4">
                6. Your Rights and Choices
              </h2>
              <div className="text-gray-600 dark:text-gray-400 font-light space-y-4">
                <p>You have the following rights regarding your data:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Access:</strong> Request access to your personal data</li>
                  <li><strong>Correction:</strong> Update or correct your account information</li>
                  <li><strong>Deletion:</strong> Delete your API keys or entire account at any time</li>
                  <li><strong>Export:</strong> Request a copy of your data in a portable format</li>
                  <li><strong>Withdrawal:</strong> Withdraw consent for data processing (where applicable)</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-black dark:text-white mb-4">
                7. Cookies and Tracking
              </h2>
              <div className="text-gray-600 dark:text-gray-400 font-light space-y-4">
                <p>
                  We use essential cookies and similar technologies to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Maintain your login session</li>
                  <li>Remember your preferences</li>
                  <li>Ensure security and prevent fraud</li>
                  <li>Analyze usage patterns (aggregated data only)</li>
                </ul>
                <p>
                  You can control cookie preferences through your browser settings.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-black dark:text-white mb-4">
                8. International Data Transfers
              </h2>
              <div className="text-gray-600 dark:text-gray-400 font-light space-y-4">
                <p>
                  Unio operates globally. Your data may be processed in countries other than where you reside. We ensure appropriate safeguards are in place for international data transfers, including:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Adequacy decisions where applicable</li>
                  <li>Standard contractual clauses</li>
                  <li>Robust security measures regardless of location</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-black dark:text-white mb-4">
                9. Changes to This Privacy Policy
              </h2>
              <div className="text-gray-600 dark:text-gray-400 font-light space-y-4">
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any material changes by:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Posting the updated policy on our website</li>
                  <li>Sending email notifications for significant changes</li>
                  <li>Updating the "Last updated" date at the top of this policy</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-black dark:text-white mb-4">
                10. Contact Us
              </h2>
              <div className="text-gray-600 dark:text-gray-400 font-light space-y-4">
                <p>
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Email: privacy""</li>
                  <li>Through our <Link to="/help" className="text-black dark:text-white hover:underline">Help Center</Link></li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;