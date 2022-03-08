---
title: "Monads Made Simple"
date: 2018-07-08
---

Monadic programming is something I've run across often but never understood. And really, how could
anyone? Just [take a look](https://wiki.haskell.org/Monad) at the Haskell Wiki's description.
Haskell's `Control.Monad` class is easily the most widespread use of monadic programming, and yet
this wiki page is impossible to understand if you don't already understand it. The Haskell Wiki
maintainers even admit as much right in the page:

> Monads are known for being deeply confusing to lots of people, so there are plenty of tutorials
> specifically related to monads. Each takes a different approach to Monads, and hopefully everyone
> will find something useful.

In this post, we'll build on the interpreter discussed in
[my previous post](https://mpc.sh/blog/a-gentle-intro-to-plt). Make sure to read that one first if
you haven't yet. As before, I assume no knowledge on your part, aside from general programming
experience.

## Let's talk error handling

In my previous post, I outlined several places where errors should occur. For example, input that
doesn't match the concrete syntax would raise a scan error. What I didn't discuss is how exactly
those errors should be raised! This is the primary topic of today's post.

Let's discuss some easy methods, taking stock of the advantages and disadvantages of each.

### Exceptions

The first and simplest approach is to just raise exceptions whenever errors occur. This has the
advantage of not affecting any other parts of our program: in all sensible languages, exceptions are
implemented as a sort of "chameleon" type, which makes them valid return values for any function.
That is to say, we don't have to modify the types of any of our functions. Furthermore, downstream
parts of the interpreter don't have to worry about upstream errors. To better illustrate this point,
let's recall the `interpret` function:

```
fun interpret program =
let
  val tokens = scan program
  val ast = parse tokens
  val checked-ast = typecheck ast
  val result = eval checked-ast
in
  result
end
```

Now, let's suppose that we call `interpret` on the program `123|$^!`, which is undefined in our
concrete syntax. So, `scan` should raise a scan error. But the downstream functions (`parse`,
`typecheck`, and `eval`) don't have to worry about this case: unhandled exceptions immediately
terminate the interpreter. Thus, the raise-exceptions approach allows us to write each phase of the
interpreter under the assumption that the previous phase succeeded.

We've actually already discussed the main disadvantage of this approach; it's the fact that
unhandled exceptions immediately terminate the interpreter. With this approach, it's impossible to
do things like print out extra context, suggest possible remedies, or underline the relevant piece
of source code when an error occurs. This is a pretty big drawback; an interpreter that is unable to
provide useful output is pretty unusable for any kind of serious development.

### Exceptions with handling

A small modification to the above approach is to handle any exceptions in the `interpret` function.
This solves the problem of being unable to do anything once an exception is raised, but now,
`interpret` suddenly becomes really messy:

```
fun interpret program =
let
  val tokens = (scan program) handle (ScanError msg) => ...
```

I'll let you imagine what the rest of the function might look like, but hopefully it's clear that
this approach heavily pollutes the top level of the interpreter.

## A better approach

Let's take a minute to conceptualize exactly what we're trying to accomplish with our error
handling. We want a way for a given phase of the interpreter to either succeed or fail. In the
success case, we want to transparently pass the result to the next phase; in the failure case, we
want to gracefully print out a message. Let's define an abstract type that satisfies this model.

### Attempts

Consider the following Standard ML type definition:

```
datatype 'a attempt =
    Success of 'a
  | Failure of string
```

First, let's unpack a bit of the Standard ML syntax here. Read aloud, `'a` is "alpha", and it
represents a generic type variable. Standard ML writes its composed types in the reverse order of
most languages, so this definition gives us types like:

- `string attempt`
- `int attempt`
- `int list attempt`
- `bool attempt list`
- etc.

Then, let's discuss the anatomy of an `attempt`. For a given type, say `bool`, we can have either a
`Success of bool` or a `Failure of string`. So, the following are valid `bool attempt`s:

- `Success true`
- `Failure "error!"`
- `Success (not (not false))`
- `Failure "another error!"`

So let's return to the first part of the approach we're trying to model:

> We want a way for a given phase of the interpreter to either succeed or fail.

We can now completely solve this by simply modifying the type signatures of each phase. Let's recall
the old type signatures from the previous post:

```
scan: string -> token list
parse: token list -> ast
typecheck: ast -> ast
eval: ast -> ast
```

Now, all we need to do is stick `attempt` on the end:

```
scan: string -> token list attempt
parse: token list -> ast attempt
typecheck: ast -> ast attempt
eval: ast -> ast attempt
```

So, for example, a successful call to `scan` might return something like
`Success [LParen, Succ, Zero, RParen]`, whereas a scan error might return something like
`Failure "Scan error: invalid identifier 198asldfk"`.

So we've taken care of the first part of the model: allowing a given phase of the interpreter to
succeed or fail. The real magic comes when we compose these functions.

### Composed attempts

Let's recall the second part of the model:

> In the success case, we want to transparently pass the result to the next phase; in the failure
> case, we want to gracefully print out a message.

First, we could of course do something like the following:

```
fun interpret program =
let
  val tokens? = scan program
  val ast? = (case tokens?
                of Success tokens => parse tokens
                 | Failure msg => Failure msg)
  ...
```

But, as you may have noticed, this approach becomes messy really fast. However, we can actually
neatly abstract this approach into something much more powerful.

Let's shift gears a little bit and look at the model again. We want a function that allows us to
compose the result of one phase with the next phase. What would the type signature of this function
be? I encourage you to pause here and try working it out on your own - struggling through this type
signature was 2/3 of the battle for me.

So, without further ado:

```
fun continueIfPossible
  (att: 'a attempt) (f: 'a -> 'b attempt) : 'b attempt
```

Let's discuss this signature a bit. This function takes two arguments: an `'a attempt`, and a
function that takes an `'a` (read: "alpha") and returns a `'b attempt` (read: "beta attempt"). Then,
its return type is `'b attempt`, the same as the function it takes in. The crucial connection here
is that each phase of our interpreter satisfies the type signature of the function argument `f`,
that is, `'a -> 'b attempt.` Notice, in the case of `scan`, `'a` is `string` and `'b` is
`token list`. Then, in the case of `parse`, `'a` is `token list` and `'b` is `ast`.

Now, let's just pull out the messy part of our above attempt (no pun intended) at writing
`interpret` to make the body of `continueIfPossible`:

```
fun continueIfPossible att f =
  (case att
     of Success x => f x
      | Failure msg => Failure msg)
```

This function satisfies our whole model. The `attempt` type allows each phase of the interpreter to
succeed or fail, and the `case` statement supports continuing the computation in the success case or
gracefully printing an error message in the failure case (by simply propagating that error message
along). Let's define a bit of syntactic sugar...

```
infix >>=
fun att >>= f = continueIfPossible att f
```

...and watch the magic happen.

```
fun compile program =
  (Success program) >>= scan >>= parse >>= typecheck >>= eval
```

## So... what's a monad?

First, regarding the above example, I encourage you to check on your own that the types work out
here; that exercise was the last step for me in truly understanding monadic programming.

Now, while I've gone through this whole post without discussing what a monad is, I haven't neglected
to use them. In functional programming parlance, the `attempt` type, together with the
`continueIfPossible` function is a monad (one would say that together, the two are "the attempt
monad"). Strictly speaking, a monad is any one of an infinite number of similar type definitions and
associated composition rules. I find this definition completely unhelpful; even now, articles and
wiki pages on monads are extremely dense to me. I think it's more helpful to think instead of
monadic _programming_, which is merely the style of programming that builds computations in a
similar manner to what we've done here.

## Where would I ever use Standard ML in the real world?

Okay, you got me there. I can't say that any of these definitions are directly useful; pure
functional languages (let alone Standard ML) are rare enough as it is. However, I've found the
pattern of thought that goes into designing a monadic program to be extremely useful, even outside
of pure-functional contexts. Hopefully you'll be able to use this knowledge to similar ends.

Discuss on [lobste.rs](https://lobste.rs/s/1hnbx5). Thanks for reading!
