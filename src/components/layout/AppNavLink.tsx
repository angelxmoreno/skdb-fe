import {FC} from "react";
import {Link, LinkProps} from "@tanstack/react-router";


const AppNavLink: FC<LinkProps> = (props) => {
    return (
        <Link{...props} className={'nav-link'} />
    )
}

export default AppNavLink;