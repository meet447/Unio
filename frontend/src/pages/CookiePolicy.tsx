import { Link } from "react-router-dom";

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-medium text-black dark:text-white mb-4">
            Cookie Policy
          </h1>
          <p className="text-gray-600 dark:text-gray-400 font-light">
            Last updated: January 1, 2025
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-medium text-black dark:text-white mb-4">
                1. What Are Cookies
              </h2>
              <div className="text-gray-600 dark:text-gray-400 font-light space-y-4">
                <p>
                  Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and enabling essential functionality.
                </p>
                <p>
                  Similar technologies we use include web beacons, pixels, and local storage, which serve similar purposes to cookies.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-black dark:text-white mb-4">
                2. Types of Cookies We Use
              </h2>
              <div className="text-gray-600 dark:text-gray-400 font-light space-y-6">
                
                <div>
                  <h3 className="text-lg font-medium text-black dark:text-white mb-2">
                    Essential Cookies
                  </h3>
                  <p>
                    These cookies are necessary for the website to function properly and cannot be disabled:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-2">
                    <li>Authentication cookies to keep you logged in</li>
                    <li>Security tokens to protect against CSRF attacks</li>
                    <li>Session management cookies</li>
                    <li>Load balancing cookies for performance</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-black dark:text-white mb-2">
                    Functional Cookies
                  </h3>
                  <p>
                    These cookies remember your preferences and choices:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-2">
                    <li>Theme preferences (light/dark mode)</li>
                    <li>Language settings</li>
                    <li>Dashboard layout preferences</li>
                    <li>Notification settings</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-black dark:text-white mb-2">
                    Analytics Cookies
                  </h3>
                  <p>
                    These cookies help us understand how you use our platform:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-2">
                    <li>Usage patterns and popular features</li>
                    <li>Performance monitoring</li>
                    <li>Error tracking and debugging</li>
                    <li>Aggregated usage statistics</li>
                  </ul>
                  <p className="mt-2">
                    <em>Note: Analytics data is anonymized and aggregated to protect your privacy.</em>
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-black dark:text-white mb-4">
                3. Third-Party Cookies
              </h2>
              <div className="text-gray-600 dark:text-gray-400 font-light space-y-4">
                <p>
                  We may use carefully selected third-party services that set their own cookies:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Supabase:</strong> For authentication and database services</li>
                  <li><strong>Hosting Provider:</strong> For content delivery and performance optimization</li>
                  <li><strong>Security Services:</strong> For fraud prevention and security monitoring</li>
                </ul>
                <p>
                  These services have their own privacy policies and cookie practices, which we encourage you to review.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-black dark:text-white mb-4">
                4. Cookie Duration
              </h2>
              <div className="text-gray-600 dark:text-gray-400 font-light space-y-4">
                <p>
                  Cookies we use have different lifespans:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
                  <li><strong>Persistent Cookies:</strong> Remain for a set period (typically 30 days to 1 year)</li>
                  <li><strong>Authentication Cookies:</strong> Typically expire after 24 hours of inactivity</li>
                  <li><strong>Preference Cookies:</strong> Usually last for 1 year to remember your settings</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-black dark:text-white mb-4">
                5. Managing Your Cookie Preferences
              </h2>
              <div className="text-gray-600 dark:text-gray-400 font-light space-y-4">
                
                <div>
                  <h3 className="text-lg font-medium text-black dark:text-white mb-2">
                    Browser Controls
                  </h3>
                  <p>
                    You can control cookies through your browser settings:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-2">
                    <li>Block all cookies (may impact site functionality)</li>
                    <li>Delete existing cookies</li>
                    <li>Set cookies to expire when you close your browser</li>
                    <li>Receive notifications before cookies are set</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-black dark:text-white mb-2">
                    Platform Controls
                  </h3>
                  <p>
                    Within Unio, you can manage certain preferences:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-2">
                    <li>Analytics preferences in your profile settings</li>
                    <li>Theme and display preferences</li>
                    <li>Notification settings</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-black dark:text-white mb-4">
                6. Impact of Disabling Cookies
              </h2>
              <div className="text-gray-600 dark:text-gray-400 font-light space-y-4">
                <p>
                  Disabling certain cookies may impact your experience:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Essential Cookies:</strong> The platform may not function properly</li>
                  <li><strong>Authentication Cookies:</strong> You'll need to log in repeatedly</li>
                  <li><strong>Preference Cookies:</strong> Your settings won't be remembered</li>
                  <li><strong>Analytics Cookies:</strong> We won't be able to improve our service based on usage data</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-black dark:text-white mb-4">
                7. Cookie Security and Privacy
              </h2>
              <div className="text-gray-600 dark:text-gray-400 font-light space-y-4">
                <p>
                  We implement security measures for cookies:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Secure Transmission:</strong> Cookies are transmitted over HTTPS</li>
                  <li><strong>HttpOnly Flags:</strong> Sensitive cookies are protected from client-side access</li>
                  <li><strong>SameSite Protection:</strong> Cookies are protected against CSRF attacks</li>
                  <li><strong>Minimal Data:</strong> Cookies contain only necessary information</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-black dark:text-white mb-4">
                8. Updates to This Policy
              </h2>
              <div className="text-gray-600 dark:text-gray-400 font-light space-y-4">
                <p>
                  We may update this Cookie Policy periodically to reflect changes in our practices or applicable laws. We will notify you of any material changes by:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Updating the "Last updated" date</li>
                  <li>Posting notices on our platform</li>
                  <li>Sending email notifications for significant changes</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-black dark:text-white mb-4">
                9. Contact Us
              </h2>
              <div className="text-gray-600 dark:text-gray-400 font-light space-y-4">
                <p>
                  If you have questions about our use of cookies or this Cookie Policy, please contact us:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Email: privacy""</li>
                  <li>Through our <Link to="/help" className="text-black dark:text-white hover:underline">Help Center</Link></li>
                </ul>
                <p>
                  You can also review our <Link to="/privacy" className="text-black dark:text-white hover:underline">Privacy Policy</Link> for more information about how we handle your personal data.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;