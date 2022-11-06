import { FC } from 'react';
import style from './Messages.module.scss';
import { ReactComponent as SearchSvg } from './icons/search.svg';
import { ReactComponent as AvatarSvg } from './icons/avatar.svg';
import { ReactComponent as ArrowSvg } from './icons/arrow.svg';
import { ReactComponent as LeftArrowSvg } from './icons/leftArrow.svg';
import cls from 'classnames';
import { useAppDispatch, useAppSelector } from 'hooks';
import { useMasterSpring } from './Messages.spring';
import { animated } from 'react-spring';
import { numberToName } from '../Telephone/Telephone';
import moment from 'moment';

const Messages: FC = () => {
	const phone = useAppSelector((state) => state.phoneState);
	const System = useMasterSpring();
	const dispatch = useAppDispatch();

	const openedDialog = phone.dialogs.find((x) => x.number === phone.dialogOpen);

	return (
		<div className={style.wrapper}>
			<div className={style.messages}>
				<div className={style.topPanel}>
					Сообщения
					<div className={style.searchWrapper}>
						<SearchSvg />
						<input className={style.search} placeholder="Поиск" />
					</div>
				</div>

				<div className={style.messagesBlock}>
					{phone.dialogs.map((dialog) => (
						<div
							key={dialog.number}
							className={style.message}
							onClick={() => {
								dispatch({ type: 'PHONE_MESSAGES_DIALOG_SET', dialog: dialog.number });
								dispatch({ type: 'PHONE_MESSAGES_DIALOG_IS_OPENED_SET', value: true });
							}}
						>
							<div className={style.avatar}>
								<div className={cls({ [style.isChecked]: true, [style.visible]: dialog.checked })} />
								<AvatarSvg />
							</div>
							<div className={style.content}>
								<div className={style.name}>{numberToName(dialog.number)}</div>
								<div className={style.text}>{dialog.messages.at(-1)?.text}</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{System.dialogOpen(
				(styles, visible) =>
					visible &&
					openedDialog && (
						<animated.div style={styles} className={style.dialog}>
							<div className={style.back} onClick={() => dispatch({ type: 'PHONE_MESSAGES_DIALOG_IS_OPENED_SET', value: false })}>
								<LeftArrowSvg />
								<div className={style.newCount}>2</div>
							</div>
							<div className={style.header}>
								<div className={style.avatar}>
									<AvatarSvg />
								</div>
								<div className={style.number}>{numberToName(openedDialog.number)}</div>
							</div>
							<div className={style.messagesWrapper}>
								<div className={style.dialogMessages}>
									{openedDialog.messages.map((message) => (
										<div key={message.timestamp} className={style.message}>
											<div className={style.timestamp}>{moment(new Date(message.timestamp)).calendar()}</div>
											<div className={cls({ [style.messageText]: true, [style.isMy]: message.isMy })}>{message.text}</div>
										</div>
									))}
								</div>
								<div className={style.dialogInput}>
									<input placeholder='Введите сообщение...' />
									<div className={style.dialogSend}>
										<ArrowSvg />
									</div>
								</div>
							</div>
						</animated.div>
					)
			)}
		</div>
	);
};

export default Messages;
