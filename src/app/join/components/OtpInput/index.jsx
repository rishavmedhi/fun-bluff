"use client";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import React from "react"

export default function OtpInput({onValueChange, value}) {
  return (
    <div className="space-y-2">
      <InputOTP
        maxLength={6}
        pattern={"^[a-zA-Z]+$"}
        value={value}
        onChange={(value) => onValueChange(value)}
        render={({ slots }) => (
          <InputOTPGroup>
            {slots.map((slot, index) => (
              <InputOTPSlot key={index} {...slot} />
            ))}{" "}
          </InputOTPGroup>
        )}
      />
      <div className="text-center text-sm">
        {value === "" ? (
          <>Enter the room code.</>
        ) : (
          <>You entered: {value}</>
        )}
      </div>
    </div>
  );
}
