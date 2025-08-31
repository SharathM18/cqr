# Linux Commands

<details>
<summary>Directory Navigation</summary>

- `pwd` – Print working directory
- `cd <directory>` – Change directory
- `cd ..` – Go up one level
- `cd ~` – Go to the home directory
- `cd -` – Go to the previous directory

</details>

<details>
<summary>Listing Files</summary>

- `ls` – List files and directories
- `ls -l` – Long format
- `ls -a` – Show hidden files

</details>

<details>
<summary>Directory & File Management</summary>

- `mkdir <dirname>` – Create a directory
- `rm <filename>` – Remove file
- `rm -r <dirname>` – Remove directory and contents
- `rm -f <dirname>` – Force remove without confirmation
- `cp <source> <dest>` – Copy files
- `mv <source> <dest>` – Move or rename files

</details>

<details>
<summary>Viewing File Content</summary>

- `cat <filename>` – Display file contents
- `less <filename>` – View with pagination
- `head <filename>` – Show first 10 lines
- `tail <filename>` – Show last 10 lines
- `tail -f <filename>` – Follow file updates in real-time

</details>

<details>
<summary>Searching & Comparison</summary>

**Redirection & Pipes**

- `>` – Redirect output (overwrite)
- `>>` – Append output
- `command | grep <pattern>` – Pipe output to `grep`
- `command | grep <pattern> > <file>` – Save filtered output to a file
  - Example: `cat access.log | grep "404" > errors.txt` # Save 404 errors to file

**`grep` – Global Regular Expression Print**

- `grep <pattern> <file>` – Search for lines matching a pattern
  - Example: `grep "error" logs.txt`
- `grep -i <pattern> <file>` – Case-insensitive search
  - Example: `grep -i "warning" logs.txt`
- `grep -r <pattern> <directory>` – Recursively search in the directory
  - Example: `grep -r "timeout" ./logs`

**`diff`**

- `diff <file1> <file2>` – Compare two files

</details>

<details>
<summary>Word & Line Count (`wc`)</summary>

- `wc <file>` – Count lines, words, and bytes
- `wc -l  <file>` – Print the number of lines
- `wc -w  <file>` – Print the number of words
- `wc -m  <file>` – Print the number of characters

</details>

<details>
<summary>File Search (`find`)</summary>

**Common Options**

- `name` – Match by name
- `iname` – Case-insensitive name match
- `type` – Filter by file (`f`) or directory (`d`)
- `size` – Filter by file size
- `mtime` – Match by modified time (in days)

**Examples**

```bash
find . -name "*.log"                   # Find all .log files from current dir
find . -iname "*.txt"                  # Find all .txt/.TXT files
find / -type d -name "backup"          # Find all directories named 'backup'
find . -type f -size +100M             # Find files larger than 100MB
find ~ -type f -mtime -7               # Files modified in last 7 days

. - Current directory
/ - Root directory (filesystem root)
~ - Home directory of the current user
```

</details>

<details>
<summary>File Permissions</summary>

**Format:** `rwx rwx rwx` (Owner | Group | Others)

- `r` (4): Read permission
- `w` (2): Write permission
- `x` (1): Execute permission

**Common `chmod` Examples**

- `chmod 755 <file/dir>` – Owner: all; Group/Others: read/execute
- `chmod 644 <file/dir>` – Owner: read/write; Group/Others: read only
- `chmod 700 <file/dir>` – Owner: full access; Group/Others: no access

</details>

<details>
<summary>Vim Text Editor</summary>

- `vim <filename>` – Open the file in Vim
- Press `i` to enter _Insert mode_
- Press `ESC` to exit _Insert mode_
- `:w` – Save the file
- `:q` – Quit (only if no changes were made)
- `:q!` – Quit without saving
- `:wq` – Save and quit

</details>

<details>
<summary>Command History</summary>

- `history` – Show command history

</details>

<details>
<summary>Package Management (`apt`)</summary>

- `apt list --installed` – Show installed packages
- `apt update` – Update package list
- `apt install <pkgname>` – Install a package
- `apt remove <pkgname>` – Remove a package
- `apt upgrade` – Upgrade all packages

</details>

<details>
<summary>System Information</summary>

- `uname -a` – Display all system info (kernel, release, machine, etc.)
- `lsb_release -a` – Show OS version details

</details>
