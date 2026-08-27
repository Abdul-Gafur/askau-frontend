import Link from "next/link";

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="flex min-h-screen flex-col items-center justify-center gap-6 p-8"
    >
      <div className="text-center">
        <p className="text-muted-foreground/30 mb-2 text-6xl font-bold">404</p>
        <h1 className="mb-2 text-2xl font-bold">Page not found</h1>
        <p className="text-muted-foreground mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm"
        >
          Go to home
        </Link>
      </div>
    </main>
  );
}
