# tomasbasham.github.io ![test](https://github.com/tomasbasham/tomasbasham.github.io/test/badge.svg?event=push)

A portfolio and platform for my professional experiences and personal projects.
The website may be reached at
[https://tomasbasham.dev](https://tomasbasham.dev).

## Prerequisites

You will need the following things properly installed on your computer:

- [Git](https://git-scm.com/)
- [Ruby](https://www.ruby-lang.org/en/)
- [Node.js](https://nodejs.org/en/)

## Installation

- `git clone <repository-url>` this repository
- `cd tomasbasham.github.io`

## Running / Development

- `bundle exec jekyll serve --watch`
- Visit the application at [http://localhost:4000](http://localhost:4000).

### Running Tests

- `bundle exec rspec`

### Building

- `bundle exec jeykll build`

### Composing New Documents

New posts can be created as drafts using the following command:

- `bundle exec jekyll compose --draft NAME`

When run a new file will be created in the `_drafts` directory. This directory
is ignored when the website is built unless explicitly included using the
`--drafts` flag.

### (Un)Publishing Documents

To more conveniently move posts to and from the `_drafts` directory there are
two commands that may be issued:

- `bundle exec jekyll publish _drafts/NAME`
- `bundle exec jekyll unpublish _posts/NAME`

Only posts within the `_posts` directory are included in the final build of the
website unless the `--drafts` flag is included in the build command.

## Further Reading / Useful Links

- [Jekyll](https://jekyllrb.com/)
