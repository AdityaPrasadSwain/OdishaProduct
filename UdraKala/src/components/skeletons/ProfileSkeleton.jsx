import { Skeleton } from "../ui/Skeleton";

export default function ProfileSkeleton() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Profile Header */}
            <div className="flex items-center gap-6 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                <Skeleton className="w-24 h-24 rounded-full" />
                <div className="space-y-3 flex-1">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white dark:bg-gray-800 rounded-xl">
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-lg" />
                <div className="md:col-span-2">
                    <Skeleton className="h-24 w-full rounded-lg" />
                </div>
            </div>
        </div>
    );
}
