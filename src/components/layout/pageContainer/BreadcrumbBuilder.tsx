import { FC } from 'react';
import { Link } from '@tanstack/react-router';

type Crumb = string | { name: string; uri: string };
export type Crumbs = Crumb[];

type BreadcrumbBuilderProps = {
    crumbs: Crumbs;
};

const BreadcrumbBuilder: FC<BreadcrumbBuilderProps> = ({ crumbs }) => {
    return (
        <nav aria-label="breadcrumb" className="border-top border-bottom mb-4">
            <ol className="breadcrumb mt-2 ms-1">
                {crumbs.map((crumb, index) => {
                    if (typeof crumb === 'string' && crumb !== '!placeholder') {
                        return (
                            <li
                                key={`breadcrumb-${crumb}-${index}`}
                                className="breadcrumb-item active"
                                aria-current="page"
                            >
                                {crumb}
                            </li>
                        );
                    } else if (typeof crumb === 'object' && crumb?.name) {
                        return (
                            <li
                                key={`breadcrumb-${crumb.name}-${crumb.uri}${index}`}
                                className="breadcrumb-item"
                            >
                                <Link to={crumb.uri}>{crumb.name}</Link>
                            </li>
                        );
                    } else {
                        return (
                            <li
                                key={`breadcrumb-placeholder-${index}`}
                                className="breadcrumb-item placeholder-glow"
                            >
                                <a className={'placeholder'}>placeholder</a>
                            </li>
                        );
                    }
                })}
            </ol>
        </nav>
    );
};

export default BreadcrumbBuilder;
