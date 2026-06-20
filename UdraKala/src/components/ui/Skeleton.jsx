import { cn } from "../../utils/cn";

function Skeleton({ className, ...props }) {
    return (
        <div
            className={cn("animate-shimmer bg-[#eff1f3] dark:bg-bg-dark rounded-md", className)}
            {...props}
        />
    );
}

export { Skeleton };
