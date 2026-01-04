import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Download, Home, Calendar, MapPin, Clock, Armchair, Receipt } from "lucide-react";
import { useEffect, useRef } from "react";

interface BookingData {
  invoiceId: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  booking: {
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
  };
  createdAt: string;
}

export default function BookingConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const ticketRef = useRef<HTMLDivElement>(null);
  
  const bookingData = location.state as BookingData;

  useEffect(() => {
    if (!bookingData) {
      navigate("/");
    }
  }, [bookingData, navigate]);

  if (!bookingData) {
    return null;
  }

  const handleDownloadTicket = async () => {
    if (!ticketRef.current) return;

    // Create a printable ticket HTML
    const ticketContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Movie Ticket - ${bookingData.booking.movieTitle}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f5f5f5;
            padding: 20px;
          }
          .ticket {
            max-width: 400px;
            margin: 0 auto;
            background: linear-gradient(135deg, #1a1d25 0%, #0b0d14 100%);
            border-radius: 16px;
            overflow: hidden;
            color: white;
          }
          .ticket-header {
            background: #E10600;
            padding: 20px;
            text-align: center;
          }
          .ticket-header h1 {
            font-size: 24px;
            margin-bottom: 5px;
          }
          .ticket-header p {
            font-size: 12px;
            opacity: 0.9;
          }
          .ticket-body {
            padding: 24px;
          }
          .movie-title {
            font-size: 22px;
            font-weight: bold;
            margin-bottom: 20px;
            color: #FFCC00;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px dashed rgba(255,255,255,0.2);
          }
          .detail-row:last-child {
            border-bottom: none;
          }
          .detail-label {
            color: rgba(255,255,255,0.6);
            font-size: 12px;
          }
          .detail-value {
            font-weight: 600;
            text-align: right;
          }
          .seats-section {
            margin-top: 20px;
            padding: 16px;
            background: rgba(255,255,255,0.05);
            border-radius: 8px;
          }
          .seats-title {
            font-size: 12px;
            color: rgba(255,255,255,0.6);
            margin-bottom: 8px;
          }
          .seats-list {
            font-size: 18px;
            font-weight: bold;
            color: #FFCC00;
          }
          .total-section {
            margin-top: 20px;
            padding-top: 16px;
            border-top: 2px solid #E10600;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .total-label {
            font-size: 14px;
          }
          .total-value {
            font-size: 24px;
            font-weight: bold;
            color: #FFCC00;
          }
          .ticket-footer {
            padding: 16px 24px;
            background: rgba(255,255,255,0.05);
            text-align: center;
          }
          .invoice-id {
            font-size: 10px;
            color: rgba(255,255,255,0.5);
            margin-bottom: 8px;
          }
          .barcode {
            font-family: 'Courier New', monospace;
            font-size: 24px;
            letter-spacing: 3px;
            margin-bottom: 8px;
          }
          .customer-info {
            font-size: 11px;
            color: rgba(255,255,255,0.6);
          }
        </style>
      </head>
      <body>
        <div class="ticket">
          <div class="ticket-header">
            <h1>🎬 SAS PLAZA</h1>
            <p>Cinema Ticket</p>
          </div>
          <div class="ticket-body">
            <div class="movie-title">${bookingData.booking.movieTitle}</div>
            <div class="detail-row">
              <span class="detail-label">Cinema</span>
              <span class="detail-value">${bookingData.booking.cinema}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Date</span>
              <span class="detail-value">${bookingData.booking.date}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Time</span>
              <span class="detail-value">${bookingData.booking.time}</span>
            </div>
            <div class="seats-section">
              <div class="seats-title">Your Seats</div>
              <div class="seats-list">${bookingData.booking.seats.map(s => s.label).join(", ")}</div>
            </div>
            <div class="total-section">
              <span class="total-label">Total Amount</span>
              <span class="total-value">LKR ${bookingData.booking.total.toLocaleString()}</span>
            </div>
          </div>
          <div class="ticket-footer">
            <div class="invoice-id">Invoice: ${bookingData.invoiceId}</div>
            <div class="barcode">||||| ${bookingData.invoiceId.slice(-8).toUpperCase()} |||||</div>
            <div class="customer-info">${bookingData.customer.firstName} ${bookingData.customer.lastName} • ${bookingData.customer.email}</div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Create a blob and download
    const blob = new Blob([ticketContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Open in new window for printing/saving
    const printWindow = window.open(url, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0D14] flex items-center justify-center p-4">
      <Card className="max-w-lg w-full bg-[#1A1D25] border-white/10 p-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h1>
          <p className="text-white/60">Thank you for your purchase. Your tickets are ready.</p>
        </div>

        {/* Ticket Preview */}
        <div ref={ticketRef} className="bg-gradient-to-br from-[#1A1D25] to-[#0B0D14] rounded-xl border border-white/10 overflow-hidden mb-6">
          {/* Ticket Header */}
          <div className="bg-primary p-4 text-center">
            <h2 className="text-xl font-bold text-white">🎬 SAS PLAZA</h2>
            <p className="text-white/80 text-sm">Cinema Ticket</p>
          </div>

          {/* Ticket Body */}
          <div className="p-6 space-y-4">
            <h3 className="text-xl font-bold text-[#FFCC00]">{bookingData.booking.movieTitle}</h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-white/80">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{bookingData.booking.cinema}</span>
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <Calendar className="w-4 h-4 text-primary" />
                <span>{bookingData.booking.date}</span>
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <Clock className="w-4 h-4 text-primary" />
                <span>{bookingData.booking.time}</span>
              </div>
            </div>

            {/* Seats */}
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
                <Armchair className="w-4 h-4" />
                <span>Your Seats</span>
              </div>
              <p className="text-lg font-bold text-[#FFCC00]">
                {bookingData.booking.seats.map(s => s.label).join(", ")}
              </p>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between pt-4 border-t border-primary">
              <span className="text-white/80">Total Amount</span>
              <span className="text-2xl font-bold text-[#FFCC00]">
                LKR {bookingData.booking.total.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Ticket Footer */}
          <div className="bg-white/5 p-4 text-center">
            <p className="text-white/40 text-xs mb-2 flex items-center justify-center gap-1">
              <Receipt className="w-3 h-3" />
              Invoice: {bookingData.invoiceId}
            </p>
            <p className="font-mono text-lg tracking-widest text-white/60">
              ||||| {bookingData.invoiceId.slice(-8).toUpperCase()} |||||
            </p>
            <p className="text-white/50 text-xs mt-2">
              {bookingData.customer.firstName} {bookingData.customer.lastName} • {bookingData.customer.email}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Button
            onClick={handleDownloadTicket}
            className="w-full bg-primary hover:bg-primary/90 h-12"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Ticket
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="w-full border-white/20 text-white hover:bg-white/10 h-12"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </Button>
        </div>

        {/* Info Note */}
        <p className="text-white/40 text-xs text-center mt-6">
          A confirmation email has been sent to {bookingData.customer.email}
        </p>
      </Card>
    </div>
  );
}
