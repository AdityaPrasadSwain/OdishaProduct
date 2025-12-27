import { Skeleton } from "../ui/Skeleton";

export default function CategorySkeleton() {
    return (
        <div className="flex gap-4 sm:gap-8 overflow-x-auto pb-4 scrollbar-hide px-4">
            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2 flex-shrink-0">
                    <Skeleton className="w-16 h-16 sm:w-20 sm:h-20 rounded-full" />
                    <Skeleton className="h-4 w-12 sm:w-16" />
                </div>
            ))}
        </div>
    );
}
