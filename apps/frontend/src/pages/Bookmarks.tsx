export default function Bookmarks() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 md:pb-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Bookmarks</h2>
        <p className="text-muted-foreground">
          Your saved posts and opportunities.
        </p>
      </div>

      {/* Placeholder for bookmarks content */}
      <div className="text-center py-12 text-muted-foreground">
        <p>No bookmarks yet</p>
      </div>
    </div>
  );
}
