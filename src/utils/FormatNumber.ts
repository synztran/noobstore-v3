import ValidateUtils from "./ValidateUtils";

export function formatCurrency(n: number, separate = '.', currency = 'đ') {
    const num = ValidateUtils.isNumber(n) ? n : 0;
    const s = String(num);
    const regex = /\B(?=(\d{3})+(?!\d))/g;
    const ret = `${s.replace(regex, separate)}`;
    // currency = 0 for empty currency
    const cur = currency || '';
    return ret + cur;
  }