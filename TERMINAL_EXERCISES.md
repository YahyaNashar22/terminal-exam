# Terminal Examination Exercises

This sheet is intended for use outside the app. The student should work in their own WSL terminal on a Linux environment.

## Rules

- Use only the terminal.
- Prefer shell commands over GUI tools.
- For editor tasks, use `vim` or `nano` directly in the terminal.
- Unless the task explicitly says otherwise, the student may choose any valid command sequence.
- The examiner should verify both the final result and the command history or process used where relevant.

## Suggested Setup

Ask the student to start from a clean workspace such as:

```bash
mkdir -p ~/terminal-exam
cd ~/terminal-exam
```

## Exercise 1: Basic Navigation

Create this directory structure:

```text
~/terminal-exam/
  app/
  logs/
  backups/
```

Requirements:

- Create all directories from the terminal.
- Move into `app`.
- Print the absolute current path.

What to check:

- Correct directory structure.
- Student understands `mkdir`, `cd`, and `pwd`.

## Exercise 2: File Creation and Redirection

Inside `app`, create a file named `notes.txt` and write these exact lines:

```text
deploy checklist
restart service
verify logs
```

Requirements:

- Use terminal commands only.
- The file content must match exactly.

What to check:

- Redirection usage.
- Difference between overwrite and append.

## Exercise 3: Edit a File with `vim` or `nano`

Using `vim` or `nano`, create `main.js` inside `app` with this content:

```js
function main() {
  console.log("server is running");
}

main();
```

Requirements:

- Student must open a terminal editor.
- Student must save and exit correctly.

What to check:

- Can open editor from terminal.
- Can insert/edit text.
- Can save and quit cleanly.

## Exercise 4: Modify Existing Code in the Terminal

Edit `main.js` so it becomes:

```js
function main() {
  const env = "production";
  console.log(`server is running in ${env}`);
}

main();
```

Requirements:

- Use `vim` or `nano`.
- Keep valid JavaScript formatting.

What to check:

- Basic code editing fluency.
- Ability to change only required parts.

## Exercise 5: Search with `grep`

Inside `app`, create a file named `app.log` with the following lines:

```text
INFO server started
INFO connection opened
WARN memory usage high
ERROR database timeout
INFO retry scheduled
ERROR retry failed
```

Tasks:

- Show only lines containing `ERROR`.
- Show line numbers for matching lines.
- Count how many lines contain `INFO`.

What to check:

- `grep`
- `grep -n`
- `grep -c`

## Exercise 6: Recursive Search

Create the following files:

```text
app/config.env
app/src/server.js
app/src/db.js
```

Add the string `DB_HOST=localhost` to `config.env`.
Add the string `database timeout` somewhere in `db.js`.

Tasks:

- Search recursively from `app` for the word `database`.
- Search recursively for `DB_HOST`.

What to check:

- `grep -r`
- Student understands recursive search.

## Exercise 7: Permissions

Create a script `deploy.sh` with:

```bash
#!/usr/bin/env bash
echo "deploying application"
```

Tasks:

- Make the script executable.
- Run it.
- Show the file permissions.

What to check:

- `chmod`
- `ls -l`
- Executing scripts

## Exercise 8: Archives and Backups

Create a compressed backup of the `app` directory named `app-backup.tar.gz`.

Tasks:

- Create the archive.
- List its contents without extracting it.
- Extract it into `backups/restore-test`.

What to check:

- `tar -czf`
- `tar -tzf`
- `tar -xzf`

## Exercise 9: File Discovery

Inside `app`, create:

```text
src/index.js
src/routes/api.js
src/routes/admin.js
tmp/cache.txt
```

Tasks:

- Find all `.js` files.
- Find files whose name contains `admin`.
- Find all files under `app` modified today.

What to check:

- `find`
- Common `find` predicates such as `-name`, `-type`, `-mtime`

## Exercise 10: Processes

Start a long-running process in the terminal, for example:

```bash
sleep 300
```

Tasks:

- Find the process.
- Stop it safely.
- Confirm it is no longer running.

What to check:

- `ps`
- `grep`
- `kill`

## Exercise 11: Piping and Filtering

Using the existing `app.log`, do the following:

- Show only lines containing `INFO`, then number them.
- Count how many log lines contain either `WARN` or `ERROR`.
- Sort the log file alphabetically into `sorted.log`.

What to check:

- Pipes
- `grep`
- `wc -l`
- `sort`
- Redirection

## Exercise 12: Environment Variables

Create a file named `.env` with:

```text
APP_NAME=terminal_exam
APP_ENV=staging
APP_PORT=3000
```

Tasks:

- Print only the `APP_ENV` line using `grep`.
- Export an environment variable named `NODE_ENV` with value `production`.
- Confirm it is set in the current shell.

What to check:

- `export`
- `echo $NODE_ENV`
- `grep`

## Exercise 13: Networking Basics

Tasks:

- Show the machine IP addresses.
- Test connectivity to a host such as `google.com`.
- Show open listening ports on the machine.

What to check:

- `ip a` or `hostname -I`
- `ping`
- `ss -tulpn` or `netstat -tulpn`

## Exercise 14: Service and Logs Scenario

Create a file `service.log` with at least 15 lines mixing `INFO`, `WARN`, and `ERROR`.

Tasks:

- Show the last 5 lines.
- Follow the file live in one terminal.
- In another terminal, append a new line and verify it appears.
- Extract only `ERROR` lines into `errors.log`.

What to check:

- `tail -n`
- `tail -f`
- `grep`
- Redirection

## Exercise 15: Deployment-Style Workflow

Simulate a tiny deployment package inside `~/terminal-exam/release`.

Requirements:

- Create `release/current`.
- Create `release/shared`.
- Inside `release/current`, create:

```text
main.js
package.json
.env.example
```

- `main.js` must print `deployment ready`.
- `package.json` can be minimal valid JSON.
- `.env.example` must include `PORT=3000`.

Tasks:

- Archive `release/current` as `release-current.tar.gz`.
- Verify `PORT` exists using `grep`.
- Show the final directory tree.

What to check:

- Combined command fluency
- Editor usage
- `grep`
- Archive handling
- `find` or `tree` if installed

## Exercise 16: Troubleshooting Scenario

Give the student this situation:

- A file `nginx.conf` contains multiple server blocks.
- One block contains `server_name staging.example.com;`
- Another contains `server_name production.example.com;`

Tasks:

- Find which line contains `production.example.com`.
- Copy the file to `nginx.conf.bak`.
- Edit the production server name to `app.example.com`.
- Show the diff using available terminal tools.

What to check:

- `grep -n`
- `cp`
- `vim` or `nano`
- `diff` or similar comparison

## Exercise 17: Hard Multi-Step Linux Exercise

Scenario:

The student must prepare a simple Node-style app directory for a server.

Required final state:

```text
~/terminal-exam/project/
  src/
    main.js
  config/
    app.env
  logs/
    app.log
  backup/
```

Constraints:

- `main.js` must be written with `vim` or `nano`.
- `app.env` must contain:

```text
APP_NAME=project
APP_PORT=8080
APP_ENV=production
```

- `app.log` must contain at least 6 lines with mixed `INFO`, `WARN`, and `ERROR`.

Tasks:

- Find all files under `project`.
- Use `grep` to display only `ERROR` lines from `app.log`.
- Make a tar.gz backup of the whole `project` directory into `backup/`.
- Show file permissions for all files in `config/`.

What to check:

- End-to-end fluency
- Editor usage
- `grep`
- `tar`
- `find`
- `ls -l`

## Optional Advanced Tasks

Use these only for stronger students.

### Advanced 1: `sed`

Given a config file, replace all occurrences of `staging` with `production` using `sed`.

### Advanced 2: `awk`

From a log file, print only the first column or extract rows matching a pattern using `awk`.

### Advanced 3: `xargs`

Find all `.log` files and remove them in one pipeline using `find` and `xargs`.

### Advanced 4: Background Jobs

Start a process in the background, list jobs, bring it back to the foreground, and stop it.

## Examiner Notes

- `grep` is absolutely viable and should be included.
- `vim` and `nano` are also viable when the student is using their real Linux terminal, because you do not need to emulate them inside the app.
- These exercises are much better for real terminal assessment than for the in-browser fake terminal, especially editor-based tasks.
- For grading, assess both:
  - final filesystem/result correctness
  - command/tool fluency and whether the student chose reasonable commands

