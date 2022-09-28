import { client, server } from 'index';
import { FC, useEffect } from 'react';

const Temp: FC = () => {
	useEffect(() => {
		const ret = client.temp.awdadw();

		const ret2 = server.faction.getUser('awdawd');

		const noRet = server.faction.getUser.noRet('awdawd');
	});

	return <div></div>;
};

export default Temp;
