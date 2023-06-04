// 分销商状态列表
export const distributionStatusList= [
    {
        value:'APPLY',
        label:'Applying'
    },
    {
        value:'RETREAT',
        label:'Cleared'
    },
    {
        value:'REFUSE',
        label:'Reject'
    },
    {
        value:'PASS',
        label:'Pass'
    },
]
// 分销佣金状态列表
export const cashStatusList = [
    {
        value:'APPLY',
        label:'Wait'
    },
    {
        value:'FAIL_AUDITING',
        label:'Reject'
    },
    {
        value:'VIA_AUDITING',
        label:'Pass'
    }
]
// 分销订单状态列表
export const orderStatusList = [
    {
        value:'WAIT_BILL',
        label:'Wait'
    },
    {
        value:'WAIT_CASH',
        label:'pending withdrawal'
    },
    {
        value:'COMPLETE_CASH',
        label:'finish'
    }
]
