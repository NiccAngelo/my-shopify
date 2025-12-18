export default function StatCardSkeleton() {
  return (
    <div className="bg-white/80 backdrop-blur rounded-2xl p-6 border border-green-100 shadow-sm animate-pulse">
      <div className="w-12 h-12 bg-gray-200 rounded-xl mb-4"></div>
      <div className="h-3 bg-gray-200 rounded w-20 mb-2"></div>
      <div className="h-8 bg-gray-200 rounded w-24"></div>
    </div>
  );
}
