"use client";

import { useEffect } from "react";

export function Reloader() {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.reload();
    }, 30 * 1000);

    return () => clearTimeout(timer);
  }, []);

  return null;
}
