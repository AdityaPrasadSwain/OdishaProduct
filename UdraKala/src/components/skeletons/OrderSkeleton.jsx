import { Skeleton } from "../ui/Skeleton";

export default function OrderSkeleton() {
    return (
        <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-700">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-24" />
                        </div>
                        <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                    <div className="flex gap-4">
                        <Skeleton className="w-16 h-16 rounded-lg" />
                        <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-4 w-1/4" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
