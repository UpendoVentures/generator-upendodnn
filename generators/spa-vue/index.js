const DnnGeneratorBase = require('../lib/DnnGeneratorBase')
const chalk = require('chalk')

module.exports = class extends DnnGeneratorBase {
  async prompting() {
    const prompts = [
      {
        when: !this.options.company,
        type: 'input',
        name: 'company',
        message: 'Namespace for your SPA module (Usually a company name)?',
        store: true,
        validate: str => {
          return str.length > 0;
        }
      },
      {
        when: !this.options.name,
        type: 'input',
        name: 'name',
        message: 'What is the name of your SPA Module?',
        default: this.appname,
        validate: str => {
          return str.length > 0;
        }
      },
      {
        when: !this.options.description,
        type: 'input',
        name: 'description',
        message: 'Describe your SPA module:',
        validate: str => {
          return str.length > 0;
        }
      }
    ]

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      props.currentDate = new Date();
      if (this.options.company.endsWith(" -f")) {
        props.namespace = this.options.company.replace(" -f", "");
      }
      else {
        props.namespace = this._pascalCaseName(this.options.company);
      }
      if (props.name.endsWith(" -f")) {
        props.extensionName = props.name.replace(" -f", "");
      }
      else {
        props.extensionName = this._pascalCaseName(props.name);
      }
      props.fullNamespace = props.namespace + "." + props.extensionName;
      props.guid = this._generateGuid();

      this.props = props;
    })

  }

  writing() {
    this.destinationRoot("Modules/");

    let namespace = this.props.namespace;
    let extensionName = this.props.extensionName;
    let currentDate = this.props.currentDate;
    let fullNamespace = this.props.fullNamespace;
    let guid = this.props.guid;

    let template = {
      yourName: this.options.yourName,
      company: this.options.company,
      namespace: namespace,
      extensionName: extensionName,
      moduleFriendlyName: this.props.name,
      description: this.props.description,
      companyUrl: this.options.companyUrl,
      emailAddy: this.options.emailAddy,
      currentYear: currentDate.getFullYear(),
      version: '1.0.0',
      menuLinkName: this.props.menuLinkName,
      parentMenu: this.props.parentMenu,
      extensionType: this.props.extensionType,
      fullNamespace: this.props.fullNamespace,
      guid: this.props.guid,
      localhost: this.options.dnnHost,
      dnnRoot: this.options.dnnRoot
    };


    this.fs.copyTpl(
      this.templatePath('Module.csproj'),
      this.destinationPath(extensionName + '/' + extensionName + '.csproj'),
      template
    );
    this.fs.copyTpl(
      this.templatePath('Module.dnn'),
      this.destinationPath(extensionName + '/' + extensionName + '.dnn'),
      template
    );
    this.fs.copyTpl(
      this.templatePath('Data/ModuleContext.cs'),
      this.destinationPath(extensionName + '/Data/' + extensionName + 'Context.cs'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('common/**'),
      this.destinationPath(extensionName + '/.'),
      template
    );

  }

  install() {
    this._defaultInstall();
  }

  end() {
    this.log(chalk.white('Installed Webforms Module npm Dependencies.'));
    this.log(chalk.white('Running dotnet restore.'));
    this.spawnCommand('dotnet', ['restore']);
    process.chdir('../');
    this.log(chalk.green('All Ready!'));
  }
}