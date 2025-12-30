import { Card, CardContent, CardHeader, CardTitle } from "@kite/ui";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="mt-2 text-gray-600">Manage application settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Application Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-8">
            Settings page is coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
