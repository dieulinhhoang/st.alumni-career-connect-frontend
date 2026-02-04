import { Column, Pie } from '@antv/g2plot';
import { each, groupBy } from '@antv/util';
import React, { useEffect, useRef } from 'react';

interface Props {
    apiURL: string;
    collapsed?: boolean;
}

const Chart: React.FC<Props> = ({ apiURL, collapsed }) => {
    const container1 = useRef<HTMLDivElement>(null);
    const container2 = useRef<HTMLDivElement>(null);

    const pieRef = useRef<Pie | null>(null);
    const colRef = useRef<Column | null>(null);

    // lưu dữ liệu gốc để khôi phục khi dblclick
    const originalPieData = useRef<any[]>([]);
    const originalColData = useRef<any[]>([]);

    useEffect(() => {
        if (!container1.current || !container2.current) return;

        // Delay to allow container to resize
        const timer = setTimeout(() => {
            fetch(apiURL)
                .then((res) => res.json())
                .then((originData) => {
                    // tạo dữ liệu cho pie
                    const groupData = groupBy(originData, 'type');
                    const pieData: Array<{ type: string; value: number }> = [];
                    each(groupData, (values: Array<{ value: number }>, k: string) => {
                        pieData.push({
                            type: k,
                            value: values.reduce((a, b) => a + b.value, 0),
                        });
                    });

                    // lưu dữ liệu gốc
                    originalPieData.current = pieData;
                    originalColData.current = originData;

                    // xoá instance cũ
                    pieRef.current?.destroy();
                    colRef.current?.destroy();

                    // khởi tạo Pie chart
                    pieRef.current = new Pie(container1.current!, {
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
                                    showEnable: [
                                        { trigger: 'element:mouseenter', action: 'cursor:pointer' },
                                    ],
                                    end: [
                                        { trigger: 'element:mouseleave', action: 'cursor:default' },
                                        {
                                            trigger: 'element:mouseleave',
                                            action: 'element-highlight:reset',
                                        },
                                    ],
                                },
                            },
                        ],
                        height: 200,
                        autoFit: true,
                    });
                    pieRef.current.render();

                    // khởi tạo Column chart
                    colRef.current = new Column(container2.current!, {
                        data: originData,
                        xField: 'city',
                        yField: 'value',
                        seriesField: 'type',
                        isGroup: true,
                        legend: false,
                        columnStyle: { radius: [4, 4, 0, 0] },
                        height: 200,
                        autoFit: true,
                        state: {
                            selected: { style: { stroke: '#000', lineWidth: 1.2 } },
                            inactive: { style: { opacity: 0.35 } },
                        },
                    });
                    colRef.current.render();

                    // Hover: phóng to lát Pie + highlight cột cùng type
                    pieRef.current?.on('element:mouseover', (evt) => {
                        const eventData = evt.data;
                        if (eventData?.data) {
                            const type = eventData.data.type;
                            colRef.current?.setState('selected', (d: any) => d.type === type);
                            colRef.current?.setState(
                                'selected',
                                (d: any) => d.type !== type,
                                false,
                            );

                            evt.element.animate(
                                {
                                    toAttrs: { scaleX: 1.1, scaleY: 1.1 },
                                    duration: 200,
                                    easing: 'easeQuadOut',
                                },
                                false,
                            );
                        }
                    });

                    // Mouseleave: reset lại bình thường
                    pieRef.current?.on('element:mouseleave', (evt) => {
                        colRef.current?.setState('selected', () => true, false);
                        evt.element.animate(
                            {
                                toAttrs: { scaleX: 1, scaleY: 1 },
                                duration: 200,
                                easing: 'easeQuadIn',
                            },
                            false,
                        );
                    });

                    // Click: lọc dữ liệu theo type
                    pieRef.current?.on('element:click', (evt) => {
                        const eventData = evt.data;
                        if (eventData?.data) {
                            const type = eventData.data.type;

                            pieRef.current?.changeData(
                                originalPieData.current.filter((d) => d.type === type),
                            );
                            colRef.current?.changeData(
                                originalColData.current.filter((d) => d.type === type),
                            );
                        }
                    });

                    //   Double-click: khôi phục dữ liệu gốc
                    pieRef.current?.on('element:dblclick', () => {
                        pieRef.current?.changeData(originalPieData.current);
                        colRef.current?.changeData(originalColData.current);
                    });
                })
                .catch(console.error);
        }, 300);

        // cleanup
        return () => {
            clearTimeout(timer);
            pieRef.current?.destroy();
            colRef.current?.destroy();
            pieRef.current = null;
            colRef.current = null;
        };
    }, [apiURL, collapsed]);

    return (
        <div
            id='chart-wrapper'
            style={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
                minHeight: 200,
                gap: 20,
            }}
        >
            <div id='container1' ref={container1} style={{ flex: 1 }} />
            <div id='container2' ref={container2} style={{ flex: 2 }} />
        </div>
    );
};

export default Chart;
