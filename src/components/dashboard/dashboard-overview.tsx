import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface Activity {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
}

interface DashboardOverviewProps {
  recentActivity: Activity[];
  userRole: string;
}

export default function DashboardOverview({
  recentActivity,
  userRole,
}: DashboardOverviewProps) {
  const isArtisan = userRole === "artisan";

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "processing":
        return "bg-blue-500";
      case "shipped":
        return "bg-purple-500";
      case "delivered":
        return "bg-green-500";
      case "canceled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            {isArtisan
              ? "Recent orders and customer interactions"
              : "Your recent orders and activities"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentActivity.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent activity.</p>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-2 h-2 rounded-full ${getStatusColor(
                        activity.status
                      )}`}
                    />
                    <div className="flex flex-col gap-0.5">
                      <p className="text-sm font-medium">
                        Order #{activity.id.substring(0, 8)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(activity.created_at), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">
                      {activity.status}
                    </Badge>
                    <p className="font-medium">
                      ₹{activity.total_amount.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>
            {isArtisan ? "Tips for Sellers" : "Recommendations"}
          </CardTitle>
          <CardDescription>
            {isArtisan
              ? "Grow your business on Artwork"
              : "Handpicked craft recommendations"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isArtisan ? (
            <div className="space-y-4">
              <div className="border rounded-md p-3">
                <h4 className="font-medium">Complete Your Profile</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Artisans with complete profiles receive 30% more orders.
                </p>
              </div>

              <div className="border rounded-md p-3">
                <h4 className="font-medium">High-Quality Images</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Products with 3+ high-quality images sell twice as fast.
                </p>
              </div>

              <div className="border rounded-md p-3">
                <h4 className="font-medium">Share Your Story</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Customers connect more with artisans who share their craft
                  journey.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Based on your browsing history and previous purchases, you might
                enjoy:
              </p>

              <div className="space-y-2">
                <div className="border rounded-md p-3">
                  <h4 className="font-medium">Madhubani Paintings</h4>
                  <p className="text-xs text-muted-foreground">
                    Traditional folk art from Bihar
                  </p>
                </div>

                <div className="border rounded-md p-3">
                  <h4 className="font-medium">Pashmina Shawls</h4>
                  <p className="text-xs text-muted-foreground">
                    Exquisite handwoven shawls from Kashmir
                  </p>
                </div>

                <div className="border rounded-md p-3">
                  <h4 className="font-medium">Bidriware</h4>
                  <p className="text-xs text-muted-foreground">
                    Metal handicraft with silver inlay work
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
