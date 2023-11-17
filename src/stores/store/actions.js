import axios from 'axios'
export default {
  handleError(err) {
    console.log('err:', err)
  },
  // TODO:呼喚時機：現在年齡、預計退休年齡、性別、退休後每個月想花多少錢變動時
  async getCostAfterRetire(form) {
    console.log('form:', form)
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
