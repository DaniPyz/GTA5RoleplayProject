import { useAppDispatch, useAppSelector, useKeyboard } from 'hooks';
import { FC, Fragment, useCallback, useState } from 'react';
import style from './Telephone.module.scss';
import { keyList } from './keys';
import cls from 'classnames';

import { ReactComponent as CreateContactSvg } from './vectors/createContact.svg';
import { ReactComponent as DeleteSvg } from './vectors/delete.svg';
import { ReactComponent as CallSvg } from './vectors/call.svg';
import { ReactComponent as RecentSvg } from './vectors/last.svg';
import { ReactComponent as ContactsSvg } from './vectors/contacts.svg';
import { ReactComponent as KeysSvg } from './vectors/keys.svg';
import { ReactComponent as AvatarSvg } from './vectors/avatar.svg';
import { ReactComponent as SearchSvg } from './vectors/search.svg';
import { useMasterSpring } from './Telephone.spring';
import { animated } from 'react-spring';
import { store } from 'store';
import { RecentType } from 'reducers/phoneReducer';

export const numberToName = (number: string) => {
	const contacts = store.getState().phoneState.telephone.contacts;
	const contact = contacts.find((x) => x.number === number);
	return contact?.name || number;
};

const Call: FC = () => {
	const System = useMasterSpring();
	const dispatch = useAppDispatch();
	const [number, setNumber] = useState('');
	const [firstname, setFirstname] = useState('');
	const [lastname, setLastname] = useState('');
	const [company, setCompany] = useState('');
	const [newNumber, setNewNumber] = useState('');

	return (
		<div className={style.call}>
			{System.addContact(
				(styles, visible) =>
					visible && (
						<animated.div style={styles} className={style.addContact}>
							<div className={style.header}>
								<div className={style.button} onClick={() => dispatch({ type: 'PHONE_TELEPHONE_CREATE_CONTACT_SET', value: false })}>
									Отменить
								</div>
								<div className={style.title}>Контакт</div>
								<div className={style.button} onClick={() => dispatch({ type: 'PHONE_TELEPHONE_CREATE_CONTACT_SET', value: false })}>
									Готово
								</div>
							</div>
							<div className={style.avatar}>
								<AvatarSvg />
							</div>
							<div className={style.nameEnter}>
								<input placeholder="Имя" className={style.input} value={firstname} onChange={(e) => setFirstname(e.target.value)} />
								<input placeholder="Фамилия" className={style.input} value={lastname} onChange={(e) => setLastname(e.target.value)} />
								<input placeholder="Компания" className={style.input} value={company} onChange={(e) => setCompany(e.target.value)} />
							</div>
							<div className={style.numberEnter}>
								<input
									className={style.numberInput}
									placeholder="Телефон"
									value={newNumber}
									onChange={(e) => setNewNumber(e.target.value)}
								/>
							</div>
						</animated.div>
					)
			)}

			<div className={style.main}>
				<div className={style.numberEnter}>{number}</div>
				<div className={style.createContact} onClick={() => dispatch({ type: 'PHONE_TELEPHONE_CREATE_CONTACT_SET', value: true })}>
					Создать контакт
					<CreateContactSvg />
				</div>
				<div className={style.keyList}>
					{keyList.map((item) => (
						<div
							onClick={() => {
								if (number.length >= 8) return;
								setNumber(number + item.name);
							}}
							key={item.name}
							className={style.keyItem}
						>
							<div className={style.keyName}>{item.name}</div>
							<div className={style.keyLetters}>{item.keys}</div>
						</div>
					))}
					<div />
					<div className={style.keyCall}>
						<CallSvg />
					</div>
					<div className={style.keyDelete} onClick={() => setNumber(number.slice(0, number.length - 1))}>
						<DeleteSvg />
					</div>
				</div>
			</div>
		</div>
	);
};

const Contacts: FC = () => {
	const phone = useAppSelector((state) => state.phoneState);
	const root = useAppSelector((state) => state.rootState);

	const [filter, setFilter] = useState('');

	return (
		<div className={style.contacts}>
			<div className={style.header}>
				Контакты
				<div className={style.searchInput}>
					<SearchSvg />
					<input className={style.search} placeholder="Поиск" value={filter} onChange={(e) => setFilter(e.target.value)} />
				</div>
				<hr color="#292D35" />
			</div>

			<div className={style.myCard}>
				<div className={style.myCardSvg}>
					<AvatarSvg />
				</div>
				<div className={style.myCardWrapper}>
					<div className={style.name}>{root.player.name}</div>
					<div className={style.myNumber}>{phone.telephone.myNumber}</div>
				</div>
			</div>
			{[
				...new Set(
					phone.telephone.contacts
						.filter((contact) => contact.name.toLowerCase().includes(filter.toLowerCase()))
						.map((contact) => contact.name[0].toUpperCase())
				)
			]
				.sort()
				.map((firstChar) => {
					let filteredContacts = phone.telephone.contacts.filter((contact) => contact.name[0].toLowerCase() === firstChar.toLowerCase());

					return (
						<Fragment key={firstChar}>
							<div className={style.letterBlock}>{firstChar}</div>
							{filteredContacts.map((contact) => (
								<div key={contact.name} className={style.contactBlock}>
									{contact.name}
								</div>
							))}
						</Fragment>
					);
				})}
		</div>
	);
};

const Recent: FC = () => {
	const telephone = useAppSelector((state) => state.phoneState.telephone);
	const [isAll, setIsAll] = useState(true);

	return (
		<div className={style.recent}>
			<div className={style.header}>
				<div className={style.wrapper}>
					<div className={style.selector}>
						<div onClick={() => setIsAll(true)} className={cls({ [style.btn]: isAll })}>
							Все
						</div>
						<div onClick={() => setIsAll(false)} className={cls({ [style.btn]: !isAll })}>
							Пропущ.
						</div>
					</div>
					<div className={style.edit}>Править</div>
				</div>
			</div>
			<div className={style.title}>Недавние</div>
			{telephone.recent
				.filter((x) => isAll || x.type === RecentType.missed)
				.map((recent) => (
					<div key={recent.id} className={style.recentItem}>
						<div className={cls({ [style.name]: true, [style.missed]: recent.type === RecentType.missed })}>
							{numberToName(recent.number)}
						</div>
						<div className={style.mobile}>сотовый</div>
					</div>
				))}
		</div>
	);
};

const Telephone: FC = () => {
	const phone = useAppSelector((state) => state.phoneState);
	const dispatch = useAppDispatch();

	useKeyboard(
		'esc',
		useCallback(() => {
			dispatch({ type: 'PHONE_APP_SET', app: 'Home' });
		}, [dispatch])
	);

	return (
		<div className={style.telephone}>
			{phone.telephone.page === 'call' ? <Call /> : phone.telephone.page === 'contacts' ? <Contacts /> : <Recent />}

			<div className={style.bottomPanel}>
				<div
					onClick={() => dispatch({ type: 'PHONE_TELEPHONE_PAGE_SET', page: 'recent' })}
					className={cls({ [style.bottomItem]: true, [style.isFocus]: phone.telephone.page === 'recent' })}
				>
					<RecentSvg />
					Недавние
				</div>
				<div
					onClick={() => dispatch({ type: 'PHONE_TELEPHONE_PAGE_SET', page: 'contacts' })}
					className={cls({ [style.bottomItem]: true, [style.isFocus]: phone.telephone.page === 'contacts' })}
				>
					<ContactsSvg />
					Контакты
				</div>
				<div
					onClick={() => dispatch({ type: 'PHONE_TELEPHONE_PAGE_SET', page: 'call' })}
					className={cls({ [style.bottomItem]: true, [style.isFocus]: phone.telephone.page === 'call' })}
				>
					<KeysSvg />
					Клавиши
				</div>
			</div>
		</div>
	);
};

export default Telephone;
