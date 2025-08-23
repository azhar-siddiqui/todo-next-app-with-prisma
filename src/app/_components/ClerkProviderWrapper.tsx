"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@clerk/nextjs";

export default function ClerkProviderWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div className="w-full min-h-[calc(100vh-56px)] flex items-center justify-center">
        <Skeleton className="w-full max-w-xl mx-4 h-56" />
      </div>
    );
  }

  return children;
}
