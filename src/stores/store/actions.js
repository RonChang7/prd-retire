import axios from 'axios'
import Swal from 'sweetalert2'

export default {
  handleError(err) {
    console.error('API Error:', err)
  },
  async getCostAfterRetire(form) {
    try {
      const { sex, retireAge, perMoneySpend } = form
      const res = await axios({
        method: 'get',
        url: `https://3i-life.com.tw/product/calculationRetireSimple?gender=${sex}&estimateRetireAge=${retireAge}&wantCostAfterRetirePerMonth=${perMoneySpend}`,
      })
      return res.data
    } catch (err) {
      this.handleError(err)
    }
  },
  async getCalculation(form, preparedNow, preparedAnnual,) {
    try {
      const { age, workAge, sex, retireAge, perMoneySpend, payType, salary } = form
      const res = await axios({
        method: 'get',
        url: `https://3i-life.com.tw/product/calculationRetire?gender=${sex}&currentAge=${age}&startWorkAge=${workAge}&estimateRetireAge=${retireAge}&payType=${payType}&wantCostAfterRetirePerMonth=${perMoneySpend}&currentSalary=${salary}&alreadyPrepare=${preparedNow}&alreadyPreparePerYear=${preparedAnnual}`,
      })
      return res.data
    } catch (err) {
      this.handleError(err)
    }
  },
}
