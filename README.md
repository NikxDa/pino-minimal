# pino-minimal
> A beautiful and minimal transport for pino

<div align="center">
    <img alt="Header" src="images/pino-minimal.png" width="85%">
</div>

<p align="center">
    <a href="https://travis-ci.org/NikxDa/pino-minimal">
        <img alt="Travis Build Status" src="https://travis-ci.org/NikxDa/pino-minimal.svg?branch=master">
    </a>
    <a href="https://www.npmjs.com/package/pino-minimal">
        <img alt="NPM version" src="https://img.shields.io/npm/v/pino-minimal">
    </a>
</p>

## Description

The `pino-minimal` transport provides a prettified, minimalistic and beautiful output for [Pino.js](https://github.com/pinojs/pino). It's output format is strongly inspired by [Signale](https://github.com/klaussinani/signale).

## Contents

- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)
- [Command Line Arguments](#command-line-arguments)
- [License](#license)

## Installation

### NPM

```bash
$ npm install -g pino-minimal
```

### Yarn

```bash
$ yarn global add pino-minimal
```

## Usage

To use it, simply pipe the output from Pino into this transport. Example:

```bash
$ node server.js | pino-minimal
```

## Command Line Arguments

This package supports several command line arguments to customize the output. A flag that is true by default can be negated by using it with a `no` prefix, e.g. to hide the time, use the option `--no-time`.

| Option/s | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `--help`, `-h` | `boolean` | - | Show a help document. |
| `--version`, `-v` | `boolean` | - | Show version information. |
| `--date`, `-d` | `boolean` | `false` | Show a date in the log output. |
| `--time`, `-t` | `boolean` | `true` | Show a time in the log output. Use `--no-time` to disable. |
| `--pid`, `-p` | `boolean` | `false` | Show the process ID (PID) in the log output. |
| `--hostname`, `-h` | `boolean` | `false` | Show the hostname in the log output. |
| `--stacktrace`, `-s` | `boolean` | `true` | Show a stack trace for errors that occur. Use `--no-stacktrace` to disable. |
| `--colorize`, `-c` | `boolean` | Depends on terminal | Colorize the console output. Use `--no-colorize` to disable. |
| `--messageKey` | `string` | `msg` | The JSON key to read the message from. |
| `--timestampKey` | `string` | `time` | The JSON key to read the timestamp from. |
| `--crlf`, `-f` | `boolean` | `false` | Use CRLF line endings instead of LF line endings. |

## License

MIT