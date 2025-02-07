export interface ListOptions {
    page: number
}

export interface BePagination {
    count: number
    current: number
    perPage: number
    page: number
    requestedPage: number
    pageCount: number
    start: number
    end: number
    prevPage: boolean
    nextPage: boolean
    sort: string
    direction: string
    limit: number | undefined
}

// List response structure.
export interface ListResponse<T> {
    pagination: BePagination;
    items: T[];
}

export interface BeError {
    message: string;
}

export interface BaseEntity {
    id: number
    created: Date
    modified: Date
}
