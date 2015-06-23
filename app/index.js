'use strict';
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var nodegit = require('nodegit');
var fs = require('fs');
var filendir = require('filendir');
var console = require('console');
var _ = require('lodash');

/* Variables */
var generatorSettings = ['githubUser', 'appTemplateRepo', 'dailyTemplateRepo', 'dailyStorageRepo', 'folderAppTemplate', 'folderDailyTemplate', 'folderDailyGraphics', 'repository'];

var allSystemsNoes = function(logmessage) {
    console.log();
    console.log();
    console.log(chalk.red('**** FEIL **** FEIL **** FEIL **** FEIL **** FEIL **** FEIL ****'));
    console.log(chalk.red('*'));
    console.log(chalk.red('*  ' + logmessage));
    console.log(chalk.red('*'));
    console.log(chalk.red('**** FEIL **** FEIL **** FEIL **** FEIL **** FEIL **** FEIL ****'));
    console.log();
    console.log();
    process.exit();
};

var Bord4Generator = yeoman.generators.Base.extend({
    initializing: function() {
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

        // The man with the hat says hello
        this.log(yosay(chalk.magenta('Velkommen til #bord4s app generator. La meg sjekke om jeg har det jeg trenger.')));
        this.pkg = require('../package.json');

        var done = this.async();
        var allSystemsGo = true;
        if (this.fs.exists(this.destinationPath('Gruntfile.js'))) {
            allSystemsGo = false;
            allSystemsNoes('Du er inne i mappen til eksisterende app. Vennligst prøv på nytt fra rotkatalogen til generator-prosjektene dine.');
        }
        _.forEach(generatorSettings, function(val) {
            if (this.config.get(val) === undefined) {
                allSystemsGo = false;
                this.log(chalk.red('✗ Finner ikke variabelen ' + val));
            }
        }.bind(this));

        if (!allSystemsGo) {
            allSystemsNoes('Alle variabelene er ikke satt. Kjør yo bord4:setup');
        }

        this.log(chalk.green('✓ Nødvendige variabler er satt'));

        try {
            fs.statSync(this.destinationPath(this.config.get('folderAppTemplate')));
        } catch (error) {
            allSystemsGo = false;
            this.log(chalk.red('✗ Finner ikke katalogen for folderAppTemplate. Skulle vært her: ' + this.config.get('folderAppTemplate')));
        }
        try {
            fs.statSync(this.destinationPath(this.config.get('folderDailyTemplate')));
        } catch (error) {
            allSystemsGo = false;
            this.log(chalk.red('✗ Finner ikke katalogen for folderDailyTemplate. Skulle vært her: ' + this.config.get('folderDailyTemplate')));
        }
        try {
            fs.statSync(this.destinationPath(this.config.get('folderDailyGraphics')));
        } catch (error) {
            allSystemsGo = false;
            this.log(chalk.red('✗ Finner ikke katalogen for folderDailyGraphics. Skulle vært her: ' + this.config.get('folderDailyGraphics')));
        }

        if (!allSystemsGo) {
            allSystemsNoes('Finner ikke katalogene som behøves. Kjør yo bord4:setup');
        }

        this.log(chalk.green('✓ Nødvendige kataloger eksisterer.'));

        var repository;
        // Sync our repositories
        nodegit.Repository.open(this.config.get('folderAppTemplate'))
            .then(function(repo) {
                repository = repo;
                return repository.fetchAll({
                    certificateCheck: function() {
                        return 1;
                    }
                });
            })
            // Now that we're finished fetching, go ahead and merge our local branch
            // with the new one
            .then(function() {
                return repository.mergeBranches('master', 'origin/master');
            })
            .done(function() {
                this.log(chalk.green('✓ Oppdatert ' + this.config.get('folderAppTemplate')));
                nodegit.Repository.open(this.config.get('folderDailyTemplate'))
                    .then(function(repo) {
                        repository = repo;
                        return repository.fetchAll({
                            certificateCheck: function() {
                                return 1;
                            }
                        });
                    })
                    // Now that we're finished fetching, go ahead and merge our local branch
                    // with the new one
                    .then(function() {
                        return repository.mergeBranches('master', 'origin/master');
                    })
                    .done(function() {
                        this.log(chalk.green('✓ Oppdatert ' + this.config.get('folderDailyTemplate')));
                        done();
                        /*nodegit.Repository.open(this.config.get('folderDailyGraphics'))
                            .then(function(repo) {
                                repository = repo;
                                return repository.fetchAll({
                                    certificateCheck: function() {
                                        return 1;
                                    },
                                    credentials: function(url, userName) {
                                        console.log(userName)
                                        return nodegit.Cred.sshKeyFromAgent(userName);
                                    }
                                });
                            })
                            // Now that we're finished fetching, go ahead and merge our local branch
                            // with the new one
                            .then(function() {
                                return repository.mergeBranches('master', 'origin/master');
                            })
                            .done(function() {
                                this.log(chalk.green('✓ Oppdatert ' + this.config.get('folderDailyGraphics')));
                                this.log();
                                this.log(yosay(chalk.yellow('Jeg har det jeg trenger, la oss bygge en app sammen. ☂ ')));
                                this.log();
                                done();
                            }.bind(this));
*/
                    }.bind(this));
            }.bind(this));
    },

    prompting: {
        appType: function() {
            var done = this.async();
            var prompts = [{
                type: 'list',
                name: 'appType',
                message: 'Hvor stor app trener du?',
                choices: [{
                    value: 'standalone',
                    name: 'Fullt rigg'
                }, {
                    value: 'daily',
                    name: 'Daily graphic'
                }],
                default: 'standalone'
            }, {
                when: function(response) {
                    return (response.appType === 'daily');
                },
                type: 'list',
                name: 'templateType',
                message: 'Hvilken mal ønsker du for din daily graphic?',
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
                this.appType = props.appType;
                this.templateType = props.templateType;
                if (this.appType === 'standalone') {
                    this.templateType = 'fullstack_angular';
                }
                done();
            }.bind(this));
        },
        askForAppName: function() {
            var done = this.async();
            var prompts = [{
                name: 'appName',
                message: 'Hva skal appen hete?'
            }];

            this.prompt(prompts, function(props) {
                var nameTaken = true;
                this.appName = props.appName;
                var appFolder;
                var serverFolder;
                if (this.appType === 'standalone') {
                    // Check if folder exists on machine TODO: check Github for repo with appname
                    appFolder = path.join(this.destinationRoot(), '/' + this.appName);
                    serverFolder = this.appName;
                } else {
                    // Check in dailygraphics if name is taken
                    var d = new Date();
                    var y = d.getFullYear();
                    var m = d.getMonth() + 1;
                    if (m < 10) {
                        m = '0' + m;
                    }
                    appFolder = path.join(this.destinationRoot(), this.config.get('folderDailyGraphics'), '/projects/' + y + '/' + m + '/', this.appName);
                    serverFolder = 'daily-graphics/' + y + '/' + m + '/' + this.appName;
                }
                try {
                    fs.statSync(appFolder);
                } catch (error) {
                    nameTaken = false;
                }
                if (nameTaken) {
                    this.log(chalk.red('✗ Navnet er dessverre allerde tatt, du må finne på et nytt navn.'));
                    return this.prompting.askForAppName.call(this);
                }
                this.appFolder = appFolder;
                this.serverFolder = serverFolder;
                done();
            }.bind(this));
        }
    },
    writing: function() {
        var done = this.async();
        // Create folder for project
        this.log(chalk.yellow('☂ Oppretter mappen ' + this.appFolder));
        filendir.mkdirp(this.appFolder);
        if (this.appType === 'standalone') {
            this.sourceRoot(path.join(this.destinationRoot(), this.config.get('folderAppTemplate')));
        } else {
            this.sourceRoot(path.join(this.destinationRoot(), this.config.get('folderDailyTemplate')));
        }
        this.destinationRoot(this.appFolder);
        // Get a list of all the files cloned from app-template
        var files = this.expandFiles('**', {
            dot: true,
            cwd: this.sourceRoot()
        });
        for (var i = 0; i < files.length; i++) {
            var f = files[i];
            // Ignore .git-files except .gitignore
            if (f.indexOf('.git') === -1 || f.indexOf('.gitignore') >= 0) {
                var src = this.templatePath(f);
                var dest = this.destinationPath(f);
                var file = fs.readFileSync(src);
                if (filendir.ws(dest, file)) {
                    this.log(chalk.green('✓ ' + dest + ' opprettet'));
                }
            }
        }
        this.log(yosay(chalk.yellow('☂ De rette filene er på de rette stedene. Jeg er klar til å gjøre magi.')));
        done();
    },
    install: {
        changeDir: function() {
            process.chdir(this.destinationRoot());
        },
        runDaily: function() {
            // change directory for process to projcet folder
            var done = this.async();
            if (this.appType === 'daily') {
                this.spawnCommand('npm', ['install'])
                    .on('close', function() {
                        this.log(chalk.green('✓ Kjørt npmInstall'));
                        this.spawnCommand('grunt', ['workon:' + this.templateType])
                            .on('close', function() {
                                this.log(chalk.green('✓ Kjørt grunt workon:' + this.templateType));
                                this.spawnCommand('bower', ['install'])
                                    .on('close', function() {
                                        this.log(chalk.green('✓ Kjørt bower install'));
                                        fs.rmdir(this.destinationPath('_templates'), function() {
                                            this.log(chalk.green('✓ Slettet _templates'));
                                            done();
                                        }.bind(this));
                                    }.bind(this));
                            }.bind(this));
                    }.bind(this));
            } else {
                done();
            }
        },
        runFullApp: function() {
            var done = this.async();
            if (this.appType === 'standalone') {
                this.installDependencies({}, function() {
                    this.spawnCommand('grunt', ['serve']);
                }.bind(this));
            }
            done();
        },
        writeProjectJson: function() {
            var done = this.async();
            // Object to store project.json settings
            var projectJson = {
                name: this.appName,
                server_folder: this.serverFolder,
                app_type: this.templateType
            };
            fs.writeFile(this.destinationPath('project.json'), JSON.stringify(projectJson, null, 4), function(err) {
                if (err) {
                    this.log(chalk.red('✗ ' + err));
                } else {
                    this.log(chalk.green('✓ Opprettet project.json'));
                }
                done();
            }.bind(this));
        }
    },
    end: function() {
        this.log(yosay(chalk.green('Jeg er ferdig. Lykke til med kodingen!')));
        this.spawnCommand('grunt', ['serve']);
    }
});

module.exports = Bord4Generator;
