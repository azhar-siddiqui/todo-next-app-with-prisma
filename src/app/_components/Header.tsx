"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useAuth, UserButton } from "@clerk/nextjs";

export default function Header() {
  const { isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <header className="w-full flex items-center justify-end py-2 px-4">
        <Skeleton className="h-10 w-10 rounded-full ml-auto" />
      </header>
    );
  }

  return (
    <header className="w-full flex items-center justify-end py-2 px-4">
      <div className="ml-auto">
        <UserButton />
      </div>
    </header>
  );
}
