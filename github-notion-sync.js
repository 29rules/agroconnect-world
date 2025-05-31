import { Client } from '@notionhq/client';
import 'dotenv/config';
import sendMail from './mailer.js'; // ✅ ES6 import if you're using `.mjs`

const notion = new Client({ auth: process.env.NOTION_TOKEN });

async function main() {
  const commitMessage = process.argv[2] || '';
  const cleanTitle = commitMessage.trim();

  const res = await notion.databases.query({
    database_id: process.env.AGRO_DB_ID,
    filter: {
      property: 'Task',
      title: {
        equals: cleanTitle
      }
    }
  });

  if (!res.results.length) {
    console.log(`❌ No matching task found for "${cleanTitle}"`);
    return;
  }

  const task = res.results[0];
  await notion.pages.update({
    page_id: task.id,
    properties: {
      Status: {
        select: {
          name: '✅'
        }
      }
    }
  });

  console.log(`✅ Updated task "${cleanTitle}" to ✅`);

  // ✅ Email alert after successful update
  await sendMail(
    "✅ AgroConnect GitHub Task Synced",
    `The task "${cleanTitle}" was marked complete via GitHub commit. Great job!`
  );
}

main().catch(err => console.error('❌ Error:', err));
