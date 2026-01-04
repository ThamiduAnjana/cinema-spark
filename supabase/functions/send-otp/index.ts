import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// In-memory OTP storage (for demo - in production use database)
const otpStore = new Map<string, { otp: string; expiresAt: number }>();

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

    // Store OTP
    otpStore.set(email.toLowerCase(), { otp, expiresAt });

    console.log(`Sending OTP to ${email}: ${otp}`);

    // Send email with OTP
    const emailResponse = await resend.emails.send({
      from: "SAS Plaza Cinemas <onboarding@resend.dev>",
      to: [email],
      subject: "Your Booking Verification Code",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background-color: #0B0D14; color: #ffffff; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background-color: #1A1D25; border-radius: 12px; padding: 40px; }
            .logo { text-align: center; margin-bottom: 30px; }
            .logo h1 { color: #E10600; font-size: 28px; margin: 0; }
            .otp-box { background-color: #E10600; color: white; font-size: 32px; font-weight: bold; letter-spacing: 8px; text-align: center; padding: 20px; border-radius: 8px; margin: 30px 0; }
            .message { color: #ffffff; font-size: 16px; line-height: 1.6; text-align: center; }
            .footer { color: #666; font-size: 12px; text-align: center; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">
              <h1>🎬 SAS Plaza Cinemas</h1>
            </div>
            <p class="message">Your verification code for completing your movie booking is:</p>
            <div class="otp-box">${otp}</div>
            <p class="message">This code will expire in 10 minutes.</p>
            <p class="message">If you didn't request this code, please ignore this email.</p>
            <div class="footer">
              <p>© 2025 SAS Plaza Cinemas. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ success: true, message: "OTP sent successfully" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error sending OTP:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to send OTP" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// Export for verify-otp function
export { otpStore };
