import {FC, ReactElement} from "react";
import {BePagination} from "@entities/Server";
import {FaAnglesLeft, FaAnglesRight, FaChevronLeft, FaChevronRight} from 'react-icons/fa6';
import {ButtonGroup, ButtonToolbar} from "react-bootstrap";
import PaginationButton from "@components/pagination-counter/PaginationButton";
import NumberFormatter from "@components/NumberFormatter";

type PaginationCounterProps = {
    bePagination?: BePagination
    renderLabel?: (pagination: BePagination) => ReactElement;
}

const initPagination: BePagination = {
    page: 1,
    count: 1,
    current: 1,
    perPage: 1,
    requestedPage: 1,
    pageCount: 1,
    start: 1,
    end: 1,
    prevPage: false,
    nextPage: false,
    sort: '',
    direction: '',
    limit: 1,
}
const PaginationCounter: FC<PaginationCounterProps> = ({bePagination = initPagination, renderLabel}) => {
    const {page, pageCount, count} = bePagination;

    return (
        <ButtonToolbar id="pagination-toolbar" className="justify-content-center my-3">
            <ButtonGroup className={'me-1'}>
                <PaginationButton icon={<FaAnglesLeft/>} page={1} disabled={page === 1}/>
                <PaginationButton icon={<FaChevronLeft/>} page={page - 1} disabled={page === 1}/>
            </ButtonGroup>
            <span className={'fw-bold text-nowrap'}>
                {!!renderLabel && renderLabel(bePagination)}
                {!renderLabel && (
                    <>
                        Page <NumberFormatter value={page}/> of <NumberFormatter value={pageCount}/> ({' '}
                        <NumberFormatter value={count}/> records )
                    </>
                )}
            </span>
            <ButtonGroup className={'ms-1'}>
                <PaginationButton
                    icon={<FaChevronRight/>}
                    page={page + 1}
                    disabled={page >= pageCount}
                />
                <PaginationButton icon={<FaAnglesRight/>} page={pageCount} disabled={page >= pageCount}/>
            </ButtonGroup>
        </ButtonToolbar>
    )
}

export default PaginationCounter;