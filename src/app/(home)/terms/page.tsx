import React from "react";

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
      
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <p className="text-muted-foreground mb-6">
          Last updated: {new Date().toLocaleDateString('en-US')}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p>
            These Terms of Service ("Terms") govern your use of Prodfind ("Service"). 
            By using our Service, you agree to be bound by these Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Service Description</h2>
          <p>
            Prodfind is a platform for discovering, sharing, and managing products. 
            Users can post product information, search for products, and bookmark items of interest.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Account Registration</h2>
          <p>
            To access certain features of our Service, you must create an account. 
            You must provide accurate and up-to-date information during registration.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. User Responsibilities</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Do not post content that infringes on others' rights</li>
            <li>Do not post false or misleading information</li>
            <li>Do not engage in spam or inappropriate promotional activities</li>
            <li>Do not interfere with the operation of the Service</li>
            <li>Do not post content that is illegal or harmful</li>
            <li>Do not post content that is spam or inappropriate</li>
            <li>Do not post content that violates the Terms of Service</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Intellectual Property</h2>
          <p>
            Users retain ownership of content they post. However, by posting content, 
            you grant us a license to display and distribute that content on our Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Disclaimer</h2>
          <p>
            The Service is provided "as is" without warranties of any kind. 
            We do not guarantee availability, accuracy, or completeness of the Service. 
            We are not liable for any damages arising from your use of the Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Service Changes and Termination</h2>
          <p>
            We may modify or terminate the Service at any time without prior notice.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Changes to Terms</h2>
          <p>
            These Terms may be updated from time to time. 
            Updated Terms will become effective when posted on the Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Governing Law</h2>
          <p>
            These Terms are governed by the laws of the jurisdiction where the Service is operated. 
            Any disputes will be resolved in the appropriate courts of that jurisdiction.
          </p>
        </section>
      </div>
    </div>
  );
}