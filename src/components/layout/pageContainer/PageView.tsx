import {FC, PropsWithChildren} from "react";
import BreadcrumbBuilder, {Crumbs} from "@components/layout/pageContainer/BreadcrumbBuilder";
import ButtonPropsBuilder, {ButtonPropsArray} from "@components/layout/pageContainer/ButtonPropsBuilder";
import {Alert, Spinner} from "react-bootstrap";
import TitleBuilder from "@components/layout/pageContainer/TitleBuilder";

type PageViewProps = {
    title?: string;
    subtitle?: string;
    buttonProps?: ButtonPropsArray
    crumbs?: Crumbs;
    errorText?: string;
    contentLoading?: boolean;
}
const PageView: FC<PropsWithChildren<PageViewProps>> = ({
                                                            title,
                                                            subtitle,
                                                            children,
                                                            buttonProps,
                                                            crumbs,
                                                            errorText,
                                                            contentLoading
                                                        }) => {
    return (
        <>
            <div className="d-flex flex-row align-items-center">
                <TitleBuilder title={title} subtitle={subtitle}/>
                <ButtonPropsBuilder buttonProps={buttonProps}/>
            </div>
            <BreadcrumbBuilder crumbs={crumbs ?? []}/>
            {errorText && <Alert variant="danger">{errorText}</Alert>}
            {contentLoading && (
                <div className="text-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            )}
            {!contentLoading && children}
        </>
    )
}

export default PageView;