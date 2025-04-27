# sorah-rbpkg/actions

## Features

- Install Ruby packages from https://sorah.jp/packaging/debian/.
- Cache RubyGems installed with Bundler.

## Usage

See also [action.yml](action.yml)

### Basic

You can specify the Ruby version in the input `ruby-version`.

```yaml
steps:
  - uses: actions/checkout@v4
  - uses: sorah-rbpkg/actions@v2
    with:
      ruby-version: "3.2"
  - run: ruby app.rb
```

Packages with Ruby 2.7 or later are supported. Specify it as a string.

Note: Older Ruby versions are only available on older Ubuntu, and newer Ruby versions are only available on newer Ubuntu. The support matrix is roughly outlined in <https://github.com/sorah/config/blob/master/etc/debian-packages.txt>, but there're exceptions for some teeny versions.

### `.ruby-version` file support

You can install Ruby based on a file describing the Ruby version committed to a repository.
Specifying `ruby-version-file` behaves the same as specifying `ruby-version` with the contents of the file at the specified path.

```yaml
steps:
  - uses: actions/checkout@v4
  - uses: sorah-rbpkg/actions@v2
    with:
      ruby-version-file: .ruby-version
  - run: ruby app.rb
```

If you want to specify `.ruby-version` in `ruby-version-file`, you can omit the input. Neither `ruby-version` nor `ruby-version-file` should be specified.

```yaml
steps:
  - uses: actions/checkout@v4
  - uses: sorah-rbpkg/actions@v2
  - run: ruby app.rb
```

## Bundler cache

This action allows you to automatically install, cache, and restore dependencies specified in your Gemfile.
To use this feature, you need to pre-generate Gemfile.lock and commit it to your repository. Then specify the input `bundler-cache` to true.

```yaml
steps:
  - uses: actions/checkout@v4
  - uses: sorah-rbpkg/actions@v2
    with:
      bundler-cache: true
  - run: bundle exec ruby app.rb
```

## Ruby package version

You can explicitly specify the Ruby package version using the input `ruby-package-version`.

```yaml
steps:
  - uses: actions/checkout@v4
  - uses: sorah-rbpkg/actions@v2
    with:
      ruby-version: "3.1"
      ruby-package-version: 3.1.3-0nkmi1~jammy
  - run: bundle exec ruby app.rb
```
