export const columns = [
    {
        title: '序号',
        dataIndex: 'key',
        key: 'key',
        width: 100,
        align: 'center',
        customRender: ({ index }) => index + 1
    },
    {
        title: '标签名',
        dataIndex: 'tagName',
        key: 'tagName',
        align: 'center',
    },
    {
        title: '使用次数',
        dataIndex: 'useCount',
        key: 'useCount',
        align: 'center',
    },
    {
        title: '标签类型',
        dataIndex: 'tagType',
        key: 'tagType',
        align: 'center'
    },
    {
        title: '创建时间',
        dataIndex: 'createdTime',
        key: 'createdTime',
        align: 'center'
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        width: 240,
        align: 'center'
    }
]

export const options = [
    {
        value: '学习'
    },
    {
        value: '工作'
    },
    {
        value: '生活'
    },
    {
        value: '吃饭'
    },
    {
        value: '睡觉'
    }
]

export const selectOptions = [
    {
        value: 1,
        text: '菜品类型'
    },
    {
        value: 0,
        text: '评分类型'
    },
]

export const categoryList = [
    '味道',
    '口感',
    '份量',
    '价格',
    '外观',
    '健康'
]


export const sort = [
    {
        value: 'asc',
        text: '升序'
    },
    {
        value: 'desc',
        text: '降序'
    }
]