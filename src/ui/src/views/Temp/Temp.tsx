import { useAppDispatch, useAppSelector, useKeyboard } from 'hooks';
import { client, server } from 'index';
import { FC, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styles from './Temp.module.scss';

const Temp: FC = () => {
	const dispatch = useAppDispatch();
	const state = useAppSelector((state) => state.rootState);

	useKeyboard(
		'esc',
		useCallback(() => {
			// some date;
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
