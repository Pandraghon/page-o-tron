(() => {
	
	const categoriesSelect = document.getElementById('category');
	const entriesDatalist = document.getElementById('entries');
	const entryInput = document.getElementById('entry');
	const debugTextarea = document.getElementById('debug');
	const codeTextarea = document.getElementById('code');
	const pageTitle = document.getElementById('pageTitle');
	const copyButton = document.getElementById('copy');
	const wikiLink = document.getElementById('wiki');
	const wikiAlert = document.getElementById('wikiAlert');

	const rarityMapping = {
		Junk: 'inutile',
		Basic: 'commun',
		Fine: 'raffiné',
		Masterwork: 'chef d\'oeuvre',
		Rare: 'rare',
		Exotic: 'exotique',
		Ascended: 'élevé',
		Legendary: 'légendaire'
	};

	const itemTypeMapping = {
		Armor: 'armure',
		Back: 'dos',
		Bag: 'sac',
		Consumable: '',
		Container: 'Conteneur',
		CraftingMaterial: '',
		Gathering: '',
		Gizmo: '',
		Key: '',
		MiniPet: '',
		Tool: '',
		Trait: '',
		Trinket: '',
		Trophy: '',
		UpgradeComponent: '',
		Weapon: '',
	};

	const itemBoxTypeMapping = {
		Armor: 'armure',
		MiniPet: 'mini',
		Weapon: 'arme',
	};

	const masteryMapping = {
		Tyria: 'Tyrie',
		Maguuma: 'Maguuma',
		Desert: 'Désert',
		Tundra: 'Givre',
		Cantha: 'Cantha',
		Unknown: 'Cantha'
	};

	const itemTypeParser = {
		Trophy: (type, boxType, data, body) => {
			type = 'trophée';
		},
		Armor: (type, boxType, data, body) => {
			type = 'armure';
			boxType = 'armure';

			boxLines = [];

			switch (data.details.weight_class) {
				case 'Heavy':
					type = 'lourd';
					break;
				case 'Medium':
					type = 'intermédiaire';
					break;
				case 'Light':
					type = 'léger';
					break;
			}
			
			switch (data.details.type) {
				case 'Boots':
					boxLines.push('| emplacement = pieds');
					break;
				case 'Coat':
					boxLines.push('| emplacement = torse');
					break;
				case 'Gloves':
					boxLines.push('| emplacement = mains');
					break;
				case 'Helm':
				case 'HelmAquatic':
					boxLines.push('| emplacement = tête');
					break;
				case 'Leggings':
					boxLines.push('| emplacement = jambes');
					break;
				case 'Shoulders':
					boxLines.push('| emplacement = épaules');
					break;
			}

			return boxLines;
		},
		Back: (type, boxType, data, body) => {
			type = 'dos';
			boxType = 'accessoire';
		},
		Bag: (type, boxType, data, body) => {
			type = 'sac';
		},
		Consumable: (type, boxType, data, body) => {
			type = 'consommable';

			if (data.name.startsWith('Coup de grâce')) type = 'coup de grâce';
			else if (data.details.unlock_type === 'Ms') type = 'monture';
		},
		Container: (type, boxType, data, body) => {
			type = 'conteneur';

			body.push('== Contient ==');
			body.push('{{...}}');
		},
		CraftingMaterial: (type, boxType, data, body) => {
			type = 'matériau d\'artisanat';

			if (data.name.startsWith('Insigne')) type = 'insigne';
			else if (data.name.startsWith('Inscription')) type = 'inscription';
		},
		Gathering: (type, boxType, data, body) => {
			type = 'outil de récolte';
		},
		Gizmo: (type, boxType, data, body) => {
			type = 'gizmo';
		},
		MiniPet: (type, boxType, data, body) => {
			type = 'miniature';
			boxType = 'miniature';
		},
		Tool: (type, boxType, data, body) => {
			type = 'outil de recyclage';
		},
		Trinket: (type, boxType, data, body) => {
			type = 'colifichet';
			boxType = 'accessoire';

			switch (data.details) {
				case 'Amulet':
					type = 'amulette';
					break;
				case 'Ring':
					type = 'anneau';
					break;
				case 'Accessory':
					type = 'accessoire';
					break;
			}
		},
		UpgradeComponent: (type, boxType, data, body) => {
			type = 'amélioration';
		},
		Weapon: (type, boxType, data, body) => {
			type = 'arme';
			boxType = 'arme';

			switch (data.details.type) {
				case 'Axe':
					type = 'hache';
					break;
				case 'Dagger':
					type = 'dague';
					break;
				case 'Mace':
					type = 'masse';
					break;
				case 'Pistol':
					type = 'pistolet';
					break;
				case 'Scepter':
					type = 'sceptre';
					break;
				case 'Focus':
					type = 'focus';
					break;
				case 'Shield':
					type = 'bouclier';
					break;
				case 'Sword':
					type = 'épée';
					break;
				case 'Torch':
					type = 'torche';
					break;
				case 'Warhorn':
					type = 'cor de guerre';
					break;
				case 'Greatsword':
					type = 'espadon';
					break;
				case 'Hammer':
					type = 'marteau';
					break;
				case 'LongBow':
					type = 'arc long';
					break;
				case 'Rifle':
					type = 'fusil';
					break;
				case 'ShortBow':
					type = 'arc court';
					break;
				case 'Staff':
					type = 'bâton';
					break;
				case 'Harpoon':
					type = 'lance';
					break;
				case 'Speargun':
					type = 'fusil-harpon';
					break;
				case 'Trident':
					type = 'trident';
					break;
			}
		},
	};

	const itemUnlockParser = {
		CraftingRecipe: (type, boxType, data, body) => {
			type = 'recette';
			/* */
		},
		Outfit: (type, boxType, data, body) => {
			type = 'tenue';
		},
		Dye: (type, boxType, data, body) => {
			boxType = 'teinture';
			/* */
		},
		GliderSkin: (type, boxType, data, body) => {
			type = 'deltaplane';
		},
		Champion: (type, boxType, data, body) => {
			type = 'champion des brumes';
		},
	};

	const itemDetailsParser = {
		Default: (type, boxType, data, body) => {
			if (data.details.infusion_upgrade_flags) {
				type = 'infusion';
				boxType = 'amélioration';
				/* */
			}
		},
		Rune: (type, boxType, data, body) => {
			type = 'rune';
			boxType = 'amélioration';
		},
		Sigil: (type, boxType, data, body) => {
			type = 'cachet';
			boxType = 'amélioration';
		},
		Transmutation: (type, boxType, data, body) => {
			type = 'apparence';
		},
		Immediate: (type, boxType, data, body) => {
			type = 'services';
		},
		Utility: (type, boxType, data, body) => {
			type = 'utilitaire';
		},
		Food: (type, boxType, data, body) => {
			type = 'nourriture';
		},
		Gem: (type, boxType, data, body) => {
			type = 'pierre précieuse';
		},
		Booze: (type, boxType, data, body) => {
			type = 'alcool';
		},
	}

	const categoryParser = {
		items: async (data) => {
			let boxLines = [],
				body = [],
				boxType = 'objet',
				type = false;

			if (data.type in itemTypeParser) boxLines = itemTypeParser(type, boxType, data, body) || [];
			if (data.details.unlock_type in itemUnlockParser) boxLines.concat(itemUnlockParser(data.details.unlock_type) || []);
			if (data.details.type in itemDetailsParser) boxLines.concat(itemDetailsParser(data.details.type) || []);

			if (type) boxLines.splice(0, 0, `| type = ${type}`);

			if (data.description) boxLines.push(`| description = ${data.description}`);
			if (data.rarity) boxLines.push(	`| rareté = ${rarityMapping[data.rarity]}`);
			if (data.level) boxLines.push(`| niveau = ${data.level}`);
			if (data.vendor_value) boxLines.push(`| valeur = ${data.vendor_value}`);

			if (data.flags.indexOf('AccountBound') !== -1) {
				boxLines.push('| lié = ca');
				if (data.flags.indexOf('SoulBindOnUse') !== -1) boxLines.push('| lié2 = au');
			}
			else if (data.flags.indexOf('AccountBindOnUse') !== -1) boxLines.push('| lié = cu');
			else if (data.flags.indexOf('SoulbindOnAcquire') !== -1) boxLines.push('| lié = aa');
			else if (data.flags.indexOf('SoulBindOnUse') !== -1) boxLines.push('| lié = au');

			body.push(...[
				`{{Liste de modes d'acquisition}}`,
				`{{liste de recettes par ingrédient}}`,
			])

			return [
				`{{Infobox ${boxType}`,
				...boxLines,
				`| id = ${data.id}`,
				`}}`,
				``,
				...body,
				``,
			];
		},
		achievements_categories: async (data) => {
			let achievementsLines = [],
				achievementsLinesData = [],
				body = [],
				intro = [`[[Fichier:{{PAGENAME}}.png|left|40px]] [[{{PAGENAME}}]] est une catégorie de [[succès]] de [[...]].`];

			for (let achievementId of data.achievements) {
				await fetch(`https://api.guildwars2.com/v2/achievements/${achievementId}?lang=fr`)
					.then(res => res.json())
					.then(async res => {
						const achievementsLine = [
							`{{Table de succès/ligne`,
							`| nom = ${res.name}`
						];

						if (res.flags.indexOf('CategoryDisplay') !== -1) achievementsLine.push(`| type = meta`);
						else if (res.flags.indexOf('Repeatable') !== -1) achievementsLine.push(`| type = répétable`);
						
						if (res.point_cap) achievementsLine.push(`| max points = ${res.point_cap}`);
						if (res.description) achievementsLine.push(`| sous_desc = ${res.description}`);
						if (res.requirement) achievementsLine.push(`| description = ${res.requirement}`);

						achievementsLine.push(`| paliers = ${res.tiers.map(tier => `... : ${tier.count} ; ${tier.points}`).join('\n')}`);

						for (let reward of (res.rewards || [])) {
							switch (reward.type) {
								case 'Coins':
									achievementsLine.push(`| pièces = ${reward.count}`);
									break;
								case 'Mastery':
									achievementsLine.push(`| point de maîtrise = ${masteryMapping[reward.region]}`);
									break;
								case 'Title':
									await fetch(`https://api.guildwars2.com/v2/titles/${reward.id}?lang=fr`)
										.then(res => res.json())
										.then(res => {
											achievementsLine.push(`| titre = ${res.name}`);
										})
										.catch(console.error);
									break;
							}
						}
							
						achievementsLine.push(
							`}}`
						);
						achievementsLinesData.push({
							data: res,
							code: achievementsLine
						});
					})
					.catch(console.error);
			}

			achievementsLines = achievementsLines.concat(...(achievementsLinesData.sort((a, b) => {
				// display meta first
				if (a.data.flags.indexOf('CategoryDisplay') !== -1) return -1;
				if (b.data.flags.indexOf('CategoryDisplay') !== -1) return 1;

				// sort by name
				if (a.data.name < b.data.name)  return -1;
				if (a.data.name > b.data.name) return 1;

				return 0;
			}).map(e => e.code)));

			body.push(...[
				`{{Navigation succès}}`,
				``,
				`[[Catégorie:Succès]]`
			])

			return [
				...intro,
				``,
				`== Liste des succès ==`,
				`{{Table de succès | icône = {{PAGENAME}}.png}}`,
				...achievementsLines,
				`|}`,
				``,
				...body,
				``,
			];
		},
		titles: async (data) => {
			const { achievements } = data;
			const achievementsData = await fetch(`https://api.guildwars2.com/v2/achievements?ids=${achievements.join(',')}&lang=fr`).then(res => res.json());
			return [`${data.name} - Obtenu en terminant le(s) succès ${achievementsData.map(a => a.name).join(', ')}`];
		}
	};

	categoriesSelect.addEventListener('change', () => {
		const category = categoriesSelect.options[categoriesSelect.selectedIndex].value;
		fetch(`https://raw.githubusercontent.com/Pandraghon/gw2api-namesearch/master/fr/${category}.csv`)
			.then(res => res.text())
			.then(res => {
				const lines = res.split('\n');
				entriesDatalist.innerHTML = '';
				const frag = document.createDocumentFragment();
				for (let i = 0, imax = lines.length ; i < imax ; i++) {
					if (!lines[i]) continue;
					const line_data = lines[i].match(/(".*"),(\d+)/);
					const option = document.createElement('option');
					Object.assign(option, {
						value: `[${line_data[2]}] ${JSON.parse(line_data[1])}`
					});
					frag.append(option);
				}
				codeTextarea.value = '';
				entryInput.value = '';
				entriesDatalist.append(frag);
			})
			.catch(console.error);
	});
	categoriesSelect.dispatchEvent(new Event('change', { 'bubbles': true }))

	document.querySelector('form').addEventListener('submit', (event) => {
		event.preventDefault();
		const sanitizedCategory = categoriesSelect.options[categoriesSelect.selectedIndex].value;
		const category = sanitizedCategory?.replace(/_/g, '/');
		let entry = entryInput.value;
		if (/^\d+$/.test(entry)) {
			entry = Number(entry);
		} else if (/^\[\d+\] .*$/.test(entry)) {
			entry = entry.match(/^\[(\d+)\] .*$/)[1];
		}
		fetch(`https://api.guildwars2.com/v2/${category}/${entry}?lang=fr`)
			.then(res => res.json())
			.then(async res => {
				debugTextarea.value = JSON.stringify(res);
				if (!('id' in res)) {
					codeTextarea.value = 'ID non trouvé';
					return;
				}
				pageTitle.innerText = res.name ?? '';
				wikiLink.href = `https://wiki-fr.guildwars2.com/index.php?title=${res.name}&action=edit`;
				wikiLink.innerText = res.name;
				copyButton.classList.remove('btn-success');
				copyButton.classList.add('btn-primary');
				const generatedText = await categoryParser[sanitizedCategory](res);
				for (let interLang of ['de', 'en', 'es']) {
					await fetch(`https://api.guildwars2.com/v2/${category}/${entry}?lang=${interLang}`)
						.then(res => res.json())
						.then(res => {
							generatedText.push(`[[${interLang}:${res.name}]]`);
						})
						.catch(console.error);
				}
				codeTextarea.value = generatedText.join('\n');
				copyButton.hidden = false;
				wikiAlert.hidden = false;
			})
			.catch(console.error);
		return false;
	});

	copyButton.addEventListener('click', () => {
		navigator.clipboard.writeText(codeTextarea.value)
			.then(() => {
				copyButton.classList.remove('btn-primary');
				copyButton.classList.add('btn-success');
			})
			.catch(console.error);
	});

})();
