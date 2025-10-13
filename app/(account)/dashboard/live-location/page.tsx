"use client";

import { Suspense } from "react";
import LiveLocationClient from "./components/LiveLocationClient";

export default function LiveLocationPage() {
  return (
    <Suspense fallback={<div>Loading map...</div>}>
      <LiveLocationClient />
    </Suspense>
  );
}