import { Skeleton } from "../ui/Skeleton";

export default function ProductDetailsSkeleton() {
    return (
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col lg:flex-row gap-8">

                {/* Gallery Skeleton */}
                <div className="lg:w-[48%] space-y-4">
                    <div className="flex flex-col-reverse lg:flex-row gap-4">
                        <div className="flex lg:flex-col gap-3">
                            {[1, 2, 3, 4].map((i) => (
                                <Skeleton key={i} className="w-16 h-16 lg:w-20 lg:h-20 rounded-lg flex-shrink-0" />
                            ))}
                        </div>
                        <Skeleton className="flex-1 aspect-square rounded-xl w-full" />
                    </div>
                </div>

                {/* Info Skeleton */}
                <div className="lg:w-[52%] space-y-6">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-8 w-3/4" />

                    <div className="flex items-center gap-4">
                        <Skeleton className="h-6 w-16 rounded" />
                        <Skeleton className="h-4 w-24" />
                    </div>

                    <div className="flex items-baseline gap-3">
                        <Skeleton className="h-8 w-32" />
                        <Skeleton className="h-6 w-20" />
                    </div>

                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                        <Skeleton className="h-12 rounded-xl" />
                        <Skeleton className="h-12 rounded-xl" />
                    </div>
                </div>
            </div>
        </div>
    );
}
