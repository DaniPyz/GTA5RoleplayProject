import "./css.css";
import $ from "jquery";
import Choiceinput from "_modules/Choiceinput";
import IMG_FAQ from "./images/faq_img.png";
// import IMG_REPORTSEND from "./images/report-send.png";
import IMG_SKILLS from "./images/skills_img.png";
import IMG_SKILLS_CAR from "./images/skills/car.png";
import IMG_SKILLS_POWER from "./images/skills/power.png";
import IMG_SKILLS_RUN from "./images/skills/run.png";
import IMG_SKILLS_SHOOT from "./images/skills/shoot.png";
import IMG_STATS from "./images/stats_img.png";
import IMG_STATS_PROPERTY_IMG from "./images/stats_property_img.png";
import Rangeinput from "_modules/Rangeinput";
import React from "react";
import func from "_modules/func";
import ragemp from "_modules/ragemp";

export default function Menu() {
	const [toggle, setToggle] = React.useState(false);
	const [menu, setMenu] = React.useState("donate");

	const [statsData, setStatsData] = React.useState({
		level: [0, 0, 0],
		createDate: new Date(),
		vip: 0,
		gender: 0,
		married: "None",
		phone: 0,
		cash: [0, 0],
		job: "Отсутсвует",
		frac: "Отсутсвует",
		warns: 0,
		charName: "None None",
		userName: "None",
		userID: 0,

		property: [],
		// { type: 'house', id: 1, name: 'Дом #1', map: 'Где-то' }
	});

	const [donateCount, setDonateCount] = React.useState(0);

	const [skillsData, setSkillsData] = React.useState([]);
	const skillsNames = [
		{ name: "Вождение", img: IMG_SKILLS_CAR },
		{ name: "Стрельба", img: IMG_SKILLS_SHOOT },
		{ name: "Сила", img: IMG_SKILLS_POWER },
		{ name: "Выносливость", img: IMG_SKILLS_RUN },
	];

	const [faqData, setFAQData] = React.useState([
		{ name: "Заголовок", desc: "Какое-то описание" },
		{
			name: "Заголовок 2",
			desc: "Какое-то очень очень очень очень очень очень очень очень очень очень очень очень очень очень очень очень очень очень очень очень очень очень очень очень очень очень длинное описание",
		},
	]);
	const [faqSelect, setFAQSelect] = React.useState(-1);

	const [reportData, setReportData] = React.useState([
		{
			name: "Памогите пжлст",
			status: 0,
			date: new Date(),
			desc: "У меня украли машину, памагите!!!",
			messages: [
				{ name: "Nezuko Kamado", text: "У меня украли машину, памагите!!!", type: "player", date: new Date() },
				{ name: "Nezuko Kun", text: "Уже лечу вам памагать", type: "admin", date: new Date() },
			],
		},
		{
			name: "Памогите пжлст",
			status: 1,
			date: new Date(),
			desc: "У меня украли машину, памагите!!!",
			messages: [
				{ name: "Nezuko Kamado", text: "У меня украли машину, памагите!!!", type: "player", date: new Date() },
				{ name: "Nezuko Kun", text: "Уже лечу вам памагать", type: "admin", date: new Date() },
			],
		},
	]);
	const [reportSelect, setReportSelect] = React.useState(-1);
	const [createReport, setCreateReport] = React.useState(false);

	const [questsData, setQuestsData] = React.useState([
		{
			name: "Название квеста #1",
			desc: "Описание квеста",
			prize: "$650.000.000 и уникальный аксессуар",
			status: false,
			traking: true,
			tasks: [
				{ name: "Какая-то задача #1", count: [0, 15] },
				{ name: "Какая-то задача #2", count: [25, 25] },
				{ name: "Какая-то задача #3", count: [2, 32] },
				{ name: "Какая-то задача #4", count: [0, 1] },
			],
		},
		{
			name: "Название квеста #2",
			desc: "Описание квеста",
			prize: "360 Доната",
			status: true,
			traking: false,
			tasks: [{ name: "Какая-то задача #1", count: [1, 1] }],
		},
		{
			name: "Название квеста #3",
			desc: "Описание квеста",
			prize: "Чета",
			status: false,
			traking: false,
			tasks: [{ name: "Какая-то задача #1", count: [1, 2] }],
		},
	]);

	const [rewardsData, setRewardsData] = React.useState([
		{ name: "Название реварда", desc: "Описание реварда", prize: "$650.000.000", count: [10, 50] },
		{ name: "Название реварда #2", desc: "Описание реварда", prize: "350 Доната", count: [15, 25] },
		{
			name: "Название реварда #3",
			desc: "Описание реварда",
			prize: "250 доната, уникальный аксессуар и $650.000.000",
			count: [250, 250],
		},
	]);

	const [settingsData, setSettingsData] = React.useState({
		account: [
			{ name: "Сохранять авторизацию", desc: "Сохранять ник и пароль при авторизации", status: true },
			{ name: "Сохранять авторизацию", desc: "Сохранять ник и пароль при авторизации", status: true },
			{ name: "Сохранять авторизацию", desc: "Сохранять ник и пароль при авторизации", status: true },
		],
		interface: [
			{ name: "Показывать подсказки", desc: "Показывать подсказываемые клавиши в худе", status: true },
			{ name: "Включить худ", desc: "Показывать худ в игре", status: true },
			{ name: "Выбор чата", desc: "Показывать выбор чата при его открытии", status: true },
		],
		promo: {
			promo: "#NEZUKOKUN",
			players: 0,
			level: "0001",
			bonuse: [
				{ name: "Игровая валюта", count: 65000 },
				{ name: "Донат", count: 10 },
			],
		},
		crosshair: { type: "point", size: 5, height: 5, saveds: 3 },
		keys: [
			{ name: "Чат", desc: "Открыть чат", key: "T", keyCode: 18, id: "test" },
			{ name: "Подсказки", desc: "Скрыть/Показать подсказки", key: "J", keyCode: 18, id: "test" },
			{ name: "Меню", desc: "Открыть игровое меню", key: "M", keyCode: 18, id: "test" },
		],
	});
	const [settingsDataChangeKeys, setSettingsDataChangeKeys] = React.useState(-1);

	const [donateRoullete, setDonateRoulette] = React.useState({
		prizes: [
			{ name: "Lancer X", type: "legendary", img: "donate_car_1.png" },
			{ name: "1.000.000$", type: "medium", img: "donate_cash_1kk.png" },
			{ name: "100.000$", type: "low", img: "donate_cash_100k.png" },
			{ name: "5.825$", type: "standart", img: "donate_cash_0.png" },
		],
		roullete: [],
	});

	const [donateCashData, setDonateCashData] = React.useState([
		{ name: "Тестовый", desc: "Тестовый пак для всех тестов", cash: 1000000, price: 1, img: "donate_cash_1kk.png" },
	]);
	const [donateCarsData, setDonateCarsData] = React.useState([
		{ name: "Mitsubishi Lancer X", desc: "Самая крутая тачка всех времен и народов", price: 1500, img: "donate_car_1.png" },
	]);
	const [donateVipData, setDonateVipData] = React.useState([
		{
			name: "Bronze",
			desc: "Самая минимальная випка",
			price: 150,
			img: "donate_vip_1.png",
			tasks: [
				["Наличные", "$65.000"],
				["Донат", "350"],
			],
		},
	]);

	function openMenu(item) {
		ragemp.send("ui::menu:openMenu", {
			id: item,
		});
	}

	function closeReport(id) {
		ragemp.send("ui::menu:closeReport", {
			id: reportData[id].id,
		});
	}
	function sendReport(id, pressed) {
		if (pressed && pressed.key !== "Enter") return;

		ragemp.send("ui::menu:sendReportMessage", {
			id: reportData[id].id,
			message: $("#menu-report-body-input").val(),
		});
		$("#menu-report-body-input").val("");
	}
	function createReportSend(pressed) {
		if (pressed && pressed.key !== "Enter") return;

		ragemp.send("ui::menu:createReport", {
			message: $("#menu-report-create").val(),
		});

		$("#menu-report-create").val("");
		setCreateReport(false);
	}

	function trackQuest(id) {
		ragemp.send("ui::menu:trackQuest", {
			id: questsData[id].id,
		});
	}
	function compilQuest(id) {
		ragemp.send("ui::menu:compilQuest", {
			id: questsData[id].id,
		});
	}

	let settingsDataChangeKeysHandl = [
		[-1, ""],
		[-1, ""],
	];

	function settingsKeysEventDown(event) {
		const keys = parseInt($("#menu-settings-keys").attr("data-id"));

		if (keys === -1) return;
		if (event.key === "F11" || event.key === "F1") return;

		if (settingsDataChangeKeysHandl[0][0] !== -1) settingsDataChangeKeysHandl[1] = [event.keyCode, event.key];
		else settingsDataChangeKeysHandl[0] = [event.keyCode, event.key];
	}
	function settingsKeysEventUp(event) {
		const keys = parseInt($("#menu-settings-keys").attr("data-id"));
		if (keys === -1) return;

		let tempData = JSON.parse($("#menu-settings-keys").attr("data-keys"));
		if (settingsDataChangeKeysHandl[1][0] !== -1) {
			tempData[keys].key = settingsDataChangeKeysHandl[0][1].toUpperCase() + " + " + settingsDataChangeKeysHandl[1][1].toUpperCase();
			tempData[keys].keyCode = [settingsDataChangeKeysHandl[0][0], settingsDataChangeKeysHandl[1][0]];
		} else {
			tempData[keys].key = settingsDataChangeKeysHandl[0][1].toUpperCase();
			tempData[keys].keyCode = settingsDataChangeKeysHandl[0][0];
		}

		setSettingsData({ ...settingsData, keys: tempData });
		ragemp.send("ui::menu:updateKeys", {
			key: tempData[keys].id,
			keyCode: tempData[keys].keyCode,
			keyName: tempData[keys].key,
		});

		setSettingsDataChangeKeys(-1);
		settingsDataChangeKeysHandl = [
			[-1, ""],
			[-1, ""],
		];
	}

	function donateBuyCash(id) {
		ragemp.send("ui::menu:donate:buyCash", {
			id: id,
		});
	}
	function donateCarsBuy(id) {}
	function donateVipBuy(id) {}

	React.useMemo(() => {
		$(document).on("keydown", settingsKeysEventDown);
		$(document).on("keyup", settingsKeysEventUp);

		ragemp.eventCreate("client::menu", (cmd, data) => {
			switch (cmd) {
				case "toggle": {
					setToggle(data.status);
					break;
				}
				case "updateReports": {
					setReportData(data);
					break;
				}
				case "setDonateCount": {
					setDonateCount(data.count);
					break;
				}
				case "roulleteGo": {
					openRoullete(data.fast);
					break;
				}
				case "openMenu": {
					switch (data.id) {
						case "stats": {
							setStatsData(data.data);
							break;
						}
						case "skills": {
							setSkillsData(data.data);
							break;
						}
						case "faq": {
							setFAQData(data.data);
							break;
						}
						case "report": {
							setReportData(data.data);
							break;
						}
						case "quests": {
							setQuestsData(data.data);
							break;
						}
						case "rewards": {
							setRewardsData(data.data);
							break;
						}
						case "settings": {
							setSettingsData({ ...settingsData, account: data.data });
							break;
						}
						case "settings-interface": {
							setSettingsData({ ...settingsData, interface: data.data });
							break;
						}
						case "settings-promo": {
							setSettingsData({ ...settingsData, promo: data.data });
							break;
						}
						case "settings-crosshair": {
							setSettingsData({ ...settingsData, crosshair: data.data });
							break;
						}
						case "settings-keys": {
							setSettingsData({ ...settingsData, keys: data.data });
							break;
						}
						case "donate": {
							setDonateRoulette(data.data);
							$("#menu-donate-roullete-section")[0].scrollLeft = 0;

							break;
						}
						case "donate-cash": {
							setDonateCashData(data.data);
							break;
						}
						case "donate-cars": {
							setDonateCarsData(data.data);
							break;
						}
						case "donate-vip": {
							setDonateVipData(data.data);
							break;
						}
						default: {
							break;
						}
					}

					setMenu(data.id);
					break;
				}
				default: {
					break;
				}
			}
		});
	}, []);

	if (settingsData.promo.promo.length) $("#menu-settings-promo").attr("disabled", "");

	function openRoullete(fast = false) {
		$("#menu-donate-roullete-section")[0].scrollLeft = 0;
		$(".menu-donate-roulette-item-anim").removeClass("menu-donate-roulette-item-anim-stop");

		const rand = func.random(30, 200);
		// ragemp.send('ui::menu:roullete:givePrize', {
		//     id: rand
		// })

		$("#menu-donate-roullete-section").animate(
			{
				scrollLeft:
					$(`.menu-donate-roulette-item-anim[data-id='${rand}']`).position().left -
					$("#menu-donate-roullete-section")[0].clientWidth / 2 +
					$(`.menu-donate-roulette-item-anim[data-id='${rand}']`)[0].clientWidth / 2 +
					6,
			},
			!fast ? 15000 : 0,
			() => {
				$(`.menu-donate-roulette-item-anim[data-id='${rand}']`).addClass("menu-donate-roulette-item-anim-stop");
				ragemp.send("ui::menu:roullete:stop", {
					id: rand,
				});
			}
		);
	}

	// function updateRoullete()
	// {
	//     const tempRoullete = []
	//     const types = {
	//         standart: [],
	//         low: [],
	//         medium: [],
	//         legendary: []
	//     }
	//
	//     donateRoullete.prizes.map((item, i) =>
	//     {
	//         if(item.type === 'legendary') types.legendary.push(item)
	//         else if(item.type === 'medium') types.medium.push(item)
	//         else if(item.type === 'low') types.low.push(item)
	//         else if(item.type === 'standart') types.standart.push(item)
	//     })
	//
	//     for(var i = 0; i < 200; i ++)
	//     {
	//         let prox = func.random(0, 100)
	//
	//         if(prox >= 0 && prox <= 5) tempRoullete.push(types.legendary[func.random(0, types.legendary.length - 1)])
	//         else if(prox > 5 && prox <= 20) tempRoullete.push(types.medium[func.random(0, types.medium.length - 1)])
	//         else if(prox > 20 && prox <= 50) tempRoullete.push(types.low[func.random(0, types.low.length - 1)])
	//         else if(prox > 50) tempRoullete.push(types.standart[func.random(0, types.standart.length - 1)])
	//     }
	//
	//     setDonateRoulette({...donateRoullete, roullete: tempRoullete })
	// }

	return (
		<div className="menu" style={toggle === false ? { display: "none" } : {}}>
			<header>
				<section className="menu-header-title">
					<h1>Меню персонажа</h1>
					<span>Вся информация об Вашем персонаже в одном месте</span>
				</section>
				<section className="menu-header-nav">
					<div>
						<button onClick={() => openMenu("stats")} className={`btn-ui ${menu === "stats" && "btn-ui-select"}`}>
							Статистика
						</button>
						<button onClick={() => openMenu("skills")} className={`btn-ui ${menu === "skills" && "btn-ui-select"}`}>
							Навыки
						</button>
						<button onClick={() => openMenu("donate")} className={`btn-ui ${menu.indexOf("donate") !== -1 && "btn-ui-select"}`}>
							Магазин
						</button>
						<button
							onClick={() => openMenu("faq")}
							className={`btn-ui ${menu === "faq" || menu === "report" ? "btn-ui-select" : ""}`}
						>
							FAQ
						</button>
						<button onClick={() => openMenu("rewards")} className={`btn-ui ${menu === "rewards" && "btn-ui-select"}`}>
							Достижения
						</button>
						<button
							onClick={() => openMenu("settings")}
							className={`btn-ui ${menu.indexOf("settings") !== -1 && "btn-ui-select"}`}
						>
							Настройки
						</button>
						<button onClick={() => openMenu("quests")} className={`btn-ui ${menu === "quests" && "btn-ui-select"}`}>
							Квесты
						</button>
					</div>
					<div className="menu-header-nav-two" style={menu !== "faq" && menu !== "report" ? { display: "none" } : {}}>
						<button onClick={() => openMenu("report")} className={`btn-ui ${menu === "report" && "btn-ui-select"}`}>
							Репорт
						</button>
						<button
							onClick={() => {
								setCreateReport(true);
								openMenu("report");
							}}
							className={`btn-ui`}
							style={{ width: "auto", "clip-path": "polygon(0% 0%, 92% 0%, 100% 100%, 8% 100%)" }}
						>
							Написать новый репорт
						</button>
					</div>
					<div className="menu-header-nav-two" style={menu.indexOf("settings") === -1 ? { display: "none" } : {}}>
						<button onClick={() => openMenu("settings")} className={`btn-ui ${menu === "settings" && "btn-ui-select"}`}>
							Аккаунт
						</button>
						<button
							onClick={() => openMenu("settings-email")}
							className={`btn-ui ${menu === "settings-email" && "btn-ui-select"}`}
						>
							Эл. почта
						</button>
						<button
							onClick={() => openMenu("settings-interface")}
							className={`btn-ui ${menu === "settings-interface" && "btn-ui-select"}`}
						>
							Интерфейс
						</button>
						<button
							onClick={() => openMenu("settings-promo")}
							className={`btn-ui ${menu === "settings-promo" && "btn-ui-select"}`}
						>
							Партнерство
						</button>
						<button onClick={() => openMenu("settings-aim")} className={`btn-ui ${menu === "settings-aim" && "btn-ui-select"}`}>
							Прицел
						</button>
						<button
							onClick={() => openMenu("settings-chat")}
							className={`btn-ui ${menu === "settings-chat" && "btn-ui-select"}`}
						>
							Чат
						</button>
						<button
							onClick={() => openMenu("settings-keys")}
							className={`btn-ui ${menu === "settings-keys" && "btn-ui-select"}`}
						>
							Клавиши
						</button>
					</div>
					<div className="menu-header-nav-two" style={menu.indexOf("donate") === -1 ? { display: "none" } : {}}>
						<button onClick={() => openMenu("donate")} className={`btn-ui ${menu === "donate" && "btn-ui-select"}`}>
							Рулетка
						</button>
						<button onClick={() => openMenu("donate-cash")} className={`btn-ui ${menu === "donate-cash" && "btn-ui-select"}`}>
							Валюта
						</button>
						<button onClick={() => openMenu("donate-cars")} className={`btn-ui ${menu === "donate-cars" && "btn-ui-select"}`}>
							Транспорт
						</button>
						<button onClick={() => openMenu("donate-vip")} className={`btn-ui ${menu === "donate-vip" && "btn-ui-select"}`}>
							Вип
						</button>
						<button onClick={() => openMenu("donate-other")} className={`btn-ui ${menu === "donate-other" && "btn-ui-select"}`}>
							Остальное
						</button>
					</div>
				</section>
			</header>
			<section className="menu-body">
				<section className="menu-wrap menu-stats" style={menu !== "stats" ? { display: "none" } : {}}>
					<div className="menu-img">
						<img alt="" src={IMG_STATS} />
					</div>
					<div className="menu-section">
						<div className="menu-stats-body">
							<div>
								<h1>Имя Фамилия</h1>
								<h2>{statsData.charName}</h2>
							</div>
							<div>
								<h1>Аккаунт</h1>
								<h2>
									{statsData.userName} [{statsData.userID}]
								</h2>
							</div>
							<div>
								<h1>Игровой уровень</h1>
								<h2>
									{statsData.level[0]} LVL [ {statsData.level[1]}/{statsData.level[2]} EXP ]
								</h2>
							</div>
							<div>
								<h1>Дата создания персонажа</h1>
								<h2>{new Date(statsData.createDate).toLocaleString("ru-RU")}</h2>
							</div>
							<div>
								<h1>Количество GC</h1>
								<h2>{donateCount.toLocaleString()}</h2>
							</div>
							<div>
								<h1>Vip-Status</h1>
								<h2>{statsData.vip === 0 ? "Отсутсвует" : `${statsData.vip} уровня`}</h2>
							</div>
							<div>
								<h1>Пол</h1>
								<h2>{statsData.gender === 0 ? "Мужской" : "Женский"}</h2>
							</div>
							<div>
								<h1>Семейное положение</h1>
								<h2>
									{statsData.married === "None"
										? `Не ${statsData.gender === 0 ? "женат" : "замужем"}`
										: `${statsData.gender === 0 ? "Женат" : "Замужем"} на ${statsData.married}`}
								</h2>
							</div>
							<div>
								<h1>Номер телефона</h1>
								<h2>{statsData.phone === 0 ? "Не имеется" : statsData.phone.toLocaleString()}</h2>
							</div>
							<div>
								<h1>Наличные деньги</h1>
								<h2>$ {statsData.cash[0].toLocaleString("en-US")}</h2>
							</div>
							<div>
								<h1>Деньги в банке</h1>
								<h2>$ {statsData.cash[1].toLocaleString("en-US")}</h2>
							</div>
							<div>
								<h1>Работа</h1>
								<h2>{statsData.job}</h2>
							</div>
							<div>
								<h1>Организация</h1>
								<h2>{statsData.frac}</h2>
							</div>
							<div>
								<h1>Предупреждения</h1>
								<h2>{statsData.warns}/3</h2>
							</div>
						</div>
						<div className="menu-stats-body menu-stats-property">
							<h1 className="menu-stats-property-title btn-ui btn-ui-select">Имущество</h1>
							<img alt="" className="menu-stats-property-title-img" src={IMG_STATS_PROPERTY_IMG} />

							<section className="menu-stats-property-wrap">
								{statsData.property.map((item, i) => {
									return (
										<div className={`menu-stats-property-${item.type}`}>
											<h2>
												{item.type === "house"
													? "Жилье"
													: item.type === "vehicle"
													? "Транспорт $" + item.id
													: "Бизнес"}
												<span>{item.name}</span>
											</h2>
											<h2>
												{item.type === "house" || item.type === "biz" ? "Адрес" : "Статус"}
												<span>{item.map}</span>
											</h2>
										</div>
									);
								})}
							</section>
						</div>
					</div>
				</section>
				<section className="menu-wrap menu-skills" style={menu !== "skills" ? { display: "none" } : {}}>
					<div className="menu-img">
						<img alt="" src={IMG_SKILLS} />
					</div>
					<div className="menu-section">
						{skillsNames.map((item, i) => {
							return (
								<div key={i} className="menu-skills-item">
									<section className="menu-skills-item-img">
										<img alt="" src={item.img} />
									</section>
									<section className="menu-skills-item-body">
										<h1>Название навыка</h1>
										<h2>{item.name}</h2>
										<div className="menu-skills-item-bottom">
											<span>{skillsData[i]}/100%</span>
											<div>
												<div style={{ width: `${skillsData[i]}%` }}></div>
											</div>
										</div>
									</section>
								</div>
							);
						})}
					</div>
				</section>
				<section className="menu-wrap menu-faq" style={menu !== "faq" ? { display: "none" } : {}}>
					<div className="menu-section">
						<section className="menu-faq-themes">
							{faqData.map((item, i) => {
								return (
									<div onClick={() => setFAQSelect(i)} key={i} className={faqSelect === i && "menu-faq-themes-select"}>
										<section>
											<h1>{item.name}</h1>
											<span>
												{item.desc.substring(0, 58)}
												{item.desc.length > 58 ? "..." : ""}
											</span>
										</section>
										<button></button>
									</div>
								);
							})}
						</section>
						<section className="menu-faq-body">
							<div className="menu-faq-body-info" style={faqSelect === -1 ? { display: "none" } : {}}>
								<h1>{faqSelect !== -1 && faqData[faqSelect].name}</h1>
								<span>{faqSelect !== -1 && faqData[faqSelect].desc}</span>
							</div>
							<div className="menu-faq-body-report" style={faqSelect === -1 ? { display: "none" } : {}}>
								<div>
									<h1>Не нашли ответ?</h1>
									<span>Обратитесь к администрации нашего прекрасного проекта!</span>
								</div>
								<div>
									<button onClick={() => openMenu("report")} className="btn">
										Написать админу
									</button>
									<img alt="" src={IMG_FAQ} />
								</div>
							</div>
						</section>
					</div>
				</section>
				<section className="menu-wrap menu-faq menu-report" style={menu !== "report" ? { display: "none" } : {}}>
					<div className="menu-section">
						<section className="menu-faq-themes">
							{reportData.map((item, i) => {
								return (
									<div
										onClick={() => setReportSelect(i)}
										key={i}
										className={reportSelect === i && "menu-faq-themes-select"}
									>
										<section>
											<h1>
												{item.name} <h2>{new Date(item.date).toLocaleString("ru-RU")}</h2>
											</h1>
											<h2 style={{ "margin-bottom": "7px" }}>
												<span
													className={
														item.status === 0
															? "menu-report-themes-open"
															: item.status === 1
															? "menu-report-themes-wait"
															: ""
													}
												>
													{item.status === 0 ? "Открыт" : item.status === 1 ? "На рассмотрении" : "Закрыт"}
												</span>
											</h2>
											<span>
												{item.desc.substring(0, 58)}
												{item.desc.length > 58 && "..."}
											</span>
										</section>
										<button></button>
									</div>
								);
							})}
						</section>
						<div className="menu-report-wrap">
							<section className="menu-faq-body" style={reportSelect === -1 ? { display: "none" } : {}}>
								<div className="menu-report-body-info-title">
									<h1>
										{reportSelect !== -1 && reportData[reportSelect].name}
										<h2>{reportSelect !== -1 && new Date(reportData[reportSelect].date).toLocaleString("ru-RU")}</h2>
									</h1>
									<span>{reportSelect !== -1 && reportData[reportSelect].desc}</span>
								</div>
								<div className="menu-report-body-chat">
									{reportSelect !== -1 &&
										reportData[reportSelect].messages.map((item, i) => {
											return (
												<section key={i} className={item.type === "player" && "menu-report-body-chat-reverse"}>
													<h2>{item.type === "player" ? "Вы" : "Администратор"}</h2>
													<h1>{item.name}</h1>
													<h3>{item.text}</h3>
													<h4>
														{new Date(item.date).toLocaleString("ru-RU", {
															hour: "numeric",
															minute: "numeric",
														})}
													</h4>
												</section>
											);
										})}
								</div>
								<div
									className="menu-report-body-input"
									style={reportSelect !== -1 && reportData[reportSelect].status === 2 ? { display: "none" } : {}}
								>
									<input
										onKeyDown={(e) => sendReport(reportSelect, e)}
										id="menu-report-body-input"
										type="text"
										placeholder="Введите Ваше сообщение..."
										className="input"
									/>
									<button onClick={() => closeReport(reportSelect)} className="btn">
										Моя проблема решена
									</button>
									<button onClick={() => sendReport(reportSelect)} className="btn btn-select">
										►
									</button>
								</div>
							</section>
						</div>
					</div>
					<div className="menu-report-create" style={createReport === false ? { display: "none" } : {}}>
						<div className="menu-report-create-wrap">
							<h1>
								Написать в репорт <button onClick={() => setCreateReport(false)}>✖</button>
							</h1>
							<section>
								<center>Перед подачей репорта внимательно ознакомьтесь с правилами!</center>
								<br />
								При подаче репорта запрещено:
								<ul>
									<li>Нецензурно выражаться</li>
									<li>Оскорблять кого-либо</li>
									<li>Нецензурно выражаться</li>
									<li>Нецензурно выражаться</li>
									<li>Нецензурно выражаться</li>
									<li>Нецензурно выражаться</li>
									<li>Нецензурно выражаться</li>
								</ul>
								<br />
								<br />
								<br />
								<center style={{ color: "#ED4343" }}>
									Помните! Администрация никогда не попросит у Вас Ваших личных данных, паролей от аккаунтов и пр.
								</center>
							</section>
							<input
								onKeyDown={(e) => createReportSend(e)}
								id="menu-report-create"
								type="text"
								placeholder="Введите Ваше сообщение..."
								className="input"
							/>
							<div className="menu-report-create-btn">
								<button onClick={() => createReportSend()} className="btn">
									Отправить
								</button>
							</div>
						</div>
					</div>
				</section>
				<section className="menu-wrap menu-quests" style={menu !== "quests" ? { display: "none" } : {}}>
					<div className="menu-quests-wrap">
						{questsData.map((item, i) => {
							return (
								<div key={i} className="menu-quests-item">
									<div className="menu-quests-item-title">
										<h1 className={item.traking === true && "menu-quests-item-traking"}>
											<h3 onClick={() => trackQuest(i)}>★</h3> {item.name}
										</h1>
										<span>{item.desc}</span>
										<h2>
											Награда: <span>{item.prize}</span>
										</h2>
									</div>
									<div className="menu-quests-item-tasks">
										{item.tasks.map((tasks, task) => {
											return (
												<div key={task}>
													<h1>{tasks.name}</h1>
													<h2 className={tasks.count[0] >= tasks.count[1] && "menu-quests-item-tasks-yes"}>
														{tasks.count[0] >= tasks.count[1]
															? "Выполненно"
															: `${tasks.count[0]} / ${tasks.count[1]}`}
													</h2>
												</div>
											);
										})}
									</div>
									<button onClick={() => compilQuest(i)} className={`btn ${item.status === true && "btn-select"}`}>
										Забрать награду
									</button>
								</div>
							);
						})}
					</div>
				</section>
				<section className="menu-wrap menu-quests menu-rewards" style={menu !== "rewards" ? { display: "none" } : {}}>
					<div className="menu-quests-wrap">
						{rewardsData.map((item, i) => {
							const prox = (126 / 100) * ((100 / item.count[1]) * item.count[0]);

							return (
								<div key={i} className="menu-quests-item menu-quests-item-s">
									<div className="menu-quests-item-title">
										<h1 className="menu-quests-item-traking">
											<h3>★</h3> {item.name}
										</h1>
										<span>{item.desc}</span>
										<h2>
											Награда: <span>{item.prize}</span>
										</h2>
									</div>
									<button>
										<svg viewBox="0 0 50 50">
											<circle
												cx="25"
												cy="25"
												r="20"
												fill="none"
												stroke-width="2"
												style={{ "stroke-dashoffset": -126 + prox }}
											></circle>
										</svg>
										<h1>
											{item.count[0]} <span>/</span> {item.count[1]}
										</h1>
									</button>
								</div>
							);
						})}
					</div>
				</section>
				<section className="menu-wrap menu-quests menu-settings" style={menu !== "settings" ? { display: "none" } : {}}>
					<div className="menu-quests-wrap">
						{settingsData.account.map((item, i) => {
							return (
								<div key={i} className="menu-quests-item menu-quests-item-s">
									<h1>
										{item.name}
										<h2>{item.desc}</h2>
									</h1>
									<section>
										<button
											onClick={() => {
												let tempData = settingsData.account;
												tempData[i].status = true;
												setSettingsData({ ...settingsData, account: tempData });
												ragemp.send("ui::menu:updateSettings", tempData);
											}}
											className={`btn btn-visual ${item.status === true && "btn-select"}`}
										>
											Да
										</button>
										<button
											onClick={() => {
												let tempData = settingsData.account;
												tempData[i].status = false;
												setSettingsData({ ...settingsData, account: tempData });
												ragemp.send("ui::menu:updateSettings", tempData);
											}}
											className={`btn btn-visual btn-visual-reverse ${item.status === false && "btn-select"}`}
										>
											Нет
										</button>
									</section>
								</div>
							);
						})}
					</div>
				</section>
				<section className="menu-wrap menu-quests menu-settings" style={menu !== "settings-interface" ? { display: "none" } : {}}>
					<div className="menu-quests-wrap">
						{settingsData.interface.map((item, i) => {
							return (
								<div key={i} className="menu-quests-item menu-quests-item-s">
									<h1>
										{item.name}
										<h2>{item.desc}</h2>
									</h1>
									<section>
										<button
											onClick={() => {
												let tempData = settingsData.interface;
												tempData[i].status = true;
												setSettingsData({ ...settingsData, interface: tempData });
												ragemp.send("ui::menu:updateSettings", tempData);
											}}
											className={`btn btn-visual ${item.status === true && "btn-select"}`}
										>
											Да
										</button>
										<button
											onClick={() => {
												let tempData = settingsData.interface;
												tempData[i].status = false;
												setSettingsData({ ...settingsData, interface: tempData });
												ragemp.send("ui::menu:updateSettings", tempData);
											}}
											className={`btn btn-visual btn-visual-reverse ${item.status === false && "btn-select"}`}
										>
											Нет
										</button>
									</section>
								</div>
							);
						})}
					</div>
				</section>
				<section
					className="menu-wrap menu-quests menu-settings"
					id="menu-settings-keys"
					data-keys={JSON.stringify(settingsData.keys)}
					data-id={settingsDataChangeKeys}
					style={menu !== "settings-keys" ? { display: "none" } : {}}
				>
					<div className="menu-quests-wrap">
						{settingsData.keys.map((item, i) => {
							return (
								<div key={i} className="menu-quests-item menu-quests-item-s menu-settings-item-key">
									<h1>
										{item.name}
										<h2>{item.desc}</h2>
									</h1>
									<section>
										<button
											onClick={() => {
												setSettingsDataChangeKeys(settingsDataChangeKeys === i ? -1 : i);
											}}
											className={`btn btn-visual btn-visual-reverse ${settingsDataChangeKeys === i && "btn-select"}`}
										>
											{settingsDataChangeKeys === i ? "Нажмите на клавишу" : item.key}
										</button>
									</section>
								</div>
							);
						})}
					</div>
				</section>
				<section className="menu-wrap menu-quests menu-settings-promo" style={menu !== "settings-promo" ? { display: "none" } : {}}>
					<div className="menu-quests-item menu-quests-item-s">
						<h3>Партнерская программа</h3>
						<h2>
							Приглашено людей: <span>{settingsData.promo.players} человека</span>
						</h2>
						<div className="menu-settings-promo-input">
							<input id="menu-settings-promo" maxlength="13" className="input" placeholder="Ваш промокод" />
							<label>{settingsData.promo.promo}</label>
						</div>
						<button className="btn btn-select">{!settingsData.promo.promo.length ? "Создать" : "Скопировать"}</button>
					</div>
					<div className="menu-quests-item" style={!settingsData.promo.promo.length ? { display: "none" } : {}}>
						<h3>Уровень промокода</h3>
						<div className="menu-settings-promo-lvl">
							{Array.from(settingsData.promo.level).map((item, i) => {
								return <button key={i}>{item}</button>;
							})}
						</div>
						<div className="menu-quests-item-tasks">
							{settingsData.promo.bonuse.map((item, i) => {
								return (
									<div key={i}>
										<h1>Что дает промо</h1>
										<h2>{item.name + " " + item.count.toLocaleString()}</h2>
									</div>
								);
							})}
						</div>
					</div>
				</section>
				<section
					className="menu-wrap menu-quests menu-settings-promo menu-settings-aim"
					style={menu !== "settings-aim" ? { display: "none" } : {}}
				>
					<div className="menu-quests-wrap">
						<div className="menu-quests-item menu-quests-item-s">
							<h3>Прицел</h3>
							<div
								className="menu-settings-aim-body menu-settings-aim-body-point"
								style={settingsData.crosshair.type !== "point" ? { display: "none" } : {}}
							>
								<button
									style={{ width: settingsData.crosshair.size + "px", height: settingsData.crosshair.size + "px" }}
								></button>
							</div>
							<div
								className="menu-settings-aim-body menu-settings-aim-body-standart"
								style={settingsData.crosshair.type !== "standart" ? { display: "none" } : {}}
							>
								<button></button>
								<button></button>
								<button></button>
								<button></button>
							</div>
							<div className="menu-settings-aim-param">
								<h1>Тип прицела</h1>
								<h2>Выберите самый подходящий Вам прицел</h2>
								<Choiceinput
									data={{
										select: settingsData.crosshair.type === "standart" ? 0 : 1,
										params: ["Стандартный", "Точка"],
										onChange: (value) =>
											setSettingsData({
												...settingsData,
												crosshair: { ...settingsData.crosshair, type: value === 0 ? "standart" : "point" },
											}),
									}}
								/>
							</div>
							<div className="menu-settings-aim-param">
								<h1>Выбрать сохраненный прицел</h1>
								<h2>Уже создавали прицелы? Загрузите их!</h2>
								<Choiceinput data={{ select: 0, params: ["Прицел 1", "Прицел 2", "Прицел 3"] }} />
							</div>
							<h2 style={{ "margin-top": "30px" }}>
								Только истинный гетто-тащер сможет подобрать для себя крутой прицел, а ты - гетто тащер?
							</h2>
						</div>
						<div className="menu-quests-item menu-quests-item-s">
							<h3>Настройки прицела</h3>
							<div className="menu-settings-aim-param">
								<h1>Размер прицела</h1>
								<h2>Настройте для себя, на сколько большой прицел будет у Вас на экране</h2>
								<input
									className="input-range input-range-visual"
									min="2"
									max="15"
									type="range"
									value={settingsData.crosshair.size}
									onChange={(e) =>
										setSettingsData({ ...settingsData, crosshair: { ...settingsData.crosshair, size: e.target.value } })
									}
								/>
							</div>
							<div
								className="menu-settings-aim-param"
								style={settingsData.crosshair.type !== "standart" ? { display: "none" } : {}}
							>
								<h1>Ширина прицела</h1>
								<h2>Чем шире прицел, тем лучше стрелять. Так ведь?</h2>
								<input
									className="input-range input-range-visual"
									min="0"
									max="10"
									type="range"
									value={settingsData.crosshair.height}
									onChange={(e) =>
										setSettingsData({
											...settingsData,
											crosshair: { ...settingsData.crosshair, height: e.target.value },
										})
									}
								/>
							</div>
							<div className="menu-settings-aim-param">
								<h1>Сохраненные прицелы</h1>
								<h2>Сохраните свой уникальный прицел, чтобы потом его изменить</h2>
								<Choiceinput data={{ select: 0, params: ["Прицел 1", "Прицел 2", "Прицел 3"] }} />
							</div>
							<button className="btn btn-select">Сохранить</button>
						</div>
					</div>
				</section>

				<section className="menu-wrap menu-donate" style={menu !== "donate" ? { display: "none" } : {}}>
					<div className="menu-donate-roulette">
						<div className="menu-donate-roulette-tick">▼</div>
						<div className="menu-donate-roulette-tick menu-donate-roulette-tick-down">▲</div>
						<section id="menu-donate-roullete-section">
							{donateRoullete.roullete.map((item, i) => {
								return (
									<div key={i} className="menu-donate-roulette-item menu-donate-roulette-item-anim" data-id={i}>
										<img alt="" src={require(`./images/roulette/${item.img}`)} />
										<h1>{item.name}</h1>
										<h2 className={`menu-donate-roulette-item-type-${item.type}`}>{item.type}</h2>
									</div>
								);
							})}
						</section>
						<div className="menu-donate-roulette-down">
							<button onClick={() => ragemp.send("ui::menu:roullete:go", { fast: true })} className="btn btn-visual">
								Открыть быстро
							</button>
							<button onClick={() => ragemp.send("ui::menu:roullete:go", { fast: false })} className="btn btn-select">
								Крутить
							</button>
							<button className="btn btn-visual btn-visual-reverse">350 GC</button>
							<h5 className="menu-donate-value">
								Ваше количество GC: <span>{donateCount.toLocaleString()}</span>
							</h5>
						</div>
					</div>
					<div className="menu-donate-roulette-prizes">
						<h3>
							Содержимое
							<span>Рулетки</span>
						</h3>
						<section>
							{donateRoullete.prizes.map((item, i) => {
								return (
									<div key={i} className="menu-donate-roulette-item">
										<img alt="" src={require(`./images/roulette/${item.img}`)} />
										<h1>{item.name}</h1>
										<h2 className={`menu-donate-roulette-item-type-${item.type}`}>{item.type}</h2>
									</div>
								);
							})}
						</section>
					</div>
				</section>

				<section
					className="menu-wrap menu-quests menu-donate menu-donate-cash"
					style={menu !== "donate-cash" ? { display: "none" } : {}}
				>
					<div className="menu-quests-wrap">
						{donateCashData.map((item, i) => {
							return (
								<div key={i} className="menu-quests-item menu-quests-item-s">
									<h1>Пак "{item.name}"</h1>
									<h2>{item.desc}</h2>
									<section>
										<img alt="" src={require(`./images/donate_cash/${item.img}`)} />
										<h3>
											+${item.cash.toLocaleString()}
											<span>Деньги поступят на ваш счет сразу после покупки пакета.</span>
										</h3>
									</section>
									<div>
										<button onClick={() => donateBuyCash(i)} className="btn btn-select">
											Купить
										</button>
										<button className="btn btn-visual btn-visual-reverse">{item.price} GC</button>
										<h5 className="menu-donate-value">
											Ваше количество GC: <span>{donateCount.toLocaleString()}</span>
										</h5>
									</div>
								</div>
							);
						})}
					</div>
				</section>
				<section
					className="menu-wrap menu-quests menu-donate menu-donate-cash menu-donate-cars"
					style={menu !== "donate-cars" ? { display: "none" } : {}}
				>
					<div className="menu-quests-wrap">
						{donateCarsData.map((item, i) => {
							return (
								<div key={i} className="menu-quests-item menu-quests-item-s">
									<h1>Автомобиль "{item.name}"</h1>
									<h2>{item.desc}</h2>
									<section>
										<img alt="" src={require(`./images/donate_cars/${item.img}`)} />
									</section>
									<div>
										<button onClick={() => donateCarsBuy(i)} className="btn btn-select">
											Купить
										</button>
										<button className="btn btn-visual btn-visual-reverse">{item.price} GC</button>
										<h5 className="menu-donate-value">
											Ваше количество GC: <span>{donateCount.toLocaleString()}</span>
										</h5>
									</div>
								</div>
							);
						})}
					</div>
				</section>
				<section
					className="menu-wrap menu-quests menu-donate menu-donate-cash menu-donate-cars menu-donate-vip"
					style={menu !== "donate-vip" ? { display: "none" } : {}}
				>
					<div className="menu-quests-wrap">
						{donateVipData.map((item, i) => {
							return (
								<div key={i} className="menu-quests-item menu-quests-item-s">
									<h1>VIP "{item.name}"</h1>
									<h2>{item.desc}</h2>
									<section>
										<section>
											<img alt="" src={require(`./images/donate_vip/${item.img}`)} />
										</section>
										<div className="menu-quests-item-tasks">
											{item.tasks.map((item, i) => {
												return (
													<div key={i}>
														<h1>{item[0]}</h1>
														<h2>{item[1]}</h2>
													</div>
												);
											})}
										</div>
									</section>
									<div>
										<button onClick={() => donateVipBuy(i)} className="btn btn-select">
											Купить
										</button>
										<button className="btn btn-visual btn-visual-reverse">{item.price} GC</button>
										<h5 className="menu-donate-value">
											Ваше количество GC: <span>{donateCount.toLocaleString()}</span>
										</h5>
									</div>
								</div>
							);
						})}
					</div>
				</section>
				<section
					className="menu-wrap menu-donate menu-quests menu-donate-other"
					style={menu !== "donate-other" ? { display: "none" } : {}}
				>
					<div className="menu-donate-other-body">
						<div className="menu-quests-item menu-quests-item-s">
							<h1>Военный билет</h1>
							<h2>Описание прямо тут</h2>
							<div>
								<button className="btn">Купить</button>
								<button className="btn btn-visual btn-visual-reverse">350 GC</button>
							</div>
						</div>
						<div className="menu-quests-item menu-quests-item-s">
							<h1>Смена возраста</h1>
							<h2>Описание прямо тут</h2>
							<Rangeinput data={{ id: "test", min: 18, max: 90, value: 25 }} />
							<div>
								<button className="btn">Купить</button>
								<button className="btn btn-visual btn-visual-reverse">350 GC</button>
							</div>
						</div>
						<div className="menu-quests-item menu-quests-item-s">
							<h1>Смена имени</h1>
							<h2>Описание прямо тут</h2>
							<input type="text" className="input" minlength="4" maxlength="30" placeholder="Имя Фамилия" />
							<div>
								<button className="btn">Купить</button>
								<button className="btn btn-visual btn-visual-reverse">350 GC</button>
							</div>
						</div>
						<div className="menu-quests-item menu-quests-item-s">
							<h1>Внешность персонажа</h1>
							<h2>Описание прямо тут</h2>
							<div>
								<button className="btn">Купить</button>
								<button className="btn btn-visual btn-visual-reverse">350 GC</button>
							</div>
						</div>
					</div>
					<div className="menu-donate-other-code">
						<div className="menu-quests-item menu-quests-item-s">
							<h1>Бонус код</h1>
							<h2>Описание прямо тут</h2>
							<img alt="" src={require(`./images/donate_other_code.png`)} />
							<input type="text" className="input" minlength="4" maxlength="30" placeholder="Введите Ваш код..." />
							<div>
								<button className="btn btn-select">Ввести</button>
							</div>
						</div>
					</div>
				</section>
			</section>
		</div>
	);
}
