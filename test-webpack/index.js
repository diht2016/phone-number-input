import phoneNumberComponentFactory from '../src/phone-number.js'
import css from '../src/phone-number.css'

let component = phoneNumberComponentFactory({ mask: '+7(985)0II-**-**' })
document.body.appendChild(component)
