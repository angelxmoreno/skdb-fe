import {FC, Fragment, isValidElement, ReactNode} from "react";
import ButtonLink, {ButtonLinkProps} from "@components/layout/nav/ButtonLink";
import {ButtonProps} from "react-bootstrap";

export type ButtonPropsArray = Array<ButtonLinkProps | ButtonProps | ReactNode>

type ButtonGroupBuilderProps = {
    buttonProps?: ButtonPropsArray
}

const ButtonPropsBuilder: FC<ButtonGroupBuilderProps> = ({buttonProps}) => {
    return (
        <>
            {buttonProps &&
                buttonProps.map((buttonProp, index) => {
                    if (isValidElement(buttonProp)) {
                        return <Fragment key={`page-btn-${index}`}>{buttonProp}</Fragment>;
                    } else {
                        return (
                            <ButtonLink
                                key={`page-btn-${index}`}
                                {...(buttonProp as ButtonLinkProps)}
                            />
                        );
                    }
                })}
        </>
    )
}

export default ButtonPropsBuilder;