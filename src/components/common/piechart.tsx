import { Pie } from '@antv/g2plot';
import { each, groupBy, values } from '@antv/util';
import React, { useEffect, useRef } from 'react';

interface Props {
    apiURL: string;
}
const PieChart: React.FC<Props> = ({ apiURL }) => {
    const container = useRef<HTMLDivElement>(null);
    const pieRef = useRef<Pie | null>(null);

    useEffect(() => {
        if (!container.current) return;
        fetch(apiURL)
            .then((res) => res.json())
            .then((originData) => {
                const groupData = groupBy(originData, 'type');
                const pieData: Array<{ type: string, value: number }> = [];
                each(groupData, (values: Array<{ value: number }>, k: string) => {
                    pieData.push({
                        type: k,
                        value: values.reduce((a, b) => a + b.value, 0)
                    })
                })
                pieRef.current?.destroy();

                pieRef.current = new Pie(container.current!, {
                    appendPadding: 10,
                    innerRadius: 0.6,
                    data: pieData,
                    colorField: 'type',
                    angleField: 'value',
                    label: { type: 'inner' },
                    tooltip: false,
                    state: { active: { style: { lineWidth: 0 } } },
                    interactions: [
                        {
                            type: 'element-highlight',
                            cfg: {
                                showEnable: [{ trigger: 'element:mouseenter', action: 'cursor:pointer' }],
                                end: [
                                    { trigger: 'element:mouseleave', action: 'cursor:default' },
                                    { trigger: 'element:mouseleave', action: 'element-highlight:reset' },
                                ],
                            },
                        },
                    ],
                    height: 320,
                    autoFit: true,
                });
                pieRef.current.render();

            })
        return () => {
            pieRef.current?.destroy();
            pieRef.current = null;

        };

    }, [apiURL])
    return (
        <div id="container" style={{ height: 300 }} ref={container}></div>
    )
}
export default PieChart;