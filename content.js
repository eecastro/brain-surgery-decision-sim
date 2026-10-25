/*
  Where Should the Surgeon Go?
  Copyright (c) 2026 Eric E Castro, Psychology Department, St Ignatius College Prep.
  Licensed under CC BY 4.0: https://creativecommons.org/licenses/by/4.0/

  content.js — everything an instructor might want to edit lives here.

  Both index.html (the student activity) and results.html (the class results page)
  read this file. You can change the story, abilities, corridors, risks and wording
  without touching any other code.

  IMPORTANT: if you change the abilities, the corridors, or the number/order of risks
  in any corridor, change `version` too (for example "V2"). Result codes carry the
  version, so results.html can tell old codes from new ones instead of misreading them.
*/

window.SIM_CONTENT = {
  version: "V1",

  // Credit and license, shown at the bottom of both pages.
  // The CC BY 4.0 license requires keeping the original credit and saying if you changed the work.
  // If you adapt this activity, leave `original` as it is and describe your changes in `adaptation`,
  // for example: "Adapted by Jane Doe, Riverside College: new story and risk percentages."
  credits: {
    original: "Developed by Eric E Castro, Psychology Department, St Ignatius College Prep.",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    adaptation: ""
  },

  // Settings. These can also be overridden per class with the page link (see README):
  //   index.html?gate=off        skip the "wait for your instructor" pause
  //   index.html?gate=SCALPEL    use SCALPEL as today's unlock word
  //   index.html?reset=1         clear the saved progress on this device
  settings: {
    gateEnabled: true,
    gateWord: "INCISION",
    storageKey: "brain-surgery-sim"
  },

  title: "Where Should the Surgeon Go?",
  subtitle: "A pre-surgery decision simulation",

  contentNote:
    "This activity asks you to imagine being diagnosed with a brain tumor and choosing what you are willing to lose. " +
    "If that is too close to something you or your family have lived through, you can sit this one out or simply watch with a classmate. " +
    "Everything here is a simplified teaching scenario, not medical information about any real person.",

  // The patient story. Each string is one paragraph.
  story: {
    heading: "Spring of your senior year",
    paragraphs: [
      "You are 18 and a few weeks from graduating high school. You are right-handed. College plans are set, and the summer is already full.",
      "Since winter you have had headaches that are worst right after you wake up. Some mornings they come with nausea. By lunch they usually fade, so you blamed stress and screens.",
      "Then other things started. Your right hand feels faintly numb, as if it were asleep, and your handwriting has gotten sloppy. Twice your friends laughed when you froze mid-sentence, hunting for a word as ordinary as \u201cfork.\u201d",
      "During a final exam the page in front of you went blurry and stayed that way for a full minute. Your parents took you to your doctor that afternoon.",
      "An MRI found a tumor deep in the left side of your brain, about as far from the surface as it is possible to be. An oncologist explained that it is growing and pressing on the structures around it. A neurosurgeon wants to remove as much of it as possible.",
      "The problem is getting there. Any path to the tumor passes through living brain, and different paths pass through different parts of you. Before the surgeon recommends a route, the team needs to know what matters most to you."
    ]
  },

  // The 12 abilities students compare. `code` must be exactly 3 capital letters and unique.
  abilities: [
    { code: "MEM", name: "Remembering new things",       desc: "Holding on to what happened today, what you studied, where you left your keys." },
    { code: "SPK", name: "Speaking fluently",             desc: "Getting your thoughts out as words, easily and quickly." },
    { code: "UND", name: "Understanding what people say", desc: "Following conversations, lectures, and jokes." },
    { code: "RDW", name: "Reading and writing",           desc: "Texts, books, essays, signs: words on a page or a screen." },
    { code: "NUM", name: "Working with numbers",          desc: "Mental math, making change, budgeting, a feel for \u201chow much.\u201d" },
    { code: "PLN", name: "Planning and self-control",     desc: "Organizing your day, sticking to goals, thinking before you act." },
    { code: "HND", name: "Fine control of your right hand", desc: "Writing, typing, buttons, playing an instrument. You\u2019re right-handed." },
    { code: "LEG", name: "Walking and running",           desc: "Strength and steadiness in your legs: stairs, sports, getting around." },
    { code: "VIS", name: "Seeing everything around you",  desc: "A full field of vision: a car, a curb, a friend waving off to one side." },
    { code: "TCH", name: "Sense of touch",                desc: "Feeling heat, texture, and pain, and knowing where your body is without looking." },
    { code: "INI", name: "Getting yourself started",      desc: "The spark to begin moving, talking, or doing something on your own." },
    { code: "BIM", name: "Using both hands together",     desc: "Tying shoes, catching a ball, cooking, any two-handed task." }
  ],

  pairPrompt: "If the surgeon could protect only one of these, which would you keep?",

  surgeonIntro:
    "The neurosurgeon lays out the ways to reach the tumor. Each path has risks; the percentages are the chance that the structure in the way is damaged. " +
    "Your own rankings are shown next to each risk so you can weigh them.",

  // Approaches to the tumor. `code` must be exactly 4 capital letters and unique.
  // Each risk: ability (code above), p (chance of damage, 0–100), temp (chance that damage
  // fades within about 3 months, 0–1), region (a map region id from `map.regions` below),
  // structure (anatomical name revealed after surgery), effect (what the deficit is like).
  // Optional `field` on vision risks draws a small visual-field diagram:
  //   "upperRight", "lowerRight", or "rightHalf".
  // `tunnel` is the path drawn on the brain map: two [x, y] points on the 500 x 345 map,
  // starting at the brain's surface and ending at the tumor. Leave it out for no tunnel.
  corridors: [
    {
      code: "FRON",
      name: "Through the front of the brain",
      approach: "An opening near the forehead, then a tunnel straight back through the frontal lobe and into the fluid-filled space beside the tumor.",
      tunnel: [[72, 104], [236, 168]],
      risks: [
        { ability: "PLN", p: 55, temp: 0.3, region: "pfc",       structure: "Left prefrontal cortex",
          effect: "Planning, organizing, and holding back impulses get harder. You may start things and lose the thread, or say things before thinking." },
        { ability: "SPK", p: 25, temp: 0.5, region: "broca",     structure: "Broca\u2019s area (left inferior frontal gyrus)",
          effect: "Speech becomes slow and effortful. You know what you want to say, but it comes out in short, broken phrases." },
        { ability: "HND", p: 20, temp: 0.5, region: "motorHand", structure: "Primary motor cortex, hand area",
          effect: "Your right hand is weak and clumsy. Handwriting, typing, and buttons become slow work." },
        { ability: "MEM", p: 20, temp: 0.2, region: "fornix",    structure: "Fornix (a memory pathway)",
          effect: "A key memory pathway is cut. New conversations, assignments, and plans slip away within hours." }
      ]
    },
    {
      code: "PARI",
      name: "Through the top and back of the brain",
      approach: "An opening toward the back of the head, then a tunnel down through the parietal lobe.",
      tunnel: [[318, 50], [252, 163]],
      risks: [
        { ability: "TCH", p: 50, temp: 0.4, region: "s1",         structure: "Primary somatosensory cortex",
          effect: "The right side of your body feels numb and far away. You may not notice a hot pan, or know where your hand is unless you look." },
        { ability: "NUM", p: 45, temp: 0.2, region: "ips",        structure: "Intraparietal sulcus",
          effect: "Numbers stop making intuitive sense. Making change, estimating, and mental math become very hard." },
        { ability: "RDW", p: 40, temp: 0.3, region: "angular",    structure: "Left angular gyrus",
          effect: "Reading and writing break down. Words that used to be automatic must be decoded letter by letter, if at all." },
        { ability: "VIS", p: 35, temp: 0.1, region: "opticUpper", structure: "Upper optic radiations", field: "lowerRight",
          effect: "You lose the lower-right quarter of vision in both eyes. Curbs, stairs, and the bottom corner of a page vanish." }
      ]
    },
    {
      code: "TEMP",
      name: "Through the side of the head",
      approach: "An opening above the left ear, then a tunnel inward through the temporal lobe.",
      tunnel: [[292, 244], [250, 180]],
      risks: [
        { ability: "VIS", p: 65, temp: 0.05, region: "meyer",       structure: "Meyer\u2019s loop of the optic radiations", field: "upperRight",
          effect: "You lose the upper-right quarter of vision in both eyes, sometimes called \u201cpie in the sky.\u201d" },
        { ability: "UND", p: 40, temp: 0.4,  region: "wernicke",    structure: "Wernicke\u2019s area (left posterior superior temporal gyrus)",
          effect: "Spoken words sound familiar but stop making sense. Your own speech may flow easily yet carry little meaning." },
        { ability: "MEM", p: 35, temp: 0.15, region: "hippocampus", structure: "Left hippocampus",
          effect: "Forming new memories becomes hard, especially for words, names, and things you hear or read." }
      ]
    },
    {
      code: "MIDL",
      name: "Down between the two halves",
      approach: "An opening on top of the head, then down through the gap between the two hemispheres and through the bridge that connects them.",
      tunnel: [[214, 20], [242, 160]],
      risks: [
        { ability: "INI", p: 60, temp: 0.85, region: "sma",      structure: "Supplementary motor area",
          effect: "You struggle to start moving or speaking on your own. You may sit silently even when you want to talk. This often improves over weeks." },
        { ability: "LEG", p: 40, temp: 0.6,  region: "motorLeg", structure: "Motor cortex, leg area (paracentral lobule)",
          effect: "Your right leg is weak. Walking, stairs, and running are all affected." },
        { ability: "BIM", p: 30, temp: 0.4,  region: "callosum", structure: "Corpus callosum",
          effect: "The two halves of your brain communicate less well. Two-handed tasks such as tying shoes or playing an instrument become awkward." },
        { ability: "MEM", p: 25, temp: 0.1,  region: "fornix",   structure: "Fornix (a memory pathway)",
          effect: "A key memory pathway is cut. New conversations, assignments, and plans slip away within hours." }
      ]
    },
    {
      code: "NONE",
      name: "No open surgery",
      approach: "A needle biopsy confirms the diagnosis, followed by radiation and medication. No tunnel is cut, but the tumor stays where it is and may keep pressing on what surrounds it.",
      risks: [
        { ability: "TCH", p: 70, temp: 0,   region: "thalamus", structure: "Left thalamus (sensory relay)",
          effect: "Sensation from the right side of your body is scrambled. Some people develop a lasting burning pain there." },
        { ability: "HND", p: 50, temp: 0.1, region: "capsule",  structure: "Internal capsule",
          effect: "The fibers carrying movement commands are squeezed. Your right hand, and then your whole right side, weakens." },
        { ability: "SPK", p: 35, temp: 0.2, region: "thalamus", structure: "Left thalamus (language connections)",
          effect: "Word-finding gets worse. You speak less and pause often, searching for words." },
        { ability: "MEM", p: 35, temp: 0,   region: "thalamus", structure: "Left thalamus (memory circuits)",
          effect: "New information slips away more and more often." },
        { ability: "VIS", p: 30, temp: 0,   region: "lgn",      structure: "Lateral geniculate nucleus", field: "rightHalf",
          effect: "You lose the right half of your vision in both eyes." }
      ]
    }
  ],

  tumorReveal:
    "Your tumor sat in the left thalamus, a relay station deep in the brain that passes touch, movement, vision, and memory signals between the body and the cortex. " +
    "That is why your first symptoms were a numb right hand, lost words, and blurred vision.",

  simulationNote:
    "This simulation exaggerates on purpose. Real surgeons map the brain before and during surgery, sometimes with the patient awake and talking, " +
    "and use imaging of the brain\u2019s wiring to slip between critical areas. Damage is usually partial, many deficits improve with rehabilitation, " +
    "and the percentages here are illustrative, not real statistics. What is real is the trade-off: every path through the brain passes through someone\u2019s abilities.",

  // Brain map drawing (500 x 345, left hemisphere seen from the left side, front of the head on the left).
  // You only need to edit this if you add a structure that is not already drawn.
  // Shapes: ellipse {cx, cy, rx, ry, rot} or path. `deep: true` draws it dashed (inside the brain).
  // `stroke: true` draws a path as a fiber line; `mark: [x, y]` places its numbered marker.
  map: {
    tumor: { cx: 245, cy: 172, r: 11 },
    regions: {
      pfc:         { label: "Prefrontal cortex",           ellipse: { cx: 104, cy: 120, rx: 40, ry: 38 } },
      broca:       { label: "Broca\u2019s area",            ellipse: { cx: 148, cy: 196, rx: 26, ry: 15, rot: -12 } },
      motorHand:   { label: "Motor cortex (hand)",         ellipse: { cx: 210, cy: 112, rx: 11, ry: 24, rot: 14 } },
      motorLeg:    { label: "Motor cortex (leg)",          ellipse: { cx: 236, cy: 42,  rx: 17, ry: 11 } },
      sma:         { label: "Supplementary motor area",    ellipse: { cx: 196, cy: 54,  rx: 20, ry: 12, rot: -10 }, deep: true },
      s1:          { label: "Somatosensory cortex",        ellipse: { cx: 244, cy: 112, rx: 11, ry: 26, rot: 14 } },
      ips:         { label: "Intraparietal sulcus",        ellipse: { cx: 298, cy: 104, rx: 30, ry: 12, rot: 10 } },
      angular:     { label: "Angular gyrus",               ellipse: { cx: 334, cy: 160, rx: 22, ry: 18 } },
      wernicke:    { label: "Wernicke\u2019s area",         ellipse: { cx: 276, cy: 202, rx: 28, ry: 13, rot: -10 } },
      hippocampus: { label: "Hippocampus",                 path: "M200 242 C215 232 250 234 272 244 C262 252 228 252 200 242 Z", deep: true },
      fornix:      { label: "Fornix",                      path: "M270 238 C300 205 285 150 232 146 C204 146 186 164 190 186", deep: true, stroke: true, mark: [284, 181] },
      callosum:    { label: "Corpus callosum",             path: "M158 152 C176 106 300 100 334 146", deep: true, stroke: true, width: 9, mark: [240, 114] },
      thalamus:    { label: "Thalamus",                    ellipse: { cx: 243, cy: 172, rx: 27, ry: 16 }, deep: true },
      capsule:     { label: "Internal capsule",            path: "M214 168 C210 150 205 130 200 112", deep: true, stroke: true, width: 8, mark: [206, 138] },
      lgn:         { label: "Lateral geniculate nucleus",  ellipse: { cx: 262, cy: 186, rx: 8, ry: 6 }, deep: true, mark: [276, 204] },
      opticUpper:  { label: "Optic radiations (upper)",    path: "M262 182 C310 160 385 158 446 178", deep: true, stroke: true, mark: [372, 164] },
      meyer:       { label: "Meyer\u2019s loop",           path: "M262 190 C232 214 268 236 330 218 C382 205 420 198 446 190", deep: true, stroke: true, mark: [318, 221] }
    }
  }
};
