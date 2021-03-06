const { embedify, invalid_usage, get_role_array, format_role } = require("../Utils/");
const { CATEGORIES } = require("../Utils/constants.js");

exports.run = async (client, msg, args) => {
	if (args.length < 2) {
		return msg.channel.send({ embed: invalid_usage(this) });
	}
	const nums = args[1].split(',').map(n => Number(n));
	for (var num of nums) {
		if (isNaN(num) || !Number.isInteger(num) || num < 0) {
			return msg.channel.send("Numbers must be non-negative integers");
		}
	}
	const doId = (args[2] && args[2].toLowerCase() === "id");
	var roleArray = [];
	for (var role of get_role_array(msg.guild)) {
		if (nums.includes(role.members.size)) {
			roleArray.push(role);
		}
	}
	roleArray.sort((a, b) => {
		return b.members.size - a.members.size;
	});
	var str = "";
	for (var role of roleArray) {
		str += "(" + role.members.size + ") " + format_role(role, doId, true) + "\n";
	}
	if (str === "") {
		str = "None";
	}
	var embed = embedify("", CATEGORIES.INFO.color,
	[
		["Counted Roles", str, true, "\n"],
	], "", "", "", "", "", "", "");
	msg.channel.send({ embed: embed });
};

exports.config = {
	delete: false,
	hidden: false,
};

exports.help = {
	name: "rolecount",
	aliases: ["rc"],
	category: "Info",
	description: "Lists all roles with a specific number of people in them",
	usage: "rolecount (1,2,3) (id)"
};