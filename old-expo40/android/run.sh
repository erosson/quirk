#!/bin/bash

./gradlew ${1:-installDevMinSdkDevKernelDebug} --stacktrace && adb shell am start -n org.erosson.freecbt/host.exp.exponent.MainActivity
