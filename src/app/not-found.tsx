import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <h1 className="text-6xl font-semibold">404</h1>
      <h2 className="mt-4 text-2xl font-semibold">Page Not Found</h2>
      <p className="mt-2 text-muted-foreground">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link 
        href="/"
        className="inline-flex items-center mt-8 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Link>
    </div>
  );
}
