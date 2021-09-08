# Package Info
package(default_visibility = ["//visibility:public"])

# Imports
load("@build_bazel_rules_nodejs//:index.bzl", "nodejs_binary")
load('//tools:package.bzl', 'sn_package')
load("@npm//@bazel/typescript:index.bzl", "ts_library")

sn_package(
    name = "core"
)

nodejs_binary(
    name = "core-bin",
    entry_point = "index.ts",
    link_workspace_root = True,
    data = [
	    ":core"
    ],
)

