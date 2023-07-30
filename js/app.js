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
		},
		Armor: (_) => {
			_.type = 'armure';
			_.boxType = 'armure';

			boxLines = [];

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
		Back: (_) => {
			_.type = 'dos';
			_.boxType = 'accessoire';
		},
		Bag: (_) => {
			_.type = 'sac';
		},
		Consumable: (_) => {
			_.type = 'consommable';

			if (_.data.name.startsWith('Coup de grâce')) _.type = 'coup de grâce';
			else if (_.data.details.unlock_type === 'Ms') _.type = 'monture';
		},
		Container: (_) => {
			_.type = 'conteneur';

			_.body.push('== Contient ==');
			_.body.push('{{...}}');
		},
		CraftingMaterial: (_) => {
			_.type = 'matériau d\'artisanat';

			if (_.data.name.startsWith('Insigne')) _.type = 'insigne';
			else if (_.data.name.startsWith('Inscription')) _.type = 'inscription';
		},
		Gathering: (_) => {
			_.type = 'outil de récolte';
		},
		Gizmo: (_) => {
			_.type = 'gizmo';
		},
		MiniPet: (_) => {
			_.type = 'miniature';
			_.boxType = 'miniature';
		},
		Tool: (_) => {
			_.type = 'outil de recyclage';
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
		},
		UpgradeComponent: (_) => {
			_.type = 'amélioration';
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
		},
	};

	const itemUnlockParser = {
		CraftingRecipe: (_) => {
			_.type = 'recette';
			/* */
		},
		Outfit: (_) => {
			_.type = 'tenue';
		},
		Dye: (_) => {
			_.boxType = 'teinture';
			/* */
		},
		GliderSkin: (_) => {
			_.type = 'deltaplane';
		},
		Champion: (_) => {
			_.type = 'champion des brumes';
		},
	};

	const itemDetailsParser = {
		Default: (_) => {
			if (_.data.details.infusion_upgrade_flags) {
				_.type = 'infusion';
				_.boxType = 'amélioration';
				/* */
			}
		},
		Rune: (_) => {
			_.type = 'rune';
			_.boxType = 'amélioration';
		},
		Sigil: (_) => {
			_.type = 'cachet';
			_.boxType = 'amélioration';
		},
		Transmutation: (_) => {
			_.type = 'apparence';
		},
		Immediate: (_) => {
			_.type = 'services';
		},
		Utility: (_) => {
			_.type = 'utilitaire';
		},
		Food: (_) => {
			_.type = 'nourriture';
		},
		Gem: (_) => {
			_.type = 'pierre précieuse';
		},
		Booze: (_) => {
			_.type = 'alcool';
		},
	}

	const categoryParser = {
		items: async (data) => {
			let boxLines = [],
				body = [],
				boxType = 'objet',
				type = false;

			if (data.type in itemTypeParser) boxLines = itemTypeParser[data.type]({type, boxType, data, body}) || [];
			if (data.details.unlock_type in itemUnlockParser) boxLines.concat(itemUnlockParser[data.details.unlock_type]({type, boxType, data, body}) || []);
			if (data.details.type in itemDetailsParser) boxLines.concat(itemDetailsParser[data.details.type]({type, boxType, data, body}) || []);

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
