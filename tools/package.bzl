# Imports
load("@npm//@bazel/typescript:index.bzl", "ts_library")
load("@build_bazel_rules_nodejs//:index.bzl", "pkg_npm")
load("@npm//@bazel/jasmine:index.bzl", "jasmine_node_test")
load("//tools:defs.bzl", 
    "SOLUTION_PACKAGE_NAME",
    "TYPESCRIPT_PRODMODE_TARGET",
    "TYPESCRIPT_DEVMODE_TARGET",
    "TYPESCRIPT_PRODMODE_MODULE",
    "TYPESCRIPT_DEVMODE_MODULE"
)

def sn_package(name, deps = [], srcs = None, test_srcs = None):
    module_name = SOLUTION_PACKAGE_NAME + "/" + name
    module_source = name + "_source"
    module_spec_source = name + "spec_source"
    module_spec = name + "_spec"
    module_spec_bin = module_spec + "_bin"
    deps = deps + [
        "@npm//tslib"
    ]
    spec_deps = deps + [
        "@npm//@types/jasmine",
    ]

    native.filegroup(
        name = module_source,
        srcs = native.glob(
            include = ["**/*.ts"],
            exclude = ["**/*.spec.ts"]
        ) if not srcs else srcs
    )

    native.filegroup(
        name = module_spec_source,
        srcs = native.glob(
            include = ["**/*.ts"],
        ) if not test_srcs else test_srcs
    )

    ts_library(
        name = name,
        module_name = module_name,
        package_name = module_name,
        srcs = [module_source],
        deps = deps,

        prodmode_target = TYPESCRIPT_PRODMODE_TARGET,
        devmode_target = TYPESCRIPT_DEVMODE_TARGET,
        prodmode_module = TYPESCRIPT_PRODMODE_MODULE,
        devmode_module = TYPESCRIPT_DEVMODE_MODULE,
    )

    ts_library(
        name = module_spec,
        module_name = module_name,
        package_name = module_name,
        srcs = [module_spec_source],
        deps = spec_deps,
        tsconfig = "//:tsconfig.spec.json",

        prodmode_target = TYPESCRIPT_PRODMODE_TARGET,
        devmode_target = TYPESCRIPT_DEVMODE_TARGET,
        prodmode_module = TYPESCRIPT_PRODMODE_MODULE,
        devmode_module = TYPESCRIPT_DEVMODE_MODULE,
    )

    jasmine_node_test(
        name = module_spec_bin,
        srcs = [module_spec],
    )



