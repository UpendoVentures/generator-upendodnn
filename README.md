# generator-upendodnn [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]  

> Scaffolds DNN extensions, including Modules (Webforms, SPA, and MVC), Persona Bar, Skin Object, Library, Scheduler, and Hotcakes Commerce projects (based on [generator-dnn](https://github.com/mtrutledge/generator-dnn) built by Matt Rutledge).  

Learn more about DNN CMS at [the official DNN community website](https://dncommunity.org).

The 25 minute video below will walk you through everything you need to know.  (right-click and open in a new tab)

[![DNN: Building Enterprise & Team Friendly Solutions & Extensions with UpendoDNN](http://img.youtube.com/vi/ZD1p5DDlY2E/0.jpg)](http://www.youtube.com/watch?v=ZD1p5DDlY2E "DNN: Building Enterprise & Team Friendly Solutions & Extensions with UpendoDNN")


## Installation  

First, install [Yeoman](http://yeoman.io) and generator-upendodnn using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).  

Warning: You may need to [add the user path to your Environmental Variables](https://superuser.com/questions/949560/how-do-i-set-system-environment-variables-in-windows-10).  Here is an example from Windows 10 (you'd replace your username):

`C:\Users\yourUsername\AppData\Roaming\npm`

You also need to install the latest version of MSBuild if you don't already have it installed.

* [Build tools for Visual Studio 2017](https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2017)  
* [Build tools for Visual Studio 2015](https://www.microsoft.com/en-us/download/details.aspx?id=48159)  
* [Build tools for Visual Studio 2013](https://www.microsoft.com/en-us/download/details.aspx?id=40760)  

> Note: Visual Studio 2019 should have installed MSBuild for you.  

Now, simply run the following commands:

```bash
npm install -g yo
npm install -g yarn
npm install -g generator-upendodnn
```

Then generate your new project:

```bash
mkdir my-project-name
cd my-project-name
yo upendodnn
```

You're intended to first create the `Solution Structure` if you haven't yet done so in this directory.

[More verbose instructions on how to use this.](http://www.dnnsoftware.com/community-blog/cid/155574/create-a-dnn-module-in-less-than-2-minutes)  
 
## Video Overview

* [DNN: Building Enterprise & Team Friendly Solutions & Extensions with UpendoDNN](https://www.youtube.com/watch?v=ZD1p5DDlY2E)

## First-Timers: How to Use  

First, install the generator using the steps above.  

1. Create and navigate to a folder where you wish to begin your new DNN-based solution. (command line example is above)  
2. Run `yo upendodnn` in CMD or Powershell in that folder.  
3. For the first time, you'll want to always first choose the `Solution Structure` scaffold and step through the wizard.  
4. Once the solution scaffold is created, run `yo upendodnn` again to add your other desired DNN projects.  
5. After you add the desired solution/project, open the original Solution scaffold in Visual Studio and add the new project to this main solution.  

That's it!  Now you can begin building your awesome DNN extension(s) as you see fit.  Everything is now under one easy to open, run, code, build, and commit to source control solution.  

Say hi to Will at [DNN Summit](https://www.dnnsummit.org/) and [DNN-Connect](https://www.dnn-connect.org/). :)  

## Additional Features  

By default, the namespace and extension names will be cased using Pascal-casing rules. If you'd like to override this behavior, you can add a `-f` parameter to the name.  

For example, if your company name is abcCompany, the default behavior will change the name to AbcCompany.  In most cases, this is the intended behavior. If you enter `abcCompany -f`, the namespace or extension name will honor the casing as-is.  

## More Documentation  

Want to learn more or how to build the generator code locally?  

[Original Project Documentation](https://mtrutledge.github.io/generator-dnn/)  

## License  

MIT © 2018 [Matt Rutledge]()  

MIT © 2019-2020 [Upendo Ventures, LLC](https://upendoventures.com)  


[npm-image]: https://badge.fury.io/js/generator-upendodnn.svg  
[npm-url]: https://npmjs.org/package/generator-upendodnn  
[travis-image]: https://travis-ci.org/UpendoVentures/generator-upendodnn.svg?branch=master  
[travis-url]: https://travis-ci.org/UpendoVentures/generator-upendodnn  
[daviddm-image]: https://david-dm.org/UpendoVentures/generator-upendodnn.svg?theme=shields.io  
[daviddm-url]: https://david-dm.org/UpendoVentures/generator-upendodnn  
