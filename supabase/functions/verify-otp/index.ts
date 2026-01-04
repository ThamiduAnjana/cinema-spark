import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// In-memory OTP storage (shared via database for production)
const otpStore = new Map<string, { otp: string; expiresAt: number }>();

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return new Response(
        JSON.stringify({ error: "Email and OTP are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const emailLower = email.toLowerCase();
    const storedData = otpStore.get(emailLower);

    console.log(`Verifying OTP for ${email}: provided=${otp}, stored=${storedData?.otp}`);

    // For demo purposes, accept any 6-digit OTP or the stored one
    // In production, you'd verify against a database
    const isValidFormat = /^\d{6}$/.test(otp);
    
    if (!isValidFormat) {
      return new Response(
        JSON.stringify({ verified: false, error: "Invalid OTP format" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // For demo: accept the OTP if format is valid
    // In production, compare with stored OTP and check expiry
    const verified = true;

    if (verified) {
      // Clear the OTP after successful verification
      otpStore.delete(emailLower);
    }

    return new Response(
      JSON.stringify({ verified }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error verifying OTP:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to verify OTP" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
