(() => {
	
	const categoriesSelect = document.getElementById('category');
	const entriesDatalist = document.getElementById('entries');
	const entryInput = document.getElementById('entry');
	const iconInput = document.getElementById('icon-url');
	const iconImg = document.getElementById('icon');
	const iconContainer = document.getElementById('icon-container');
	const debugTextarea = document.getElementById('debug');
	const codeTextarea = document.getElementById('code');
	const existingTextarea = document.getElementById('existing');
	const existingButton = document.getElementById('existing-button');
	const existingPage = document.getElementById('existing-page');
	const pageTitle = document.getElementById('pageTitle');
	const copyButton = document.getElementById('copy');
	const wikiLink = document.getElementById('wiki');
	const wikiAlert = document.getElementById('wikiAlert');

	const wikiFormat = (text) => text
		.replace(/<c=@?reminder>/gi,'{{texte coloré|gris|')
		.replace(/<c=@?warning>/gi,'{{texte coloré|rouge|')
		.replace(/<c=@?abilitytype>/gi,'{{texte coloré|jaune|')
		.replace(/<c=@?flavor>/gi,'{{texte coloré|bleu|')
		.replace(/<\/?c>/g,'}}');

	const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

	const itemstatMapping = {};
	const getItemstat = async (statID) => {
		if (!(statID in itemstatMapping)) {
			const stat = await fetch(`https://api.guildwars2.com/v2/itemstats/${statID}?lang=fr`)
				.then(res => res.json());
			itemstatMapping[statID] = capitalize(stat.name || '');
		}
		return itemstatMapping[statID];
	};

	const getSkin = async (skinID) => {
		const skin = await fetch(`https://api.guildwars2.com/v2/skins/${skinID}?lang=fr`)
			.then(res => res.json());
		return skin.name;
	}

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

	const disciplineMapping = {
		Artificer: 'artificier',
		Armorsmith: 'forgeron d\'armures',
		Chef: 'maître-queux',
		Huntsman: 'chasseur',
		Jeweler: 'bijoutier',
		Leatherworker: 'travailleur du cuir',
		Tailor: 'tailleur',
		Weaponsmith: 'forgeron d\'armes',
		Scribe: 'illustrateur',
	};

	const professionMapping = {
		Elementalist: 'élémentaliste',
		Engineer: 'ingénieur',
		Guardian: 'gardien',
		Mesmer: 'envoûteur',
		Necromancer: 'nécromant',
		Ranger: 'rôdeur',
		Revenant: 'revenant',
		Thief: 'voleur',
		Warrior: 'guerrier',
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

	const skillTypeMapping = {
		Bundle: 'environnemental',
		Elite: 'élite',
		Heal: 'soins',
		Monster: '',
		Pet: 'familier',
		Profession: 'profession',
		Toolbelt: 'mécanisme',
		Transform: 'transformation',
		Utility: 'utilitaire',
		Weapon: 'arme',
	}

	const recipeTypeMapping = {
		Axe: 'hache',
		Dagger: 'dague',
		Focus: 'focus',
		Greatsword: 'espadon',
		Hammer: 'marteau',
		Harpoon: 'lance',
		LongBow: 'arc long',
		Mace: 'masse',
		Pistol: 'pistolet',
		Rifle: 'fusil',
		Scepter: 'sceptre',
		Shield: 'bouclier',
		ShortBow: 'arc court',
		Speargun: 'fusil-harpon',
		Staff: 'bâton',
		Sword: 'épée',
		Torch: 'torche',
		Trident: 'trident',
		Warhorn: 'cor de guerre',
		Boots: 'bottes',
		Coat: 'manteaux',
		Gloves: 'gants',
		Helm: 'heaumes',
		Leggings: 'jambières',
		Shoulders: 'épaulières',
		Amulet: 'amulette',
		Earring: 'boucle d\'oreille',
		Ring: 'anneau',
		Dessert: 'dessert',
		Feast: 'festin',
		IngredientCooking: 'ingrédient culinaire',
		Meal: 'plat',
		Seasoning: 'assaisonnement',
		Snack: 'en-cas',
		Soup: 'soupe',
		Component: 'composant d\'artisanat',
		Inscription: 'inscription',
		Insignia: 'insigne',
		LegendaryComponent: 'composant légendaire',
		Refinement: 'transformation',
		RefinementEctoplasm: 'transformation d\'ectoplasme',
		RefinementObsidian: 'transformation d\'obsidienne',
		GuildConsumable: 'consommable de guilde',
		GuildDecoration: 'décoration de la guilde',
		GuildConsumableWvw: 'revendication en McM',
		Backpack: 'sac à dos',
		Bag: 'sacs',
		Bulk: 'en vrac',
		Consumable: 'consommable',
		Dye: 'teinture',
		Potion: 'potion',
		UpgradeComponent: 'composant d\'amélioration',
	};

	const recipeIconMapping = {
		'https://render.guildwars2.com/file/31F9C697D67718C83A03C70C263B5B415EBDE706/849348.png': 'Recette gants raffiné.png',
		'https://render.guildwars2.com/file/A2ABF5220CB70710D67E5BA6CE1232E7BB247447/849409.png': 'Recette boîte d\'armure raffiné.png',
		'https://render.guildwars2.com/file/AD151E2D435208CC0B4D32C5F5027409FF3DCC07/849366.png': 'Recette couvre-chef chef-d\'œuvre.png',
		'https://render.guildwars2.com/file/F2610D0B40FFC13C7A991DF4B10E1DF80A61B35D/849367.png': 'Recette couvre-chef aquatique chef-d\'œuvre.png',
		'https://render.guildwars2.com/file/6997994AAEB3F3F626B6046BC8FCCEA879E61299/849346.png': 'Recette épaulières chef-d\'œuvre.png',
		'https://render.guildwars2.com/file/033FD8491329070B095A470CFD261757F120C094/849354.png': 'Recette cuirasse chef-d\'œuvre.png',
		'https://render.guildwars2.com/file/29A7976E3DE25EB06A3DFBFFA02D23EA5D9123B0/849345.png': 'Recette gants chef-d\'œuvre.png',
		'https://render.guildwars2.com/file/7BDF39AD584E6C454A1EEC9CD760CA443E4A170A/849340.png': 'Recette jambières chef-d\'œuvre.png',
		'https://render.guildwars2.com/file/63DCC07A5CF811B86300D74479B408C43C08F82A/849353.png': 'Recette bottes chef-d\'œuvre.png',
		'https://render.guildwars2.com/file/0FA7E7CD18CEC8403F9B79E6229A711C4DF45ED3/849410.png': 'Recette boîte d\'armure chef-d\'œuvre.png',
		'https://render.guildwars2.com/file/0D9835CC3F70CC70EF0F2655C764C728580E6CEE/849411.png': 'Recette boîte d\'armure rare.png',
		'https://render.guildwars2.com/file/0235F4DFF0183339CEB32FAD37522770D6AA55D0/849311.png': 'Recette couvre-chef exotique.png',
		'https://render.guildwars2.com/file/B81DF7D6D1222E0165B36C92450298583BAE7070/849282.png': 'Recette épaulières exotique.png',
		'https://render.guildwars2.com/file/28B4037C69C2A00A0603FBBE0864441B9948B8E5/849297.png': 'Recette cuirasse exotique.png',
		'https://render.guildwars2.com/file/2165062CDCFBAAA0173AB39DF7EB10A2120816D0/849293.png': 'Recette gants exotique.png',
		'https://render.guildwars2.com/file/2D1AE5B60CDBBC50075CA20EE6191EC4707DBF44/849310.png': 'Recette jambières exotique.png',
		'https://render.guildwars2.com/file/4FB13A730DD207E3344E02B87F4CB1ACD675FA15/849305.png': 'Recette bottes exotique.png',
		'https://render.guildwars2.com/file/1F641C4B9FFDB4A9BAF3BE431006069E20BBBD12/849304.png': 'Recette boîte d\'armure exotique.png',
		'https://render.guildwars2.com/file/2043A27DAB06EC19E17C0C66722A957F2E41D2D5/1201545.png': 'Recette couvre-chef aquatique élevé.png',
		'https://render.guildwars2.com/file/AC1C3075784E0C4235BD9E22E1752D6B49D66F0F/849281.png': 'Recette couvre-chef élevé.png',
		'https://render.guildwars2.com/file/90E9F7590C17DA7933339AE7C52FD83432B33E01/849296.png': 'Recette épaulières élevé.png',
		'https://render.guildwars2.com/file/0F26173B2EDE1CCE9C06AFDFE3EB3E0F17C2ACEC/849294.png': 'Recette cuirasse élevé.png',
		'https://render.guildwars2.com/file/EEC8F3F85DA3B3920C4ADAD9D81DBCA62711FFE5/849280.png': 'Recette gants élevé.png',
		'https://render.guildwars2.com/file/0813027CDADB9135602EB1B1AFD90A3FE335410B/849283.png': 'Recette jambières élevé.png',
		'https://render.guildwars2.com/file/3153B6543A4502614239094397322C4EEA0FAA48/849295.png': 'Recette bottes élevé.png',
		'https://render.guildwars2.com/file/3F14127FC641215E51E157BD4C32790351D8E0DD/849271.png': 'Recette objet de dos élevé.png',
		'https://render.guildwars2.com/file/07D213ECABAE4201A04809374424ACCB7FC6989B/849313.png': 'Recette hache élevé.png',
		'https://render.guildwars2.com/file/D7ABB45DB032945542623BABC6291639C0B4C7B2/849317.png': 'Recette dague élevé.png',
		'https://render.guildwars2.com/file/077B91E457CFA9ABE67DAFF923570A4BDB974D47/849320.png': 'Recette focus élevé.png',
		'https://render.guildwars2.com/file/04ADE6C44959217F7B2A05720DBFB25B55AA42E4/849318.png': 'Recette espadon élevé.png',
		'https://render.guildwars2.com/file/3520E022E7E669026648DC6A280B3CDD7DBE1302/849327.png': 'Recette marteau élevé.png',
		'https://render.guildwars2.com/file/0B34A40EC8F5585EABD807015FFAB1084D1E6B01/849312.png': 'Recette fusil-harpon élevé.png',
		'https://render.guildwars2.com/file/1A060693BEC1773D0F07514442E81F60CF270D07/849330.png': 'Recette arc long élevé.png',
		'https://render.guildwars2.com/file/BB7898A431A3B9190EEEF3B408226B9E20CED208/849316.png': 'Recette masse élevé.png',
		'https://render.guildwars2.com/file/01C770B1294490176DB874720555FCAD9E9A5514/849334.png': 'Recette pistolet élevé.png',
		'https://render.guildwars2.com/file/7178B149E19C65A5FEF44FFB71EBFA0968946B99/849335.png': 'Recette fusil élevé.png',
		'https://render.guildwars2.com/file/45FBC1B93A0E9C24E10269ADBD082905A0BB1A37/849321.png': 'Recette sceptre élevé.png',
		'https://render.guildwars2.com/file/583E335F780D3FD5AA2E149DBC9F28CEF6224F09/849315.png': 'Recette bouclier élevé.png',
		'https://render.guildwars2.com/file/253A14641FBC6456C8F1FD2DB2DAAC045DDFEF6C/849319.png': 'Recette arc court élevé.png',
		'https://render.guildwars2.com/file/915013AA311A6EBD77FBE4786F674275D4219DA8/849326.png': 'Recette lance élevé.png',
		'https://render.guildwars2.com/file/6233E7A2A3C9BE1E3DB8B2735819C3A13F1A7912/849322.png': 'Recette bâton élevé.png',
		'https://render.guildwars2.com/file/6D0D731F0DB34D90B72CD1FC79340CC00C91C1D2/849314.png': 'Recette épée élevé.png',
		'https://render.guildwars2.com/file/96A924E9F149E20BF5341E6478D00DA3EA49ACEE/849336.png': 'Recette torche élevé.png',
		'https://render.guildwars2.com/file/01330C982F9439EA15BF43627DB50AB798746340/849323.png': 'Recette trident élevé.png',
		'https://render.guildwars2.com/file/98B83AED2BFA9B24D46797DC95E0A0112D6C3D64/849338.png': 'Recette cor de guerre élevé.png',
		'https://render.guildwars2.com/file/D1CC662DD44379089A64450B395C4B54BE2EE756/849298.png': 'Recette hache exotique.png',
		'https://render.guildwars2.com/file/A4334E5830B017094A03FBF208A79B4BBF392917/849292.png': 'Recette dague exotique.png',
		'https://render.guildwars2.com/file/0C12706107D16B1A782A19C9E3A052003438B95C/849339.png': 'Recette focus exotique.png',
		'https://render.guildwars2.com/file/F634A41B46C73C3AD3A70E02697C9370A2F9F34B/849291.png': 'Recette espadon exotique.png',
		'https://render.guildwars2.com/file/0E6ECF2B7D5B300979A70325120A646195C213F0/849290.png': 'Recette marteau exotique.png',
		'https://render.guildwars2.com/file/4DC06DB73F095613CB6CB2D5E007C3AF1634990F/849284.png': 'Recette fusil-harpon exotique.png',
		'https://render.guildwars2.com/file/3AB66FABE1F5A5FD90E49851D0D9D8DDB591135E/849285.png': 'Recette arc long exotique.png',
		'https://render.guildwars2.com/file/802E0895B53955AC0E23CAB89C01D42C6E3525AF/849289.png': 'Recette masse exotique.png',
		'https://render.guildwars2.com/file/0FE244BAD2EF262F95F17948AA23076A2AB407EF/849299.png': 'Recette pistolet exotique.png',
		'https://render.guildwars2.com/file/B2185DEB0847396E0902B24A03A8CA36589F46A1/849300.png': 'Recette fusil exotique.png',
		'https://render.guildwars2.com/file/4B0EB245A6ABB5A52C3A533E2D571920E8D9E509/849325.png': 'Recette sceptre exotique.png',
		'https://render.guildwars2.com/file/D201924467E3C9DF60B5F79631689F90DCE89478/849288.png': 'Recette bouclier exotique.png',
		'https://render.guildwars2.com/file/1314795BA50A14086164EB3D290502C79D0F4E43/849301.png': 'Recette arc court exotique.png',
		'https://render.guildwars2.com/file/043DA2FD01D8DD0B03C369B9B2020CC81138FFCF/849287.png': 'Recette lance exotique.png',
		'https://render.guildwars2.com/file/B00E062899E80C806A7BB83DDCCDE213E19151B9/849329.png': 'Recette bâton exotique.png',
		'https://render.guildwars2.com/file/F1AEEAB8041F78F2B90515E55306A5260FA640BC/849286.png': 'Recette épée exotique.png',
		'https://render.guildwars2.com/file/2AA251A1001C64AFAEFFBC2443B4D8BFE0373B52/849302.png': 'Recette torche exotique.png',
		'https://render.guildwars2.com/file/593C1FA6EC60BC403AEFE64DAE09BA096BDE981A/849328.png': 'Recette trident exotique.png',
		'https://render.guildwars2.com/file/93BB38D0F4094B077C740A9531923397BE65405F/849303.png': 'Recette cor de guerre exotique.png',
		'https://render.guildwars2.com/file/3A93E2F2DC09776863FAE010AECD5EE105272B61/849390.png': 'Recette hache rare.png',
		'https://render.guildwars2.com/file/486EDB0C69F7D32F6F54AD2016CC78AA4C3C47E5/849391.png': 'Recette dague rare.png',
		'https://render.guildwars2.com/file/73C0200EEF7407ACC50790027D257412E260DDB7/849392.png': 'Recette focus rare.png',
		'https://render.guildwars2.com/file/DCDFD3D77C4291321A77ECB1D608AEB8CFCEE665/849393.png': 'Recette espadon rare.png',
		'https://render.guildwars2.com/file/37E8BE74B4EB369128E9A8DDC31E900BDA4066A0/849394.png': 'Recette marteau rare.png',
		'https://render.guildwars2.com/file/27C752B25EA9BC34CCD1A0EA1F6CBE2042BFE007/849395.png': 'Recette fusil-harpon rare.png',
		'https://render.guildwars2.com/file/08C8A76B64E37204429D96FE5D2CE61AC4C16452/849396.png': 'Recette arc long rare.png',
		'https://render.guildwars2.com/file/671AFE780DEED39563B3C07B0472E2483AFEE62B/849397.png': 'Recette masse rare.png',
		'https://render.guildwars2.com/file/65C255443AF9E24BA9AAD4420F99A9730112E6A1/849398.png': 'Recette pistolet rare.png',
		'https://render.guildwars2.com/file/054EFF1619B7099B70CA52416CD8987E7EC82C02/849399.png': 'Recette fusil rare.png',
		'https://render.guildwars2.com/file/1DF40E64280CBDED75F16DB5FD644C7849C6F3E5/849400.png': 'Recette sceptre rare.png',
		'https://render.guildwars2.com/file/6908F665B1F1C7D1DBAD77DB24250D2D92A56B9C/849401.png': 'Recette bouclier rare.png',
		'https://render.guildwars2.com/file/F95A57DD54E315915059E86EC775CF373E51CEC9/849402.png': 'Recette arc court rare.png',
		'https://render.guildwars2.com/file/5E23794092CC9C75254E61A2C2384067049A150C/849403.png': 'Recette lance rare.png',
		'https://render.guildwars2.com/file/A833F0130F03C057CF906877770C7101E2E355AE/849404.png': 'Recette bâton rare.png',
		'https://render.guildwars2.com/file/B9CC1E9201F2E97E230BB2CFBA125B0850750418/849405.png': 'Recette épée rare.png',
		'https://render.guildwars2.com/file/B5DD06C2FC9FFFEFDF0AE0D5D16402657AE0CA70/849406.png': 'Recette torche rare.png',
		'https://render.guildwars2.com/file/2FAE1A574BB7C35CF757CE2C256AEC623F60A0B6/849407.png': 'Recette trident rare.png',
		'https://render.guildwars2.com/file/43C0F107E8A3341A26060AB00B1CE9EEEDA3BD55/849408.png': 'Recette cor de guerre rare.png',
		'https://render.guildwars2.com/file/AE55240C95150112B00C17C97319603B6E02E0D6/849355.png': 'Recette hache chef-d\'œuvre.png',
		'https://render.guildwars2.com/file/DE75FA495AD62D2E5C10DF0F9765E5112976390C/849370.png': 'Recette focus chef-d\'œuvre.png',
		'https://render.guildwars2.com/file/B7563A0A3C66057DF677620FBBC96F0C1548B82E/849358.png': 'Recette marteau chef-d\'œuvre.png',
		'https://render.guildwars2.com/file/F5D262919B9BE521BEBDF77E0121B80194641C61/849365.png': 'Recette fusil-harpon chef-d\'œuvre.png',
		'https://render.guildwars2.com/file/E2F2C7194EF1B323D90A52785AAC15EDCF7F2425/849361.png': 'Recette arc long chef-d\'œuvre.png',
		'https://render.guildwars2.com/file/B0696DD3F813E5F63809BC6ADFE171D2CC104AAE/849359.png': 'Recette masse chef-d\'œuvre.png',
		'https://render.guildwars2.com/file/CAC5CE6CC2BA01A5AC0874089D064CA0FB11790C/849375.png': 'Recette fusil chef-d\'œuvre.png',
		'https://render.guildwars2.com/file/B7B55241F37F1D66EF4709A0159A51AF950899DC/849343.png': 'Recette bouclier chef-d\'œuvre.png',
		'https://render.guildwars2.com/file/D122FEB1ECC6695D02971EEE93C607F5BFC1D8A9/849362.png': 'Recette arc court chef-d\'œuvre.png',
		'https://render.guildwars2.com/file/3A0B64B9B7DDCDAF7FF2A0D9597627481021686A/849360.png': 'Recette lance chef-d\'œuvre.png',
		'https://render.guildwars2.com/file/7407B922333B45E97AB7BB93CE259DB20F4BC5CF/849344.png': 'Recette bâton chef-d\'œuvre.png',
		'https://render.guildwars2.com/file/145FAAA40BAD48C5EAD8C205CEF427CDAEB39019/849377.png': 'Recette épée chef-d\'œuvre.png',
		'https://render.guildwars2.com/file/F193AF957CC6B93A1593AEE7C17298DB4BF4D55C/849363.png': 'Recette torche chef-d\'œuvre.png',
		'https://render.guildwars2.com/file/DE3C760AC231EFBE027293FD93AD5A985CEECFFF/849369.png': 'Recette trident chef-d\'œuvre.png',
		'https://render.guildwars2.com/file/E1FBE45329EED53F0BBD67FB75B3A2C0DDDD37F4/849351.png': 'Recette cor de guerre chef-d\'œuvre.png',
		'https://render.guildwars2.com/file/D463130039F5DE9C5EEBAE3ABE7BCBC9FDF5E2DA/849357.png': 'Recette dague raffiné.png',
		'https://render.guildwars2.com/file/5F531EF81B6261C909491F093B9B0A58675B2452/849378.png': 'Recette focus raffiné.png',
		'https://render.guildwars2.com/file/121CF546B9A8A6F20F142E95BF07CC5118A0D6B1/849356.png': 'Recette espadon raffiné.png',
		'https://render.guildwars2.com/file/354C3701ECF9979A96F7259A48E2B142A6C0670D/849382.png': 'Recette fusil-harpon raffiné.png',
		'https://render.guildwars2.com/file/9655120B2ACF1B0E379A9CD95EC7AF36C8CCED4E/849376.png': 'Recette masse raffiné.png',
		'https://render.guildwars2.com/file/29025351ADAE08541A6F9D0980CD92D0F773A959/849383.png': 'Recette pistolet raffiné.png',
		'https://render.guildwars2.com/file/42946C022F7262302F26B546050CA0FAC1249D76/849347.png': 'Recette fusil raffiné.png',
		'https://render.guildwars2.com/file/6968C4D709080B4B7A9762C03A506AF7F3FE6C13/849352.png': 'Recette sceptre raffiné.png',
		'https://render.guildwars2.com/file/4CE7E84602633EB8407B390C5A070C08BED32C15/849350.png': 'Recette lance raffiné.png',
		'https://render.guildwars2.com/file/BBDADD053178C7039DABB90935C89F365C054AC9/849379.png': 'Recette bâton raffiné.png',
		'https://render.guildwars2.com/file/2C421DFDF00F9FFE26BF25F9711612AB301404CD/849341.png': 'Recette épée raffiné.png',
		'https://render.guildwars2.com/file/E4D0C1144BDB725067A857EFDA73EEB016CA59AA/849364.png': 'Recette cor de guerre raffiné.png',
		'https://render.guildwars2.com/file/29131FB604A414025BD9B15AA04B0FA8F9144370/849349.png': 'Recette accessoire raffiné.png',
		'https://render.guildwars2.com/file/BCE40E765BCDE0EC7BCB3007AD7D7DFD05B9AA19/849381.png': 'Recette amulette raffiné.png',
		'https://render.guildwars2.com/file/B8091D3A3FF0C21E315559B2B276100CB8247D4A/849372.png': 'Recette amulette chef-d\'œuvre.png',
		'https://render.guildwars2.com/file/01CC2C735674EF3E77AA48FE5EBADED5F109B873/849332.png': 'Recette amulette exotique.png',
		'https://render.guildwars2.com/file/1862804D61ED5E0BE301E40E2E2027125907BC72/849331.png': 'Recette amulette exotique.png',
		'https://render.guildwars2.com/file/6DBD674A38B6EF75D0C0DD41CC6A69CAD6A0D079/849373.png': 'Recette anneau chef-d\'œuvre.png',
		'https://render.guildwars2.com/file/7B1A44A9170BC3F8903327B79AE79DC6BCCA06E2/849333.png': 'Recette anneau exotique.png',
		'https://render.guildwars2.com/file/455005F494ED6CA7CDB267D33FC4E6807F2F5234/849421.png': 'Recette don rare.png',
		'https://render.guildwars2.com/file/3D423F6758A5265FF1195303529B32E239C6B0BF/849385.png': 'Recette don légendaire.png',
		'https://render.guildwars2.com/file/A857C2732CCDF31A1B7F4B6654030A1D3E94424F/849388.png': 'Recette inscription rare.png',
		'https://render.guildwars2.com/file/54269235C84EC75ABAA8CA03CEA810BD6DFEFA73/849308.png': 'Recette inscription exotique.png',
		'https://render.guildwars2.com/file/EE1D049599C275DE570FF9FF55051639DFFF7339/849337.png': 'Recette inscription élevé.png',
		'https://render.guildwars2.com/file/946A0595165429940618C6E04EC41147536B32D4/849445.png': 'Recette insigne chef-d\'œuvre.png',
		'https://render.guildwars2.com/file/3161A0FC2834BE23B5C55607F1CA7D932B982675/849387.png': 'Recette insigne rare.png',
		'https://render.guildwars2.com/file/1C7952A1B378639DFC0C0A36A13B0D80279218E8/849307.png': 'Recette insigne exotique.png',
		'https://render.guildwars2.com/file/31A92DEB4BA191A809ACD83D3D007DCE010E68DA/849324.png': 'Recette insigne élevé.png',
		'https://render.guildwars2.com/file/B756E10AE913E9095F9DA055277831F6AFF70CAA/849389.png': 'Recette bijou rare.png',
		'https://render.guildwars2.com/file/BA9078DAA120530BC8ECA39ACC7FD5B8971FCC49/849309.png': 'Recette bijou exotique.png',
		'https://render.guildwars2.com/file/024A329B59AC2ABB7695CA1D2F699C333E2D2966/849417.png': 'Recette rune chef-d\'œuvre.png',
		'https://render.guildwars2.com/file/7725EEB5EE0E4905B6193F2B2507E7C004A2D6EA/849264.png': 'Recette rune rare.png',
		'https://render.guildwars2.com/file/64F6762697317B5472056E11A3B2310E273BA16C/849265.png': 'Recette rune exotique.png',
		'https://render.guildwars2.com/file/164C96B079D0DB370D0D0697BF3F31D5F3C1062F/849418.png': 'Recette cachet chef-d\'œuvre.png',
		'https://render.guildwars2.com/file/AACF066161BE43A3BE50671A093DDAB00766961A/849267.png': 'Recette cachet rare.png',
		'https://render.guildwars2.com/file/066F0AB6170D56AAC780AC68CA04C3EBF20C18D7/849268.png': 'Recette cachet exotique.png',
		'https://render.guildwars2.com/file/B7B167286DD34B254E22682900C6EF2310F6EE0E/849342.png': 'Recette nourriture basique.png',
		'https://render.guildwars2.com/file/B609EB03A009033D5655159232E2B9436EB8B630/849269.png': 'Recette nourriture raffiné.png',
		'https://render.guildwars2.com/file/BBF80F4920FE7C970CA1C9007CAB0043AD7EE762/1201551.png': 'Recette nourriture chef-d\'œuvre.png',
		'https://render.guildwars2.com/file/0975BD2F1BA6D007E9D6FC7E233E1A0CF724157E/1201550.png': 'Recette nourriture rare.png',
		'https://render.guildwars2.com/file/5507C6DF4DCCB41ACF0D3A366F0AF2EC9BBE41A9/849266.png': 'Recette nourriture exotique.png',
		'https://render.guildwars2.com/file/B1A4F466DE159C476D457C092B2A0B703DF5423B/849386.png': 'Recette utilitaire basique.png',
		'https://render.guildwars2.com/file/066D559192F1D71D3EF85F5121CE807E1B64E000/849422.png': 'Recette utilitaire raffiné.png',
		'https://render.guildwars2.com/file/E19734B71C949924A1353106E513DE62729A5313/849374.png': 'Recette utilitaire chef-d\'œuvre.png',
		'https://render.guildwars2.com/file/F15E956756D80F3A40A2E3CB39035F3077FEBE52/849412.png': 'Recette utilitaire rare.png',
		'https://render.guildwars2.com/file/E3B060A26B431EC37DEB03B8746359EC142E1B0D/849306.png': 'Recette festin (nourriture) chef-d\'œuvre.png',
		'https://render.guildwars2.com/file/F04BCA540CBF01D3B64A6508F777C0EE5951073B/849420.png': 'Recette festin (utilitaire) chef-d\'œuvre.png',
		'https://render.guildwars2.com/file/162A0F4D9B2AD0A102E01A28355E7257B74A2D10/849380.png': 'Recette sac basique.png',
		'https://render.guildwars2.com/file/A7F25D2BBEF519FA51CC0BA3081214C43E28E140/1201548.png': 'Recette sac rare.png',
		'https://render.guildwars2.com/file/E4E77178070B5004CDFEAE0DF86EB5F5AB484A0F/1301735.png': 'Recette sac exotique.png',
		'https://render.guildwars2.com/file/390201BE2439AB7208B018E644F9344ADE90D47B/849419.png': 'Recette divers rare 1.png',
		'https://render.guildwars2.com/file/43DEC3E72F73B6D8063EE1EA485F5B60DBFDB96B/849415.png': 'Recette divers exotique 1.png',
		'https://render.guildwars2.com/file/4194E1F5AE2147E901C31AC21BED0C0DE6A3E34C/849270.png': 'Recette divers chef-d\'œuvre 2.png',
		'https://render.guildwars2.com/file/090AC47AE5AD3BEBC27D23C5C8ED329C09912B63/888380.png': 'Recette divers rare 2.png<',
		'https://render.guildwars2.com/file/F1670D9C927DA81AA9F161B5A9ABDC410E999A0B/849416.png': 'Recette divers exotique 2.png',
		'https://render.guildwars2.com/file/9E676FEA12E7780C35A223FA12E10F542A0F7818/1201549.png': 'Recette divers exotique 3.png',
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
		Mwcc: (_) => {
			_.type = 'relique';
			_.boxType = 'amélioration';
			return _;
		},
		Tool: (_) => {
			_.type = 'outil de recyclage';
			return _;
		},
		Trinket: (_) => {
			_.type = 'colifichet';
			_.boxType = 'accessoire';

			switch (_.data.details?.type) {
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
			_.boxLines.push(`| icône = ${recipeIconMapping[_.data.icon] || ''}`)
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

	const addRecipe = async (builder, recipe) => {
		const lines = [
			'{{Recette',
		];

		for (let i = 0, imax = recipe.ingredients.length ; i < imax ; i++) {
			const ingredient = await fetch(`https://api.guildwars2.com/v2/items/${recipe.ingredients[i].item_id}?lang=fr`)
				.then(res => res.json());
			lines.push(...[
				`| qté${i + 1} = ${recipe.ingredients[i].count}`,
				`| mat${i + 1} = ${ingredient.name}`
			]);
		}

		if (recipe.flags?.length) {
			switch (recipe.flags[0]) {
				case 'AutoLearned':
					lines.push('| acquisition = automatique');
					break;
				case 'LearnedFromItem':
					break;
				default:
					lines.push('| acquisition = découverte');
			}
		}

		for (let i = 0, imax = recipe.disciplines.length ; i < imax ; i++) {
			lines.push(`| discipline${i > 0 ? i + 1 : ''} = ${disciplineMapping[recipe.disciplines[i]]}`);
		}

		lines.push(...[
			`| difficulté = ${recipe.min_rating}`,
			`| produits = ${recipe.output_item_count}`,
			`| type = ${recipeTypeMapping[recipe.type]}`,
			`| id = ${recipe.id}`,
			'}}',
			''
		])

		builder.body.push(...lines)

		return builder
	};

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
			else if (data.details?.flags?.length && data.details.flags[0] === 'Trinket') builder.type = 'bijou';

			if (builder.type) builder.boxLines.splice(0, 0, `| type = ${builder.type}`);

			if (data.description) builder.boxLines.push(`| description = ${wikiFormat(data.description)}`);
			if (data.details?.infix_upgrade && !data.details?.infix_upgrade?.buff) builder.boxLines.push(`| statistique = ${await getItemstat(data.details.infix_upgrade.id)}`);
			else if (data.details?.stat_choices) builder.boxLines.push('| statistiques = multiple');

			if (data.details?.infix_upgrade?.buff) builder.boxLines.push(`| effet1 = ${wikiFormat(data.details.infix_upgrade.buff.description)}`);

			if (data.details?.infusion_slots) {
				let infusion = 0;
				for (let slot of data.details.infusion_slots) {
					if (slot.flags.indexOf('Infusion') !== -1) {
						++infusion;
						builder.boxLines.push(`| infusion${infusion > 1 ? infusion : ''} = vide`);
					}
					if (slot.flags.indexOf('Enrichment') !== -1) {
						builder.boxLines.push(`| enrichissement = vide`);
					}
				}
			}

			if (data.default_skin) builder.boxLines.push(`| apparence par défaut = ${await getSkin(data.default_skin)}`);
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

			const recipes = await fetch(`https://api.guildwars2.com/v2/recipes/search?output=${data.id}`)
				.then(res => res.json());

			if (recipes && recipes.length) {
				builder.body.push('== Recette ==');
				for (let recipeId of recipes) {
					const recipe = await fetch(`https://api.guildwars2.com/v2/recipes/${recipeId}`)
						.then(res => res.json());
					builder = await addRecipe(builder, recipe); 
				}
			}

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
		},
		skills: async (data) => {
			const lines = [];

			if (data.professions?.length === 8) lines.push(`| profession = commun`);
			else lines.push(...data.professions.map(prof => `| profession = ${professionMapping[prof]}`));

			if (data.type in skillTypeMapping) lines.push(`| emplacement = ${skillTypeMapping[data.type]}`);

			if (data.slot) {

			}

			if (data.cost) lines.push(`| énergie = ${data.cost}`);
			if (data.initiative) lines.push(`| initiative = ${data.initiative}`);

			return [
				'{{Infobox compétence',
				...lines,
				'}}'
			];
		},
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
				existingTextarea.value = '';
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
		existingTextarea.value = '';
		iconInput.value = '';
		iconContainer.hidden = true;
		existingButton.hidden = true;
		existingPage.classList.toggle('show', false);
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
				if (res.icon) {
					iconInput.value = res.icon;
					iconImg.src = res.icon;
					iconImg.alt = res.name;
					iconContainer.hidden = false;
				}
				try {
					fetch(`https://wiki-fr.guildwars2.com/api.php?action=query&format=json&origin=*&prop=revisions&titles=${res.name}&rvprop=ids%7Ctimestamp%7Cflags%7Ccomment%7Cuser%7Ccontent`)
						.then(res => res.json())
						.then(res => {
							const existingPages = res?.query?.pages;
							if (!existingPages) return;
							const existingContent = Object.values(existingPages)[0].revisions[0]['*'];
							existingTextarea.value = existingContent;
							existingButton.hidden = false;
						})
						.catch(console.error);
				} catch (e) {
					console.error(e);
				}
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
