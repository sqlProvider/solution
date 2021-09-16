# Third-party dependencies fetched by Bazel
# Unlike WORKSPACE, the content of this file is unordered.
# We keep them separate to make the WORKSPACE file more maintainable.

# Install the nodejs "bootstrap" package
# This provides the basic tools for running and packaging nodejs programs in Bazel
load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")
def fetch_dependencies():
    http_archive(
        name = "build_bazel_rules_nodejs",
        sha256 = "b32a4713b45095e9e1921a7fcb1adf584bc05959f3336e7351bcf77f015a2d7c",
        urls = ["https://github.com/bazelbuild/rules_nodejs/releases/download/4.1.0/rules_nodejs-4.1.0.tar.gz"],
    )
