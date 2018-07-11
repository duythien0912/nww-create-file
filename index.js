#!/usr/bin/env node

const inquirer = require("inquirer");
const chalk = require("chalk");
const figlet = require("figlet");
const shell = require("shelljs");
const fs = require("fs");

const init = () => {
  console.log(
    chalk.green(
      figlet.textSync("Create Plugin", {
        //font: "Ghost",
        horizontalLayout: "default",
        verticalLayout: "default"
      })
    )
  );
};

const askQuestionsPath1 = () => {
  const questions = [
    {
      name: "FILETEMPLATE",
      type: "confirm",
      message: "What do you want use file template?"
    }
  ];
  return inquirer.prompt(questions);
};

const askQuestionsPath2 = () => {
  const questions = [
    {
      name: "FILENAME",
      type: "input",
      message: "What is the name of the file without extension?"
    },
    {
      type: "list",
      name: "EXTENSION",
      message: "What is the file extension?",
      choices: [".vue", ".js", ".html", ".css", ".gql", "json", "md"],
      filter: function(val) {
        return val.split(".")[1];
      }
    }
  ];
  return inquirer.prompt(questions);
};

const askQuestionsPath3 = () => {
  const questions = [
    {
      type: "list",
      name: "TEMPLATE",
      message: "What is the file extension?",
      choices: [".gitignore", ".babelrc", ".env"],
      filter: function(val) {
        return val;
      }
    }
  ];
  return inquirer.prompt(questions);
};

const createFile = (filename, extension) => {
  const filePath = `${process.cwd()}/${filename}.${extension}`;
  shell.touch(filePath);
  return filePath;
};

const createFileTemplate = FILETEMPLATE => {
  const filePath = `${process.cwd()}/${FILETEMPLATE}`;
  //shell.touch(filePath);
  var content = "";

  switch (FILETEMPLATE) {
    case ".babelrc":
      content = `{
  "presets": ["env"]
}`;
      break;

    case ".gitignore":
      content = `.DS_Store
node_modules
/dist
/build

# local env files
.env.local
.env.*.local

# Log files
npm-debug.log*
yarn-debug.log*
yarn-error.log*`;
      break;

    default:
      content = "";
  }

  fs.writeFile(FILETEMPLATE, content, function(err) {
    if (err) throw err;
  });

  return filePath;
};

const success = filepath => {
  console.log(chalk.white.bgGreen.bold(`Done! File created at ${filepath}`));
};

const run = async () => {
  // show script introduction
  init();

  // ask questions
  const answersPath1 = await askQuestionsPath1();

  const { FILETEMPLATE } = answersPath1;

  var filePath = "";

  if (FILETEMPLATE === false) {
    const answersPath2 = await askQuestionsPath2();

    const { FILENAME, EXTENSION } = answersPath2;

    // create the file
    filePath = createFile(FILENAME, EXTENSION);
  } else {
    const answersPath3 = await askQuestionsPath3();
    const { TEMPLATE } = answersPath3;
    filePath = createFileTemplate(TEMPLATE);
  }

  // show success message
  success(filePath);
};

run();