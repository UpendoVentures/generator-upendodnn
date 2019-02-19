'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const uuid = require('uuid-v4');
const pascalCase = require('pascal-case');
const mkdirp = require('mkdirp');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    // This method adds support for a `--test` flag
    this.option('noinstall');
  }

  prompting() {
    const prompts = [
      {
        when: !this.options.companyName,
        type: 'input',
        name: 'companyName',
        message:
          'What is your company name? (Do not include spaces or punctuation, e.g., UpendoVentures)',
        store: true,
        validate: str => {
          return str.length > 0;
        }
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      props.currentDate = new Date();
      props.solutionGuid = uuid();
      props.companyName = pascalCase(props.companyName);

      this.props = props;
    });
  }

  writing() {
    this.log(chalk.white('Creating solution structure.'));

    this.fs.copy(this.templatePath('Build/**'), this.destinationPath('Build/'));

    this.fs.copy(this.templatePath('References/**'), this.destinationPath('References/'));

    this.fs.copy(this.templatePath('gitignore'), this.destinationPath('.gitignore'));

    this.fs.copy(
      this.templatePath('DotNetNuke.log4net.config'),
      this.destinationPath('Website/DotNetNuke.log4net.config')
    );

    this.fs.copy(this.templatePath('README.md'), this.destinationPath('README.md'));

    this.fs.copy(
      this.templatePath('web.config'),
      this.destinationPath('Website/web.config')
    );

    this._writeSolution();
  }

  _createSolutionFromTemplate() {
    this.log(chalk.white('Creating sln from template.'));
    let companyName = this.props.companyName;
    let solutionGuid = this.props.solutionGuid;

    this.fs.copyTpl(
      this.templatePath('_Template.sln'),
      this.destinationPath(companyName + '.DNN.sln'),
      {
        solutionGuid: solutionGuid
      }
    );
  }

  _writeSolution() {
    let companyName = this.props.companyName;
    let slnFileName = this.destinationPath(companyName + '.DNN.sln');

    this.log(
      chalk.white(
        'Looking for sln [' + slnFileName + ']. Result: ' + this.fs.exists(slnFileName)
      )
    );
    if (this.fs.exists(slnFileName)) {
      this.log(chalk.white('Existing sln file found.'));
    } else {
      // File does not exist
      this.log(chalk.white('No sln file found.'));
      this._createSolutionFromTemplate();
    }
  }

  install() {
    this.log(chalk.white('Creating solution folders in the file system.'));
    mkdirp.sync('Assets');
    mkdirp.sync('Libraries');
    mkdirp.sync('Modules');
    mkdirp.sync('SkinObjects');
    mkdirp.sync('Skins');
    mkdirp.sync('Viewsets');
    mkdirp.sync('Website');
  }

  end() {
    this.log(chalk.green('All Ready!'));
  }
};
