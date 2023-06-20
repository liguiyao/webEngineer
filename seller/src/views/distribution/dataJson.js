// 分销商state列表
export const distributionStatusList= [
    {
        value:'APPLY',
        label:'Apply  中'
    },
    {
        value:'RETREAT',
        label:'已清退'
    },
    {
        value:'REFUSE',
        label:'审核拒绝'
    },
    {
        value:'PASS',
        label:'审核pass'
    },
]
// 分销佣金state列表
export const cashStatusList = [
    {
        value:'APPLY',
        label:'待处理'
    },
    {
        value:'REFUSE',
        label:'拒绝'
    },
    {
        value:'PASS',
        label:'pass'
    }
]
// 分销Status列表
export const orderStatusList = [
    {
        value:'WAIT_BILL',
        label:'待结算'
    },
    {
        value:'WAIT_CASH',
        label:'待提现'
    },
    {
        value:'COMPLETE_CASH',
        label:'提现完成'
    }
]
