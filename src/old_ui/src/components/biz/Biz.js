import "./css.scss";
import BGLOGO from "./images/bgLogo.png";
import GRAPH from "./images/graph.svg";
import INFO from "./images/info.svg";
import LOGO from "./images/logo.png";
import React from "react";
import SHEST from "./images/shest.svg";
import ragemp from "../../_modules/ragemp";

export default function Biz() {
	const [toggle, setToggle] = React.useState(false);
	const [menu, setMenu] = React.useState("main");

	const [bizInfo, setBizInfo] = React.useState({
		bizType: "Магазин 24/7",
		bizId: 7,
		rentFee: 15000,
		bizFee: 15,
		bizBalance: 121000,
		bizAccountBalance: 1200,
		bizPrice: 100000,
		stats: {
			mon: 3450,
			tue: 23231,
			wed: 12312312,
			thu: 112312,
			fri: 12121,
			sun: 1231231,
			sut: 34123,
			btn: ["Снять деньги", "Обнулить статистику"],
		},
		settings: {
			products: 121000,
			feePaid: 2,
			bestGoods: "Картошко",
			visitors: 30,
			btn: ["Продать", "Снять деньги", "Пополнить продукты", "Пополнить баланс"],
		},

		btn: ["Продать", "Снять деньги", "Пополнить баланс"],
	});
	function numberWithSpaces(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
	}

	function click(id) {
		ragemp.send("ui::dialog", {
			id: id,
			type: menu,
		});
	}

	function changeCategory(item) {
		console.log("sadasd");
		ragemp.send("ui::menu:bizOpenMenu", {
			id: item,
		});
	}
	React.useMemo(() => {
		ragemp.eventCreate("client::biz", (cmd, data) => {
			// eslint-disable-next-line default-case
			switch (cmd) {
				case "dialog": {
					setBizInfo(data);
					break;
				}
				case "toggle": {
					setToggle(data.status);
					break;
				}
				case "changeMenu": {
					setMenu(data.type);
					break;
				}
			}
		});
	}, []);

	return (
		<>
			{menu === "main" ? (
				<div className="biz-dialog-info " style={!toggle ? { display: "none" } : {}}>
					<div className="dialog-header">
						<div className="header_left">
							<img className="logo" src={LOGO} alt="logo" />
							<span>
								<h1>
									NewY<span>o</span>rk
								</h1>
								<h2>STATE</h2>
							</span>
						</div>
						<div className="header_right">
							<p>
								{bizInfo.bizType} <span>#{bizInfo.bizId}</span>
							</p>
						</div>
					</div>
					<h1 className="dialog-title"></h1>
					<section className="dialog-body">
						{/* <h1>{bizInfo.propertyType} <span>#{bizInfo.propertyId}</span></h1> */}
						<div className="dialog-body-text">
							<p>
								Тип: <span>{bizInfo.bizType}</span>
							</p>
							<p>
								Аренда: <span>{numberWithSpaces(bizInfo.rentFee)}$</span>
							</p>
							<p>
								Налог: <span>{numberWithSpaces(bizInfo.bizFee)}%</span>
							</p>
							<p>
								Касса: <span>{numberWithSpaces(bizInfo.bizBalance)}$</span>
							</p>
							<p>
								Деньги на счету: <span>{numberWithSpaces(bizInfo.bizAccountBalance)}$</span>
							</p>
							<p>
								Стоймость: <span>{numberWithSpaces(bizInfo.bizPrice)}$</span>
							</p>
						</div>
						<div className="dialog-body-btn">
							<div
								onClick={() => {
									changeCategory("main");
								}}
								className={`${menu == "main" ? "active" : ""}`}
							>
								<img src={INFO} alt="info" />
							</div>
							<div
								onClick={() => {
									changeCategory("stats");
								}}
								className={`${menu == "stats" ? "active" : ""}`}
							>
								<img src={GRAPH} alt="graph" />
							</div>
							<div
								onClick={() => {
									changeCategory("settings");
								}}
								className={`${menu == "settings" ? "active" : ""}`}
							>
								<img src={SHEST} alt="shest" />
							</div>
						</div>
					</section>
					<section className="dialog-btn">
						{bizInfo.btn.map((item, i) => {
							return (
								<button onClick={() => click(i)} key={i} className={`btn`}>
									{item}
								</button>
							);
						})}
					</section>
					<div className="blip" />
					<img className="bgLogo" src={BGLOGO} alt="bglogo" />
				</div>
			) : menu === "stats" ? (
				<div className="biz-dialog-info stats" style={!toggle ? { display: "none" } : {}}>
					<div className="dialog-header">
						<div className="header_left">
							<img className="logo" src={LOGO} alt="logo" />
							<span>
								<h1>
									NewY<span>o</span>rk
								</h1>
								<h2>STATE</h2>
							</span>
						</div>
						<div className="header_right">
							<p>
								{bizInfo.bizType} <span>#{bizInfo.bizId}</span>
							</p>
						</div>
					</div>
					<h1 className="dialog-title"></h1>
					<section className="dialog-body">
						{/* <h1>{bizInfo.propertyType} <span>#{bizInfo.propertyId}</span></h1> */}
						<div className="dialog-body-text">
							<p>
								Понедельник: <span>{numberWithSpaces(bizInfo.stats.mon)}$</span>
							</p>
							<p>
								Вторник: <span>{numberWithSpaces(bizInfo.stats.tue)}$</span>
							</p>
							<p>
								Среда: <span>{numberWithSpaces(bizInfo.stats.wed)}$</span>
							</p>
							<p>
								Четверг: <span>{numberWithSpaces(bizInfo.stats.thu)}$</span>
							</p>
							<p>
								Пятница: <span>{numberWithSpaces(bizInfo.stats.fri)}$</span>
							</p>
							<p>
								Субота: <span>{numberWithSpaces(bizInfo.stats.sun)}$</span>
							</p>
							<p>
								Воскресенье: <span>{numberWithSpaces(bizInfo.stats.sut)}$</span>
							</p>
						</div>
						<div className="dialog-body-btn">
							<div
								onClick={() => {
									changeCategory("main");
								}}
								className={`${menu == "main" ? "active" : ""}`}
							>
								<img src={INFO} alt="info" />
							</div>
							<div
								onClick={() => {
									changeCategory("stats");
								}}
								className={`${menu == "stats" ? "active" : ""}`}
							>
								<img src={GRAPH} alt="graph" />
							</div>
							<div
								onClick={() => {
									changeCategory("settings");
								}}
								className={`${menu == "settings" ? "active" : ""}`}
							>
								<img src={SHEST} alt="shest" />
							</div>
						</div>
					</section>
					<section className="dialog-btn stats">
						{bizInfo.stats?.btn.map((item, i) => {
							return (
								<button onClick={() => click(i)} key={i} className={`btn`}>
									{item}
								</button>
							);
						})}
					</section>
					<div className="blip" />
					<img className="bgLogo" src={BGLOGO} alt="bglogo" />
				</div>
			) : (
				<div className="biz-dialog-info settings" style={!toggle ? { display: "none" } : {}}>
					<div className="dialog-header">
						<div className="header_left">
							<img className="logo" src={LOGO} alt="logo" />
							<span>
								<h1>
									NewY<span>o</span>rk
								</h1>
								<h2>STATE</h2>
							</span>
						</div>
						<div className="header_right">
							<p>
								{bizInfo.bizType} <span>#{bizInfo.bizId}</span>
							</p>
						</div>
					</div>
					<h1 className="dialog-title"></h1>
					<section className="dialog-body">
						{/* <h1>{bizInfo.propertyType} <span>#{bizInfo.propertyId}</span></h1> */}
						<div className="dialog-body-text">
							<p>
								ПРОДУКТОВ В МАГАЗИНЕ: <span>{numberWithSpaces(bizInfo.settings.products)}</span>
							</p>
							<p>
								БИЗНЕС ОПЛАЧЕН:{" "}
								<span>
									{numberWithSpaces(bizInfo.settings.feePaid)}{" "}
									{bizInfo.settings.feePaid === 0
										? "Дней"
										: bizInfo.settings.feePaid === 1
										? "День"
										: bizInfo.settings.feePaid === 2
										? "Дня"
										: "Дней"}
								</span>
							</p>
							<p>
								ДЕНЕГ В МАГАЗИНЕ: <span>{numberWithSpaces(bizInfo.bizBalance)}$</span>
							</p>
							<p>
								ХОДОВОЙ ТОВАР: <span>{numberWithSpaces(bizInfo.settings.bestGoods)}</span>
							</p>
							<p>
								ПОСЕТИТЕЛЕЙ СЕГОДНЯ: <span>{numberWithSpaces(bizInfo.settings.visitors)}</span>
							</p>
						</div>
						<div className="dialog-body-btn">
							<div
								onClick={() => {
									changeCategory("main");
								}}
								className={`${menu == "main" ? "active" : ""}`}
							>
								<img src={INFO} alt="info" />
							</div>
							<div
								onClick={() => {
									changeCategory("stats");
								}}
								className={`${menu == "stats" ? "active" : ""}`}
							>
								<img src={GRAPH} alt="graph" />
							</div>
							<div
								onClick={() => {
									changeCategory("settings");
								}}
								className={`${menu == "settings" ? "active" : ""}`}
							>
								<img src={SHEST} alt="shest" />
							</div>
						</div>
					</section>
					<section className="dialog-btn settings">
						{bizInfo.settings?.btn.map((item, i) => {
							return (
								<button onClick={() => click(i)} key={i} className={`btn`}>
									{item}
								</button>
							);
						})}
					</section>
					<div className="blip" />
					<img className="bgLogo" src={BGLOGO} alt="bglogo" />
				</div>
			)}
		</>
	);
}
