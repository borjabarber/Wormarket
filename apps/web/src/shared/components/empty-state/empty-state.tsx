import type { ReactNode } from 'react';
import { useId } from 'react';

import { Button, type ButtonProps } from '../button/button';

export type EmptyStateProps = {
  action?: ButtonProps;
  children: ReactNode;
  title: string;
};

export function EmptyState({ action, children, title }: EmptyStateProps) {
  const titleId = useId();

  return (
    <section className="wm-empty-state" aria-labelledby={titleId}>
      <div aria-hidden="true" className="wm-empty-state-mark" />
      <h2 id={titleId}>{title}</h2>
      <p>{children}</p>
      {action ? <Button {...action} /> : null}
    </section>
  );
}
