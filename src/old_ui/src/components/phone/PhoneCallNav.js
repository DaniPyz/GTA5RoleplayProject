import {ReactSVG} from 'react-svg'

import SVG_CALL_NAV_KEYPAD from './images/app_call/nav_keypad.svg'
import SVG_CALL_NAV_CONTACTS from './images/app_call/nav_contacts.svg'
import SVG_CALL_NAV_FAVORITES from './images/app_call/nav_favorites.svg'
import SVG_CALL_NAV_RECENTS from './images/app_call/nav_recents.svg'

export default function PhoneCallNav(data)
{
    data = data.data
    return (
        <>
            <div onClick={() => data.openApp('call-favorites')} className={`phone-call-nav-item ${data.app === 'call-favorites' && 'phone-call-nav-item-select'}`}>
                <ReactSVG src={SVG_CALL_NAV_FAVORITES} />
                <span>Favorites</span>
            </div>
            <div onClick={() => data.openApp('call-recents')} className={`phone-call-nav-item ${data.app === 'call-recents' && 'phone-call-nav-item-select'}`}>
                <ReactSVG src={SVG_CALL_NAV_RECENTS} />
                <span>Recents</span>
            </div>
            <div onClick={() => data.openApp('contacts')} className={`phone-call-nav-item ${data.app === 'contacts' || data.app === 'contact' ? 'phone-call-nav-item-select' : ''}`}>
                <ReactSVG src={SVG_CALL_NAV_CONTACTS} />
                <span>Contacts</span>
            </div>
            <div onClick={() => data.openApp('call')} className={`phone-call-nav-item ${data.app === 'call' && 'phone-call-nav-item-select'}`}>
                <ReactSVG src={SVG_CALL_NAV_KEYPAD} />
                <span>Keypad</span>
            </div>
        </>)
}
