import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function TarifaSkeleton() {
    return (
        <div className="space-y-8">
            {[1, 2].map((card) => (
                <Card key={card}>
                    <CardHeader className="flex flex-row items-center space-x-2 pb-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-8 w-48" />
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="space-y-2">
                                <Skeleton className="h-8 w-36" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            ))}
            <div className="flex justify-end">
                <Skeleton className="h-10 w-32" />
            </div>
        </div>
    );
}
