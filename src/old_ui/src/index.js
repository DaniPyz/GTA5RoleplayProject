import "./index.css";
import "./_fonts/stylesheet.css";

import $ from "jquery";
import Admin from "./components/admin/Admin";
import Biz from "./components/biz/Biz";
import Captcha from "./components/captcha/Captcha";
import Choicechar from "./components/choicechar/Choicechar";
import Createchar from "./components/createchar/Createchar";
import Death from "./components/death/Death";
import Dialog from "./components/dialog/Dialog";
import House from "./components/house/House";
import Hud from "./components/hud/Hud";
import Interactionmenu from "./components/interactionmenu/Interactionmenu";
import Inventory from "./components/inventory/Inventory";
import Menu from "./components/menu/Menu";
import Notf from "./components/notf/Notf";
import Npcdialog from "./components/npcdialog/Npcdialog";
import Orgmanu from "./components/orgmenu/Orgmenu";
import Orgmenu from "./components/orgmenu/Orgmenu";
import Orgstockmenu from "./components/orgstockmenu/Orgstockmenu";
import Phone from "./components/phone/Phone";
// @ts-nocheck
import React from "react";
import ReactDOM from "react-dom/client";
import Registration from "./components/registration/Registration";
// import Rentdialog from './components/rentdialog/Rentdialog';
import Shop from "./components/shop/Shop";
import audio from "./_modules/audio";
import ragemp from "./_modules/ragemp";

let keyPressed = [];
$(document).on("keydown", (event) => {
	if (!$("*").is(":focus") && keyPressed.indexOf(event.keyCode) === -1) {
		keyPressed.push(event.keyCode);
		console.log(keyPressed);
		ragemp.send("ui::keypressed", {
			keyCode: keyPressed,
			up: false,
		});
	}
});
$(document).on("keyup", (event) => {
	if (!$("*").is(":focus")) {
		ragemp.send("ui::keypressed", {
			keyCode: event.keyCode,
			up: keyPressed.indexOf(event.keyCode) !== -1 ? true : false,
		});
	}
	if (keyPressed.indexOf(event.keyCode) !== -1) keyPressed.splice(keyPressed.indexOf(event.keyCode), 1);
});

$(document).on("keydown", "e+a", (event) => {
	console.log("event");
});

$("body").on("click", ".btn", (e) => {
	$(e.target).addClass("btn-clicked");
	setTimeout(() => {
		$(e.target).removeClass("btn-clicked");
	}, 200);
});

$("body").on("mousewheel", ".left-auto-scroll", (e, delta) => {
	console.log(e.offsetX);

	// @ts-ignore
	$(e.currentTarget).scrollLeft(e.offsetX);
	console.log($(e.currentTarget).scrollLeft());
	// e.preventDefault()
});

ragemp.eventCreate("client::audio", (cmd, data) => {
	switch (cmd) {
		case "play": {
			audio.play(data.url, data.settings);
			break;
		}
	}
});

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);

root.render(
	<React.StrictMode>
		<Registration />
		<Choicechar />
		<Createchar />

		<Notf />
		<Menu />
		<Admin />
		<Npcdialog />
		<Inventory />
		<Dialog />
		<Death />
		<Phone />
		<Interactionmenu />
		<Shop />
		<Orgmenu />
		<Orgstockmenu />
		<Captcha />
		<House />
		<Biz />
		<Hud />
	</React.StrictMode>
);

export { keyPressed };
