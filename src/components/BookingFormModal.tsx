import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Loader2, Mail, Check, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

interface BookingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (invoiceData: any) => void;
  bookingData: {
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
}

const emailSchema = z.string().email("Please enter a valid email address");
const phoneSchema = z.string().min(10, "Phone number must be at least 10 digits").regex(/^[0-9+\-\s]+$/, "Please enter a valid phone number");

export function BookingFormModal({ isOpen, onClose, onSuccess, bookingData }: BookingFormModalProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isEmailValidated, setIsEmailValidated] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState("");
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);

  const validateField = (field: string, value: string) => {
    const newErrors = { ...errors };
    
    switch (field) {
      case "firstName":
        if (!value.trim()) newErrors.firstName = "First name is required";
        else delete newErrors.firstName;
        break;
      case "lastName":
        if (!value.trim()) newErrors.lastName = "Last name is required";
        else delete newErrors.lastName;
        break;
      case "email":
        try {
          emailSchema.parse(value);
          delete newErrors.email;
        } catch {
          newErrors.email = "Please enter a valid email address";
        }
        break;
      case "phone":
        try {
          phoneSchema.parse(value);
          delete newErrors.phone;
        } catch {
          newErrors.phone = "Please enter a valid phone number";
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === "email") {
      setIsEmailValidated(false);
      setShowOtpInput(false);
      setOtp("");
    }
    validateField(field, value);
  };

  const handleSendOtp = async () => {
    try {
      emailSchema.parse(formData.email);
    } catch {
      setErrors(prev => ({ ...prev, email: "Please enter a valid email address" }));
      return;
    }

    setIsSendingOtp(true);
    
    try {
      const { data, error } = await supabase.functions.invoke("send-otp", {
        body: { email: formData.email },
      });

      if (error) throw error;

      setShowOtpInput(true);
      toast.success("OTP sent to your email!");
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      toast.error(error.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }

    setIsVerifyingOtp(true);

    try {
      const { data, error } = await supabase.functions.invoke("verify-otp", {
        body: { email: formData.email, otp },
      });

      if (error) throw error;

      if (data.verified) {
        setIsEmailValidated(true);
        setShowOtpInput(false);
        toast.success("Email verified successfully!");
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      toast.error(error.message || "Failed to verify OTP. Please try again.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleSubmit = async () => {
    // Validate all fields
    const fieldsValid = ["firstName", "lastName", "email", "phone"].every(field => 
      validateField(field, formData[field as keyof typeof formData])
    );

    if (!fieldsValid) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    if (!isEmailValidated) {
      toast.error("Please verify your email first");
      return;
    }

    setIsCreatingInvoice(true);

    try {
      const { data, error } = await supabase.functions.invoke("create-invoice", {
        body: {
          customer: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
          },
          booking: bookingData,
        },
      });

      if (error) throw error;

      toast.success("Booking confirmed! Invoice created successfully.");
      onSuccess(data);
    } catch (error: any) {
      console.error("Error creating invoice:", error);
      toast.error(error.message || "Failed to create invoice. Please try again.");
    } finally {
      setIsCreatingInvoice(false);
    }
  };

  const isFormComplete = formData.firstName && formData.lastName && formData.email && formData.phone && isEmailValidated;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] bg-[#1A1D25] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-primary">Complete Your Booking</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-white/80">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                placeholder="John"
                className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
              />
              {errors.firstName && (
                <p className="text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.firstName}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-white/80">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                placeholder="Doe"
                className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
              />
              {errors.lastName && (
                <p className="text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.lastName}
                </p>
              )}
            </div>
          </div>

          {/* Email Field with Validation */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white/80">Email Address *</Label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="john@example.com"
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/40 pr-10"
                  disabled={isEmailValidated}
                />
                {isEmailValidated && (
                  <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                )}
              </div>
              {!isEmailValidated && (
                <Button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isSendingOtp || !formData.email || !!errors.email}
                  className="bg-primary hover:bg-primary/90 shrink-0"
                >
                  {isSendingOtp ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-1" />
                      Validate
                    </>
                  )}
                </Button>
              )}
            </div>
            {errors.email && (
              <p className="text-xs text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.email}
              </p>
            )}
            {isEmailValidated && (
              <p className="text-xs text-green-400 flex items-center gap-1">
                <Check className="w-3 h-3" />
                Email verified successfully
              </p>
            )}
          </div>

          {/* OTP Input */}
          {showOtpInput && !isEmailValidated && (
            <div className="space-y-3 p-4 bg-white/5 rounded-lg border border-white/10">
              <Label className="text-white/80">Enter OTP sent to your email</Label>
              <div className="flex flex-col items-center gap-3">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={setOtp}
                  className="gap-2"
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className="bg-white/10 border-white/20 text-white" />
                    <InputOTPSlot index={1} className="bg-white/10 border-white/20 text-white" />
                    <InputOTPSlot index={2} className="bg-white/10 border-white/20 text-white" />
                    <InputOTPSlot index={3} className="bg-white/10 border-white/20 text-white" />
                    <InputOTPSlot index={4} className="bg-white/10 border-white/20 text-white" />
                    <InputOTPSlot index={5} className="bg-white/10 border-white/20 text-white" />
                  </InputOTPGroup>
                </InputOTP>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSendOtp}
                    disabled={isSendingOtp}
                    className="text-sm border-white/20 text-white/70 hover:text-white"
                  >
                    Resend OTP
                  </Button>
                  <Button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={isVerifyingOtp || otp.length !== 6}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {isVerifyingOtp ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Verify OTP"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Phone Field */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-white/80">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="+94 77 123 4567"
              className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
            />
            {errors.phone && (
              <p className="text-xs text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.phone}
              </p>
            )}
          </div>

          {/* Booking Summary */}
          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <h4 className="font-semibold text-white mb-2">Booking Summary</h4>
            <div className="text-sm text-white/70 space-y-1">
              <p><span className="text-white/50">Movie:</span> {bookingData.movieTitle}</p>
              <p><span className="text-white/50">Cinema:</span> {bookingData.cinema}</p>
              <p><span className="text-white/50">Date & Time:</span> {bookingData.date}, {bookingData.time}</p>
              <p><span className="text-white/50">Seats:</span> {bookingData.seats.map(s => s.label).join(", ")}</p>
              <p className="text-white font-semibold mt-2">
                <span className="text-white/50">Total:</span> LKR {bookingData.total.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 border-white/20 text-white hover:bg-white/10"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isFormComplete || isCreatingInvoice}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            {isCreatingInvoice ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Creating Invoice...
              </>
            ) : (
              "Confirm Booking"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
