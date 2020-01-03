---
title: "A Pair Programming Server"
date: 2019-01-30
---

Pair programming is awesome. I did a lot of it this past summer at Braintree, and I've tried to replicate the infrastructure here. Here's how pairing sessions go:

- You and your pair both SSH into the pair server.
- You each run the `pair-with` command with each other's usernames. For example, if `alice` is pairing with `bob`, she runs `pair-with bob` and he runs `pair-with alice`. These commands will attach them to a shared tmux session: they see the exact same screen, and they can both type.
- This works both in person (shoulder-to-shoulder) and remotely (over e.g. a slack call)!

Don't worry about your level of comfort with the command line or any of these tools - I'll explain things in increasing levels of complexity. But first....

## Architecture overview
The server lives at `timpanogos.mpc.sh`, accessed by SSH. To gain access, you'll need to provide me with:

- Your Github username (this will become your username on the server too)
- Your Github email (which will be your git author email on the server)
- Your SSH public key

After I create your account, you'll be able to log in to the server: `ssh username@timpanogos.mpc.sh`. Once you're in, you'll notice some cool things:

- Everyone will be using the same set of dotfiles, which you can find [on our github](github.com/uncommonhacks/dotfiles). To start, I've simply copied over my personal dotfiles and removed the personalized parts. One of the important pieces of the Braintee pairing experience was that everyone in the company (even those with strong opinions on dotfiles like myself) used the same set of shared dotfiles. This ensures everyone has a seamless pairing process.
- You're a member of the group `hackers`, which gives you full access to the `/shared` directory. In that directory you'll find pair directories for every pair of users on the system! Everyone has full access to every pair directory, so don't expect privacy and be on your honor to not mess with others' stuff.
- As described above, you can start pairing with someone by both SSHing into the server, and then each running the `pair-with` command with each others' usernames. Running the command will start up a shared tmux session in the pair's shared directory.
- Available editors are:
  - Neovim, aliased to `vim`. But if you've never used vim, don't fret! There's also...
  - Micro, runnable as `micro`, which should feel pretty familiar.

Finally, note that for web development you can use SSH's port forwarding feature to connect your host browser to the server.

That should be about it. If you need or want any software installed just ask me on Slack; there's an Arch Linux package for just about everything.

And if some or all of this doesn't make sense to you, don't worry a bit. I'm in the process of writing a more detailed setup guide, as well as primers for my tmux and (neo)vim configurations. Stay tuned!
