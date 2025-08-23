import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    // <div className="flex items-center justify-center min-h-screen">
    //   <SignUp />
    // </div>
    <div className="flex items-center justify-center min-h-screen">
      <SignUp
        appearance={{
          elements: {
            socialButtonsBlockButton: {
              display: "flex",
              justifyContent: "center",
            },
          },
        }}
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
      />
    </div>
  );
}
