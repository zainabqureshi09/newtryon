import { motion } from 'framer-motion';

interface SpecItem {
  label: string;
  value: string;
  helper?: string;
}

interface SpecTilesProps {
  items: SpecItem[];
  className?: string;
}

export function SpecTiles({ items, className }: SpecTilesProps) {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}>
      {items.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
          className="p-6 glass rounded-xl text-center group hover:bg-surface/20 transition-colors"
        >
          <h3 className="font-semibold text-lg mb-2 text-primary group-hover:text-accent transition-colors">
            {item.value}
          </h3>
          <p className="text-sm text-muted-foreground">{item.label}</p>
          {item.helper && (
            <p className="text-xs text-muted-foreground/70 mt-1">{item.helper}</p>
          )}
        </motion.div>
      ))}
    </div>
  );
}