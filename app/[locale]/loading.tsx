export default function Loading() {
  return (
    <div
      className="flex h-screen items-center justify-center"
      aria-label="Loading AskAU"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary"
          role="status"
          aria-hidden="true"
        />
        <p className="text-sm text-muted-foreground">Loading AskAU…</p>
      </div>
    </div>
  );
}
