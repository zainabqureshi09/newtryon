import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ColorwayPickerProps {
  colorways: Record<string, { name: string; hex: string; images: { hero: string; gallery: string[] } }>;
  selected: string;
  onChange: (colorway: string) => void;
  className?: string;
}

export function ColorwayPicker({ 
  colorways, 
  selected, 
  onChange, 
  className 
}: ColorwayPickerProps) {
  const colorwayEntries = Object.entries(colorways);
  
  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="font-semibold">Color</h3>
      <div className="flex flex-wrap gap-3">
        {colorwayEntries.map(([key, colorway]) => {
          const isActive = selected === key;
        
          return (
            <motion.button
              key={key}
              onClick={() => onChange(key)}
              className="group relative flex flex-col items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-full border-2 transition-all duration-300",
                  isActive 
                    ? "border-primary ring-2 ring-primary/20" 
                    : "border-border hover:border-primary/50"
                )}
                style={{
                  backgroundColor: colorway.hex,
                }}
              />
              
              <span className={cn(
                "text-xs font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                {colorway.name}
              </span>
              
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 w-12 h-12 rounded-full border-2 border-primary"
                  layoutId="activeColorway"
                  transition={{ type: "spring", duration: 0.6 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}