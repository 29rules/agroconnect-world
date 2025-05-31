import 'dotenv/config';
import inquirer from 'inquirer';
import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_TOKEN });

async function getTasks() {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
    filter: {
      property: 'Status',
      select: {
        does_not_equal: '✅'
      }
    }
  });

  return response.results.map(task => ({
    name: task.properties.Task.title[0]?.text?.content,
    value: task.id
  }));
}

async function main() {
  const tasks = await getTasks();
  if (tasks.length === 0) {
    console.log("🎉 All tasks completed!");
    return;
  }

  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'taskId',
      message: '🧠 Pick a task for your next commit:',
      choices: tasks
    }
  ]);

  const task = tasks.find(t => t.value === answer.taskId);
  console.log(`\n💡 Suggested commit message:\nAgroConnect: ${task.name}\n`);
}

main();
