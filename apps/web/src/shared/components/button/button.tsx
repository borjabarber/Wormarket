import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

import { classNames } from '../../lib/class-names';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md';

type BaseButtonProps = {
  children: ReactNode;
  className?: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
};

type ButtonAsButtonProps = BaseButtonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

type ButtonAsLinkProps = BaseButtonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

export type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

export function Button({
  children,
  className,
  size = 'md',
  variant = 'primary',
  ...props
}: ButtonProps) {
  const buttonClassName = classNames(
    'wm-button',
    `wm-button-${variant}`,
    `wm-button-${size}`,
    className,
  );

  if ('href' in props && typeof props.href === 'string') {
    return (
      <a className={buttonClassName} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button className={buttonClassName} type="button" {...props}>
      {children}
    </button>
  );
}
