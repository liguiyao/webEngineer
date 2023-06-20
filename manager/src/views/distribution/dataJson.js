// 分销商state列表
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
// 分销佣金state列表
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
// 分销Status列表
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
