export default {
  // isLoading: false,
  legendList: [
    {
      name: '已准備退休金總額',
      itemStyle: {
        color: '#ff6a82',
      },
      value: 0,
    },
    {
      name: '勞退',
      color: '#c3275c',
      itemStyle: {
        color: '#c3275c',
      },
      value: 0,
      label: {
        show: false,
      },
    },
    {
      name: '勞保',
      color: '#ffba00',
      itemStyle: {
        color: '#ffba00',
        decal: {
          symbol: 'none',
        },
      },
      value: 0,
      label: {
        show: false,
      },
    },
    {
      name: '退休金缺口',
      color: '#1e2b58',
      itemStyle: {
        color: '#1e2b58',
      },
      value: 0,
      label: {
        show: false,
      },
    },
  ],
}
