interface SkillBarProps {
  name: string;
  projects: number;
  percentage: number;
}

export default function SkillBar({
  name,
  projects,
  percentage,
}: SkillBarProps) {
  const safePercentage = Math.min(Math.max(percentage, 0), 100);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-tecsup-dark">{name}</p>
          <p className="text-xs text-gray-500">
            {projects} {projects === 1 ? "proyecto" : "proyectos"}
          </p>
        </div>

        <span className="text-xs font-bold text-tecsup-cyan">
          {safePercentage}%
        </span>
      </div>

      <div
        className="h-2.5 overflow-hidden rounded-full bg-gray-100"
        role="progressbar"
        aria-label={`Dominio de ${name}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={safePercentage}
      >
        <div
          className="h-full rounded-full bg-tecsup-cyan transition-all duration-500"
          style={{ width: `${safePercentage}%` }}
        />
      </div>
    </div>
  );
}