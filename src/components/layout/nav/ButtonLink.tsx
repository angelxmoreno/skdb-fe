import { FC, ReactElement, ReactNode } from 'react';
import { Link, type LinkProps } from '@tanstack/react-router';

export interface ButtonLinkProps extends LinkProps {
    icon?: ReactElement;
    outline?: boolean;
    sm?: boolean;
    lg?: boolean;
    primary?: boolean;
    secondary?: boolean;
    info?: boolean;
    warning?: boolean;
    success?: boolean;
    danger?: boolean;
    children?: ReactNode;
    className?: string;
    onClick?: () => unknown | Promise<unknown>;
}

const ButtonLink: FC<ButtonLinkProps> = ({
    icon,
    children,
    outline,
    info,
    warning,
    success,
    danger,
    lg,
    secondary,
    sm,
    primary,
    className,
    ...props
}) => {
    const classNames = [
        'btn',
        'd-inline-flex', // Ensure flexbox styling for the Link
        'align-items-center', // Vertically center the items in the Link
        primary && (outline ? 'btn-outline-primary' : 'btn-primary'),
        secondary && (outline ? 'btn-outline-secondary' : 'btn-secondary'),
        info && (outline ? 'btn-outline-info' : 'btn-info'),
        warning && (outline ? 'btn-outline-warning' : 'btn-warning'),
        success && (outline ? 'btn-outline-success' : 'btn-success'),
        danger && (outline ? 'btn-outline-danger' : 'btn-danger'),
        sm && 'btn-sm',
        lg && 'btn-lg',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <Link className={classNames} {...props} activeProps={{}}>
            {icon && (
                <span
                    className={
                        children ? 'd-flex align-items-center me-1' : 'd-flex align-items-center'
                    }
                >
                    {icon}
                </span>
            )}
            {children}
        </Link>
    );
};

export default ButtonLink;
