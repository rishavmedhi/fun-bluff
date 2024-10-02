"use client";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import React from "react";

export default function OtpInput({ onValueChange, value }) {
  return (
    <div className="space-y-2">
      <div className="text-center text-base mb-2 font-medium">
        {value === "" ? (
          <>Enter the room code</>
        ) : (
          <>Room Code</>
        )}
      </div>
      <InputOTP
        maxLength={6}
        pattern={"^[a-zA-Z]+$"}
        value={value}
        onChange={(value) => onValueChange(value)}
        render={({ slots }) => (
          <InputOTPGroup>
            {slots.map((slot, index) => (
              <InputOTPSlot
                key={index}
                {...slot}
              />
            ))}{" "}
          </InputOTPGroup>
        )}
      />
    </div>
  );
}
