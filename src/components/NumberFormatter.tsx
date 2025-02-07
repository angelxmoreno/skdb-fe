import { FC } from 'react';

type NumberFormatterProps = {
    value?: number;
};

const NumberFormatter: FC<NumberFormatterProps> = ({ value }) => {
    const formattedNumber = value ? value.toLocaleString() : value;
    return <span>{formattedNumber}</span>;
};

export default NumberFormatter;
