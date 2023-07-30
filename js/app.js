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
		Trophy: (_) => {
			_.type = 'trophée';
			return _;
		},
		Armor: (_) => {
			_.type = 'armure';
			_.boxType = 'armure';

			switch (_.data.details.weight_class) {
				case 'Heavy':
					_.type = 'lourd';
					break;
				case 'Medium':
					_.type = 'intermédiaire';
					break;
				case 'Light':
					_.type = 'léger';
					break;
			}
			
			switch (_.data.details.type) {
				case 'Boots':
					_.boxLines.push('| emplacement = pieds');
					break;
				case 'Coat':
					_.boxLines.push('| emplacement = torse');
					break;
				case 'Gloves':
					_.boxLines.push('| emplacement = mains');
					break;
				case 'Helm':
				case 'HelmAquatic':
					_.boxLines.push('| emplacement = tête');
					break;
				case 'Leggings':
					_.boxLines.push('| emplacement = jambes');
					break;
				case 'Shoulders':
					_.boxLines.push('| emplacement = épaules');
					break;
			}

			return _;
		},
		Back: (_) => {
			_.type = 'dos';
			_.boxType = 'accessoire';
			return _;
		},
		Bag: (_) => {
			_.type = 'sac';
			return _;
		},
		Consumable: (_) => {
			_.type = 'consommable';

			if (_.data.name.startsWith('Coup de grâce')) _.type = 'coup de grâce';
			else if (_.data.details.unlock_type === 'Ms') _.type = 'monture';
			return _;
		},
		Container: (_) => {
			_.type = 'conteneur';

			_.body.push('== Contient ==');
			_.body.push('{{...}}');
			return _;
		},
		CraftingMaterial: (_) => {
			_.type = 'matériau d\'artisanat';

			if (_.data.name.startsWith('Insigne')) _.type = 'insigne';
			else if (_.data.name.startsWith('Inscription')) _.type = 'inscription';
			return _;
		},
		Gathering: (_) => {
			_.type = 'outil de récolte';
			return _;
		},
		Gizmo: (_) => {
			_.type = 'gizmo';
			return _;
		},
		MiniPet: (_) => {
			_.type = 'miniature';
			_.boxType = 'miniature';
			return _;
		},
		Tool: (_) => {
			_.type = 'outil de recyclage';
			return _;
		},
		Trinket: (_) => {
			_.type = 'colifichet';
			_.boxType = 'accessoire';

			switch (_.data.details) {
				case 'Amulet':
					_.type = 'amulette';
					break;
				case 'Ring':
					_.type = 'anneau';
					break;
				case 'Accessory':
					_.type = 'accessoire';
					break;
			}
			return _;
		},
		UpgradeComponent: (_) => {
			_.type = 'amélioration';
			return _;
		},
		Weapon: (_) => {
			_.type = 'arme';
			_.boxType = 'arme';

			switch (_.data.details.type) {
				case 'Axe':
					_.type = 'hache';
					break;
				case 'Dagger':
					_.type = 'dague';
					break;
				case 'Mace':
					_.type = 'masse';
					break;
				case 'Pistol':
					_.type = 'pistolet';
					break;
				case 'Scepter':
					_.type = 'sceptre';
					break;
				case 'Focus':
					_.type = 'focus';
					break;
				case 'Shield':
					_.type = 'bouclier';
					break;
				case 'Sword':
					_.type = 'épée';
					break;
				case 'Torch':
					_.type = 'torche';
					break;
				case 'Warhorn':
					_.type = 'cor de guerre';
					break;
				case 'Greatsword':
					_.type = 'espadon';
					break;
				case 'Hammer':
					_.type = 'marteau';
					break;
				case 'LongBow':
					_.type = 'arc long';
					break;
				case 'Rifle':
					_.type = 'fusil';
					break;
				case 'ShortBow':
					_.type = 'arc court';
					break;
				case 'Staff':
					_.type = 'bâton';
					break;
				case 'Harpoon':
					_.type = 'lance';
					break;
				case 'Speargun':
					_.type = 'fusil-harpon';
					break;
				case 'Trident':
					_.type = 'trident';
					break;
			}
			return _;
		},
	};

	const itemUnlockParser = {
		CraftingRecipe: (_) => {
			_.type = 'recette';
			/* */
			return _;
		},
		Outfit: (_) => {
			_.type = 'tenue';
			return _;
		},
		Dye: (_) => {
			_.boxType = 'teinture';
			/* */
			return _;
		},
		GliderSkin: (_) => {
			_.type = 'deltaplane';
			return _;
		},
		Champion: (_) => {
			_.type = 'champion des brumes';
			return _;
		},
	};

	const itemDetailsParser = {
		Default: (_) => {
			if (_.data.details.infusion_upgrade_flags) {
				_.type = 'infusion';
				_.boxType = 'amélioration';
				/* */
			}
			return _;
		},
		Rune: (_) => {
			_.type = 'rune';
			_.boxType = 'amélioration';
			const element = /<\/c>([^<]+)<br>/.exec(_.data.description);
			_.boxLines.push(`| élément = ${element[1]}`);
			_.data.description = '';
			return _;
		},
		Sigil: (_) => {
			_.type = 'cachet';
			_.boxType = 'amélioration';
			const element = /<\/c>([^<]+)<br>/.exec(_.data.description);
			_.boxLines.push(`| élément = ${element[1]}`);
			_.data.description = '';
			return _;
		},
		Transmutation: (_) => {
			_.type = 'apparence';
			return _;
		},
		Immediate: (_) => {
			_.type = 'services';
			_.boxLines.push('| lié = ca');
			return _;
		},
		Utility: (_) => {
			_.type = 'utilitaire';

			if (_.data.name.startsWith('Potion')) _.type = 'potion';
			return _;
		},
		Food: (_) => {
			_.type = 'nourriture';
			return _;
		},
		Gem: (_) => {
			_.type = 'pierre précieuse';
			return _;
		},
		Booze: (_) => {
			_.type = 'alcool';
			return _;
		},
	}

	const categoryParser = {
		items: async (data) => {			
			let builder = {
				type: false, 
				boxType: 'objet', 
				data, 
				body: [],
				boxLines: []
			};

			if (data.type in itemTypeParser) builder = itemTypeParser[data.type](builder) || [];
			if (data.details?.unlock_type in itemUnlockParser) builder = itemUnlockParser[data.details.unlock_type](builder);
			if (data.details?.type in itemDetailsParser) builder = itemDetailsParser[data.details.type](builder);

			// edge cases
			if (data.description === 'Objet recyclable') builder.type = 'objet recyclable';
			else if (data.details?.guild_upgrade_id) builder.type = 'décoration';
			else if (data.details?.flags[0] === 'Trinket') builder.type = 'bijou';

			if (builder.type) builder.boxLines.splice(0, 0, `| type = ${builder.type}`);

			if (data.description) builder.boxLines.push(`| description = ${data.description}`);
			if (data.rarity) builder.boxLines.push(	`| rareté = ${rarityMapping[data.rarity]}`);
			if (data.level) builder.boxLines.push(`| niveau = ${data.level}`);
			if (data.vendor_value) builder.boxLines.push(`| valeur = ${data.vendor_value}`);

			if (data.flags.indexOf('AccountBound') !== -1) {
				builder.boxLines.push('| lié = ca');
				if (data.flags.indexOf('SoulBindOnUse') !== -1) builder.boxLines.push('| lié2 = au');
			}
			else if (data.flags.indexOf('AccountBindOnUse') !== -1) builder.boxLines.push('| lié = cu');
			else if (data.flags.indexOf('SoulbindOnAcquire') !== -1) builder.boxLines.push('| lié = aa');
			else if (data.flags.indexOf('SoulBindOnUse') !== -1) builder.boxLines.push('| lié = au');

			if (data.flags.indexOf('Unique') !== -1) builder.boxLines.push('| unique = oui');

			builder.body.push(...[
				`{{Liste de modes d'acquisition}}`,
				`{{liste de recettes par ingrédient}}`,
			])

			return [
				`{{Infobox ${builder.boxType}`,
				...builder.boxLines,
				`| id = ${data.id}`,
				`}}`,
				``,
				...builder.body,
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
