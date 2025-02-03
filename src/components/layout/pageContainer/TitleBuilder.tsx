import {FC} from "react";
import {Placeholder} from "react-bootstrap";

type TitleBuilderProps = {
    title?:string;
    subtitle?:string;
}
const TitleBuilder: FC<TitleBuilderProps> = ({title, subtitle}) => {
    return (
        <>
            {title && <h1 className="me-1">{title} <small className={'text-muted'}>{subtitle}</small></h1>}
            {!title && (
                <Placeholder as={'h1'} animation={'glow'} className={'me-1'}>
                    <Placeholder xs={12} size={'lg'}>
                        Loading book data
                    </Placeholder>
                </Placeholder>
            )}
        </>
    )
}

export default TitleBuilder;