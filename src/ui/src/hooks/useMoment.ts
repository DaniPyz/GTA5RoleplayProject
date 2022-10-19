import moment from "moment";
import { useCallback, useEffect, useState } from "react";

interface IUseMomentProps {
	update: "s" | "m" | "h";
}

const useMoment = (props: IUseMomentProps) => {
	const makeMoment = useCallback(() => moment(), []);
	const [mom, setMom] = useState(makeMoment());

	useEffect(() => {
		const int = setInterval(
			() => {
				const currentMom = makeMoment();

				if (mom.seconds() !== currentMom.seconds()) {
					setMom(currentMom);
				}
			},
			props.update === "s" ? 100 : props.update === "m" ? 1000 : 5000
		);

		return () => clearInterval(int);
	}, [makeMoment, mom, props, setMom]);

	return mom;
};

export default useMoment;