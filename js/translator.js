$(document).ready( function () {

	// common translations
	$("#header-menu").find("a").eq(0).text(nav_button_blog);
	$("#header-menu").find("a").eq(1).text(nav_button_wardrobe);
	$("#header-menu").find("a").eq(2).text(nav_button_profile);
	$("#header-menu").find("a").eq(3).text(nav_button_archive);
	$("#header-menu").find("a").eq(4).text(nav_button_support);
	$("#fb-icon").find("a").attr("title", nav_fb_title);
	$("#change-server").attr("title", change_server);
	$(".news-main.disabled").text(nav_notification);
	$("#footer-links li").eq(1).find("a").text(nav_report);

	// home translations
	if ((window.location.href).includes("/home")) {
		$("title").html(home_page_title);
		$(".index-bio-title").text(main_card_title);
		$(".index-bio-description").text(main_card_desc);
		$(".index-button a").text(main_card_button);

		$("#index-generate .input-label").text(load_label);
		$("#input-code").attr("placeholder", load_input);
		$("#load-code").attr("value", load_button);
		$(".tile-title").text(updates_title);

		$("#portrait-header").text(featured_title);
	};

	// wardrobe translations
	if ((window.location.href).includes("/wardrobe")) {
		$("title").html(wardrobe_page_title);
		$(".page-main-container h1").prepend(wardrobe_content_title);

		$("#filter-bodyLocationOptions option").eq(0).text(filter_category_default);
		$("#filter-bodyLocationOptions option").eq(1).text(filter_category_underwear);
		$("#filter-bodyLocationOptions option").eq(2).text(filter_category_skin);
		$("#filter-bodyLocationOptions option").eq(3).text(filter_category_tatoo);
		$("#filter-bodyLocationOptions option").eq(4).text(filter_category_mouth);
		$("#filter-bodyLocationOptions option").eq(5).text(filter_category_eyes);
		$("#filter-bodyLocationOptions option").eq(6).text(filter_category_hair);
		$("#filter-bodyLocationOptions option").eq(7).text(filter_category_socks);
		$("#filter-bodyLocationOptions option").eq(8).text(filter_category_shoes);
		$("#filter-bodyLocationOptions option").eq(9).text(filter_category_pants);
		$("#filter-bodyLocationOptions option").eq(10).text(filter_category_handAccessory);
		$("#filter-bodyLocationOptions option").eq(11).text(filter_category_top);
		$("#filter-bodyLocationOptions option").eq(12).text(filter_category_coat);
		$("#filter-bodyLocationOptions option").eq(13).text(filter_category_glove);
		$("#filter-bodyLocationOptions option").eq(14).text(filter_category_necklace);
		$("#filter-bodyLocationOptions option").eq(15).text(filter_category_dress);
		$("#filter-bodyLocationOptions option").eq(16).text(filter_category_hat);
		$("#filter-bodyLocationOptions option").eq(17).text(filter_category_faceAccessory);
		$("#filter-bodyLocationOptions option").eq(18).text(filter_category_background);
		$("#filter-bodyLocationOptions option").eq(19).text(filter_category_belt);
		$("#filter-bodyLocationOptions option").eq(20).text(filter_category_ambient);

		$("#filter-guardOptions option").eq(0).text(filter_special_default);
		$("#filter-guardOptions optgroup").eq(0).attr("label", filter_special_guards_title);
		$("#filter-guardOptions option").eq(1).text(filter_special_guard_obsidiana);
		$("#filter-guardOptions option").eq(2).text(filter_special_guard_absenta);
		$("#filter-guardOptions option").eq(3).text(filter_special_guard_sombra);
		$("#filter-guardOptions optgroup").eq(1).attr("label", filter_special_unlock_title);
		$("#filter-guardOptions option").eq(4).text(filter_special_unlock_episode);
		$("#filter-guardOptions option").eq(5).text(filter_special_unlock_spinoff);
		$("#filter-guardOptions optgroup").eq(2).attr("label", filter_special_other_title);
		$("#filter-guardOptions option").eq(6).text(filter_special_other_prize);
		$("#filter-guardOptions option").eq(7).text(filter_special_other_alchemy);
		$("#filter-guardOptions option").eq(8).text(filter_special_other_bindle);
		$("#filter-guardOptions option").eq(9).text(filter_special_other_antique);

		$("#filter-rarityOptions option").eq(0).text(filter_rarity_default);
		$("#filter-rarityOptions option").eq(1).text(filter_rarity_common);
		$("#filter-rarityOptions option").eq(2).text(filter_rarity_rare);
		$("#filter-rarityOptions option").eq(3).text(filter_rarity_epic);
		$("#filter-rarityOptions option").eq(4).text(filter_rarity_legendary);
		$("#filter-rarityOptions option").eq(5).text(filter_rarity_event);
		$("#filter-rarityOptions option").eq(6).text(filter_order_default);
		$("#filter-rarityOptions option").eq(7).text(filter_order_oldest);

		$("#filter-orderOptions option").eq(0).text(filter_order_default);
		$("#filter-orderOptions option").eq(1).text(filter_order_oldest);
		$("#filter").attr("value", filter_button);

		$(".marketplace-itemDetail-opt").eq(0).text(canvas_button_back);
		$(".marketplace-itemDetail-opt").eq(1).text(canvas_button_front);
		//$(".marketplace-itemDetail-set").eq(0).text(canvas_button_set);

		$("#link-profile .button").text(button_generate);
		$("#footer-info").text(footer_loading);

		$("#filter-help").attr("title", button_help_title);
		$("#popup-container .popup-title").text(button_help_title);
		$("#popup-container p").eq(0).text(help_panel_p);
		$("#popup-container h4").eq(0).text(help_panel_code_title);
		$("#popup-container p").eq(1).text(help_panel_code_info);
		$("#popup-container h4").eq(1).text(help_panel_rainbow_title);
		$("#popup-container p").eq(2).html(help_panel_rainbow_info);
		$("#popup-container h4").eq(2).text(help_panel_opal_title);
		$("#popup-container p").eq(3).html(help_panel_opal_info);
		$("#popup-container h4").eq(3).text(help_panel_event_title);
		$("#popup-container p").eq(4).html(help_panel_event_info);
		$("#popup-container p").eq(5).html(help_panel_event_extra);
	};

	// profile translations
	if ((window.location.href).includes("/profile")) {
		$("title").html(profile_page_title);
		$(".page-main-container h1").prepend(profile_content_title);

		$("#edit-code").text(profile_button_edit);
		$("#reload").text(profile_button_reload);
		$("#border-rad").text(profile_button_corners);
		$("#get-code").text(profile_button_get_code);
		$("#get-portrait").text(profile_button_save);

		$("#left-info-tab h3").eq(0).text(panel_left_title_one);
		$(".bonus-container form").eq(0).prepend(panel_left_pet_label + ": ");
		$("#check-player-span").append("&nbsp;" + panel_left_pet_check);
		$(".bonus-container form").eq(1).prepend(panel_left_friend_label + ": ");
		$("#button-centrar").val(panel_left_friend_button);

		$("#input-url").attr("placeholder", panel_left_friend_link)
		$(".bonus-container").eq(1).find("form").eq(2).prepend(panel_left_pet_label + ": ");
		$("#load-url").val(panel_left_load_url);

		$("#left-info-tab h3").eq(1).text(panel_left_title_two);
		$("#check-friend-span").append("&nbsp;" + panel_left_pet_check);

		$(".bonus-container").eq(2).find("span").text(panel_left_position_title);
		$(".bonus-container").eq(2).find("form").prepend(panel_left_position_label + ": ");
		$("#position-bajar").val(panel_left_position_button_back);
		$("#position-subir").val(panel_left_position_button_front);

		$(".bonus-container").eq(3).find("div").html(panel_left_load_info);
		$("#input-code").attr("placeholder", load_input);
		$("#load-code").val(load_button);

		$("#profile span b").text(panel_right_title);
		$("#profile span").append(panel_right_p_one + '<br><br>' + panel_right_p_two + '<br><br>' + panel_right_p_three
			+ '<br><br>' + panel_right_p_four + '<br><br>' + panel_right_p_five + '<br><br>' + panel_right_p_six);

		$("#footer-info").text(footer_loading);
	};

	// archive translations
	if ((window.location.href).includes("/archive")) {
		$("title").html(archive_page_title);
		$(".page-main-container h1").prepend(archive_content_title);
		$("#new-post").text(submit_button);

		$("#menu-featured li").text(menu_left_featured);
		$("#menu-all li").text(menu_left_all);
		$("#menu-guardians li").text(menu_left_guardians);
		$("#menu-cosplay li").text(menu_left_cosplay);
		$("#ranking h2").text(ranking_title);
		$("#ranking").attr("title", ranking_info);

	}

	// support translations
	if ((window.location.href).includes("/support")) {
		$("title").html(support_page_title);
		$(".page-main-container h1").prepend(support_content_title);

		$("#menu-general li").text(menu_left_general);
		$("#menu-wardrobe li").text(menu_left_wardrobe);
		$("#menu-profile li").text(menu_left_profile);
		$("#menu-contests li").text(menu_left_activities);
	};
});


// extra wardrobe functions
function esToLang(name) {
	// Recibe nombre en español, devuelve traducción
	switch(name) {
		case "Ropa interior": return filter_category_underwear;
		case "Pieles": return filter_category_skin;
		case "Tatuajes": return filter_category_tatoo;
		case "Bocas": return filter_category_mouth;
		case "Ojos": return filter_category_eyes;
		case "Cabello": return filter_category_hair;
		case "Calcetines": return filter_category_socks;
		case "Zapatos": return filter_category_shoes;
		case "Pantalones": return filter_category_pants;
		case "Accesorios manos": return filter_category_handAccessory;
		case "Partes de arriba": return filter_category_top;
		case "Abrigos": return filter_category_coat;
		case "Guantes": return filter_category_glove;
		case "Collares": return filter_category_necklace;
		case "Vestidos": return filter_category_dress;
		case "Sombreros": return filter_category_hat;
		case "Accesorios cara": return filter_category_faceAccessory;
		case "Fondos": return filter_category_background;
		case "Cinturones": return filter_category_belt;
		case "Ambientes": return filter_category_ambient;

		case "Predeterminado": return card_info_default;
		case "Tienda": return card_info_shop;
		case "Exploración": return card_info_exp;
		case "Exploración exclusiva": return card_info_exclusive_exp;
		case "Costales": return card_info_bindle;
		case "Tienda Antigua": return card_info_antique;
		case "Alquimia": return card_info_alchemy;
		case "Spin-off": return card_info_spinoff;
		case "Premio BETA tester": return card_info_beta;
		case "Premio del mes": return card_info_month;
	};

	if (name.includes("1 de Abril")) return name.replace("1 de Abril", card_event_aprils_fool);
	if (name.includes("1 de Mayo")) return name.replace("1 de Mayo", card_event_may);
	if (name.includes("San Valentín")) return name.replace("San Valentín", card_event_valentine);
	if (name.includes("Pascua")) return name.replace("Pascua", card_event_easter);
	if (name.includes("Música")) return name.replace("Música", card_event_music);
	if (name.includes("Japan Expo")) return name.replace("Japan Expo", card_event_japan);
	if (name.includes("Pride Month")) return name.replace("Pride Month", card_event_pride);
	if (name.includes("Verano")) return name.replace("Verano", card_event_summer);
	if (name.includes("Halloween")) return name.replace("Halloween", card_event_halloween);
	if (name.includes("Black Friday")) return name.replace("Black Friday", card_event_bf);
	if (name.includes("Navidad")) return name.replace("Navidad", card_event_christmas);
	if (name.includes("Episodio")) return name.replace("Episodio", card_info_episode);
};

function langToEs(name) {
	// Recibe nombre en *idioma* devuelve en español
	switch(name) {
		case filter_category_underwear: return"Ropa interior";
		case filter_category_skin: return"Pieles";
		case filter_category_tatoo: return"Tatuajes";
		case filter_category_mouth: return"Bocas";
		case filter_category_eyes: return"Ojos";
		case filter_category_hair: return"Cabello";
		case filter_category_socks: return"Calcetines";
		case filter_category_shoes: return"Zapatos";
		case filter_category_pants: return"Pantalones";
		case filter_category_handAccessory: return"Accesorios manos";
		case filter_category_top: return"Partes de arriba";
		case filter_category_coat: return"Abrigos";
		case filter_category_glove: return"Guantes";
		case filter_category_necklace: return"Collares";
		case filter_category_dress: return"Vestidos";
		case filter_category_hat: return"Sombreros";
		case filter_category_faceAccessory: return"Accesorios cara";
		case filter_category_background: return"Fondos";
		case filter_category_belt: return"Cinturones";
		case filter_category_ambient: return"Ambientes";

		case card_info_default: return "Predeterminado";
		case card_info_shop: return "Tienda";
		case card_info_exp: return "Exploración";
		case card_info_exclusive_exp: return "Exploración exclusiva";
		case card_info_bindle: return "Costales";
		case card_info_antique: return "Tienda Antigua";
		case card_info_alchemy: return "Alquimia";
		case card_info_spinoff: return "Spin-off";
		case card_info_beta: return "Premio BETA tester";
		case card_info_month: return "Premio del mes";

	};

	if (name.includes(card_event_aprils_fool)) return name.replace(card_event_aprils_fool, "1 de Abril");
	if (name.includes(card_event_may)) return name.replace(card_event_may, "1 de Mayo");
	if (name.includes(card_event_valentine)) return name.replace(card_event_valentine, "San Valentín");
	if (name.includes(card_event_easter)) return name.replace(card_event_easter, "Pascua");
	if (name.includes(card_event_music)) return name.replace(card_event_music, "Música");
	if (name.includes(card_event_japan)) return name.replace(card_event_japan, "Japan Expo");
	if (name.includes(card_event_pride)) return name.replace(card_event_pride, "Pride Month");
	if (name.includes(card_event_summer)) return name.replace(card_event_summer, "Verano");
	if (name.includes(card_event_halloween)) return name.replace(card_event_halloween, "Halloween");
	if (name.includes(card_event_bf)) return name.replace(card_event_bf, "Black Friday");
	if (name.includes(card_event_christmas)) return name.replace(card_event_christmas, "Navidad");
	if (name.includes(card_info_episode)) return name.replace(card_info_episode, "Episodio");
};