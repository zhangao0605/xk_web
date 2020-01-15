import moment from 'moment'
import { isNullOrEmpty } from './utils/tools'

export default{
  timeFormat (time, format = 'YYYY-MM-DD HH:mm:ss') {
    if(isNullOrEmpty(time)){
      return ''
    }
    if (Number(time) && String(time).length === 10) {
      time *= 1000
    }
    return moment(time).format(format)
  }

}
