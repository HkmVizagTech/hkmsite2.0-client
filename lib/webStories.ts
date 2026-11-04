// Web stories (tap-through, full-screen visual stories). Images are on Cloudflare R2.
// `text` is a small HTML snippet (p / strong / em / u / br / lists only).

export interface WebStoryPage {
  image: string;
  w: number;
  h: number;
  heading: string;
  text: string;
}

export interface WebStory {
  slug: string;
  title: string;
  description: string;
  poster: string;
  pages: WebStoryPage[];
}

export const WEB_STORIES: WebStory[] = [
  {
    "slug": "14-things-to-donate-on-makar-sankranti",
    "title": "14 Things to donate on Makar Sankranti",
    "description": "Donate these 14 things on makar sankranti and make this makar sankranti special.",
    "poster": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779155486-14ThingstoDonateonMakarSankranti.webp",
    "pages": [
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779155486-14ThingstoDonateonMakarSankranti.webp",
        "w": 400,
        "h": 700,
        "heading": "14 things to donate on Makar Sankranti.",
        "text": "<p>Donate these 14 things on Makar Sankranti to gain Prosperity and Peace.</p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779156861-DonateSeasameSeeds.webp",
        "w": 400,
        "h": 700,
        "heading": "Sesame Seeds.",
        "text": "<p>It is considered a sign of prosperity to donate sesame seeds on Makar Sankranti.</p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779157402-JaggeryGud.webp",
        "w": 400,
        "h": 700,
        "heading": "Jaggery (Gudd).",
        "text": "<p>Donating jaggery on the day of Makar Sankranti can help in obtaining blessings from Surya Narayan.</p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779157831-DonateKichadi.webp",
        "w": 400,
        "h": 700,
        "heading": "Khichdi.",
        "text": "<p>On Makar Sankranti, donating khichdi brings abundance. </p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779158230-DonateGrains.webp",
        "w": 400,
        "h": 700,
        "heading": "Grains.",
        "text": "<p>People who donate five different kinds of grains on Makar Sankranti get all of their wishes fulfilled.</p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779158639-DonateOil.webp",
        "w": 400,
        "h": 700,
        "heading": "Oil.",
        "text": "<p>Donating oil on Makar Sankranti in said to be auspicious.</p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779159056-DonateBlankets.webp",
        "w": 400,
        "h": 700,
        "heading": "Blanket.",
        "text": "<p>Donating Blankets can help needy peoples.</p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779159540-DonateSalt.webp",
        "w": 400,
        "h": 700,
        "heading": "Salt.",
        "text": "<p>Donating salt on Makar Sankranti is a noble act of charity.</p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779159930-DonateNewCloths.webp",
        "w": 400,
        "h": 700,
        "heading": "New Clothes.",
        "text": "<p>One must also donate clothes to the needy on Makar Sankranti as it brings good fortune. </p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779160407-DonateFodder.webp",
        "w": 400,
        "h": 700,
        "heading": "Fodder.",
        "text": "<p>It is highly auspicious to donate and feed green fodder to the cows on the day of Makar Sankranti. </p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779160838-DonateGhee.webp",
        "w": 400,
        "h": 700,
        "heading": "Ghee.",
        "text": "<p>It is also significant to donate ghee on the day of Makar Sankranti as it is believed to bring career success. </p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779161616-DoGauSeva.webp",
        "w": 400,
        "h": 700,
        "heading": "Gau Seva.",
        "text": "<p>Serve mother cow on this auspicious day of Makar Sankranti.</p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779162124-DoAnnadaanSeva.webp",
        "w": 400,
        "h": 700,
        "heading": "Annadaan.",
        "text": "<p>Offer Annadaan Seva to needy.</p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779162739-MakarShankratimob.webp",
        "w": 766,
        "h": 1295,
        "heading": ".",
        "text": ""
      }
    ]
  },
  {
    "slug": "advent-of-lord-krishna",
    "title": "Advent of Lord Krishna",
    "description": "Celebrate the divine advent of Lord Krishna on Janmashtami. Explore the significance of His birth and the spiritual wisdom He imparted to the world.",
    "poster": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779163702-AdventofLordKrishna.webp",
    "pages": [
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779163702-AdventofLordKrishna.webp",
        "w": 720,
        "h": 1080,
        "heading": "Advent of Lord Krishna",
        "text": "<p><strong>Lord Sri Krishna declares</strong> in Srimad Bhagavad-gita that He appears by His own will whenever and wherever there is a <strong>decline in true religious practices</strong> and <strong>a predominant rise of irreligiosity</strong>.</p>"
      }
    ]
  },
  {
    "slug": "ballushai-recipe",
    "title": "Ballushai Recipe",
    "description": "Learn how to prepare Ballushai, a traditional Indian sweet enjoyed during festivals. Follow this easy recipe to make this delightful dish for our beloved Krishna.",
    "poster": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779164503-balushahi-recipe.webp",
    "pages": [
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779164503-balushahi-recipe.webp",
        "w": 750,
        "h": 562,
        "heading": "Ballushai Recipe",
        "text": "<p>Ballushai is the Indian fried doughnut that's made up like little doughnut pastries.</p>"
      }
    ]
  },
  {
    "slug": "dashavatar-stotram-by-srila-jayadeva-goswami",
    "title": "Dashavatar Stotram by Srila Jayadeva Goswami",
    "description": "Recite the Dashavatar Stotram composed by Srila Jayadeva Goswami, praising the ten divine avatars of Lord Vishnu. Enhance your devotion with this powerful prayer.",
    "poster": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779165319-1zoQZ2pf.webp",
    "pages": [
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779165319-1zoQZ2pf.webp",
        "w": 400,
        "h": 700,
        "heading": "Dashavatar Stotram",
        "text": "<p>The Dasavatar Stotra is a revered hymn composed by Sri Jayadeva Goswami, celebrating the ten principal incarnations (avatars) of Lord Vishnu.</p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779166010-2t6eSELs.webp",
        "w": 400,
        "h": 700,
        "heading": "Prayer to Matsya Avatar",
        "text": "<p><strong>प्रलय पयोधि-जले धृतवान् असि वेदम्</strong><br/> <strong>विहित वहित्र-चरित्रम् अखेदम्</strong><br/> <strong>केशव धृत-मीन-शरीर, जय जगदीश हरे</strong></p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779166512-3.webp",
        "w": 400,
        "h": 700,
        "heading": "Prayer to Kurma Avatar",
        "text": "<p><strong>क्षितिर् इह विपुलतरे तिष्ठति तव पृष्ठे<br/> धरणि- धारण-किण चक्र-गरिष्ठे<br/> केशव धृत-कूर्म-शरीर जय जगदीश हरे</strong></p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779167010-4.webp",
        "w": 400,
        "h": 700,
        "heading": "Prayer to Varaha Avatar",
        "text": "<p><strong>वसति दशन शिखरे धरणी तव लग्ना</strong><br/> <strong>शशिनि कलंक कलेव निमग्ना</strong><br/> <strong>केशव धृत शूकर रूप जय जगदीश हरे</strong></p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779167578-5.webp",
        "w": 400,
        "h": 700,
        "heading": "Prayer to Narasimha Avatar",
        "text": "<p><strong>तव कर-कमल-वरे नखम् अद्भुत शृंगम्<br/> दलित-हिरण्यकशिपु-तनु-भृंगम्<br/> केशव धृत-नरहरि रूप जय जगदीश हरे</strong></p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779168047-6.webp",
        "w": 400,
        "h": 700,
        "heading": "Prayer to Vamana Avatar",
        "text": "<p><strong>छलयसि विक्रमणे बलिम् अद्भुत-वामन</strong><br/> <strong>पद-नख-नीर-जनित-जन-पावन</strong><br/> <strong>केशव धृत-वामन रूप जय जगदीश हरे</strong></p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779168482-7.webp",
        "w": 400,
        "h": 700,
        "heading": "Prayer to Parshurama Avatar",
        "text": "<p><strong>क्षत्रिय-रुधिर-मये जगद् -अपगत-पापम्<br/> स्नपयसि पयसि शमित-भव-तापम्<br/> केशव धृत-भृगुपति रूप जय जगदीश हरे</strong></p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779168926-8.webp",
        "w": 400,
        "h": 700,
        "heading": "Prayer to Rama Avatar",
        "text": "<p><strong>वितरसि दिक्षु रणे दिक्-पति-कमनीयम्</strong><br/> <strong>दश-मुख-मौलि-बलिम् रमणीयम्</strong><br/> <strong>केशव धृत-राम-शरीर जय जगदीश हरे</strong></p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779169383-9.webp",
        "w": 400,
        "h": 700,
        "heading": "Prayer to Lord Balaram",
        "text": "<p><strong>वहसि वपुशि विसदे वसनम् जलदाभम्<br/> हल-हति-भीति-मिलित-यमुनाभम्<br/> केशव धृत-हलधर रूप जय जगदीश हरे</strong></p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779169942-10.webp",
        "w": 400,
        "h": 700,
        "heading": "Prayer to Bhudha Avatar",
        "text": "<p><strong>नंदसि यज्ञ- विधेर् अहः श्रुति जातम्<br/> सदय-हृदय-दर्शित-पशु-घातम्<br/> केशव धृत-बुद्ध-शरीर जय जगदीश हरे</strong></p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779170408-11.webp",
        "w": 400,
        "h": 700,
        "heading": "Prayer to Kalki Avatar",
        "text": "<p><strong>म्लेच्छ-निवह-निधने कलयसि करवालम्<br/> धूमकेतुम् इव किम् अपि करालम्<br/> केशव धृत-कल्कि-शरीर जय जगदीश हरे</strong></p>"
      }
    ]
  },
  {
    "slug": "devotional-service-is-the-only-way-to-attain-peace",
    "title": "Devotional Service is the Only Way to Attain Peace",
    "description": "nderstand the importance of devotional service in attaining inner peace. Learn how serving Lord Krishna can bring eternal tranquility and spiritual fulfillment.",
    "poster": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779171617-untitled.webp",
    "pages": [
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779171617-untitled.webp",
        "w": 1728,
        "h": 2592,
        "heading": "Unless you come to the platform of bhakti, devotional service, there is no question of shanti. That is not possible.",
        "text": "<p>-Srila Prabhupada</p> <p>SB 1.2.7 — VRINDAVAN, OCTOBER 18, 1972</p>"
      }
    ]
  },
  {
    "slug": "devotional-service-rids-from-both-good-and-bad-actions",
    "title": "Devotional Service Rids from Both Good and Bad Actions",
    "description": "Learn how devotional service to Lord Krishna purifies both good and bad actions, leading to liberation. Explore the path of Bhakti for spiritual freedom.",
    "poster": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779173008-untitledKBiaMQh.webp",
    "pages": [
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779173008-untitledKBiaMQh.webp",
        "w": 3456,
        "h": 5184,
        "heading": "A man engaged in devotional service rids himself of both good and bad actions even in this life.",
        "text": "<p>-Srila Prabhupada</p> <p>SB 1.2.6 — MONTREAL, AUG 3, 1968</p>"
      }
    ]
  },
  {
    "slug": "discipline-is-the-first-law-of-obedience",
    "title": "Discipline is the First Law of Obedience",
    "description": "Discover why discipline is the first law of obedience in spiritual life. Learn how discipline leads to spiritual growth and devotion to Lord Krishna.",
    "poster": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779174424-untitled3vJDEH9.webp",
    "pages": [
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779174424-untitled3vJDEH9.webp",
        "w": 3456,
        "h": 5184,
        "heading": "DISCIPLINE IS THE FIRST LAW OF OBEDIENCE.",
        "text": "<p>-Srila Prabhupada</p> <p>SB 1.2.7 — VRINDAVAN,</p> <p>OCTOBER 18, 1972</p>"
      }
    ]
  },
  {
    "slug": "divine-pastimes-of-lord-krishna-in-kartik-month",
    "title": "Divine Pastimes of Lord Krishna in Kartik Month",
    "description": "Explore the divine pastimes of Lord Krishna during Kartik Month. Learn about the significance of Kartik and sacred rituals & festivals celebrated by devotees.",
    "poster": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779174989-1uV5V0a6.webp",
    "pages": [
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779174989-1uV5V0a6.webp",
        "w": 720,
        "h": 1080,
        "heading": "Divine Pastimes of Lord Krishna in Kartik Month",
        "text": "<strong>Divine pastimes of Lord Krishna</strong>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779175480-3RUF2zjX.webp",
        "w": 720,
        "h": 1080,
        "heading": "Damodara Lila",
        "text": "<p>Lord Krishna was bound by mother Yashoda with wooden mortar for stealing butter. This enchanting pastime of the Lord being bound by rope on His belly is glorified as the Damodara Lila.</p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779175944-2eeMhdIR.webp",
        "w": 720,
        "h": 1080,
        "heading": "Govedhan Lila",
        "text": "<p>Lord Krishna lifted the Goverdhan Hill to protect the residents of Vrindavan from the wrath of King Indra and the residents worshiped the Goverdhan with jubilant festivities.</p>"
      }
    ]
  },
  {
    "slug": "dos-and-donts-for-nirjala-ekadashi",
    "title": "Do's & Dont's to follow on Nirjala Ekadashi",
    "description": "A quick guide to help you honor Nirjala Ekadashi the right way.",
    "poster": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779176443-1.webp",
    "pages": [
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779176443-1.webp",
        "w": 800,
        "h": 1100,
        "heading": "Do's & Dont's to follow on Nirjala Ekadashi",
        "text": "<p>A quick guide to help you honor Nirjala Ekadashi the right way<br/> </p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779176935-2w075TBH.webp",
        "w": 800,
        "h": 1100,
        "heading": "Complete fast without even drinking water",
        "text": "<p>Observed with complete fasting—no food or even water is consumed.<br/> </p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779177480-3UYxWgff.webp",
        "w": 800,
        "h": 1100,
        "heading": "Offer sattvic food to Lord Krishna",
        "text": "<p>Prepare and offer pure sattvic food to Lord Krishna with devotion.<br/> </p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779178052-4ZdB56P3.webp",
        "w": 800,
        "h": 1100,
        "heading": "Chant the holy names of the Lord",
        "text": "<p>Chant the Hare Krishna Mahamantra throughout the day.<br/> </p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779178598-5LmuCPH6.webp",
        "w": 800,
        "h": 1100,
        "heading": "Read sacred scriptures",
        "text": "<p>Read scriptures like Bhagavad Gita or Srimad Bhagavatam for spiritual upliftment.<br/> </p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779179130-6rufJ7ni.webp",
        "w": 800,
        "h": 1100,
        "heading": "Give charity to devotees and brahmins",
        "text": "<p>Give charity to brahmins, devotees, or for cow and temple service.<br/> </p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779179637-78uhgG2U.webp",
        "w": 800,
        "h": 1100,
        "heading": "Avoid tamasic food a day before",
        "text": "<p>Avoid tamasic food like onion, garlic, and meat a day before fasting.</p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779180134-8rcG1QIy.webp",
        "w": 800,
        "h": 1100,
        "heading": "Avoid excessive sleep",
        "text": "<p>Minimize sleep and spend more time in prayer and devotion.</p>"
      }
    ]
  },
  {
    "slug": "ekadashi-fast-dos-and-donts",
    "title": "Rules to follow while Ekadashi Fasting",
    "description": "Follow these rules to maintain your ekadashi fast properly.",
    "poster": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779180527-1g89akwR.webp",
    "pages": [
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779180527-1g89akwR.webp",
        "w": 400,
        "h": 700,
        "heading": "Fasting Guidelines: Do's and Don'ts",
        "text": "<p>The rules of Ekadashi fasting are simple yet significant.</p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779180940-2kOTEwVS.webp",
        "w": 400,
        "h": 700,
        "heading": "What to Avoid ?",
        "text": "<p>Foods like rice, wheat, lentils, and legumes fall into this category.</p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779181490-3ucDw9FV.webp",
        "w": 400,
        "h": 700,
        "heading": "Permissible Food ?",
        "text": "<p>Fruits, vegetables, nuts, and dairy products are traditionally allowed.</p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779181896-4NNzI4RA.webp",
        "w": 400,
        "h": 700,
        "heading": "Complete Ekadashi Guidelines:",
        "text": ""
      }
    ]
  },
  {
    "slug": "radhashtami-recipe-of-malpua",
    "title": "Traditional Sweet Recipe of Malpua",
    "description": "Celebrate Radhashtami with Malpua, a traditional sweet enjoyed by devotees. Learn the step-by-step recipe to prepare this delicious dish for Radhashtami.",
    "poster": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779182287-MalpuaRabri.webp",
    "pages": [
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779182287-MalpuaRabri.webp",
        "w": 335,
        "h": 300,
        "heading": "Malpua Recipe.",
        "text": "<p>Celebrate Radhashtami by worshipping Radha and Krishna and offering Them delicious dishes. Try out this recipe for Malpua.</p>"
      }
    ]
  },
  {
    "slug": "sabke-dhuk-harte-nandlal",
    "title": "Sabke Dhuk Harte Nandlal",
    "description": "Chant the devotional prayer \"Sabke Dhuk Harte Nandlal\" to invoke the mercy of Lord Krishna. Learn how this prayer alleviates all sorrows and brings divine peace.",
    "poster": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779182748-SubkeDukhHarteNandlal.webp",
    "pages": [
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779182748-SubkeDukhHarteNandlal.webp",
        "w": 400,
        "h": 700,
        "heading": "सबके दुख हरते नंदलाल",
        "text": "<p>आपकी बंसी की मधुर तान,</p> <p>भर दे मन में प्रेम गान।</p> <p>गोकुल के नटखट बाल,</p> <p>सबके दुख हरते नंदलाल।</p>"
      }
    ]
  },
  {
    "slug": "seven-goswami-temple-in-vrindavan",
    "title": "7 Goswami Temple in Vrindavan",
    "description": "Visit these 7 goswami temples of vrindavan",
    "poster": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779183193-1W8z14bI.webp",
    "pages": [
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779183193-1W8z14bI.webp",
        "w": 400,
        "h": 700,
        "heading": "7 Goswami Temples of Vrindavan",
        "text": "<p>The Seven Goswami Temples of Vrindavan are: </p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779183610-2tlWLdVl.webp",
        "w": 400,
        "h": 700,
        "heading": "Radha Damodar Ji",
        "text": "<p><strong>Srila Rupa Goswami carved the deities of Radha Damodar and gave them to Srila Jiva Goswami for worshipping</strong>.</p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779184060-36FExGMc.webp",
        "w": 400,
        "h": 700,
        "heading": "Radha Shyamsundar Ji",
        "text": "<p>Radha Shyamsundar Mandir is one amongst the popular 7 Seven Goswami temples of Vrindavan. It is located just 2-minute walk from Radha Damodar Mandir.</p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779184525-4186NNbd.webp",
        "w": 400,
        "h": 700,
        "heading": "Radha Govind Dev Ji",
        "text": "<p>This is an iconic mandir established by Srila Rupa Goswami. It is one of the very popular and grand mandirs in Vrindavan.</p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779185056-5jqlkPNc.webp",
        "w": 400,
        "h": 700,
        "heading": "Radha Gokulananda Ji",
        "text": "<p>The temple is just a couple of minutes walk from Radha Raman Lal Ji and is very peaceful.</p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779185482-6bU15kWR.webp",
        "w": 400,
        "h": 700,
        "heading": "Radha Madan Mohan Ji",
        "text": "<p>The deity of Radha Madana Mohana Dev Ji was worshipped by Srila Sanatana Goswami. It is located just a bit of Kaliya Ghat and one needs to climb on stairs to reach there.</p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779185894-7bvI0IIx.webp",
        "w": 400,
        "h": 700,
        "heading": "Radha Gopinath Ji",
        "text": "<p>The deities of Radha Gopinath Ji was established by Vajranabh, the grandson of Krishna.</p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779186331-8mzN2b4h.webp",
        "w": 400,
        "h": 700,
        "heading": "Radha Raman Ji",
        "text": "<p>Rdha Raman Mandir is an extremely popular temple in Vrindavan, especially for the Gaudiya Vaishnavs. The deities of Radha Raman Ji was worshipped by Gopal Bhatt Goswami, one of 6 Goswamis of Vrindavan.</p>"
      }
    ]
  },
  {
    "slug": "shattila-ekadashi-daan",
    "title": "Significance Shattila Ekadashi Daan",
    "description": "Know what to donate on Shattila Ekadashi and how to donate. why shattila ekadashi is important for donation. Annadaan on Shattila Ekadashi.",
    "poster": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779186760-ShattilaEkadashiDaan.webp",
    "pages": [
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779186760-ShattilaEkadashiDaan.webp",
        "w": 400,
        "h": 700,
        "heading": "Shattila Ekadashi Daan",
        "text": ""
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779187248-SesameSeeds.webp",
        "w": 400,
        "h": 700,
        "heading": "Sesame Seeds.",
        "text": "<p>In accordance with the name of the <strong>Ekadashi</strong>, <strong>sesame seeds</strong> hold great importance. <strong>Black sesame seeds</strong> are used for formal <strong>worship </strong>and <strong>fire sacrifices</strong>, while <strong>white or brown seeds</strong> are meant for <strong>eating</strong>.</p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779187822-Food.webp",
        "w": 400,
        "h": 700,
        "heading": "Food.",
        "text": "<p><strong>Donating food</strong> is the most essential act of <strong>charity</strong>. It is a way of directly addressing the needs of the hungry and is believed to accumulate significant <strong>spiritual merit</strong>.</p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779188239-Clothes.webp",
        "w": 400,
        "h": 700,
        "heading": "Clothes.",
        "text": "<p>Giving <strong>clothes</strong> to Brahmins and those in need is another important act that brings blessings and spiritual growth.</p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779188629-OtherItems.webp",
        "w": 400,
        "h": 700,
        "heading": "Other Items.",
        "text": "<p>In addition to <strong>food,</strong> <strong>devotees</strong> can offer items like a <strong>pot of water</strong> (<em>purna kumbha</em>), an<strong> umbrella</strong>, <strong>a pair of shoes</strong>, and <strong>clothes</strong> to a <strong>qualified Brahmin</strong>.</p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779189357-CowDonation.webp",
        "w": 400,
        "h": 700,
        "heading": "Cow Donation.",
        "text": "<p><strong>Donating</strong> a <strong>black cow</strong> to a well-versed <strong>Brahmin</strong>, especially one who is knowledgeable in <strong>Vedic scriptures</strong> is also seen as an <strong>auspicious act</strong>.</p>"
      }
    ]
  },
  {
    "slug": "special-food-items-for-makar-sankranti",
    "title": "Special food items to try on Makar Sankranti",
    "description": "Know the famous food items of Makar Sankranti and try it out.",
    "poster": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779189740-SpecialFoodItemsforMakarSankranti.webp",
    "pages": [
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779189740-SpecialFoodItemsforMakarSankranti.webp",
        "w": 400,
        "h": 700,
        "heading": "Special Food Items for Makar Sankranti.",
        "text": "<p>Try these food items this Makar Sankranti.</p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779190157-TilKeLadoo.webp",
        "w": 400,
        "h": 700,
        "heading": "Til Ke Laddu",
        "text": "<p>Til ke laddu is a tasty and nutritious sweet made with sesame seeds, jaggery, peanuts, and desiccated coconut.</p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779190628-PeanutGajak.webp",
        "w": 400,
        "h": 700,
        "heading": "Peanut Chikki Recipe (Peanut Gajak)",
        "text": "<p>Peanut Chikki, also known as Gajak in Hindi, is a popular Indian winter treat, a crispy and crunchy peanut brittle snack.</p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779191229-Kheer.webp",
        "w": 400,
        "h": 700,
        "heading": "Kheer",
        "text": "<p>Rice Kheer is a cherished Indian dessert made with basmati rice, whole milk, nuts, and saffron.</p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779191656-SujikaHalwa.webp",
        "w": 400,
        "h": 700,
        "heading": "Suji ka Halwa",
        "text": "<p>Suji ka Halwa, also known as Sheera, is a traditional Indian semolina pudding made with sugar, ghee, and dry fruits.</p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779192065-BesankeLadoo.webp",
        "w": 400,
        "h": 700,
        "heading": "Besan ke Laddu",
        "text": "<p>Besan Ladoo, also known as Besan ke Laddu, is a beloved Indian sweet often prepared during festivals.</p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779192559-Basundhi.webp",
        "w": 400,
        "h": 700,
        "heading": "Basundi",
        "text": "<p>Basundi is a rich, creamy dessert made with whole milk, sugar, aromatic spices, and nuts.</p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779192932-CoconutLadoo.webp",
        "w": 400,
        "h": 700,
        "heading": "Coconut Ladoo",
        "text": "<p>Prepare coconut ladoo using three methods. The first is a simple 3-ingredient recipe with fresh coconut, condensed milk, and cardamom powder.</p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779193450-AttaLadoo.webp",
        "w": 400,
        "h": 700,
        "heading": "Atta Laddu",
        "text": "<p>These wheat ladoos are a delightful sweet treat, perfect for kids and the entire family to enjoy.</p>"
      }
    ]
  },
  {
    "slug": "sri-brahma-samhita",
    "title": "Sri Brahma Samhita",
    "description": "Explore the Sri Brahma Samhita, a profound prayer written by Lord Brahma to Lord Krishna. Delve into its spiritual meanings and significance for devotees.",
    "poster": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779194470-BrahmaSamhita.webp",
    "pages": [
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779194470-BrahmaSamhita.webp",
        "w": 720,
        "h": 1080,
        "heading": "Brahma Samhita",
        "text": "<p>In the <em>Brahma Samhita</em>, Lord Brahma offers his heartfelt praises to Lord Krishna, acknowledging Him as the Supreme Personality of Godhead and the ultimate cause of all causes.</p>"
      }
    ]
  },
  {
    "slug": "sri-sri-damodarshtakam",
    "title": "Sri Sri Damodarshtakam",
    "description": "Recite Sri Sri Damodarshtakam, a beautiful prayer dedicated to Lord Krishna’s Damodara form. Invoke His divine blessings with this devotional Prayer.",
    "poster": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779194993-SriSriDamodarshtakam.webp",
    "pages": [
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779194993-SriSriDamodarshtakam.webp",
        "w": 720,
        "h": 1080,
        "heading": "Sri Sri Damodarshtakam",
        "text": "<p>The <strong>Damodarashtakam</strong> is a beautiful prayer composed by <strong>Satyavrata Muni</strong> and written by <strong>Vyasa Deva</strong>.</p>"
      }
    ]
  },
  {
    "slug": "srila-prabhupada-praneti",
    "title": "Srila Prabhupada Praneti",
    "description": "Pay obeisances to Srila Prabhupada, the founder acharya of ISKCON, through his Divine Pranam Mantra known as Srila Prabhupada Praneti and Seek His Divine Mercy!",
    "poster": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779195406-SrilaPrabhupadaLila.webp",
    "pages": [
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779195406-SrilaPrabhupadaLila.webp",
        "w": 300,
        "h": 290,
        "heading": "Srila Prabhupada Praneti",
        "text": "<p>nama om vishnu-padaya krishna-preshthaya bhu-tale</p> <p>srimate bhaktivedanta-svamin iti namine</p> <p>namas te sarasvate deve gaura-vani-pracarine</p> <p>nirvisesha-sunyavadi-pascatya-desa-tarine</p>"
      }
    ]
  },
  {
    "slug": "thank-you-krishna",
    "title": "Thank You Krishna: A Heartfelt Expression of Gratitude",
    "description": "Thank You Krishna: Express gratitude to Lord Krishna for His love, guidance and blessings through this heartfelt devotional story.",
    "poster": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779196071-91.webp",
    "pages": [
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779196071-91.webp",
        "w": 1080,
        "h": 1920,
        "heading": "दिल से आभार",
        "text": "<p>हे कृष्ण, मैं जानता हूँ कि मैं आपसे यह बात बार-बार नहीं कहता, लेकिन आपका बहुत-बहुत धन्यवाद।</p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779196756-21.webp",
        "w": 1080,
        "h": 1920,
        "heading": "सच्चा मित्र बनने के लिए",
        "text": "<p>हे कृष्ण, अपनी मित्रता प्रदान करने के लिए आपका धन्यवाद।</p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779197717-thank-you-guidance.webp",
        "w": 1080,
        "h": 1920,
        "heading": "सही राह दिखाने के लिए",
        "text": "<p>हे कृष्ण, मेरा मार्गदर्शन करने के लिए आपका धन्यवाद।</p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779198409-31.webp",
        "w": 1080,
        "h": 1920,
        "heading": "हर पल रक्षा के लिए",
        "text": "<p>हे कृष्ण, मेरी रक्षा करने के लिए आपका धन्यवाद।</p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779198970-thank-you-saving.webp",
        "w": 1080,
        "h": 1920,
        "heading": "जीवन की रक्षा के लिए",
        "text": "<p>हे कृष्ण, मुझे हर विपदा से बचाने के लिए आपका धन्यवाद।</p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779199627-thank-you-forgiveness.webp",
        "w": 1080,
        "h": 1920,
        "heading": "क्षमा के लिए",
        "text": "<p>हे कृष्ण, मेरी गलतियों को क्षमा करने के लिए आपका धन्यवाद।</p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779200274-thank-you-mercy.webp",
        "w": 1080,
        "h": 1920,
        "heading": "करुणा दिखाने के लिए",
        "text": "<p>हे कृष्ण, मुझ पर दया करने के लिए आपका धन्यवाद।</p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779200948-thank-you-grace.webp",
        "w": 1080,
        "h": 1920,
        "heading": "हर पल कृपा के लिए",
        "text": "<p>हे कृष्ण, मुझ पर अपनी कृपा बरसाने के लिए आपका धन्यवाद।</p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779201665-thank-you-unfailing-love.webp",
        "w": 1080,
        "h": 1920,
        "heading": "अटूट स्नेह के लिए",
        "text": "<p>हे कृष्ण, मुझसे अटूट प्रेम करने के लिए आपका धन्यवाद।</p>"
      }
    ]
  },
  {
    "slug": "the-four-types-of-kumbh-mela",
    "title": "Know about four types of Kumbh Mela",
    "description": "There are four type of Kumbh Mela which are kumbh, ardh kumbh, purna kumbh, Maha Kumbh.",
    "poster": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779202133-1wvCvB66.webp",
    "pages": [
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779202133-1wvCvB66.webp",
        "w": 400,
        "h": 700,
        "heading": "The Four Types of Kumbh Mela.",
        "text": "<p>Our culture is that of various diversities and the same is evident in our traditions, including Kumbh as well.</p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779202707-2LJJ75YC.webp",
        "w": 400,
        "h": 700,
        "heading": "Kumbh Mela.",
        "text": "<p>This grand event occurs every 12 years, rotating among four sacred sites, each situated on a revered river. </p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779203235-3txIVJq8.webp",
        "w": 400,
        "h": 700,
        "heading": "Ardh Kumbh Mela.",
        "text": "<p>Translating to 'Half Kumbh Mela,' this event occurs every 6 years exclusively at: Prayagraj (Allahabad) and Haridwar.</p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779203679-4kAYTAhd.webp",
        "w": 400,
        "h": 700,
        "heading": "Purna Kumbh Mela.",
        "text": "<p>Also known as the 'Full Kumbh Mela,' it is synonymous with the regular 12-year Kumbh Mela, celebrated based on the aforementioned planetary positions at the respective locations.</p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779204181-5f082IPw.webp",
        "w": 400,
        "h": 700,
        "heading": "Maha Kumbh Mela.",
        "text": "<p>The most monumental of all, the Maha Kumbh Mela is traditionally believed to occur after 144 years, following the completion of 12 Purna Kumbh Melas.</p>"
      }
    ]
  },
  {
    "slug": "the-powerful-narasimha-kavacha-stotram",
    "title": "Narasimha Kavacha Stotram",
    "description": "Chant the Narasimha Kavacha Stotram, a powerful prayer that offers protection and blessings from Lord Narasimha, the fierce form of Lord Krishna.",
    "poster": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779204726-1stMbcTC.webp",
    "pages": [
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779204726-1stMbcTC.webp",
        "w": 720,
        "h": 1080,
        "heading": "The Powerful Narasimha Kavacha Stotram",
        "text": "<p>The powerful prayer for protection, Narasimha Kavacha Stotram is described by Prahlada Maharaja in the Brahmanda Purana, which states: </p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779205277-2zmRubBa.webp",
        "w": 720,
        "h": 1080,
        "heading": "Garjantam Garjayantam Nija-Bhuja-Patalam Sphotayantam Hatantam",
        "text": "<p>गर्जंतं गर्जयंतं निजभुजपटलं स्फोटयंतं</p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779205861-37YuvuNF.webp",
        "w": 720,
        "h": 1080,
        "heading": "Dipyantam Tapayantam Divi Bhuvi Ditijam Kshepayantam Kshipantam",
        "text": "<p>हरंतं दीप्यंतं तापयंतं दिवि भुवि दितिजं क्षेपयंतं रसंतं ।<br/> </p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779206462-4ANdsNEo.webp",
        "w": 720,
        "h": 1080,
        "heading": "Krandantam Roshayantam Dishi Dishi Satatam Samharantam Bharantam",
        "text": "<p>कृंदंतं रोषयंतं दिशिदिशि सततं संभरंतं हरंतं ।<br/> </p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779206953-5Uv26cSI.webp",
        "w": 720,
        "h": 1080,
        "heading": "Vikshantam Purnayantam Kara-Nikara-Shatair Divya-Simham Namami",
        "text": "<p>विक्षंतं घूर्णयंतं करनिकरशतैर्दिव्यसिंहं नमामि ॥<br/> </p>"
      }
    ]
  },
  {
    "slug": "we-all-are-part-and-parcel-of-krishna",
    "title": "We All Are Part & Parcel of Krishna",
    "description": "Learn how we are all part and parcel of Lord Krishna. Explore the deep spiritual meaning behind this and its significance for devotional practice.",
    "poster": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779207410-QuoteDkY2zrp.webp",
    "pages": [
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779207410-QuoteDkY2zrp.webp",
        "w": 240,
        "h": 480,
        "heading": "This Krishna consciousness is already there in everybody. It is not that it is an artificial thing. Love for God is there already, because we are part and parcel of Him.",
        "text": "<p>-Srila Prabhupada </p> <p>SB 1.2.7 - HYDERABAD,</p> <p>APRIL 21, 1974</p>"
      }
    ]
  },
  {
    "slug": "what-gita-teaches-us",
    "title": "What Bhagavad Gita Teaches Us",
    "description": "Discover key teachings from the Bhagavad Gita that offer guidance on life, duty, devotion, and self-realization in a simple and practical way.",
    "poster": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779207791-1Oj8tgUd.webp",
    "pages": [
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779207791-1Oj8tgUd.webp",
        "w": 350,
        "h": 613,
        "heading": "The Gita’s Eternal Teachings",
        "text": "<p>Although spoken ages and generations ago, the Gita has stood the test of time and unwaveringly relevant for all time and yugas eternal. Here are some of its timeless lessons.</p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779208186-285w1AX1.webp",
        "w": 350,
        "h": 613,
        "heading": "Dharma: Fulfilling One’s Duty",
        "text": "<p>Krishna emphasizes the importance of performing one’s duty (dharma) without attachment to the results.</p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779208626-3X1OQg4G.webp",
        "w": 350,
        "h": 613,
        "heading": "Karma Yoga: The Path of Action",
        "text": "<p>Karma Yoga teaches that action, when done without selfish motives, becomes an offering to the divine.</p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779209068-4YsjImUb.webp",
        "w": 350,
        "h": 613,
        "heading": "Bhakti: Devotion to the Divine",
        "text": "<p>Through Bhakti Yoga, Krishna inspires unconditional love and surrender to God.</p>"
      },
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779209450-5peqPXLI.webp",
        "w": 350,
        "h": 613,
        "heading": "Jnana: The Power of Knowledge",
        "text": "<p>Jnana Yoga focuses on self-realization and understanding the eternal nature of the soul.</p>"
      }
    ]
  },
  {
    "slug": "yoga-system-means-to-control",
    "title": "Yoga System Means to Control",
    "description": "Understand that the true essence of the yoga system is self-control. Explore how controlling the mind and senses is central to spiritual practice.",
    "poster": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779211062-untitlede4nVKze.webp",
    "pages": [
      {
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/web-stories/1793779211062-untitlede4nVKze.webp",
        "w": 3456,
        "h": 5184,
        "heading": "Yoga System Means To Control The Mind.",
        "text": "<p>~ Srila Prabhupada</p> <p>SB 1.1.1, CARACAS</p> <p>FEBRUARY 21, 1975</p>"
      }
    ]
  }
];

export const getWebStory = (slug: string) => WEB_STORIES.find((s) => s.slug === slug);
