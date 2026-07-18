
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-section">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-normal">Settings</h1>
        <p className="text-muted-foreground">Manage application settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Application Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="py-8 text-center text-muted-foreground">
            Settings page is coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
