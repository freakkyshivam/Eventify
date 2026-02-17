import { Card, CardContent } from "@/components/ui/card";

type StatsCardProps = {
  label: string;
  value: string | number;
  icon?: any;
};

export function StatsCard({ label, value, icon: Icon }: StatsCardProps) {
  return (
    <Card className="border-gray-200">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-600 mb-1">{label}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
          {Icon && (
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <Icon className="w-6 h-6 text-gray-600" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
