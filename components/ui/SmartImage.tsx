"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * next/image with a graceful fallback: if a photo fails to load, a neutral
 * carbon surface is shown instead of a broken-image icon.
 */
export function SmartImage({ className, alt, ...props }: ImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        role="img"
        aria-label={alt}
        className={cn(
          "block bg-[radial-gradient(ellipse_at_30%_20%,#2e3138,#15171b_60%,#08090b)]",
          props.fill ? "absolute inset-0" : "",
          className,
        )}
      />
    );
  }

  return <Image alt={alt} className={className} onError={() => setFailed(true)} {...props} />;
}
