"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database } from "lucide-react";

export default function AdminDatabase() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Database Tools</h1>
        <p className="text-gray-600 mt-1">
          Database seeding, maintenance, and management tools
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Database Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Database tools and maintenance features will be implemented here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
