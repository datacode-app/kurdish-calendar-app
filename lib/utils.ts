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
