# Package Info
package(default_visibility = ["//visibility:public"])

# Imports
load("@build_bazel_rules_nodejs//:index.bzl", "nodejs_binary")
load("@npm//@bazel/typescript:index.bzl", "ts_library")
load('//tools:package.bzl', 'sn_package')

sn_package(
    name = "core",
    deps = [
        "@npm//reflect-metadata"
    ]
)

nodejs_binary(
    name = "core_bin",
    entry_point = "index.ts",
    link_workspace_root = True,
    data = [
	    ":core"
    ],
)

