---
title: "A Gentle Intro to PLT"
date: 2018-06-10
---

Programming Language Theory (PLT) is an extremely rich subject with a relatively high bar to entry.
Most of the literature is written for a reader already well versed in the subject; it's hard to find
a tractable introduction. This post will take you through the construction of a simplistic toy
programming language (and an interpreter for it) from first principles. I assume no knowledge on
your part, aside from general programming experience.

## What's an interpreter? What's a compiler?

These two terms are often bandied around but not usually rigorously defined. Both are programs that
take as input programs written according to a given language specification. Both perform a series of
transformations on that input to produce a final result. Both share many similar stages: for example
(and as we will discuss soon), both will scan, parse, and typecheck the input. The difference is
that a compiler **translates** the input code into code written in another language. For example, C
compilers translate C code into assembly. Clojure and ClojureScript compile to JVM bytecode and
JavaScript, respectively. In contrast, an interpreter directly **executes** the input code. Some
popular interpreted languages are JavaScript, Python, and Ruby.

In this post, we will be building an interpreter. At least for the purposes of a first-principles
introduction, building an interpreter will be a simpler task, because we only have to keep one
language in mind.

## Building a language

Before we build a toy interpreter, we need a toy language! In the world of PLT, languages are
specified using a **concrete syntax**, which is a description of how syntactic terms in the language
are constructed. This is also known as a **grammar**, a **context-free grammar**, or a **BNF
grammar** (for [Backus-Naur form](https://en.wikipedia.org/wiki/Backus%E2%80%93Naur_form)). The
grammar completely defines the set of terms in the language. Consider the following grammar:

```
t ::= true
    | false
    | 0
    | (succ t)
    | (pred t)
    | (not t)
    | (and t t)
    | (or t t)
    | (if t then t else t)
```

The grammar is defined recursively: you should read a `t` as "any term". For example, we can write
things like `(succ (succ 0))`, but we can also write `(not (pred 0))`. This may seem unintuitive at
first: why would we allow our language to express nonsensical things? The answer is that the cost of
catching nonsensical expressions at the level of the grammar is far too high - we will instead rely
on the typechecker to catch such terms.

You may have also noticed that this is not a particularly powerful language. We can perform the
basic boolean operations; we can take the `succ` (successor) and `pred` (predecessor) of only the
natural numbers; and we have precisely one operation that can bridge across the two types (the `if`
statement). This is deliberate and done for the sake of simplicity: many language features that we
as programmers take for granted (e.g. variables and functions) turn out to be rather complex to
implement.

As previously discussed, an interpreter is a program that takes as input code written according to a
particular specification and evaluates it. There are many more steps between input and evaluation: a
typical interpreter will include (at minimum) a **scanner**, a **parser**, a **typechecker**, and an
**evaluator**. A real interpreter has many, many more phases - mostly to do with optimization - but
we'll ignore those for our purposes here. Let's discuss what each phase entails, with an eye towards
the type signatures of each function.

## The scanner

The **scanner** takes as input the actual text of the program (i.e. a `string`), and outputs a
**list of tokens**. A **token** is simply an in-program representation of each syntactic element in
the program's grammar. For our toy language, we might have the following declaration of the `token`
type:

```
datatype token = LParen
               | RParen
               | True
               | False
               | Zero
               | Succ
               | Pred
               | Not
               | And
               | Or
               | If
               | Then
               | Else
```

Notice that certain elements of the grammar that don't actually matter for the purposes of
evaluation - e.g. `Then` and `Else` - are included in the `token` type: the job of the scanner is
simply to translate a `string` into something simpler to work with.

Let's consider a few examples:

- `true` should scan to `True`.
- `(succ (succ 0))` should scan to `[LParen, Succ, LParen, Succ, Zero, RParen, RParen]`.
- `(if (succ true) then 0 else false)` should scan to
  `[LParen, If, LParen, Succ, True, RParen, Then, Zero, Else, False, RParen]`.
- `(succ shblah)` should raise a scan error, as `shblah` is not defined in the grammar.

Hopefully I've managed to communicate that the job of the scanner is quite simple; let's now move on
to the more complex parts of the interpreter.

## The parser

The **parser** takes as input a **list of tokens** (constructed by the scanner), and outputs an
**abstract syntax tree**, or **AST**. An **AST** is a complete representation of our program; it's a
structure that we can begin to evaluate.

The **AST** type might look something like this:

```
datatype ast = True
              | False
              | Zero
              | Succ of ast
              | Pred of ast
              | Not of ast
              | And of (ast * ast)
              | Or of (ast * ast)
              | If of (ast * ast * ast)
```

Throughout this post I've secretly been using Standard ML syntax to define these datatypes;
hopefully it's been transparent, but I think this definition bears some explaining. First of all,
let's examine `Succ of ast`: this means that the `Succ` term takes an additional term as an
argument. Knowing that `*` is the same as the Cartesian cross product, we can see that
`And of (ast * ast)` means that the `And` term takes a 2-tuple of terms.

Let's run through some parsing examples:

- `pred 0)` should raise a parse error, as the program is missing an opening left parenthesis.
- `(succ (succ 0))` should scan to `[LParen, Succ, LParen, Succ, Zero, RParen, RParen]`, which
  should parse to `Succ (Succ Zero)`.
- `(if true then 0 else false)` should scan to `[LParen, If, True, Then, Zero, Else, False]`, which
  should parse to `If (True, Zero, False)`.
- `(and true)` should scan to `[LParen, And, True, RParen]`, which should then raise a parse error,
  as the program is missing an argument.
- `(if true 0 (succ 0))` should scan to
  `[LParen, If, True, Zero, LParen, Succ, Zero, RParen, RParen]`, which should then raise a parse
  error, as the program is missing the required keywords (`then` and `else`).

The key point to understand here is that the parser transforms a token _list_ into a _single_ AST.

## The typechecker

The **typechecker** sounds simple enough. It takes as input an AST, and returns... What, exactly?
This is a rather confusing point. In the case of the typechecker, we don't really care about the
return value! The job of the typechecker is to try to assign **a** type to the program; we don't
care what that type is as long as no errors are raised.

It will be easier to first think about making a `typeof` function, that takes as input an AST and
returns its type. We now need a type datatype (often called `ty`), which for our toy language is
very short:

```
datatype ty = Nat
            | Bool
```

Type theory is an immensely rich subject. Parameterized types are extremely powerful; adding pair
and list types to a language is a great introduction to more advanced topics in typing. But for our
purposes, this will be enough complexity.

Now let's run through some examples of `typeof`. Below I will simply write down programs in the
concrete syntax, asking the reader to fill in the scanning and parsing phases:

- `(succ (succ 0))` should be assigned the type `Nat`.
- `(and true false)` should be assigned the type `Bool`.
- `(pred (succ true))` should raise a type error, because `succ` must take something of type `Nat`.
- `(if true then 0 else (succ 0))` should be assigned the type `Nat`.
- `(if (succ 0) then true else false)` should raise a type error, because the condition in an `if`
  must be of type `Bool`.
- `(if false then 0 else true)` should raise a type error, because the branches of an `if` must
  match in type.

This last error bears further discussion. You might be thinking, "well since the `if` condition is
false, why can't we just assign it the type of the `false` branch (i.e. `Bool`)? This is a common
pitfall. The full answer is that doing so would require us to evaluate the conditional term during
the typechecking phase. In our language this might be fine, but consider adding recursion or looping
to our language: what happens if we construct a term like `(if foo then 0 else true)`, where `foo`
loops forever? If we used this condition-evaluation strategy, we would loop forever in the
typechecking phase.

Finally, note that the actual typechecking function need not return the type of the program: the
interpreter doesn't care about the type of the program, it just cares that the program _can be_
assigned a type. A common pattern is to have the typechecker return the original AST in the case
that `typeof` succeeds, and to otherwise pass on any errors raised by `typeof`, like so:

```
fun typecheck t =
let
  val _ = typeof t
in
  t
end
```

### Type soundness

Before moving on, let's discuss **type soundness**. To prove that our language is type-sound, we
must prove that it satisfies two properties:

1. **Preservation**: if `t` is a term with type `T` and `t` steps to a term `t'`, then `t'` has type
   `T` as well.
2. **Progress**: if `t` is a term that can be assigned a type `T` and `t` is not a value, then there
   exists some term `t'` also of type `T`, such that `t` steps to `t'`.

Let's unpack these two properties to examine what exactly type soundness gives us. First of all,
there's some new terminology to discuss:

**Step** refers to the small-step evaluation relation that we will develop in the next section. As
an example, `(not (not true))` would step to `(not false)`, which would step to `true`.

**Value** refers to the concept of a **value class**, which we have not yet discussed. A value class
is an arbitrarily-defined subset of the grammar which the language designer has declared to be
acceptable results of evaluation. In our language, the logical value class is as follows:

```
nv ::= 0
     | (succ nv)

v ::= true
    | false
    | nv
```

So, both boolean constants are values, as well as any **n**umeric **v**alue that is composed _only_
of successors. We do this to avoid the ambiguity created by the fact that, say, `(succ (succ 0))`
and `(pred (succ (succ (succ 0))))` are both valid representations of the number 2.

Two final pieces of vocabulary: a **normal form** is a term that cannot be stepped on. All values
are normal forms, but so are things like `(succ true)`. That's what we call a **stuck term**; stuck
terms are simply non-value normal forms. What's important to note is that stuck terms actually
represent runtime errors: `(succ true)` is not a valid return value for any program, yet if we come
across it, we have no choice but to return it; it's a runtime error.

Let's now discuss each property of type soundness. Preservation tells us that terms cannot switch
types on us in the course of evaluation; I think this is fairly intuitive. Progress tells us
something very important: if a program passes the type checker, it evaluates to a _value_. Not a
normal form, a _value_. This is extraordinarily significant: it means that any program that passes
the typechecker is **free of runtime errors** (except logic errors like multiplying by 5 when you
meant to add 5, etc).

This is a massive boon to the programmer. Think back, when have you ever worked in an environment
like this? I know when I work in JavaScript, I have about 2% faith that any given piece of code I
write will work as intended on the first run. In a language with a proven type soundness theorem,
that percentage skyrockets, because most errors I make will be caught by the typechecker. As far as
I know, [Standard ML](https://www.smlnj.org/) and [Pony](https://www.ponylang.org/) are the only
"real" languages with proven type soundness theorems.

## The evaluator

The **evaluator**, the final step in our pipeline, is where the proverbial action happens. It takes
as input an AST, and returns another AST, representing the result of evaluating its input.

The evaluator uses a **small-step evaluation relation**, applied repeatedly, to arrive at its
result. The step function takes in an AST, and returns an AST _option_. For those of you unfamiliar
with the option type, it looks something like this:

```
datatype 'a option = Some of 'a
                   | None
```

Note that `'a` is a Standard ML type variable, read as "alpha". So for example, if we were dealing
with an `int option` type, we could have `Some 1`, or `None`.

So, why does `step` return an `ast option`? We want some way for `step` to indicate that you have
passed it a normal form, and that it has nowhere to go. So, in the case that `step` can actually
take a step, it returns `Some` of the resultant term. In the case that `step` cannot step on the
input, it returns `None`.

Evaluation, then, is just the repeated application of `step` until `step` returns `None`, at which
point you just return the input of `step`.

Let's run through some evaluation examples:

- `(and true (not false))` steps to `(and true true)`; which steps to `true`; which steps to `None`,
  signifying the end of evaluation.
- `(if (not false) then (succ 0) else 0)` steps to `(if true then (succ 0) else 0)`; which steps to
  `(succ 0)`; which steps to `None`, signifying the end of the evaluation.

## Putting it all together

Now that we have the phases of our interpreter built out, let's take a moment to remind ourselves of
their type signatures:

```
scan: string -> token list
parse: token list -> ast
typecheck: ast -> ast
eval: ast -> ast
```

Now, `interpret` is basically trivial:

```
fun interpret program = eval (typecheck (parse (scan program)))
```

Or, a bit more descriptively:

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

And that's basically it! Of course, we've only scratched the surface of possibilities here. Stay
tuned for a future post about using monadic programming to make this process more elegant. Discuss
on [lobste.rs](https://lobste.rs/s/lmbkha). Thanks for reading!
