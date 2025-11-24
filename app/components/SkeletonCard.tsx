export default function SkeletonCard() {
  return (
    <div className="w-64 h-40 border border-gray-700 rounded-lg bg-gray-800/50 backdrop-blur-sm shadow-xl animate-pulse">
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="w-32 h-10 bg-gray-700 rounded"></div>
        <div className="w-24 h-6 bg-gray-600 rounded"></div>
      </div>
    </div>
  );
}