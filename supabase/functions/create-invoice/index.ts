import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CustomerData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface BookingData {
  movieId: string;
  movieTitle: string;
  cinema: string;
  date: string;
  time: string;
  seats: Array<{
    seatId: number;
    label: string;
    section: string;
    price: number;
  }>;
  total: number;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { customer, booking }: { customer: CustomerData; booking: BookingData } = await req.json();

    if (!customer || !booking) {
      return new Response(
        JSON.stringify({ error: "Customer and booking data are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Creating invoice for:", customer.email);
    console.log("Booking details:", booking);

    // Generate invoice number
    const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // In a real application, you would:
    // 1. Save the invoice to database
    // 2. Call an external API to create the invoice
    // 3. Process payment
    // For now, we'll simulate the API call

    const invoiceData = {
      invoiceNumber,
      customer: {
        name: `${customer.firstName} ${customer.lastName}`,
        email: customer.email,
        phone: customer.phone,
      },
      booking: {
        movieTitle: booking.movieTitle,
        cinema: booking.cinema,
        showDate: booking.date,
        showTime: booking.time,
        seats: booking.seats.map(s => s.label).join(", "),
        seatCount: booking.seats.length,
      },
      payment: {
        subtotal: booking.total,
        serviceFee: Math.round(booking.total * 0.05),
        total: Math.round(booking.total * 1.05),
        currency: "LKR",
      },
      createdAt: new Date().toISOString(),
      status: "pending",
    };

    console.log("Invoice created:", invoiceData);

    // Here you would typically call your external create-invoice API
    // const response = await fetch(`${BASE_API_URL}/invoices`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(invoiceData)
    // });

    return new Response(
      JSON.stringify({
        success: true,
        invoice: invoiceData,
        message: "Invoice created successfully",
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error creating invoice:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to create invoice" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
