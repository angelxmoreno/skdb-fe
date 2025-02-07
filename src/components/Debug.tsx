import { FC } from 'react';

const Debug: FC<{ data: unknown }> = ({ data }) => {
    return <pre>{JSON.stringify(data, null, 6)}</pre>;
};

export default Debug;
