import { FC } from 'react';
import style from './Messages.module.scss';
import { ReactComponent as SearchSvg } from './icons/search.svg';
import { ReactComponent as AvatarSvg } from './icons/avatar.svg';
import cls from 'classnames';
import { useAppSelector } from 'hooks';

const Messages: FC = () => {
	const phone = useAppSelector((state) => state.phoneState);

	return (
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
					<div key={dialog.name} className={style.message}>
						<div className={style.avatar}>
							<div className={cls({ [style.isChecked]: true, [style.visible]: dialog.checked })} />
							<AvatarSvg />
						</div>
						<div className={style.content}>
							<div className={style.name}>{dialog.name}</div>
							<div className={style.text}>{dialog.messages.at(-1)?.text}</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default Messages;
