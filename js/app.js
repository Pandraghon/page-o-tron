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
		Armor: '',
		Back: '',
		Bag: '',
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

	const categoryParser = {
		items: async (data) => {
			let boxLines = [],
				body = [],
				boxType = 'objet';

			if (data.type in itemBoxTypeMapping) boxType = itemBoxTypeMapping[data.type];

			if (data.description) boxLines.push(`| description = ${data.description}`);
			if (data.rarity) boxLines.push(	`| rareté = ${rarityMapping[data.rarity]}`);
			if (data.level) boxLines.push(`| niveau = ${data.level}`);
			if (data.vendor_value) boxLines.push(`| valeur = ${data.vendor_value}`);

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
				body = [],
				intro = [`[[{{PAGENAME}}]] est une catégorie de [[succès]].`];

			for (let achievementId of data.achievements) {
				await fetch(`https://api.guildwars2.com/v2/achievements/${achievementId}?lang=fr`)
					.then(res => res.json())
					.then(async res => {
						achievementsLines.push(
							`{{Table de succès/ligne`,
							`| nom = ${res.name}`
						);

						if (res.flags.indexOf('CategoryDisplay') !== -1) achievementsLines.push(`| type = meta`);
						if (res.flags.indexOf('Repeatable') !== -1) achievementsLines.push(`| type = répétable`);
						else achievementsLines.push(`| type = standard`);
						
						if (res.point_cap) achievementsLines.push(`| max points = ${res.point_cap}`);
						if (res.description) achievementsLines.push(`| sous_desc = ${res.description}`);
						if (res.requirement) achievementsLines.push(`| description = ${res.requirement}`);

						achievementsLines.push(`| paliers = ${res.tiers.map(tier => `{{...}} : ${tier.count} ; ${tier.points}`).join('\n')}`);

						for (let reward of (res.rewards || [])) {
							switch (reward.type) {
								case 'Coins':
									achievementsLines.push(`| pièces = ${reward.count}`);
									break;
								case 'Mastery':
									achievementsLines.push(`| point de maîtrise = ${masteryMapping[reward.region]}`);
									break;
								case 'Title':
									await fetch(`https://api.guildwars2.com/v2/titles/${reward.id}?lang=fr`)
										.then(res => res.json())
										.then(res => {
											achievementsLines.push(`| titre = ${res.name}`);
										})
										.catch(console.error);
									break;
							}
						}
							
						achievementsLines.push(
							`}}`
						);
					})
					.catch(console.error);
			}

			body.push(...[
				`{{Navigation succès}}`,
				``,
				`[[Catégorie:Succès]]`
			])

			return [
				...intro,
				``,
				`== Liste des succès ==`,
				`{{Table de succès}}`,
				...achievementsLines,
				`|}`,
				``,
				...body,
				``,
			];
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