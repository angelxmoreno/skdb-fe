import { FC } from 'react';
import { Button, ButtonProps, Spinner } from 'react-bootstrap';

export interface LoadingButtonProps extends Omit<ButtonProps, 'children'> {
    text: string;
    isLoading?: boolean;
}

const LoadingButton: FC<LoadingButtonProps> = ({ text, isLoading = false, ...buttonProps }) => {
    return (
        <Button disabled={isLoading} {...buttonProps}>
            {text}
            <Spinner
                className={'ms-1'}
                hidden={!isLoading}
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
            />
        </Button>
    );
};

export default LoadingButton;
