const { find_category, embedify, invalid_usage, count_commands, pluralize } = require("../Utils/");
const { CATEGORIES, PREFIX } = require("../Utils/constants.js");

exports.run = async (client, msg, args) => {
	if (args.length === 1) { // print out categories
		var str = "";
		for (var category in CATEGORIES) {
			var foundUnhidden = false;
			for (var command of CATEGORIES[category].cmds) {
				if (!command.config.hidden) { // check if we have any unhidden commands in a category
					foundUnhidden = true;
					break;
				}
			}
			if (foundUnhidden) {// do not print out empty categories or those with entirely hidden commands
				str += "• **" + CATEGORIES[category].name + "**\n";
			}
		}
		str += "\nUse **" + PREFIX + "cmds [category]** to view a category's commands\nUse **" + PREFIX + "cmds all** to view all commands";
		var embed = embedify("", CATEGORIES.MISC.color,
		[
			["Command Categories", str]
		], "", "", count_commands() + " " + pluralize("command", "commands", count_commands()), "", "", "", "");
		msg.channel.send({ embed: embed });
	}
	else if (args[1].toLowerCase() === "all") { // every category
		var embed = embedify("All Commands", CATEGORIES.MISC.color,
		[
			
		], "", "Type **" + PREFIX + "help [command]** to learn more", count_commands() + " " + pluralize("command", "commands", count_commands()), "", "", "", "");
		var catArray = [];
		for (var category in CATEGORIES) {
			catArray.push(CATEGORIES[category]);
		}
		catArray.sort((a, b) => {
			return b.cmds.length - a.cmds.length;
		});
		for (var category of catArray) {
			var foundUnhidden = false;
			for (var command of category.cmds) {
				if (!command.config.hidden) { // check if we have any unhidden commands in a category
					foundUnhidden = true;
					break;
				}
			}
			if (foundUnhidden) { // do not print out empty or entirely hidden categories
				const catStr = "**__" + category.shortname + "__**\n";
				var cmdStr = "";
				for (var command of category.cmds) {
					if (!command.config.hidden) { // do not print out hidden commands
						cmdStr += "• **" + command.help.name + "**\n";
					}
				}
				embed.addField(catStr, cmdStr, true);
			}
		}
		msg.channel.send({ embed: embed });
	}
	else { // just one category
		var category = find_category(args[1]);
		if (!category) {
			return msg.channel.send({ embed: invalid_usage(this) });
		}
		var str = "";
		for (var command of CATEGORIES[category].cmds) {
			if (!command.config.hidden) { // do not print out hidden commands
				str += "• **" + command.help.name + "**\n";
			}
		}
		str += "\nType **" + PREFIX + "help [command]** to learn more";
		var embed = embedify("", CATEGORIES[category].color,
		[
			[CATEGORIES[category].name + " Commands", CATEGORIES[category].desc + "\n" + str]
		], "", "", count_commands(category) + " " + pluralize("command", "commands", count_commands(category)), "", "", "", "");
		msg.channel.send({ embed: embed });
	}
};

exports.config = {
	delete: false,
	hidden: false,
}

exports.help = {
	name: "commands",
	aliases: ["cmds", "commandslist", "cmdslist"],
	category: "Miscellaneous",
	description: "Prints out a list of commands",
	usage: "cmds (category/all)"
};