import { classNames } from '../../lib/class-names';

export type SkeletonProps = {
  className?: string;
  label?: string;
};

export function Skeleton({ className, label = 'Cargando contenido' }: SkeletonProps) {
  return <span aria-label={label} className={classNames('wm-skeleton', className)} role="status" />;
}
