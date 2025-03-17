"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="w-full border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-sm text-muted-foreground"
        >
          © 2025 {t("madeBy")}{" "}
          <a
            href="https://datacode.app"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground hover:underline"
          >
            datacode.app
          </a>
        </motion.div>
      </div>
    </footer>
  );
} 