import { Skeleton } from "../ui/Skeleton";

export default function ProductCardSkeleton() {
    return (
        <div className="bg-bg-surface dark:bg-bg-dark rounded-xl overflow-hidden shadow-sm border border-border dark:border-border">
            <Skeleton className="w-full aspect-[3/4]" />
            <div className="p-4 space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <div className="flex justify-between items-center">
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                </div>
                <Skeleton className="h-10 w-full rounded-lg" />
            </div>
        </div>
    );
}
