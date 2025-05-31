require('dotenv').config();
const { Client } = require('@notionhq/client');
const { execSync } = require('child_process');

const notion = new Client({ auth: process.env.NOTION_TOKEN });

async function main() {
  const commitMessage = execSync('git log -1 --pretty=%B').toString().trim();
  const cleanTitle = commitMessage.replace(/^AgroConnect:\s*/, '');

  const res = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
    filter: {
      property: 'Task',
      rich_text: {
        contains: cleanTitle
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
}

main().catch(err => console.error('❌ Error:', err));
