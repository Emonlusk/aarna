import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Delete, Check } from "lucide-react";

interface PinInputProps {
  onComplete: (pin: string) => void;
  length?: number;
  error?: string;
}

export function PinInput({ onComplete, length = 4, error }: PinInputProps) {
  const [pin, setPin] = useState<string>("");

  const handleNumberClick = (num: string) => {
    if (pin.length < length) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === length) {
        onComplete(newPin);
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  const handleClear = () => {
    setPin("");
  };

  const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", ""];

  return (
    <div className="space-y-8">
      {/* PIN Display */}
      <div className="flex justify-center gap-4">
        {Array.from({ length }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "w-14 h-14 rounded-xl border-2 flex items-center justify-center transition-all duration-200",
              pin.length > i
                ? "border-primary bg-primary/10"
                : "border-border bg-card",
              error && "border-destructive bg-destructive/10"
            )}
          >
            {pin.length > i && (
              <div
                className={cn(
                  "w-3 h-3 rounded-full animate-scale-in",
                  error ? "bg-destructive" : "bg-primary"
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-center text-sm text-destructive animate-fade-in">
          {error}
        </p>
      )}

      {/* Number Pad */}
      <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
        {numbers.map((num, i) => {
          if (num === "" && i === 9) {
            return (
              <button
                key="clear"
                onClick={handleClear}
                className="h-16 rounded-xl text-muted-foreground hover:bg-muted/50 transition-colors flex items-center justify-center text-sm font-medium"
              >
                Clear
              </button>
            );
          }
          if (num === "" && i === 11) {
            return (
              <button
                key="delete"
                onClick={handleDelete}
                className="h-16 rounded-xl text-muted-foreground hover:bg-muted/50 transition-colors flex items-center justify-center"
              >
                <Delete className="w-6 h-6" />
              </button>
            );
          }
          return (
            <button
              key={num}
              onClick={() => handleNumberClick(num)}
              className="h-16 rounded-xl bg-card border border-border hover:bg-muted/50 hover:border-primary/30 active:scale-95 transition-all duration-150 font-display text-2xl font-bold text-foreground"
            >
              {num}
            </button>
          );
        })}
      </div>
    </div>
  );
}
