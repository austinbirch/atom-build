# Atom Build package [![Build Status](https://travis-ci.org/noseglid/atom-build.svg?branch=master)](https://travis-ci.org/noseglid/atom-build) [![Gitter chat](https://badges.gitter.im/noseglid/atom-build.svg)](https://gitter.im/noseglid/atom-build)

Automatically build your project inside your new favorite editor, Atom.

  * `cmd-alt-b` / `ctrl-alt-b` builds your project.
  * `cmd-alt-g` / `ctrl-alt-g` jumps to cause of build error. See [Error Matching](#error-match).
  * `escape` terminates build

![work work](https://noseglid.github.io/atom-build.gif)

Supported build tools:

  1. Custom by [specifying your own build command](#custom-build-command)
  1. [NodeJS](http://nodejs.org) (runs `npm install`) - if `package.json` exists where `engines['node']` is set
  1. [Atom](http://atom.io) (runs `apm install`) - if `package.json` exists where `engines['atom']` is set
  1. [Grunt](http://gruntjs.com/) - if `Gruntfile.js` exists
  1. [Gulp](http://gulpjs.com/) - if `gulpfile.js` exists
  1. [Elixir](http://elixir-lang.org/) - if `mix.exs` exists
  1. [GNU Make](https://www.gnu.org/software/make/) - if `Makefile` exists

If multiple viable build options are found, `atom-build` will
prioritise according to the list above. For instance, if `package.json` and
`Gruntfile.js` are both available in the root folder, `npm install` will be
executed by `atom-build`.

If you need to run `grunt` to build you project,
utilize the [postinstall-script](https://www.npmjs.org/doc/misc/npm-scripts.html) of
package.json. This will also help you if grunt is run as a node module since it
will be downloaded (via `npm install`) prior.

<a name="custom-build-command"></a>
## Specifying your own build command

If the built-in defaults are not enough to suit your needs, you can specify
exactly what to execute. Create a file named `.atom-build.json` in your project root:

    {
      "cmd": "<command to execute>",
      "args": [ "<argument1>", "<argument2>", ... ],
      "sh": true,
      "cwd": "<current working directory for `cmd`>",
      "env": {
        "VARIABLE1": "VALUE1",
        "VARIABLE2": "VALUE2",
        ...
      },
      "errorMatch": "^regexp$"
    }

Note that if `sh` is false `cmd` must only be the executable - no arguments here. If the
executable is not in your path, either fully qualify it or specify the path
in you environment (e.g. by setting the `PATH` var appropriately on UNIX-like
systems).

<a name="custom-build-config"></a>
### Configuration options

  * `cmd`: The executable command
  * `args`: An array of arguments for the command
  * `sh`: If `true`, the combined command and arguments will be passed to `/bin/sh`. Default `true`.
  * `cwd`: The working directory for the command. E.g. what `.` resolves to.
  * `env`: An array of environment variables and their values to set
  * `errorMatch`: A regular expression to match output to a file, row and col. See [Error matching](#error-match) for details.

### Replacements

The following parameters will be replaced in `cmd`, any entry in `args`, `cwd` and
values of `env`. They should all be enclosed in curly brackets `{}`

  * `{FILE_ACTIVE}` - Full path to the currently active file in Atom. E.g. `/home/noseglid/github/atom-build/lib/build.coffee`
  * `{FILE_ACTIVE_PATH}` - Full path to the folder where the currently active file is. E.g. `/home/noseglid/github/atom-build/lib`
  * `{FILE_ACTIVE_NAME}` - Full name and extension of active file. E.g., `build.coffee`
  * `{FILE_ACTIVE_NAME_BASE}` - Name of active file WITHOUT extension. E.g., `build`
  * `{PROJECT_PATH}` - Full path to the root of the project. This is normally the path Atom has as root. E.g `/home/noseglid/github/atom-build`
  * `{REPO_BRANCH_SHORT}` - Short name of the current active branch (if project is backed by git). E.g `master` or `v0.9.1`.

<a name="error-match"></a>
## Error matching

Error matching let's you specify a regular expression which captures
the output of your build command and opens the correct file, row and column of
the error. For instance:

```bash
a.c:4:26: error: expected ';' after expression
  printf("hello world\n")
                         ^
                         ;
1 error generated.
```

Would be matched with the regular expression: `^(?<file>[^\\.]+.c):(?<line>\\d+):(?<col>\\d+)`.
After the build has failed, pressing `cmd-alt-g` (OS X) or `ctrl-alt-g` (Linux/Windows), `a.c` would be
opened and the cursor would be placed at row 4, column 26.

Note the syntax for match groups. This is from the [XRegExp](http://xregexp.com/) package
and has the syntax for named groups: `(?<name> RE )` where `name` would be the name of the group
matched by the regular expression `RE`.

The following named groups can be matched from the output:
  * `file` - the file to open. `(?<file> RE)`. **Required if errorMatch is specified**.
  * `line` - the line the error resides on. `(?<line> RE)` **Optional**.
  * `col` - the column the error resides on. `(?<col> RE)` **Optional**.

Since the regular expression is written in a JSON file, backslashes must be escaped.
