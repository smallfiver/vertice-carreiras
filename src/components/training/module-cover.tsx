import {
  Compass,
  FileText,
  Linkedin,
  MessageSquare,
  Briefcase,
  TrendingUp,
  GraduationCap,
  LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  compass: Compass,
  "file-text": FileText,
  linkedin: Linkedin,
  "message-square": MessageSquare,
  briefcase: Briefcase,
  "trending-up": TrendingUp,
  "graduation-cap": GraduationCap,
};

type Props = {
  sequenceOrder: number;
  title: string;
  description?: string | null;
  coverGradient?: string | null;
  iconKey?: string | null;
  lessonsTotal?: number;
  lessonsDone?: number;
};

export function ModuleCover({
  sequenceOrder,
  title,
  description,
  coverGradient,
  iconKey,
  lessonsTotal,
  lessonsDone,
}: Props) {
  const Icon = ICONS[iconKey ?? "graduation-cap"] ?? GraduationCap;
  const gradient =
    coverGradient ?? "from-brand/30 via-brand/10 to-bg-deep";

  return (
    <div
      className={`relative overflow-hidden rounded-lg border border-border bg-gradient-to-br ${gradient} px-5 py-6`}
    >
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 30%, #C9A961 0%, transparent 45%), radial-gradient(circle at 85% 75%, #C9A961 0%, transparent 45%)",
        }}
      />
      <div className="relative flex items-start gap-4">
        <div className="h-14 w-14 shrink-0 rounded-xl border border-brand/40 bg-bg-deep/60 grid place-items-center">
          <Icon className="h-7 w-7 text-brand" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] uppercase tracking-[0.25em] text-brand">
            Módulo {sequenceOrder}
          </p>
          <h2 className="font-serif text-xl font-semibold mt-1 truncate">
            {title}
          </h2>
          {description && (
            <p className="text-sm text-fg-muted mt-1 line-clamp-2">
              {description}
            </p>
          )}
          {typeof lessonsTotal === "number" && (
            <p className="text-xs text-fg-muted mt-2">
              {lessonsDone ?? 0}/{lessonsTotal} aulas concluídas
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
