#!/bin/bash -eux

# The GitHub hosted runners come with the ruby package installed by default, so trying to install the ruby package with this action will cause a conflict.
sudo apt-get purge -y ruby || true

sudo apt-get update
sudo apt-get install -y ca-certificates

sudo install -D -m0644 -oroot -groot $(dirname ${0})/sorah-ruby.gpg /usr/local/share/keyrings/sorah-ruby.gpg
echo "deb [signed-by=/usr/local/share/keyrings/sorah-ruby.gpg] https://cache.ruby-lang.org/lab/sorah/deb/ ${CODENAME} main" | \
    sudo tee /etc/apt/sources.list.d/sorah-ruby.list

echo -e "Package: src:ruby-defaults\nPin: version ${DEFAULTS_PACKAGE_VERSION}\nPin-Priority: 999" | \
    sudo tee /etc/apt/preferences.d/91-sorah-rbpkg-ruby-defaults
echo -e "\nPackage: src:ruby${RUBY_VERSION}\nPin: version ${RUBY_PACKAGE_VERSION}\nPin-Priority: 999" | \
    sudo tee -a /etc/apt/preferences.d/91-sorah-rbpkg-ruby-defaults

sudo apt-get update
sudo apt-get install -y --no-install-recommends \
    "ruby=${DEFAULTS_PACKAGE_VERSION}" \
    "ruby${RUBY_VERSION}=${RUBY_PACKAGE_VERSION}" \
    "libruby${RUBY_VERSION}=${RUBY_PACKAGE_VERSION}" \
    "ruby${RUBY_VERSION}-dev=${RUBY_PACKAGE_VERSION}" \
    "ruby${RUBY_VERSION}-gems=${RUBY_PACKAGE_VERSION}"
