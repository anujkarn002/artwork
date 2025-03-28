import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Verify Email | Artwork",
  description: "Verify your email address for Artwork",
};

export default function VerificationPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md text-center space-y-6">
        <div className="rounded-full bg-green-100 p-3 w-16 h-16 mx-auto flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold">Check your email</h1>

        <p className="text-gray-600">
          We've sent you a verification link to your email address. Please check
          your inbox and click on the link to verify your account.
        </p>

        <div className="pt-4">
          <Button asChild variant="outline">
            <Link href="/login">Return to login</Link>
          </Button>
        </div>

        <p className="text-sm text-gray-500">
          Didn't receive an email? Check your spam folder or{" "}
          <Link href="/register" className="text-primary hover:underline">
            try again
          </Link>
        </p>
      </div>
    </div>
  );
}
