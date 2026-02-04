import { Spin, Timeline } from "antd";
import { useEffect, useState } from "react";

interface Props {
    apiURL: string;
}
interface TimeLineData {
    id: string,
    title: string,
    status: string,
    description: string,
}
const TimeLine: React.FC<Props> = ({ apiURL }) => {
    const [data, setData] = useState<TimeLineData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(apiURL)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("loi mang ");
                }
                return res.json()
            })
            .then((originData) => {
                setData(originData);
                setLoading(false);
            })
            .catch(error => {
                console.error("co loi xay ra", error);
                setLoading(false);
            });

    }, [apiURL])

    if (loading) {
        return <Spin style={{ display: 'block', margin: '20px auto' }} />
    }

    return (
        <div style={{
            maxHeight: '400px',
            overflowY: 'auto',
            paddingRight: '10px'
        }}>
            <Timeline
                mode="left"
                style={{ padding: '10px 10px' }}
                items={data.map(originData => (
                    {
                        key: originData.id,
                        color: originData.status === 'completed' ? 'green' : (originData.status === 'ongoing' ? 'blue' : 'gray'),
                        children: (
                            <div style={{ lineHeight: '1.4' }}>
                                <h4 style={{ margin: '0 0 4px', fontSize: '15px' }}>
                                    {originData.title}
                                </h4>
                                <p style={{ margin: 0, fontSize: '13px', color: '#555' }}>
                                    {originData.description}
                                </p>
                            </div>
                        )
                    }
                ))}
            />
        </div>
    )

}
export default TimeLine;