# Git

### **Git Workflow Stages**

Working Directory -> Staging Area -> Local Repository -> Remote Repository

<details><summary>Remove old gitHub credentials</summary>

Control Panel > User Accounts > Manage your Credentials> Windows Credentials - Remove Github link under Generic Credential`

</details>

<details><summary>Git Workflow Commands</summary>

```bash
git --version

git update-git-for-windows

git ls-files

git rm <file_name>
git rm --cached <file_name>
git rm -r --cached <folder_name>

git mv <original_file_name> <rename_file_name>
git mv <file_name> <new_folder_name_or_path>

git init

git clone <github_repo_URL>

git pull origin <branch_name>
git pull --rebase

git remote -v
git remote add origin <remote_repo_URL>
git remote set-url origin <new_remote_repo_URL>

git add .
git add <file_name>
git add \*<file_extension>

git status
git status -s

git commit -m "<message>"

# Commit history
git log
git log --oneline --all --graph
git log --oneline --reverse

# Working directory ⟶ Staging area (index).
git diff
git diff <file_name>

# Staging area ⟶ Last commit (HEAD).
git diff --cached
git diff --cached <file_name>

# Two specific commits.
git diff <commit_hash1> <commit_hash2>
```

</details>

<details><summary>Git Branch</summary>

```bash
git branch

git branch <branch_name>

git switch -c <branch_name>
git checkout <branch_name>

git branch -d <branch_name>

git branch -m <current_branch_name> <new_branch_name>

git diff <branch_name>
git diff <branch1> <branch2>

git push -u origin <branch_name>
git push -d origin <branch_name>

# Lists remote-tracking branches
git branch -r

# Lists local branches
git branch -vv
```

</details>

<details><summary>Git Merge</summary>

- Fast-Forward merge, Non-Fast forward merge, 3-way merge, and Rebase

<p align="center">
  <img src="./assets/merge.png" alt="git merge" width="58%" />
  <img src="./assets/rebase.png" alt="git rebase" width="33%" />
</p>

```bash
git merge <branch_name>
git merge --no-ff <branch_name>

git rebase <branch_name>

git branch --merged
git branch -r --merged

git branch --no-merged
git branch -r --no-merged
```

</details>

<details><summary>Git reset</summary>

```bash
git reset --soft <commit_hash>
git reset --mixed <commit_hash>
git reset --hard <commit_hash>
```

**A → B → C → D → E (HEAD)**

Suppose you run: `git reset --soft C`

| Mode      | Commits msg/ hash D & E Deleted? | Code from D & E Present? | State of Working Dir |
| --------- | -------------------------------- | ------------------------ | -------------------- |
| `--soft`  | ✅ Yes                           | ✅ Yes (in staging)      | ✅ Same as E         |
| `--mixed` | ✅ Yes                           | ✅ Yes (Working Dir)     | ✅ Same as E         |
| `--hard`  | ✅ Yes                           | ❌ No                    | ⏪ Rolled back to C  |

</details>

<details><summary>Git Stash</summary>

- Git Stash allows you to store only the Staging area by default, so first we need to add to the Staging area, then stash.

```bash
git stash list

git stash push -m "<stash_message>"
git stash push -u -m "<stash_message>"
git stash push -a -m "<stash_message>"

git stash apply stash@{0}

git stash drop stash@{0}

git stash clear
```

</details>

<details><summary>Organising Commit History</summary>

```bash
git rebase -i <commit_hash>

pick => reword (edit the commit message)

pick => squash (meld into previous commit, and after that it ask new commit message)

pick => fixup (like "squash" but keep only the previous commit message, and it doesn't ask new commit message)
```

</details>

<details><summary>Git Tags</summary>

```bash
git tag

git tag <v1.0> <commit_hash>
git tag -d <v1.0>

git push origin <v1.0>
git push origin --delete <v1.0>
```

</details>

<details><summary>Git Release</summary>

A Git release is always tied to a Git tag, which serves as a marker/ version for a specific commit in your repository's history.

</details>

<details><summary>Cherry Pick</summary>

To copy the commit code into our current commit without merging.

```bash
git cherry-pick <commit_hash>
```

![image.png](./assets/cherry-pick.png)

</details>

<details><summary>Initial Setup</summary>

```bash
git config --global user.name <name>
git config --global user.name

git config --global user.email <email>
git config --global user.email
```

```bash
git config --global core.editor "code --wait"

git config --global core.autocrlf true
git config --global core.autocrlf input
```

#### **Git aliases** are like shortcuts for longer Git commands.

```powershell
git config --global -e

<alias>
    up = update-git-for-windows
    logs = log --oneline --all --graph
    s = status -s
```

</details>
