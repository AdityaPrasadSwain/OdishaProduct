import { Skeleton } from "../ui/Skeleton";

export default function DashboardSkeleton() {
    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-start mb-4">
                            <Skeleton className="w-10 h-10 rounded-lg" />
                            <Skeleton className="w-16 h-6 rounded-full" />
                        </div>
                        <Skeleton className="h-8 w-1/2 mb-2" />
                        <Skeleton className="h-4 w-1/4" />
                    </div>
                ))}
            </div>

            {/* Chart/Table Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl h-[400px]">
                    <Skeleton className="w-full h-full rounded-xl" />
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl h-[400px]">
                    <Skeleton className="w-full h-full rounded-xl" />
                </div>
            </div>
        </div>
    );
}
