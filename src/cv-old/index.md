---
layout: "default"
title: "CV"
---

<style>
	{% include "./cv.css" %}
</style>

# Mark Cohen

I'm a generalist software engineer with particular expertise in web development and language
standards.

<section>

## Ethics

I firmly believe that it is impossible for technology to be neutral or apolitical; the conditions of
society and of the workplace are written into the systems we build and the ways we interact. As an
engineer, it is my responsibility to ensure that the systems I build cannot be weaponized to do
harm. Similarly, it is incumbent on me to actively uplift those whom the status quo marginalizes and
oppresses, be they coworkers or users. These principles are inviolable and take absolute precedence
in all cases.

</section>

<section>

## Skills

I approach every endeavor with compassion and trust. Understanding and focusing on these emotional
states allows me to be a better teammate and deliver better work.

I am a natural collaborator. I excel in pair and group environments, and I work to improve the
spaces I occupy for other participants. This pays dividends not just in engineering contexts, but
also in contexts of advocacy and allyship.

I have cultivated a healthy formal rigor that allows me to efficiently analyze and correctly model
complex systems. While very powerful, this perspective must be tempered with pragmatism, and I
constantly strive to strike that balance.

</section>

## Open-source

<section>

### Ecma TC39

_September 2019 - Present_

I currently serve as a co-champion for the
[pattern matching proposal](https://github.com/tc39/proposal-pattern-matching), designing the
proposal's syntax, semantics, and formal specification. I helped found and currently facilitate the
[inclusion group](https://github.com/tc39/inclusion-group), which works to create a more inclusive
committee environment.

</section>

<section>

### Self-Defined

_April 2021 - Present_

I currently serve as a community leader for [Self-Defined](https://selfdefined.app), where I help
with community moderation and organization. I'm also driving the project's architecture forward, so
that it can evolve beyond a static website into a more interactive source.

</section>

<section>

### Miscellaneous

I've landed small patches in [WebKit](https://bugs.webkit.org/show_bug.cgi?id=217879) and
[jsparagus](https://github.com/mozilla-spidermonkey/jsparagus/pull/564). Both of these were part of
an ongoing effort to learn about the current state of the various JavaScript engines in the world.

</section>

## Experience

<section>

### Slack

_January 2021 - September 2021_

I worked on the Desktop Foundations team, in the layer between [Electron](https://electronjs.org)
and the web. I overhauled our handling of user preferences in the name of robustness and security,
and built out new features to handle external configuration. I addressed cross-cutting security
concerns from the desktop app, and resolved long-standing inconsistencies and technical debt.

</section>

<section>

### Braintree / PayPal

_June - August 2018 (Intern), August 2019 - December 2020 (Full-time)_

At Braintree, I designed and built a React component library and accompanying Redux flow for
internationalizing the new merchant control panel. In parallel, I spearheaded the creation of a
cross-organization pipeline for converting English design copy into a set of localized string
bundles.

I implemented a continuous delivery process for the new merchant control panel, as well as the other
invisible applications owned by the team.

I built a type-safe data model for the new frontend disputes view, and in the process uncovered
deeper inconsistencies in adjacent models.

I led an effort to scrub our documentation of racist `whitelist / blacklist` terminology.

At PayPal, I worked on a React component library to improve the ease of integrating with PayPal's
smart payment buttons in React apps. I also worked on adding Apple Pay to the PayPal JavaScript SDK.

</section>

<section>

### University of Chicago - Bachelor's Thesis

_January - June 2019_

I built a type-sound, purely functional [programming language](https://github.com/mpcsh/ForML)
capable of imperative-style iteration, through the use of type classes and associated types. The
work culminated in a
[formal analysis of the language](https://github.com/mpcsh/ForML/blob/main/paper.pdf) and a
[proof-of-concept interpreter](https://github.com/mpcsh/ForML/tree/main/compiler), and was
[presented to an audience](https://www.youtube.com/watch?v=n8rnVjCZ570) of Department of Computer
Science students and professors. I also discovered and rectified an incompleteness in the type
inference algorithm in Wadler & Blott's seminal presentation of type classes.

_Advisor: [Adam Shaw](http://people.cs.uchicago.edu/~adamshaw)_

</section>

<section>

### University of Chicago - Teaching Assistant

_January 2018 - June 2019_

I served as a teaching assistant under [Borja Sotomayor](http://people.cs.uchicago.edu/~borja) for
the inaugural offerings of Introduction to Software Engineering, where I acted as a tech lead to
teams of students as they developed a major piece of software. In 2018, teams developed
[a library for prefix trees in Redis, and an accompanying suite of applications](https://github.com/cmsc22000-project-2018).
In 2019, teams developed interlocking components of
[a text adventure game engine](https://github.com/uchicago-cs/chiventure).

I also staffed two quarters of Networks and one quarter of Computer Science with Applications, where
I held office hours for students, supervised undergraduate graders, and helped overhaul course
projects.

</section>

<section>

### Keybase

_June - September 2017 (Intern)_

I wrote a [standard implementation](https://github.com/keybase/node-saltpack) of the
[SaltPack 1.0](https://saltpack.org) message encryption format and associated libraries for
[stream encoding](https://github.com/keybase/node-armor-x) and
[stream chunking](https://github.com/keybase/node-chunk-stream).

</section>

<section>

## Education

I graduated from the University of Chicago in June 2019 with a BSc in Computer Science. Below is a
selection of particularly important courses that I took during my time there.

- Programming Languages: I implemented a series of successively more complex interpreters for small
  programming languages, and studied the fundamentals of language theory and type theory. At my own
  direction, I engaged in deeper study on parser implementation.
- Networks: I studied the theory and implementation of the data link, network, and transport layers
  of the Internet. I implemented an IRC server, TCP, and IPv4 - each directly from their IETF
  specifications - with a classmate partner.
- Cryptography: I studied the mathematical foundations of modern cryptographic algorithms and their
  security guarantees, and implemented several major cryptographic attacks.
- Advanced Distributed Systems: I studied the theory behind the foundational distributed consensus
  and message-passing algorithms. I implemented [Raft](https://raft.github.io) from its
  specification with two classmates.
- Usable Security & Privacy: I studied the principles of human-computer interaction and privacy in
  the context of application and system design. I completed an IRB-approved human subjects research
  study on the usability of cryptokey verification protocols in popular secure messaging apps with
  three classmates.

</section>
