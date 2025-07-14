"use client";

import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const updateMatch = () => setMatches(media.matches);
    
    updateMatch();
    media.addEventListener("change", updateMatch);
    
    return () => media.removeEventListener("change", updateMatch);
  }, [query]);

  return matches;
} 