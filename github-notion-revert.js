import fs from 'fs';
import { Client } from '@notionhq/client';
import sendMail from './mailer.js';
import 'dotenv/config';

const notion = new Client({ auth: process.env.NOTION_TOKEN });

async function revertDeletedTasks() {
  const lines = fs.readFileSync('deleted.txt', 'utf-8').trim().split('\n');

  for (const line of lines) {
    const fileName = line.split('\t')[1] || line.split(' ')[1];
    const title = fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ').trim();

    const response = await notion.databases.query({
      database_id: process.env.AGRO_DB_ID,
      filter: {
        property: 'Task',
        title: {
          equals: title
        }
      }
    });

    if (!response.results.length) {
      console.log(`❌ No matching task for deleted file: ${title}`);
      continue;
    }

    const page = response.results[0];
    await notion.pages.update({
      page_id: page.id,
      properties: {
        Status: {
          select: {
            name: '❌'
          }
        }
      }
    });

    console.log(`🔁 Reverted "${title}" to ❌`);

    await sendMail(
      `🚨 Task Reverted: ${title}`,
      `The task "${title}" was removed from GitHub. Status has been set to ❌ in Notion.`
    );
  }
}

revertDeletedTasks().catch(err => console.error("❌ Revert error:", err));
