export const TailwindTest = () => (
    <div className="fixed bottom-4 right-4 p-6 bg-primary-light text-dark rounded-lg shadow-lg z-50 border-2 border-primary">
        <h2 className="text-2xl font-bold mb-2 text-primary">Tailwind Test</h2>
        <p className="text-muted font-medium">
            If you see this purple box with styled text, Tailwind is working!
        </p>
        <div className="flex gap-2 mt-4">
            <div className="w-8 h-8 bg-primary rounded-full"></div>
            <div className="w-8 h-8 bg-secondary rounded-full"></div>
            <div className="w-8 h-8 bg-success rounded-full"></div>
            <div className="w-8 h-8 bg-warning rounded-full"></div>
        </div>
    </div>
);
