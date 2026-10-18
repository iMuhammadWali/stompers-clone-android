#!/usr/bin/env bash
set -eu
project_dir="$(cd "$(dirname "$0")/.." && pwd)"
classes_dir="$(mktemp -d)"
trap 'rm -rf "$classes_dir"' EXIT
javac -d "$classes_dir" "$project_dir"/modules/stride-steps/android/src/main/java/expo/modules/stridesteps/*.java "$project_dir"/modules/stride-steps/android/src/test/java/expo/modules/stridesteps/CoreChecks.java
java -cp "$classes_dir" expo.modules.stridesteps.CoreChecks
