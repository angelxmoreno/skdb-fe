import {FC, ReactElement} from "react";
import ButtonLink from "@components/layout/nav/ButtonLink";

type PaginationButtonProps = {
    page: number;
    icon?: ReactElement;
    className?: string;
    disabled?: boolean;
};

const PaginationButton: FC<PaginationButtonProps> = ({ page, icon, disabled = false }) => {
    return (
        <ButtonLink
            primary
            sm
            search={original => ({
                ...original,
                page,
            })}
            icon={icon}
            className={disabled ? 'disabled' : ''}
            disabled={disabled}
        />
    );
};


export default PaginationButton;