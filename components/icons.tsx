import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Send,
  Bot,
  User,
  Sun,
  Moon,
  BookOpen,
  Lightbulb,
  Map,
  ArrowLeftRight,
  BarChart3,
  Video,
  RefreshCw,
  LucideProps
} from 'lucide-react';

// Adapter to match existing props usage (React.SVGProps<SVGSVGElement>)
// We map generic SVG props to Lucide props where possible
type IconProps = React.SVGProps<SVGSVGElement> & { size?: number | string };

const adapt = (Icon: React.ComponentType<LucideProps>) => {
  return ({ className, ...props }: IconProps) => (
    // @ts-ignore - Lucide props overlap significantly but TypeScript might complain about specific SVG attributes
    <Icon className={className} {...props} />
  );
};

// Keep existing LogoIcon as custom if desired, or replace. 
// For now, I'll use a specific Lucide icon or keep the SVG if it was a custom brand logo.
// The previous LogoIcon looked like a shield/lock mix. I'll use the original SVG for the Logo to preserve identity
// unless user asked to replace EVERYTHING. I'll preserve the Logo unique shape for now but standardise the rest.

export const LogoIcon: React.FC<IconProps> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-8.41l2.59 2.59c.78.78 2.05.78 2.83 0s.78-2.05 0-2.83L13.58 9H16c1.1 0 2-.9 2-2s-.9-2-2-2h-4c-.55 0-1 .45-1 1v4c0 1.1.9 2 2 2h2.42l-2.59 2.59c-.78.78-.78 2.05 0 2.83s2.05.78 2.83 0L15 14.41V17c0 1.1.9 2 2 2s2-.9 2-2v-2.42l2.12 2.12c.78.78.78 2.05 0 2.83s-2.05.78-2.83 0L11 12.41V14c0 1.1-.9 2-2 2s-2-.9-2-2v-4c0-.55.45-1 1-1h4c.42 0 .79.26 1 .63-.78.78-2.05.78-2.83 0L8.58 11H7c-1.1 0-2 .9-2 2s.9 2 2 2h1.41z" />
  </svg>
);

export const CheckCircleIcon = adapt(CheckCircle);
export const XCircleIcon = adapt(XCircle);
export const ArrowUpIcon = adapt(TrendingUp); // Upgraded to TrendingUp
export const ArrowDownIcon = adapt(TrendingDown); // Upgraded to TrendingDown
export const SendIcon = adapt(Send);
export const BotIcon = adapt(Bot);
export const UserIcon = adapt(User);
export const SunIcon = adapt(Sun);
export const MoonIcon = adapt(Moon);
export const BookOpenIcon = adapt(BookOpen);
export const LightBulbIcon = adapt(Lightbulb);
export const MapIcon = adapt(Map);
export const ShieldCheckIcon = adapt(ShieldCheck);
export const AlertTriangleIcon = adapt(AlertTriangle);
export const ArrowLeftRightIcon = adapt(ArrowLeftRight);
export const ChartBarIcon = adapt(BarChart3);
export const VideoCameraIcon = adapt(Video);
export const RefreshIcon = adapt(RefreshCw);
