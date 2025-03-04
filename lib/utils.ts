/**
 * General Utility Functions Module
 * 
 * This module provides common utility functions used throughout the application.
 */

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines multiple class names into a single string, merging Tailwind CSS classes efficiently
 * 
 * This function uses clsx to combine class names and twMerge to handle Tailwind class conflicts.
 * It's used throughout the application for dynamic class name generation.
 * 
 * @param inputs - Any number of class name values (strings, objects, arrays, etc.)
 * @returns A merged string of class names with Tailwind conflicts resolved
 * 
 * @example
 * // Basic usage
 * <div className={cn("base-class", condition && "conditional-class")}>
 * 
 * @example
 * // With Tailwind classes that would normally conflict
 * <div className={cn("p-4", props.padding && "p-6")}>
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Returns the appropriate font class based on the locale
 * 
 * Used to apply the correct font family based on the language:
 * - Kurdish (ku): Noto Kufi Arabic
 * - Arabic (ar): Noto Kufi Arabic
 * - Persian (fa): Vazirmatn
 * - English (en): Geist Sans (default)
 * 
 * @param locale - The current locale/language
 * @returns CSS class name for the appropriate font
 * 
 * @example
 * <div className={getFontClass('ar')}>Arabic text</div>
 */
export function getFontClass(locale: string): string {
  switch (locale) {
    case 'ar':
    case 'ku':
      return 'font-notoKufi';
    case 'fa':
      return 'font-vazirmatn';
    default:
      return 'font-sans'; // Geist Sans for English
  }
}
