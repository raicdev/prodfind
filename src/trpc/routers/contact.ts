import { z } from "zod";
import { Resend } from "resend";
import { createTRPCRouter, baseProcedure } from "@/trpc/init";

const resend = new Resend(process.env.RESEND_API_KEY);

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.email("Invalid email address"),
  subject: z.string().min(1, "Subject is required").max(200),
  message: z.string().min(1, "Message is required").max(2000),
});

export const contactRouter = createTRPCRouter({
  submit: baseProcedure
    .input(contactSchema)
    .mutation(async ({ input }) => {

      const { name, email, subject, message } = input;

      try {
        // Send email using Resend
        const data = await resend.emails.send({
          from: "Prodfind Contact <no-reply@prodfind.space>", // Replace with your verified domain
          to: ["master@prodfind.space"], // Replace with your contact email
          subject: `Contact Form: ${subject}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">New Contact Form Submission</h2>
              
              <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
              </div>
              
              <div style="background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                <h3 style="color: #333; margin-top: 0;">Message:</h3>
                <p style="white-space: pre-wrap;">${message}</p>
              </div>
              
              <div style="margin-top: 20px; padding: 15px; background: #e8f4f8; border-radius: 8px;">
                <p style="margin: 0; font-size: 14px; color: #666;">
                  This message was sent from the Prodfind contact form at ${new Date().toLocaleString()}.
                </p>
              </div>
            </div>
          `,
          text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

Sent at: ${new Date().toLocaleString()}
          `,
        });

        // Also send a confirmation email to the user
        await resend.emails.send({
          from: "Prodfind <hello@prodfind.space>", // Replace with your verified domain
          to: [email],
          subject: "Thank you for contacting Prodfind",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">Thank you for your message!</h2>
              
              <p>Hi ${name},</p>
              
              <p>We've received your message and will get back to you as soon as possible. Here's a copy of what you sent:</p>
              
              <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong></p>
                <p style="white-space: pre-wrap;">${message}</p>
              </div>
              
              <p>Best regards,<br>The Prodfind Team</p>
            </div>
          `,
          text: `
Hi ${name},

We've received your message and will get back to you as soon as possible. Here's a copy of what you sent:

Subject: ${subject}
Message: ${message}

Best regards,
The Prodfind Team
          `,
        });

        console.log("Contact email sent:", data);

        return {
          success: true,
          message: "Your message has been sent successfully!",
        };
      } catch (error) {
        console.error("Failed to send contact email:", error);
        throw new Error("Failed to send your message. Please try again later.");
      }
    }),
});