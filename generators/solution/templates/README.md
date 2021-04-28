**A Special Note to ALL Developers...**  
Please do not begin any development until you first read through and understand all of the notes in the README below.  

## Background  
The previous version was not adhering to known best practices and as a result, it was unclear of how to find and maintain it. This version has been cleaned up and restructured with best practice architecture, build, versioning, and deployment in mind.  

## Solution  
The solution currently expects to be in the following environment, but you can update that to be any version you'd like, provided all extensions will be compatible:  

- DNN:  09.04.04  
- Hotcakes Commerce:  03.02.03  
- SQL:  2014+  

You should build and develop in a development environment that's separate from the local environment where you'd be testing.  The examples below help to illustrate this...  

- Development Path:  `C:\Work\ProjectName\source-code\`  
- Staging/Testing Path:  `C:\Work\ProjectName\website\`  

The *Development Path* is where the source code (solution) should be contained.  The *Staging/Testing Path* is where the testing website instance should be restored to and ran from via IIS.  

While you can technically do everything from a single path, this model helps to reduce environmental synchronization, duplication, and testing issues. It also often reduces ramp up time between testing scenarios where installations, upgrades, back-ups, and restorations are necessary.  

Either way, is up to you.  

## Getting Started  

You should get a backup of the website and database from production, then overwrite those files using this repo.  (Optional) It may be a good idea to run a data cleansing script against the database to clear out any sensitive data and/or PII.  

## Builds  

There are two possible paths for development, building and testing related to the suggested approach for this solution.  

1. Restore the website to the *Development Path*. When you build, test the updates from that path.  
2. Restore the website to the *Staging/Testing Path*. When you build, you'll need to install the extensions into this website.  

__Please Note__: It's possible to follow both approaches. This allows the website in your *Staging/Testing Path* to remain as clean as possible and be a true test before deploying to a true staging environment and/or in production.  

### Debug Mode  

When you build the solution or any single project in **DEBUG** mode, the following occurs:  

- All source code is built in debug mode.  
- Any relevant DLL's are generated and placed into the `/website/Bin/` folder.  
- Any relevant files needed to see/use the extensions are placed into their respective locations (e.g., DesktopModules, Portals, Skins, Containers, etc.).  

### Release Mode  

When you build the solution or any single project in **RELEASE** mode, the following occurs:  

- All source code is built in debug mode.  
- All extensions are packaged into installable DNN extension packages.  
- Extensions will be found in their respective folders in the `/website/Install` folder:  
  - `Hotcakes-Integration`:  Contains Hotcakes Commerce viewsets. (_This is an non-standard folder that DNN is unaware of._)  
  - `Library`: Contains class libraries (DLL's).  
  - `Module`:  Contains custom modules and skin objects.  
  - `Skin`:  Contains theme packages.  

When there are DLL's involved, there are two packages created, Install and Symbols. The respective work will be seen at the end of the respective file name.  

- Install: Used to install or upgrade an extension.  
- Symbols: Used to install the PDB files for the DLL's in the installation package. Used for troubleshooting only. Always remember to uninstall the symbols when you're done troubleshooting.  

**Special Developer Note**  
_If you don't remember to uninstall the symbols package, it could result in upgrade and/or troubleshooting issues in the future._  

## Development Environment  

Steps 1 through 8 are considered to be more for set-up, while the remaining steps are for ongoing development.  

1. Fork/install source code (see suggested paths above).  
2. Create a database and restore a backup from production. Add a user to the database that has `db_owner` permissions.  
3. Update the `PortalAlias` table to add your new website domain name and make sure it's marked as the "Primary" domain name for the respective `PortalID`.  
4. Restore a copy of the website backup to the `/website` folder (create the `/website` folder in the root, if necessary)  
5. Update the web.config to have the updated database connection string.  
6. Update the Hosts file to have the new domain name (if necessary).  
7. Update IIS to point to the desired `/website` folder(s).  
8. View the website in your preferred web browser.  
9. Open the solution.  
10. Ensure that the solution can build in both DEBUG and RELEASE modes.  
11. Update the code and build as necessary (see build notes above).  
12. Build in Debug mode will push the code updates into the `Website\DesktopModules` folder (for modules, and other areas for other extensions, such as `\Bin` for Libraries)  
13. Build in Release mode will create the release packages in the `Install\ExtensionType` folder (e.g., Skins, Modules, Libraries, etc.)  

### Solution Folder Architecture  

Here is an explanation of each of the top-level folders found in the solution. These folders are 
also reflected the same way when viewed in Visual Studio, when necessary.  

- Assets: Contains any dependencies or backup files that may be necessary (except website/database backups).  
- Build: Contains supporting files that enable the build processes mentioned above. These files should usually not be changed.  
- Libraries: Contains class librarys that either deploy on their own, and/or are deployed within another packaged extension.  
- Modules: Contains modules.  
- References: Contains references that may be used by one or many of the projects in the solution.  
- Skin-Objects: Contains skin objects that the theme might need to use.  
- Skins: Contains theme packages (skins and containers).  
- Viewsets: Contains Hotcakes Commerce viewset packages.  
- Website: This is discussed earlier in this document.  

There is a `packages` that may be created as a result of building the solution or a project. This is created by Nuget and is not part of this solution architecture.  

### First Time Builds & Deployments  
When an extension is new to the solution, there may be an extra bit of setup required.  

1. Build the extension in DEBUG mode so the deployment files are put into their respective places.  
2. View the website and login as a superuser.  
3. Manually install the extension in the Extensions view by using it's manifest file.  
4. If there are any database dependencies, manually run the SqlDataProvider file(s) to make the necessary schema updates to the database.  
5. Add the extension to a page or otherwise use it as it's intended.  

Alternatively, you can build the solution in RELEASE mode and install that package into the 
website. Then build the solution/project again in DEBUG mode.  

### Debugging  
In order to debug the code, you'll need to follow the steps below:  

1. Open Visual Studio using the "As Administrator" option in Windows.  
2. Build the project(s) solution in DEBUG mode.  
3. Ensure that the web.config is set to allow debugging:  `<compilation debug="true" strict="false" optimizeCompilations="true">`  
4. Run the website and view the page that contains the code you wish to debug.  
5. In Visual Studio, choose the Debug > Attach to Process feature (a.k.a., `<Ctrl>`+`<Alt>`+`<P>`).  
6. Find `w3wp.exe` in the list and click the Attach button.  
7. Set any breakpoints that you wish to hit and step through.  
8. View the page again and/or perform the steps necessary to hit the breakpoint.    

### Adding/Updating References  
Any references that can't or shouldn't be managed by Nuget are managed by the `SolutionReferences.targets` file in the `Build` folder.  This central file allows you to update the references in a single place, for all projects.  

If you're adding/editing references that come from DNN (or from the References folder), DO NOT use the Visual Studio IDE to do this. It will result in long-term management issues for the solution. Instead, you should view any of the `.csproj` files in a separate text editor to see how to properly add a reference.  It's not possible to add it correctly in the Visual Studio IDE.  

#### General Instructions  
When necessary, first add the new references to the correct references folder/path, and then update the `SolutionReferences.targets` file.  

Include the following line in the `.csproj` file, just before the references section (if necessary).  

```xml
<Import Project="..\..\Build\SolutionReferences.targets" Condition="false" />
```  

__Please Note__: It's currently required for you to manually update the version numbers in the `.csproj` file when working with any `Library` type project as well.  Please see [Issue #17](https://github.com/UpendoVentures/generator-upendodnn/issues/17) for more details and to potentially help fix this.  :)  

Next, add the appropriate reference, per the targets file.  Here are examples for DNN, and Hotcakes Commerce.  

```xml
  <ItemGroup>
    <Reference Include="DotNetNuke">
      <SpecificVersion>False</SpecificVersion>
      <HintPath>$(DnnReferencePath)\DotNetNuke.dll</HintPath>
      <Private>False</Private>
    </Reference>
    <Reference Include="Hotcakes.Commerce">
      <SpecificVersion>False</SpecificVersion>
      <HintPath>$(HccReferencePath)\Hotcakes.Commerce.dll</HintPath>
      <Private>False</Private>
    </Reference>
  </ItemGroup>
```  

Note the use of `SpecificVersion` and `Private` above.  These are very important to ensuring consistent builds and packages.  

If you reference a DLL in the references folder directly, simply edit the `.csproj` file afterward to follow the pattern outlined above.  

# Source Control  
It may be noticed that this solution and it's architecture are both complicated and elegant at the same time. A beginning developer may feel overwhelmed at first, but this solution greatly simplifies all development. This is especially important and true due to how tightly integrated and dependant all of the projects and code is.  

## Solution  
As such, this solution would function best when used with a Git-based source control product, such as Git, GitHub, and BitBucket.  There are many workflows that could be used for this solution as it relates to the interaction with Git.  For developers that are new to Git and its potential workflows, a workflow known as "centralized workflow" may be tempting, because it is how solo developers and SVN/TFS has been used in the past. When using Git, this is generally a mistake since it ignores all of the features Git offers.  

## Workflow  
It is highly recommended that a [Gitflow Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) workflow is used and followed. This empowers all developers that may be involved to work at the same time, independently, regardless of location, focus, and feature/issue they're working on.  Initially, some developers will feel this simply over-complicates the development process, but the moment something "bad" happens during a development cycle, this process will very clearly highlight itself as having saved the day.  This approach also ensures that one or more PM's are able to see and know the state of the code base, pending updates, and more because they're at all times seeing branches in a logical pattern and reviewing pull requests to the primary/release branches.  

## Branches  
The primary branches that are present and used may change over time.  Those potential branches are defined below.  There are no strict requirements, except as defined as the project/product manager assigned to this solution.  Naming conventions such as those listed below are very important to ensure the productivity of all parties involved during development, so that everyone can easily understand the purpose of various branches and their contained code/updates.  

- **main** - A _main_ (formerly known as `Master`) branch should always be present and used, regardless of the way Git is leveraged. This branch is always expected to **only** contain tested and unbroken code at all times. At no time should code be committed to this branch without first being verified to be tested and unbroken.  Pull requests into this branch would often only come from the _development_ branch.  
- **development** - A _development_ branch is not currently being used and it is not necessarily required moving forward, depending on how development will be done in the future. It is best used when development is expected to follow a more strict schedule or versioning pattern.  If continuous integration (CI) or similar solutions are to be integrated, this branch will also become necessary. This branch is where other branches are merged to first, before being determined to be production-ready. Once the code is merged to the _development_ branch, a QA engineer would smoke and regression test the code in this branch. Once all updates are verified to be correct and not break other existing features, the code in this branch would then be merged into the _master_ branch as part of a release process/cycle.  This code would also be what is used to push into a staging/UAT environment.  Pull requests generally would always come to this branch, and not to the master branch.  
- **Issues\name-number** - This is a common branching naming convention when working on bugs.  The name/number would reference a work item/task ID or a very short name to identify the update. Examples of this naming convention would include `Issues\Issue-12345` and `Issues\email-template-routing`.
- **Features\name-number** - This is a common branching naming convention when adding new features.  The name/number would reference a work item/task ID or a very short name to identify the update. Examples of this naming convention would include `Features\Issue-12345` and `Features\salesforce-integration`.
- **Tasks\name-number** - This is a common branching naming convention when working on tasks that aren't necessarily a new feature or bug fix.  The name/number would reference a work item/task ID or a very short name to identify the update. Examples of this naming convention would include `Tasks\Issue-12345` and `Tasks\03.02.01-packaging`.  
- **Releases\version** - This naming convention and its branches are only necessary when following a release schedule that's highly focused on a product management approach that includes versioning. Ideally, in this scenario, all projects would always have the same version.  This workflow would be ideal for a solution like this, but it also depends on the level of and availability of resources assigned to the project. Having such a approach also helps to identify and troubleshoot differences over time.  An example of a branch using this approach would be `Releases\03.02.01`.  The code that is included in this branch would come only from the _master_ branch, and this branch would be created directly prior to pushing the updates into production from a staging/UAT environment.  

# Support for this Project  
This solution and the related materials are proudly created and provided by Upendo Ventures.  

- [Visit Us](https://upendoventures.com/Support)  
- [E-Mail Us](mailto:solutions@upendoventures.com)  
- [Other Ways to Contact Us](https://upendoventures.com/Contact-Us)  
