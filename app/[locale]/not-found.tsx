import Link from "next/link";

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="flex min-h-screen flex-col items-center justify-center gap-6 p-8"
    >
      <div className="text-center">
        <p className="mb-2 text-6xl font-bold text-muted-foreground/30">404</p>
        <h1 className="mb-2 text-2xl font-bold">Page not found</h1>
        <p className="mb-8 text-muted-foreground">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
        >
          Go to home
        </Link>
      </div>
    </main>
  );
}
