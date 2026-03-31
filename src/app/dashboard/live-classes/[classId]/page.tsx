
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LiveClassRoomPage() {
  const router = useRouter();

  useEffect(() => {
    // Feature decommissioned. Redirecting to primary dashboard.
    router.push("/dashboard");
  }, [router]);

  return null;
}
