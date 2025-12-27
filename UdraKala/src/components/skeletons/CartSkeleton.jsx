import { Skeleton } from "../ui/Skeleton";

export default function CartSkeleton() {
    return (
        <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-4 p-4 border border-gray-100 dark:border-gray-800 rounded-xl">
                    <Skeleton className="w-24 h-24 rounded-lg flex-shrink-0" />
                    <div className="flex-1 space-y-3">
                        <div className="flex justify-between">
                            <Skeleton className="h-5 w-1/3" />
                            <Skeleton className="h-5 w-16" />
                        </div>
                        <Skeleton className="h-4 w-1/4" />
                        <div className="flex items-center gap-4 mt-2">
                            <Skeleton className="h-8 w-24 rounded" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                    </div>
                </div>
            ))}
            <div className="border-t pt-4 mt-4">
                <Skeleton className="h-12 w-full rounded-xl" />
            </div>
        </div>
    );
}
