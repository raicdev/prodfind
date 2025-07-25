import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Prodfind",
  description: "Privacy Policy for Prodfind",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <p className="text-muted-foreground mb-6">
          Last updated: {new Date().toLocaleDateString('en-US')}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p>
            Prodfind ("Service") values your privacy and is committed to protecting your personal information. 
            This Privacy Policy explains how we collect, use, and protect your information when you use our Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
          <h3 className="text-xl font-medium mb-3">2.1 Account Information</h3>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Email address</li>
            <li>Username</li>
            <li>Profile picture (optional)</li>
          </ul>
          
          <h3 className="text-xl font-medium mb-3">2.2 Content Information</h3>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Product information (name, description, images, etc.)</li>
            <li>Bookmark data</li>
            <li>Reviews and comments</li>
          </ul>

          <h3 className="text-xl font-medium mb-3">2.3 Usage Data</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access logs</li>
            <li>Usage patterns</li>
            <li>Device information</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide and operate the Service</li>
            <li>User authentication</li>
            <li>Customer support</li>
            <li>Service improvement and new feature development</li>
            <li>Monitor and address Terms of Service violations</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Information Sharing</h2>
          <p className="mb-4">
            We do not share your personal information with third parties except in the following cases:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>With your consent</li>
            <li>As required by law</li>
            <li>To protect the safety of users or the public</li>
            <li>With third-party services necessary for Service operation (authentication, payments, etc.)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Data Retention</h2>
          <p>
            We retain your personal information for as long as necessary to provide the Service 
            or while you maintain an account. After account deletion, we will delete your data 
            within a reasonable timeframe, except where required to comply with legal obligations.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Security</h2>
          <p>
            We implement appropriate technical and organizational security measures to protect 
            your personal information from loss, theft, unauthorized access, alteration, and disclosure.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Your Rights</h2>
          <p className="mb-4">You have the following rights regarding your personal information:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Request access to your personal information</li>
            <li>Request correction or deletion of your personal information</li>
            <li>Request restriction of processing</li>
            <li>Data portability rights</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Cookies</h2>
          <p>
            We may use cookies to improve the Service and enhance user experience. 
            You can disable cookies through your browser settings, though some features 
            may be limited as a result.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Third-Party Services</h2>
          <p>
            We use third-party services for authentication, file uploads, and other features. 
            These services have their own privacy policies that govern their use of your information.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Children's Privacy</h2>
          <p>
            Our Service is not intended for children under 13 years of age. 
            We do not knowingly collect personal information from children under 13. 
            If we discover we have collected such information, we will delete it promptly.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">11. Changes to Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. 
            We will notify users of significant changes through the Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">12. Contact Us</h2>
          <p>
            If you have questions or concerns about privacy, 
            please contact us through our contact form.
          </p>
        </section>
      </div>
    </div>
  );
}