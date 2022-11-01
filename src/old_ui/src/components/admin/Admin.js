/* eslint-disable default-case */

import "./css.css";
import $ from "jquery";
import IMG_ADDADMIN from "./images/add_admin.png";
import IMG_BODYBACK from "./images/body_back.png";
import IMG_LOGIN from "./images/login_img.png";
import IMG_LOGIN_ERROR from "./images/login_error.png";
import IMG_LOGIN_NEW from "./images/login_new.png";
import IMG_OUT from "./images/out.png";
import IMG_SEARCH from "./images/search.png";
import IMG_TESTAVA from "./images/test_ava.png";
import IMG_TITLE from "./images/title_img.png";
import React from "react";
import ragemp from "../../_modules/ragemp";

const admLevelNames = [
	"Игрок",
	"Хелпер",
	"Старший Хелпер",
	"Модератор",
	"Младший Администратор",
	"Администратор",
	"Старший Администратор",
	"Медийник",
	"Пиар Менеджер",
	"Куратор",
	"Заместитель Главного Администратора",
	"Главный Администратор",
	"Руководитель проекта",
];

const admLevelNamesLength = [
	"Игрок",
	"Хелпер",
	"Ст. Хелпер",
	"Модератор",
	"Мл. Админ",
	"Админ",
	"Ст. Админ",
	"Медийник",
	"Пиар Менеджер",
	"Куратор",
	"Зам. Глав. Админа",
	"Глав. Админ.",
	"Рук. проекта",
];

const admLevelColors = [
	"white",
	"#53f3e5",
	"#53f3e5",
	"#52b5f2",
	"#52b5f2",
	"#5452f2",
	"#5452f2",
	"#c13ad0",
	"#d8a03c",
	"#933dde",
	"#99ea8e",
	"#5cc84e",
	"#ED4343",
];

let chatInput = false;

export default function Admin() {
	const [toggle, setToggle] = React.useState(true);
	const [menu, setMenu] = React.useState("reports");
	const [mainData, setMainData] = React.useState({
		id: 1,
		uid: 1,
		name: "Nezuko Kamado",
		lvl: 12,
	});

	const [login, setLogin] = React.useState(true);
	const [loginError, setLoginError] = React.useState(false);
	const [loginNew, setLoginNew] = React.useState(false);

	const [reports, setReports] = React.useState([
		{
			name: "Репорт #1",
			desc: "Админ, у меня угнали машину, помоги пж, я хз че делать............",
			status: 1,
			date: new Date(),
			id: 1,
			messages: [
				{
					type: "player",
					name: "Nezuko Kun",
					date: new Date(),
					text: "Админ, у меня угнали машину, помоги пж, я хз че делать............",
				},
				{
					type: "admin",
					name: "Nezuko Kamado",
					date: new Date(),
					text: "Добрый день, в чем заключается ваша проблема конкретно? Пожалуйста, изложите в одном сообщении.",
				},
				{
					type: "admin",
					name: "Nezuko Kamado",
					date: new Date(),
					text: "Добрый день, в чем заключается ваша проблема конкретно? Пожалуйста, изложите в одном сообщении.",
				},
				{
					type: "admin",
					name: "Nezuko Kamado",
					date: new Date(),
					text: "Добрый день, в чем заключается ваша проблема конкретно? Пожалуйста, изложите в одном сообщении.",
				},
				{
					type: "admin",
					name: "Nezuko Kamado",
					date: new Date(),
					text: "Добрый день, в чем заключается ваша проблема конкретно? Пожалуйста, изложите в одном сообщении.",
				},
				{
					type: "admin",
					name: "Nezuko Kamado",
					date: new Date(),
					text: "Добрый день, в чем заключается ваша проблема конкретно? Пожалуйста, изложите в одном сообщении.",
				},
				{
					type: "admin",
					name: "Nezuko Kamado",
					date: new Date(),
					text: "Добрый день, в чем заключается ваша проблема конкретно? Пожалуйста, изложите в одном сообщении.",
				},
				{
					type: "admin",
					name: "Nezuko Kamado",
					date: new Date(),
					text: "Добрый день, в чем заключается ваша проблема конкретно? Пожалуйста, изложите в одном сообщении.",
				},
			],
		},
	]);
	const [reportSelect, setReportSelect] = React.useState(-1);
	const [reportSelectID, setReportSelectID] = React.useState(-1);

	const [cmd, setCMD] = React.useState([
		{
			name: "Ban",
			desc: "Блокирует аккаунт игрока со всеми его персонажами",
			params: [
				{ desc: "ID игрока", maxlength: 4, type: "number" },
				{ desc: "Время блокировки", maxlength: 3, type: "number" },
				{ desc: "Причина блокировки", maxlength: 30, type: "text" },
			],
		},
		{
			name: "Mute",
			desc: "Выдает блокировку текстового и войс чата персонажу",
			params: [
				{ desc: "ID игрока", maxlength: 4, type: "number" },
				{ desc: "Время блокировки", maxlength: 3, type: "number" },
				{ desc: "Причина блокировки", maxlengt: 30, type: "text" },
			],
		},
	]);

	const [chat, setChat] = React.useState({
		players: [
			["Nezuko Kamado", "Рук. проекта (12 лвл)", 12],
			["Nezuko Kun", "Хелпер (1 лвл)", 1],
			["Nezuko Kunis", "Offline", 4],
		],
		messages: [],
		write: null,
	});

	const [tp, setTP] = React.useState([
		{ name: "SantaMaria Beach", desc: "Телепорт на пляж Санта Мария", id: 0 },
		{ name: "Meria LS", desc: "Телепорт на пляж Санта Мария", id: 0 },
		{ name: "SantaMaria Beach", desc: "Телепорт на пляж Санта Мария", id: 0 },
	]);

	const [frac, setFrac] = React.useState([
		{ id: 0, name: "Los Santos Police Deportament", desc: "Полицейский участок Лос Сантоса", leader: "dapy", status: 0 },
		{ id: 1, name: "Los Santos Police Deportament", desc: "Полицейский участок Лос Сантоса", leader: "Dapy Rogers", status: 0 },
		{ id: 2, name: "Los Santos Police Deportament", desc: "Полицейский участок Лос Сантоса", leader: "Nezuko Kunis", status: 0 },
	]);
	const [fracAddValue, setfracAddValue] = React.useState("");

	const [admins, setAdmins] = React.useState([
		{
			uid: 1,
			name: "Nezuko Kamado",
			lvl: 12,
			status: "Онлайн",
			data: {
				reportDay: 10,
				addDate: new Date(),
				adder: "Хелпер Nezuko Kamado",
				upDate: null,
				upper: null,
			},
		},
		{
			uid: 0,
			name: "Nezuko Kun",
			lvl: 12,
			status: "Offline",
			data: {
				reportDay: 2,
				addDate: new Date(),
				adder: "Хелпер Nezuko Kamado",
				upDate: new Date(),
				upper: `Рук. проекта Nezuko Kamado`,
			},
		},
		{
			uid: 0,
			name: "Nezuko Kunis",
			lvl: 4,
			status: "Онлайн",
			data: {
				reportDay: 15,
				addDate: new Date(),
				adder: "Хелпер Nezuko Kamado",
				upDate: null,
				upper: null,
			},
		},
	]);
	const [adminsSelect, setAdminsSelect] = React.useState(-1);

	const [invitems, setInvitems] = React.useState([
		{ id: 1, name: "Телефон", type: "phone", weigth: 0.5, img: "phone.png", desc: "Телефон чтобы звонить" },
		{ id: 1, name: "Телефон", type: "phone", weigth: 0.5, img: "phone.png", desc: "Телефон чтобы звонить" },
	]);

	const [dialog, setDialog] = React.useState({
		status: false,
		type: "normal",
		title: "Снятие администратора",
		text: "Вы действительно хотите снять Хелпера [1 лвл] Nezuko Kamado ?",
		btn: ["Да", "Нет"],
		server: false,
	});
	const [notf, setNotf] = React.useState([]);

	const [addpropertyType, setAddpropertyType] = React.useState(0);
	const [addpropertyHouse, setAddpropertyHouse] = React.useState({
		type: 0,
		class: 0,
		price: 0,
		garage: 0,
	});
	const [addpropertyBusiness, setAddpropertyBusiness] = React.useState({
		type: 0,
		price: 0,
	});
	const [addpropertyVehicle, setAddpropertyVehicle] = React.useState({
		type: 0,
		price: 0,
		owner: -1,
	});

	function openMenu(id) {
		ragemp.send("ui::admin:openMenu", {
			id,
		});
	}
	function adminSearch(type, text) {
		switch (type) {
			case "reports": {
				reports.map((item, i) => {
					if (item.name.indexOf(text) !== -1) $(`#admin-reports-item-${i}`).show();
					else $(`#admin-reports-item-${i}`).hide();
				});
				break;
			}
			case "cmd": {
				cmd.map((item, i) => {
					if (item.name.toLowerCase().indexOf(text.toLowerCase()) !== -1) $(`#admin-cmd-item-${i}`).show();
					else $(`#admin-cmd-item-${i}`).hide();
				});
				break;
			}
			case "chat": {
				chat.messages.map((item, i) => {
					if (item.text.toLowerCase().indexOf(text.toLowerCase()) !== -1) $(`#admin-chat-message-${i}`).show();
					else $(`#admin-chat-message-${i}`).hide();
				});
				break;
			}
			case "tp": {
				tp.map((item, i) => {
					if (item.name.toLowerCase().indexOf(text.toLowerCase()) !== -1) $(`#admin-tp-item-${i}`).show();
					else $(`#admin-tp-item-${i}`).hide();
				});
				break;
			}
			case "frac": {
				frac.map((item, i) => {
					if (item.name.toLowerCase().indexOf(text.toLowerCase()) !== -1) $(`#admin-frac-item-${i}`).show();
					else $(`#admin-frac-item-${i}`).hide();
				});
				break;
			}
			case "admins": {
				admins.map((item, i) => {
					if (item.name.toLowerCase().indexOf(text.toLowerCase()) !== -1) $(`#admin-admins-players-${i}`).show();
					else $(`#admin-admins-players-${i}`).hide();
				});
				break;
			}
			case "invitems": {
				invitems.map((item, i) => {
					if (item.name.toLowerCase().indexOf(text.toLowerCase()) !== -1) $(`#admin-invitems-item-${i}`).show();
					else $(`#admin-invitems-item-${i}`).hide();
				});
				break;
			}
		}
	}

	function reportSendEvent(eventname, id) {
		ragemp.send("ui::admin:reportSendEvent", {
			id,
			eventname,
		});
	}
	function reportSendMessage(id, text, pressed) {
		if (pressed && pressed.key !== "Enter") return;

		ragemp.send("ui::admin:reportSendMessage", {
			id,
			text,
		});
		$("#admin-reports-chat-input").val("");
	}

	function cmdSend(cmd) {}
	function tpSend(id) {
		ragemp.send("ui::admin:tp", {
			id: id,
		});
	}
	function fracSend(id) {
		let newArr = [...frac];
		newArr[id].optionToggle = !newArr[id].optionToggle;
		setFrac(newArr);
	}
	function fracSentLiderId(fracId, liderID) {
		setfracAddValue("");
		if (!liderID.length) return;
		ragemp.send("ui::admin:setLider", {
			fracId,
			liderID,
		});
		// openMenu('frac')
	}
	function invitemsSend(id) {
		const charname = $(".admin .admin-invitems-input").val();
		if (!charname.length) return;

		ragemp.send("ui::admin:invitems", {
			id,
			charname,
		});
	}

	function out() {
		ragemp.send("ui::admin:out");
	}
	function loginEnter(pressed) {
		if (pressed && pressed.key !== "Enter") return;

		ragemp.send("ui::admin:login", {
			password: $("#admin-login").val(),
		});
		$("#admin-login").val("");
	}
	function loginEnterNew(pressed) {
		if (pressed && pressed.key !== "Enter") return;

		ragemp.send("ui::admin:login:new", {
			password: $("#admin-login-new").val(),
			passwordre: $("#admin-login-new-re").val(),
		});
	}

	function chatSend(text, pressed) {
		if (pressed && pressed.key !== "Enter") return;

		ragemp.send("ui::admin:chatSend", {
			text: text,
		});
		chatInput = true;

		$(".admin .admin-chat .admin-reports-chat-input-body input").val("");
	}

	function dialogEnter(key, pressed) {
		if (pressed && pressed.key !== "Enter" && pressed.key !== "Escape") return;
		if (pressed) key = pressed.key === "Enter" ? 0 : 1;

		let input = $(".admin .admin-dialog input").val();
		ragemp.send("ui::admin:dialogEnter", {
			btn: key,
			input: input,
			server: dialog.server,
		});
	}
	function addNotf(type, text) {
		let notfLength = notf.length;

		const id = notfLength;
		const timeout = setTimeout(() => {
			setNotf((old) => old.filter((item) => item.id !== notfLength));
		}, 5000);

		setNotf((old) => [
			...old,
			{
				type,
				text,
				timeout,
				id,
			},
		]);
	}

	React.useMemo(() => {
		ragemp.eventCreate("client::admin", (cmd, data) => {
			switch (cmd) {
				case "toggle": {
					setToggle(data.status);
					break;
				}
				case "dialog": {
					setDialog(data);
					break;
				}
				case "addNotf": {
					addNotf(data.type, data.text);
					break;
				}
				case "mainData": {
					setMainData(data);
					break;
				}
				case "updateFrac": {
					console.log(data);
					setFrac(data);
					break;
				}
				case "updateChatMessages": {
					setChat(data);
					// { name: mainData.name, lvl: mainData.lvl, me: true, date: new Date(), text: text, views: [mainData.uid] }
					break;
				}
				case "updateReports": {
					const select = parseInt($("#admin-reports-id").attr("data-id"));
					const selectID = parseInt($("#admin-reports-id").attr("data-ids"));

					if (select !== -1) {
						let stat = false;
						data.map((item, i) => {
							if (selectID === item.id) stat = true;
						});
						if (!stat) setReportSelect(-1);
					}

					setReports(data);

					break;
				}
				case "openMenu": {
					setAdminsSelect(-1);
					setReportSelect(-1);
					setReportSelectID(-1);

					setLogin(false);
					setLoginError(false);
					setLoginNew(false);

					switch (data.menu) {
						case "reports": {
							setReports(data.data);
							break;
						}
						case "cmd": {
							setCMD(data.data);
							break;
						}
						case "chat": {
							setChat(data.data);
							break;
						}
						case "tp": {
							setTP(data.data);
							break;
						}
						case "frac": {
							setFrac(data.data);
							break;
						}
						case "admins": {
							setAdmins(data.data);
							break;
						}
						case "login": {
							setLogin(true);
							break;
						}
						case "loginError": {
							setLoginError(true);
							setLogin(true);

							data.menu = "login";
							break;
						}
						case "loginNew": {
							setLoginNew(true);
							setLogin(true);

							data.menu = "login";
							break;
						}
						case "invitems": {
							setInvitems(data.data);
							break;
						}
					}

					setMenu(data.menu);
					break;
				}
			}
		});

		setInterval(() => {
			if ($(".admin").attr("data-menu") == "chat") {
				$(".admin .admin-chat .admin-reports-chat-messages section").each((i, item) => {
					if (chat.messages[parseInt($(item).attr("data-id"))]) {
						const scroll = $(".admin .admin-chat .admin-reports-chat-messages").scrollTop(),
							height = $(".admin .admin-chat .admin-reports-chat-messages").height(),
							blockOffset = $(item).offset().top,
							blockHeight = $(item).outerHeight();

						if (
							(scroll + height + 60 >= blockOffset || blockHeight + blockOffset < scroll) &&
							chat.messages[parseInt($(item).attr("data-id"))].views.indexOf(mainData.id) === -1
						) {
							ragemp.send("ui::admin:chatView", {
								id: parseInt($(item).attr("data-id")),
							});
						}
					}
				});
			}
		}, 1000);
	}, []);

	React.useEffect(() => {
		if (menu === "chat" && chatInput === true) {
			$(".admin .admin-chat .admin-reports-chat-messages").scrollTop(
				$(".admin .admin-chat .admin-reports-chat-messages").height() + 99999999999
			);
			chatInput = false;
		}

		let count = 0;
		chat.messages.map((item, i) => {
			if (item.views.indexOf(mainData.uid) === -1) count++;
		});

		if (count) {
			$("#admin-menu-items-chat button").html(`+${count}`);
			$("#admin-menu-items-chat button").css("display", "inline-block");
		} else $("#admin-menu-items-chat button").css("display", "none");
	}, [chat]);
	React.useEffect(() => {
		let count = 0;
		reports.map((item, i) => {
			if (item.status === 0) count++;
		});

		if (count) {
			$("#admin-menu-items-reports button").html(`+${count}`);
			$("#admin-menu-items-reports button").css("display", "inline-block");
		} else $("#admin-menu-items-reports button").css("display", "none");
	}, [reports]);
	React.useEffect(() => {
		if (menu === "reports" && reportSelect !== -1)
			$(".admin .admin-reports .admin-reports-chat .admin-reports-chat-messages").scrollTop(
				$(".admin .admin-reports .admin-reports-chat .admin-reports-chat-messages").height() + 99999999999
			);
	}, [reports]);

	function addProperty() {
		switch (addpropertyType) {
			case 0: {
				ragemp.send("ui::admin:addProperty", {
					type: "house",
					data: addpropertyHouse,
				});
				break;
			}
			case 1: {
				ragemp.send("ui::admin:addProperty", {
					type: "business",
					data: addpropertyBusiness,
				});
				break;
			}
			case 2: {
				ragemp.send("ui::admin:addProperty", {
					type: "vehicle",
					data: addpropertyVehicle,
				});
				break;
			}
		}
	}

	return (
		<div className="admin" data-menu={menu} style={!toggle ? { display: "none" } : {}}>
			<div className="admin-dialog" style={!dialog.status ? { display: "none" } : {}}>
				<div className="admin-dialog-wrap">
					<h1>{dialog.title}</h1>
					<h2>{dialog.text}</h2>
					<input
						onKeyDown={(e) => dialogEnter(0, e)}
						className="input"
						style={dialog.type !== "input" ? { display: "none" } : {}}
						type="text"
					/>
					<div className="admin-dialog-btn">
						{dialog.btn.map((item, i) => {
							return (
								<button
									onClick={() => dialogEnter(i)}
									className={`btn ${i === dialog.btn.length - 1 && "admin-dialog-btn-cancel"}`}
									key={i}
								>
									{item}
								</button>
							);
						})}
					</div>
				</div>
			</div>
			<div className="admin-notf">
				{notf.map((item, i) => {
					return (
						<section key={i} className={`admin-notf-type-${item.type}`}>
							{item.text}
						</section>
					);
				})}
			</div>

			<section className="admin-menu" style={!login ? { display: "none" } : {}}>
				<div className="admin-menu-title">
					<img src={IMG_TITLE} />
					<h1>
						Панель
						<span>Администратора</span>
					</h1>
				</div>
				<div className="admin-menu-name">
					<img src={IMG_TESTAVA} />
					<h1>
						{mainData.name}
						<button className="btn btn-select">Авторизация</button>
					</h1>
				</div>
				<div className="admin-menu-items">
					<section id="admin-menu-items-reports" className={menu === "login" && "admin-menu-items-select"}>
						Авторизация
					</section>
				</div>
			</section>
			<section className="admin-body" style={!login ? { display: "none" } : {}}>
				<div className="admin-body-top">
					<div className="admin-menu-title">
						<h1>
							Авторизация
							<span>Админа &#8195;&#8195;&#8195;&#8195;</span>
						</h1>
					</div>
				</div>
				<div className="admin-body-wrap">
					<div className="admin-login" style={loginError || loginNew ? { display: "none" } : {}}>
						<img src={IMG_LOGIN} />
						<h1>Для продолжения, введите свой админ-пароль:</h1>
						<input id="admin-login" onKeyDown={(e) => loginEnter(e)} className="input" type="password" maxlength="64" />
						<button onClick={() => loginEnter()} className="btn">
							Войти
						</button>
					</div>
					<div className="admin-login" style={!loginNew ? { display: "none" } : {}}>
						<img src={IMG_LOGIN_NEW} />
						<h1>
							Поздравляем с постановлением на роль администратора!
							<br />
							Для продолжения придумайте себе админ пароль:
							<br />
							<br />
							<span style={{ opacity: ".5" }}>
								Важно! Ваш админ пароль должен быть сложным и состоять минимум из 10ти символов и цифр!
							</span>
						</h1>
						<input
							id="admin-login-new"
							onKeyDown={(e) => loginEnterNew(e)}
							className="input"
							type="password"
							maxlength="64"
							placeholder="Придумайте пароль"
						/>
						<input
							id="admin-login-new-re"
							onKeyDown={(e) => loginEnterNew(e)}
							className="input"
							type="password"
							maxlength="64"
							placeholder="Повторите придуманный пароль"
						/>
						<button onClick={() => loginEnterNew()} className="btn">
							Создать пароль
						</button>
					</div>
					<div className="admin-login admin-login-error" style={!loginError ? { display: "none" } : {}}>
						<img src={IMG_LOGIN_ERROR} />
						<h1>
							Система безопастности заподозрила на Вашем аккаунте подозрительную активность.
							<br />
							Временно доступ к системе администрирования не доступен.
							<br />
							<br />
							Для разблокировки обратитесь к Главному Администратору.
						</h1>
						<button onClick={out} className="btn btn-select">
							Понял
						</button>
					</div>
				</div>
			</section>

			<section className="admin-menu" style={login ? { display: "none" } : {}}>
				<div className="admin-menu-title">
					<img src={IMG_TITLE} />
					<h1>
						Панель
						<span>Администратора</span>
					</h1>
				</div>
				<div className="admin-menu-name">
					<img src={IMG_TESTAVA} />
					<h1>
						{mainData.name}
						<button className="btn btn-select">
							{admLevelNamesLength[mainData.lvl]} ({mainData.lvl} лвл)
						</button>
					</h1>
				</div>
				<div className="admin-menu-items">
					<section
						id="admin-menu-items-reports"
						onClick={() => openMenu("reports")}
						className={menu.indexOf("reports") !== -1 && "admin-menu-items-select"}
					>
						Список репортов <button style={{ display: "none" }}>+0</button>
					</section>
					<section onClick={() => openMenu("cmd")} className={menu === "cmd" && "admin-menu-items-select"}>
						Команды администратора
					</section>
					<section
						id="admin-menu-items-chat"
						onClick={() => openMenu("chat")}
						className={menu === "chat" && "admin-menu-items-select"}
					>
						Чат администраторов <button>+82</button>
					</section>
					<section onClick={() => openMenu("tp")} className={menu === "tp" && "admin-menu-items-select"}>
						Телепорт
					</section>
					<section onClick={() => openMenu("frac")} className={menu === "frac" && "admin-menu-items-select"}>
						Список фракций
					</section>
					<section onClick={() => openMenu("admins")} className={menu === "admins" && "admin-menu-items-select"}>
						Список администраторов
					</section>
					<section
						onClick={() => openMenu("invitems")}
						style={mainData.admin < 10 ? { display: "none" } : {}}
						className={menu === "invitems" && "admin-menu-items-select"}
					>
						Выдача предметов
					</section>
					<section
						onClick={() => openMenu("addproperty")}
						style={mainData.admin < 12 ? { display: "none" } : {}}
						className={menu === "addproperty" && "admin-menu-items-select"}
					>
						Добавление имущества
					</section>
				</div>
				<div className="admin-menu-out" onClick={out}>
					<img src={IMG_OUT} />
					<h1>Разлогиниться</h1>
				</div>
			</section>
			<section className="admin-body" style={menu !== "reports" || reportSelect !== -1 ? { display: "none" } : {}}>
				<div className="admin-body-top">
					<div className="admin-menu-title">
						<h1>
							Список
							<span>Репортов от игроков</span>
						</h1>
					</div>
					<div className="admin-body-search">
						<input onChange={(e) => adminSearch("reports", e.target.value)} type="text" placeholder="Поиск по репортам" />
						<img src={IMG_SEARCH} />
					</div>
				</div>
				<div className="admin-body-wrap">
					<div className="admin-reports">
						{reports.map((item, i) => {
							return (
								<section
									onClick={() => {
										setReportSelect(i);
										setReportSelectID(item.id);
									}}
									key={i}
									className="admin-reports-item"
									id={`admin-reports-item-${i}`}
								>
									<div className="admin-reports-item-elem">
										<h1>{item.name}</h1>
										<h2>{item.desc.length > 66 ? item.desc.substring(0, 66) + "..." : item.desc}</h2>
									</div>
									<div className="admin-reports-item-elem">
										<div
											className={`admin-reports-item-status admin-reports-item-status-${
												item.status === 2 ? "close" : item.status === 0 ? "open" : "wait"
											}`}
										>
											<button>
												{item.status === 2 ? "Закрыт" : item.status === 0 ? "Открыт" : "На рассмотрении"}
											</button>
											<h2>{new Date(item.date).toLocaleString("ru-RU")}</h2>
										</div>
										<div className="admin-reports-item-btn">
											<button>→</button>
										</div>
									</div>
								</section>
							);
						})}
					</div>
				</div>
			</section>
			<section
				className="admin-body"
				id="admin-reports-id"
				style={reportSelect === -1 ? { display: "none" } : {}}
				data-id={reportSelect}
				data-ids={reportSelectID}
			>
				<div className="admin-body-top">
					<div className="admin-menu-title">
						<h1>
							Список
							<span>Репортов от игроков</span>
						</h1>
						<button
							onClick={() => {
								setReportSelect(-1);
								setReportSelectID(-1);
							}}
						>
							<img src={IMG_BODYBACK} />
						</button>
					</div>
				</div>
				<div className="admin-body-wrap">
					<div className="admin-reports">
						<section className="admin-reports-item">
							<div className="admin-reports-item-elem">
								<h1>{reportSelect !== -1 && reports[reportSelect].name}</h1>
								<h2>{reportSelect !== -1 && reports[reportSelect].desc}</h2>
							</div>
							<div className="admin-reports-item-elem">
								<div
									className={`admin-reports-item-status admin-reports-item-status-${
										reportSelect !== -1 && reports[reportSelect].status == 2
											? "close"
											: reportSelect !== -1 && reports[reportSelect].status === 0
											? "open"
											: "wait"
									}`}
								>
									<button>
										{reportSelect !== -1 && reports[reportSelect].status === 2
											? "Закрыт"
											: reportSelect !== -1 && reports[reportSelect].status === 0
											? "Открыт"
											: "На рассмотрении"}
									</button>
									<h2>{reportSelect !== -1 && new Date(reports[reportSelect].date).toLocaleString("ru-RU")}</h2>
								</div>
							</div>
						</section>
						<section className="admin-reports-chat">
							<div
								className="admin-reports-chat-messages"
								style={reportSelect !== -1 && reports[reportSelect].status === 2 ? { height: "calc(100% - 40px)" } : {}}
							>
								{reportSelect !== -1 &&
									reports[reportSelect].messages.map((item, i) => {
										return (
											<section key={i} className={item.type === "player" && "admin-reports-chat-message-reverse"}>
												<h2>{item.type === "player" ? "Игрок" : "Администратор"}</h2>
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
								className="admin-reports-chat-input-body"
								style={reportSelect !== -1 && reports[reportSelect].status === 2 ? { display: "none" } : {}}
							>
								<div className="admin-reports-chat-input-btn">
									<button
										style={reportSelect !== -1 && !reports[reportSelect].creator ? { display: "none" } : {}}
										onClick={() => reportSendEvent("tpplayer", reportSelect !== -1 && reports[reportSelect].id)}
										className="btn"
									>
										ТП к игроку
									</button>
									<button
										onClick={() => reportSendEvent("mute", reportSelect !== -1 && reports[reportSelect].id)}
										className="btn"
									>
										Выдать мут
									</button>
									<button
										onClick={() => reportSendEvent("ban", reportSelect !== -1 && reports[reportSelect].id)}
										className="btn"
									>
										Забанить
									</button>
									<button
										onClick={() => reportSendEvent("kick", reportSelect !== -1 && reports[reportSelect].id)}
										className="btn"
									>
										Кикнуть
									</button>
									<button
										onClick={() => reportSendEvent("jail", reportSelect !== -1 && reports[reportSelect].id)}
										className="btn"
									>
										Деморган
									</button>
									<button
										onClick={() => reportSendEvent("closereport", reportSelect !== -1 && reports[reportSelect].id)}
										className="btn"
									>
										Закрыть репорт
									</button>
								</div>
								<div className="admin-reports-chat-input">
									<input
										onKeyDown={(e) =>
											reportSendMessage(reportSelect !== -1 && reports[reportSelect].id, e.target.value, e)
										}
										id="admin-reports-chat-input"
										type="text"
										placeholder="Введите ваше сообщение"
									/>
									<button
										onClick={() =>
											reportSendMessage(
												reportSelect !== -1 && reports[reportSelect].id,
												$("#admin-reports-chat-input").val()
											)
										}
										className="btn btn-select"
									>
										►
									</button>
								</div>
							</div>
						</section>
					</div>
				</div>
			</section>
			<section className="admin-body" style={menu !== "cmd" ? { display: "none" } : {}}>
				<div className="admin-body-top">
					<div className="admin-menu-title">
						<h1>
							Список
							<span>Команд админов</span>
						</h1>
					</div>
					<div className="admin-body-search">
						<input onChange={(e) => adminSearch("cmd", e.target.value)} type="text" placeholder="Поиск по командам" />
						<img src={IMG_SEARCH} />
					</div>
				</div>
				<div className="admin-body-wrap">
					<div className="admin-cmd admin-reports">
						{cmd.map((item, i) => {
							return (
								<section key={i} className="admin-reports-item" id={`admin-cmd-item-${i}`}>
									<div className="admin-reports-item-elem">
										<h1>{item.name}</h1>
										<h2>{item.desc}</h2>
									</div>
									{item.params.map((param, i) => {
										return (
											<div className="admin-reports-item-elem">
												{" "}
												key={i}
												<input
													id={`admin-cmd-${item.name.toLowerCase}-${i}`}
													type={param.type}
													placeholder="%Param%"
													maxlength={param.maxlength}
												/>
												<h2>{param.desc}</h2>
											</div>
										);
									})}
									<div className="admin-reports-item-elem">
										<button onClick={() => cmdSend(item.name.toLowerCase())} className="btn">
											Выполнить
										</button>
									</div>
								</section>
							);
						})}
					</div>
				</div>
			</section>
			<section className="admin-body" style={menu !== "chat" ? { display: "none" } : {}}>
				<div className="admin-body-top">
					<div className="admin-menu-title">
						<h1>
							Чат
							<span>Администраторов &#8195;&#8195;</span>
						</h1>
					</div>
					<div className="admin-body-search">
						<input onChange={(e) => adminSearch("chat", e.target.value)} type="text" placeholder="Поиск по чату" />
						<img src={IMG_SEARCH} />
					</div>
				</div>
				<div className="admin-body-wrap">
					<div className="admin-chat">
						<section className="admin-chat-players">
							<div className="admin-chat-players-title">Список участников чата</div>
							<div className="admin-chat-players-body">
								{chat.players.map((item, i) => {
									return (
										<section key={i}>
											<h1>{item[0]}</h1>
											<button className={`btn ${item[1] !== "Offline" && "btn-select"}`}>{item[1]}</button>
										</section>
									);
								})}
							</div>
						</section>
						<section className="admin-chat-body">
							<div className="admin-reports-chat-messages">
								{chat.messages.map((item, i) => {
									return (
										<section
											key={i}
											data-id={i}
											id={`admin-chat-message-${i}`}
											className={
												item.uid === mainData.uid
													? "admin-reports-chat-message-reverse"
													: item.system
													? "admin-reports-chat-message-system"
													: ""
											}
										>
											<h2 style={{ color: admLevelColors[item.lvl] }}>
												{admLevelNames[item.lvl]} ({item.lvl} лвл)
											</h2>
											<h1>{item.name}</h1>
											<h3>
												{item.text}{" "}
												<div className="admin-reports-chat-message-views">{item.views.length < 2 ? "✓" : "✓✓"}</div>{" "}
												<div
													style={item.views.indexOf(mainData.uid) !== -1 ? { display: "none" } : {}}
													className="admin-reports-chat-message-new"
												>
													новое
												</div>
											</h3>
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
							<div className="admin-reports-chat-input-body">
								<h2>{chat.write && chat.write}&#8195;</h2>
								<div className="admin-reports-chat-input">
									<input
										onKeyDown={(e) => chatSend(e.target.value, e)}
										type="text"
										placeholder="Введите ваше сообщение"
									/>
									<button
										onClick={(e) => chatSend($(".admin .admin-chat .admin-reports-chat-input-body input").val())}
										className="btn btn-select"
									>
										►
									</button>
								</div>
							</div>
						</section>
					</div>
				</div>
			</section>
			<section className="admin-body" style={menu !== "tp" ? { display: "none" } : {}}>
				<div className="admin-body-top">
					<div className="admin-menu-title">
						<h1>
							Список
							<span>телепортов &#8195;&#8195;&#8195;&#8195;</span>
						</h1>
					</div>
					<div className="admin-body-search">
						<input onChange={(e) => adminSearch("tp", e.target.value)} type="text" placeholder="Поиск по телепортам" />
						<img src={IMG_SEARCH} />
					</div>
				</div>
				<div className="admin-body-wrap">
					<div className="admin-cmd admin-tp admin-reports">
						<div className="admin-tp-wrap">
							{tp.map((item, i) => {
								return (
									<section key={i} className="admin-reports-item" id={`admin-tp-item-${i}`}>
										<div className="admin-reports-item-elem">
											<h1>{item.name}</h1>
											<h2>{item.desc}</h2>
										</div>
										<div className="admin-reports-item-elem">
											<button onClick={() => tpSend(item.id)} className="btn">
												Телепорт
											</button>
										</div>
									</section>
								);
							})}
						</div>
					</div>
				</div>
			</section>
			<section className="admin-body" style={menu !== "frac" ? { display: "none" } : {}}>
				<div className="admin-body-top">
					<div className="admin-menu-title">
						<h1>
							Список
							<span>фракций &#8195;&#8195;&#8195;&#8195;&#8195;&#8195;</span>
						</h1>
					</div>
					<div className="admin-body-search">
						<input onChange={(e) => adminSearch("frac", e.target.value)} type="text" placeholder="Поиск по фракциям" />
						<img src={IMG_SEARCH} />
					</div>
				</div>
				<div className="admin-body-wrap">
					<div className="admin-cmd admin-reports">
						{frac.map((item, i) => {
							return (
								<>
									<section key={i} className="admin-reports-item" id={`admin-frac-item-${i}`}>
										<div className="admin-reports-item-elem">
											<h1>{item.name}</h1>
											<h2>{item.desc}</h2>
										</div>
										<div className="admin-reports-item-elem">
											<h1
												style={
													item.leader === null || item.leader === undefined || item.leader.length < 1
														? { color: "#ED4343" }
														: {}
												}
											>
												{item.leader === null || item.leader === undefined || item.leader.length < 1
													? "Лидера нету"
													: item.leader}
											</h1>
											<h2>Кто сейчас лидер?</h2>
										</div>
										<div className="admin-reports-item-elem">
											<h1 style={item.status === 0 ? { color: "#ED4343" } : { color: "#43ed49" }}>
												{item.status === 0 ? "Офлайн" : "Онлайн"}
											</h1>
											<h2>Статус лидера</h2>
										</div>
										<div className="admin-reports-item-elem">
											<button onClick={() => fracSend(i)} className="btn">
												Опции
											</button>
										</div>
									</section>

									<section
										key={i}
										className="admin-frac-optional admin-reports-item "
										id={`admin-frac-item-${i}`}
										style={frac[i].optionToggle !== true ? { display: "none" } : {}}
									>
										<div className="admin-reports-item-elem">
											<h1>Укажите ID игрока, которого хотите назначить лидером</h1>
											<div className="admin-frac-search ">
												<input
													onChange={(e) => setfracAddValue(e.target.value)}
													value={fracAddValue}
													type="number"
													placeholder="ID тут"
												/>
											</div>
										</div>

										<div className="admin-reports-item-elem">
											<button onClick={() => fracSentLiderId(item.id, fracAddValue)} className="btn">
												Ок
											</button>
										</div>
									</section>
								</>
							);
						})}
					</div>
				</div>
			</section>
			<section className="admin-body" style={menu !== "admins" ? { display: "none" } : {}}>
				<div className="admin-body-top">
					<div className="admin-menu-title">
						<h1>
							Список всех
							<span>Администраторов</span>
						</h1>
						<button onClick={() => ragemp.send("ui::admin:addAdmin")}>
							<img src={IMG_ADDADMIN} />
						</button>
					</div>
					<div className="admin-body-search">
						<input onChange={(e) => adminSearch("admins", e.target.value)} type="text" placeholder="Поиск по админам" />
						<img src={IMG_SEARCH} />
					</div>
				</div>
				<div className="admin-body-wrap" style={menu !== "admins" ? { display: "none" } : {}}>
					<div className="admin-chat admin-admins">
						<section className="admin-chat-players">
							<div className="admin-chat-players-body">
								{admins.map((item, i) => (
									<section
										id={`admin-admins-players-${i}`}
										onClick={() => setAdminsSelect(i)}
										className={adminsSelect === i && "admin-admins-players-select"}
										key={i}
									>
										<h1>
											{item.name}{" "}
											<button className={`btn ${item.status !== "Offline" && "btn-select"}`}>{item.status}</button>
										</h1>
										<h2 style={{ color: admLevelColors[item.lvl] }}>
											{admLevelNames[item.lvl]} ({item.lvl} лвл)
										</h2>
									</section>
								))}
							</div>
						</section>
						<section className="admin-chat-body admin-admins-body" style={adminsSelect === -1 ? { display: "none" } : {}}>
							<div className="admin-admins-body-wrap">
								<section
									className="admin-admins-body-btn"
									style={
										adminsSelect !== -1 &&
										(admins[adminsSelect].lvl > mainData.lvl || admins[adminsSelect].uid === mainData.uid)
											? { display: "none" }
											: {}
									}
								>
									<h1>Действия</h1>
									<h2>Что делаем с админом?</h2>
									<div>
										<button
											onClick={() =>
												ragemp.send("ui::admin:adminEdit", { id: admins[adminsSelect].uid, type: "spec" })
											}
											style={
												adminsSelect !== -1 && admins[adminsSelect].status === "Offline" ? { display: "none" } : {}
											}
											className="btn"
										>
											Следить &#8194;⚪
										</button>
										<button
											onClick={() => ragemp.send("ui::admin:adminEdit", { id: admins[adminsSelect].uid, type: "tp" })}
											style={
												adminsSelect !== -1 && admins[adminsSelect].status === "Offline" ? { display: "none" } : {}
											}
											className="btn"
										>
											ТП к себе &#8194;🛠
										</button>
										<button
											onClick={() => ragemp.send("ui::admin:adminEdit", { id: admins[adminsSelect].uid, type: "up" })}
											className="btn"
											style={
												mainData.lvl < 10 || (adminsSelect !== -1 && admins[adminsSelect].lvl >= 12)
													? { display: "none" }
													: {}
											}
										>
											Повысить &#8194;↑
										</button>
										<button
											onClick={() =>
												ragemp.send("ui::admin:adminEdit", { id: admins[adminsSelect].uid, type: "down" })
											}
											className="btn"
											style={
												mainData.lvl < 10 || (adminsSelect !== -1 && admins[adminsSelect].lvl <= 1)
													? { display: "none" }
													: {}
											}
										>
											Понизить &#8194;↓
										</button>
										<button
											onClick={() =>
												ragemp.send("ui::admin:adminEdit", { id: admins[adminsSelect].uid, type: "uval" })
											}
											className="btn"
											style={mainData.lvl < 10 ? { display: "none" } : {}}
										>
											Снять &#8194;✖
										</button>
									</div>
								</section>

								<section>
									<h1>
										Дата назначения{" "}
										<button className="btn btn-select">
											{adminsSelect !== -1 && new Date(admins[adminsSelect].data.addDate).toLocaleString("ru-RU")}
										</button>
									</h1>
									<h2>День, когда игрока в первый раз назначили админом</h2>
								</section>
								<section>
									<h1>
										Кто назначил{" "}
										<button className="btn btn-select">{adminsSelect !== -1 && admins[adminsSelect].data.adder}</button>
									</h1>
									<h2>Уровень и Ник администратора, который назначил данного админа</h2>
								</section>
								<section>
									<h1>
										Дата изменения{" "}
										<button className="btn btn-select">
											{adminsSelect !== -1 && admins[adminsSelect].data.upDate !== null
												? new Date(admins[adminsSelect].data.upDate).toLocaleString("ru-RU")
												: "Нет"}
										</button>
									</h1>
									<h2>Когда данный админ был повышен/понижен</h2>
								</section>
								<section>
									<h1>
										Кто изменил{" "}
										<button className="btn btn-select">
											{adminsSelect !== -1 && admins[adminsSelect].data.upper !== null
												? admins[adminsSelect].data.upper
												: "Нет"}
										</button>
									</h1>
									<h2>Уровень и Ник администратора, который повысил/понизил данного админа</h2>
								</section>
								<section>
									<h1>
										Репортов за сутки{" "}
										<button className="btn btn-select">
											{adminsSelect !== -1 && admins[adminsSelect].data.reportDay} шт.
										</button>
									</h1>
									<h2>Количество репортов, отвеченных за текущий день</h2>
								</section>
								<section>
									<h1>
										Все репорты{" "}
										<button className="btn btn-select">
											{adminsSelect !== -1 && admins[adminsSelect].data.reports} шт.
										</button>
									</h1>
									<h2>Общее количество репортов, отвеченных за все время с момента назначения</h2>
								</section>
							</div>
						</section>
					</div>
				</div>
			</section>
			<section className="admin-body" style={menu !== "invitems" ? { display: "none" } : {}}>
				<div className="admin-body-top">
					<div className="admin-menu-title">
						<h1>
							Выдача
							<span>предметов инвентаря</span>
						</h1>
					</div>
					<div className="admin-body-search">
						<input onChange={(e) => adminSearch("invitems", e.target.value)} type="text" placeholder="Поиск по предметам" />
						<img src={IMG_SEARCH} />
					</div>
				</div>
				<div className="admin-body-wrap admin-invitems">
					<input className="admin-invitems-input input" placeholder="Введите ник персонажа, которому хотите выдать предмет" />
					<div className="admin-cmd admin-reports">
						{invitems.map((item, i) => {
							return (
								<section key={i} className="admin-reports-item" id={`admin-invitems-item-${i}`}>
									<div className="admin-reports-item-elem">
										<h1>{item.name}</h1>
										<h2>{item.desc}</h2>
									</div>
									<div className="admin-reports-item-elem" style={{ display: "none" }}>
										<input id={`admin-invitems-data`} type="text" placeholder="%Param%" maxlength="30" />
										<h2>Чета</h2>
									</div>
									<div className="admin-reports-item-elem">
										<button onClick={() => invitemsSend(item.id)} className="btn">
											Выдать
										</button>
									</div>
								</section>
							);
						})}
					</div>
				</div>
			</section>

			<section className="admin-body" style={menu !== "addproperty" ? { display: "none" } : {}}>
				<div className="admin-body-top">
					<div className="admin-menu-title">
						<h1>
							Добавление
							<span>нового имущества</span>
						</h1>
					</div>
				</div>
				<div className="admin-body-wrap admin-addproperty">
					<section className="admin-addproperty-item admin-addproperty-title">
						<h1>Выберите тип имущества</h1>
						<button onClick={() => setAddpropertyType(0)} className={`btn ${addpropertyType === 0 && "btn-select"}`}>
							Дом
						</button>
						<button onClick={() => setAddpropertyType(1)} className={`btn ${addpropertyType === 1 && "btn-select"}`}>
							Бизнес
						</button>
						<button onClick={() => setAddpropertyType(2)} className={`btn ${addpropertyType === 2 && "btn-select"}`}>
							Транспорт
						</button>
					</section>
					<section className="admin-addproperty-house" style={addpropertyType !== 0 ? { display: "none" } : {}}>
						<div className="admin-addproperty-item admin-addproperty-item-img">
							<img src={require("./images/house.png")} />
							<h1>Сейчас Вы создаете дом. Выберите все необходимые параметры для дома и нажмите Создать</h1>
						</div>

						<div className="admin-addproperty-item">
							<h1>Тип дома</h1>
							<button
								onClick={() => setAddpropertyHouse({ ...addpropertyHouse, type: 0 })}
								className={`btn ${addpropertyHouse.type === 0 && "btn-select"}`}
							>
								Обычный дом
							</button>
							<button
								onClick={() => setAddpropertyHouse({ ...addpropertyHouse, type: 1 })}
								className={`btn ${addpropertyHouse.type === 1 && "btn-select"}`}
							>
								Квартира
							</button>
						</div>
						<div className="admin-addproperty-item">
							<h1>Класс дома</h1>
							<button
								onClick={() => setAddpropertyHouse({ ...addpropertyHouse, class: 0 })}
								className={`btn ${addpropertyHouse.class === 0 && "btn-select"}`}
							>
								Стандарт
							</button>
							<button
								onClick={() => setAddpropertyHouse({ ...addpropertyHouse, class: 1 })}
								className={`btn ${addpropertyHouse.class === 1 && "btn-select"}`}
							>
								Люкс
							</button>
							<button
								onClick={() => setAddpropertyHouse({ ...addpropertyHouse, class: 2 })}
								className={`btn ${addpropertyHouse.class === 2 && "btn-select"}`}
							>
								Аппартаменты
							</button>
							<button
								onClick={() => setAddpropertyHouse({ ...addpropertyHouse, class: 3 })}
								className={`btn ${addpropertyHouse.class === 3 && "btn-select"}`}
							>
								Премиальный
							</button>
						</div>
						<div className="admin-addproperty-item">
							<h1>Стоимость дома</h1>
							<input
								onChange={(e) => setAddpropertyHouse({ ...addpropertyHouse, price: parseInt(e.target.value) })}
								type="number"
								className="input"
								placeholder="Пустое поле - рандомная стоимость от класса"
							/>
						</div>
						<div className="admin-addproperty-item" style={addpropertyHouse.type === 1 ? { display: "none" } : {}}>
							<h1>Гараж дома</h1>
							<button
								onClick={() => setAddpropertyHouse({ ...addpropertyHouse, garage: 0 })}
								className={`btn ${addpropertyHouse.garage === 0 && "btn-select"}`}
							>
								Нет гаража
							</button>
							<button
								onClick={() => setAddpropertyHouse({ ...addpropertyHouse, garage: 1 })}
								className={`btn ${addpropertyHouse.garage === 1 && "btn-select"}`}
							>
								Стандарт
							</button>
							<button
								onClick={() => setAddpropertyHouse({ ...addpropertyHouse, garage: 2 })}
								className={`btn ${addpropertyHouse.garage === 2 && "btn-select"}`}
							>
								Люкс
							</button>
							<button
								onClick={() => setAddpropertyHouse({ ...addpropertyHouse, garage: 3 })}
								className={`btn ${addpropertyHouse.garage === 3 && "btn-select"}`}
							>
								Премиальный
							</button>
						</div>
						<div className="admin-addproperty-item admin-addproperty-item-add">
							<button onClick={addProperty} className="btn">
								Создать дом
							</button>
						</div>
					</section>
					<section className="admin-addproperty-house" style={addpropertyType !== 1 ? { display: "none" } : {}}>
						<div className="admin-addproperty-item admin-addproperty-item-img">
							<img src={require("./images/business.png")} />
							<h1>Сейчас Вы создаете бизнес. Выберите все необходимые параметры для бизнеса и нажмите Создать</h1>
						</div>

						<div className="admin-addproperty-item">
							<h1>Тип бизнеса</h1>
							<button
								onClick={() => setAddpropertyBusiness({ ...addpropertyBusiness, type: 0 })}
								className={`btn ${addpropertyBusiness.type === 0 && "btn-select"}`}
							>
								24.7
							</button>
							<button
								onClick={() => setAddpropertyBusiness({ ...addpropertyBusiness, type: 1 })}
								className={`btn ${addpropertyBusiness.type === 1 && "btn-select"}`}
							>
								Аммунация
							</button>
							<button
								onClick={() => setAddpropertyBusiness({ ...addpropertyBusiness, type: 2 })}
								className={`btn ${addpropertyBusiness.type === 2 && "btn-select"}`}
							>
								Фастфуд
							</button>
							<button
								onClick={() => setAddpropertyBusiness({ ...addpropertyBusiness, type: 3 })}
								className={`btn ${addpropertyBusiness.type === 3 && "btn-select"}`}
							>
								Магазин одежды
							</button>
							<button
								onClick={() => setAddpropertyBusiness({ ...addpropertyBusiness, type: 4 })}
								className={`btn ${addpropertyBusiness.type === 4 && "btn-select"}`}
							>
								Автосалон
							</button>
							<button
								onClick={() => setAddpropertyBusiness({ ...addpropertyBusiness, type: 5 })}
								className={`btn ${addpropertyBusiness.type === 5 && "btn-select"}`}
							>
								Тюнинг салон
							</button>
						</div>
						<div className="admin-addproperty-item">
							<h1>Стоимость бизнеса</h1>
							<input
								onChange={(e) => setAddpropertyBusiness({ ...addpropertyBusiness, price: parseInt(e.target.value) })}
								type="number"
								className="input"
								placeholder="Пустое поле - рандомная стоимость от тима"
							/>
						</div>
						<div className="admin-addproperty-item admin-addproperty-item-add">
							<button onClick={addProperty} className="btn">
								Создать бизнес
							</button>
						</div>
					</section>
					<section className="admin-addproperty-house" style={addpropertyType !== 2 ? { display: "none" } : {}}>
						<div className="admin-addproperty-item admin-addproperty-item-img">
							<img src={require("./images/vehicle.png")} />
							<h1>Сейчас Вы создаете транспорт. Выберите все необходимые параметры для транспорта и нажмите Создать</h1>
						</div>

						<div className="admin-addproperty-item">
							<h1>Тип транспорта</h1>
							<button
								onClick={() => setAddpropertyVehicle({ ...addpropertyVehicle, type: 0 })}
								className={`btn ${addpropertyVehicle.type === 0 && "btn-select"}`}
							>
								Для игрока
							</button>
							<button
								onClick={() => setAddpropertyVehicle({ ...addpropertyVehicle, type: 1 })}
								className={`btn ${addpropertyVehicle.type === 1 && "btn-select"}`}
							>
								Для фракции
							</button>
							<button
								onClick={() => setAddpropertyVehicle({ ...addpropertyVehicle, type: 2 })}
								className={`btn ${addpropertyVehicle.type === 2 && "btn-select"}`}
							>
								Для бизнеса
							</button>
							<button
								onClick={() => setAddpropertyVehicle({ ...addpropertyVehicle, type: 3 })}
								className={`btn ${addpropertyVehicle.type === 3 && "btn-select"}`}
							>
								Аренда
							</button>
							<button
								onClick={() => setAddpropertyVehicle({ ...addpropertyVehicle, type: 4 })}
								className={`btn ${addpropertyVehicle.type === 4 && "btn-select"}`}
							>
								Государство (для всех)
							</button>
						</div>
						<div
							className="admin-addproperty-item"
							style={addpropertyVehicle.type === 4 || addpropertyVehicle.type === 3 ? { display: "none" } : {}}
						>
							<h1>Владелец транспорта</h1>
							<input
								onChange={(e) => setAddpropertyVehicle({ ...addpropertyVehicle, owner: parseInt(e.target.value) })}
								type="number"
								className="input"
								placeholder="Введите уникальный ID владельца (взависимости от типа)"
							/>
						</div>
						<div className="admin-addproperty-item">
							<h1>Стоимость транспорта</h1>
							<input
								onChange={(e) => setAddpropertyVehicle({ ...addpropertyVehicle, price: parseInt(e.target.value) })}
								type="number"
								className="input"
								placeholder="Обятазельное поле"
							/>
						</div>
						<div className="admin-addproperty-item admin-addproperty-item-add">
							<button onClick={addProperty} className="btn">
								Создать транспорт
							</button>
						</div>
					</section>
				</div>
			</section>
		</div>
	);
}
