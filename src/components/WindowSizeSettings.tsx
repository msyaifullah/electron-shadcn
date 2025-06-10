import React, { useEffect, useState } from "react";
import { getWindowSize, setWindowSize } from "@/helpers/window_helpers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const PRESET_SIZES = [
  { label: "Small", width: 800, height: 600 },
  { label: "Medium", width: 1024, height: 768 },
  { label: "Large", width: 1280, height: 800 },  
  { label: "Panel", width: 400, height: 1080 },
  { label: "Focus", width: 400, height: 100 },
];

const TRANSITION_DURATION = 300; // should match the main process duration

export default function WindowSizeSettings() {
  const [size, setSize] = useState({ width: 800, height: 600 });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pendingSize, setPendingSize] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    const loadCurrentSize = async () => {
      const currentSize = await getWindowSize();
      setSize(currentSize);
    };
    loadCurrentSize();
  }, []);

  const handleSizeChange = async (width: number, height: number) => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setPendingSize({ width, height });

    try {
      await setWindowSize(width, height);
      setSize({ width, height });
    } catch (error) {
      console.error("Failed to set window size:", error);
    } finally {
      // Add a small delay to ensure the transition is complete
      setTimeout(() => {
        setIsTransitioning(false);
        setPendingSize(null);
      }, TRANSITION_DURATION + 50);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Window Size
          {isTransitioning && <Loader2 className="h-4 w-4 animate-spin" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="width">Width</Label>
            <Input
              id="width"
              type="number"
              value={pendingSize?.width ?? size.width}
              onChange={(e) => {
                const width = parseInt(e.target.value);
                if (!isNaN(width) && width > 0) {
                  handleSizeChange(width, size.height);
                }
              }}
              disabled={isTransitioning}
              className={isTransitioning ? "opacity-50" : ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="height">Height</Label>
            <Input
              id="height"
              type="number"
              value={pendingSize?.height ?? size.height}
              onChange={(e) => {
                const height = parseInt(e.target.value);
                if (!isNaN(height) && height > 0) {
                  handleSizeChange(size.width, height);
                }
              }}
              disabled={isTransitioning}
              className={isTransitioning ? "opacity-50" : ""}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Preset Sizes</Label>
          <div className="grid grid-cols-2 gap-2">
            {PRESET_SIZES.map((preset) => (
              <Button
                key={preset.label}
                variant="outline"
                onClick={() => handleSizeChange(preset.width, preset.height)}
                disabled={isTransitioning}
                className={isTransitioning ? "opacity-50" : ""}
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 