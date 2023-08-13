# generator-upendodnn  

[![NPM version][npm-image]][npm-url]  [![Build Status][travis-image]][travis-url]  ![Libraries.io dependency status for GitHub repo](https://img.shields.io/librariesio/github/UpendoVentures/generator-upendodnn)  

> Scaffolds DNN extensions, including Modules (Webforms, SPA, and MVC), Persona Bar, Skin Object, Library, Scheduler, and Hotcakes Commerce projects (based on [generator-dnn](https://github.com/mtrutledge/generator-dnn) built by Matt Rutledge).  

The 25-minute video below will walk you through everything you need to know.  (right-click and open in a new tab)

[![DNN: Building Enterprise & Team Friendly Solutions & Extensions with UpendoDNN](http://img.youtube.com/vi/ZD1p5DDlY2E/0.jpg)](http://www.youtube.com/watch?v=ZD1p5DDlY2E "DNN: Building Enterprise & Team Friendly Solutions & Extensions with UpendoDNN")  

<hr />  

## `Sponsors == (typeOf superHuman) Awesome;`  

> Yes, it's not real code. It's just supposed to be fun. :P

This solution is created and maintained by [Upendo Ventures](https://upendoventures.com/What/CMS/DNN) for the [DNN CMS Community](https://dnncommunity.org). Please consider [sponsoring us](https://github.com/sponsors/UpendoVentures) for this and [the many other open-source efforts we do](https://upendoventures.com/What/CMS/DNN/Extensions).  It's a lot.  :)  

- [Sponsor Us](https://github.com/sponsors/UpendoVentures) (we're grateful at any level)  

<hr />  

## Installation  

### 1. Manual Software Installation  

This generator is dependent on the following popular frameworks, and needs them to be installed for you to use this generator. You probabably already have them installed. 

First, install/upgrade [Node.js](https://nodejs.org/en)  and `npm` to the **most current version**.  

- [Use a Node Version Manager to Install Node.js & npm]([https://docs.npmjs.com/downloading-and-installing-node-js-and-npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm#using-a-node-version-manager-to-install-nodejs-and-npm))  

> Warning: You may need to [add the user path to your Environmental Variables](https://superuser.com/questions/949560/how-do-i-set-system-environment-variables-in-windows-10).  Here is an example from Windows 10 (you'd replace `yourUsername`, obviously):
> 
> `C:\Users\yourUsername\AppData\Roaming\npm`  

### 2. Dependency: MSBuild (optional?)  

You also need to install the latest version of MSBuild if you don't already have it installed.

> Note: Visual Studio 2019 (and newer) should have installed MSBuild for you.  

<details> 
  <summary>Do You Need to Install MSBuild Manually?</summary> 
  
  ### MSBuild Download Locations  
  * [Latest Build Tools for Visual Studio](https://visualstudio.microsoft.com/downloads/)  
    * Scroll down to find "Tools for Visual Studio" and expand it. 
    * You'll see a download button for "Build Tools for Visual Studio 2022".  
  * [Build tools for Visual Studio 2017](https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2017)  
  * [Build tools for Visual Studio 2015](https://www.microsoft.com/en-us/download/details.aspx?id=48159)  
  * [Build tools for Visual Studio 2013](https://www.microsoft.com/en-us/download/details.aspx?id=40760)  

</details>  

### 3. Finish Installing by Command Line  

The commands below will install the final bits.  

1. Install Yeoman:  

```bash  
npm install -g yo  
```  

2. Install Yarn:  

```bash  
npm install -g yarn  
```  

3. Install the generator:  

```bash  
npm install -g generator-upendodnn  
```  

## Using UpendoDNN Generator  

Now, you're ready to sprint through your DNN projects! 

Here are the steps to generate your new project... **4 easy steps!**  

1. Create a folder for it:  

```bash
mkdir my-project-name  
```  

2. Go into that folder.  

```bash  
cd my-project-name  
```  

3. Choose the project to install.  

```bash  
yo upendodnn  
```  

4. Open the solution in Visual Studio, and have fun writing code!  

### IMPORTANT!  

You need to first create the `Solution Structure` if you haven't yet done so in this directory.  Then, create any extension you want.  

[More verbose instructions on how to use this.](http://www.dnnsoftware.com/community-blog/cid/155574/create-a-dnn-module-in-less-than-2-minutes)  
 
## First-Timers: How to Use (verbose)  

First, install the generator using the steps above.  

1. Create and navigate to a folder where you wish to begin your new DNN-based solution. (command line example is above)  
2. Run `yo upendodnn` in CMD or Powershell in that folder.  
3. For the first time, you'll want to always first choose the `Solution Structure` scaffold and step through the wizard.  
4. Once the solution scaffold is created, run `yo upendodnn` again to add your other desired DNN projects.  
5. Re-open the solution in Visual Studio, and begin writing code. The project is ready and waiting for you!  

That's it!  Now you can begin building your awesome DNN extension(s) as you see fit.  Everything is now under one easy-to-open, -run, -code, -build, and -commit to source control solution.  

Say hi to Will at [DNN Summit](https://www.dnnsummit.org/) and [DNN-Connect](https://www.dnn-connect.org/). :)  

[Awesome Sponsors Accepted Here](https://github.com/sponsors/UpendoVentures)  

## Upgrading  

In many cases, you may be able to simply re-execute the following command to upgrade upendodnn generator.  

```bash  
npm install -g generator-upendodnn  
```  

However, upgrading your existing projects may or may not be more involved.  If you want to take advantage of the build process updates, you will at least need to update the build files.  

The steps below will help you upgrade the build process in your development environment successfully.  

1. In a new (empty) folder, run `yo upendodnn`.  
2. Choose the `Solution Structure`.  
3. Copy the files from both the `Build` and `References` folders.  
4. Paste the files into their respective matching folders in your project.  Overwrite all.  
5. In any release, if there were any updates to the project file(s) and/or `.build` file(s), you'll want to return to the new "copy/paste" folder you just created.  
6. Use the upendodnn generator to install each respective extension.  
7. Use a compare/diff tool, like [WinMerge](), to compare the files and determine which updates you want to merge into your existing development environment.  

## Video Overview

* [DNN: Building Enterprise & Team Friendly Solutions & Extensions with UpendoDNN](https://www.youtube.com/watch?v=ZD1p5DDlY2E)  

## Additional Features  

Additional features for end-users will continue to be added in [this project's wiki](https://github.com/UpendoVentures/generator-upendodnn/wiki/Additional-Features).

## More Documentation  

Want to learn more or how to build the generator code locally? Please see our wiki for additional documentation.  

[UpendoDNN Generator Wiki](https://github.com/UpendoVentures/generator-upendodnn/wiki)  

## Original Project  

[Original Project Documentation](https://mtrutledge.github.io/generator-dnn/)  

## License  

MIT © 2018 [Matt Rutledge]()  

MIT © 2019-2023 [Upendo Ventures, LLC](https://upendoventures.com/What/CMS/DNN/Extensions)  


[npm-image]: https://badge.fury.io/js/generator-upendodnn.svg  
[npm-url]: https://npmjs.org/package/generator-upendodnn  
[travis-image]: https://travis-ci.org/UpendoVentures/generator-upendodnn.svg?branch=master  
[travis-url]: https://travis-ci.org/UpendoVentures/generator-upendodnn  
