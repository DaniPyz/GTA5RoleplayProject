import { FC, useCallback, useEffect } from 'react';
import { client, server } from 'index';
import { useAppDispatch, useAppSelector, useKeyboard } from 'hooks';

import styles from './Temp.module.scss';
import { useSelector } from 'react-redux';

const Temp: FC = () => {
	const dispatch = useAppDispatch();
	const state = useAppSelector((state) => state.rootState);

	useKeyboard(
		'esc',
		useCallback(() => {
			// some date;
		}, [])
	);
	useKeyboard(
		'k',
		useCallback(() => {

			server.lspd.dragCuffedPlayer()
		}, [])
	);
	useKeyboard(
		'j',
		useCallback(() => {

			server.lspd.cuffPlayer()
		}, [])
	);


	useEffect(() => {
		// (async () => {
		// 	const ret = await client.temp.awdadw();
		// 	const ret2 = await server.faction.getUserdAWD();
		// 	const noRet = server.faction.getUser.noRet('awdawd');
		// })();
	});

	return <div className={styles.temp}></div>;
};

export default Temp;
