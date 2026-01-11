import React from "react";
import { Button } from "./Button";

export const ButtonExample: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 p-6">
      <h2 className="text-2xl font-bold mb-4">REUI Button Examples</h2>

      <div className="flex flex-wrap gap-2">
        <Button>Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button size="sm">Small</Button>
        <Button size="default">Default</Button>
        <Button size="lg">Large</Button>
        <Button size="icon">🚀</Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button disabled>Disabled</Button>
        <Button variant="outline" disabled>
          Disabled Outline
        </Button>
      </div>
    </div>
  );
};
