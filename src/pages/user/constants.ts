export const columns = [
    {
      title: '序号',
      dataIndex: 'key',
      key: 'key',
      width: 100,
      customRender: ({ index }) => index + 1
    },{
      title: '头像',
      dataIndex: 'avatar',
      key: 'avatar',
      align: 'center',
      width: 150,
    },{
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      align: 'center',
      width: 150,
    },{
      title: '年级',
      dataIndex: 'grade',
      key: 'grade',
      align: 'center',
      width: 150,
    },{
      title: '学院',
      dataIndex: 'faculty',
      key: 'faculty',
      align: 'center',
      width: 200,
    },{
      title: '专业',
      dataIndex: 'major',
      key: 'major',
      align: 'center',
      width: 200,
    },{
      title: '班级',
      dataIndex: 'stuClass',
      key: 'stuClass',
      align: 'center',
      width: 200,
    },{
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      align: 'center'
    }
  ]

export const gradeList = [
  {
    text: '2021',
    value: 4,
  },{
    text: '2022',
    value: 3,
  },{
    text: '2023',
    value: 2
  },{
    text: '2024',
    value: 1
  }
]

export const college = [
    '计算机与信息科学学院',
    '文学院',
    '教育科学学院',
    '初等教育学院',
    '数学学院',
    '物理与电子工程学院',
    '化学学院',
    '生命科学学院',
    '经济与管理学院',
    '外国语学院',
    '体育学院',
    '马克思主义学院',
    '新闻与传媒学院',
    '历史与社会学院',
    '美术学院',
    '地理与旅游学院'
]