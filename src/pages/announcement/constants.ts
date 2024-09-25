export const columns = [
    {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        width: 80,
        align: 'center',
        customRender: ({ index }) => index + 1
    },
    {
        title: '标题',
        dataIndex: 'title',
        key: 'title',
        align: 'center',
        width: 200,
    },
    {
        title: '片段',
        dataIndex: 'snippet',
        key: 'snippet',
        align: 'center',
        width: 300,
    },
    {
        title: '内容',
        dataIndex: 'content',
        key: 'content',
        align: 'center',
        width: 500,
    },
    {
        title: '重要性',
        dataIndex: 'severity',
        key: 'severity',
        align: 'center',
        width: 150,
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        align: 'center'
    }
]

export const severityMap = {
    "high": "red",
    "low": "blue"
}