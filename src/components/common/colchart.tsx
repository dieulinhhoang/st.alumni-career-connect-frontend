import { Column } from '@antv/g2plot';
import React, { useEffect, useRef } from 'react';

interface Props {
    apiURL: string;
}

const ColCharṭ: React.FC<Props> = ({ apiURL }) => {
    const container = useRef<HTMLDivElement>(null);
    const colRef = useRef<Column | (null)>(null);


    useEffect(() => {
        if (!container.current) { return }

        fetch(apiURL)
            .then((data) => data.json())
            .then((data) => {
                colRef.current?.destroy();

                colRef.current = new Column(container.current!, {
                    data,
                    xField: 'city',
                    yField: 'value',
                    seriesField: 'type',
                    isGroup: true,
                    legend: {
                        radio: {},
                    },
                    autoFit: true ,
                });


                colRef.current.render();

            })

    }, [apiURL])
    return (
        <div id="container" style={{ height: 300 }} ref={container}></div>
    )
}

export default ColCharṭ;