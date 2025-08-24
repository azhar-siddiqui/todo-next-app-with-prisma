"use client";

import { ThemeSwitch } from "@/components/theme-switch";
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
      <div className="flex gap-x-4">
        <ThemeSwitch />
        <UserButton
          appearance={{
            elements: {
              userButtonAvatarBox: {
                width: "40px",
                height: "40px",
              },
            },
          }}
        />
      </div>
    </header>
  );
}
