import { Link } from "react-router-dom";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-medium text-black dark:text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-gray-600 dark:text-gray-400 font-light">
            Last updated: January 1, 2025
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-medium text-black dark:text-white mb-4">
                1. Acceptance of Terms
              </h2>
              <div className="text-gray-600 dark:text-gray-400 font-light space-y-4">
                <p>
                  By accessing or using Unio's services, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our services.
                </p>
                <p>
                  These terms apply to all users of Unio, including developers, businesses, and organizations that use our AI provider integration platform.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-black dark:text-white mb-4">
                2. Description of Service
              </h2>
              <div className="text-gray-600 dark:text-gray-400 font-light space-y-4">
                <p>
                  Unio is an AI provider integration platform that allows you to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Manage API keys for multiple AI providers (OpenAI, Anthropic, Google, Groq, Together, OpenRouter)</li>
                  <li>Route requests through a unified API interface</li>
                  <li>Monitor usage analytics and performance metrics</li>
                  <li>Implement automatic fallback mechanisms for rate-limited keys</li>
                  <li>Access streaming and non-streaming AI responses</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-black dark:text-white mb-4">
                3. User Account and Registration
              </h2>
              <div className="text-gray-600 dark:text-gray-400 font-light space-y-4">
                <p>
                  To use Unio, you must create an account and provide accurate information. You are responsible for:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Maintaining the confidentiality of your account credentials</li>
                  <li>All activities that occur under your account</li>
                  <li>Notifying us immediately of any unauthorized use</li>
                  <li>Ensuring your contact information is current and accurate</li>
                </ul>
                <p>
                  You must be at least 18 years old to create an account. By creating an account, you represent that you meet this requirement.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-black dark:text-white mb-4">
                4. API Key Management and Security
              </h2>
              <div className="text-gray-600 dark:text-gray-400 font-light space-y-4">
                <p>
                  When using Unio to manage your API keys, you acknowledge that:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You are responsible for the validity and proper use of all API keys you provide</li>
                  <li>You must have the right to use the API keys you store with us</li>
                  <li>You are responsible for compliance with each AI provider's terms of service</li>
                  <li>API keys are encrypted using industry-standard AES-256 encryption</li>
                  <li>You can delete your API keys at any time through the dashboard</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-black dark:text-white mb-4">
                5. Acceptable Use Policy
              </h2>
              <div className="text-gray-600 dark:text-gray-400 font-light space-y-4">
                <p>
                  You agree not to use Unio for any of the following prohibited activities:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Violating any applicable laws or regulations</li>
                  <li>Infringing on intellectual property rights</li>
                  <li>Attempting to gain unauthorized access to our systems</li>
                  <li>Interfering with or disrupting our services</li>
                  <li>Using our service to harm, harass, or threaten others</li>
                  <li>Distributing malware, spam, or other harmful content</li>
                  <li>Reverse engineering or attempting to extract our source code</li>
                  <li>Violating the terms of service of any AI provider</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-black dark:text-white mb-4">
                6. Service Availability and Performance
              </h2>
              <div className="text-gray-600 dark:text-gray-400 font-light space-y-4">
                <p>
                  While we strive to provide reliable service, we cannot guarantee:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>100% uptime or uninterrupted service availability</li>
                  <li>Performance of third-party AI provider services</li>
                  <li>Compatibility with future changes to AI provider APIs</li>
                  <li>Service availability during maintenance periods</li>
                </ul>
                <p>
                  We will provide reasonable notice for scheduled maintenance when possible.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-black dark:text-white mb-4">
                7. Billing and Payment Terms
              </h2>
              <div className="text-gray-600 dark:text-gray-400 font-light space-y-4">
                <p>
                  Unio offers both free and paid service tiers:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Free accounts have usage limitations as described in our pricing</li>
                  <li>Paid subscriptions are billed monthly or annually as selected</li>
                  <li>All fees are non-refundable unless required by law</li>
                  <li>You are responsible for all charges to third-party AI providers</li>
                  <li>We may suspend service for non-payment after reasonable notice</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-black dark:text-white mb-4">
                8. Intellectual Property Rights
              </h2>
              <div className="text-gray-600 dark:text-gray-400 font-light space-y-4">
                <p>
                  The Unio platform, including its software, design, and content, is protected by intellectual property laws. You acknowledge that:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Unio retains all rights to its platform and technology</li>
                  <li>You retain rights to your data and content</li>
                  <li>You grant us a license to process your data to provide our services</li>
                  <li>You will respect the intellectual property rights of AI providers</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-black dark:text-white mb-4">
                9. Limitation of Liability
              </h2>
              <div className="text-gray-600 dark:text-gray-400 font-light space-y-4">
                <p>
                  To the fullest extent permitted by law:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Unio is provided "as is" without warranties of any kind</li>
                  <li>We are not liable for indirect, incidental, or consequential damages</li>
                  <li>Our total liability is limited to the amount you paid us in the past 12 months</li>
                  <li>We are not responsible for third-party AI provider performance or costs</li>
                  <li>You use our service at your own risk</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-black dark:text-white mb-4">
                10. Data Protection and Privacy
              </h2>
              <div className="text-gray-600 dark:text-gray-400 font-light space-y-4">
                <p>
                  Your privacy is important to us. Please review our <Link to="/privacy" className="text-black dark:text-white hover:underline">Privacy Policy</Link> to understand how we collect, use, and protect your information.
                </p>
                <p>
                  We comply with applicable data protection regulations, including GDPR and CCPA where applicable.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-black dark:text-white mb-4">
                11. Termination
              </h2>
              <div className="text-gray-600 dark:text-gray-400 font-light space-y-4">
                <p>
                  Either party may terminate this agreement:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You may close your account at any time</li>
                  <li>We may suspend or terminate accounts for violations of these terms</li>
                  <li>We may discontinue the service with reasonable notice</li>
                  <li>Upon termination, your access will be removed and data may be deleted</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-black dark:text-white mb-4">
                12. Changes to Terms
              </h2>
              <div className="text-gray-600 dark:text-gray-400 font-light space-y-4">
                <p>
                  We may modify these terms from time to time. We will notify you of material changes by:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Posting updated terms on our website</li>
                  <li>Sending email notifications for significant changes</li>
                  <li>Providing notice through our platform</li>
                </ul>
                <p>
                  Continued use of Unio after changes constitutes acceptance of the new terms.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-black dark:text-white mb-4">
                13. Governing Law and Disputes
              </h2>
              <div className="text-gray-600 dark:text-gray-400 font-light space-y-4">
                <p>
                  These terms are governed by and construed in accordance with applicable law. Any disputes will be resolved through binding arbitration or in the appropriate courts as determined by applicable jurisdiction.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-black dark:text-white mb-4">
                14. Contact Information
              </h2>
              <div className="text-gray-600 dark:text-gray-400 font-light space-y-4">
                <p>
                  If you have questions about these Terms of Service, please contact us:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Email: legal""</li>
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

export default TermsOfService;