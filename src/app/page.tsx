"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function App() {

  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("destimatch_user");
    const token = localStorage.getItem("destimatch_token");

    if (user || token) {
      router.push("/home");
    } else {
      router.push("/login");
    }
  }, [router]);
}
