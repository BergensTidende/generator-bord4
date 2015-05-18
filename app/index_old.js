'use strict';
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var rimraf = require('rimraf');
// var GitHubApi = require('github');
var Git = require("nodegit");
var fs = require('fs');
var filendir = require('filendir');
var exec = require('child_process').exec;
var console = require('console');
var _ = require('lodash');

// var githubOptions = {
//     version: '3.0.0'
// };


// var github = new GitHubApi(githubOptions);

var appType = 'mega';
var sourceFolder = ''; // so I don't need to write path.join(destinationFolder, '../../' over and over again
var dailyGraphics = 0; // set to true if this lives in the daily graphics folder
var githubUser = ''; // validate has no access to the this object, so we need to cheat
var serverAppTemplateVersion = '666'; // hack to ensure that we don't need to check the apptemplateversion so many times

// var githubUserInfo = function(name, cb) {
//     github.user.getFrom({
//         user: name
//     }, function(err, res) {
//         if (err) {
//             throw new Error(err.message + '\n\nCannot fetch your github profile. Make sure you\'ve typed it correctly.');
//         }
//         cb(JSON.parse(JSON.stringify(res)));
//     });
// };

// Use to get app template version, and also to test if PW is correct

var appTemplateVersion = function(user, pw, cb) {
    // github.authenticate({
    //     type: 'basic',
    //     username: user,
    //     password: pw
    // });
    // github.repos.getBranch({
    //     user: 'BergensTidende',
    //     repo: 'app-template',
    //     branch: 'mini'
    // }, function(error, res) {
    //     /*jshint camelcase: false */
    //     if (error !== null) {
    //         cb(-1);
    //     } else {
    //         cb(res.commit.sha);
    //     }
    // });
};

var Bord4Generator = yeoman.generators.Base.extend({
    init: function() {
        // Welcome message
        this.log(chalk.bold.yellow('   _   _   ') + chalk.green(' ______   _______  _______  ______      ___   '));
        this.log(chalk.bold.yellow('  ( ) ( )  ') + chalk.green('(  ___ \\ (  ___  )(  ____ )(  __  \\    /   )  '));
        this.log(chalk.bold.yellow(' _| |_| |_ ') + chalk.green('| (   ) )| (   ) || (    )|| (  \\  )  / /) |  '));
        this.log(chalk.bold.yellow('(_   _   _)') + chalk.green('| (__/ / | |   | || (____)|| |   ) | / (_) (_ '));
        this.log(chalk.bold.yellow(' _| (_) |_ ') + chalk.green('|  __ (  | |   | ||     __)| |   | |(____   _)'));
        this.log(chalk.bold.yellow('(_   _   _)') + chalk.green('| (  \\ \\ | |   | || (\\ (   | |   ) |     ) (  '));
        this.log(chalk.bold.yellow('  | | | |  ') + chalk.green('| )___) )| (___) || ) \\ \\__| (__/  )     | |  '));
        this.log(chalk.bold.yellow('  (_) (_)  ') + chalk.green('|/ \\___/ (_______)|/   \\__/(______/      (_)  '));
        this.log(chalk.white('********************************************************'));
        this.log(chalk.white('***** To boldly code what no one has coded before ******'));
        this.log(chalk.white('********************************************************'));

        // // Check if user runs yo from app-root
        // var projectName = this._.last(this.destinationRoot().split(path.sep));
        // if (projectName === 'apps' || projectName === 'workspace') {
        //     this.log();
        //     this.log();
        //     this.log(chalk.red('**** FEIL **** FEIL **** FEIL **** FEIL ****'));
        //     this.log(chalk.red('*'));
        //     this.log(chalk.red('*  YO må kjøres fra katalogen hvor appen skal bo.'));
        //     this.log(chalk.red('*'));
        //     this.log(chalk.red('**** FEIL **** FEIL **** FEIL **** FEIL ****'));
        //     this.log();
        //     this.log();
        //     process.exit(666);
        // }

        // Check if directory is empty, if Gruntfile is present then die.
        if (this.fs.exists(this.destinationPath('Gruntfile.js'))) {
            this.log();
            this.log();
            this.log(chalk.red('**** FEIL **** FEIL **** FEIL **** FEIL ****'));
            this.log(chalk.red('*'));
            this.log(chalk.red('*  Det bor allerede en app i denne katalogen.'));
            this.log(chalk.red('*'));
            this.log(chalk.red('**** FEIL **** FEIL **** FEIL **** FEIL ****'));
            this.log();
            this.log();
            process.exit(666);
        }

        // The man with the hat says hello
        this.log(yosay(chalk.bgGreen.black('#bord4s app generator ') + '' + chalk.cyan('Din venn i Cut and Paste Consulting siden 2014.')));
        this.pkg = require('../package.json');

        this.on('end', function() {
            // FLYTTET DENNE
        });
    },

    /*
        Check for .bord4config in generator.
        If not present, create the json-object used for storing config-data.
     */
    getBord4Config: function() {
        var done = this.async();
        this.writeToBord4Config = false;
        sourceFolder = path.join(this.sourceRoot(), '../../');
        var configPath = path.join(sourceFolder, '.bord4config');
        if (fs.existsSync(configPath)) {
            var file = fs.readFileSync(configPath).toString();
            // Check if file has content
            if (file === '') {
                file = '{}';
            }
            this.bord4Config = JSON.parse(file);
        } else {
            this.bord4Config = {
                githubUser: '',
                appTemplate: ''
            };
            this.writeToBord4Config = true;
        }
        done();
    },

    /*
        Unleash the full potenial of this generator with Github-access.
      */
    askForGithubUserName: function() {
        var done = this.async();
        this.log(chalk.magenta('For at jeg skal kunne hjelpe deg, trenger jeg tilgang til Github'));
        var prompts = [{
            name: 'githubuser',
            message: 'Hva er brukernavnet ditt på Github?',
            default: this.bord4Config.githubUser
        }];
        this.prompt(prompts, function(props) {
            this.githubuser = props.githubuser;
            githubUser = props.githubuser;
            done();
        }.bind(this));
    },

    // askForGithubPassword: function() {
    //     var done = this.async();
    //     var prompts = [{
    //         type: 'password',
    //         name: 'githubpw',
    //         message: 'Hva er passordet ditt på Github?',
    //         validate: function(input) {
    //             var innerDone = this.async();
    //             appTemplateVersion(githubUser, input, function(d) {
    //                 if (d === -1) {
    //                     innerDone('Jeg beklager, men passordet du oppga er feil. Prøv igjen, jeg har troen på deg.');
    //                 } else {
    //                     serverAppTemplateVersion = d;
    //                     innerDone(true);
    //                 }
    //             });
    //         }
    //     }];
    //     this.prompt(prompts, function(props) {
    //         this.githubpw = props.githubpw;
    //         // If no github-user in conig, save this and other user details
    //         if (this.bord4Config.githubUser === '' || this.bord4Config.githubUser === undefined) {
    //             this.writeToBord4Config = true;
    //             this.log(chalk.yellow('Fant ikke github-bruker i config. Henter informasjon om ' + chalk.green(props.githubuser) + chalk.yellow(' fra Github')));
    //             this.bord4Config.githubUser = props.githubuser;
    //             /*jshint camelcase: false */
    //             githubUserInfo(this.githubuser, function(res) {
    //                 this.bord4Config.realName = res.name;
    //                 this.bord4Config.email = res.email;
    //                 this.bord4Config.githubUrl = res.html_url;
    //                 done();
    //             }.bind(this));
    //         } else {
    //             done();
    //         }
    //     }.bind(this));
    // },

    /*
        Check if generator has the latest version of the app-template.
        If not, clone and copy the latest version
     */

    checkAppTemplate: function() {
        this.log(chalk.yellow('\n*\n*\n*  Jeg er nå på Github og leser filene dine. \n*  Sjekker om du har siste versjon av app template\n*\n*'));
        var done = this.async();
        var cloneURL = 'https://github.com/BergensTidende/bord4-daily-template';
        var localPath = require('path').join(__dirname, 'app-template');
        var cloneOptions = {};
        cloneOptions.remoteCallbacks = {
            certificateCheck: function() {
                return 1;
            }
        };
        var cloneRepository = Git.Clone(cloneURL, localPath, cloneOptions);
        var errorAndAttemptOpen = function() {
            return NodeGit.Repository.open(local);
        };
        cloneRepository.catch(errorAndAttemptOpen)
            .then(function(repository) {
                // Access any repository methods here.
                console.log('Is the repository bare? %s', Boolean(repository.isBare()));
            });
        if (serverAppTemplateVersion !== that.bord4Config.appTemplate) {
            //     that.log(chalk.bgYellow.black('*  Jeg beklager, din versjon av app-template er utdatert. La meg laste ned nye filer fra det store internettet til deg.'));
            //     // Clone app-template repo
            //     exec('git clone git@github.com:BergensTidende/app-template.git -b mini --single-branch ' + that.sourceRoot() + '/app-template/', function(err, out, code) {
            //         if (code > 0) {
            //             that.log(chalk.red('Noe gikk galt: ' + err));
            //         } else {
            //             // Delete old app-template
            //             rimraf(path.join(sourceFolder, 'app-template'), function() {
            //                 // Copy files to generators common/templates
            //                 var source = path.join(that.sourceRoot(), '/app-template');
            //                 var destination = path.join(sourceFolder, 'app-template');
            //                 // Get a list of all the files cloned from app-template
            //                 var files = that.expandFiles('**', {
            //                     dot: true,
            //                     cwd: source
            //                 });
            //                 for (var i = 0; i < files.length; i++) {
            //                     var f = files[i];
            //                     // Ignore .git-files
            //                     if (f.indexOf('.git') === -1) {
            //                         var src = path.join(source, f);
            //                         var dest = path.join(destination, f);
            //                         var file = fs.readFileSync(src);
            //                         if (f.indexOf('Gruntfile.js') >= 0 || f.indexOf('/images/') >= 0 || f.indexOf('/fonts/') >= 0 || f.indexOf('/styles/') >= 0 || f.indexOf('.bowerrc_old') >= 0) {
            //                             // Do nothing for now
            //                         } else {
            //                             file = file.toString();
            //                             // Copy files, insert template-tags and other fun stuff?
            //                             file = file.replace(/prosjektnavnApp/g, '<%= scriptAppName %>');
            //                             file = file.replace(/prosjektnavn/g, '<%= appname %>');
            //                         }
            //                         if (filendir.ws(dest, file)) {
            //                             that.log(chalk.green(dest + ' opprettet'));
            //                         }
            //                     } else {
            //                         // Add gitignore
            //                         if (f.indexOf('.gitignore') >= 0) {
            //                             /*jshint shadow: true */
            //                             var src = path.join(source, f);
            //                             var dest = path.join(destination, f);
            //                             var file = fs.readFileSync(src);
            //                             if (filendir.ws(dest, file)) {
            //                                 that.log(chalk.green(dest + ' opprettet'));
            //                             }
            //                         }
            //                     }
            //                 }
            //                 that.log(chalk.green('Filer kopiert, rydder opp.'));
            //                 // Update config
            //                 that.writeToBord4Config = true;
            //                 that.bord4Config.appTemplate = serverAppTemplateVersion;
            //                 // Remove cloned app-template repo
            //                 rimraf(path.join(that.sourceRoot(), '/app-template'), function() {
            //                     that.log.info('Removing dir');
            //                     done();
            //                 });
            //             });
            //         }
            //     });
            done();
        } else {
            done();
        }
    },

    writeToBord4Config: function() {
        var done = this.async();
        /*
            If new information or file didn't exist
        */
        if (this.writeToBord4Config) {
            var configPath = path.join(sourceFolder, '.bord4config');
            fs.writeFile(configPath, JSON.stringify(this.bord4Config, null, 4), function(err) {
                if (err) {
                    console.log(err);
                }
                done();
            });
        } else {
            done();
        }
    },

    checkIfDailyGraphics: function() {
        /*
            Is this an app that lives in the daily graphics repo?
         */
        if (this.destinationRoot().indexOf('daily-graphics') > -1) {
            dailyGraphics = 1;
            this.appType = 'mini';
            appType = 'mini';
            this.log(chalk.magenta('\nJeg ser at vi er i daily graphics folderen. Da velger jeg mini-app for deg.\n'));
        }
    },

    askForAppType: function() {
        var done = this.async();
        /*
            First let user choose mega or mini. If mini, than choose template
         */
        var prompts = [{
            when: function() {
                return appType !== 'mini';
            },
            type: 'list',
            name: 'appchoice',
            message: 'Hvor stor app trenger du for å løse samfunnsoppdraget i dag?',
            choices: [{
                value: 'mega',
                name: 'Jeg trenger det største vi har. Gi meg en mega-app.'
            }, {
                value: 'mini',
                name: 'I dag holder det med en mini-app'
            }],
            default: 'mega'
        }, {
            when: function(response) {
                return (response.appchoice === 'mini' || appType === 'mini');
            },
            type: 'list',
            name: 'templatechoice',
            message: 'Du har valgt å bruke mini-app, hvilken mal ønsker du?',
            choices: [{
                value: 'vanilla',
                name: 'Vanilje'
            }, {
                value: 'map',
                name: 'Kart'
            }, {
                value: 'graphic',
                name: 'Grafikk'
            }],
            default: 'vanilla'
        }];

        this.prompt(prompts, function(props) {
            // `props` is an object passed in containing the response values, named in
            // accordance with the `name` property from your prompt object.
            this.appchoice = props.appchoice;
            appType = props.appchoice;
            this.serverPath = ''; // if not dailygraphics, live on root.
            if (dailyGraphics) {
                var projectArray = this.destinationRoot().split(path.sep);
                this.serverPath = 'daily-graphics/' + projectArray[projectArray.length - 3] + '/' + projectArray[projectArray.length - 2] + '/';
            }
            this.templatechoice = props.templatechoice;
            if (this.appchoice === 'mega') {
                this.templatechoice = 'fullstack_angular';
            }
            done();
        }.bind(this));
    },

    askForName: function() {
        var done = this.async();
        var projectName = this._.last(this.destinationRoot().split(path.sep));
        var prompts = [{
            type: 'input',
            name: 'appname',
            message: 'Hva skal appen hete?',
            default: projectName
        }, {
            when: function() {
                return !dailyGraphics;
            },
            type: 'list',
            name: 'gitchoice',
            message: 'Trenger du versjonskontroll?',
            choices: ['Nei', 'Lokalt', 'Lokalt og globalt']
        }];

        this.prompt(prompts, function(props) {
            // `props` is an object passed in containing the response values, named in
            // accordance with the `name` property from your prompt object.
            this.appname = props.appname;
            this.appname = this._.slugify(this._.humanize(this.appname));
            this.scriptAppName = this._.camelize(this.appname) + 'App';
            this.gitchoice = props.gitchoice;
            if (this.gitchoice === undefined) {
                this.gitchoice = 'Nei';
            }
            done();
        }.bind(this));
    },

    copyApp: function() {
        var done = this.async();
        // Copy files to generators common/templates
        var source = path.join(sourceFolder, '/app-template');
        var destination = this.destinationPath();
        // Get a list of all the files cloned from app-template
        var files = this.expandFiles('**', {
            dot: true,
            cwd: source
        });
        for (var i = 0; i < files.length; i++) {
            var f = files[i];
            // Ignore templates folder
            if (f.indexOf('_templates/') === -1) {
                // Ignore .git-files
                var src = path.join(source, f);
                var dest = path.join(destination, f);
                // Check for files to copy
                if (f.indexOf('Gruntfile.js') >= 0 || f.indexOf('/images/') >= 0 || f.indexOf('/fonts/') >= 0 || f.indexOf('/styles/') >= 0) {
                    this.fs.copy(src, dest);
                } else {
                    this.fs.copyTpl(src, dest, this);
                }
            }
            if (i === files.length - 1) {
                this.fs.commit(function() {
                    done();
                });
            }
        }
        this.log(chalk.yellow('*\n*\n*  La meg kopiere filer fra app template(tm) over til din app.'));
    },

    copyVanilla: function() {
        var done = this.async();
        this.log(chalk.yellow('*  Jeg er ikke helt ferdig, nå tilsetter jeg litt vanilje.'));
        // Copy files to generators common/templates
        var source = path.join(sourceFolder, 'app-template/_templates/vanilla');
        var destination = this.destinationPath('/app/');
        // Get a list of all the files cloned from app-template
        var files = this.expandFiles('**', {
            dot: true,
            cwd: source
        });
        for (var i = 0; i < files.length; i++) {
            var f = files[i];
            // Ignore the bower file
            if (f.indexOf('bower.custom.json') === -1) {
                var src = path.join(source, f);
                var dest = path.join(destination, f);
                if (fs.existsSync(dest)) {
                    fs.unlinkSync(dest);
                }
                // Check for files to copy
                if (f.indexOf('Gruntfile.js') >= 0 || f.indexOf('/images/') >= 0 || f.indexOf('/fonts/') >= 0 || f.indexOf('/styles/') >= 0) {
                    this.fs.copy(src, dest);
                } else {
                    this.fs.copyTpl(src, dest, this);
                }
            }
            if (i === files.length - 1) {
                this.fs.commit(function() {
                    done();
                });
            }
        }
    },

    copyChosenTemplate: function() {
        // Vanilla is allready copied
        if (this.templatechoice !== 'vanilla') {
            var done = this.async();
            this.log(chalk.yellow('*  Dette begynner å ligne noe, men her trengs det også litt ' + this.templatechoice + '\n*'));
            // Copy files to generators common/templates
            var source = path.join(sourceFolder, 'app-template/_templates/', this.templatechoice);
            var destination = this.destinationPath('/app/');
            // Get a list of all the files cloned from app-template
            var files = this.expandFiles('**', {
                dot: true,
                cwd: source
            });
            for (var i = 0; i < files.length; i++) {
                var f = files[i];
                // Ignore the bower file
                if (f.indexOf('bower.custom.json') === -1) {
                    var src = path.join(source, f);
                    var dest = path.join(destination, f);
                    if (fs.existsSync(dest)) {
                        fs.unlinkSync(dest);
                    }
                    // Check for files to copy
                    if (f.indexOf('Gruntfile.js') >= 0 || f.indexOf('/images/') >= 0 || f.indexOf('/fonts/') >= 0 || f.indexOf('/styles/') >= 0) {
                        this.fs.copy(src, dest, {
                            force: true
                        });
                    } else {
                        this.fs.copyTpl(src, dest, this);
                    }
                }
                if (i === files.length - 1) {
                    this.fs.commit(function() {
                        done();
                    });
                }
            }
        }
        this.log(chalk.yellow('*\n*  Kopiering av filer er ferdig.\n*  Appen er nesten ferdig.\n*'));
    },

    composeBower: function() {
        var done = this.async();
        var that = this;
        var bowerContent = {};
        var file = fs.readFileSync(this.destinationPath('/bower.json')).toString();
        // Check if file has content
        if (file === '') {
            file = '{}';
        }
        bowerContent = JSON.parse(file);
        /* SET BOWER VALUES */
        bowerContent.app_name = this.appname;
        bowerContent.app_type = this.templatechoice;
        bowerContent.server_folder = this.serverPath + this.appname;
        if (this.templatechoice !== 'vanilla') {
            // Read custom bower file for template
            file = fs.readFileSync(path.join(sourceFolder, '/app-template/_templates/', this.templatechoice, '/bower.custom.json')).toString();
            // Check if file has content
            if (file === '') {
                file = '{}';
            }
            var customContent = JSON.parse(file);
            _.assign(customContent.dependencies, bowerContent.dependencies);
            _.assign(bowerContent, customContent);
        }
        fs.writeFile(this.destinationPath('/bower.json'), JSON.stringify(bowerContent, null, 4), function(err) {
            if (err) {
                console.log(err);
            }
            that.log(chalk.green('*\n*  Bowerfilen har automagisk blitt ordnet, all systems go.\n*\n*'));
            done();
        });
    },

    gitCommit: function() {
        if (this.gitchoice !== 'Nei' || !dailyGraphics) {
            var done = this.async();
            var async = require('async');
            async.series([
                function(taskDone) {
                    exec('git init', taskDone);
                },
                function(taskDone) {
                    exec('git add . --all', taskDone);
                },
                function(taskDone) {
                    exec('git commit -m "Nytt gloriøst prosjekt opprettet med versjon 2 av den magiske Bord4Generatoren"', taskDone);
                }
            ], function(err) {
                if (err === 127) {
                    this.log('Could not find the ' + chalk.yellow.bold('git') + ' command. Make sure Git is installed on this machine');
                    return;
                }
            });
            this.log(chalk.green('\n*\n*  Git repository satt opp og første commit utført.\n*\n*'));
            done();
        }
    },

    createRepos: function() {
        if (this.gitchoice === 'Lokalt og globalt') {
            var done = this.async();
            var that = this;
            github.authenticate({
                type: 'basic',
                username: that.githubuser,
                password: that.githubpw
            });
            github.repos.createFromOrg({
                org: 'BergensTidende',
                name: that.appname,
                private: true
            }, function(error) {
                if (error !== undefined && error !== null) {
                    console.log(error);
                } else {
                    that.log(chalk.yellow('\n*\n*  Prosjektet har nå fått et hjem på Github.\n*\n*'));
                    done();
                }
            });
        }
    },

    firstCheckIn: function() {
        if (this.gitchoice === 'Lokalt og globalt') {
            exec('git remote add origin git@github.com:BergensTidende/' + this.appname + '.git');
            exec('git push -u origin master');
        }
    },

    allDone: function() {
        var done = this.async();
        var async = require('async');
        var that = this;
        async.series([
            function(taskDone) {
                that.bowerInstall(null, null, function() {
                    taskDone(null, 'one');
                });
            },
            function(taskDone) {
                that.npmInstall(null, null, function() {
                    taskDone(null, 'two');
                });
            },
            function(taskDone) {
                that.spawnCommand('grunt', ['copy:cssAsScss']);
                taskDone(null, 'three');
            },
            function(taskDone) {
                that.spawnCommand('grunt', ['serve']);
                taskDone(null, 'four');
            },
            function(taskDone) {
                that.log(yosay(chalk.magenta('Stillaset er ferdig!') + chalk.red('\nCode, Commit, Push, Document, Ship ')));
                taskDone(null, 'five');
            }
        ], function(err) {
            if (err === 127) {
                that.log('Could not find the ' + chalk.yellow.bold('git') + ' command. Make sure Git is installed on this machine');
                return;
            }
        });
        done();
    }
});

module.exports = Bord4Generator;
