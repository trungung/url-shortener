import { motion } from "framer-motion";

const colorClasses = [
  "text-blue-400",
  "text-sky-400",
  "text-emerald-400",
  "text-yellow-400",
  "text-orange-400",
  "text-pink-400",
  "text-violet-400",
  "text-rose-400",
  "text-red-400",
  "text-indigo-400",
];

interface AnimatedTitleProps {
  title: string;
}

export function AnimatedTitle({ title }: AnimatedTitleProps) {
  let letterIndex = 0;
  return (
    <h1 className="text-3xl sm:text-5xl font-bold flex flex-wrap justify-center text-center">
      {title.split(" ").map((word, wi) => (
        <span key={wi} className="mr-2">
          {word.split("").map((char, ci) => {
            const colorClass = colorClasses[letterIndex % colorClasses.length];
            const span = (
              <motion.span
                key={ci}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: letterIndex * 0.03 }}
                className={`inline-block ${colorClass}`}
              >
                {char}
              </motion.span>
            );
            letterIndex++;
            return span;
          })}
        </span>
      ))}
    </h1>
  );
}
