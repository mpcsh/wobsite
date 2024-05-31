---
title: Command Line Basics
date: 2024-05-09
---

## The filesystem as a tree
On every computer is at least one (sometimes several!) filesystem(s). A filesystem is a hierarchical structure of directories (also called folders) and files, with a few important properties.

A **file** is a piece of data recorded in some specific format. Think plain text, PDFs, images, videos, Word documents and PowerPoints, etc.

A **directory** is a container that can hold both more directories (**sub**directories) and files.

A filesystem has one **root directory**, which is the top of the hierarchy.

From here on, any time you see the word **node**, know that that can refer to either a file or a directory.

## Anatomy of a terminal
- Prompt
- CWD
- REPL

## Paths
Many terminal commands accept **paths** as arguments. A path is a string of characters that describes a node on the filesystem. Paths can take quite a few forms!

An **absolute path** is the complete description of a node's location on the filesystem, starting from the root. Absolute paths start with a `/`, and might look like:
- `/`
- `/Users`
- `/Users/mpcsh/projects/really_important_data.txt`

A **relative path** is a path that is only valid within the context of your current working directory.

- `~`
- `.`, `..`

## Moving around the filesystem
`pwd`: Print Working Directory. Recall that a shell session always has a folder open; this shows you its full path.

`cd`: Change Directory. If called with no argument, `cd` will take you to your home directory (`~` for short). If called with a path, like `cd ~/projects`, `cd` will take you to the specified directory.

`ls`: LiSt contents of directory. If called with no argument, `ls` will show you the contents of your current working directory (which you can see by calling `pwd`). If called with a path, like `ls /etc`, `ls` will show you the contents of the specified directory.

## Keyboard shortcuts
`Tab`: Autocomplete. Especially useful when typing longer command names or writing paths. If there are multiple matches, you can use `Tab` / `S-Tab` to cycle through them, and `Enter` / `Esc` to confirm / cancel your selection.

`Up` / `Down`: Cycle through command history.

`C-r`: History search.

`C-l`: Clear screen. You'll get a fresh prompt at the top of the window, and any previous contents are moved up, accessible via scrollback.
