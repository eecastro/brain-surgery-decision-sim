# Where Should the Surgeon Go? A class simulation

A pre-surgery decision simulation for introductory neuropsychology and biopsychology courses, designed to run before a lecture on brain anatomy.

Students imagine they are graduating high school seniors diagnosed with a tumor deep in the left side of the brain. They decide, two abilities at a time, what they would most want to protect. A neurosurgeon then offers several routes to the tumor, each passing through different brain tissue with different risks. Students choose a route, sign consent, and the surgery is "rolled." The reveal shows which structures were damaged on a brain map, names them anatomically, and shows which deficits fade after three months. The goal is for students to feel how hard these trade-offs are for real patients, and to arrive at the anatomy lecture already caring about the structures they just lost.

**Developed by Eric E Castro, Psychology Department, St Ignatius College Prep.**

## What students do

1. **Diagnosis.** A short story describes their symptoms: morning headaches, a numb and clumsy right hand, lost words, and a blurred-vision episode during a final exam, leading to an MRI.
2. **Priorities.** About 30 "which would you keep?" choices between 12 everyday abilities, such as remembering new things, understanding speech, walking, and seeing everything around you. The page sorts these choices into a ranking from #1 to #12.
3. **Consultation.** Five options: four surgical routes (through the front, through the top and back, through the side, and down between the two hemispheres) and a no-surgery option. Each lists its risks as percentages, with the student's own ranking shown beside each risk. Students choose one and sign with their initials.
4. **Surgery.** After an optional "wait for your instructor" pause, a needle lands somewhere from 0 to 100 for each structure in the path. Landing in the risk zone means damage.
5. **Recovery.** A brain map shows the route, the tumor, and every structure in the path, marked as damaged, damaged but may recover, or spared. A switch shows the outcome three months later. Students also see how their choice compared with the other routes given their own priorities, and get a result code to submit. At the bottom, they can save their results as a PDF or start over.

Plan for roughly 25 to 35 minutes, including time for students to discuss their outcomes with their neighbors.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The student activity. |
| `results.html` | The instructor's class results page. |
| `content.js` | All the editable content: story, abilities, routes, risks, wording, settings, and the brain map shapes. |
| `sim-core.js` | Shared code for result codes. No editing needed. |
| `style.css` | Shared styles. |
| `LICENSE` | The CC BY 4.0 license. |

There is no build step and no server. The pages work as plain files.

## Put it online with GitHub Pages

1. Fork this repository, or create a new repository and upload these files to it.
2. In the repository, open **Settings**, then **Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select the `main` branch and the `/ (root)` folder, and save.
4. After a minute or two, the site is live at `https://YOUR-USERNAME.github.io/REPOSITORY-NAME/`.

Students use that link. The results page is at the same address followed by `results.html`.

## Running it in class

**Share the student link** on the projector or your course page. The activity works on phones, tablets, and laptops.

**The surgery-day pause.** By default, students stop before their surgery with the message "Your surgery is scheduled. Wait for your instructor." When the class is ready, put the unlock word on the projector and everyone's surgery happens at once. This keeps early finishers from showing their labeled brain maps to classmates who are still choosing, and gives you one shared moment of suspense.

- The default word is `INCISION`. Capitalization does not matter.
- To use a different word without editing any files, add it to the link: `index.html?gate=SCALPEL`.
- To skip the pause (for homework or self-paced use): `index.html?gate=off`.
- Because the repository is public, a determined student could find the word in the source. Using a fresh word in the link each class makes that less useful.

**No accidental re-rolling.** Each student's progress is saved in their own browser, and the surgery result is saved the moment it is rolled, so refreshing the page does not give a second chance. Students who close a private or incognito window will lose their progress and have to start over.

**Saving results as a PDF.** The Recovery step ends with a box for the student's name and a **Save as PDF** button. It opens the browser's print window, where students choose "Save as PDF" as the destination (on phones, the share or print option does the same). The PDF includes the student's name, the date, the route, the result code, the brain map right after surgery and three months later, each structure's outcome, the full #1 to #12 priority ranking, and the comparison with the other routes. If you want a document students can upload to your learning management system, this is it.

**Starting over.** The **Start over** button, next to Save as PDF, asks for confirmation and then erases the student's choices and result on that device so they can go through the whole activity again with a new surgery roll. If the unlock word is on, they will need it again. If you want each student's first result to count, ask them to submit their code or PDF before trying again.

**Clearing a device.** To clear the saved progress on a device without going through to the end (for example, a shared lab computer or your own testing), open `index.html?reset=1`.

**Content note.** The activity opens with a short content note inviting students who have personal or family experience with brain tumors, stroke, or brain surgery to sit out or watch alongside a classmate. You can edit this text in `content.js`.

## Collecting results with Google Forms

The activity is not connected to Google Forms or any other service, so it works the same for anyone who uses or forks it. Students copy their result code, and you collect the codes however you like. With Google Forms:

1. Create a form with one **Short answer** question, such as "Paste your result code." Add a name question too if you want one.
2. In the form's **Responses** tab, choose **Link to Sheets** to send responses to a Google Sheets spreadsheet.
3. After students submit, open the linked spreadsheet, click the column letter above the result codes to select the whole column, and copy it.
4. Open `results.html`, paste into the box, and choose **Show class results**.

The results page ignores the column header, blank cells, and anything that is not a result code, so a messy paste works. You can also paste codes collected from a discussion board, an email, or a typed list. Pasted codes stay in your browser; nothing is uploaded anywhere.

The results page shows which abilities the class protected most and gave up most, how many students chose each route, and, for each route, how many permanent deficits each student ended up with. A table compares each stated risk with how often that damage actually happened in your class, which shows that students who made the same choice ended up with different outcomes.

Choose **Try with sample data** to see the page with 32 simulated students before class.

## How result codes work

A result code looks like this:

```
V1-MEM-UND-SPK-NUM-BIM-LEG-TEMP-PSS
```

| Part | Meaning |
| --- | --- |
| `V1` | Version of the activity content. |
| `MEM-UND-SPK` | The student's top three priorities, #1 first. |
| `NUM-BIM-LEG` | The bottom three, ranks #10, #11, and #12. The last one is the student's lowest priority. |
| `TEMP` | The route chosen. |
| `PSS` | What happened to each structure on that route, in order: `P` permanent damage, `T` temporary damage, `S` spared. |

The ability and route abbreviations are listed in `content.js`. Codes can be typed in upper or lower case, and smart dashes inserted by phones are handled.

## Customizing the activity

Everything students read is in `content.js`, including the credit line (see [License](#license) for what to keep), and the story, the 12 abilities, the five routes, each risk's percentage, its chance of recovering, the anatomical names, and the description of each deficit. Open it in any text editor or directly on GitHub.

**If you change the abilities, add or remove a route, or change the number or order of risks on any route, also change `version`** (for example, from `"V1"` to `"V2"`). Result codes carry the version, and the results page counts only codes that match its own version. This prevents codes from different versions being misread. Wording changes and percentage changes do not require a new version.

The brain map at the bottom of `content.js` defines the shapes for each structure on a 500 by 345 drawing of the left hemisphere seen from the left side, with the front of the head on the left. Each risk names one of these structures with `region`, and each route's `tunnel` gives the start and end points of the path drawn to the tumor. You only need to edit the map if you add a structure that is not already drawn.

## About accuracy

The simulation exaggerates on purpose, and says so to students at the end. Real neurosurgeons map function before and during surgery, sometimes with the patient awake, and use imaging of white-matter pathways to avoid critical tissue. Damage is usually partial, rehabilitation helps, and the percentages in this activity are illustrative rather than real statistics. The anatomy is simplified: the map is a stylized lateral view with deep structures drawn as dashed outlines. The structure-to-function pairings follow standard introductory textbook coverage.

## Privacy

The activity does not collect, send, or store any student data outside the student's own browser. Progress, including the name a student types for their PDF, is saved in the browser's local storage on that device only, and **Start over** erases it. The only outside request the pages make is for the Atkinson Hyperlegible typeface from Google Fonts; if it cannot load, the pages fall back to the device's system font.

## License

This activity is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). The full license text is in the `LICENSE` file.

You are free to use, share, and adapt this activity for any purpose, including in your own courses and at other institutions, as long as you give credit:

- **Keep the original credit.** Both pages show "Developed by Eric E Castro, Psychology Department, St Ignatius College Prep" at the bottom, along with the license. Leave that in place.
- **Say what you changed.** If you modify the activity, describe your changes in the `adaptation` line of `content.js` (for example, "Adapted by Jane Doe, Riverside College: new story and risk percentages."). It appears next to the original credit on both pages.
- **Link to the license.** The pages already do this, and keeping the `LICENSE` file in your copy covers it too.

Suggested credit when citing or sharing this activity elsewhere:

> *Where Should the Surgeon Go?* by Eric E Castro, Psychology Department, St Ignatius College Prep, licensed under CC BY 4.0.
