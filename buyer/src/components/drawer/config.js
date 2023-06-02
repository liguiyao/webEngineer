const config = {
  closable: true, // 是否显示右上角Close按钮
  mask: true, // 是否显示遮罩层

  menuList: [{
    icon: 'md-person', // menu的icon
    title: 'Member center', // menu的标题
    titleShow: false,
    path: '', // menu点击的路径
    display: false // 是否显示此menu
  },
  {
    icon: 'ios-cart', // menu的icon
    title: 'Cart', // menu的标题
    path: '', // menu点击的路径
    display: true, // 是否显示此menu
    badge: 12,
    titleShow: true
  },
  {
    icon: 'md-clipboard', // menu的icon
    title: 'My order', // menu的标题
    path: '', // menu点击的路径
    display: true, // 是否显示此menu
    badge: '',
    titleShow: false
  },
  {
    icon: 'md-pricetag', // menu的icon
    title: 'Coupon', // menu的标题
    path: '', // menu点击的路径
    display: true, // 是否显示此menu
    badge: '',
    titleShow: false
  },
  {
    icon: 'logo-usd', // menu的icon
    title: 'My assets', // menu的标题
    path: '', // menu点击的路径
    display: false, // 是否显示此menu
    badge: '',
    titleShow: false
  },
  {
    icon: 'ios-eye', // menu的icon
    title: 'My tract', // menu的标题
    path: '', // menu点击的路径
    display: true, // 是否显示此menu
    badge: '',
    titleShow: false
  },
  {
    icon: 'md-star', // menu的icon
    title: 'My collection', // menu的标题
    path: '', // menu点击的路径
    display: true, // 是否显示此menu
    badge: '',
    titleShow: false
  }
  ]
}

export default config
