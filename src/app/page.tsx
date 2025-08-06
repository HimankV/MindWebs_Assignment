"use client"; // ← makes entire page client-only
export const dynamic = "force-dynamic"; // ← stop Next.js from prerendering

import Page from "./Components/c1";

export default function Home() {
  return <Page />;
}
